// ==UserScript==
// @name         抖音/快手/微视/instagram/TIKTOK/小红书/微博/今日头条 主页视频下载
// @namespace    shortvideo_homepage_downloader
// @version      1.4.1
// @description  在抖音/快手/微视/instagram/TIKTOK/小红书/微博/今日头条 主页右小角显示视频下载按钮
// @author       hunmer
// @match        https://pixabay.com/videos/search/*
// @match        https://www.xinpianchang.com/discover/*
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/note/*
// @match        https://www.toutiao.com/c/user/token/*
// @match        https://www.kuaishou.com/profile/*
// @match        https://www.kuaishou.com/search/video*
// @match1       https://www.youtube.com/@*/shorts
// @match        https://live.kuaishou.com/*
// @match        https://x.com/*/media
// @match        https://weibo.com/u/*?tabtype=newVideo*
// @match        https://isee.weishi.qq.com/ws/app-pages/wspersonal/index.html*
// @match        https://www.instagram.com/*
// @match        https://www.xiaohongshu.com/user/profile/*
// @match        https://www.xiaohongshu.com/search_result/*
// @match        https://www.xiaohongshu.com/explore*
// @match        https://www.tiktok.com/@*
// @match        https://www.tiktok.com/search*
// @match        https://artlist.io/stock-footage/story/*
// @match        https://artlist.io/stock-footage/search?*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501746/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E5%BE%AE%E8%A7%86instagramTIKTOK%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BE%AE%E5%8D%9A%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%20%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501746/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E5%BE%AE%E8%A7%86instagramTIKTOK%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BE%AE%E5%8D%9A%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%20%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
const $ = selector => document.querySelectorAll('#_dialog '+selector)
const ERROR = -1, WAITTING = 0, DOWNLOADING = 1, DOWNLOADED = 2
const VERSION = '1.4.9', RELEASE_DATE = '2025/06/11'
const DEBUGING = false
const window = unsafeWindow
const DEBUG = (...args) => DEBUGING && console.log.apply(this, args)
const toArr = arr => Array.isArray(arr) ? arr : [arr]
const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}
const flattenArray = arr => {
    if(!Array.isArray(arr)) return []
    var result = []
    for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flattenArray(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}
const getExtName = name => {
    switch(name){
        case 'video':
            return 'mp4'
        case 'image':
        case 'photo':
            return 'jpg'
    }
    return name ?? 'mp4'
}
const escapeHTMLPolicy = typeof(trustedTypes) != 'undefined' ? trustedTypes.createPolicy("forceInner", {
    createHTML: html => html,
}) : {
    createHTML: html => html
}
const createHTML = html => escapeHTMLPolicy.createHTML(html)
const openFileDialog = ({callback, accept = '*'}) => {
  let input = document.createElement('input')
  input.type = 'file'
  input.style.display = 'none'
  input.accept = accept
  document.body.appendChild(input)
  input.addEventListener('change', ev => callback(ev.target.files) & input.remove())
  input.click()
}

const loadRes = (files, callback) => {
    return new Promise(reslove => {
        files = [...files]
        var next = () => {
            let url = files.shift()
            if (url == undefined) {
                callback && callback()
                return reslove()
            }
            let fileref, ext = url.split('.').at(-1)
            if (ext == 'js') {
                fileref = GM_addElement('script', {
                    src: url,
                    type: ext == 'js' ? "text/javascript" : 'module'
                })
            } else if (ext == "css") {
                fileref = GM_addElement('link', {
                    href: url,
                    rel: "stylesheet",
                    type: "text/css"
                })
            }
            if (fileref != undefined) {
                let el = document.getElementsByTagName("head")[0].appendChild(fileref)
                el.onload = next, el.onerror = next
            } else {
                next()
            }
        }
        next()
    })
}

const cutString = (s_text, s_start, s_end, i_start = 0, fill = false) => {
    i_start = s_text.indexOf(s_start, i_start)
    if (i_start === -1) return ''
    i_start += s_start.length
    i_end = s_text.indexOf(s_end, i_start)
    if (i_end === -1) {
        if (!fill) return ''
        i_end = s_text.length
    }
    return s_text.substr(i_start, i_end - i_start)
}
const getParent = (el, callback) => {
    let par = el
    while(par && !callback(par)){
        par = par.parentElement
    }
    return par
}
const chooseObject = (cb, ...objs) => {
    let callback = typeof(cb) == 'function' ? cb : obj => obj?.[cb]
    return objs.find(callback)
}

// 样式
GM_addStyle(`
  ._dialog {
  input[type=checkbox] {
     -webkit-appearance: auto !important;
  }
  color: white !important;
  font-size: large !important;
  font-family: unset !important;
    input {
      color: white;
      border: 1px solid;
    }
    table tr td, table tr th {
       vertical-align: middle;
    }
    input[type=text], button {
      color: white !important;
      background-color: unset !important;
    }
    table input[type=checkbox] {
         width: 20px;
         height: 20px;
         transform: scale(1.5);
         -webkit-appearance: checkbox;
    }
  }
  body:has(dialog[open]) {
    overflow: hidden;
  }
`);

unsafeWindow._downloader = _downloader = {
  loadRes,
  resources: [], running: false, downloads: {},
  options: Object.assign({
    threads: 8,
    firstRun: true,
    autoRename: false,
    alert_done: true,
    show_img_limit: 500,
    douyin_host: 1, // 抖音默认第二个线路
    timeout: 1000 * 60,
    retry_max: 60,
    autoScroll: true,
    aria2c_host: '127.0.0.1',
    aria2c_port: 6800,
    aria2c_secret: '',
    aria2c_saveTo: './downloads'
  }, GM_getValue('config', {})),
  saveOptions(opts = {}){
    opts = Object.assign(this.options, opts)
    GM_setValue('config', opts)
  },
  _aria_callbacks: [],
  bindAria2Event(method, gid, callback){
      this._aria_callbacks.push({
          method: 'aria2.' + method,
          gid, callback
      })
  },
  enableAria2c(enable){
      if(enable){
          if(!this.aria2c){
              loadRes(['https://cdn.jsdelivr.net/npm/httpclient@0.1.0/bundle.js', 'https://cdn.jsdelivr.net/npm/aria2@2.0.1/bundle.js'], () => {
                  this.writeLog('正在连接aria2，请等待连接成功后再开始下载！！！', 'ARIA2C')
                  var aria2 = this.aria2c = new window.Aria2({
                      host: this.options.aria2c_host,
                      port: this.options.aria2c_port,
                      secure: false,
                      secret: this.options.aria2c_secret,
                      path: '/jsonrpc',
                      jsonp: false
                  })
                  aria2.open().then(() => {
                      aria2.opening = true
                      this.writeLog('aria2成功连接！', 'ARIA2C')
                      $('[data-for="useAria2c"]')[0].checked = true
                  }).catch((err) => this.writeLog('aria2链接失败,'+err.toString(), 'ARIA2C'));
                  aria2.onclose =  () => {
                      aria2.opening = false
                      this.writeLog('aria2失去连接！', 'ARIA2C')
                      $('[data-for="useAria2c"]')[0].checked = false
                  }
                  aria2.onmessage = ({ method: _method, id, result, params }) => {
                      console.log({_method, result, params})
                      switch (_method) {
                          // case 'aria2.onDownloadError': // 下载完成了还莫名触发？
                          case 'aria2.onDownloadComplete':
                              for (let i = this._aria_callbacks.length - 1; i >= 0; i--) {
                                  let { gid, method, callback } = this._aria_callbacks[i]
                                  if (gid == params[0].gid) {
                                      if (method == _method) { // 如果gid有任何一个事件成功了则删除其他事件绑定
                                          callback()
                                      }
                                      this._aria_callbacks.splice(i, 1)
                                  }
                              }
                              return
                      }
                  }
              })
          }
      }else{
          if(this.aria2c){
              this.aria2c.close()
              this.aria2c = undefined
          }
      }
  },
  addDownload(opts){
      console.log(opts)
      let _id = guid()
      var {id, url, name, error, success, download, downloadTool} = opts
      if(download){ // 命名规则
          let {ext, type, title} = download
          ext ||= getExtName(type)
          name = this.safeFileName(this.getDownloadName(id) ?? title) + (ext != '' ? '.' + ext : '')
      }
      const callback = (status, msg) => {
          let cb = opts[status]
          cb && cb(msg)
          this.removeDownload(_id)
      }
      var abort, timer
      var headers = this.getHeaders(url)
      if(downloadTool == 'm3u8dl'){
          let base64 = new Base64().encode(`"${url}" --workDir "${this.options.aria2c_saveTo}" --saveName "${name}" --enableDelAfterDone --headers "Referer:https://artlist.io/" --maxThreads "6" --downloadRange "0-1"`)
          unsafeWindow.open(`m3u8dl://`+base64, '_blank')
          return callback('success', '下载完成...')
      }
      if(this.aria2c){
           var _guid
           this.aria2c.send("addUri", [url], {
               dir: this.options.aria2c_saveTo,
               header: Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
               out: name,
           }).then(guid => {
               _guid = guid
               this.bindAria2Event('onDownloadComplete', guid, () => callback('success', '下载完成...'))
               this.bindAria2Event('onDownloadError', guid, () => callback('error', '下载失败'))
           })
           abort = () => _guid && this.aria2c.send("remove", [_guid])
      }else{
          var fileStream
          abort = () => fileStream.abort()
          timer = setTimeout(() => {
              callback('error', '超时')
              this.removeDownload(_id, true)
          }, this.options.timeout)
          const writeStream = readableStream => {
              if (unsafeWindow.WritableStream && readableStream.pipeTo) {
                  return readableStream.pipeTo(fileStream).then(() => callback('success', '下载完成...')).catch(err => callback('error', '下载失败'))
              }
          }
          let isTiktok = location.host == 'www.tiktok.com'
          if(isTiktok) headers.Referer = url
          GM_xmlhttpRequest({
              url, headers,
              redirect: 'follow', responseType: 'blob', method: "GET",
              onload: ({response, status}) => {
                  console.log({response, status})
                  // BUG 不知为啥tiktok无法使用流保存
                  if(isTiktok || typeof(streamSaver) == 'undefined'){
                      return unsafeWindow.saveAs(response, name) & callback('success', '下载完成...')
                  }
                  let res = new Response(response).clone()
                  fileStream = streamSaver.createWriteStream(name, {size: response.size})
                  writeStream(res.body)
                  //writeStream(response.stream())
              }
          })
      }
      return this.downloads[_id] = {abort, timer}
   },
  removeDownload(id, cancel = false){
      let {timer, abort} = this.downloads[id] ?? {}
      if(timer) clearTimeout(timer)
      cancel && abort()
      delete this.downloads[id]
  },
  setBadge(html){
    try{
       let fv = document.querySelector('#_ftb')
      if(!fv){
          fv = document.createElement('div')
          fv.id = '_ftb'
          fv.style.cssText = `position: fixed;bottom: 50px;right: 50px;border-radius: 20px;background-color: #fe2c55;color: white;z-index: 999;cursor: pointer;padding: 5px;`
          fv.onclick = () => this.showList()
          fv.oncontextmenu = ev => {
              this.setList([], false)
              fv.remove()
              ev.stopPropagation(true) & ev.preventDefault()
          }
          document.body.append(fv)
      }
        fv.innerHTML = createHTML(html)
    } catch(err){}

  },
  init(){ // 初始化
    const parseDouyinList = data => {
        let {video, desc, images} = data
        let author = data.author ?? data.authorInfo
        let aweme_id = data.aweme_id ?? data.awemeId
        let create_time = data.create_time ?? data.createTime
        //let {uri, height} = video.play_addr || {}
        let xl = this.options.douyin_host
        return {
            status: WAITTING,
            id: aweme_id,
            url: 'https://www.douyin.com/video/'+aweme_id,
            cover: (video?.cover?.url_list || video?.coverUrlList)[0],
            author_name: author.nickname,
            create_time: create_time * 1000,
            urls: images ? images.map(({height, width, download_url_list, downloadUrlList}, index) => {
                return {url: (download_url_list ?? downloadUrlList)[0], type: 'photo'}
            }) : video.play_addr.url_list.at(xl),
            title: desc,
            data
        }
    }
    this.HOSTS = { // 网站规则
        'x.com': {
            title: '推特', id: 'twitter',
            rules: [
                 {
                    url: 'https://x.com/i/api/graphql/(.*?)/UserMedia',
                    type: 'network',
                    parseList: json => json?.data?.user?.result?.timeline_v2?.timeline?.instructions?.[0]?.moduleItems,
                    parseItem: data => {
                        let {legacy, user_results, core, views: {count: view_count}} = data.item.itemContent.tweet_results.result
                        let {description: author_desc, name: author_name, id: author_id,} = core.user_results.result
                        let {created_at, full_text: title, lang, extended_entities, favorite_count, bookmark_count, quote_count, reply_count, retweet_count, id_str: id} = legacy
                        if(extended_entities?.media) return extended_entities.media.map(({type, media_url_https: url, original_info: {height, width}}, index) => {
                            return {
                                status: WAITTING,
                                url: 'https://x.com/pentarouX/status/'+id,
                                cover: url+'?format=jpg&name=360x360',
                                id: id, author_name, urls: [{url, type}], title, index, create_time: created_at,
                                data
                            }
                        })
                    }
                }
            ]
        },
        'www.youtube.com': {
            title: '油管', id: 'youtube',
            getVideoURL: item => new Promise(reslove => {
                fetch(item.url).then(resp => resp.text()).then(text => {
                    let json = JSON.parse(cutString(text, '"noteDetailMap":', ',"serverRequestInfo":'))
                    let meta = item.meta = json[item.id]
                    reslove(meta.note.video.media.stream.h264[0].masterUrl)
                })
            }),
            rules: [
                 {
                    url: 'https://www.youtube.com/youtubei/v1/browse',
                    type: 'fetch',
                    parseList: json => json?.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems,
                    parseItem: data => {
                        if(!data.richItemRenderer) return
                        let {videoId, headline, thumbnail} = data.richItemRenderer.content.reelItemRenderer
                        return {
                            status: WAITTING,
                            id: videoId,
                            url: 'https://www.youtube.com/shorts/'+videoId,
                            cover: thumbnail.thumbnails[0].url,
                            author_name: '', urls: '', title: headline.simpleText,
                            data
                        }
                    }
                }
            ]
        },
        'pixabay.com': {
            title: 'pixabay', id: 'pixabay',
            rules: [
                 {
                    type: 'object',
                    getObject: window => window?.__BOOTSTRAP__?.page?.results,
                    parseList: json => json,
                    parseItem: data => {
                        let {id, description, href , user, uploadDate, name, sources} = data
                        return {
                            status: WAITTING,id, url: 'https://pixabay.com'+href, cover: sources.thumbnail,
                            author_name: user.username,
                            urls: sources.mp4.replace('_tiny', ''),
                            title: `【${name}】${description}`, create_time: uploadDate,
                            data
                        }
                    }
                }
            ]
        },
        'weibo.com': {
            title: '微博', id: 'weibo',
            rules: [
                 {
                    url: 'https://weibo.com/ajax/profile/getWaterFallContent',
                    type: 'network',
                    parseList: json => json?.data?.list,
                    parseItem: data => {
                        let {page_info, created_at, text_raw} = data
                        let {short_url, object_id, media_info, page_pic} = page_info
                        return {
                            status: WAITTING,
                            id: object_id,
                            url: short_url,
                            cover: page_pic,
                            author_name: media_info.author_name,
                            urls: media_info.playback_list[0].play_info.url,
                            title: text_raw, create_time: created_at,
                            data
                        }
                    }
                }
            ]
        },
        'www.xinpianchang.com': {
            title: '新片场', id: 'xinpianchang',
            runAtWindowLoaded: false,
            getVideoURL: item => new Promise(reslove => {
                fetch(`https://mod-api.xinpianchang.com/mod/api/v2/media/${item.media_id}?appKey=61a2f329348b3bf77&extend=userInfo%2CuserStatus`).then(resp => resp.json()).then(json => {
                    reslove(json.data.resource.progressive.find(({url}) => url != '').url)
                })
            }),
            rules: [
                 {
                    url: 'https://www.xinpianchang.com/_next/data/',
                    type: 'json',
                    parseList: json => {
                        return flattenArray((json?.pageProps?.squareData?.section || []).map(({articles}) => articles || []))
                    },
                    parseItem: data => {
                        let {author, content, cover, media_id, title, web_url, publish_time, id} = data
                        return {
                            status: WAITTING,id, url: web_url, cover, title, media_id,
                            author_name: author.userinfo.username,
                            create_time: publish_time,
                            data
                        }
                    }
                }
            ]
        },
        'www.xiaohongshu.com': {
            title: '小红书', id: 'xhs',
            getVideoURL: item => new Promise(reslove => {
                fetch(item.url).then(resp => resp.text()).then(text => {
                    let json = JSON.parse(cutString(text, '"noteDetailMap":', ',"serverRequestInfo":'))
                    let note = json[item.id].note
                    Object.assign(item, {create_time: note.time, meta: note})
                    console.log(note)
                    reslove(note.type == 'video' ? {url: note.video.media.stream.h265[0].masterUrl, type: 'video'} : note.imageList.map(({urlDefault}) => {
                        return {url: urlDefault, type: 'photo'}
                    }))
                })
            }),
            rules: [
                {
                    type: 'object',
                    getObject: window => location.href.startsWith('https://www.xiaohongshu.com/explore/') ? window?.__INITIAL_STATE__?.note?.noteDetailMap : {},
                    parseList: json => {
                        let list = Object.values(json).filter(({note}) => note).map(({note}) => note)
                        return list
                    },
                    parseItem: data => {
                        let { desc, imageList = [], noteId: id, time, user, xsecToken, title, type, video} = data
                        let images = imageList.map(({urlDefault}) => {
                            return {url: urlDefault, type: 'photo'}
                        })
                        let urls = type == 'normal' ? images : video.media.stream.h265[0].masterUrl
                        return {
                            status: WAITTING, author_name: user.nickname, id, url: 'https://www.xiaohongshu.com/explore/'+id, urls,
                            cover: images[0].url,
                            title: desc, data
                        }
                    }
                },
                {
                    type: 'object',
                    getObject: window => chooseObject(obj => flattenArray(obj).length > 0, window?.__INITIAL_STATE__?.user.notes?._rawValue, window?.__INITIAL_STATE__?.search.feeds?._rawValue,  window?.__INITIAL_STATE__?.feed.feeds?._rawValue),
                    parseList: json => {
                        let list = []
                        Array.isArray(json) && json.forEach(items => {
                            if(Array.isArray(items)) {
                                items.forEach(item => {
                                    if(item.noteCard) list.push(item)
                                })
                            }else
                            if(items?.noteCard){
                                list.push(items)
                            }
                        })
                        return list
                    },
                    parseItem: data => {
                        let { cover, displayTitle, noteId, type, user, xsecToken} = data?.noteCard || {}
                        let id = noteId ?? data.id
                        xsecToken ??= data.xsecToken ??= ''
                        // if(xsecToken) {
                            return {
                                status: WAITTING, author_name: user.nickname, id, url: `https://www.xiaohongshu.com/explore/${id}?source=webshare&xhsshare=pc_web&xsec_token=${xsecToken.slice(0, -1)}=&xsec_source=pc_share`,
                                // +'?xsec_token='+xsecToken+'=&xsec_source=pc_user',
                                cover: cover.urlDefault,
                                title: (displayTitle ?? '').replaceAll('🥹', ''), data
                            }
                        // }
                    }
                }
            ]
        },
        'isee.weishi.qq.com': {
            title: '微视', id: 'weishi',
            rules: [
                {
                    url: 'https://api.weishi.qq.com/trpc.weishi.weishi_h5_proxy.weishi_h5_proxy/GetPersonalFeedList',
                    type: 'network',
                    parseList: json => json?.rsp_body?.feeds,
                    parseItem: data => {
                        let {feed_desc, id, poster, publishtime, urls, video_cover, createtime } = data
                        return {
                            status: WAITTING, author_name: poster?.nick, id, url: 'https://isee.weishi.qq.com/ws/app-pages/share/index.html?id='+id,
                            cover: video_cover.static_cover.url,
                            urls, title: feed_desc,
                            create_time: createtime * 1000,
                            data
                        }
                    }
                }
            ]
        },
        'www.kuaishou.com': {
            title: '快手', id: 'kuaishou',
            rules: [
              // 旧版快手
                {
                    url: 'https://www.kuaishou.com/graphql',
                    type: 'json',
                    parseList: json => {
                        let href = location.href
                        if(href.startsWith('https://www.kuaishou.com/profile/')){
                            return json?.data?.visionProfileLikePhotoList?.feeds || json?.data?.visionProfilePhotoList?.feeds
                        }
                        if(href.startsWith('https://www.kuaishou.com/search/')){
                            return json?.data?.visionSearchPhoto?.feeds
                        }
                    },
                    parseItem: data => {
                        let {photo, author} = data
                        return {
                            status: WAITTING, author_name: author.name, id: photo.id, url: 'https://www.kuaishou.com/short-video/'+photo.id,
                            cover: photo.coverUrl,
                            urls: photo.photoUrl,
                            create_time: photo.timestamp,
                            // urls: photo.videoResource.h264.adaptationSet[0].representation[0].url,
                            title: photo.originCaption,
                            data
                        }
                    }
                },
              // 新版快手
              {
                    url: 'https://www.kuaishou.com/rest/v/profile/feed',
                    type: 'json',
                    parseList: json => {
                        return json.feeds;
                    },
                    parseItem: data => {
                        let {photo, author} = data
                        return {
                            status: WAITTING, author_name: author.name, id: photo.id, url: 'https://www.kuaishou.com/short-video/'+photo.id,
                            cover: photo.coverUrl,
                            urls: photo.photoUrls[0].url,
                            create_time: photo.timestamp,
                            // urls: photo.videoResource.h264.adaptationSet[0].representation[0].url,
                            title: photo.caption,
                            data
                        }
                    }
                }
            ],
        },
        'www.toutiao.com': {
            title: '今日头条短视频', id: 'toutiao',
            rules: [
                {
                    url: 'https://www.toutiao.com/api/pc/list/user/feed',
                    type: 'json',
                    parseList: json => json?.data,
                    parseItem: data => {
                        let {video, title, id, user, thumb_image_list, create_time} = data
                        return {
                            status: WAITTING, id, title, data,
                            url: 'https://www.toutiao.com/video/'+id,
                            cover: thumb_image_list[0].url,
                            author_name: user.info.name,
                            create_time: create_time * 1000,
                            urls: video.download_addr.url_list[0],
                        }
                    }
                }
            ],
        },
        'www.douyin.com': {
            title: '抖音', id: 'douyin',
            scrollContainer: {
                'https://www.douyin.com/user/': '.route-scroll-container'
            },
            hosts: [0, 1, 2], // 3个线路
            runAtWindowLoaded: false,
            /*bindVideoElement: {
                initElement: node => {
                    let par = getParent(node, el => el?.dataset?.e2eVid)
                    if(par) return {id: par.dataset.e2eVid}
                    let id = cutString(location.href + '?', '/video/', '?')
                    if(id) return {id}
                }
            },*/
            timeout: {
                '/user/': 500,
                '/note/': 500,
                '/video/': 500,
                '/search/': 500,
            },
            rules: [
                {
                    type: 'object',
                    getObject: window => {
                        let noteId = cutString(window.location.href + '#', '/note/', '#')
                        if(noteId){
                            let raw = cutString((window?.self?.__pace_f ?? []).filter(arr => arr.length == 2).map(([k, v]) => v || '').join(''), '"aweme":{', ',"comment').replaceAll(`\\"`, '')
                            if(raw.at(-1) == '}'){
                                let json = JSON.parse("{"+raw)
                                if(json.detail.awemeId == noteId) return json
                            }
                        }
                    },
                    parseList: json => {
                        return json ? [json.detail] : []
                    },
                    parseItem: parseDouyinList
                },
                { // 个人喜欢
                    url: 'https://www.douyin.com/aweme/v1/web/aweme/favorite/',
                    type: 'network',
                    parseList: json => location.href == 'https://www.douyin.com/user/self?from_tab_name=main&showTab=like' ? json?.aweme_list : [],
                    parseItem: parseDouyinList,
                },
                { // 个人收藏
                    url: 'https://www.douyin.com/aweme/v1/web/aweme/listcollection/',
                    type: 'network',
                    parseList: json => location.href == 'https://www.douyin.com/user/self?from_tab_name=main&showTab=favorite_collection' ? json?.aweme_list : [],
                    parseItem: parseDouyinList,
                },
                {
                    url: 'https://(.*?).douyin.com/aweme/v1/web/aweme/post/',
                    type: 'network',
                    parseList: json => location.href.startsWith('https://www.douyin.com/user/') ? json?.aweme_list : [],
                    parseItem: parseDouyinList
                }, {
                    url: 'https://www.douyin.com/aweme/v1/web/general/search/single/',
                    type: 'network',
                    parseList: json => json?.data,
                    parseItem: data => parseDouyinList(data.aweme_info)
                },{
                    url: 'https://www.douyin.com/aweme/v1/web/aweme/detail/',
                    type: 'network',
                    parseList: json => location.href.startsWith('https://www.douyin.com/video/') ? [json.aweme_detail] : [],
                    parseItem: parseDouyinList
                },
            ]
        },
         'www.tiktok.com': {
            title: '国际版抖音', id: 'tiktok',
            rules: [
                {
                    url: 'https://www.tiktok.com/api/post/item_list/',
                    type: 'respone.json',
                    parseList: json => json?.itemList,
                    parseItem: data => {
                        let {video, desc, author, id, createTime} = data
                        return {
                            status: WAITTING, id,
                            url: 'https://www.tiktok.com/@'+ author.uniqueId +'/video/'+id,
                            cover: video.originCover,
                            author_name: author.nickname,
                            create_time: createTime * 1000,
                            //urls: video.downloadAddr,
                            urls: video?.bitrateInfo?.[0]?.PlayAddr.UrlList[0],
                            title: desc,
                            data
                        }
                    }
                },
                {
                    url: 'https://www.tiktok.com/api/search/general/full/',
                    type: 'respone.json',
                    parseList: json => json?.data,
                    parseItem: data => {
                        let {video, desc, author, id, createTime} = data.item
                        return {
                            status: WAITTING, id,
                            url: 'https://www.tiktok.com/@'+ author.uniqueId +'/video/'+id,
                            cover: video.originCover,
                            author_name: author.nickname,
                            create_time: createTime * 1000,
                            urls: video?.bitrateInfo?.[0]?.PlayAddr.UrlList?.at(-1),
                            title: desc,
                            data
                        }
                    }
                }
            ]
        },
         'www.instagram.com': {
            title: 'INS', id: 'instagram',
            rules: [
                {
                    url: 'https://www.instagram.com/graphql/query',
                    type: 'network',
                    parseList: json => json?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges,
                    parseItem: data => {
                        // media_type == 2
                        let {code, owner, product_type, image_versions2, video_versions, caption } = data.node
                        if(product_type == "clips") return {
                            // owner.id
                            status: WAITTING, id: code,
                            url: 'https://www.instagram.com/reel/'+code+'/',
                            cover: image_versions2.candidates[0].url,
                            author_name: owner.username,
                            urls: video_versions[0].url,
                            create_time: caption.created_at * 1000,
                            title: caption.text,
                            data
                        }
                    }
                }
            ]
        },
        'artlist.io': {
            title: 'artlist', id: 'artlist',
            rules: [
                {
                    // url: 'https://search-api.artlist.io/v1/graphql',
                    type: 'json',
                    parseList: json => {
                        return json?.data?.story?.clips || json?.data?.clipList?.exactResults
                    },
                    parseItem: data => {
                        let {thumbnailUrl, clipPath, clipName, orientation, id, clipNameForUrl, storyNameForURL } = data
                        return {
                            status: WAITTING, id, downloadTool: 'm3u8dl',
                            url: 'https://artlist.io/stock-footage/clip/'+clipNameForUrl+'/'+id,
                            cover: thumbnailUrl,
                            author_name: storyNameForURL,
                            urls: [{url: clipPath.replace('playlist', '1080p'), type: ""}],
                            title: clipName,
                            data
                        }
                    }
                }
            ]
        }
    }
    let DETAIL = this.DETAIL = this.HOSTS[location.host]
    if(!DETAIL) return
    console.log(DETAIL)
    var originalParse, originalSend, originalFetch, originalResponseJson
    const initFun = () => {
        originalParse = JSON.parse, originalSend = XMLHttpRequest.prototype.send, originalFetch = unsafeWindow._fetch = unsafeWindow.fetch, originalResponseJson = Response.prototype.json
        if(this.options.firstRun){
            this.options.firstRun = false
            this.saveOptions()
            alert("欢迎使用此视频批量下载脚本，以下是常见问题:\n【1】.Q:为什么没有显示下载入口？A:当前网址不支持\n【2】Q:为什么捕获不到视频?A:试着滚动视频列表，让他进行加载\n【3】Q:为什么抖音主页显示用户未找到?A:多刷新几次【4】Q:提示下载失败怎么办?A:可以批量导出链接用第三方软件进行下载（如IDM）")
        }
        this.setBadge("等待滚动捕获数据中...")
    }

    var resources = this.resources, object_callbacks = []
    const hook = () => {
        let json_callbacks = [], network_callbacks = [], fetch_callbacks = [], respone_json_callbacks = []
        DETAIL.rules.forEach(({type, parseList, parseItem, url, getObject, match}, rule_index) => {
            const callback = json => {
                // console.log(json)
                try {
                    // TODO sort
                    let cnt = resources.push(...(flattenArray((parseList(json) || []).map(item => toArr(parseItem(item)).map(_item => Object.assign(_item || {}, {rule_index})))).filter(item => item.id && !resources.find(({id, index}) => id == item.id && index == item.index))))
                    if(cnt <= 0) return
                    this.tryAutoRenameAll()
                    this.setBadge(`下载 ${cnt} 个视频`)
                } catch(err){
                 console.error(err)
                }
            }
            switch(type){
                case 'object':
                    let obj = getObject(unsafeWindow)
                    return callback(obj)
                case 'json':
                    return json_callbacks.push(json => callback(Object.assign({}, json)))
                case 'network':
                    return network_callbacks.push({url, callback})
                case 'fetch':
                    return fetch_callbacks.push({url, callback})
                case 'respone.json':
                    return respone_json_callbacks.push(json => callback(Object.assign({}, json)))
            }
        })
        if(json_callbacks.length){
            JSON.parse = function(...args) {
                let json = originalParse.apply(JSON, args)
                json_callbacks.forEach(cb => cb(json))
                return json
            }
        }
        if(respone_json_callbacks.length){
            Object.defineProperty(Response.prototype, 'json', {
                value: function() {
                    let ret = originalResponseJson.apply(this, arguments)
                    ret.then(json => respone_json_callbacks.forEach(cb => cb(json)))
                    return ret
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        }
        const cb = (callbacks, {fullURL, raw}) => {
            callbacks.forEach(({url, callback}) => {
                if(new RegExp(url).test(fullURL) && typeof(raw) == 'string' && (raw.startsWith('{') && raw.endsWith('}') || raw.startsWith('[') && raw.endsWith(']'))){
                    callback(JSON.parse(raw))
                }
            })
        }
        if(network_callbacks.length){
             XMLHttpRequest.prototype.send = function() {
                this.addEventListener('load', function() {
                    if(['', 'text'].includes(this.responseType)) cb(network_callbacks ,{fullURL: this.responseURL, raw: this.responseText})
                })
                originalSend.apply(this, arguments)
            }
        }
        if(fetch_callbacks.length){
           unsafeWindow.fetch = function() {
                return originalFetch.apply(this, arguments).then(response => {
                    if (response.status == 200) {
                        response.clone().text().then(raw => {
                           cb(fetch_callbacks, {fullURL: response.url, raw})
                        })
                    }
                    return response
                })
            }
        }
    }
    let timeout = Object.entries(DETAIL.timeout || {}).find(([path, ms]) => (unsafeWindow.location.pathname || '').startsWith(path))?.[1] || 0
    const start = () => {
        if(!this.inited){
            this.inited = true
            setTimeout(() => initFun() & hook() & setInterval(() => hook(), 250), timeout)
        }
    }
    if(!DETAIL.runAtWindowLoaded) start()
    window.onload = () => start() & (DETAIL.bindVideoElement && this.bindVideoElement(DETAIL.bindVideoElement)) & this.initAction()
  },

    tryAutoRenameAll(){
      if(this.options.autoRename && this.isShowing()){
          if(!this.initedRename){
              this.initedRename = true
              let lastName = this.options.lastRename
              if(typeof(lastName) == 'string') $('#_filename')[0].value = lastName
          }
          this.applyRenameAll()
      }
    },

   autoScroll_timer: -1, autoScroll: false,
   switchAutoScroll(enable){
       if(this.autoScroll_timer){
           clearInterval(this.autoScroll_timer)
           this.autoScroll_timer = -1
       }
       if(this.autoScroll = enable ?? !this.autoScroll){
           let auto_download = confirm('捕获结束后是否开启自动下载?(不要最小化浏览器窗口！！！)')
           var auto_rename = false
           if(auto_download) auto_rename = confirm('下载前是否应用名称更改？')
           this.writeLog(`开启自动滚动捕获,自动下载【${auto_download ? '开' : '关'}】`)
           let _max = 10, _retry = 0
           const next = () => {
               let scrollContainer = Object.entries(this.DETAIL.scrollContainer ?? {}).find(([host, selector]) => new RegExp(host).test(location.href))
               if(scrollContainer){
                   let container = document.querySelectorAll(scrollContainer[1])[0]
                   if(container) container.scrollTop = container.scrollHeight
               }else{
                   unsafeWindow.scrollTo(0, document.body.scrollHeight)
               }
               let _old = this.resources.length
               setTimeout(() => {
                   let _new = this.resources.length
                   if(_old == _new){
                       this.writeLog(`没有捕获到视频，将会在重试${_max - _retry}次后结束`)
                       if(_max - _retry++ <= 0){
                           this.writeLog('成功捕获所有的视频')
                           this.switchAutoScroll(false)
                           if(auto_download){
                               auto_rename && this.applyRenameAll()
                               this.switchRunning(true)
                           }
                           return
                       }
                   }else{
                       this.writeLog(`捕获到${_new - _old}个视频,当前视频总数${_new}`)
                       this.updateTable()
                   }
                   setTimeout(() => next(), 500)
               }, 2000)
           }
           next()
       }else{
           this.writeLog(`开启关闭滚动捕获`)
       }
   },

  setList(list, refresh = true){
    this.resources = list
    refresh && this.refresh()
  },

  refresh(){
      this.showList()
      document.querySelector('#_ftb').innerHTML = createHTML(`下载 ${this.resources.length} 个视频`)
  },

    bindVideoElement({callback, initElement}){
        return
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') return
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName == 'VIDEO') {
                        let {id} = initElement(node) || {}
                        let item = this.findItem(id)
                        if(!item) return
                        let url = item.urls || node.currentSrc || node.querySelector('source')?.src
                        // if(!url || url.startsWith('blob')){ }
                        if(!node.querySelector('._btn_download')){
                            let el = document.createElement('div')
                            el.classList.className = '_btn_download'
                            el.style.cssText = 'width: 30px;margin: 5px;background-color: rgba(0, 0, 0, .4);color: white;cursor: pointer;position: relative;left: 0;top: 0;z-index: 9999;'
                            el.onclick = ev => {
                                const onError = () => false && alert(`下载失败`)
                                GM_download({
                                    url, name: this.safeFileName(item.title) + '.mp4', headers:  this.getHeaders(url),
                                    onload: ({status}) => {
                                        if(status == 502 || status == 404){
                                            onError()
                                        }
                                    },
                                    ontimeout: onError,
                                    onerror: onError,
                                })
                                el.remove() & ev.stopPropagation(true) & ev.preventDefault()
                            }
                            el.innerHTML = createHTML('下载')
                            el.title = '点击下载'
                            node.before(el)
                        }
                    }
                })
            }
        })
        observer.observe(document.body, {
            childList: true, // 观察子节点的增减
            subtree: true     // 观察后代节点
        })
    },

    getHeaders(url){
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            // 'Referer': url,
            'Range': 'bytes=0-',
            'Referer': location.protocol+'//'+ location.host
        }
    },

  showList(){ // 展示主界面
    let threads = this.options['threads']
    this.showDialog({
      id: '_dialog',
      html: `
      <div style="display: inline-flex;flex-wrap: wrap;width: 100%;justify-content: space-around;height: 5%;min-height: 30px;">
          <div>
            <button id="_selectAll">全选</button>
            <button id="_reverSelectAll">反选</button>
            <button id="_clear_log">清空日志</button>
          </div>
          <div>
            命名规则:
            <input type="text" id="_filename" value="【{发布者}】{标题}({id})" title="允许的变量：{发布者} {标题} {id} {i}">
            <button id="_apply_filename">应用</button>
            <button id="_apply_filename_help">帮助</button>
          </div>
          <div>
            下载线程数:
            <input id="_threads" type="range" value=${threads} step=1 min=1 max=32>
            <span id="_threads_span">${threads}</span>
            <span style="margin-right: 10px;">Aria2下载</span><input type="checkbox" data-for="useAria2c" ${this.options.useAria2c ? 'checked': ''}>
          </div>
          <div>
            <button id="_settings">设置</button>
            <button id="_autoScroll">滚动捕获</button>
            <button id="_clearDownloads">清空已下载</button>
            <button id="_reDownloads">重新下载</button>
            <button id="_switchRunning" disabled>开始</button>
          </div>
        </div>
        <div style="height: 70%;overflow-y: scroll;">
          <table width="90%" border="2" style="margin: 0 auto;"></table>
          </div>
          <div style="height: 25%; width: 100%;border-top: 2px solid white;">
            <div style="position: relative;height: 100%;">
              <div style="position: absolute;right: 0;top: 0;padding: 10px;"><span style="margin-right: 10px;">自动滚动</span><input type="checkbox" data-for="autoScroll" ${this.options.autoScroll ? 'checked': ''}></div>
              <pre id="_log" style="background-color: rgba(255, 255, 255, .2);color: rgba(0, 0, 0, .8);overflow-y: scroll;height: 90%;"></pre>
            </div>
          </div>`,
         callback: dialog => {
             if(!this.aria2c) this.enableAria2c(this.options.useAria2c)
             this.initInputs(dialog) & this.updateTable()
             this.tryAutoRenameAll()
         },
         onClose: () => this.resources.forEach(item => item.status = WAITTING)
    }) & this.bindEvents() & [
      `欢迎使用本脚本！当前版本: ${VERSION} 发布日期: ${RELEASE_DATE}`,
      `此脚本仅供学习交流使用！！请勿用于非法用途！`
    ].forEach(msg => this.writeLog(msg, '声明')) & this.loadDownloader()
  },
  loadDownloader(){
    this.writeLog('正在加载下载功能模块...')
    // loadRes(['https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js', 'https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js', 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js'], () => {
      !function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e=e||self).WebStreamsPolyfill={})}(this,(function(e){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol:function(e){return"Symbol("+e+")"};var t=Number.isNaN||function(e){return e!=e};function o(e){return"object"==typeof e&&null!==e||"function"==typeof e}function n(e){return e.slice()}function i(e){return!1!==function(e){if("number"!=typeof e)return!1;if(t(e))return!1;if(e<0)return!1;return!0}(e)&&e!==1/0}function a(e,r,t){if("function"!=typeof e)throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,r,t)}function s(e,r,t,o){var n=e[r];if(void 0!==n){if("function"!=typeof n)throw new TypeError(n+" is not a method");switch(t){case 0:return function(){return l(n,e,o)};case 1:return function(r){var t=[r].concat(o);return l(n,e,t)}}}return function(){return Promise.resolve()}}function u(e,r,t){var o=e[r];if(void 0!==o)return a(o,e,t)}function l(e,r,t){try{return Promise.resolve(a(e,r,t))}catch(e){return Promise.reject(e)}}function c(e){if(e=Number(e),t(e)||e<0)throw new RangeError("highWaterMark property of a queuing strategy must be non-negative and non-NaN");return e}function f(e){if(void 0===e)return function(){return 1};if("function"!=typeof e)throw new TypeError("size property of a queuing strategy must be a function");return function(r){return e(r)}}function d(e,r,t){for(var o=!1,n=function(e){!1===o&&(o=!0,t(e))},i=0,a=0,s=e.length,u=new Array(s),l=function(e){var t=i;!function(e,r,t){Promise.prototype.then.call(e,r,t)}(e,(function(e){u[t]=e,++a===s&&r(u)}),n),++i},c=0,f=e;c<f.length;c++){l(f[c])}}var _=function(){},h=function(){function e(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0}return Object.defineProperty(e.prototype,"length",{get:function(){return this._size},enumerable:!0,configurable:!0}),e.prototype.push=function(e){var r=this._back,t=r;16383===r._elements.length&&(t={_elements:[],_next:void 0}),r._elements.push(e),t!==r&&(this._back=t,r._next=t),++this._size},e.prototype.shift=function(){var e=this._front,r=e,t=this._cursor,o=t+1,n=e._elements,i=n[t];return 16384===o&&(r=e._next,o=0),--this._size,this._cursor=o,e!==r&&(this._front=r),n[t]=void 0,i},e.prototype.forEach=function(e){for(var r=this._cursor,t=this._front,o=t._elements;!(r===o.length&&void 0===t._next||r===o.length&&(r=0,0===(o=(t=t._next)._elements).length));)e(o[r]),++r},e.prototype.peek=function(){var e=this._front,r=this._cursor;return e._elements[r]},e}();function b(e){var r=e._queue.shift();return e._queueTotalSize-=r.size,e._queueTotalSize<0&&(e._queueTotalSize=0),r.value}function p(e,r,t){if(!i(t=Number(t)))throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e._queue.push({value:r,size:t}),e._queueTotalSize+=t}function m(e){e._queue=new h,e._queueTotalSize=0}var y=r("[[AbortSteps]]"),v=r("[[ErrorSteps]]"),w=function(){function e(e,r){void 0===e&&(e={}),void 0===r&&(r={}),S(this);var t=r.size,o=r.highWaterMark;if(void 0!==e.type)throw new RangeError("Invalid type is specified");var n=f(t);void 0===o&&(o=1),function(e,r,t,o){var n=Object.create(M.prototype);function i(){return u(r,"start",[n])}var a=s(r,"write",1,[n]),l=s(r,"close",0,[]),c=s(r,"abort",1,[]);x(e,n,i,a,l,c,t,o)}(this,e,o=c(o),n)}return Object.defineProperty(e.prototype,"locked",{get:function(){if(!1===R(this))throw Q("locked");return P(this)},enumerable:!0,configurable:!0}),e.prototype.abort=function(e){return!1===R(this)?Promise.reject(Q("abort")):!0===P(this)?Promise.reject(new TypeError("Cannot abort a stream that already has a writer")):T(this,e)},e.prototype.getWriter=function(){if(!1===R(this))throw Q("getWriter");return g(this)},e}();function g(e){return new W(e)}function S(e){e._state="writable",e._storedError=void 0,e._writer=void 0,e._writableStreamController=void 0,e._writeRequests=new h,e._inFlightWriteRequest=void 0,e._closeRequest=void 0,e._inFlightCloseRequest=void 0,e._pendingAbortRequest=void 0,e._backpressure=!1}function R(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")}function P(e){return void 0!==e._writer}function T(e,r){var t=e._state;if("closed"===t||"errored"===t)return Promise.resolve(void 0);if(void 0!==e._pendingAbortRequest)return e._pendingAbortRequest._promise;var o=!1;"erroring"===t&&(o=!0,r=void 0);var n=new Promise((function(t,n){e._pendingAbortRequest={_promise:void 0,_resolve:t,_reject:n,_reason:r,_wasAlreadyErroring:o}}));return e._pendingAbortRequest._promise=n,!1===o&&j(e,r),n}function q(e,r){"writable"!==e._state?E(e):j(e,r)}function j(e,r){var t=e._writableStreamController;e._state="erroring",e._storedError=r;var o=e._writer;void 0!==o&&I(o,r),!1===function(e){if(void 0===e._inFlightWriteRequest&&void 0===e._inFlightCloseRequest)return!1;return!0}(e)&&!0===t._started&&E(e)}function E(e){e._state="errored",e._writableStreamController[v]();var r=e._storedError;if(e._writeRequests.forEach((function(e){e._reject(r)})),e._writeRequests=new h,void 0!==e._pendingAbortRequest){var t=e._pendingAbortRequest;if(e._pendingAbortRequest=void 0,!0===t._wasAlreadyErroring)return t._reject(r),void A(e);e._writableStreamController[y](t._reason).then((function(){t._resolve(),A(e)}),(function(r){t._reject(r),A(e)}))}else A(e)}function C(e){return void 0!==e._closeRequest||void 0!==e._inFlightCloseRequest}function A(e){void 0!==e._closeRequest&&(e._closeRequest._reject(e._storedError),e._closeRequest=void 0);var r=e._writer;void 0!==r&&Z(r,e._storedError)}function O(e,r){var t=e._writer;void 0!==t&&r!==e._backpressure&&(!0===r?function(e){ee(e)}(t):ne(t)),e._backpressure=r}var W=function(){function e(e){if(!1===R(e))throw new TypeError("WritableStreamDefaultWriter can only be constructed with a WritableStream instance");if(!0===P(e))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=e,e._writer=this;var r,t=e._state;if("writable"===t)!1===C(e)&&!0===e._backpressure?ee(this):te(this),K(this);else if("erroring"===t)re(this,e._storedError),K(this);else if("closed"===t)te(this),K(r=this),$(r);else{var o=e._storedError;re(this,o),X(this,o)}}return Object.defineProperty(e.prototype,"closed",{get:function(){return!1===k(this)?Promise.reject(G("closed")):this._closedPromise},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"desiredSize",{get:function(){if(!1===k(this))throw G("desiredSize");if(void 0===this._ownerWritableStream)throw J("desiredSize");return function(e){var r=e._ownerWritableStream,t=r._state;if("errored"===t||"erroring"===t)return null;if("closed"===t)return 0;return N(r._writableStreamController)}(this)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"ready",{get:function(){return!1===k(this)?Promise.reject(G("ready")):this._readyPromise},enumerable:!0,configurable:!0}),e.prototype.abort=function(e){return!1===k(this)?Promise.reject(G("abort")):void 0===this._ownerWritableStream?Promise.reject(J("abort")):function(e,r){return T(e._ownerWritableStream,r)}(this,e)},e.prototype.close=function(){if(!1===k(this))return Promise.reject(G("close"));var e=this._ownerWritableStream;return void 0===e?Promise.reject(J("close")):!0===C(e)?Promise.reject(new TypeError("cannot close an already-closing stream")):z(this)},e.prototype.releaseLock=function(){if(!1===k(this))throw G("releaseLock");void 0!==this._ownerWritableStream&&F(this)},e.prototype.write=function(e){return!1===k(this)?Promise.reject(G("write")):void 0===this._ownerWritableStream?Promise.reject(J("write to")):L(this,e)},e}();function k(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")}function z(e){var r=e._ownerWritableStream,t=r._state;if("closed"===t||"errored"===t)return Promise.reject(new TypeError("The stream (in "+t+" state) is not in the writable state and cannot be closed"));var o,n=new Promise((function(e,t){var o={_resolve:e,_reject:t};r._closeRequest=o}));return!0===r._backpressure&&"writable"===t&&ne(e),p(o=r._writableStreamController,"close",0),Y(o),n}function B(e,r){"pending"===e._closedPromiseState?Z(e,r):function(e,r){X(e,r)}(e,r)}function I(e,r){"pending"===e._readyPromiseState?oe(e,r):function(e,r){re(e,r)}(e,r)}function F(e){var r=e._ownerWritableStream,t=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");I(e,t),B(e,t),r._writer=void 0,e._ownerWritableStream=void 0}function L(e,r){var t=e._ownerWritableStream,o=t._writableStreamController,n=function(e,r){try{return e._strategySizeAlgorithm(r)}catch(r){return H(e,r),1}}(o,r);if(t!==e._ownerWritableStream)return Promise.reject(J("write to"));var i=t._state;if("errored"===i)return Promise.reject(t._storedError);if(!0===C(t)||"closed"===i)return Promise.reject(new TypeError("The stream is closing or closed and cannot be written to"));if("erroring"===i)return Promise.reject(t._storedError);var a=function(e){return new Promise((function(r,t){var o={_resolve:r,_reject:t};e._writeRequests.push(o)}))}(t);return function(e,r,t){var o={chunk:r};try{p(e,o,t)}catch(r){return void H(e,r)}var n=e._controlledWritableStream;if(!1===C(n)&&"writable"===n._state){O(n,U(e))}Y(e)}(o,r,n),a}var M=function(){function e(){throw new TypeError("WritableStreamDefaultController cannot be constructed explicitly")}return e.prototype.error=function(e){if(!1===function(e){if(!o(e))return!1;if(!Object.prototype.hasOwnProperty.call(e,"_controlledWritableStream"))return!1;return!0}(this))throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");"writable"===this._controlledWritableStream._state&&V(this,e)},e.prototype[y]=function(e){var r=this._abortAlgorithm(e);return D(this),r},e.prototype[v]=function(){m(this)},e}();function x(e,r,t,o,n,i,a,s){r._controlledWritableStream=e,e._writableStreamController=r,r._queue=void 0,r._queueTotalSize=void 0,m(r),r._started=!1,r._strategySizeAlgorithm=s,r._strategyHWM=a,r._writeAlgorithm=o,r._closeAlgorithm=n,r._abortAlgorithm=i;var u=U(r);O(e,u);var l=t();Promise.resolve(l).then((function(){r._started=!0,Y(r)}),(function(t){r._started=!0,q(e,t)})).catch(_)}function D(e){e._writeAlgorithm=void 0,e._closeAlgorithm=void 0,e._abortAlgorithm=void 0,e._strategySizeAlgorithm=void 0}function N(e){return e._strategyHWM-e._queueTotalSize}function Y(e){var r=e._controlledWritableStream;if(!1!==e._started&&void 0===r._inFlightWriteRequest)if("erroring"!==r._state){if(0!==e._queue.length){var t=e._queue.peek().value;"close"===t?function(e){var r=e._controlledWritableStream;(function(e){e._inFlightCloseRequest=e._closeRequest,e._closeRequest=void 0})(r),b(e);var t=e._closeAlgorithm();D(e),t.then((function(){!function(e){e._inFlightCloseRequest._resolve(void 0),e._inFlightCloseRequest=void 0,"erroring"===e._state&&(e._storedError=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)),e._state="closed";var r=e._writer;void 0!==r&&$(r)}(r)}),(function(e){!function(e,r){e._inFlightCloseRequest._reject(r),e._inFlightCloseRequest=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._reject(r),e._pendingAbortRequest=void 0),q(e,r)}(r,e)})).catch(_)}(e):function(e,r){var t=e._controlledWritableStream;!function(e){e._inFlightWriteRequest=e._writeRequests.shift()}(t);var o=e._writeAlgorithm(r);o.then((function(){!function(e){e._inFlightWriteRequest._resolve(void 0),e._inFlightWriteRequest=void 0}(t);var r=t._state;if(b(e),!1===C(t)&&"writable"===r){var o=U(e);O(t,o)}Y(e)}),(function(r){"writable"===t._state&&D(e),function(e,r){e._inFlightWriteRequest._reject(r),e._inFlightWriteRequest=void 0,q(e,r)}(t,r)})).catch(_)}(e,t.chunk)}}else E(r)}function H(e,r){"writable"===e._controlledWritableStream._state&&V(e,r)}function U(e){return N(e)<=0}function V(e,r){var t=e._controlledWritableStream;D(e),j(t,r)}function Q(e){return new TypeError("WritableStream.prototype."+e+" can only be used on a WritableStream")}function G(e){return new TypeError("WritableStreamDefaultWriter.prototype."+e+" can only be used on a WritableStreamDefaultWriter")}function J(e){return new TypeError("Cannot "+e+" a stream using a released writer")}function K(e){e._closedPromise=new Promise((function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t,e._closedPromiseState="pending"}))}function X(e,r){K(e),Z(e,r)}function Z(e,r){e._closedPromise.catch((function(){})),e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="rejected"}function $(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="resolved"}function ee(e){e._readyPromise=new Promise((function(r,t){e._readyPromise_resolve=r,e._readyPromise_reject=t})),e._readyPromiseState="pending"}function re(e,r){ee(e),oe(e,r)}function te(e){ee(e),ne(e)}function oe(e,r){e._readyPromise.catch((function(){})),e._readyPromise_reject(r),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="rejected"}function ne(e){e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="fulfilled"}var ie,ae,se=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e};"symbol"==typeof r.asyncIterator&&((ie={})[r.asyncIterator]=function(){return this},ae=ie,Object.defineProperty(ae,r.asyncIterator,{enumerable:!1}));var ue=r("[[CancelSteps]]"),le=r("[[PullSteps]]"),ce=function(){function e(e,r){void 0===e&&(e={}),void 0===r&&(r={}),he(this);var t=r.size,o=r.highWaterMark,n=e.type;if("bytes"===String(n)){if(void 0!==t)throw new RangeError("The strategy for a byte stream cannot have a size function");void 0===o&&(o=0),function(e,r,t){var o=Object.create(Ke.prototype);function n(){return u(r,"start",[o])}var i=s(r,"pull",0,[o]),a=s(r,"cancel",1,[]),l=r.autoAllocateChunkSize;if(void 0!==l&&(l=Number(l),!1===se(l)||l<=0))throw new RangeError("autoAllocateChunkSize must be a positive integer");!function(e,r,t,o,n,i,a){r._controlledReadableByteStream=e,r._pullAgain=!1,r._pulling=!1,r._byobRequest=void 0,r._queue=r._queueTotalSize=void 0,m(r),r._closeRequested=!1,r._started=!1,r._strategyHWM=c(i),r._pullAlgorithm=o,r._cancelAlgorithm=n,r._autoAllocateChunkSize=a,r._pendingPullIntos=new h,e._readableStreamController=r;var s=t();Promise.resolve(s).then((function(){r._started=!0,$e(r)}),(function(e){fr(r,e)})).catch(_)}(e,o,n,i,a,t,l)}(this,e,o=c(o))}else{if(void 0!==n)throw new RangeError("Invalid type is specified");var i=f(t);void 0===o&&(o=1),function(e,r,t,o){var n=Object.create(Le.prototype);function i(){return u(r,"start",[n])}var a=s(r,"pull",0,[n]),l=s(r,"cancel",1,[]);Ge(e,n,i,a,l,t,o)}(this,e,o=c(o),i)}}return Object.defineProperty(e.prototype,"locked",{get:function(){if(!1===be(this))throw hr("locked");return pe(this)},enumerable:!0,configurable:!0}),e.prototype.cancel=function(e){return!1===be(this)?Promise.reject(hr("cancel")):!0===pe(this)?Promise.reject(new TypeError("Cannot cancel a stream that already has a reader")):ge(this,e)},e.prototype.getReader=function(e){var r=(void 0===e?{}:e).mode;if(!1===be(this))throw hr("getReader");if(void 0===r)return de(this,!0);if("byob"===(r=String(r)))return function(e,r){void 0===r&&(r=!1);var t=new Oe(e);return t._forAuthorCode=r,t}(this,!0);throw new RangeError("Invalid mode is specified")},e.prototype.pipeThrough=function(e,r){var t=e.writable,o=e.readable,n=void 0===r?{}:r,i=n.preventClose,a=n.preventAbort,s=n.preventCancel,u=n.signal;if(!1===be(this))throw hr("pipeThrough");if(!1===R(t))throw new TypeError("writable argument to pipeThrough must be a WritableStream");if(!1===be(o))throw new TypeError("readable argument to pipeThrough must be a ReadableStream");if(i=Boolean(i),a=Boolean(a),s=Boolean(s),void 0!==u&&!_r(u))throw new TypeError("ReadableStream.prototype.pipeThrough's signal option must be an AbortSignal");if(!0===pe(this))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(!0===P(t))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");return ye(this,t,i,a,s,u).catch((function(){})),o},e.prototype.pipeTo=function(e,r){var t=void 0===r?{}:r,o=t.preventClose,n=t.preventAbort,i=t.preventCancel,a=t.signal;return!1===be(this)?Promise.reject(hr("pipeTo")):!1===R(e)?Promise.reject(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream")):(o=Boolean(o),n=Boolean(n),i=Boolean(i),void 0===a||_r(a)?!0===pe(this)?Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):!0===P(e)?Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):ye(this,e,o,n,i,a):Promise.reject(new TypeError("ReadableStream.prototype.pipeTo's signal option must be an AbortSignal")))},e.prototype.tee=function(){if(!1===be(this))throw hr("tee");var e=function(e,r){var t,o,i,a,s,u=de(e),l=!1,c=!1,f=!1,d=new Promise((function(e){s=e}));function _(){return Fe(u).then((function(e){if(!0!==l){if(!0===e.done)return!1===c&&Ye(i._readableStreamController),!1===f&&Ye(a._readableStreamController),void(l=!0);var r=e.value,t=r,o=r;!1===c&&He(i._readableStreamController,t),!1===f&&He(a._readableStreamController,o)}}))}function h(r){if(c=!0,t=r,!0===f){var i=n([t,o]),a=ge(e,i);s(a)}return d}function b(r){if(f=!0,o=r,!0===c){var i=n([t,o]),a=ge(e,i);s(a)}return d}function p(){}return i=_e(p,_,h),a=_e(p,_,b),u._closedPromise.catch((function(e){Ue(i._readableStreamController,e),Ue(a._readableStreamController,e)})),[i,a]}(this);return n(e)},e.prototype.getIterator=function(e){var r=(void 0===e?{}:e).preventCancel;if(!1===be(this))throw hr("getIterator");var t=de(this),o=Object.create(fe);return o._asyncIteratorReader=t,o._preventCancel=Boolean(r),o},e}(),fe={next:function(){if(!1===me(this))return Promise.reject(br("next"));var e=this._asyncIteratorReader;return void 0===e._ownerReadableStream?Promise.reject(pr("iterate")):Fe(e).then((function(r){var t=r.done;return t&&Ie(e),Re(r.value,t,!0)}))},return:function(e){if(!1===me(this))return Promise.reject(br("next"));var r=this._asyncIteratorReader;if(void 0===r._ownerReadableStream)return Promise.reject(pr("finish iterating"));if(r._readRequests.length>0)return Promise.reject(new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled"));if(!1===this._preventCancel){var t=Be(r,e);return Ie(r),t.then((function(){return Re(e,!0,!0)}))}return Ie(r),Promise.resolve(Re(e,!0,!0))}};function de(e,r){void 0===r&&(r=!1);var t=new Ae(e);return t._forAuthorCode=r,t}function _e(e,r,t,o,n){void 0===o&&(o=1),void 0===n&&(n=function(){return 1});var i=Object.create(ce.prototype);return he(i),Ge(i,Object.create(Le.prototype),e,r,t,o,n),i}function he(e){e._state="readable",e._reader=void 0,e._storedError=void 0,e._disturbed=!1}function be(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")}function pe(e){return void 0!==e._reader}function me(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_asyncIteratorReader")}function ye(e,r,t,o,n,i){var a=de(e),s=g(r),u=!1,l=Promise.resolve();return new Promise((function(c,f){var h,b,p,m;if(void 0!==i){if(h=function(){var t=new DOMException("Aborted","AbortError"),i=[];!1===o&&i.push((function(){return"writable"===r._state?T(r,t):Promise.resolve()})),!1===n&&i.push((function(){return"readable"===e._state?ge(e,t):Promise.resolve()})),g((function(){return function(e,r,t){var o,n;void 0===t&&(t=void 0);var i=new Promise((function(e,r){o=e,n=r}));return void 0===t&&(t=function(e){throw e}),d(e,(function(e){try{var t=r(e);o(t)}catch(e){n(e)}}),(function(e){try{var r=t(e);o(r)}catch(e){n(e)}})),i}(i.map((function(e){return e()})),(function(e){return e}))}),!0,t)},!0===i.aborted)return void h();i.addEventListener("abort",h)}if(w(e,a._closedPromise,(function(e){!1===o?g((function(){return T(r,e)}),!0,e):S(!0,e)})),w(r,s._closedPromise,(function(r){!1===n?g((function(){return ge(e,r)}),!0,r):S(!0,r)})),b=e,p=a._closedPromise,m=function(){!1===t?g((function(){return function(e){var r=e._ownerWritableStream,t=r._state;return!0===C(r)||"closed"===t?Promise.resolve():"errored"===t?Promise.reject(r._storedError):z(e)}(s)})):S()},"closed"===b._state?m():p.then(m).catch(_),!0===C(r)||"closed"===r._state){var y=new TypeError("the destination writable stream closed before all data could be piped to it");!1===n?g((function(){return ge(e,y)}),!0,y):S(!0,y)}function v(){var e=l;return l.then((function(){return e!==l?v():void 0}))}function w(e,r,t){"errored"===e._state?t(e._storedError):r.catch(t).catch(_)}function g(e,t,o){function n(){e().then((function(){return R(t,o)}),(function(e){return R(!0,e)})).catch(_)}!0!==u&&(u=!0,"writable"===r._state&&!1===C(r)?v().then(n):n())}function S(e,t){!0!==u&&(u=!0,"writable"===r._state&&!1===C(r)?v().then((function(){return R(e,t)})).catch(_):R(e,t))}function R(e,r){F(s),Ie(a),void 0!==i&&i.removeEventListener("abort",h),e?f(r):c(void 0)}new Promise((function(e,r){!function t(o){o?e():(!0===u?Promise.resolve(!0):s._readyPromise.then((function(){return Fe(a).then((function(e){var r=e.value;return!0===e.done||(l=L(s,r).catch((function(){})),!1)}))}))).then(t,r)}(!1)})).catch(_)}))}function ve(e){return new Promise((function(r,t){var o={_resolve:r,_reject:t};e._reader._readIntoRequests.push(o)}))}function we(e){return new Promise((function(r,t){var o={_resolve:r,_reject:t};e._reader._readRequests.push(o)}))}function ge(e,r){return e._disturbed=!0,"closed"===e._state?Promise.resolve(void 0):"errored"===e._state?Promise.reject(e._storedError):(Se(e),e._readableStreamController[ue](r).then((function(){})))}function Se(e){e._state="closed";var r=e._reader;void 0!==r&&(ke(r)&&(r._readRequests.forEach((function(e){e._resolve(Re(void 0,!0,r._forAuthorCode))})),r._readRequests=new h),gr(r))}function Re(e,r,t){var o=null;!0===t&&(o=Object.prototype);var n=Object.create(o);return n.value=e,n.done=r,n}function Pe(e,r){e._state="errored",e._storedError=r;var t=e._reader;void 0!==t&&(ke(t)?(t._readRequests.forEach((function(e){e._reject(r)})),t._readRequests=new h):(t._readIntoRequests.forEach((function(e){e._reject(r)})),t._readIntoRequests=new h),wr(t,r))}function Te(e,r,t){var o=e._reader;o._readRequests.shift()._resolve(Re(r,t,o._forAuthorCode))}function qe(e){return e._reader._readIntoRequests.length}function je(e){return e._reader._readRequests.length}function Ee(e){var r=e._reader;return void 0!==r&&!!We(r)}function Ce(e){var r=e._reader;return void 0!==r&&!!ke(r)}void 0!==ae&&Object.setPrototypeOf(fe,ae),Object.defineProperty(fe,"next",{enumerable:!1}),Object.defineProperty(fe,"return",{enumerable:!1}),"symbol"==typeof r.asyncIterator&&Object.defineProperty(ce.prototype,r.asyncIterator,{value:ce.prototype.getIterator,enumerable:!1,writable:!0,configurable:!0});var Ae=function(){function e(e){if(!1===be(e))throw new TypeError("ReadableStreamDefaultReader can only be constructed with a ReadableStream instance");if(!0===pe(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");ze(this,e),this._readRequests=new h}return Object.defineProperty(e.prototype,"closed",{get:function(){return ke(this)?this._closedPromise:Promise.reject(mr("closed"))},enumerable:!0,configurable:!0}),e.prototype.cancel=function(e){return ke(this)?void 0===this._ownerReadableStream?Promise.reject(pr("cancel")):Be(this,e):Promise.reject(mr("cancel"))},e.prototype.read=function(){return ke(this)?void 0===this._ownerReadableStream?Promise.reject(pr("read from")):Fe(this):Promise.reject(mr("read"))},e.prototype.releaseLock=function(){if(!ke(this))throw mr("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");Ie(this)}},e}(),Oe=function(){function e(e){if(!be(e))throw new TypeError("ReadableStreamBYOBReader can only be constructed with a ReadableStream instance given a byte source");if(!1===Xe(e._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");if(pe(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");ze(this,e),this._readIntoRequests=new h}return Object.defineProperty(e.prototype,"closed",{get:function(){return We(this)?this._closedPromise:Promise.reject(Sr("closed"))},enumerable:!0,configurable:!0}),e.prototype.cancel=function(e){return We(this)?void 0===this._ownerReadableStream?Promise.reject(pr("cancel")):Be(this,e):Promise.reject(Sr("cancel"))},e.prototype.read=function(e){return We(this)?void 0===this._ownerReadableStream?Promise.reject(pr("read from")):ArrayBuffer.isView(e)?(e.buffer,0===e.byteLength?Promise.reject(new TypeError("view must have non-zero byteLength")):function(e,r){var t=e._ownerReadableStream;if(t._disturbed=!0,"errored"===t._state)return Promise.reject(t._storedError);return function(e,r){var t=e._controlledReadableByteStream,o=1;r.constructor!==DataView&&(o=r.constructor.BYTES_PER_ELEMENT);var n=r.constructor,i=r.buffer,a={buffer:i,byteOffset:r.byteOffset,byteLength:r.byteLength,bytesFilled:0,elementSize:o,ctor:n,readerType:"byob"};if(e._pendingPullIntos.length>0)return e._pendingPullIntos.push(a),ve(t);if("closed"===t._state){var s=new n(a.buffer,a.byteOffset,0);return Promise.resolve(Re(s,!0,t._reader._forAuthorCode))}if(e._queueTotalSize>0){if(!0===or(e,a)){var u=rr(a);return ir(e),Promise.resolve(Re(u,!1,t._reader._forAuthorCode))}if(!0===e._closeRequested){var l=new TypeError("Insufficient bytes to fill elements in the given buffer");return fr(e,l),Promise.reject(l)}}e._pendingPullIntos.push(a);var c=ve(t);return $e(e),c}(t._readableStreamController,r)}(this,e)):Promise.reject(new TypeError("view must be an array buffer view")):Promise.reject(Sr("read"))},e.prototype.releaseLock=function(){if(!We(this))throw Sr("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readIntoRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");Ie(this)}},e}();function We(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")}function ke(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readRequests")}function ze(e,r){e._forAuthorCode=!0,e._ownerReadableStream=r,r._reader=e,"readable"===r._state?yr(e):"closed"===r._state?function(e){yr(e),gr(e)}(e):vr(e,r._storedError)}function Be(e,r){return ge(e._ownerReadableStream,r)}function Ie(e){"readable"===e._ownerReadableStream._state?wr(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):function(e,r){vr(e,r)}(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),e._ownerReadableStream._reader=void 0,e._ownerReadableStream=void 0}function Fe(e){var r=e._ownerReadableStream;return r._disturbed=!0,"closed"===r._state?Promise.resolve(Re(void 0,!0,e._forAuthorCode)):"errored"===r._state?Promise.reject(r._storedError):r._readableStreamController[le]()}var Le=function(){function e(){throw new TypeError}return Object.defineProperty(e.prototype,"desiredSize",{get:function(){if(!1===Me(this))throw Rr("desiredSize");return Ve(this)},enumerable:!0,configurable:!0}),e.prototype.close=function(){if(!1===Me(this))throw Rr("close");if(!1===Qe(this))throw new TypeError("The stream is not in a state that permits close");Ye(this)},e.prototype.enqueue=function(e){if(!1===Me(this))throw Rr("enqueue");if(!1===Qe(this))throw new TypeError("The stream is not in a state that permits enqueue");return He(this,e)},e.prototype.error=function(e){if(!1===Me(this))throw Rr("error");Ue(this,e)},e.prototype[ue]=function(e){m(this);var r=this._cancelAlgorithm(e);return Ne(this),r},e.prototype[le]=function(){var e=this._controlledReadableStream;if(this._queue.length>0){var r=b(this);return!0===this._closeRequested&&0===this._queue.length?(Ne(this),Se(e)):xe(this),Promise.resolve(Re(r,!1,e._reader._forAuthorCode))}var t=we(e);return xe(this),t},e}();function Me(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableStream")}function xe(e){!1!==De(e)&&(!0!==e._pulling?(e._pulling=!0,e._pullAlgorithm().then((function(){e._pulling=!1,!0===e._pullAgain&&(e._pullAgain=!1,xe(e))}),(function(r){Ue(e,r)})).catch(_)):e._pullAgain=!0)}function De(e){var r=e._controlledReadableStream;return!1!==Qe(e)&&(!1!==e._started&&(!0===pe(r)&&je(r)>0||Ve(e)>0))}function Ne(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0,e._strategySizeAlgorithm=void 0}function Ye(e){var r=e._controlledReadableStream;e._closeRequested=!0,0===e._queue.length&&(Ne(e),Se(r))}function He(e,r){var t=e._controlledReadableStream;if(!0===pe(t)&&je(t)>0)Te(t,r,!1);else{var o=void 0;try{o=e._strategySizeAlgorithm(r)}catch(r){throw Ue(e,r),r}try{p(e,r,o)}catch(r){throw Ue(e,r),r}}xe(e)}function Ue(e,r){var t=e._controlledReadableStream;"readable"===t._state&&(m(e),Ne(e),Pe(t,r))}function Ve(e){var r=e._controlledReadableStream._state;return"errored"===r?null:"closed"===r?0:e._strategyHWM-e._queueTotalSize}function Qe(e){var r=e._controlledReadableStream._state;return!1===e._closeRequested&&"readable"===r}function Ge(e,r,t,o,n,i,a){r._controlledReadableStream=e,r._queue=void 0,r._queueTotalSize=void 0,m(r),r._started=!1,r._closeRequested=!1,r._pullAgain=!1,r._pulling=!1,r._strategySizeAlgorithm=a,r._strategyHWM=i,r._pullAlgorithm=o,r._cancelAlgorithm=n,e._readableStreamController=r;var s=t();Promise.resolve(s).then((function(){r._started=!0,xe(r)}),(function(e){Ue(r,e)})).catch(_)}var Je=function(){function e(){throw new TypeError("ReadableStreamBYOBRequest cannot be used directly")}return Object.defineProperty(e.prototype,"view",{get:function(){if(!1===Ze(this))throw Pr("view");return this._view},enumerable:!0,configurable:!0}),e.prototype.respond=function(e){if(!1===Ze(this))throw Pr("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");this._view.buffer,function(e,r){if(r=Number(r),!1===i(r))throw new RangeError("bytesWritten must be a finite");ur(e,r)}(this._associatedReadableByteStreamController,e)},e.prototype.respondWithNewView=function(e){if(!1===Ze(this))throw Pr("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");if(!ArrayBuffer.isView(e))throw new TypeError("You can only respond with array buffer views");e.buffer,function(e,r){var t=e._pendingPullIntos.peek();if(t.byteOffset+t.bytesFilled!==r.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(t.byteLength!==r.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");t.buffer=r.buffer,ur(e,r.byteLength)}(this._associatedReadableByteStreamController,e)},e}(),Ke=function(){function e(){throw new TypeError("ReadableByteStreamController constructor cannot be used directly")}return Object.defineProperty(e.prototype,"byobRequest",{get:function(){if(!1===Xe(this))throw Tr("byobRequest");if(void 0===this._byobRequest&&this._pendingPullIntos.length>0){var e=this._pendingPullIntos.peek(),r=new Uint8Array(e.buffer,e.byteOffset+e.bytesFilled,e.byteLength-e.bytesFilled),t=Object.create(Je.prototype);!function(e,r,t){e._associatedReadableByteStreamController=r,e._view=t}(t,this,r),this._byobRequest=t}return this._byobRequest},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"desiredSize",{get:function(){if(!1===Xe(this))throw Tr("desiredSize");return dr(this)},enumerable:!0,configurable:!0}),e.prototype.close=function(){if(!1===Xe(this))throw Tr("close");if(!0===this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");var e=this._controlledReadableByteStream._state;if("readable"!==e)throw new TypeError("The stream (in "+e+" state) is not in the readable state and cannot be closed");!function(e){var r=e._controlledReadableByteStream;if(e._queueTotalSize>0)return void(e._closeRequested=!0);if(e._pendingPullIntos.length>0){if(e._pendingPullIntos.peek().bytesFilled>0){var t=new TypeError("Insufficient bytes to fill elements in the given buffer");throw fr(e,t),t}}cr(e),Se(r)}(this)},e.prototype.enqueue=function(e){if(!1===Xe(this))throw Tr("enqueue");if(!0===this._closeRequested)throw new TypeError("stream is closed or draining");var r=this._controlledReadableByteStream._state;if("readable"!==r)throw new TypeError("The stream (in "+r+" state) is not in the readable state and cannot be enqueued to");if(!ArrayBuffer.isView(e))throw new TypeError("You can only enqueue array buffer views when using a ReadableByteStreamController");e.buffer,function(e,r){var t=e._controlledReadableByteStream,o=r.buffer,n=r.byteOffset,i=r.byteLength,a=o;if(!0===Ce(t)){if(0===je(t))tr(e,a,n,i);else Te(t,new Uint8Array(a,n,i),!1)}else!0===Ee(t)?(tr(e,a,n,i),sr(e)):tr(e,a,n,i);$e(e)}(this,e)},e.prototype.error=function(e){if(!1===Xe(this))throw Tr("error");fr(this,e)},e.prototype[ue]=function(e){this._pendingPullIntos.length>0&&(this._pendingPullIntos.peek().bytesFilled=0);m(this);var r=this._cancelAlgorithm(e);return cr(this),r},e.prototype[le]=function(){var e=this._controlledReadableByteStream;if(this._queueTotalSize>0){var r=this._queue.shift();this._queueTotalSize-=r.byteLength,ir(this);var t=void 0;try{t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength)}catch(e){return Promise.reject(e)}return Promise.resolve(Re(t,!1,e._reader._forAuthorCode))}var o=this._autoAllocateChunkSize;if(void 0!==o){var n=void 0;try{n=new ArrayBuffer(o)}catch(e){return Promise.reject(e)}var i={buffer:n,byteOffset:0,byteLength:o,bytesFilled:0,elementSize:1,ctor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(i)}var a=we(e);return $e(this),a},e}();function Xe(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableByteStream")}function Ze(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")}function $e(e){var r=function(e){var r=e._controlledReadableByteStream;if("readable"!==r._state)return!1;if(!0===e._closeRequested)return!1;if(!1===e._started)return!1;if(!0===Ce(r)&&je(r)>0)return!0;if(!0===Ee(r)&&qe(r)>0)return!0;var t=dr(e);if(t>0)return!0;return!1}(e);!1!==r&&(!0!==e._pulling?(e._pulling=!0,e._pullAlgorithm().then((function(){e._pulling=!1,!0===e._pullAgain&&(e._pullAgain=!1,$e(e))}),(function(r){fr(e,r)})).catch(_)):e._pullAgain=!0)}function er(e,r){var t=!1;"closed"===e._state&&(t=!0);var o=rr(r);"default"===r.readerType?Te(e,o,t):function(e,r,t){var o=e._reader;o._readIntoRequests.shift()._resolve(Re(r,t,o._forAuthorCode))}(e,o,t)}function rr(e){var r=e.bytesFilled,t=e.elementSize;return new e.ctor(e.buffer,e.byteOffset,r/t)}function tr(e,r,t,o){e._queue.push({buffer:r,byteOffset:t,byteLength:o}),e._queueTotalSize+=o}function or(e,r){var t=r.elementSize,o=r.bytesFilled-r.bytesFilled%t,n=Math.min(e._queueTotalSize,r.byteLength-r.bytesFilled),i=r.bytesFilled+n,a=i-i%t,s=n,u=!1;a>o&&(s=a-r.bytesFilled,u=!0);for(var l,c,f,d,_,h=e._queue;s>0;){var b=h.peek(),p=Math.min(s,b.byteLength),m=r.byteOffset+r.bytesFilled;l=r.buffer,c=m,f=b.buffer,d=b.byteOffset,_=p,new Uint8Array(l).set(new Uint8Array(f,d,_),c),b.byteLength===p?h.shift():(b.byteOffset+=p,b.byteLength-=p),e._queueTotalSize-=p,nr(e,p,r),s-=p}return u}function nr(e,r,t){ar(e),t.bytesFilled+=r}function ir(e){0===e._queueTotalSize&&!0===e._closeRequested?(cr(e),Se(e._controlledReadableByteStream)):$e(e)}function ar(e){void 0!==e._byobRequest&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=void 0,e._byobRequest=void 0)}function sr(e){for(;e._pendingPullIntos.length>0;){if(0===e._queueTotalSize)return;var r=e._pendingPullIntos.peek();!0===or(e,r)&&(lr(e),er(e._controlledReadableByteStream,r))}}function ur(e,r){var t=e._pendingPullIntos.peek();if("closed"===e._controlledReadableByteStream._state){if(0!==r)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");!function(e,r){r.buffer=r.buffer;var t=e._controlledReadableByteStream;if(!0===Ee(t))for(;qe(t)>0;)er(t,lr(e))}(e,t)}else!function(e,r,t){if(t.bytesFilled+r>t.byteLength)throw new RangeError("bytesWritten out of range");if(nr(e,r,t),!(t.bytesFilled<t.elementSize)){lr(e);var o=t.bytesFilled%t.elementSize;if(o>0){var n=t.byteOffset+t.bytesFilled,i=t.buffer.slice(n-o,n);tr(e,i,0,i.byteLength)}t.buffer=t.buffer,t.bytesFilled-=o,er(e._controlledReadableByteStream,t),sr(e)}}(e,r,t);$e(e)}function lr(e){var r=e._pendingPullIntos.shift();return ar(e),r}function cr(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0}function fr(e,r){var t=e._controlledReadableByteStream;"readable"===t._state&&(!function(e){ar(e),e._pendingPullIntos=new h}(e),m(e),cr(e),Pe(t,r))}function dr(e){var r=e._controlledReadableByteStream._state;return"errored"===r?null:"closed"===r?0:e._strategyHWM-e._queueTotalSize}function _r(e){if("object"!=typeof e||null===e)return!1;var r=Object.getOwnPropertyDescriptor(AbortSignal.prototype,"aborted").get;try{return r.call(e),!0}catch(e){return!1}}function hr(e){return new TypeError("ReadableStream.prototype."+e+" can only be used on a ReadableStream")}function br(e){return new TypeError("ReadableStreamAsyncIterator."+e+" can only be used on a ReadableSteamAsyncIterator")}function pr(e){return new TypeError("Cannot "+e+" a stream using a released reader")}function mr(e){return new TypeError("ReadableStreamDefaultReader.prototype."+e+" can only be used on a ReadableStreamDefaultReader")}function yr(e){e._closedPromise=new Promise((function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t}))}function vr(e,r){yr(e),wr(e,r)}function wr(e,r){e._closedPromise.catch((function(){})),e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function gr(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function Sr(e){return new TypeError("ReadableStreamBYOBReader.prototype."+e+" can only be used on a ReadableStreamBYOBReader")}function Rr(e){return new TypeError("ReadableStreamDefaultController.prototype."+e+" can only be used on a ReadableStreamDefaultController")}function Pr(e){return new TypeError("ReadableStreamBYOBRequest.prototype."+e+" can only be used on a ReadableStreamBYOBRequest")}function Tr(e){return new TypeError("ReadableByteStreamController.prototype."+e+" can only be used on a ReadableByteStreamController")}var qr=function(){function e(e){var r=e.highWaterMark;this.highWaterMark=r}return e.prototype.size=function(e){return e.byteLength},e}(),jr=function(){function e(e){var r=e.highWaterMark;this.highWaterMark=r}return e.prototype.size=function(){return 1},e}(),Er=function(){function e(e,r,t){void 0===e&&(e={}),void 0===r&&(r={}),void 0===t&&(t={});var o=r.size,n=r.highWaterMark,i=t.size,a=t.highWaterMark;if(void 0!==e.writableType)throw new RangeError("Invalid writable type specified");var d=f(o);if(void 0===n&&(n=1),n=c(n),void 0!==e.readableType)throw new RangeError("Invalid readable type specified");var _,h=f(i);void 0===a&&(a=0),a=c(a),function(e,r,t,o,n,i){function a(){return r}function s(r){return function(e,r){var t=e._transformStreamController;if(!0===e._backpressure){return e._backpressureChangePromise.then((function(){var o=e._writable;if("erroring"===o._state)throw o._storedError;return Fr(t,r)}))}return Fr(t,r)}(e,r)}function u(r){return function(e,r){return Ar(e,r),Promise.resolve()}(e,r)}function l(){return function(e){var r=e._readable,t=e._transformStreamController,o=t._flushAlgorithm();return Br(t),o.then((function(){if("errored"===r._state)throw r._storedError;var e=r._readableStreamController;!0===Qe(e)&&Ye(e)})).catch((function(t){throw Ar(e,t),r._storedError}))}(e)}function c(){return function(e){return Wr(e,!1),e._backpressureChangePromise}(e)}function f(r){return Or(e,r),Promise.resolve()}e._writable=function(e,r,t,o,n,i){void 0===n&&(n=1),void 0===i&&(i=function(){return 1});var a=Object.create(w.prototype);return S(a),x(a,Object.create(M.prototype),e,r,t,o,n,i),a}(a,s,l,u,t,o),e._readable=_e(a,c,f,n,i),e._backpressure=void 0,e._backpressureChangePromise=void 0,e._backpressureChangePromise_resolve=void 0,Wr(e,!0),e._transformStreamController=void 0}(this,new Promise((function(e){_=e})),n,d,a,h),function(e,r){var t=Object.create(kr.prototype),o=function(e){try{return Ir(t,e),Promise.resolve()}catch(e){return Promise.reject(e)}},n=r.transform;if(void 0!==n){if("function"!=typeof n)throw new TypeError("transform is not a method");o=function(e){return l(n,r,[e,t])}}var i=s(r,"flush",0,[t]);!function(e,r,t,o){r._controlledTransformStream=e,e._transformStreamController=r,r._transformAlgorithm=t,r._flushAlgorithm=o}(e,t,o,i)}(this,e);var b=u(e,"start",[this._transformStreamController]);_(b)}return Object.defineProperty(e.prototype,"readable",{get:function(){if(!1===Cr(this))throw Mr("readable");return this._readable},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"writable",{get:function(){if(!1===Cr(this))throw Mr("writable");return this._writable},enumerable:!0,configurable:!0}),e}();function Cr(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_transformStreamController")}function Ar(e,r){Ue(e._readable._readableStreamController,r),Or(e,r)}function Or(e,r){Br(e._transformStreamController),H(e._writable._writableStreamController,r),!0===e._backpressure&&Wr(e,!1)}function Wr(e,r){void 0!==e._backpressureChangePromise&&e._backpressureChangePromise_resolve(),e._backpressureChangePromise=new Promise((function(r){e._backpressureChangePromise_resolve=r})),e._backpressure=r}var kr=function(){function e(){throw new TypeError("TransformStreamDefaultController instances cannot be created directly")}return Object.defineProperty(e.prototype,"desiredSize",{get:function(){if(!1===zr(this))throw Lr("desiredSize");return Ve(this._controlledTransformStream._readable._readableStreamController)},enumerable:!0,configurable:!0}),e.prototype.enqueue=function(e){if(!1===zr(this))throw Lr("enqueue");Ir(this,e)},e.prototype.error=function(e){if(!1===zr(this))throw Lr("error");var r;r=e,Ar(this._controlledTransformStream,r)},e.prototype.terminate=function(){if(!1===zr(this))throw Lr("terminate");!function(e){var r=e._controlledTransformStream,t=r._readable._readableStreamController;!0===Qe(t)&&Ye(t);var o=new TypeError("TransformStream terminated");Or(r,o)}(this)},e}();function zr(e){return!!o(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledTransformStream")}function Br(e){e._transformAlgorithm=void 0,e._flushAlgorithm=void 0}function Ir(e,r){var t=e._controlledTransformStream,o=t._readable._readableStreamController;if(!1===Qe(o))throw new TypeError("Readable side is not in a state that permits enqueue");try{He(o,r)}catch(e){throw Or(t,e),t._readable._storedError}var n=function(e){return!0!==De(e)}(o);n!==t._backpressure&&Wr(t,!0)}function Fr(e,r){return e._transformAlgorithm(r).catch((function(r){throw Ar(e._controlledTransformStream,r),r}))}function Lr(e){return new TypeError("TransformStreamDefaultController.prototype."+e+" can only be used on a TransformStreamDefaultController")}function Mr(e){return new TypeError("TransformStream.prototype."+e+" can only be used on a TransformStream")}e.ReadableStream=ce,e.WritableStream=w,e.ByteLengthQueuingStrategy=qr,e.CountQueuingStrategy=jr,e.TransformStream=Er,Object.defineProperty(e,"__esModule",{value:!0})}));
      ((e,t)=>{"undefined"!=typeof module?module.exports=t():"function"==typeof define&&"object"==typeof define.amd?define(t):this.streamSaver=t()})(0,(()=>{"use strict";let e=null,t=!1;const a=window.WebStreamsPolyfill||{},r=window.isSecureContext;let n=/constructor/i.test(window.HTMLElement)||!!window.safari;const o=r||"MozAppearance"in document.documentElement.style?"iframe":"navigate",s={createWriteStream:function(a,l,d){let m={size:null,pathname:null,writableStrategy:void 0,readableStrategy:void 0};Number.isFinite(l)?([d,l]=[l,d],console.warn("[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream"),m.size=d,m.writableStrategy=l):l&&l.highWaterMark?(console.warn("[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream"),m.size=d,m.writableStrategy=l):m=l||{};if(!n){e||(e=r?i(s.mitm):function(e){const t="width=200,height=100",a=document.createDocumentFragment(),r={frame:window.open(e,"popup",t),loaded:!1,isIframe:!1,isPopup:!0,remove(){r.frame.close()},addEventListener(...e){a.addEventListener(...e)},dispatchEvent(...e){a.dispatchEvent(...e)},removeEventListener(...e){a.removeEventListener(...e)},postMessage(...e){r.frame.postMessage(...e)}},n=e=>{e.source===r.frame&&(r.loaded=!0,window.removeEventListener("message",n),r.dispatchEvent(new Event("load")))};return window.addEventListener("message",n),r}(s.mitm));var c=0,p=null,w=new MessageChannel;a=encodeURIComponent(a.replace(/\//g,":")).replace(/['()]/g,escape).replace(/\*/g,"%2A");const n={transferringReadable:t,pathname:m.pathname||Math.random().toString().slice(-6)+"/"+a,headers:{"Content-Type":"application/octet-stream; charset=utf-8","Content-Disposition":"attachment; filename*=UTF-8''"+a}};m.size&&(n.headers["Content-Length"]=m.size);const l=[n,"*",[w.port2]];if(t){const e="iframe"===o?void 0:{transform(e,t){c+=e.length,t.enqueue(e),p&&(location.href=p,p=null)},flush(){p&&(location.href=p)}};var u=new s.TransformStream(e,m.writableStrategy,m.readableStrategy);const t=u.readable;w.port1.postMessage({readableStream:t},[t])}w.port1.onmessage=t=>{t.data.download&&("navigate"===o?(e.remove(),e=null,c?location.href=t.data.download:p=t.data.download):(e.isPopup&&(e.remove(),"iframe"===o&&i(s.mitm)),i(t.data.download)))},e.loaded?e.postMessage(...l):e.addEventListener("load",(()=>{e.postMessage(...l)}),{once:!0})}let f=[];return!n&&u&&u.writable||new s.WritableStream({write(e){n?f.push(e):(w.port1.postMessage(e),c+=e.length,p&&(location.href=p,p=null))},close(){if(n){const e=new Blob(f,{type:"application/octet-stream; charset=utf-8"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=a,t.click()}else w.port1.postMessage("end")},abort(){f=[],w.port1.postMessage("abort"),w.port1.onmessage=null,w.port1.close(),w.port2.close(),w=null}},m.writableStrategy)},WritableStream:window.WritableStream||a.WritableStream,supported:!0,version:{full:"2.0.0",major:2,minor:0,dot:0},mitm:"https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0"};function i(e){if(!e)throw new Error("meh");const t=document.createElement("iframe");return t.hidden=!0,t.src=e,t.loaded=!1,t.name="iframe",t.isIframe=!0,t.postMessage=(...e)=>t.contentWindow.postMessage(...e),t.addEventListener("load",(()=>{t.loaded=!0}),{once:!0}),document.body.appendChild(t),t}try{new Response(new ReadableStream),r&&!("serviceWorker"in navigator)&&(n=!0)}catch(e){n=!0}return(e=>{try{e()}catch(e){}})((()=>{const{readable:e}=new TransformStream,a=new MessageChannel;a.port1.postMessage(e,[e]),a.port1.close(),a.port2.close(),t=!0,Object.defineProperty(s,"TransformStream",{configurable:!1,writable:!1,value:TransformStream})})),s}));
      (function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});
      this.writeLog('加载下载功能模块成功!')
        $('#_switchRunning')[0].disabled = false
        /*unsafeWindow.onunload = () => {
            writableStream.abort()
            writer.abort()
        }
        unsafeWindow.onbeforeunload = evt => {
            if (!done) {
                evt.returnValue = `Are you sure you want to leave?`;
            }
        }*/
    // })
  },
  updateTable(){
    let cnt = this.resources.length
    console.log(cnt, this.options.show_img_limit)
    $('table')[0].innerHTML = createHTML(`
    <tr align="center">
      <th>编号</th>
      <th>选中</th>
      <th>封面</th>
      <th>标题</th>
      <th>状态</th>
      </tr>
      ${this.resources.map((item, index) => {
          let {urls, title, cover, url, id} = item || {}
          return `
                <tr align="center" data-id="${id}">
                    <td style="width: 50px;">${index+1}<p><a href="#" data-action="addDownload" style="color:blue">下载</a></p></td>
                    <td style="width: 50px;"><input type="checkbox" style="transform: scale(1.5);" checked></td>
                    <td style="width: 100px;"><a href="${url}" target="_blank" style="color: #fff;">${this.options.show_img_limit > 0 && cnt >= this.options.show_img_limit ? `不显示预览图` : `<a href="${url}" target="_blank"><img loading="lazy" src="${cover}" style="width: 100px;min-height: 100px;"></a>`}</td>
                    <td contenteditable style="width: 400px;max-width: 400px;">${title}</td>
                    <td style="width: 100px;">等待中...</td>
                </tr>`

      }).join('')}`)
  },
  getDialog(id){
    return document.querySelector('#'+id)
  },
  isShowing(id = '_dialog'){
    return this.getDialog(id) !== null
  },
  showDialog({html, id, callback, onClose}){ // 弹窗
    let dialog = this.getDialog(id)
    dialog && dialog.remove()

    document.body.insertAdjacentHTML('beforeEnd', createHTML(`
    <dialog class="_dialog" id="${id}" style="top: 0;left: 0;width: 100%;height: 100%;position: fixed;z-index: 9999;background-color: rgba(0, 0, 0, .8);color: #fff;padding: 10px;overflow: auto; overscroll-behavior: contain;" open>
      <a href="#" style="position: absolute;right: 20px;top: 20px;padding: 10px;background-color: rgba(255, 255, 255, .4);" class="_dialog_close">X</a>
      ${html}
    <dialog>`))
    setTimeout(() => {
      let dialog = this.getDialog(id)
      dialog.querySelector('._dialog_close').onclick = () => dialog.remove() & (onClose && onClose())
      callback && callback(dialog)
    }, 500)
  },
    applyRenameAll(){
      let format = $('#_filename')[0].value
      this.saveOptions({lastRename: format})
      let index = 0
      for(let tr of $('table tr[data-id]')){
       this.applyRename(tr.dataset.id, tr, format, ++index)
      }
    },
    applyRename(tid, tr, format, index){
        tr ??= this.findElement(tid)
        if(!tr) return
        let item = this.findItem(tid)
        if(!item) return
        format ??= $('#_filename')[0].value
        if(typeof(format) != 'string' || format == '') return
        let {title, author_name, id, create_time} = Object.assign(item, {renamed: true})
        let s = format.replace('{标题}', title ?? '').replace('{id}', id).replace('{i}', index).replace('{发布者}', author_name ?? '')
        if(create_time){
            s = new Date(create_time).format(s)
        }
        tr.querySelector('td[contenteditable]').innerHTML = createHTML(s)
    },
  bindEvents(){ // 绑定DOM事件
    $('#_threads')[0].oninput = function(ev){
      $('#_threads_span')[0].innerHTML = createHTML(this.value)
    }
    $('#_apply_filename')[0].onclick = () => this.applyRenameAll() & (['www.xiaohongshu.com'].includes(location.host) && alert("请注意:小红书网站上日期规则预览不会立刻生效，只有在开始下载的时候才会生效！"))
    $('#_apply_filename_help')[0].onclick = () => this.showDialog({
        id: '_dialog_rename_help',
        html: `
        <p>
          <h1>变量<h1>
          <h3>{标题} {id} {发布者} {i} yyyy年MM月dd日_hh时mm分ss秒<h3>
        </p>
        <p>
          <h1>常见问题<h1>
          <h3>
            <pre>
            为什么没有显示入口按钮？(可能是脚本插入时机慢了，可以多滚动或者多刷新几次)
            为什么下载显示失败(降低线程数/检查网络质量/退出账号or切换账号)
            为什么捕获的数量不等于主页作品数量(目前只能捕获视频作品，而非图文作品)
            为什么只能下载一个文件？（请检查网站是否有开启允许同时下载多个文件选项）
            </pre>
          <h3>
        </p>
        <p>
          <h1>测试页面<h1>
          <h3>
            <pre>
            https://isee.weishi.qq.com/ws/app-pages/wspersonal/index.html?id=1538201906643006
            https://www.douyin.com/user/MS4wLjABAAAANfnAjG-xB__cCOB4hTXFBvG6yZFWNl-FkgCWvpwGN2M
            https://www.douyin.com/search/%E6%88%91%E4%BB%AC
            https://www.kuaishou.com/profile/3xqyyjytuef8nsq
            https://www.tiktok.com/@simonboyyyyyyy
            https://www.xiaohongshu.com/user/profile/60f0ecec0000000001004874
            https://www.instagram.com/rohman__oficial/
            https://weibo.com/u/2328516855?tabtype=newVideo
            https://x.com/pentarouX/media
            https://www.toutiao.com/c/user/token/MS4wLjABAAAAzCbyoWKVhqhvIgUd49i5o43v4-YcICXye1glC0Xefok/?entrance_gid=7417305773065929267&log_from=f6060c90895cc_1727227709729&tab=video
            </pre>
          <h3>
        </p>
        <p>
          <h1>使用Aria2c下载<h1>
          <h3>
            <pre>
            如何安装? 从https://wwas.lanzouj.com/b032c68ozc 密码:36yz 下载解压，双击bat文件开启
            </pre>
          <h3>
        </p>
        `,
    })
    $('#_selectAll')[0].onclick = () => $('table input[type=checkbox]').forEach(el => el.checked = true)
    $('#_reverSelectAll')[0].onclick = () => $('table input[type=checkbox]').forEach(el => el.checked = !el.checked)
    $('#_clear_log')[0].onclick = () => $('#_log')[0].innerHTML = createHTML('')
    $('#_switchRunning')[0].onclick = () => this.switchRunning()
    $('#_autoScroll')[0].onclick = () => this.switchAutoScroll()
    $('#_settings')[0].onclick = () => {
      this.showDialog({
        id: '_dialog_settings',
        html: `
          <div style="display: flex;width: 100%;gap: 20px;">
            <div>
              <h3>线路设置</h3>
              ${Object.values(this.HOSTS).map(({hosts, title, id}) => {
                    hosts ??= []
                    let html = `${title}线路: <select data-for="${id}">${hosts.map(host => `<option ${this.options[id+'_host'] == host ? 'selected' : ''}>${host}</option>`).join('')}</select>`
                    return hosts.length ? html : ''}).join('')}
            </div>
            <div>
              <h3>下载设置</h3>
              <div>下载结束提示<input type="checkbox" data-for="alert_done" ${this.options.alert_done ? 'checked': ''}></div>
              <div>自动重命名<input type="checkbox" data-for="autoRename" ${this.options.autoRename ? 'checked': ''}></div>
              <div>超时时间(毫秒): <input type="number" value="${this.options.timeout}" data-for="timeout"></div>
              <div>重试次数: <input type="number" value="${this.options.retry_max}" data-for="retry_max"></div>
              <div>封面超过不显示: <input type="number" value="${this.options.show_img_limit}" data-for="show_img_limit"></div>
            </div>
            <div>
              <h3>数据设置</h3>
              <div>
                <button data-action="exportData">导出数据</button>
                <button data-action="exportUrls">导出视频链接</button>
                <button data-action="importData">导入数据</button>
              </div>
            </div>
            <div>
              <h3>Aria2c设置</h3>
              <div>
                <div>地址: <input type="text" value="${this.options.aria2c_host}" data-for="aria2c_host"></div>
                <div>端口: <input type="number" value="${this.options.aria2c_port}" data-for="aria2c_port"></div>
                <div>密钥: <input type="text" value="${this.options.aria2c_secret}" data-for="aria2c_secret"></div>
                <div>保存目录: <input type="text" value="${this.options.aria2c_saveTo}" data-for="aria2c_saveTo"></div>
              </div>
            </div>
          </div>
        `,
        callback: dialog => this.initInputs(dialog),
        onClose: () => this.resources = this.resources.map(item => this.DETAIL.rules[item.rule_index].parseItem(item.data))
      })
    }
    $('#_clearDownloads')[0].onclick = () => this.clearDownloads()
    $('#_reDownloads')[0].onclick = () => this.reDownloads()
  },
    initAction(){
        const onEvent = ev => {
            let {srcElement} = ev
            let {action} = srcElement.dataset
            switch(action){
                case 'addDownload':
                    let par = getParent(srcElement, el => el?.dataset?.id)
                    if(par){
                        this.downloadItem(this.findItem(par.dataset.id), true)
                    }
                    return
                case 'exportUrls':
                    return this.addDownload({
                        url: URL.createObjectURL(new Blob([flattenArray(this.resources.map(({urls}) => Array.isArray(urls) ? urls.map(({url}) => url) : urls)).join("\r\n")])),
                        name: '导出链接.txt'
                    })
                case 'exportData':
                    // todo csv
                    if(!this.resources.length) return alert('没有任何数据')
                    return this.addDownload({
                        url: URL.createObjectURL(new Blob([JSON.stringify(this.resources)])),
                        name: '导出数据.txt'
                    })
                case 'importData':
                    return openFileDialog({
                        accept: '.txt',
                        callback: files => {
                            let reader = new FileReader()
                            reader.readAsText(files[0])
                            reader.onload = e => {
                                try {
                                    json = JSON.parse(reader.result)
                                    let cnt = json.length
                                    if(cnt){
                                        if(confirm(`发现${cnt}条数据!是否重置下载状态？`)) json = json.map(item => Object.assign(item, {status: WAITTING}))
                                        this.setList(json) & this.writeLog('成功导入数据')
                                    }
                                } catch (err) {
                                    alert(err.toString())
                                }
                            }
                        }
                    })
                default:
                    return
            }
            ev.stopPropagation(true) & ev.preventDefault()
        }
        document.body.addEventListener('click', onEvent)
  },
  initInputs(dialog){
    const self = this
    for(let select of dialog.querySelectorAll('select')) select.onchange = function(){
      self.saveOptions({[`${this.dataset.for}_host`]: this.value})
    }
    for(let input of dialog.querySelectorAll('input')) input.onchange = function(){
      let value, key = this.dataset.for
      switch(this.type){
        case 'checkbox':
        case 'switch':
          value = this.checked
          break
        default:
          value = this.value
      }
      self.saveOptions({[key]: value})
      if(key == 'useAria2c') self.enableAria2c(value)
    }
  },
  clearDownloads(){
      this.eachItems(DOWNLOADED, ({tr, item, index}) => {
          this.resources.splice(index, 1)
          tr && tr.remove()
      })
  },
  reDownloads(){
      this.cancelDownloads()
      let cnt = this.eachItems([DOWNLOADING, ERROR], ({tr, item}) => {
          if(tr){
              let td = tr.querySelectorAll('td')
              td[4].style.backgroundColor = 'unset'
              td[4].innerHTML = createHTML('等待中...')
          }
          item.status = WAITTING
      }).length
      cnt ? this.writeLog(`重新下载${cnt}个视频`) & this.switchRunning(true) : alert('没有需要重新下载的任务')
  },
  cancelDownloads(){
      Object.keys(this.downloads).forEach(id => this.removeDownload(id))
      this.writeLog(`成功取消所有下载`)
  },
  eachItems(status_id, callback){
       let ret = []
       status_id = toArr(status_id)
       for(let i=this.resources.length-1;i>=0;i--){
          let item = this.resources[i]
          ret.push(item)
          let {status, id} = item
          if(status_id.includes(status)){
              let tr = this.findElement(id)
              callback({tr, item, index: i})
          }
      }
      return ret
  },
  checkFinishTimer: -1,
  switchRunning(running){ // 切换运行状态
    this.running = running ??= !this.running
    $('#_switchRunning')[0].innerHTML = createHTML(running ? '暂停' : '运行')
    if(running){
      let threads = parseInt($('#_threads')[0].value)
      let cnt = threads - this.getItems(DOWNLOADING).length
      if(cnt){
        this.writeLog('开始线程下载:'+cnt)
        this.saveOptions({threads})
        for(let i=0;i<cnt;i++) this.nextDownload()
      }
    }
  },
  getItems(_status){ // 获取指定状态任务
    return this.resources.filter(({status}) => status == _status)
  },
  getDownloadName(id){
       let tr = this.findElement(id)
       if(tr){
           let td = tr.querySelectorAll('td')
           return td[3].outerText
       }
      return null
  },
  downloadItem(item, checked){
      let {status, id, urls, rule_index, downloadTool} = item
        if(status == WAITTING){
          let tr = this.findElement(id)
          if(!tr) return

          let td = tr.querySelectorAll('td')
          checked ??= td[1].querySelector('input[type=checkbox]').checked
          if(checked){
              item.status = DOWNLOADING
              const log = ({msg, color, next = true, status}) => {
                this.writeLog(msg, `<a href="${item.url}" target="_blank" style="color: white;">${this.safeFileName(item.title)}</a>`, color)
                status ??= {success: DOWNLOADED, error: ERROR}[color]
                this.setItemStatus({id, color, msg, el: tr, item, status})
                if(next) this.nextDownload()
              }
              log({msg: '正在下载', color: 'primary', next: false})

              // 预先下载并尝试重试(多线程下需要重试才能正常下载)
              let retry = 0
              const httpRequest = url => {
                  toArr(url).forEach(download => {
                      if(typeof(download) == 'string') download = {url: download, type: 'video', title: item.title}
                      var {url} = download
                      const done = (url, headers) => this.addDownload({
                          download, url, id, headers, downloadTool,
                          error: msg => log({msg, color: 'error'}),
                          success: msg => log({msg, color: 'success'}),
                      })
                      return done(url)
                      /*
                      if(this.aria2c){
                          done(url)
                      }else{
                          GM_xmlhttpRequest({
                              method: "GET", url, headers: this.getHeaders(url),
                              redirect: 'follow',
                              //responseType: "blob",
                              timeout: this.options.timeout,
                              anonymous: true,
                              onload: ({status, response, finalUrl}) => {
                                  console.log({status, finalUrl, response})
                                  if (status === 200) {
                                      if(!response){
                                          if(!finalUrl) return log({msg: `请求错误`, color: 'error'})
                                          done(finalUrl)
                                      }else{
                                          done(blobUrl)
                                      }
                                  }else
                                      if(retry++ < this.options.retry_max){
                                          // console.log('下载失败,重试中...', urls)
                                          setTimeout(() => httpRequest(), 500)
                                      }else{
                                          log({msg: `重试下载错误`, color: 'error'})
                                      }
                              },
                              onerror: err => console.error({msg: '获取链接失败', err}) & done(url)
                          })
                      }*/
                  })
              }
              if(!urls){
                  let getVideoURL = this.DETAIL[rule_index]?.getVideoURL || this.DETAIL.getVideoURL
                  if(!getVideoURL) return log({msg: `无下载地址`, color: 'error'})
                  getVideoURL(item).then(urls => {
                      if(item.renamed){ // 获取详细信息后再改变名称
                          delete item.renamed
                          this.applyRename(item.id)
                      }
                      httpRequest(Object.assign(item, {urls}).urls)
                  })
              }else{
                  httpRequest(urls)
              }
              return true
          }
        }
  },
  nextDownload(){ // 进行下一次下载
      if(!this.running) return
      let {resources} = this
      if(!resources.some(item => this.downloadItem(item))){
        if(this.running){
          clearInterval(this.checkFinishTimer)
          this.checkFinishTimer = setInterval(() => {
              if(this.getItems(WAITTING).length == 0 && this.getItems(DOWNLOADING).length == 0){
                  clearInterval(this.checkFinishTimer)
                  this.switchRunning(false)
                  let msg = '所有任务下载完成!'
                  this.writeLog(msg) & (this.options.alert_done && alert(msg))
              }
          }, 1000)
        }
      }
  },
  findElement: id => $(`tr[data-id="${id}"]`)[0],  // 根据Id查找dom
  writeLog(msg, prefix = '提示', color = 'info'){ // 输出日志
    let div = $('#_log')[0]
    div.insertAdjacentHTML('beforeEnd', createHTML(`<p style="color: ${this.getColor(color)}">【${prefix}】 ${msg}</p>`))
    if(this.options.autoScroll) div.scrollTop = div.scrollHeight
  },
  getColor: color => ({success: '#8bc34a', error: '#a31545', info: '#fff', primary: '#3fa9fa' })[color] || color,
  setItemStatus({id, color, msg, el, item, status}){
      item ??= this.findItem(id)
      if(!item) return
      if(status !== undefined) item.status = status
      if(el === false) return
      el ??= this.findElement(id)
      let td = el.querySelectorAll('td')
      if(td[4]){
          td[4].style.backgroundColor = this.getColor(color)
          td[4].innerHTML = createHTML(msg)
      }
  },
  findItem(id, method = 'find'){ // 根据Item查找资源信息
    return this.resources[method](_item => _item.id == id)
  },
  safeFileName: str => str.replaceAll('\n', ' ').replaceAll('(', '（').replaceAll(')', '）').replaceAll(':', '：').replaceAll('*', '＊').replaceAll('?', '？').replaceAll('"', '＂').replaceAll('<', '＜').replaceAll('>', '＞').replaceAll("|", "｜").replaceAll('\\', '＼').replaceAll('/', '／')
}
_downloader.init()

function Base64() {
    // private property
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
            input = _utf8_encode(input);
    while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
    if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
    return output;
        }
    // public method for decoding
    this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
return output;
    }
// private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
var utftext = "";
for (var n = 0; n < string.length; n++) {
var c = string.charCodeAt(n);
if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
return utftext;
    }
    // private method for UTF-8 decoding
_utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
        if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
            return string;
    }
}

