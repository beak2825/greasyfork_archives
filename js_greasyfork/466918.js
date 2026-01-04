// ==UserScript==
// @name         谷歌翻译绕过字符块，添加MOOSE文档翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让谷歌翻译插件翻译网页的时候，绕过代码块和一些无需翻译的元素，原作者xiandan
// @author       ke
// @homeurl      https://github.com/xiandanin/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/392357
// @match        https://github.com/*
// @match        https://npmjs.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.google.com/*
// @match        https://mooseframework.inl.gov/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466918/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E7%BB%95%E8%BF%87%E5%AD%97%E7%AC%A6%E5%9D%97%EF%BC%8C%E6%B7%BB%E5%8A%A0MOOSE%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/466918/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E7%BB%95%E8%BF%87%E5%AD%97%E7%AC%A6%E5%9D%97%EF%BC%8C%E6%B7%BB%E5%8A%A0MOOSE%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict'

    function noTranslate (array) {
        array.forEach((name) => {
        [...document.querySelectorAll(name)].forEach(node => {
            if (node.className.indexOf('notranslate') === -1) {
                node.classList.add('notranslate');
            }
        });
        });
    }

    const bypassSelectorArray = [
        'pre',
        '.moose-katex-block-equation',
        '.moose-katex-inline-equation',
        '.collection-item > a ',
        '.collection-header',
        '.scrollspy > h2',
        '.scrollspy > h3',
        '.moose-parameter-name',
        '.modal-content',
        '.moose-source-filename.tooltipped.modal-trigger'
    ]

    if (window.location.hostname.indexOf("github") !== -1) {
        // 如果是github 还需要处理一些别的元素
        const githubSelector = [
            '#repository-container-header > div:nth-child(1)',
            'summary.btn.css-truncate',
            '.commit-author',
            '.js-navigation-open.link-gray-dark',
            '.Box-title',
            '.BorderGrid-cell > div.mt-3 > a.Link--muted',
            '.BorderGrid-cell > a[data-pjax="#repo-content-pjax-container"] > div > div:first-child',
            '.BorderGrid-cell > ul.list-style-none',
            'div[role="rowheader"]'
        ]
        bypassSelectorArray.push.apply(bypassSelectorArray, githubSelector)

        //如果还有github的插件 还需要延迟追加一些
        setTimeout(function () {
            const githubPluginSelector = [
                '.github-repo-size-div',
                '.octotree-tree-view'
            ]
            noTranslate(githubPluginSelector)
        }, 3000)
    }
    noTranslate(bypassSelectorArray);
})()
