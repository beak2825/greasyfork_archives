// ==UserScript==
// @name         v2ex filter heart comment
// @namespace    
// @version      0.1.1
// @description  仅显示有红心的留言
// @author       zrf
// @match        *://*.v2ex.com/t/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477595/v2ex%20filter%20heart%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/477595/v2ex%20filter%20heart%20comment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isFilterHeartComment = false;

    var el = document.getElementsByClassName('topic_buttons')[0]

    var elChild = document.createElement('a');

    elChild.setAttribute('href', 'javascript:void(0);')
    elChild.setAttribute('class', 'tb')
    elChild.setAttribute('id', 'clickFilterBtn')

    elChild.innerHTML = isFilterHeartComment ? '显示全部留言' : '仅显示红心留言';

    el.appendChild(elChild);

    document.getElementById('clickFilterBtn').onclick = clickFilterBtn;

    function clickFilterBtn() {

        isFilterHeartComment = !isFilterHeartComment
        if (isFilterHeartComment) {
            elChild.innerHTML = '显示全部留言'
        } else {
            elChild.innerHTML = '仅显示红心留言'
        }


        // 获取全部元素
        var allComment = document.querySelectorAll('div[id^="r_"]')

        if (isFilterHeartComment) {
            allComment.forEach(function(value, index) {
                if (!value.querySelector('.small.fade')) {
                    value.setAttribute('style', 'display: none')
                }
            });
        } else {
            allComment.forEach(function(value, index) {
                value.setAttribute('style', 'display: block')
            });
        }
    }
})();