// ==UserScript==
// @name         Magnet Link Collector
// @namespace    mlc
// @version      1.1.0
// @description  Collects magnet links starting with "magnet:?xt=urn:btih:" and provides copy to clipboard.
// @author       wzzzzz
// @license MIT

// javbus有无码jav资源、论坛
// @include      *://*javbus.com/*
// @include      *://www.*bus*/*
// @include      *://www.*javsee*/*
// @include      *://www.*seejav*/*

// onejav有FC2资源、排行榜
// @include      *://*onejav.com/*

// avsox有无码jav资源，含FC2  tellme.pw/avsox
// @include      *://*avsox.*/*

// jav321有素人资源、排行榜
// @include      *://*jav321.com/video/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/469291/Magnet%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/469291/Magnet%20Link%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 收集磁力链接
    function collectMagnetLinks() {
        function traverseDOM(element) {
            var magnetLinks = [];

            if (element.nodeType === Node.TEXT_NODE) {
                // 如果当前节点是文本节点，则在文本中查找磁力链接
                var pattern = /(magnet:\?xt=urn:btih:)[0-9a-fA-F]{40}/g;
                var pattern_lite = /[0-9a-fA-F]{40}[\s]?/g;
                var matches = element.nodeValue.match(pattern);
                if (matches) {
                    magnetLinks = magnetLinks.concat(matches);
                } else {
                    var lites = element.nodeValue.match(pattern_lite);
                    if (lites) {
                        lites = lites.map(str => `magnet:?xt=urn:btih:${str.replace(/^\s*|\s*$/g, '')}`);
                        magnetLinks = magnetLinks.concat(lites);
                    }
                }
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                // 如果当前节点是元素节点，则递归遍历其子元素
                for (var i = 0; i < element.childNodes.length; i++) {
                    magnetLinks = magnetLinks.concat(traverseDOM(element.childNodes[i]));
                }
            }

            return magnetLinks;
        }

        // 磁力链接去重
        function unique(arr) {
            let result = [];
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                let str = arr[i].toLowerCase();
                console.log(str);
                if (!obj[str]) {
                    result.push(arr[i]);
                    obj[str] = true;
                }
            }
            return result;
        }

        // 获取 <body> 元素
        var bodyElement = document.getElementsByTagName('body')[0];

        // 遍历 <body> 元素的所有子元素，并查找磁力链接
        var magnetLinks = unique(traverseDOM(bodyElement));

        var linksText = magnetLinks.join("\n");

        console.log(magnetLinks);

        // 复制链接到剪贴板
        if (magnetLinks.length > 0) {
            var copyButton = document.createElement('button');
            copyButton.textContent = `Copy ${magnetLinks.length} Magnet Links`;
            copyButton.style.position = 'fixed';
            copyButton.style.bottom = '20px';
            copyButton.style.right = '20px';
            copyButton.style.zIndex = '9999';
            document.body.appendChild(copyButton);

            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(linksText).then(function() {
                    alert('Links copied to clipboard!');
                }).catch(function(error) {
                    console.error('Failed to copy links to clipboard:', error);
                });
            });
        }
    }

    // 页面加载完成后收集磁力链接
    window.addEventListener('load', function() {
        collectMagnetLinks();
    });

})();
