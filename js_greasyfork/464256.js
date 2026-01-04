// ==UserScript==
// @name         BiliBili 一键取消关注所有UP主
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  如果删不干净，请重新尝试
// @author       You
// @match        https://space.bilibili.com/*/fans/follow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464256/BiliBili%20%E4%B8%80%E9%94%AE%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E6%89%80%E6%9C%89UP%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/464256/BiliBili%20%E4%B8%80%E9%94%AE%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E6%89%80%E6%9C%89UP%E4%B8%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newEle = document.createElement("div")
    newEle.innerHTML = "取消所有关注"
    newEle.style.cssText = `
    backgroundColor: grey;
    position: fixed;
    bottom: 40px;
    left: 50vw;
    transform: translateX(-50%);
    border: solid 1px black;
    border-radius: 20px;
    padding: 10px;
    cursor: pointer;
    backgroundColor: white;
    `
    newEle.onclick = function() {
        const followedList = document.querySelectorAll(".fans-action")
        followedList.forEach(element => {
            try {
                const unfolBtn = element.children[0].children[2].children[1]
                console.log(unfolBtn)
                unfolBtn.click()
            } catch(e) {
                console.log(e)
            }
        })
    }

    document.body.appendChild(newEle)

    // Your code here...
})();