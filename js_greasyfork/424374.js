// ==UserScript==
// @name         摸鱼神器/上班偷懒/划水/看帖不看图/刷知乎屏蔽/图片移除/图片删除
// @namespace    
// @version      0.4
// @description  科学摸鱼必备！上班的时候无聊想摸鱼刷帖子刷知乎，只想看文字不想页面显示图片的时候怎么办，就是它了~
// @author       舞动乾玲
// @match        *
// @icon
// @grant        none
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/424374/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E4%B8%8A%E7%8F%AD%E5%81%B7%E6%87%92%E5%88%92%E6%B0%B4%E7%9C%8B%E5%B8%96%E4%B8%8D%E7%9C%8B%E5%9B%BE%E5%88%B7%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%9B%BE%E7%89%87%E7%A7%BB%E9%99%A4%E5%9B%BE%E7%89%87%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/424374/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E4%B8%8A%E7%8F%AD%E5%81%B7%E6%87%92%E5%88%92%E6%B0%B4%E7%9C%8B%E5%B8%96%E4%B8%8D%E7%9C%8B%E5%9B%BE%E5%88%B7%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%9B%BE%E7%89%87%E7%A7%BB%E9%99%A4%E5%9B%BE%E7%89%87%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function clear_img() {
            const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
            var doc = document.querySelectorAll('*');
            for (var i = 0; i < doc.length; i++) {
                if (doc[i].nodeName === 'IMG' || doc[i].nodeName === 'VIDEO' || doc[i].nodeName === 'SVG' || doc[i].nodeName === 'svg') {
                    doc[i].setAttribute('style', 'display:none')
                }
                let prop = window.getComputedStyle(doc[i], null)
                    .getPropertyValue('background-image');
                let match = srcChecker.exec(prop);
                if (match) {
                    doc[i].style.background = '';
                }
            }
        }
    
    clear_img();
    setInterval(clear_img,300)
})();