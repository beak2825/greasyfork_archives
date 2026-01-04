// ==UserScript==
// @name         在新标签页中打开链接
// @namespace    http://tampermonkey.net/
// @version      2
// @description  所有链接都将在新标签页中打开
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462974/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/462974/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义不受影响的域名数组
    var excludedDomains = [
        'example.com', // 在此添加任何不受影响的域名
    ];

    // 定义应下载而不是在新标签页中打开的文件扩展名数组
    var downloadExtensions = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'tar', 'gz',
    ];

    // 定义应排除或保留的链接属性数组
    var linkAttributes = {
        exclude: [
            'hreflang', 'media', 'ping', 'rel', 'target', 'type', 'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmouseout',
        ],
        preserve: [
            'title', 'class', 'id', 'style',
        ],
    };

    // 获取页面上的所有链接
    var links = document.getElementsByTagName('a');

    // 循环遍历链接，并将target="_blank"属性添加到外部链接
    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        // 检查链接是否已经设置为在新标签页中打开
        if (link.target === '_blank') {
            continue;
        }

        // 检查链接是否在排除的域名上
        var domain = link.hostname.replace(/^www\./, '');
        if (excludedDomains.indexOf(domain) !== -1) {
            continue;
        }

        // 检查链接是否为内部链接、mailto链接或tel链接
        if (link.hostname === location.hostname || !link.hostname || link.protocol === 'mailto:' || link.protocol === 'tel:') {
            continue;
        }

        // 检查链接是否为应下载的文件
        var extension = link.pathname.split('.').pop();
        if (downloadExtensions.indexOf(extension) !== -1) {
            link.setAttribute('download', '');
            continue;
        }

        // 检查链接是否具有任何被排除的属性
        var attributes = link.attributes;
        for (var j = 0; j < attributes.length; j++) {
            var attributeName = attributes[j].name.toLowerCase();
            var attributeValue = attributes[j].value;

            // 排除应排除的属性
            if (linkAttributes.exclude.indexOf(attributeName) !== -1) {
                continue;
            }

            // 保留应保留的属性
            if (linkAttributes.preserve.indexOf(attributeName) !== -1) {
                link.setAttribute(attributeName, attributeValue);
                continue;
            }

            // 为外部链接添加target="_blank"属性
            if (attributeName === 'href') {
                link.setAttribute('target', '_blank');
            }

            // 复制任何其他属性
            link.setAttribute(attributeName, attributeValue);
        }

        // 处理外部链接的文本内容
        var linkText = link.textContent.trim();
        if (!linkText) {
            continue;
        }

        // 检查链接文本是否包含URL
        if (linkText.indexOf('http://') !== -1 || linkText.indexOf('https://') !== -1) {
            continue;
        }
    }
   
})();