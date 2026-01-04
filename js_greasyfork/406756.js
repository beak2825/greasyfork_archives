// ==UserScript==
// @name        Ciro Santilli
// @namespace   Violentmonkey Scripts
// @match       https://stackoverflow.com/*
// @grant       none
// @version     1.0
// @author      @jsnewbie
// @description 7/9/2020, 5:10:00 PM
// @downloadURL https://update.greasyfork.org/scripts/406756/Ciro%20Santilli.user.js
// @updateURL https://update.greasyfork.org/scripts/406756/Ciro%20Santilli.meta.js
// ==/UserScript==

(function() {
    var blocks = document.querySelectorAll('.user-details')
    blocks.forEach(function(ele) {

        if (ele.firstElementChild.innerHTML == 'Ciro Santilli 郝海东冠状病六四事件法轮功') {
            ele.firstElementChild.innerHTML = 'Ciro Santilli'
            ele.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.src='https://www.gravatar.com/avatar/8b89ce52e5ba9225f3b2a91c1f278d92?s=328&d=identicon&r=PG&f=1'
        }
    })
})()