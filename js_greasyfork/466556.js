// ==UserScript==
// @name         解除B站引导app观看限制
// @namespace    http://tampermonkey.net/bilibili
// @version      0.1
// @description  解除B站手机侧页面引导app观看限制
// @author       I'am a robot
// @match        *://m.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466556/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%BC%95%E5%AF%BCapp%E8%A7%82%E7%9C%8B%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/466556/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%BC%95%E5%AF%BCapp%E8%A7%82%E7%9C%8B%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function fetchViewUrl(a, aid) {
        a.onclick = function(e) {
            var url = 'https://api.bilibili.com/x/player/v2?cid=1129243948&aid=' + aid + '&ep_id=0&season_id=0';
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function(e) {
                if (xhr.status == 200) {
                    location.href = '/video/' + xhr.response.data.bvid;
                }
            }
            xhr.send();
        }
    }
    var cards = document.getElementsByClassName('launch-app-btn v-card-toapp');
    if (cards != null) {
        for (var i = 0, N = cards.length; i < N; ++i) {
            var card = cards[i];
            var aid = card.getAttribute('data-aid');
            if (aid != null && aid.length > 0 && card.childNodes.length > 0 && card.childNodes[0].tagName === 'A') {
                fetchViewUrl(card.childNodes[0], aid);
            }
        }
    }
})();