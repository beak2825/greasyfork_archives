// ==UserScript==
// @name         阻止跳转APP for 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili
// @version      0.3
// @description  自动点开视频页、隐藏打开APP按钮、阻止跳转APP、恢复点击事件
// @author       Mannix
// @namespace    Mannix
// @match        *://m.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491579/%E9%98%BB%E6%AD%A2%E8%B7%B3%E8%BD%ACAPP%20for%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28%E3%82%9C-%E3%82%9C%29%E3%81%A4%E3%83%AD%20%E5%B9%B2%E6%9D%AF~-bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/491579/%E9%98%BB%E6%AD%A2%E8%B7%B3%E8%BD%ACAPP%20for%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28%E3%82%9C-%E3%82%9C%29%E3%81%A4%E3%83%AD%20%E5%B9%B2%E6%9D%AF~-bilibili.meta.js
// ==/UserScript==

(async function () {
  const userScriptID = '阻止跳转APP for 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili by Mannix'
  if (window[userScriptID]) return
  window[userScriptID] = true

  const handlers = [
    [ // 自动点开视频页
      '.btn.light',
      () => document.querySelector('#app').__vue__.$store.commit('video/setTrigglePlay', true)
    ],
    [ // 隐藏打开APP按钮
      '[class*=awaken-btn], [class*=openapp], [class*=callapp], ' +
      '.open-app, .guide-mask, .interact-wrapper, .tab-item.more, .btn-download, .open-app-btn-wrap, .section-preview-header>bili-open-app, ' +
      '.mplayer-buff-app, .mplayer-fullscreen-call-app, .mplayer-ending-panel-button',
      el => el.style.setProperty('display', 'none', 'important')
    ],
    [ // 阻止跳转APP、恢复点击事件
      '.launch-app-btn, .mplayer-display-call-app, .mplayer-ending-panel-video, bili-open-app, .m-search-user-item, a.face, .dynamic-list .card, .video-list>.card-box>div>.v-card-single',
      el => {
        el.addEventListener('click', overrideClick, true)
        for (const [selector, listener] of clickListeners) {
          if (el.matches(selector) || el.querySelector(selector)) {
            el.onclick = listener
            break
          }
        }
      }
    ],
    [ // 全屏播放
      '.btn-widescreen',
      el => el.addEventListener('click', playerFullscreen)
    ]
  ]

  const clickListeners = [
    ['.up .face', function () {
      open(`/space/${window.__INITIAL_STATE__.video.viewInfo.owner.mid}`)
    }],
    ['[data-aid]', function () {
      open(`/video/${av2BV(this.dataset.aid)}`, true)
    }],
    ['.mplayer-ending-panel-video', async function () {
      exitFullscreen()
      const { controller: { endingpanel: { list, index } } } = await window.player.playerPromise
      open(`/video/${list[index - 1].bvid}`, true)
    }],
    ['.icon-spread', function () {
      if (this.style.transform) {
        this.style.transition = 'transform 0.2s'
        this.style.transform = ''
        this.parentNode.nextElementSibling.remove()
      } else {
        const { desc } = window.__INITIAL_STATE__.video.viewInfo
        if (!desc) {
          this.style.display = 'none'
          return
        }
        this.style.transition = 'transform 0.2s'
        this.style.transform = 'rotate(180deg)'
        const div = document.createElement('div')
        div.style.cssText = 'white-space: pre-line; font-size: 3.46667vmin; line-height: 4.8vmin; color: #555;'
        div.textContent = desc
        this.parentNode.after(div)
      }
    }],
    ['.ep-profile', function () {
      this.querySelector('.ep-profile').classList.toggle('expand')
    }],
    ['.ep-info-wrapper, .season-list-wrapper *, .recom-item-wrapper', function () {
      open(this.getAttribute('universallink').match(/(?<!\/)\/[^/][^?]+/)[0], true)
    }],
    ['.dynamic-list .card', function () {
      open(`/opus/${this.__vue__.dynId}`)
    }],
    ['.opus-module-author__avatar, .opus-module-author__name', function () {
      open(`/space/${document.querySelector('.opus-module-author').__vue__.data.mid}`)
    }],
    ['.dyn-header', function () {
      open(`/space/${document.querySelector('[data-mid]').dataset.mid}`)
    }]
  ]

  const av2BV = (function () {
    // https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/bvid_desc.html

    const XOR_CODE = 23442827791579n
    const MAX_AID = 1n << 51n
    const BASE = 58n

    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'

    return function (aid) {
      const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0']
      let bvIndex = bytes.length - 1
      let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE
      while (tmp > 0) {
        bytes[bvIndex] = data[tmp % BASE]
        tmp = tmp / BASE
        bvIndex -= 1
      }
      ;[bytes[3], bytes[9]] = [bytes[9], bytes[3]]
      ;[bytes[4], bytes[7]] = [bytes[7], bytes[4]]
      return bytes.join('')
    }
  })()

  function open (url, useRouter = false) {
    if (useRouter) {
      document.querySelector('#app').__vue__.$router.push(url)
    } else {
      window.open(url, '_self')
    }
  }

  function overrideClick (event) {
    event.stopImmediatePropagation()
    this.onclick?.(event)
  }

  function playerFullscreen () {
    const player = document.querySelector('.player-container')
    if (player.classList.contains('wide')) {
      for (const key of ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen']) {
        if (key in player) {
          player[key]()
          break
        }
      }
    }
  }

  function exitFullscreen () {
    for (const [el, fn] of [['fullscreenElement', 'exitFullscreen'], ['webkitFullscreenElement', 'webkitExitFullscreen'], ['mozFullScreenElement', 'mozCancelFullScreen']]) {
      if (el in document) {
        if (document[el]) document[fn]()
        break
      }
    }
  }

  function handleDescendant (node) {
    for (const [selector, handler] of handlers) {
      node.querySelectorAll(selector).forEach(handler)
    }
  }

  function handleSelf (node) {
    for (const [selector, handler] of handlers) {
      if (node.matches(selector)) handler(node)
    }
  }

  const concat = window.String.prototype.concat
  window.String.prototype.concat = function () {
    // bilibili:// 替换为 javascript://（这里的 // 是注释）以阻止跳转APP
    const result = concat.apply(this.replace(/^bilibili:\/\//, 'javascript://'), arguments)
    return result
  }

  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
  }

  handleDescendant(document)

  new window.MutationObserver(mutations => mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof window.HTMLElement)) return
      handleSelf(node)
      handleDescendant(node)
    })
  })).observe(document, { childList: true, subtree: true })

  const css = document.createElement('style')
  css.innerHTML = '.ep-list-pre-header i::after { display: none !important; }'
  document.body.append(css)
})()
