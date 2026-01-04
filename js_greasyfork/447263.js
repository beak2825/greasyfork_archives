// ==UserScript==
// @name         夏日重现-铃煲
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  好像又回到那一刻。
// @author       某个心碎的dd
// @match        https://t.bilibili.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447263/%E5%A4%8F%E6%97%A5%E9%87%8D%E7%8E%B0-%E9%93%83%E7%85%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/447263/%E5%A4%8F%E6%97%A5%E9%87%8D%E7%8E%B0-%E9%93%83%E7%85%B2.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    await sleep(5000).then(() => {
        // create new item
        let liveBody = document.getElementsByClassName("bili-dyn-live-users__body")[0]
        if (liveBody == null){
            console.log("No live-body found")
            return
        }
        const liveNewItemRawString = "<div class=\"bili-dyn-live-users__item\"><div class=\"bili-dyn-live-users__item__left\"><div class=\"bili-dyn-live-users__item__face-container\"><div class=\"bili-dyn-live-users__item__face\"><div class=\"bili-awesome-img\"></div></div></div></div> <div class=\"bili-dyn-live-users__item__right\"><div class=\"bili-dyn-live-users__item__uname bili-ellipsis\">星奈铃-官方WACTOR</div> <div class=\"bili-dyn-live-users__item__title bili-ellipsis\">可爱黑猫星奈铃的初放送！</div></div></div>"
        let liveNewItemParent = document.createElement("div")
        liveNewItemParent.innerHTML = liveNewItemRawString
        // modify image and append
        let liveNewItem = liveNewItemParent.firstChild
        let liveNewItemAvatar = liveNewItem.firstElementChild.firstElementChild.firstElementChild.firstElementChild
        liveNewItemAvatar.setAttribute("style", "background-image: url(\"//i0.hdslb.com/bfs/face/95f1507a08aa18251a75c7b4ec7a8f5b8f3488b5.jpg@96w_96h_1c.webp\");")
        liveBody.appendChild(liveNewItem)
        // update livers' number
        let liveTitle = document.getElementsByClassName("bili-dyn-live-users__title")[0]
        if (liveTitle == null) {
            console.log("No title found")
            return
        }
        let liveTitleOldNode = liveTitle.lastChild.firstChild;
        let livingNum = liveTitleOldNode.nodeValue.slice(1, -1)
        livingNum = Number(livingNum) + 1
        let liveTitleNewNode = document.createTextNode("(" + String(livingNum)+ ")")
        liveTitle.lastChild.replaceChild(liveTitleNewNode, liveTitleOldNode)
        // register event
        liveNewItem.addEventListener("click", function () {
            window.open("https://www.bilibili.com/video/BV1z64y1d7Mp")
        })
    })
})();