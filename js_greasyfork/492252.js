// ==UserScript==
// @name         i贴吧图片链接替换为https
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  修复i贴吧图片不显示的问题
// @match        https://tieba.baidu.com/i/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492252/i%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E4%B8%BAhttps.user.js
// @updateURL https://update.greasyfork.org/scripts/492252/i%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E4%B8%BAhttps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processImg(img) {
        if (img.src.startsWith("http://tiebapic.baidu.com")) {
            img.src = img.src.replace("http://", "https://");
        }
    }

    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        processImg(images[i]);
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.tagName === 'IMG') {
                        processImg(node);
                    }
                    else if (node.getElementsByTagName) {
                        var imgs = node.getElementsByTagName('img');
                        for (var j = 0; j < imgs.length; j++) {
                            processImg(imgs[j]);
                        }
                    }
                }
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();
