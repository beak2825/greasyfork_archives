// ==UserScript==
// @name         douyu ad block
// @namespace    http://tampermonkey.net/
// @version      2025-09-22
// @description  斗鱼广告屏蔽 douyu ad block
// @author       wumail
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524589/douyu%20ad%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/524589/douyu%20ad%20block.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    function deleteElement(tag){
        const fn = (timer) => {
            const target = document.querySelectorAll(tag)

            if (target.length) {
                try{
                    clearInterval(timer)
                    for (let i = 0; i < target.length; i++) {
                        target[i].remove()
                    }
                }catch(error) {
                    console.error("!!")
                }
            }
        }
        let count = 50;
        let timer = setInterval(() => {
            if(count <= 0){
                clearInterval(timer)
            }
            fn(timer)
            count--
            console.log(count)
        }, 200)
        }
    window.addEventListener("load", (event) => {
        const elementsToDelete = [
            ".layout-Main > .layout-Banner",
            "#root > .bc-wrapper",
            ".layout-Main > #js-room-top-banner",
            "#js-room-activity",
            ".Title-ad",
            "#webmActKefuWeidget",
            ".IconCardAdBoundsBox",
            ".RechangeJulyPopups",
            ".aside-top-uspension-video-box  ",
            ".layout-Player-asideTopSuspension",
            ".Game",
            ".Video",
            ".room-top-banner-box",
            ".activeContainer__8Qxzw",
            ".werbungContainer__2sv7h",
            ".layout-Aside"
        ]

        elementsToDelete.forEach(ele => {
            const tag = ele
            deleteElement(tag)
        })
    });
})();