// ==UserScript==
// @name         twitter-fix
// @namespace    twitter-fix
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      https://twitter.com/*
// @include      https://mobile.twitter.com/*
// @require       https://greasyfork.org/scripts/419167-ajax-hook-cc/code/ajax-hook-cc.js?version=884718
// @run-at        document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/421655/twitter-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/421655/twitter-fix.meta.js
// ==/UserScript==


(async function(){
  if(unsafeWindow.top != unsafeWindow.self){
    return
  }

  if(!document.cookie.match(/twid=u%3D(.*?)(;|$)/)){
    return
  }
  
  const myid = document.cookie.match(/twid=u%3D(.*?)(;|$)/)[1]
  
  const Config = {
    BLOCK_TIPS: "🚫",
    GHOST_TIPS: "👻"
  }

  const BlockSet = new Set()

  function getValue(obj,path){
    if(obj === undefined){
      return undefined
    }
    let paths = Array.isArray(path)?path:path.split('.')
    let tmp = obj
    while(paths.length > 0){
      tmp = tmp[paths[0]]
      if(typeof tmp !== 'object' && tmp !== null && paths.length > 1){
        return undefined
      }
      paths.shift()
    }
    return tmp
  }

  function setValue(obj,path,value){
    let paths = path.split('.')
    let lastKey = paths.splice(paths.length-1,1)
    let tmp = getValue(obj,paths)
    if(typeof tmp === 'object' && tmp !== null){
      tmp[lastKey] = value
    }
  }

  /**
   * 传入entry或者addToModule查找出现的tweetid
   * 支持conversationThread和tweet
   * 返回的是数组
   * @param {*} entry
   */
  function findTweetId(entry){
    const result = [
      getValue(entry,'content.item.content.tweet.id'),
      getValue(entry,'item.content.tweet.id')
    ]
    if(Array.isArray(getValue(entry,'content.timelineModule.items'))){
      getValue(entry,'content.timelineModule.items').forEach((item)=>{
        result.push(getValue(item,'item.content.tweet.id'))
      })
    }
    return result.filter((a)=>{return a})
  }

  startHookXHR_timeLineFix()
  startHookXHR_userTimeLineFix()
  startHookXHR_GlobalObjectsUserInfoFix()

  function startHookXHR_GlobalObjectsUserInfoFix(){
    unsafeWindow.AjaxHook.XHRHook.push({
      testUrl: /\.json\?/,
      onResponse(response,handler){
        try{
          if(response.response){
            const data = JSON.parse(response.response)
            if(data.globalObjects && data.globalObjects.users){
              for(let uid of Object.keys(data.globalObjects.users)){
                if(BlockSet.has(String(uid))){
                  console.log(`匹配到已block的id：${uid}`)
                  console.log(data.globalObjects.users[uid])
                  if(!data.globalObjects.users[uid].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                    data.globalObjects.users[uid].name = `[${Config.BLOCK_TIPS}]${data.globalObjects.users[uid].name}`
                  }
                }
                if(data.globalObjects.users[uid].blocked_by){
                  data.globalObjects.users[uid].blocked_by = false
                  if(!data.globalObjects.users[uid].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                    data.globalObjects.users[uid].name = `[${Config.BLOCK_TIPS}]${data.globalObjects.users[uid].name}`
                  }
                }
              }
            }
            response.response = JSON.stringify(data)
          }
        }catch(e){
          console.error(e)
          console.error(response)
        }
        return response
      }
    })
    unsafeWindow.AjaxHook.XHRHook.push({
      testUrl: /users\/lookup\.json\?/,
      onResponse(response,handler){
        try{
          if(response.response){
            const data = JSON.parse(response.response)
            for(let user of data){
              if(user.blocked_by){
                if(!user.name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                  user.name = `[${Config.BLOCK_TIPS}]${user.name}`
                }
              }
            }
            response.response = JSON.stringify(data)
          }
        }catch(e){
          console.error(e)
          console.error(response)
        }
        return response
      }
    })
  }

  function startHookXHR_timeLineFix(){
    // 推文
    unsafeWindow.AjaxHook.XHRHook.push({
      testUrl: /i\/api\/2\/timeline\/conversation\/\d+\.json/,
      async onResponse(response,handler){
        try{
          const data = JSON.parse(response.response)
          let entries = data.timeline.instructions.find((item)=>{
            return item.addEntries || item.addToModule
          })
          const guestResponse = JSON.parse(await unsafeWindow.TwitterAPI.guestGet(response.config.url))
          console.log('guestResponse',guestResponse)
          console.log('fix-response',data)
          let guestEntries = guestResponse.timeline.instructions.find((item)=>{
            return item.addEntries || item.addToModule
          })

          entries = getValue(entries,'addEntries.entries') || getValue(entries,'addToModule.moduleItems')
          guestEntries = getValue(guestEntries,'addEntries.entries') || getValue(guestEntries,'addToModule.moduleItems')

          if(entries && guestEntries){
            const needReplaceSortIndex = { // 目标推文往上的推文 tweet-\d+
              // path : sortIndex
            }
            const needReplaceTweetId = { // 目标推文往下的推文 conversationThread-\d+
              // path : {
              //   conversationThreadId: entry.entryId,
              //   tweetStrId: sonEntry.entryId,
              //   sortIndex: entry.sortIndex
              // }
            }
            const addModuleReplaceTweetId = { // 目标推文往下的推文的更多回复选项
              // index : tweetId（tweet-\d+）
              // index是moduleItems数组里面的索引号
            }
            for(let i=0;i<entries.length;i++){
              let entry = entries[i]
              if(/tombstone/.test(entry.entryId) && !getValue(entry,'content.item.content.tombstone.tweet')){
                console.log(`发现墓碑[${entry.entryId}][${entry.sortIndex}]`)
                needReplaceSortIndex[String(i)] = entry.sortIndex
              }
              if(/conversationThread/.test(entry.entryId)){
                let sonEntrise = getValue(entry,'content.timelineModule.items')
                if(sonEntrise){
                  for(let k=0;k<sonEntrise.length;k++){
                    let sonEntry = sonEntrise[k]
                    if(/tweet/.test(sonEntry.entryId) && getValue(sonEntry,'item.content.tombstone')){
                      console.log(`发现子串中的墓碑[${sonEntry.entryId}][${entry.sortIndex}][${entry.entryId}]`)
                      needReplaceTweetId[`${i}.content.timelineModule.items.${k}`] = {
                        conversationThreadId: entry.entryId,
                        tweetStrId: sonEntry.entryId
                      }
                    }
                  }
                }
              }
              if(/tweet/.test(entry.entryId) && getValue(entry,'item.content.tombstone')){
                // 追加回复中出现墓碑
                addModuleReplaceTweetId[String(i)] = entry.entryId
                console.log(`在追加回复中发现墓碑[${entry.entryId}]`)
              }
            }
            // 替换墓碑
            for(let index in needReplaceSortIndex){
              const sortIndex = needReplaceSortIndex[index]
              if(guestEntries){
                const entry = guestEntries.find((item)=>{
                  return item.sortIndex === sortIndex
                })
                if(entry){
                  if(/^tweet-\d+$/.test(entry.entryId)){
                    entries[Number(index)] = entry
                    const tweetId = entry.content.item.content.tweet.id
                    const tweet = guestResponse.globalObjects.tweets[tweetId]
                    data.globalObjects.tweets[tweetId] = tweet
                    data.globalObjects.users[tweet.user_id_str] = guestResponse.globalObjects.users[tweet.user_id_str]
                    if(!guestResponse.globalObjects.users[tweet.user_id_str].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                      guestResponse.globalObjects.users[tweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${guestResponse.globalObjects.users[tweet.user_id_str].name}`
                    }
                  }else{
                    console.log(`但访客模式仍无法查看该推文,将尝试直接读取目标推文: ${sortIndex}`)
                  }
                }
                else{
                  console.log(`但访客模式仍无法查看该推文: ${sortIndex}`)
                }
              }
            }
            for(let path in needReplaceTweetId){
              const tweetStrId = needReplaceTweetId[path].tweetStrId // entryID 
              const conversationThreadId = needReplaceTweetId[path].conversationThreadId
              if(guestEntries){
                let entry = guestEntries.find((item)=>{
                  return item.entryId === conversationThreadId
                })
                if(entry){
                  entry = entry.content.timelineModule.items.find((item)=>{
                    return item.entryId === tweetStrId
                  })
                  if(entry && getValue(entry,'item.content.tweet')){
                    const tweetId = entry.item.content.tweet.id
                    const tweet = guestResponse.globalObjects.tweets[tweetId]
                    setValue(entries,path,entry)
                    data.globalObjects.tweets[tweetId] = tweet
                    if(!data.globalObjects.users[tweet.user_id_str]){
                      data.globalObjects.users[tweet.user_id_str] = guestResponse.globalObjects.users[tweet.user_id_str]
                      if(!data.globalObjects.users[tweet.user_id_str].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                        data.globalObjects.users[tweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${data.globalObjects.users[tweet.user_id_str].name}`
                      }
                    }
                    continue
                  }
                }
                const tweetId = tweetStrId.match(/tweet-(.*)?/)[1]
                console.log(`但访客模式仍无法查看该推文,将尝试直接读取目标推文: tweet-${tweetId}`)
                try{
                  const { tweet, user, entry } = await unsafeWindow.TwitterAPI.fetchTweet(tweetId,true)
                  const content = getValue(entries,path+'.item.content')
                  delete content.tombstone
                  content.tweet = {
                    displayType: "Tweet",
                    id: tweetId
                  }
                  data.globalObjects.tweets[tweetId] = tweet
                  data.globalObjects.users[tweetId.user_id_str] = user
                  if(!user.name.startsWith(`[${Config.GHOST_TIPS}]`)){
                    data.globalObjects.users[user.user_id_str].name = `[${Config.GHOST_TIPS}]${user.name}`
                  }
                }catch(e){
                  console.log(e)
                  console.log(`无法读取目标推文: tweet-${tweetId}`)
                }
              }
            }
            for(let path in addModuleReplaceTweetId){
              const tweetStrId = addModuleReplaceTweetId[path]
              if(guestEntries){
                let entry = guestEntries.find((item)=>{
                  return item.entryId === tweetStrId
                })
                if(entry && getValue(entry,'item.content.tweet')){
                  const tweetId = entry.item.content.tweet.id
                  const tweet = guestResponse.globalObjects.tweets[tweetId]
                  setValue(entries,path,entry)
                  data.globalObjects.tweets[tweetId] = tweet
                  if(!data.globalObjects.users[tweet.user_id_str]){
                    data.globalObjects.users[tweet.user_id_str] = guestResponse.globalObjects.users[tweet.user_id_str]
                    if(!data.globalObjects.users[tweet.user_id_str].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                      data.globalObjects.users[tweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${data.globalObjects.users[tweet.user_id_str].name}`
                    }
                  }
                }else{
                  console.log(`访客模式中仍未发现追加回复中的丢失推文,将尝试直接读取目标推文: ${entry.entryId}`)
                  const tweetId = entry.entryId.match(/tweet-(.*)?/)[1]
                  try{
                    const { tweet, user, entry } = await unsafeWindow.TwitterAPI.fetchTweet(tweetId,true)
                    const content = getValue(entries,path+'.item.content')
                    delete content.tombstone
                    content.tweet = {
                      displayType: "Tweet",
                      id: tweetId
                    }
                    data.globalObjects.tweets[tweetId] = tweet
                    data.globalObjects.users[tweetId.user_id_str] = user
                    if(!user.name.startsWith(`[${Config.GHOST_TIPS}]`)){
                      data.globalObjects.users[user.user_id_str].name = `[${Config.GHOST_TIPS}]${user.name}`
                    }
                  }catch(e){
                    console.log(e)
                    console.log(`无法读取目标推文: tweet-${tweetId}`)
                  }
                }
              }
            }
            // 查找只在访客模式中出现的entry，若出现cursor-bottom或者请求参数中出现cursor，则表示无法一次查询完毕，不进行对比
            if(!/cursor-bottom-\d+/.test(entries[entries.length - 1].entryId) && !/cursor/.test(response.config.url)){
              for(let guestEntry of guestEntries){
                if(/(tweet-\d+)|(conversationThread-\d+)/.test(guestEntry.entryId)){
                  // 遍历tweet和conversationThread这两种entry
                  const flag = entries.find((entry)=>{
                    return guestEntry.entryId === entry.entryId 
                  })
                  if(!flag){
                    // 在原请求中找不到guestEntry的情况，向原请求插入该guestEntry
                    if(/cursor-showMoreThreads-\d+/.test(entries[entries.length - 1].entryId)){
                      // 存在更多回复选项就插到倒数第二个
                      entries.splice(entries.length - 1, 0, guestEntry);
                    }else{
                      // 否则直接推到末尾
                      entries.push(guestEntry)
                    }
                    const needAddTweetIds = findTweetId(guestEntry)
                    needAddTweetIds.forEach((tweetId)=>{
                      const tweet = guestResponse.globalObjects.tweets[tweetId]
                      const user = guestResponse.globalObjects.users[tweet.user_id_str]
                      data.globalObjects.tweets[tweetId] = tweet
                      data.globalObjects.users[tweet.user_id_str] = user
                      if(!user.name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                        data.globalObjects.users[tweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${user.name}`
                      }
                    })
                  }
                }
              }
            }

          }else{
            // instructions 可能为空，此时若访客模式中存在内容则全部推入
            if(!entries && guestEntries){
              data.timeline.instructions.push(guestResponse.timeline.instructions.find((item)=>{
                return item.addEntries || item.addToModule
              }))
              for(let guestEntry of guestEntries){
                if(/(tweet-\d+)|(conversationThread-\d+)/.test(guestEntry.entryId)){
                  const needAddTweetIds = findTweetId(guestEntry)
                  needAddTweetIds.forEach((tweetId)=>{
                    const tweet = guestResponse.globalObjects.tweets[tweetId]
                    const user = guestResponse.globalObjects.users[tweet.user_id_str]
                    data.globalObjects.tweets[tweetId] = tweet
                    data.globalObjects.users[tweet.user_id_str] = user
                    if(!user.name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                      data.globalObjects.users[tweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${user.name}`
                    }
                  })
                }
              }
            }
          }

          // 查找鬼ban推文，此时屏蔽推文已经修复完毕
          for(let _tweet of Object.values(data.globalObjects.tweets)){
            if(_tweet.in_reply_to_status_id_str && !data.globalObjects.tweets[_tweet.in_reply_to_status_id_str]){
              console.log(`未出现的回复推文: ${_tweet.in_reply_to_status_id_str}`)
              const tweetId = _tweet.in_reply_to_status_id_str
              try{
                const { tweet, user, entry } = await unsafeWindow.TwitterAPI.fetchTweet(tweetId,true)
                const _entry = entries.find((a)=>{return a.sortIndex === entry.sortIndex})
                if(_entry){
                  _entry.entryId = entry.entryId
                  delete _entry.content.item.content.tombstone
                  _entry.content.item.content.tweet = {
                    displayType: "Tweet",
                    id: tweetId
                  }
                  data.globalObjects.tweets[tweetId] = tweet
                  data.globalObjects.users[tweetId.user_id_str] = user
                  if(!user.name.startsWith(`[${Config.GHOST_TIPS}]`)){
                    data.globalObjects.users[user.user_id_str].name = `[${Config.GHOST_TIPS}]${user.name}`
                  }
                }else{
                  console.log(tweet, user, entry.sortIndex)
                  console.log(`匹配entry失败: ${entry.sortIndex}`)
                }
              }catch(e){
                console.error(e)
              }
            }
          }

          // 修复引用
          for(let tweet of Object.values(data.globalObjects.tweets)){
            try{
              if(tweet.quoted_status_id_str && !data.globalObjects.tweets[tweet.quoted_status_id_str]){
                console.log(`发现被无法访问的引用: ${tweet.quoted_status_id_str}`)
                const tweetId = tweet.quoted_status_id_str
                let guestTweet
                let guestUser
                if(guestResponse.globalObjects.tweets[tweet.quoted_status_id_str]){
                  guestTweet = guestResponse.globalObjects.tweets[tweet.quoted_status_id_str]
                  guestUser = guestResponse.globalObjects.users[guestTweet.user_id_str]
                }else{
                  const { tweet, user, entry } = await unsafeWindow.TwitterAPI.fetchTweet(tweetId,true)
                  guestTweet = tweet
                  guestUser = user
                }
                const guesttweetId = guestTweet.quoted_status_id_str
                data.globalObjects.tweets[guesttweetId] = guestTweet
                data.globalObjects.users[guestTweet.user_id_str] = guestUser
                if(!guestUser.name.startsWith(`[${Config.BLOCK_TIPS}]`)){
                  data.globalObjects.users[guestTweet.user_id_str].name = `[${Config.BLOCK_TIPS}]${guestUser.name}`
                }
              }
            }catch(e){
              console.error(e)
              continue
            }
          }

          response.response = JSON.stringify(data)
        }catch(e){
          console.error(e)
        }
        return response
      }
    })
  }

  function startHookXHR_userTimeLineFix(){
    unsafeWindow.AjaxHook.XHRHook.push({
      testUrl: /i\/api\/graphql\/(.*?)\/UserByScreenName/,
      async onResponse(response,handler){
        try{
          let data = JSON.parse(response.response)
          if(data.data.user && data.data.user.legacy && data.data.user.legacy.blocked_by){
            console.log(`已被该用户屏蔽：[${data.data.user.legacy.screen_name}]${data.data.user.legacy.name}`)
            BlockSet.add(data.data.user.rest_id)
            data.data.user.legacy.blocked_by = false
            if(!data.data.user.legacy.name.startsWith(`[${Config.BLOCK_TIPS}]`)){
              data.data.user.legacy.name = `[${Config.BLOCK_TIPS}]${data.data.user.legacy.name}`
            }
          }
          response.response = JSON.stringify(data)
        }catch(e){
          console.error(e)
        }
        return response
      }
    })
    unsafeWindow.AjaxHook.XHRHook.push({
      testUrl: /i\/api\/2\/timeline\/(media|profile|favorites)\/\d+\.json/,
      onRequest(config,handler){
        Object.defineProperty(config.xhr, 'status', {
          get(){
            return 200
          }
        });
      },
      async onResponse(response,handler){
        try{
          let data = JSON.parse(response.response)
          if(Array.isArray(data.errors) && data.errors.find((e)=>{
            return e.code === 136
          })){
            // console.log("正在替换为访客内容")
            data = JSON.parse(await unsafeWindow.TwitterAPI.guestGet(response.config.url))
            const uid = response.config.url.match(/(media|profile|favorites)\/(.*)?.json?/)[2]
            if(!data.globalObjects.users[uid].name.startsWith(`[${Config.BLOCK_TIPS}]`)){
              data.globalObjects.users[uid].name = `[${Config.BLOCK_TIPS}]${data.globalObjects.users[uid].name}`
            }
            response.status = 200
          }
          response.response = JSON.stringify(data)
          
        }catch(e){
          console.error(e)
          console.log(response)
        }
        return response
      }
    })
  }

})()

