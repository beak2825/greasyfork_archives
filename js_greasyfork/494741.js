// ==UserScript==
// @name         萌娘百科跳转镜像网站
// @version      1.0
// @description 在访问主站时自动跳转到镜像网站:'moegirl.uk'
// @match        https://mzh.moegirl.org.cn/*
// @match        https://zh.moegirl.org.cn/*
// @match        https://moegirl.uk/*
// @license        MIT
// @grant        none
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/494741/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%B7%B3%E8%BD%AC%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/494741/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%B7%B3%E8%BD%AC%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const targetHost = 'https://moegirl.uk';
    const pathRegex = /moegirl\.org\.cn(.*)$/;
    const match = pathRegex.exec(window.location.href);
    const newPath = match ? match[1] : '';
    window.location.replace(`${targetHost}${newPath}`);
})();