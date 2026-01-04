// ==UserScript==
// @name            豆邮刷新提醒
// @version         1.0.1
// @author          zy
// @namespace
// @supportURL
// @description     打开页面，每隔5秒检测一次是否有新豆邮；如果检测到，标题栏会更新为new。
// @match	        *://www.douban.com/doumail/*
// @match	        *://www.douban.com/*
// @run-at          document-end
// @namespace https://greasyfork.org/users/668516
// @downloadURL https://update.greasyfork.org/scripts/410432/%E8%B1%86%E9%82%AE%E5%88%B7%E6%96%B0%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/410432/%E8%B1%86%E9%82%AE%E5%88%B7%E6%96%B0%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
(function () {
    'use strict'
    let intervalId
    window.onload = function () {
        console.log('onload')
        check()
        intervalId = setInterval(() => {
            check()
        }, 5 * 1000)



    }

    let check = () => {
        console.log('check')
        let node = document.querySelector('#top-nav-doumail-link')
        if (node.innerText.includes('(')) {
            document.title = 'new'
            intervalId && clearInterval(intervalId)
            // alert('douyu')
        }
    }

})()
