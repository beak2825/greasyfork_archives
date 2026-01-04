// ==UserScript==
// @name         豆瓣图片自动展开
// @version      0.1
// @description  把豆瓣图片自动展开
// @author       ✌
// @license      GPL 3.0
// @match        https://www.douban.com/group/topic/*
// @grant        none
// @namespace https://greasyfork.org/users/1384897
// @downloadURL https://update.greasyfork.org/scripts/517083/%E8%B1%86%E7%93%A3%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/517083/%E8%B1%86%E7%93%A3%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyImages() {
        document.querySelectorAll('div.cmt-img:not(.cmt-img-large)').forEach(div => {
            div.classList.add('cmt-img-large');

            let img = div.querySelector('img');
            if (img) {
                img.setAttribute('raw-style', img.getAttribute('style'));
                img.removeAttribute('style');
            }
        });
    }

    modifyImages();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                modifyImages();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
