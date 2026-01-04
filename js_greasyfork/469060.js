// ==UserScript==
// @name         LINE全自動投票
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  LINE全自動投票11
// @author       forthdog
// @match        https://event.line.me/poll/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=line.me
// @grant        none
// @license      mine
// @downloadURL https://update.greasyfork.org/scripts/469060/LINE%E5%85%A8%E8%87%AA%E5%8B%95%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469060/LINE%E5%85%A8%E8%87%AA%E5%8B%95%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==
//票數 #__layout > div > div.layout.layout--center > div.tips > div.tips__message > p
//投票 #__layout > div > div.layout.layout--center > section > div.main > div.works > div:nth-child(2) > div.card__info > div.card__data.card__owner > button
//確認 #__layout > div > div:nth-child(3) > div.vote-modal.md-modal.md-modal--pop > div > div > div > button
(function() {
    'use strict';
    var watch;

    function p1() {
        if (document.querySelector('div.layout.layout--center > div.tips') == null ||
            document.querySelector('div.layout.layout--center > div.tips > div.tips__message > p > em') != null) {
            setTimeout(p2, 200);
        }
    }

    function p2() {
        let b = document.querySelectorAll('div.card__data.card__owner > button');

        if (b) {
            while (true) {
                let idx = Math.floor(Math.random()*b.length);
                let item = b[idx];
                if (item.innerText == '投票') {
                    watch = item;
                    console.log('vote: '+idx);
                    item.click();
                    setTimeout(p3, 200);
                    return;
                }
            }
        }
        setTimeout(p2, 1000);
    }

    function p3() {
        if (watch.innerText == '投票') {
            let a2=document.querySelector('div.vote-modal.md-modal > div > div > div > button');
            if (a2) {
                a2.click();
            }
            setTimeout(p3, 1000);
        } else {
            setTimeout(p1, 200);
        }
    }

    p1();
})();