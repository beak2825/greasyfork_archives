// ==UserScript==
// @name         HST Live Helper
// @namespace    https://yinr.cc/
// @version      1.2
// @description  Auto select attending option for HST Live
// @author       Yinr
// @icon         https://static-live1.hst.com////live/upload/cover/2023-08-07/c6220ca8-6451-4824-93e6-7dad1fb2d787-cover.png
// @require      https://greasyfork.org/scripts/458769-yinr-libs/code/Yinr-libs.js
// @match        http*://live.hst.com/*
// @grant        GM_notification
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/499563/HST%20Live%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499563/HST%20Live%20Helper.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    /* Auto Signin */

    // const containerSelector = '.investigate-box'
    const containerSelector = '.main .chat'
    const notifySelector = '.investigate-box .investigate.popup-wrap .title'
    const optionSelector = '.hst_modal input[type=radio][value=在认真听课]'
    const submitSelector = '.hst_modal .hst_footer .hst_submit'

    let LIVE_ROOM_INFO = null;
    (async () => {
        if (LIVE_ROOM_INFO == null) {
            LIVE_ROOM_INFO = (await fetch("https://live.hst.com/LZI5IyLSj/getLiveRoomInfo").then(res => res.json())).data
        }
    })()

    const listen = () => {
        YinrLibs.launchObserver({
            parentNode: document.querySelector(containerSelector),
            selector: notifySelector,
            successCallback: (mu) => {1
                const notify = document.querySelector(notifySelector)
                if (notify) {
                    GM_notification({
                        text: '开始签到',
                        title: '主检医师培训签到提醒',
                    })
                    console.log(notify)
                    notify?.click()
                    YinrLibs.launchObserver({
                        parentNode: document,
                        selector: optionSelector,
                        successCallback(mu) {
                            const option = document.querySelector(optionSelector)
                            console.log(option)
                            option?.click()

                            const submit = document.querySelector(submitSelector)
                            console.log(submit)
                            submit?.click()
                        }
                    })
                }
            },
            stopWhenSuccess: false,
        })
    }

    YinrLibs.launchObserver({
        parentNode: document,
        selector: containerSelector,
        successCallback: (mu) => {1
            console.log('开始监测签到')
            listen()
        },
    })

    /* History Video Info */
    // document.querySelector("#app > div > div.content-wrap > div.content.content > div.content-menu > div > div > div:nth-child(1)")
    const historyVideoInfo = () => {
        const videoInfo = JSON.parse(LIVE_ROOM_INFO.menuInfoList.find(i => i.type === "VIDEO").context).videoList
        const videos = videoInfo.map(item => ({title: item.title, url: item.playUrl}))
        return videos
    }

    /* Bind to Window */
    unsafeWindow.HSTLLiveHelper = {
        getNotify() {
            return document.querySelector(notifySelector)
        },
        getOption() {
            return document.querySelecor(optionSelector)
        },
        getSubmit() {
            return document.querySelecor(submitSelector)
        },
        click() {
            const option = document.querySelector(optionSelector)
            console.log(option)
            option?.click()

            const submit = document.querySelector(submitSelector)
            console.log(submit)
            submit?.click()
        },
        listen,
        LIVE_ROOM_INFO,
        historyVideoInfo,
    }

})();