// ==UserScript==
// @name         移动端扫地机
// @namespace    https://greasyfork.org/
// @version      0.0.2-BETA
// @description  F**k!クッソ
// @author       fpschen
// @homepage     https://greasyfork.org/zh-CN/users/256892-fork
// @match        *://*.zhihu.com/*
// @match        *://m.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document_idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515462/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%89%AB%E5%9C%B0%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515462/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%89%AB%E5%9C%B0%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoCatch(caller, catcher, quiet=false) {
        return function() {
            try {
                return caller.apply(this, arguments)
            } catch(e) {
                catcher && catcher(e)
                if (!quiet) throw e
            }
        }
    }

    function reduceCall(...funcs) {
        return function() {
            funcs.reduce((p, c) => autoCatch(c, null, true)(), null)
        }
    }

    function listenHistory(name, listener) {
        const origin = history[name]
        history[name] = function() {
            const res = origin.apply(this, arguments)
            autoCatch(listener, null, true)(arguments)
            return res
        }
    }

    function findEle(selector, multi = false, container = document) {
        let finder = container.querySelector
        if (multi) {
            finder = container.querySelectorAll
        }
        return finder.call(container, selector)
    }

    async function waitEle(selector, { multi, timeout, quiet, container } = {}) {
        multi = multi ?? false
        timeout = timeout ?? 30000
        container = container ?? document
        const start = Date.now()
        return new Promise((resolve, reject) => {
            let checker = () => {
                const el = findEle(selector, multi, container)
                if (el == undefined || (multi && el.length == 0)) {
                    if (Date.now() - start > timeout) {
                        throw new Error(`[selector](${selector}): timeout!`)
                    }
                    setTimeout(checker, 100)
                    return
                }
                resolve(el)
            }
            checker = autoCatch(checker, reject, quiet)
            checker()
        })
    }

    function createUnmuteButton() {
        if (document.getElementById('unmuteButton')) return

        const video = document.querySelector('video')
        if (!video.muted) {
            return
        }

        GM_addStyle(`
/*
* 声音按钮 *
*/

.unmute {
  position: absolute;
  top: 0;
  padding: 12px;
  background: none;
  border: 0;
  font-size: 127%;
  text-align: inherit;
}
.unmute-inner {
  position: relative;
}
.unmute-icon {
  height: 48px;
  display: inline-block;
  vertical-align: middle;
  padding-left: 2px;
  position: relative;
  z-index: 10;
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  border-bottom: 1px solid #f1f1f1;
}
.unmute svg {
  filter: drop-shadow(0 0 2px rgba(0,0,0,.5));
}
.unmute-text {
  position: relative;
  z-index: 10;
  padding-right: 10px;
  vertical-align: middle;
  display: inline-block;
  transition: opacity .25s cubic-bezier(.4,0,1,1);
}
.animated .unmute-text {
  opacity: 0;
}
.unmute-box {
  width: 100%;
  background-color: rgb(255, 255, 255);
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  border-bottom: 1px solid #f1f1f1;
  transition: width .5s cubic-bezier(.4,0,1,1);
}
.animated .unmute-box {
  width: 0;
}
        `)

        const button = document.createElement('button')
        button.classList.add('unmute')
        button.id = 'unmuteButton'
        button.innerHTML = `
<div class="unmute-inner">
    <div class="unmute-icon"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <use class="svg-shadow" xlink:href="#ytp-id-1"></use>
            <path class="ytp-svg-fill"
                d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z"
                id="id-1"></path>
        </svg></div>
    <div class="unmute-text">点按取消静音</div>
    <div class="unmute-box"></div>
</div>
          `
        button.addEventListener('click', function () {
            video.muted = false
            button.remove()
        })

        const videoWrapper = document.querySelector('.mplayer-video-wrap')
        videoWrapper.insertAdjacentElement('afterend', button)
        setTimeout(() => {
            button.classList.add('animated')
        }, 4500)
    }

    // 清除APP引导弹窗
    async function clearModal() {
        GM_addStyle(`
        .OpenInAppButton, .home-float-openapp, .m-video2-awaken-btn {
          display: none!important;
        }

        `)

        const selectors = ['.MobileModal-wrapper button.Button--secondary', '.Modal-wrapper button.Modal-closeButton']

        const el = await Promise.any(selectors.map(selector => waitEle(selector, { quiet: true })))

        el?.click()
    }

    // 自动【展开阅读】
    function autoExpand() {
        GM_addStyle(`
        .Post-RichTextContainer div:has(.ContentItem-expandButton):not(:has(div)) {
          display: none!important;
        }
        button.ContentItem-expandButton {
          display: none!important;
        }
        .RichContent-inner--collapsed {
          max-height: unset!important;
          mask-image: unset!important;
          --webkit-mask-image: unset!important;
        }
        `)
    }

    // 清除B站推荐视频打开APP
    async function directJump() {
        const cards = await waitEle('.v-card-toapp', { multi: true, quiet: true })

        function assignUrl(card) {
            const vm = card?.__vue__
            const info = vm?.info
            vm?.$set(vm?.info, 'url', `https://${location.host}/video/${info?.bvid}`)
        }

        cards?.forEach(assignUrl)
    }

    // 自动播放
    async function autoPlay() {

        const selectors = ['.natural-main-video', '.m-video-player']

        const video = await Promise.any(selectors.map(selector => waitEle(selector, { quiet: true })))
        const vm = video?.__vue__
        vm?.$set(vm, 'open', true)
        vm?.$set(vm, 'bsource', 'search_google')
        vm?.$emit('trigglePlay')

        player.on('video_media_play', createUnmuteButton)

        await bindPlaybackspeed()

    }

    // 自动关闭弹框
    async function autoCloseDialog() {
        const closeBtn = await waitEle('.openapp-dialog .dialog-close', { quiet: true })
        closeBtn?.click()
    }

    async function bindPlaybackspeed() {
        const btn = await waitEle('.mplayer-control-btn-speed', { quiet: true, timeout: 500 })
        if (btn.__bound) {
            return
        }

        btn.__bound = true

        const speedList = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]

        const speedContainer = document.createElement('div')
        const containerList = speedContainer.classList
        containerList.add('speed-control-container', 'display-none')
        btn.appendChild(speedContainer)

        btn.addEventListener('click', () => {
            if (containerList.contains('display-none')) {
                containerList.remove('display-none')
            } else {
                containerList.add('display-none')
            }
        })

        function speedClick({ target }) {
            const video = document.querySelector('video')
            const speed = Number(target.getAttribute('data-speed'))
            if (video && speed > 0) {
                video.playbackRate = speed
            }
        }

        function addSpeed(speed, container) {
            const speedSpan = document.createElement('span')
            speedSpan.innerText = `${speed} X`
            speedSpan.setAttribute('data-speed', speed)
            speedSpan.addEventListener('click', speedClick)
            container.insertAdjacentElement('afterbegin', speedSpan)
        }

        speedList.map(speed => addSpeed(speed, speedContainer))

        GM_addStyle(`
  .speed-control-container {
    display: flex;
    position: absolute;
    font-size: var(--show-size);
    color: white;
    flex-direction: column;
    transform: translateY(-75%);
    max-height: var(--show-height);
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.5);
    padding: .2rem;
    padding-right: .3rem;
    border-radius: .4rem;
    white-space: pre;
    text-align: right;

    --show-count: 8;
    --total-count: ${speedList.length};
    --show-size: .8rem;
    --show-height: calc(var(--show-count) * var(--show-size));
  }
  .display-none {
    display: none;
  }
  `)

    }

    async function observeCardBox(listen = true) {


        if (listen) {
            const changeListener = reduceCall(observeCardBox.bind(null, !listen), autoPlay)

            listenHistory('pushState', changeListener)
            listenHistory('replaceState', changeListener)
        }

        const videoList = await waitEle('.video-list', { quiet: true })
        const vm = videoList?.__vue__
        vm?.$watch('list', () => {
            directJump()
        })
        const state = vm?.$store?.state

        const common = state?.common
        if (common) {
            // common.noCallApp = true
        }

        const search = state?.search
        if (search) {
            search.openAppDialog = false
        }
        const video = state?.video
        if (video) {
            video.isClient = true
        }

        if (PlayerAgent) {
            PlayerAgent.openApp = function() {
                console.log('call open app')
            }
        }
    }

    autoCatch(clearModal, null, true)()
    autoExpand()
    directJump()
    autoPlay()
    autoCloseDialog()
    observeCardBox()
})();