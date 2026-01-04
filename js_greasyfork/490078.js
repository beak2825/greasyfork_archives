// ==UserScript==
// @name         Download Link Collector
// @namespace    dlc
// @version      0.1.0
// @description  Collects magnet/ed2k links and provides copy to clipboard.
// @author       wzzzzz
// @license MIT

// @include      *://*javbus.com/*
// @include      *://www.*bus*/*
// @include      *://www.*javsee*/*
// @include      *://www.*seejav*/*
// @include      *://www.south-plus.net/*

// @include      *://*sehuatang.net/*

// @include      *://*onejav.com/*

// @include      *://*avsox.*/*

// @include      *://*jav321.com/video/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/490078/Download%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/490078/Download%20Link%20Collector.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 收集磁力链接
    function collectLinks() {
        function traverseDOM(element) {
            let downloadLinks = [];

            if (element.nodeType === Node.TEXT_NODE) {
                // 如果当前节点是文本节点，则在文本中查找链接
                let innerText = element.nodeValue;
                let collect_str = collect(innerText);
                if (collect_str && collect_str.length) downloadLinks = downloadLinks.concat(collect_str);
            } else if (element.tagName === 'LI') {
                let collect_str = collect(element.innerHTML);
                if (collect_str && collect_str.length) downloadLinks = downloadLinks.concat(collect_str);
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                // 如果当前节点是元素节点，则递归遍历其子元素
                for (let i = 0; i < element.childNodes.length; i++) {
                    downloadLinks = downloadLinks.concat(traverseDOM(element.childNodes[i]));
                }
            }

            return downloadLinks;
        }

        // 提取链接
        function collect(link_str) {
            if (!link_str) return '';
            let result = '';
            let pattern = /(magnet:\?xt=urn:btih:)[0-9a-fA-F]{40}/g;
            let pattern_lite = /[0-9a-fA-F]{40}[\s]?/g;
            let pattern_ed2k = /ed2k:\/\/\|file\|.+\|\//g;
            let matches = link_str.match(pattern);
            let matches_ed2k = link_str.match(pattern_ed2k);
            if (matches) {
                result = matches;
            } else if (matches_ed2k) {
                result = matches_ed2k;
            }
            else {
                let lites = link_str.match(pattern_lite);
                if (lites) {
                    lites = lites.map(str => `magnet:?xt=urn:btih:${str.replace(/^\s*|\s*$/g, '')}`);
                    result = lites;
                }
            }
            return result
        }

        // 链接去重
        function unique(arr) {
            let result = [];
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                let str = arr[i].toLowerCase();
                if (!obj[str]) {
                    result.push(arr[i]);
                    obj[str] = true;
                }
            }
            return result;
        }

        // 获取 <body> 元素
        let bodyElement = document.getElementsByTagName('body')[0];

        // 遍历 <body> 元素的所有子元素，并查找链接
        let downloadLinks = unique(traverseDOM(bodyElement));

        let linksText = downloadLinks.join("\n");

        console.log(downloadLinks);

        // 复制链接到剪贴板
        if (downloadLinks.length > 0) {
            let copyButton = document.createElement('button');
            copyButton.textContent = `Copy ${downloadLinks.length} Links`;
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
        collectLinks();
    });

})();