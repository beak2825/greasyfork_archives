// ==UserScript==
// @name         名称重置
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  （1）根据网页地址，选择特定元素内的链接进行处理，转换为绝对地址，并添加download属性；（2）点击下载时，文件名以<a>标签显示的文字命名
// @icon         https://www.picc.com/images/favicon.ico
// @author       for419
// @match        *://*.nfra.gov.cn/*
// @match        *://*.cbirc.gov.cn/*
// @match        *://*.piccnet11.com.cn/*
// @match        *://*.picc.com.cn/*
// @match        *://*.piccnet.com.cn/*
// @match        *://*.gov.cn/c*
// @match        *://*.gov.cn/y*
// @match        *://*.gov.cn/z*
// @match        *://127.0.0.1/*/*.htm*
// @match        *://127.*.*.*/*gz*/*
// @match        *://127.*.*.*/nd*/*

// @exclude      *://127.0.0.1:800/site/00web/*
// @exclude      *://127.0.0.1:800/site/*/index.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540408/%E5%90%8D%E7%A7%B0%E9%87%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/540408/%E5%90%8D%E7%A7%B0%E9%87%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要处理的文件后缀名
    const fileExtensions = [
        'zip', 'pdf', 'gd', 'gw', 'rar', '7z', 'ep', 'et', 'ew', 'wmv',
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg',
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
    ];

    // 根据网页地址选择元素
    const selectorsByHost = {
        'example1.com': ['.class1', '.class2', '#Id3'],
        'example2.com': ['.classb1', '.classb2', '#Idb3'],
        'example3.com': ['.classc1', '.classc2'],
        'example4.com': ['#Id3s1', '#Id3ass2', '#Id333'],
        'cbirc.gov.cn': ['div.wenzhang-fujian li a'],
        'nfra.gov.cn': ['div.wenzhang-fujian li a'],
        '127.0.0.1': ['.main img', '.main_fuj a', '.main_neir a'],
        'web.piccnet.com.cn': ['.artcle_content', '#news_content']
    };

    // 获取当前网页的主机名
    const currentHost = window.location.hostname;

    // 获取对应的元素选择器
    const selectors = selectorsByHost[currentHost] || [];

    // 处理元素的函数
    function processElement(element, baseUrl) {
        // 处理链接元素
        if (element.tagName === 'A') {
            const href = element.getAttribute('href');
            if (href && !href.startsWith('http')) {
                const absoluteUrl = new URL(href, baseUrl).toString();
                element.setAttribute('href', absoluteUrl);

                // 获取文件扩展名
                const ext = absoluteUrl.split('.').pop().toLowerCase();

                // 检查文件扩展名是否在需要处理的列表中
                if (fileExtensions.includes(ext) || /doc|xls|ppt/.test(ext)) {
                    // 优化文件名，确保后缀名不重复
                    let downloadName = element.textContent.trim().replace(/\s+/g, '').replace(/\.+$/, '');
                    const lastDotIndex = downloadName.lastIndexOf('.');
                    if (lastDotIndex !== -1) {
                        downloadName = downloadName.slice(0, lastDotIndex) + '.' + ext;
                    }

                    // 添加或更新download属性
                    if (!element.getAttribute('download')) {
                        element.setAttribute('download', downloadName);
                    }
                }
            }
        }
        // 处理图片元素
        else if (element.tagName === 'IMG') {
            const src = element.getAttribute('src');
            if (src && !src.startsWith('http')) {
                const absoluteSrc = new URL(src, baseUrl).toString();
                element.setAttribute('src', absoluteSrc);
            }
        }
    }

    // 遍历选择器，获取元素，并处理其中的链接和图片
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            processElement(element, window.location.href);
        });
    });
})();
