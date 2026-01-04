// ==UserScript==
// @name         新标签打开
// @description  新页面(标签)打开
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @author       imgreasy
// @match        https://ourbits.club/*
// @match        https://hdchina.org/*
// @match        https://totheglory.im/*
// @match        https://kp.m-team.cc/*
// @match        https://springsunday.net/*
// @match        https://lemonhd.org/*
// @match        https://audiences.me/*
// @match        https://hhanclub.top/*
// @match        https://club.hares.top/*
// @match        https://totheglory.im/*
// @match        https://pterclub.com/*
// @match        https://pt.keepfrds.com/*
// @match        https://leaves.red/*
// @icon         https://raw.githubusercontent.com/zjutjh/NexusPHP/master/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @homepageURL  https://greasyfork.org/zh-CN/scripts/457597
// @downloadURL https://update.greasyfork.org/scripts/457597/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/457597/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = new Map([
        ["kp.m-team.cc", "#form_torrent a"],
        ['totheglory.im', '#torrent_table tbody a'],
        ["ourbits.club", "#torrenttable a"],
        ["hdchina.org", "#form_torrent .torrent_list a"],
        ['springsunday.net', '#outer .torrents a'],
        ['lemonhd.org', '#outer .torrents a'],
        ['audiences.me', '#torrenttable a'],
        ['hhanclub.top', '#outer .torrents a'],
        ['club.hares.top', '.torrents tbody a'],
        ['pterclub.com', '#torrenttable tbody a'],
        ['pt.keepfrds.com', '#form_torrent .torrents tbody a'],
        ['leaves.red', '#outer .torrents .torrentname tbody td a']
    ]);

    const path = settings.get(window.location.hostname);
    document.querySelectorAll(path).forEach(function (row) {
        if (row.href.indexOf('download') == -1) {
            if (row.href.slice(0,4) == 'http' || row.href.slice(0,5) == 'https') {
                row.target = '_blank'
            }
        }
    });
})();