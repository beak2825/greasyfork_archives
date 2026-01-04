// ==UserScript==
// @name         Remove Down-thumb Count for CC98
// @version      0.1.1
// @description  隐藏CC98每个帖子的获踩数量
// @author       anonymousII, dont try to guess who i am :)
// @license      AGPL-3.0
// @match        https://www.cc98.org/*
// @grant        none
// @run-at       DOMContentLoaded
// @namespace https://greasyfork.org/users/1268364
// @downloadURL https://update.greasyfork.org/scripts/488613/Remove%20Down-thumb%20Count%20for%20CC98.user.js
// @updateURL https://update.greasyfork.org/scripts/488613/Remove%20Down-thumb%20Count%20for%20CC98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var divs = document.querySelectorAll('div[id^="dislike"]');
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];
            if (/^dislike\d+$/.test(div.id)) {
                var children = div.childNodes;
                for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    if (child.tagName === 'SPAN' && child.className === 'commentProp') {
                        child.textContent = '0';
                        break;
                    }
                }
            }
        }
    }, 500);
})();