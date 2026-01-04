// ==UserScript==
// @name         摸鱼神器/屏蔽图片/屏蔽视频/上班划水/图片移除/视频移除
// @version      0.4
// @description  上班摸鱼，怕老板看到，可以试试把图片和视频屏蔽，这样就不会被发现了哦
// @author       FlyArtist
// @match        *
// @grant        none
// @include      *
// @license MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/438345/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E5%B1%8F%E8%94%BD%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E4%B8%8A%E7%8F%AD%E5%88%92%E6%B0%B4%E5%9B%BE%E7%89%87%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/438345/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E5%B1%8F%E8%94%BD%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E4%B8%8A%E7%8F%AD%E5%88%92%E6%B0%B4%E5%9B%BE%E7%89%87%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mediaCheck() {
        var tags = document.querySelectorAll('*');
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;

        for (var i = 0; i < tags.length; i++) {
            let prop = window.getComputedStyle(tags[i], null).getPropertyValue('background-image');
            if (srcChecker.exec(prop)) {
                tags[i].style.background = '';
            }
            if (tags[i].nodeName == 'IMG' || tags[i].nodeName == 'VIDEO') {
                tags[i].setAttribute('style', 'display:none')
                if (tags[i].nodeName == 'VIDEO') {
                    tags[i].parentNode.setAttribute('style', 'display:none')
                }
            }
        }
    }
    
    mediaCheck();
    setInterval(mediaCheck, 300)
})();