// ==UserScript==
// @name         B站动态自定义过滤
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  B站动态自定义过滤，可过滤转发类型(关注分组已无法使用)
// @author       Eric Lam
// @include      /^https?:\/\/t\.bilibili\.com\/[^\/]*$/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/422227/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/422227/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const posts = {
        normal: [],
        videoRel: [],
        repost: [],
        videos: [],
        followings: {}
    }
    const defaultEnabled = {
        normal: true,
        videoRel: true,
        repost: true,
        videos: true
    }
    const followings = {}
    function getSettings(){
       try {
         return { ...defaultEnabled, ...JSON.parse(window.localStorage['hide_feed_settings']) }
       }catch(err){
         console.debug(`cannot found old settings: [${err.message}], using default settings`)
         return defaultEnabled
       }
    }
    const enabled = getSettings()
    for (const key in enabled){
       if (!Object.keys(defaultEnabled).includes(key)) delete enabled[key]
    }

    let allFeedsState = true

    const feedCardCallback = (mu, o) => {
       for (const nodes of mu){
          if ($(nodes.target).hasClass('loading-content') && $(nodes.addedNodes[0]).hasClass('tc-slate')){
             console.debug('changed tab')
             posts.repost = []
             posts.normal = []
             posts.videos = []
             posts.videoRel = []
             return
          }
          for (const node of nodes.addedNodes){
             const tid = parseInt(getTagId())
             if ($(node).find('.bili-dyn-content__orig.reference').length > 0) {
                console.debug('found repost')
                const repostContent = $(node).find('.bili-dyn-content__orig.reference')
                const isVideo = repostContent.find('.bili-dyn-card-video').length > 0
                console.debug(`this repost is video: ${isVideo}`)
                const card = repostContent.parents('.bili-dyn-item')
                if (isVideo){
                  posts.videos.push(card)
                  if (!enabled.videos) $(card).hide()
                }else{
                  posts.repost.push(card)
                  if (!enabled.repost) $(card).hide()
                }
             } else if($(node).find('.bili-dyn-content__orig').length > 0){
                console.debug('found normal')
                const content = $(node).find('.bili-dyn-content__orig')
                const card = content.parents('.bili-dyn-item')
                const isVideo = content.find('.bili-dyn-card-video').length > 0
                console.debug(`this normal is video: ${isVideo}`)
                if (isVideo){
                  posts.videoRel.push(card)
                  if (!enabled.videoRel) $(card).hide()
                }else{
                  posts.normal.push(card)
                  if (!enabled.normal) $(card).hide()
                }
             } else {
               console.debug('found unknown post')
             }
             //if (allFeedsState) handleGroupFilter(node).catch(console.error)
          }
       }
    }

    let feedCard = $('.bili-dyn-list')

    while(feedCard.length == 0){
       console.log('bili-dyn-list not found, wait 0.5 sec')
       await sleep(500)
       feedCard = $('.bili-dyn-list')
    }

    try {
       new MutationObserver(feedCardCallback).observe(feedCard[0], { subtree: true, childList: true, attributes: false })
    }catch(err){
      alert(`自定义过滤载入失败，${err.message}, 请刷新`)
      return
    }

    const hideAll = (arr) => arr.forEach(s => $(s).hide())
    const showAll = (arr) => arr.forEach(s => $(s).show())

    function handle(key, target){
        const val = $(target).prop('checked')
        enabled[key] = val
        // 关注分组失效
        //const tid = parseInt(getTagId())
        //const cards = posts[key].filter(c => tid == 0 || jqInclude(posts.followings[tid],c))
        const cards = posts[key]
        if (val){
            showAll(cards)
        }else{
            hideAll(cards)
        }
    }

    function jqInclude(arr, c){
      return arr.includes(c) || arr.some(r => r[0] == c[0])
    }

    feedCard.parent('section').before(`
         <div class="tab-bar filter-list filter-grid">
            <div>
              <input id="normal-checker" type="checkbox" checked>纯动态
            </div>
            <div>
              <input id="video-release-checker" type="checkbox" checked>投稿视频
            </div>
            <div>
              <input id="repost-checker" type="checkbox" checked>转发动态
            </div>
            <div>
              <input id="repost-video-checker" type="checkbox" checked>转发视频
            </div>
         </div>
         <!--div class="tab-bar filter-list" id="followings-group">
            分组过滤:
            <select id="f-groups" class="filter-select" value="0">
            </select>
         </div-->
         <style>
            .filter-list {
              background-color: white;
              min-height: 10px;
              margin-bottom: 10px;
              text-align: center;
              padding: 15px;
            }
            .filter-grid{
              display: grid;
              grid-template-columns: repeat(4, 3fr);
            }
            .filter-select {
              position: relative;
              padding: 5px;
              flex-direction: column;
              width: 50%;
              border-style: solid;
              border-radius: 3px;
              border-width: 1px;
              border-color: #c9c9c9;
            }
         </style>
    `)

    const followGroupInfo = {}


    /*
    const groups = await getFollowingGroups()
    for (const group of groups){
        const key = group.tagid
        if (group.tagid === 0) group.name = '全部关注'
        $('#f-groups').append(`
           <option value="${group.tagid}">${group.name}</option>
        `)
        followGroupInfo[group.tagid] = group
        posts.followings[group.tagid] = []
    }
    */


    //https://api.bilibili.com/x/relation/whispers?pn=1&ps=20&jsonp=jsonp

    $('#f-groups').val(0)

    $('input#normal-checker').prop('checked', enabled.normal)
    $('input#video-release-checker').prop('checked', enabled.videoRel)
    $('input#repost-checker').prop('checked', enabled.repost)
    $('input#repost-video-checker').prop('checked', enabled.videos)

    $('input#normal-checker').on('change', e => handle('normal', e.target))
    $('input#video-release-checker').on('change', e => handle('videoRel', e.target))
    $('input#repost-checker').on('change', e => handle('repost', e.target))
    $('input#repost-video-checker').on('change', e => handle('videos', e.target))

    /*
    $('#f-groups').on('change', e => {
       const tagid = parseInt(e.target.value)
       if (tagid === 0) {
         showAll(Object.values(posts.followings).flatMap(n => n))
       }else{
         let filter = (c) => true
         for(const tid in posts.followings){
             const cards = posts.followings[tid]
             if (tid == tagid){
                 showAll(cards)
                 filter = (c) => !cards.includes(c)
             }else{
                 hideAll(cards.filter(filter))
             }
         }
       }
       for(const key in enabled){
          const val = enabled[key]
          const tid = parseInt(getTagId())
          const cards = posts[key].filter(c => tid == 0 || jqInclude(posts.followings[tid],c))
          if (!val){
            hideAll(cards)
          }
       }
    })
    */

    window.onunload = function(){
       window.localStorage['hide_feed_settings'] = JSON.stringify(enabled)
    }

    /*
    while($('.bili-dyn-up-list__content').length == 0){
       console.log('bili-dyn-up-list__content not found, wait 0.5 sec')
       await sleep(500)
    }

    try{
      new MutationObserver(([mu], o) => {
        console.log($(mu.target).find('bili-dyn-up-list__item.active > .bili-dyn-up-list__item__name')[0])
        const allTargets = $(mu.target).hasClass('.active') && $(mu.target).find('.bili-dyn-up-list__item__name')[0]?.innerText == '全部动态'
        allFeedsState = allTargets
        if (allTargets){
           console.debug('showing followings group')
           $('#followings-group').show()
        }else{
            console.debug('hiding followings group')
           $('#followings-group').hide()
           $('#f-groups').val(0)
           for(const tid in posts.followings){
             posts.followings[tid] = []
           }
        }
      }).observe($('.bili-dyn-up-list__content')[0], { childList: false, subtree: true, attributes: true})
    }catch(err){
       alert(`自定义过滤载入失败，${err.message}, 请刷新`)
       return
    }


    async function handleGroupFilter(node){
      if (!$(node).hasClass('main-content')) return
      try {
        const reg = /(\d+)\/dynamic$/
        const card = $(node).parents('.bili-dyn-item')
        const url = card.find('a.c-pointer.user-head').prop('href')
        const regexResult = reg.exec(card.find('a.c-pointer.user-head').prop('href'))
        if (!regexResult){
           // 无效uid，可能是番剧？
           return
        }
        const mid = parseInt(regexResult.pop())
        if (!followings[mid]) followings[mid] = await getUserGroups(mid)
        if (followings[mid].length == 0){
           posts.followings[0].push(card)
           $(node).find('.bili-dyn-time')[0].innerText += ' (默认分组)'
        }else{
           for (const tagid of followings[mid]){
               posts.followings[tagid].push(card)
               $(node).find('.bili-dyn-time')[0].innerText += ` (${followGroupInfo[tagid].name})`
           }
        }
        const currentSelect = getTagId()
        if (!followings[mid].includes(currentSelect) && currentSelect != 0) card.hide()
      }catch(err){
        console.error(err)
      }
    }
    */

})().catch(console.error);

