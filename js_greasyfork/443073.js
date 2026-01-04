// ==UserScript==
// @name         mip_baidu_killer.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  IP地址查询-站长查询 百度网盟广告自动删除
// @author       wuuconix
// @match        http://mip.chinaz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443073/mip_baidu_killerjs.user.js
// @updateURL https://update.greasyfork.org/scripts/443073/mip_baidu_killerjs.meta.js
// ==/UserScript==

(function() {
    'use strict'

    let number = 0
    const observer = new MutationObserver(() => {
        let baiduFrame = document.querySelector("iframe")
        if (baiduFrame) { //发现百度网盟推广广告
            baiduFrame.parentElement.remove()
            console.log("百度网盟广告已经自动关闭")
            number++
            if (number == 2) { //广告会出现两次，两次全部关闭后即可退出监视
                observer.disconnect()
            }
        }
    });

    observer.observe(document.body, { childList: true, });
})();