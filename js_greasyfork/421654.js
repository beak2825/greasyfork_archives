// ==UserScript==
// @name         twitter-api
// @namespace    twitter-api
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      https://twitter.com/*
// @include      https://mobile.twitter.com/*
// @require      https://greasyfork.org/scripts/419167-ajax-hook-cc/code/ajax-hook-cc.js
// @run-at        document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421654/twitter-api.user.js
// @updateURL https://update.greasyfork.org/scripts/421654/twitter-api.meta.js
// ==/UserScript==

(async function(){
  if(unsafeWindow.top != unsafeWindow.self){
    return
  }

  unsafeWindow.TwitterAPI = {}

  const myid = document.cookie.match(/twid=u%3D(.*?)(;|$)/)[1]

  const Config = {
    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    user:{
      // x-csrf-token
    },
    guest: {
      "x-guest-token": localStorage["x-guest-token"],
      "x-csrf-token": localStorage["x-csrf-token"]
    },
  }

  if(!Config.guest["x-csrf-token"]){
    let token = prompt("x-csrf-token")
    Config.guest["x-csrf-token"] = token
    localStorage["x-csrf-token"] = token
  }

  function post(url,body){
    if(!Config.user['x-csrf-token'] || !Config.authorization){
      console.log('config',Config)
      throw new Error("user config error")
    }
    return fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
        'x-twitter-client-language': 'zh-cn',
        'x-csrf-token': Config.user['x-csrf-token'],
        'authorization': Config.authorization
      },
      method: 'POST',
      body: new URLSearchParams(body)
    }).then(function(response) {
      return response.json();
    })
  }

  function get(url){
    if(!Config.user['x-csrf-token'] || !Config.authorization){
      console.log('config',Config)
      throw new Error("user config error")
    }
    return fetch(url, {
      headers: {
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
        'x-twitter-client-language': 'zh-cn',
        'x-csrf-token': Config.user['x-csrf-token'],
        'authorization': Config.authorization
      },
      method: 'GET'
    }).then(function(response) {
      return response.json();
    })
  }

  function xhr(url,method,{headers}){
    return new Promise((resolve,reject)=>{
      let _xhr = new XMLHttpRequest();
      _xhr.open(method, url);
      if(headers){
        for (let header in headers) {
          _xhr.setRequestHeader(header, headers[header]);
        }
      }
      _xhr.onreadystatechange = function () {
        if (_xhr.readyState == 4) {
          if ((_xhr.status >= 200 && _xhr.status < 300) || _xhr.status == 304) {
            resolve(_xhr.responseText)
          } else {
            reject(_xhr)
          }
        }
      };
      _xhr.send();
    })
  }

  async function refreshGuestInfo(url){
    let r = await xhr("https://api.twitter.com/1.1/guest/activate.json","POST",{
      headers:{
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        authorization: Config.authorization,
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        pragma: "no-cache",
        "x-csrf-token": Config.guest["x-csrf-token"],
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "zh-cn",
      }
    })
    const gtoken = JSON.parse(r).guest_token
    console.log(`访客凭证已更新: ${gtoken}`)
    Config.guest["x-guest-token"] = gtoken
    localStorage["x-guest-token"] = gtoken
  }

  function guestGet(url,denyRetry){
    return new Promise(async (resolve,reject)=>{
      if(!Config.guest["x-guest-token"]){
        await refreshGuestInfo(url)
      }
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: {
          "accept": "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "authorization": Config.authorization,
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-guest-token": Config.guest["x-guest-token"],
          "x-twitter-active-user": "yes",
          "x-twitter-client-language": "zh-cn",
          referer:location.href,
          'user-agent': `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`
        },
        anonymous: true,
        nocache: true,
        onload: async (response)=>{
          if(response.status >= 200 && response.status < 300){
            resolve(response.response)
          }else{
            if(denyRetry){
              reject(response)
            }else{
              if(response.status === 403){
                await refreshGuestInfo(url)
                guestGet(url,true).then((r)=>{
                  resolve(r)
                }).catch((e)=>{
                  reject(e)
                })
              }else{
                reject(response)
              }
            }
          }

        },
        onerror: (e)=>{
          reject(e)
        }
      })
    })
  }

  unsafeWindow.AjaxHook.XHRHook.push({
    testUrl: /client_event\.json/,
    onRequest(config,handler){
      Config.user['x-csrf-token'] = config.headers['x-csrf-token']
      return config
    }
  })


  unsafeWindow.TwitterAPI.follow = function(uid){
    return post("https://twitter.com/i/api/1.1/friendships/create.json",{
      include_profile_interstitial_type: 1,
      include_blocking: 1,
      include_blocked_by: 1,
      include_followed_by: 1,
      include_want_retweets: 1,
      include_mute_edge: 1,
      include_can_dm: 1,
      include_can_media_tag: 1,
      skip_status: 1,
      id: uid
    })
  }

  unsafeWindow.TwitterAPI.favorites = function(tid){
    return post("https://twitter.com/i/api/1.1/favorites/create.json",{
      tweet_mode: 'extended',
      id: tid
    })
  }

  unsafeWindow.TwitterAPI.getFollower = function(uid,count){
    let url = `https://twitter.com/i/api/graphql/6SBWVfRVIH0h71ssRzNVUg/Followers`
    url += `?variables=`
    url += encodeURI(JSON.stringify({
      "userId":uid || myid,
      "count":count || 20,
      "withHighlightedLabel":false,
      "withTweetQuoteCount":false,
      "includePromotedContent":false,
      "withTweetResult":false,
      "withUserResult":false
    }))
    return new Promise(async (resolve,reject)=>{
      get(url).then((data)=>{
        const entries = data.data.user.followers_timeline.timeline.instructions.find((item)=>{
          return item.entries
        })
        if(entries){
          let result = []
          for(let entrie of entries.entries){
            try{
              if(entrie.content.itemContent){
                const user = entrie.content.itemContent.user.legacy
                const uid = entrie.content.itemContent.user.rest_id
                user.uid = uid
                result.push(user)
              }
            }catch(e){
              console.error(e)
            }
          }
          resolve(result)
        }else{
          console.log('检查关注列表失败，未找到entries',data)
          reject(data)
        }
      })
    })
  }

  unsafeWindow.TwitterAPI.fetchTweet = function(status_id,guest){
    let url = `https://twitter.com/i/api/2/timeline/conversation/${status_id}.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&count=20&include_ext_has_birdwatch_notes=false&ext=mediaStats%2ChighlightedLabel`
    return new Promise(async (resolve,reject)=>{
      let r
      if(guest){
        r = guestGet(url).then((data)=>{return JSON.parse(data)})
      }else{
        r = get(url)
      }
      r.then((response)=>{
        if(response.globalObjects && response.globalObjects.tweets && response.globalObjects.tweets[status_id]){
          try{
            const tweet = response.globalObjects.tweets[status_id]
            const entry = response.timeline.instructions.find((a)=>{return a.addEntries}).addEntries.entries.find((a)=>{return a.entryId === `tweet-${status_id}`})
            resolve({
              tweet,
              user: response.globalObjects.users[tweet.user_id_str],
              entry
            })
          }catch(e){
            reject(e)
          }
        }else{
          reject(`未找到目标推文${status_id}`)
        }
      }).catch((e)=>{
        reject(e)
      })
    })
  }

  unsafeWindow.TwitterAPI.guestGet = guestGet

})()