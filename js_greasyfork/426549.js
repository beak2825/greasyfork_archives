// ==UserScript==
// @name         折叠greasyfork过期讨论
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  作者主页只显示30天内的评论
// @author       kakasearch
// @match        https://greasyfork.org/*/users*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426549/%E6%8A%98%E5%8F%A0greasyfork%E8%BF%87%E6%9C%9F%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/426549/%E6%8A%98%E5%8F%A0greasyfork%E8%BF%87%E6%9C%9F%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let items = document.querySelectorAll("#user-discussions-on-scripts-written > section > div")
    let now = new Date()
    let num = 0
    for(let item of items){
    let item_time = item.querySelector('relative-time').date
        if(now - new Date(item_time)>24*3600*1000*30){
        item.style.display="none"
            num += 1
        }
    }

})();