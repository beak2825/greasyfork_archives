// ==UserScript==
// @name         CodeForces-AC前隐藏标签
// @namespace    http://tampermonkey.net/
// @version      2024-05-08
// @description  hide tags before ac
// @author       Qianfan
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494587/CodeForces-AC%E5%89%8D%E9%9A%90%E8%97%8F%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/494587/CodeForces-AC%E5%89%8D%E9%9A%90%E8%97%8F%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!document.querySelector("span.verdict-accepted")) {
        const CHONGTIAN_tagList = document.querySelectorAll('div[style^=margin].roundbox.borderTopRound.borderBottomRound')
        CHONGTIAN_tagList.forEach(elem => {
            if (!elem.querySelector('span[title=Difficulty]')) {
                elem.style.display = 'none'
            }
        })
        //添加标签切换按钮
        const CHONGTIAN_titles = document.querySelectorAll('div.caption.titled')
        let CHONGTIAN_tagsTitle
        for (const elem of CHONGTIAN_titles) {
            if (elem.innerText.includes('tags')) {
                CHONGTIAN_tagsTitle = elem
                break
            }
        }
        if (!CHONGTIAN_tagsTitle) return
        const CHONGTIAN_switch = document.createElement('input')
        CHONGTIAN_switch.type = 'checkbox'
        CHONGTIAN_switch.className = 'CHONGTIAN_switch'
        CHONGTIAN_switch.addEventListener('change', function () {
            CHONGTIAN_tagList.forEach(elem => {
                if (!elem.querySelector('span[title=Difficulty]')) { elem.style.display = this.checked ? 'block' : 'none' }
            })
        })
        CHONGTIAN_tagsTitle.appendChild(CHONGTIAN_switch)
    }
    // Your code here...
})();