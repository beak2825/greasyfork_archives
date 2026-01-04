// ==UserScript==
// @name         WeiyuClass Course Helper
// @namespace    https://yinr.cc/
// @version      2.4.1
// @description  WeiyuClass Helper: 1. Auto play WeiyuClass course and skip auto pause. 2. display token
// @author       Yinr
// @icon         http://www.weiyuclass.cn/favicon.ico
// @match        http*://www.weiyuclass.cn/*
// @require      https://greasyfork.org/scripts/458769-yinr-libs/code/Yinr-libs.js
// @license      MIT
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/499439/WeiyuClass%20Course%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499439/WeiyuClass%20Course%20Helper.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    const VIDEO_SELECTOR = 'video[src]'
    const DEFAULT_PLAYBACK_RATE = 2

    const DONE_CLASS = 'wcch-done'

    const addButton = (text, title, classes = ['evaluateBTnF', 'ivu-btn', 'ivu-btn-primary', 'wcch-btn']) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.classList.add(...classes)
        btn.innerHTML = `<span>${text}</span>`
        btn.title = title
        return btn
    }

    unsafeWindow.WCCH = {}
    const WCCH_OBJ = unsafeWindow.WCCH

    GM_addStyle(`
        #videoBox .bullet-screen {display: none !important;}
        button.wcch-btn {margin-right: 0 !important;}
    `)

    console.log('WeiyuClass Course Autoplay')

    const startup = (vid) => {
        console.log('WeiyuClass Course Autoplay Start Inject')
        vid = vid || document.querySelector(VIDEO_SELECTOR)

        if (vid.classList.contains(DONE_CLASS)) return

        let playbackRate = GM_getValue('DEFAULT_PLAYBACK_RATE', DEFAULT_PLAYBACK_RATE)

        vid.defaultPlaybackRate = playbackRate
        vid.defaultMuted = true
        vid.playbackRate = playbackRate
        vid.muted = true
        vid.autoplay = true
        vid.onended = () => {
            console.log('Play Ended')
            vid.onpause = null
            vid.onended = null
            GM_notification({
                text: 'Play Finished',
                title: 'WCCA Notify',
            })
        }
        vid.onpause = () => {
            console.log('Auto Restart Play')
            vid.play()
        }

        const notice = document.querySelector("#app div.indexPage p.notice")
        if (notice) {
            const fastplayBtn = addButton('Fast Play', `设置倍速播放，并且跳过随机暂停（当前为 ${playbackRate} 倍速）`)
            fastplayBtn.addEventListener('click', () => {
                // const vid = document.querySelector(VIDEO_SELECTOR)
                const newRate = parseFloat(prompt('设置倍速', playbackRate))
                if (!isNaN(newRate) && newRate != playbackRate) {
                    GM_setValue('DEFAULT_PLAYBACK_RATE', newRate)
                    fastplayBtn.title = fastplayBtn.title.replace(`当前为 ${playbackRate} 倍速`, `当前为 ${newRate} 倍速`)
                    playbackRate = newRate
                }
                vid.playbackRate = playbackRate
                vid.muted = true
                vid.play()
            })
            notice.append(fastplayBtn)
            const vidSrc = vid.src
            if (vidSrc.endsWith('.mp4')) {
                const title = document.querySelector('#app div.indexPage > div > div.wrap > div.evaluate > h3').textContent
                const downloadBtn = addButton('Download', `下载 ${title}.mp4`)
                downloadBtn.addEventListener('click', () => {
                    GM_download({
                        url: vidSrc,
                        name: `${title}.mp4`,
                    })
                })
                notice.append(downloadBtn)
            }
        }

        vid.classList.add(DONE_CLASS)
        WCCH_OBJ.vid = vid
        vid.play()
    }

    const mountObserver = () => {
        YinrLibs.launchObserver({
            parentNode: document,
            selector: `video[src]:not(.${DONE_CLASS})`,
            successCallback: (mu) => {
                const hashStart = '#/stu/course/detail?id='
                if (document.location.hash.startsWith(hashStart)) {
                    const v = mu.itemFilter(el => el.nodeName == 'VIDEO')[0]
                    console.log(v)
                    startup(v)
                }
            },
            stopWhenSuccess: false,
        })

        YinrLibs.launchObserver({
            parentNode: document,
            selector: `.app_title:not(.${DONE_CLASS} > .timer)`,
            successCallback: (mu) => {
                const hashStart = '#/stu/work/homework?id='
                if (document.location.hash.startsWith(hashStart)) {
                    const id = parseInt(document.location.hash.match(/id=(\d+)&/)[1])
                    // const appTitle = document.querySelector('div.app_title')
                    const appTitle = mu.itemFilter(el => {
                        console.log('el', el.classList)
                        el.classList.contains('app_title')
                    })[0]
                    console.log(appTitle)
                    appTitle.classList.add(DONE_CLASS)
                    const p = document.querySelector('div.app_title > p')
                    p.append(document.createTextNode(`  -  id: ${id}`))
                }
            },
            stopWhenSuccess: false,
        })
    }
    mountObserver()

    const showToken = (interval = 1000) => {
        const showTokenT = setInterval(() => {
            const token = localStorage.getItem('experttoken', null)
            const cookie = document.cookie
            if (token) {
                const container = document.querySelector('#foot .warp .left p')
                if (cookie) {
                    container.append(document.createElement('br'), document.createTextNode(cookie))
                    WCCH_OBJ.cookie = cookie
                }
                container.append(document.createElement('br'), document.createTextNode(token))
                WCCH_OBJ.token = token
                clearInterval(showTokenT)
            }
        }, interval)
    }
    showToken()

})();