// ==UserScript==
// @name         zerojudge 隱藏標籤
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      0.1
// @description  不顯示題目標籤，按下「顯示標籤」後再顯示
// @author       zica
// @match        https://zerojudge.tw/*
// @license      GPL-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457677/zerojudge%20%E9%9A%B1%E8%97%8F%E6%A8%99%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457677/zerojudge%20%E9%9A%B1%E8%97%8F%E6%A8%99%E7%B1%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tags = document.getElementsByClassName('tag');
    for(const e of tags){
        e.hidden = true;
        const show = document.createElement('button');
        show.innerText = '顯示標籤';
        show.onclick = function(){
            this.nextSibling.hidden = false;
            this.remove();
        };
        e.before(show);
    }
})();
