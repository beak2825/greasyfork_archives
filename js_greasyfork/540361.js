// ==UserScript==
// @name         在视频信息区显示视频 av 号
// @namespace    im.outv.userscripts.bilibili.avid
// @version      0.4.0
// @description  Display avid on video information header.
// @author       Outvi V
// @match        https://www.bilibili.com/video/*
// @match        https://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-body
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540361/%E5%9C%A8%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E5%8C%BA%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%20av%20%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540361/%E5%9C%A8%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E5%8C%BA%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%20av%20%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let contentAv, contentBv, contentBlock;

    function createClickToSelectElement(text = "") {
        const span = document.createElement("span")
        span.addEventListener("click", () => {
            const sel = getSelection()
            sel.selectAllChildren(span)
        })
        span.innerText = text
        return span
    }

    function setupPosition(block) {
        const ref = document.querySelector('.video-info-meta')
        if (!ref) return
        const {left, top} = ref.getBoundingClientRect()
        block.style.top = `${Math.round(top) + ref.offsetHeight}px`
        block.style.left = `${Math.round(left)}px`
        block.style["z-index"] = 100
        block.style.display = "flex"
        block.style.gap = "12px"
        console.log(`Relocated to ${left}, ${top}`)
    }

    function createContentBlock() {
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.color = "var(--text3)"
        setupPosition(div)
        const e1 = createClickToSelectElement()
        const e2 = createClickToSelectElement()
        div.appendChild(e1)
        div.appendChild(e2)
        document.body.appendChild(div)
        return [e1, e2, div]
    }

    function updateAvidDisplay(aid, bvid) {
        if (!aid) return
        if (!contentBlock) {
            [contentAv, contentBv, contentBlock] = createContentBlock()
        }

        setupPosition(contentBlock)
        contentAv.innerText = `av${aid}`
        contentBv.innerText = String(bvid)
        console.log("Updated", aid, bvid, contentBlock)
    }

    function onStateUpdate(value) {
        console.log("State updated", value)
        updateAvidDisplay(window.__INITIAL_STATE__.aid, window.__INITIAL_STATE__.bvid)

    }

    if (typeof window.__INITIAL_STATE__ === "undefined") {
      window.__INITIAL_STATE__ = {};
    }
    window.__INITIAL_STATE__ = new Proxy(window.__INITIAL_STATE__, {
        set(target, prop, value) {
            target[prop] = value;
            onStateUpdate(value);
            return true;
        }
    });
})();