// ==UserScript==
// @name         通用弹幕（douban）
// @namespace    doubanDM
// @version      5.6.9
// @description  添加弹幕功能
// @require     http://code.jquery.com/jquery-1.9.0.min.js
// @require     https://lib.baomitu.com/pako/latest/pako_inflate.min.js
// @require     https://cdn.jsdelivr.net/npm/hls.js@1.3.4/dist/hls.min.js
// @require     https://lib.baomitu.com/dplayer/1.27.1/DPlayer.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.1.0/js/md5.min.js
// @resource css https://lib.baomitu.com/dplayer/1.25.0/DPlayer.min.css
// @author       MIO
// @license MIT
// @match       https://www.kktv.me/play/*
// @match       http://www.yinghuacd.com/*
// @match       https://www.hngyzd.com/vodplay/*
// @match       https://www.nivod4.tv/*
// @match       https://jinmantv.com/*
// @match       https://movie.douban.com/subject/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v.qq.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/463022/%E9%80%9A%E7%94%A8%E5%BC%B9%E5%B9%95%EF%BC%88douban%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463022/%E9%80%9A%E7%94%A8%E5%BC%B9%E5%B9%95%EF%BC%88douban%EF%BC%89.meta.js
// ==/UserScript==

;(async () => {
  let window, dp, qstyle
  try {
    window = unsafeWindow
    window.GM_xmlhttpRequest = GM_xmlhttpRequest
    window.uaredirect = () => {}
  } catch (e) {}
  let mioconfig = {
    //和网址无关的配置
    danmaku: {
      maximum: 1000,
      bottom: '0%',
      unlimited: false,
      style: {
        animationDuration: '18s',
        opacity: 0.7,
        font: `24px 'Microsoft YaHei', Arial, Lucida Grande, Tahoma, sans-serif`,
        fontWeight: 'bold',
        lineHeight: 1.125,
        textShadow:
          'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px',
      },
    },
    duration: 20 * 60,
    color: 'EFFFFF', //默认颜色
    top: 3, //顶部设置 默认1
    bottom: 2, //底部设置 默认2
    temp: 50, //去重强度
    replaces: [
      {
        aim: /(\[.{0,}\])\1{2,}/,
        fun: (a, b, c, d, e) => {
          return b
        },
      },
      {
        aim: /(..?.?.?.?)\1{2,}/,
        fun: (a, b, c, d, e) => {
          return a == d ? b : b + b
        },
      },
    ],
    filters: [/^.$/], //过滤
    loads: [
      'seeked',
      'canplaythrough',
      'play',
      // 'durationchange',
      'ratechange',
    ],
    clears: ['pause', 'waiting', 'stalled'],
    key: 'ten',
    local: true,
    _n: 0,
    _step: 5,
    _左键: -5,
    _右键: 5,
    _按零快进: 85,
    加号跳到_: 0,
    弹幕前移_: 0,
    弹幕临时后移: 0,
  }
  function isDesktop() {
    const userAgent = window.navigator.userAgent
    const keywords = ['Windows', 'Macintosh', 'Linux'] // 包含电脑的关键词
    // 如果 User-Agent 中包含电脑相关的关键词，则认为是电脑
    return keywords.some((keyword) => userAgent.includes(keyword))
  }
  let checkhost = (host) => {
    if (host == location.host) {
      mioconfig.key = host
      return true
    } else {
      return false
    }
  }
  let checkSite = (href) => {
    let site
    if (/qiyi/.test(href)) {
      site = 'qiyi'
    }
    if (/mgtv/.test(href)) {
      site = 'hunantv'
    }
    if (/sohu/.test(href)) {
      site = 'sohu'
    }
    if (/youku/.test(href)) {
      site = 'youku'
    }
    if (/bili/.test(href)) {
      site = 'bilibili'
    }
    if (/qq\.com/.test(href)) {
      site = 'qq'
    }
    if (/ixigua/.test(href)) {
      site = 'ixigua'
    }
    return site
  }
  let flagFun = () => {
    window.v = document.querySelector('video')
    window.flag = false
    if (window.v && window.v.duration) {
      if (window.v && window.v.duration < 300) {
        window.v.currentTime = window.v.duration
        window.flag = false
      } else {
        mioconfig.duration = window.v.duration
        window.flag = true
      }
    } else {
      mioconfig.duration = 60 * 60
      window.flag = false
    }
    return (
      window.flag ||
      window?.MacPlayer?.PlayUrl?.match(/m3u8/) ||
      checkhost('www.yinghuacd.com')
    )
    // return document && !(checkhost('www.nivod4.tv') ^ !!window.__dp)
  }
  let checkReady = (flagFun, run, step) => {
    if (flagFun()) {
      run()
    } else {
      setTimeout(() => {
        checkReady(flagFun, run, step)
      }, step)
    }
  }
  let m = {
    getStorageSync: (key) => {
      return JSON.parse(localStorage.getItem(key))
    },
    setStorageSync: (key, data) => {
      localStorage.setItem(key, JSON.stringify(data))
    },
    removeStorageSync: (key) => {
      localStorage.removeItem(key)
    },
    clearStorageSync: () => {
      localStorage.clear()
    },
  }

  function get(url, headers, type, extra) {
    return new Promise((resolve, reject) => {
      let requestObj = GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers,
        responseType: type || 'json',
        onload: (res) => {
          if (res.status === 204) {
            requestObj.abort()
            idm[extra.index] = true
          }
          if (type === 'blob') {
            res.status === 200 &&
              base.blobDownload(res.response, extra.filename)
            resolve(res)
          } else {
            resolve(res.response || res.responseText)
          }
        },
        onprogress: (res) => {
          if (extra && extra.filename && extra.index) {
            res.total > 0
              ? (progress[extra.index] = (
                  (res.loaded * 100) /
                  res.total
                ).toFixed(2))
              : (progress[extra.index] = 0.0)
          }
        },
        onloadstart() {
          extra &&
            extra.filename &&
            extra.index &&
            (request[extra.index] = requestObj)
        },
        onerror: (err) => {
          reject(err)
        },
      })
    })
  }
  function post(url, data, headers, type) {
    if (typeof data === 'object') {
      data = JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers,
        data: 'data=' + encodeURIComponent(data),
        responseType: type || 'json',
        onload: (res) => {
          type === 'blob'
            ? resolve(res)
            : resolve(res.response || res.responseText)
        },
        onerror: (err) => {
          reject(err)
        },
      })
    })
  }
  function getHeader(url) {
    return new Promise((resolve, reject) => {
      let requestObj = GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
          if (res.status === 204) {
            requestObj.abort()
          }

          resolve(res)
        },
        onerror: (err) => {
          reject(err)
        },
      })
    })
  }

  let run = () => {
    //可以获取dp后执行
    let mioplayer = $('<div class="mioplayer"></div>')
    mioplayer[0].style = 'position:fixed;z-index:99999'
    //TODO mioplayer[0].style.pointerEvents = 'none'  需要考虑爱奇艺的搜索结果
    document.body.prepend(mioplayer[0])

    if (checkhost('www.yinghuacd.com')) {
      mioconfig = {
        ...mioconfig,
        video: {
          url: $('#playbox')?.attr('data-vid')?.replace('$mp4', ''),
          type: 'hls',
        },
        qstr: 'body > div > div.gohome.l > h1 > a',
        nstr: 'body > div > div.movurls > ul > li.sel > a',
        aim_str: 'body > div.play',
        next: {
          cur_str: 'body > div > div.movurls > ul > li.sel',
          isparent: true,
        },
      }
    }
    if (checkhost('www.nivod4.tv')) {
      mioconfig = {
        ...mioconfig,
        video: {
          url: window?.__dp?.options?.video.url,
          type: 'hls',
        },
        qstr: '.header-link',
        nstr: '.select-item.selected a',
        aim_str: '.flash-box',
        next: {
          cur_str: '.select-item.selected',
          isparent: true,
        },
      }
      __dp?.destroy()
    }
    if (checkhost('jinmantv.com')) {
      mioconfig = {
        ...mioconfig,
        video: {
          url: window?.MacPlayer?.PlayUrl,
          type: 'hls',
        },
        qstr: '.module-info-heading a',
        nstr: '#panel2 > div > div > a.module-play-list-link.active > span',
        aim_str:
          'body > div.page.player > div.main > div > div.module.module-player > div.module-main > div.player-box > div',
        next: {
          cur_str: '#panel2 > div > div > a.module-play-list-link.active',
          isparent: false,
        },
      }
    }
    if (checkhost('www.hngyzd.com')) {
      mioconfig = {
        ...mioconfig,
        video: {
          url: MacPlayer.PlayUrl,
          type: 'hls',
        },
        qstr: 'h1.title span',
        nstr: '.ewave-content__playlist .active a',
        aim_str: '.ewave-player__video',
        next: {
          cur_str: '.ewave-content__playlist .active',
          isparent: true,
        },
      }
    }

    let narr = Object.keys(mioconfig)
      .filter((o) => o.startsWith('_'))
      .map((o) => o.replace('_', ''))
    let narr_ = Object.keys(mioconfig)
      .filter((o) => o.endsWith('_'))
      .map((o) => o.replace('_', ''))
    let nmap = {}
    // let nmap_ = {}
    let q = $(mioconfig.qstr).html()

    qstyle = getComputedStyle($(mioconfig.qstr)[0])
    const defineOne = (parent, name, key, fornull, show) => {
      Object.defineProperty(parent, name, {
        get() {
          return GM_getValue(key + name, fornull)
        },
        set(e) {
          GM_setValue(key + name, e)
          if (show) {
            $('.' + name).html(e.toFixed())
          }
        },
      })
      if (show) {
        nmap[name] = $(
          `<span class="${name}">${mioconfig[name]?.toFixed() ?? ''}</span>`
        )
        nmap['pre' + name] = $(
          `<span class="${'pre' + name}">${name + ':'}</span>`
        )
        nmap[name][0].style.color = qstyle.color
        nmap['pre' + name][0].style.color = qstyle.color
        nmap[name][0].style.fontSize = qstyle.fontSize
        nmap['pre' + name][0].style.fontSize = qstyle.fontSize
        mioplayer.append(`<span>\t</span>`)
        mioplayer.append(nmap['pre' + name])
        mioplayer.append(nmap[name])
      }
    }

    let douban = ['locallist', 'multilist', 'listn'] //按剧名共用不显示的配置
    douban.forEach((o, i) => {
      Object.defineProperty(mioconfig, o, {
        get() {
          return GM_getValue(q + o, [])
        },
        set(e) {
          GM_setValue(q + o, e)
        },
      })
    })

    narr.forEach((o, i) => {
      Object.defineProperty(mioconfig, o, {
        get() {
          return GM_getValue(o, mioconfig['_' + o]) || mioconfig['_' + o]
        },
        set(e) {
          GM_setValue(o, e)
          $('.' + o).html(e.toFixed())
        },
      })
      nmap[o] = $(`<span class="${o}">${mioconfig[o].toFixed()}</span>`)
      nmap['pre' + o] = $(
        `<span class="${'pre' + o}">${i + '.' + o + ':'}</span>`
      )
      nmap[o][0].style.color = qstyle.color
      nmap['pre' + o][0].style.color = qstyle.color
      nmap[o][0].style.fontSize = qstyle.fontSize
      nmap['pre' + o][0].style.fontSize = qstyle.fontSize
      mioplayer.append(`<span>\t</span>`)
      mioplayer.append(nmap['pre' + o])
      mioplayer.append(nmap[o])
    })
    narr_.forEach((o, i) => {
      Object.defineProperty(mioconfig, o, {
        get() {
          return (
            GM_getValue(q + '_' + o, mioconfig[o + '_']) || mioconfig[o + '_']
          )
        },
        set(e) {
          GM_setValue(q + '_' + o, e)
          $('.' + o).html(e.toFixed())
        },
      })
      nmap[o] = $(`<span class="${o}">${mioconfig[o].toFixed()}</span>`)
      nmap['pre' + o] = $(
        `<span class="${'pre' + o}">${i + narr.length + '.' + o + ':'}</span>`
      )
      nmap[o][0].style.color = qstyle.color
      nmap['pre' + o][0].style.color = qstyle.color
      nmap[o][0].style.fontSize = qstyle.fontSize
      nmap['pre' + o][0].style.fontSize = qstyle.fontSize
      mioplayer.append(`<span>\t</span>`)
      mioplayer.append(nmap['pre' + o])
      mioplayer.append(nmap[o])
    })
    mioplayer.append(`<br/>`)
    defineOne(mioconfig, 'ad_from', mioconfig.key, null, true)
    defineOne(mioconfig, 'ad_to', mioconfig.key, null, true)
    narr = [...narr, ...narr_]
    let n =
      $(mioconfig.nstr)
        ?.html()
        ?.replace(/[第集]/g, '') || 0
    let ori = n
    let add = ''
    window.ori = ori //原始n
    n = n.match(/\d+/g) ? n.match(/\d+/g)[0] : ''
    add = ori.replace(n, '').replace('（', '').replace('）', '')
    if (Number.isInteger(n - 0)) {
      n = n - 0 + ''
    }
    window.add = add
    try {
      unsafeWindow.mioconfig = mioconfig
      unsafeWindow.config2 = mioconfig
      unsafeWindow.storage = storage
    } catch (error) {}
    let ykid,
      qqid,
      mgid,
      qyid,
      blid,
      shid,
      site,
      localdm = [],
      danmulist = []
    let find = (str, key) => {
      return $(str).find(key).html()
    }

    let settings = {
      user_agent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/108.0',
    }

    let aim = $(mioconfig.aim_str)[0]
    let height = aim.clientHeight
    if (height > innerHeight) {
      height = innerHeight
    }
    document.head.append(
      $(
        `<link rel="stylesheet" href="https://lib.baomitu.com/dplayer/1.25.0/DPlayer.min.css"></link>`
      )[0]
    )

    aim.innerHTML = `<div style="width: 100%; height:${height}px;" id="dplayer"></div>`
    if (checkhost('www.yinghuacd.com')) {
      aim.style.marginTop = '200px'
    }
    let danmaku = mioconfig.danmaku
    let video = mioconfig.video
    dp = new DPlayer({
      container: document.querySelector('#dplayer'),
      autoplay: true,
      lang: 'zh-cn',
      danmaku,
      apiBackend: {
        read: function (options) {
          options.success({ code: 0, data: [] })
        },
        send: function (options) {
          options.success({ code: 0, data: [] })
        },
      },
      video,
    })
    const parent = document.querySelector('.dplayer-danmaku')
    // 创建 MutationObserver 对象
    const observer = new MutationObserver(function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 遍历新增的节点
          for (let node of mutation.addedNodes) {
            let {
              fontSize,
              fontWeight,
              font,
              animationDuration,
              opacity,
              textShadow,
            } = mioconfig.danmaku.style
            let { style } = node
            style.font = font
            style.fontSize = fontSize
            style.fontWeight = fontWeight
            style.animationDuration = animationDuration
            style.opacity = opacity
            style.textShadow = textShadow
          }
        }
      }
    })
    // 监听父元素
    observer.observe(parent, {
      childList: true,
    })

    let pathname = location.pathname
    let keyandn = pathname?.match(/\/(.*?-\w+)-/)?.[1]
    if (!keyandn) {
      keyandn = q + n
    }

    let last_key = 'T_' + keyandn.replace('-', '_')

    // 检查本地存储中是否存在播放记录，如果存在，从该时间戳开始播放视频
    const { value: lastPlayTime } = m.getStorageSync(last_key) || {
      value: null,
    }
    if (lastPlayTime != null) {
      dp.seek(lastPlayTime)
    } else {
      dp.seek(mioconfig['加号跳到'])
    }
    window.dp = dp

    if (mioconfig.local) {
      let v = dp.video
      let ot
      let vat
      let onCache = () => {
        vat = v.buffered.length - 1
        let last = v.buffered.end(vat)
        if (v.duration - 60 > last) {
          dp.seek(last)
        }
      }
      let startCache = () => {
        dp.pause()
        dp.fullScreen.cancel()
        v.addEventListener('canplaythrough', onCache)
        ot = v.currentTime
        localStorage.setItem(q + n + 'ot', ot)
        vat = v.buffered.length - 1
        dp.seek(v.buffered.end(vat))
      }
      let cancelCache = () => {
        v.removeEventListener('canplaythrough', onCache)
        ot = localStorage.getItem(q + n + 'ot')
        if (ot) {
          localStorage.removeItem(q + n + 'ot')
          dp.seek(ot)
        }
      }
      window.onunload = function () {
        m.setStorageSync(last_key, { value: v.currentTime })
        if (mioconfig.ad_from && mioconfig.ad_to) {
          if (v.currentTime >= mioconfig.ad_to) {
            mioconfig[弹幕前移] += mioconfig.ad_to - mioconfig.ad_from
          }
        }
      }
      document.onkeydown = (e) => {
        if (e.keyCode == 96) {
          //0快进设置的时间
          e.preventDefault()
          dp.seek(dp.video.currentTime + mioconfig['按零快进'])
        } else if (e.keyCode == 37) {
          //0快进设置的时间
          e.preventDefault()
          dp.seek(dp.video.currentTime + mioconfig['左键'])
        } else if (e.keyCode == 39) {
          //0快进设置的时间
          e.preventDefault()
          dp.seek(dp.video.currentTime + mioconfig['右键'])
        } else if (e.keyCode == 110) {
          //.点击下一集
          e.preventDefault()
          let next,
            current = $(mioconfig.next.cur_str)
          if (mioconfig?.next?.isparent) {
            next = current.next().find('a')[0]
          } else {
            next = current.next()[0]
          }
          if (!next) {
            $('.qy-episode-num')[0].innerHTML = $('.qy-episode-num')
              .toArray()
              .map((o) => o.innerHTML)
            next = $(mioconfig.next.cur_str).next().find('a')[0]
          }
          next.click()
        } else if (e.keyCode == 13) {
          //右回车 全屏
          e.preventDefault()
          let video = dp.video
          video.focus()
          if (dp.fullScreen.isFullScreen()) {
            dp.fullScreen.cancel()
          } else {
            dp.fullScreen.request()
          }
        } else if (e.keyCode == 107) {
          //右加号跳到指定位置
          e.preventDefault()
          if (dp.video.currentTime > 30 && dp.video.currentTime < 180) {
            mioconfig['加号跳到'] = dp.video.currentTime
          } else if (dp.video.currentTime < dp.seek(mioconfig['加号跳到'])) {
            dp.seek(mioconfig['加号跳到'])
          }
        } else if (e.keyCode == 109) {
          e.preventDefault()
          if (dp.video.paused) {
            ot = localStorage.getItem(q + n + 'ot')
            if (ot) {
              cancelCache()
            }
            dp.fullScreen.request()
            dp.play()
          } else {
            dp.pause()
            dp.fullScreen.cancel()
          }
          // dp.toggle()
        } else if (e.keyCode == 106) {
          //右* 缓存全集
          ot = localStorage.getItem(q + n + 'ot')
          if (ot) {
            cancelCache()
          } else {
            startCache()
          }
        } else if (e.keyCode == 189) {
          dp.video.pause()
          mioconfig[narr[mioconfig.n]] -= mioconfig.n == 1 ? 1 : mioconfig.step //-弹幕后退5秒
          dp.video.play()
          // let aim = danmulist.find((one) => {
          //   return one.time_offset >= dp.video.currentTime * 1000
          // })
          // skipaim.html(aim.content + aim.time_offset)
        } else if (e.keyCode == 187) {
          dp.video.pause()
          mioconfig[narr[mioconfig.n]] -= -(mioconfig.n == 1
            ? 1
            : mioconfig.step) //=弹幕快进5秒
          dp.video.play()
          // let aim = danmulist.find((one) => {
          //   return one.time_offset >= dp.video.currentTime * 1000
          // })
          // skipaim.html(aim.content + aim.time_offset)
        } else if (e.keyCode >= 48 && e.keyCode < 57) {
          mioconfig.n = e.keyCode - 48
        } else if (e.keyCode == 97) {
          mioconfig.ad_from = dp.video.currentTime
        } else if (e.keyCode == 98) {
          mioconfig.ad_to = dp.video.currentTime
        } else if (e.keyCode == 99) {
          mioconfig.ad_to = null
          mioconfig.ad_from = null
        }
      }
      if (mioconfig.ad_from && mioconfig.ad_to) {
        let skip_ad = () => {
          if (
            v.currentTime >= mioconfig.ad_from &&
            v.currentTime < mioconfig.ad_to
          ) {
            v.currentTime = mioconfig.ad_to
            mioconfig['弹幕临时后移'] = mioconfig.ad_to - mioconfig.ad_from
            v.removeEventListener('ontimeupdate', skip_ad)
          } else if (v.currentTime >= mioconfig.ad_to) {
            mioconfig['弹幕临时后移'] = mioconfig.ad_to - mioconfig.ad_from
            v.removeEventListener('ontimeupdate', skip_ad)
          }
        }
        v.ontimeupdate = skip_ad
      }
    }
    let danmu = (q, n, dp) => {
      //获取dp后执行
      let danmaku,
        last_texts = []
      let rate = dp.video.playbackRate

      let getmgId = (url) => {
        let start = url.indexOf('/b/') + 3
        let end = url.indexOf('.html')
        let cvid = url.substring(start, end).split('/')
        let cid = cvid[0]
        let vid = cvid[1]
        mgid = {
          cid,
          vid,
        }
        window.mgid = mgid
        return mgid
      }
      let getykId = (url) => {
        let start = url.indexOf('id_') + 3
        let end = url.indexOf('.html')
        let vid = url.substring(start, end)
        ykid = {
          vid,
        }
        window.ykid = ykid
        return ykid
      }
      let getqiyiId = async (url) => {
        let res = await get(url)
        let id = res.match(/tvId":(\d+)/)?.[1]
        qyid = {
          id,
        }
        window.qyid = qyid

        return qyid
      }
      let getsohuId = async (url) => {
        let res = await get(url)
        let ids = res.match(/videoinfo\/(\d+)\/\d+\/(\d+)\/init/)
        let vid = ids[1]
        let aid = ids[2]
        shid = {
          vid,
          aid,
        }
        window.shid = shid
        return shid
      }
      let getbiliId = async (url) => {
        let ep_id = url.match(/ep(\d+)/)[1]

        let res2 = await get(
          'https://bangumi.bilibili.com/view/web_api/season?ep_id=' + ep_id
        )
        try {
          res2 = JSON.parse(res2)
        } catch (error) {}
        let cids = res2.result.episodes.map((one) => one.cid)
        let id = cids[n - 1]
        blid = {
          id,
        }
        window.blid = blid
        return blid
      }
      let getqqId = (url) => {
        let begin = url.indexOf('cover/')
        let end = url.indexOf('.html')
        let ids = url.substring(begin + 6, end).split('/')
        qqid = ids[ids.length - 1]
        return qqid
      }
      let shrun = async ({ vid, aid }) => {
        //1000秒 约3小时
        let url = `https://api.danmu.tv.sohu.com/dmh5/dmListAll?request_from=h5_js&vid=${vid}&aid=${aid}&time_begin=0&time_end=10000`
        let res = await get(url)
        let danmulist = res.info.comments.map((one) => {
          let rone = {
            content: one.c,
            color: one?.t?.c ? (+one.t.c).toString(16) : mioconfig.color,
            time_offset: one.v * 1000,
          }
          return rone
        })
        return danmulist
      }
      let qqrun = async (id) => {
        let baseurl = 'https://dm.video.qq.com/barrage/base/' + id
        let base = await get(baseurl)

        let segment_index = base.segment_index
        let segment_list = []
        for (const key in segment_index) {
          if (Object.hasOwnProperty.call(segment_index, key)) {
            const element = segment_index[key]
            segment_list.push(element)
          }
        }
        let urls = segment_list.map(
          (one) =>
            'https://dm.video.qq.com/barrage/segment/' +
            id +
            '/' +
            one.segment_name
        )
        let danmutable = await Promise.all(
          urls.map(async (url) => {
            let temp
            try {
              let danmu = await get(url)
              temp = danmu.barrage_list
            } catch (error) {
              temp = []
            }
            return Promise.resolve(temp)
          })
        )
        let danmulist = danmutable.reduce((a, b) => {
          // if (b.length > 550) {
          // b.sort((x, y) => y.content_score - x.content_score)
          // b.length = 400
          // b = b.filter((one) => {
          //   return one.content_score > 5
          // })
          // }
          return a.concat(b)
        }, [])
        return danmulist.map((one) => {
          try {
            one.content_style = JSON.parse(one.content_style)
            one.color =
              one.content_style.gradient_colors[0] || one.content_style.color
            one.type = mioconfig.top
          } catch (error) {
            one.type = 3
            one.color = 'FFFFFF'
          }
          return one
        })
      }
      let mgrun = async (mgid) => {
        window.mgid = mgid
        let pre = await get(
          'https://galaxy.bz.mgtv.com/getctlbarrage?vid=' +
            mgid.vid +
            '&cid=' +
            mgid.cid
        )
        let data = pre.data
        let preurl
        let un = Math.floor(dp?.video?.duration || mioconfig.duration / 60) || 0
        let urls = []
        if (data.cdn_list) {
          preurl =
            'https://' +
            data.cdn_list.split(',')[0] +
            '/' +
            data.cdn_version +
            '/'
          for (let i = 0; i <= un; i++) {
            urls.push(preurl + i + '.json')
          }
        } else {
          preurl = `https://galaxy.bz.mgtv.com/cdn/opbarrage?vid=${mgid.vid}&cid=${mgid.cid}&time=`
          for (let i = 0; i <= un; i++) {
            urls.push(preurl + i * 60000)
          }
        }
        // let mgt = GM_getValue('mgt' + mgid.cid)
        // if (!mgt) {
        //   GM_setValue('mgt' + mgid.cid, '0')
        //   mgt = '0'
        // }
        let danmutable = await Promise.all(
          urls.map(async (url) => {
            let temp
            try {
              let danmu = await get(url)
              temp = danmu.data.items.map((one) => {
                let rone = {
                  content: one.uname
                    ? one.uname + '：' + one.content
                    : one.content,
                  type: one.type,
                  //TODO 不同来源弹幕时间偏移 time_offset: one.time - -mgt * 1000,
                  time_offset: one.time,
                  color: 'FFFFFF',
                  content_score: one.v2_up_count,
                }
                if (one.v2_color) {
                  let rgb = one.v2_color.color_left
                  let color =
                    rgb.r.toString(16).padStart(2, '0') +
                    rgb.g.toString(16).padStart(2, '0') +
                    rgb.b.toString(16).padStart(2, '0')
                  rone.color = color
                }
                if (one.v2_position == 1) {
                  rone.type = mioconfig.top
                }
                if (one.v2_position == 2) {
                  rone.type = mioconfig.bottom
                }
                return rone
              })
            } catch (error) {
              temp = []
            }

            return Promise.resolve(temp)
          })
        )
        let danmulist = danmutable.reduce((a, b) => {
          return a.concat(b)
        }, [])
        window.mglist = danmutable
        return danmulist
      }
      let ykrun = async ({ vid }) => {
        let getcna = async () => {
          let res = await get('https://log.mmstat.com/eg.js')
          let cna = res.substring(res.indexOf('Etag=') + 6, res.indexOf('";'))
          console.log(cna, 'cna')
          return cna
        }
        let cna = await getcna()
        let get_cookies = (cookie_str) => {
          let cookies = {}
          if (!cookie_str) {
            return cookies
          }
          let cookie_rows = cookie_str.split('\n')
          cookie_rows.map((cookie_row) => {
            let cookie_items = cookie_row.split(';')
            if (cookie_items.length > 0) {
              let kvs = cookie_items[0].split('=')
              if (kvs.length > 1) {
                cookies[kvs[0].replace('Set-Cookie: ', '')] = kvs[1]
              }
            }
          })
          return cookies
        }
        let encode64 = (str) => {
          return btoa(
            encodeURIComponent(str).replace(
              /%([0-9A-F]{2})/g,
              function (match, p1) {
                return String.fromCharCode('0x' + p1)
              }
            )
          )
        }
        let download_seg = async (cna, vid, seg, danmulist) => {
          let t = Date.now()
          t = t - (t % 1000) + ''
          let msg = {
            ['ctime']: t,
            ['ctype']: 10004,
            ['cver']: 'v1.0',
            ['guid']: cna,
            ['mat']: seg,
            ['mcount']: 1,
            ['pid']: 0,
            ['sver']: '3.1.0',
            ['type']: 1,
            ['vid']: vid,
          }
          let msg_json = JSON.stringify(msg)

          let msg_b64 = encode64(msg_json)

          msg['msg'] = msg_b64
          let sign = md5(msg_b64 + 'MkmC9SoIw6xCkSKHhJ7b5D2r51kBiREr')
          msg['sign'] = sign
          let res = await getHeader(
            'https://acs.youku.com/h5/mtop.com.youku.aplatform.weakget/1.0/?jsv=2.5.6&appKey=24679788',
            { headers: { 'User-Agent': settings.user_agent } }
          )
          let cookies = get_cookies(res.responseHeaders)
          let cookie_header = ''
          if (cookies['_m_h5_tk_enc'] && cookies['_m_h5_tk']) {
            for (let k in cookies) {
              let c = k + '=' + cookies[k]
              if (cookie_header) {
                cookie_header += ';' + c
              } else {
                cookie_header = c
              }
            }
          } else {
            console.log('null', res.responseHeaders)
            return danmulist
          }
          let headers = {
            ['Content-Type']: 'application/x-www-form-urlencoded',
            ['Cookie']: cookie_header,
            ['Referer']: 'https://v.youku.com',
            ['User-Agent']: settings['user_agent'],
          }
          let data = JSON.stringify(msg)

          let t_sing_hash_data =
            cookies['_m_h5_tk'].substr(0, 32) +
            '&' +
            t +
            '&' +
            '24679788' +
            '&' +
            data
          let t_sign = md5(t_sing_hash_data)

          let pres = await post(
            `https://acs.youku.com/h5/mopen.youku.danmu.list/1.0/?jsv=2.5.6&appKey=24679788&t=${t}&sign=${t_sign}&api=mopen.youku.danmu.list&v=1.0&type=originaljson&dataType=jsonp&timeout=20000&jsonpIncPrefix=utility`,
            data,
            headers
          )
          let obj = JSON.parse(pres.data.result)
          danmulist.push(
            obj.data.result.map((one) => {
              let p = JSON.parse(one.propertis)
              let type = 3
              if (p.pos == 4) {
                type = mioconfig.top
              }
              if (p.pos == 6) {
                type = mioconfig.bottom
              }
              let rone = {
                content: one.content,
                type,
                time_offset: one.playat,
                color: p.color.toString(16),
              }
              return rone
            })
          )

          return danmulist
        }
        let res = await get(
          'https://openapi.youku.com/v2/videos/show.json?client_id=53e6cc67237fc59a&package=com.huawei.hwvplayer.youku&ext=show&video_id=' +
            vid
        )
        let duration = res.duration
        let un = Math.ceil(duration / 60) || 0
        let danmutable = []
        for (let i = 1; i <= un; i++) {
          danmutable = await download_seg(cna, vid, i, danmutable)
        }
        let danmulist = danmutable
          .reduce((a, b) => {
            return a.concat(b)
          }, [])
          .map((one) => {
            one.time_offset
            return one
          })
        // window.dmlist = danmulist
        return danmulist

        // console.log(cna,'cna')
      }
      let iqirun = async ({ id }) => {
        let downqy = async (url, i, danmutalbe) => {
          let res = await get(url + i + '.z', null, 'arraybuffer')
          let resArray = new Uint8Array(res)
          let resString = new TextDecoder().decode(pako.ungzip(resArray))

          let danmu = $(resString).find('bulletinfo').toArray()
          danmutalbe.push(danmu)
          return danmutalbe
        }
        let danmutable = []
        let tvid = '0000' + id
        let s1 = tvid.substr(tvid.length - 4, 2)
        let s2 = tvid.substr(tvid.length - 2, 2)

        let url = `https://cmts.iqiyi.com/bullet/${s1}/${s2}/${id}_300_1.z`

        let res = await get(url, null, 'arraybuffer')
        let resArray = new Uint8Array(res)
        let resString = new TextDecoder().decode(pako.ungzip(resArray))
        window.resString = resString
        // let danmu = $(resString).find('bulletinfo').toArray()
        let duration = $(resString).find('duration').html()
        let preurl = `https://cmts.iqiyi.com/bullet/${s1}/${s2}/${id}_300_`
        for (let i = 1; i <= Math.ceil(duration / 300); i++) {
          await downqy(preurl, i, danmutable)
        }
        let danmulist = danmutable.reduce((a, b) => {
          return a.concat(b)
        }, [])
        danmulist = danmulist.map((o) => {
          let color = find(o, 'color')
          let content = find(o, 'content')
          let showtime = find(o, 'showtime')
          let position = find(o, 'position')
          let type = 3
          if (position == 100) {
            type = mioconfig.top
          }
          if (position == 200) {
            type = mioconfig.bottom
          }
          let rone = {
            color,
            content,
            time_offset: showtime * 1000,
            type,
          }
          return rone
        })
        return danmulist
      }
      let blrun = async ({ id: cid }) => {
        let getXml = async (cid) => {
          let res = await get('https://comment.bilibili.com/' + cid + '.xml')
          return res
        }
        let xml = await getXml(cid)
        let danmu = $(xml).find('d').toArray()
        let danmulist = danmu.map((one) => {
          let attr = one.attributes[0].textContent.split(',')
          let type = 3
          if (attr[1] == 5) {
            type = mioconfig.top
          }
          if (attr[1] == 4) {
            type = mioconfig.bottom
          }
          return {
            time_offset: attr[0] * 1000,
            text: one.innerHTML,
            content: one.innerHTML,
            color: (+attr[3]).toString(16),
            type,
          }
        })

        return danmulist
      }
      let clear = () => {
        let tts = GM_getValue(q + 'tts', [])
        tts.map(clearTimeout)
      }
      let load = () => {
        if (dp.video.paused) {
          return
        }
        if (window.addlist && window.addlist.length) {
          localdm = [...localdm, ...window.addlist]
          window.addlist.length = 0
        }
        let ds = (danmulist || [])
          .concat(localdm)
          .map((one) => {
            mioconfig.replaces.map((m) => {
              one.content = one.content.replace(m.aim, m.fun)
            })
            one.text = one.content
            one.show_time =
              one.time_offset / 1000 -
              mioconfig['弹幕前移'] +
              mioconfig['弹幕临时后移']
            return one
          })
          .filter((one) => {
            let flag = mioconfig.filters.every((o) => {
              return !o.test(one.text)
            })
            return flag && one.show_time / 1000 < dp.video.currentTime + 605
          })
        window.ds = ds
        let tts = GM_getValue(q + 'tts', [])
        let last_time = GM_getValue(q + 'last_time', 0)
        tts.map(clearTimeout)
        tts = ds.map((one) => {
          if (
            one.show_time - dp.video.currentTime > 0 ||
            (one.show_time - dp.video.currentTime > -0.5 &&
              one.show_time - last_time > 0)
          ) {
            return setTimeout(() => {
              danmaku = {
                text: one.text,
                color:
                  '#' +
                  (one.color.replace(/FFFFFF/i, mioconfig.color) ||
                    mioconfig.color),
                type: one.type,
              }

              if (!last_texts.includes(one.text)) {
                dp.danmaku.draw(danmaku)
                last_texts.push(one.text)
              } else {
                dp.danmaku.draw({ text: ' ' })
              }
              if (last_texts.length > mioconfig.temp) {
                last_texts.shift()
              }
              let last_time = one.show_time
              GM_setValue(q + 'last_time', last_time)
            }, ((one.show_time - dp.video.currentTime + Math.random()) * 1000) / rate)
          } else {
            return null
          }
        })
        GM_setValue(q + 'tts', tts)
      }
      let handleMul = async (urls) => {
        let danmulist, templist
        let danmutable = await Promise.all(
          urls.map(async (url) => {
            try {
              templist = await handleUrl(url, false)
            } catch (error) {
              templist = []
            }
            return Promise.resolve(templist)
          })
        )
        danmulist = danmutable.reduce((a, b) => {
          return a.concat(b)
        }, [])
        return danmulist
      }
      // let addmulti = async () => {
      //   let multilist = config.multilist
      //   multilist.map((o) => {
      //     let triggle = $(`<button>${o.site}</button>`)
      //     triggle[0].onclick = async () => {
      //       site = o.site
      //       config.locallist = o.list
      //     }
      //     $(config.qstr).closest('div').append(`<span>\t</span>`)
      //     $(config.qstr).closest('div').append(triggle)
      //   })
      // }
      let getMul = (n) => {
        let multilist = mioconfig.multilist
        let prelist = multilist.filter((o) => o.list.length >= n)
        let sites = prelist.map((o) => o.site)
        document.title = n + '-' + sites + '-' + q
        let urls = prelist.map((one) => one.list[n - 1])
        return urls
      }
      let getOne = async (q, n) => {
        // let multilist = config.multilist
        let locallist = mioconfig.locallist
        // if (multilist.length) {
        //   await addmulti()
        if (locallist.length) {
          return locallist[n - 1]
        }
        // }

        // if (checkhost('www.nivod4.tv')) {
        //可以加上演员
        // q = q + ' ' + $('.content-paragraph').eq(1).html().split(',')[0]
        // }
        let res = await get('https://so.iqiyi.com/so/q_' + q)
        eval(res.match(/script>(window.*?)<\/script/)[1])

        mioconfig.list = window.__NUXT__.data[1].cardData.list
        let listn = +mioconfig.listn
        let url =
          mioconfig.list[listn].videoinfos?.[n - 1]?.url ||
          mioconfig.list[listn].g_main_link
        site = mioconfig.list[listn].siteId
        let list = mioconfig.list
          .map(({ siteId, g_title }) => {
            return { siteId, g_title }
          })
          .slice(0, 7)
        list.forEach((o, i) => {
          let triggle = $(`<button>${o.siteId + ':' + o.g_title}</button>`)
          // triggle[0].style.color = qstyle.color
          triggle[0].onclick = async () => {
            mioconfig.listn = i
            clear()
            let url =
              mioconfig.list[mioconfig.listn].videoinfos?.[n - 1]?.url ||
              mioconfig.list[mioconfig.listn].g_main_link
            mioconfig.locallist = mioconfig.list[
              mioconfig.listn
            ].videoinfos?.map((o) => 'https:' + o.url) || [
              mioconfig.list[mioconfig.listn].g_main_link,
            ]
            site = mioconfig.list[mioconfig.listn].siteId
            url = 'https:' + url
            danmulist = await handleUrl(url)
            load()
          }
          mioplayer.append(`<span>\t</span>`)
          mioplayer.append(triggle)
        })
        return 'https:' + url
      }
      let handleUrl = async (href, pure = true) => {
        let danmulist = []
        let site = checkSite(href)
        if (pure) {
          document.title = site + ':' + q + n
        }
        if (['qq'].includes(site)) {
          qqid = getqqId(href)
          danmulist = await qqrun(qqid)
        }
        if (['youku'].includes(site)) {
          ykid = getykId(href)
          danmulist = await ykrun(ykid)
        }
        if (['qiyi', 'iqiyi'].includes(site)) {
          qyid = await getqiyiId(href)
          danmulist = await iqirun(qyid)
        }
        if (['bilibili'].includes(site)) {
          blid = await getbiliId(href)
          danmulist = await blrun(blid)
        }
        if (['sohu'].includes(site)) {
          shid = await getsohuId(href)
          danmulist = await shrun(shid)
        }
        if (['hunantv', 'imgo'].includes(site)) {
          mgid = getmgId(href)
          danmulist = await mgrun(mgid)
        }
        mioconfig[site] = danmulist
        return danmulist
      }
      document.addEventListener(
        'dragover',
        (e) => {
          e.preventDefault()
        },
        false
      )
      document.addEventListener(
        'drop',
        (e) => {
          let dt = e.dataTransfer,
            item,
            reader
          // 阻止默认事件的触发
          e.preventDefault()
          if (dt && dt.files) {
            item = dt.files[0]
            // 通过使用FileReader构造器来读取该文件
            reader = new FileReader()
            reader.readAsText(item)
            // 读取文件后将base64的数据传递给隐藏的输入框并做提交
            reader.onload = function (e2) {
              let xml = reader.result
              xml = new DOMParser().parseFromString(xml, 'text/xml')
              let danmu = $(xml).find('d').toArray()
              let prelocal = danmu.map((one) => {
                let attr = one.attributes[0].textContent.split(',')
                let type = 3
                if (attr[1] == 5) {
                  type = mioconfig.top
                }
                if (attr[1] == 4) {
                  type = mioconfig.bottom
                }
                return {
                  time_offset: attr[0] * 1000,
                  text: one.innerHTML,
                  content: one.innerHTML,
                  color: (+attr[3]).toString(16),
                  type,
                }
              })
              if (prelocal.length) {
                localdm = [...localdm, ...prelocal]
              } else {
                localdm = []
              }
              load()
            }
          }
        },
        false
      )
      let startRun = async (q, n, dp) => {
        //声明webrun 后执行 页面打开后只执行一次 绘制界面 监听事件
        //先用原始q尝试获取豆瓣的列表
        if (mioconfig.multilist.length) {
          let urls = await getMul(n)
          danmulist = await handleMul(urls)
        } else {
          if (mioconfig.locallist.length == 0 && isDesktop()) {
            let listenerId
            window.open(
              'https://search.douban.com/movie/subject_search?search_text=' + q
            )
            let test = async (name, oldValue, newValue, remote) => {
              try {
                eval(newValue)
                if (window.sources) {
                  let multilist = []
                  for (let key in sources) {
                    let o = sources[key][0].play_link
                    let site = checkSite(o)
                    let list = sources[key].map((o) => {
                      return decodeURIComponent(
                        o.play_link.match(/link2\/\?url=(.*?)&/)?.[1]
                      )
                    })
                    let onelist = { site, list }
                    multilist.push(onelist)
                  }
                  mioconfig.multilist = multilist
                  if (multilist.lenth == 1) {
                    mioconfig.locallist = multilist[0].list
                  }
                  let urls = await getMul(n)
                  danmulist = await handleMul(urls)
                  load()
                }
                let multilist = mioconfig.multilist
                if (multilist.length) {
                  let urls = await getMul(n)
                  danmulist = await handleMul(urls)
                  load()
                  GM_removeValueChangeListener(listenerId)
                }
              } catch (error) {}
            }
            // window.onmessage = test
            listenerId = GM_addValueChangeListener('sources', test)
          }
          //可以针对网站修改q更容易匹配
          // q = q
          // .replace('名侦探柯南', '名侦探柯南 日语版 动漫')
          // .replace('火影忍者：博人传之次世代继承者', '博人传 火影忍者新时代')
          if (!/\d/.test(n)) {
            return
          }

          let url = await getOne(q, n)
          danmulist = await handleUrl(url)
        }
        checkReady(
          () => {
            return danmulist.length
          },
          load,
          100
        )
        setInterval(load, (600 * 1000) / rate)
        mioconfig.loads.map((o) => {
          dp.on(o, load)
        })
        mioconfig.clears.map((o) => {
          dp.on(o, clear)
        })
      }
      startRun(q, n, dp)
    }
    danmu(q, n, dp)
  }
  if (/https:\/\/movie.douban.com\/subject\/\d+/.test(location.href)) {
    let pageContent = document.body.innerHTML
    let oriContent,
      rightStart,
      aimString = ''
    let aimIndex = pageContent.indexOf('var sources')
    if (aimIndex != -1) {
      oriContent = pageContent
      rightStart = oriContent.substring(aimIndex)
      aimString = rightStart.substring(0, rightStart.indexOf('$'))
    } else {
      let aimJS = document.body.innerHTML.match(
        /https:\/\/img1.doubanio\.com\/misc\/mixed_static\/(\w+)\.js/g
      )
      let jsArray = await Promise.all(
        aimJS.map(async (o) => {
          oriContent = await get(o)
          aimIndex = oriContent.indexOf('var sources')
          if (aimIndex != -1) {
            rightStart = oriContent.substring(aimIndex)
            aimString = rightStart.substring(0, rightStart.indexOf('$'))
            return Promise.resolve(aimString)
          }
          return Promise.resolve('')
        })
      )
      aimString = jsArray.find((o) => o.length)
    }
    let evalAim = aimString.replace('var sources', 'window.sources')
    GM_setValue('sources', evalAim)
    window.close()
  } else {
    checkReady(flagFun, run, 100)
  }
})()
