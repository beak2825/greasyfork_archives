// ==UserScript==
// @name         Unicode 自动翻译脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  实时翻译网页上的 Unicode 编码为中文
// @author       barnett2010
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475475/Unicode%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475475/Unicode%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译单个节点的文本
    function translateNode(node) {
        if (node.nodeType === 3) {
            var text = node.nodeValue;
            var decodedText = text.replace(/\\u([\dA-F]{4})/gi, function(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            });
            if (decodedText !== text) {
                node.nodeValue = decodedText;
            }
        }
    }

    // 遍历页面上的节点，并翻译文本
    function translateUnicode() {
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];
                translateNode(node);
            }
        }
    }

    // 监听页面变化，实时翻译
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];
                if (node.nodeType === 3) {
                    translateNode(node);
                } else if (node.getElementsByTagName) {
                    var elements = node.getElementsByTagName('*');
                    for (var j = 0; j < elements.length; j++) {
                        var subNode = elements[j];
                        translateNode(subNode);
                    }
                }
            }
        });
    });

    // 开始监听页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 在页面加载完成后立即翻译
    window.addEventListener('load', function() {
        translateUnicode();
    });

})();