async function sleep(ms) {
   return new Promise((res,) => setTimeout(res, ms))
}

function getTagId(){
  return $('#f-groups').val()
}

async function getFollowingGroups(){
  try {
    const { data } = await webRequest('https://api.bilibili.com/x/relation/tags?jsonp=jsonp')
    return data
  }catch(err){
    console.error(err)
    return []
  }
}

async function getUserGroups(uid){
  try {
    const { data } = await webRequest(`https://api.bilibili.com/x/relation/tag/user?fid=${uid}&jsonp=jsonp`)
    return Object.keys(data)
  }catch(err){
    console.error(err)
    return []
  }
}

async function webRequest(url){
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
     let backupResponse = undefined
     if (res.status == 412){
       console.warn(`412 request too fast`)
       res.statusText = '请求过快导致被B站服务器禁止'
       backupResponse = GM_getValue(`cache:${url}`, undefined)
     }
     if (backupResponse) {
       console.warn(`using backup http cache:`)
       console.log(backupResponse)
       return backupResponse
     }
     else throw { ...res, message: `${res.statusText}(${res.status})` }
  }
  const json = await res.json()
  if (json.code) throw json
  GM_setValue(`cache:${url}`, json)
  return json
}

async function* getFollowings(tagId, uid){
  let page = 1
  while(true){
      const { data }  = await webRequest(`https://api.bilibili.com/x/relation/tag?mid=${uid}&tagid=${tagId}&pn=${page++}&ps=50&jsonp=jsonp`)
      if (data.length === 0) break;
      yield data.map(r => r.mid)
  }
}