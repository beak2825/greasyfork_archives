// ==UserScript==
// @name         屏蔽bilibili动态的话题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽bilibili动态的话题,让你不被无关的信息干扰
// @author       Chatinfer
// @license      MIT
// @match        https://t.bilibili.com
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @icon64       https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452671/%E5%B1%8F%E8%94%BDbilibili%E5%8A%A8%E6%80%81%E7%9A%84%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/452671/%E5%B1%8F%E8%94%BDbilibili%E5%8A%A8%E6%80%81%E7%9A%84%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    //document.body.insertAdjacentHTML('afterbegin', "<div'>Hello World !</div>")

    //console.warn("hello world!")

    var timer = null
    var times = 0

    function remove_topics() {
        times = times + 1

        console.warn("remove_topics")

        let k = document.body.getElementsByClassName('relevant-topic')

        if (k.length == 0) {

            if (timer != null && times >= 100) {
                clearInterval(timer)
            }
            return
        }

        for(var i = 0; i < k.length; i++) {

            let el = k[i]

            //console.warn("removing topic")
            //console.warn(el)

            el.remove()
        }

        //console.warn(k.length)
    }

    timer = setInterval(remove_topics, 20)

})();