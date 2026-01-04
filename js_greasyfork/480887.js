// ==UserScript==
// @name         blibli取关哔哩哔哩自动取消关注
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  快速取消关注的哔哩哔哩up主
// @author       Leenus
// @match        https://space.bilibili.com/*/relation/follow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480887/blibli%E5%8F%96%E5%85%B3%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480887/blibli%E5%8F%96%E5%85%B3%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    addEventListener("DOMContentLoaded", (event) => {
        const ops = document.querySelector(".follow-main")
        console.log("fuckyou", ops)
    });
    const timer = setInterval(() => {
        const ops = document.querySelectorAll("#page-follows > div > div.follow-main > div.follow-content.section > div.content > ul.relation-list > li > div.content > div > div.be-dropdown.fans-action-btn.fans-action-follow > ul > li:nth-child(2)")
        console.log("fuckyou", ops)
        console.log("fuckyou", ops[0])
        if (ops) {
            window.ops = ops
            clearInterval(timer)
        }

    }, 500)
    let index = 0
    const timer1 = setInterval(() => {
        if (window.ops) {
            if (index < window.ops.length) {
                window.ops[index].click()
                index += 1
            } else {
                clearInterval(timer1)
                location.reload()
            }
        }
    }, 150)
})();