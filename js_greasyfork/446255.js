// ==UserScript==
// @name         去nm的哔哩哔哩
// @license      MIT
// @namespace    zam157.pilifukker
// @version      0.10
// @description  Fuck pilipili
// @author       Zam157
// @run-at       document-start
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/list/watchlater*
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446255/%E5%8E%BBnm%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/446255/%E5%8E%BBnm%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const css = `
    .act-now,
    .bilibili-player-electric-panel,
    .bilibili-player-ending-panel,
    .video-page-special-card,
    .activity-m,
    .bilibili-player-dm-tip-wrap,
    .bpx-player-electric-wrap,
    .bpx-player-cmd-dm-inside,
    .vcd,
    #bannerAd,
    #right-bottom-banner,
    #live_recommand_report {
      display: none!important;
    }

    .bili-header__bar.mini-header,
    .reply-box.fixed-box,
    .comment-send-lite {
      backdrop-filter: saturate(50%) blur(8px)!important;
      background: none!important;
    }
  `
  GM_addStyle(css)

  function inject(target, fnName, cb) {
    const originalFn = target[fnName]
    target[fnName] = function (...args) {
      cb.call(this, originalFn.bind(this), args)
    }
  }

  // 改写addEventListener，禁止目标元素的mousemove事件
  inject(EventTarget.prototype, 'addEventListener', function (originalFn, args) {
    const [type, listener] = args
    if (type === 'mousemove' && listener?.name === '' && this?.className?.includes?.('bpx-player-video-area'))
      return

    return originalFn(...args)
  })

  // 劫持评论脚本，添加ip显示
  inject(HTMLHeadElement.prototype, 'appendChild', (originalFn, args) => {
    const [node] = args
    if (node.tagName === 'SCRIPT' && node.src.includes('/commentpc/bili-comments')) {
      (async () => {
        let code = await (await fetch(node.src)).text()
        code = code.replace(`<div id="pubdate">','</div>`, `<div id="pubdate">','</div><div id="ip-location">','</div>`)
        code = code.replace(`this.pubDate,this.handleLike,`, `this.pubDate,(this.data && this.data.reply_control)?this.data.reply_control.location:null,this.handleLike,`)
        node.type = 'text/javascript'
        node.textContent = code
        node.removeAttribute('src')
        originalFn(node)
        node.dispatchEvent(new Event('load', { bubbles: true }))
      })()

      return
    }
    return originalFn(...args)
  })
})()
