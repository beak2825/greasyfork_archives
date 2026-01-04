// ==UserScript==
// @name:en      GitHub Proxy via Mirrors.pw
// @name         GitHub 代理（Mirrors.pw）
// @namespace    https://pmnet.gq/gh-proxy-mirrors-pw-user-script
// @version      0.2.2
// @description:en  A GitHub Proxy which can help you download and clone files from GitHub in Mainland China. This script will add a clone button to the front page of the repository, click to copy the command. Currently only the home page of the repository is supported, and other pages will be opened in succession. Powered by Mirrors.pw.
// @description     一个 GitHub 代理，让您的开发和部署如虎添翼！此脚本会在仓库的首页添加一个克隆按钮，点击即可复制命令。目前仅支持储存库首页，其他页面会陆续开放。由 Mirrors.pw 提供服务。
// @author       jinzhijie
// @supportURL   mailto:admin@pmnet.gq
// @license      CC-BY-SA-4.0
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gh.mirrors.pw
// @grant        none
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/zepto/1.1.7/zepto.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/458402/GitHub%20%E4%BB%A3%E7%90%86%EF%BC%88Mirrorspw%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/458402/GitHub%20%E4%BB%A3%E7%90%86%EF%BC%88Mirrorspw%EF%BC%89.meta.js
// ==/UserScript==

'use strict';
Zepto(function ($) {
    let pmnetMirrorPrefix = 'https://gh.mirrors.pw'
    let buttonText = ' Clone via Mirrors.pw'
    let currentUrl = new URL(window.location)
    let proxied = `git clone ${pmnetMirrorPrefix}/${currentUrl.origin}${currentUrl.pathname}.git`

    // 
    // 
    // 

    $('div.Layout-main > div.file-navigation > span > get-repo')
        .parent()
        .after(
            $('div.Layout-main > div.file-navigation > span')
                .first()
                .clone()
                .addClass('gh-proxy-pmnet')
        );



    let summaryButton = $('.gh-proxy-pmnet summary')
        .removeAttr('data-hydro-click')
        .removeAttr('data-hydro-click-hmac')
        .removeAttr('data-view-component')
        .empty()
        // svg code from svg-icons/octicons/copy.svg  (Open Source)  Copyright © GitHub, Inc.
        .append('<svg class="octicon" aria-hidden="true" height="16" width="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25v-7.5z"/><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25v-7.5zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5z"/></svg>')
        .append(buttonText)
        .clone();



    $('.gh-proxy-pmnet details')
        .remove();


    $('.gh-proxy-pmnet get-repo')
        .append(summaryButton)
        .addClass('copy-proxied-btn')
        .attr('data-clipboard-action', 'copy')
        .attr('data-clipboard-text', proxied);

    let clipboard = new ClipboardJS('.copy-proxied-btn');
    clipboard.on('success', function(e) {
        $('.gh-proxy-pmnet summary')
        .text('Copied!')
    });
    
    clipboard.on('error', function(e) {
        $('.gh-proxy-pmnet summary')
        .text('Ooops! ERROR')
    });
})