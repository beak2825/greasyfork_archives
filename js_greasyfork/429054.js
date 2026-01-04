// ==UserScript==
// @name         ImageViewer
// @version      1.1.2
// @description  浏览器图片查看效果增强 for Chrome/Edge/Firefox
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/429054-imageviewer
// @match        *://*/*
// @match        file:///*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429054/ImageViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/429054/ImageViewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bgImage = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjMzAzMDMwOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICMyMDIwMjA7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGlkPSJsdCIgY2xhc3M9ImNscy0xIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KICA8cmVjdCBpZD0icmIiIGNsYXNzPSJjbHMtMSIgeD0iMzIiIHk9IjMyIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KICA8cmVjdCBpZD0ibGIiIGNsYXNzPSJjbHMtMiIgeT0iMzIiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIvPgogIDxyZWN0IGlkPSJydCIgY2xhc3M9ImNscy0yIiB4PSIzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIi8+Cjwvc3ZnPgo=`;
    var ua = navigator.userAgent.toLowerCase();
    var doc = document.body || document.documentElement;
    var isQQBrowser = ua.indexOf('qqbrowser/') > -1;
    var isQQBrowserPS = function() {
        return document && document.body && document.body.classList.contains('qb-picture-ps')
    }
    function loaded() {
        var docTagName = (function(tag){
            var tagName = tag && tag.tagName.toLowerCase();
            if (tagName) {
                if (tagName == 'svg') {
                    return tagName;
                }
                if (tagName == 'body' && tag.children && tag.children.length) {
                    tagName = tag.children[0].tagName.toLowerCase();
                    if (tagName == 'img') {
                        return tagName;
                    } else {
                        tagName = document.querySelector('img');
                        return tagName && tagName.tagName && tagName.tagName.toLowerCase();
                    }
                }
            }
        })(doc);

        var isViewerMode = docTagName == 'svg' || docTagName == 'img';
        if (isViewerMode) {
            if (document.head) {
                var styleText = [];
                if (isQQBrowserPS()) {
                    styleText.push(`body{box-sizing: border-box;background-attachment: fixed !important;background-repeat: repeat !important;}`);
                    styleText.push(`body{background: url(${bgImage}) !important;}`);
                } else {
                    styleText.push(`img{position: static !important;background: none !important;background-color: transparent !important;}`);
                }
                var style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.innerHTML = styleText.join('');
                document.head.appendChild(style);
            }
            if (isQQBrowserPS()) {
                doc.style.position = 'static';
                doc.style.top = 'auto';
                doc.style.left = 'auto';
                doc.style.transform = 'none';
            } else {
                doc.style.backgroundImage = `url(${bgImage})`;
                doc.style.backgroundAttachment = 'fixed';
                doc.style.boxSizing = 'border-box';
                if (docTagName == 'svg') {
                    doc.style.position = 'absolute';
                    doc.style.top = '50%';
                    doc.style.left = '50%';
                    doc.style.transform = 'translate(-50%, -50%)';
                    doc.style.margin = '10px';
                    doc.style.width = 'auto';
                    doc.style.height = 'auto';
                    doc.style.maxWidth = '100%';
                    doc.style.maxHeight = '100%';
                }
            }
        }
    }
    if (document.contentType.startsWith('image/')) {
        if (isQQBrowser && doc.tagName !== 'svg') {
            setTimeout(function() {
                loaded();
            }, 666);
        } else {
            loaded();
        }
    }
})();