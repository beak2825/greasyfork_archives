// ==UserScript==
// @name         NGAto178
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  访问NGA论坛时自动跳转到178.
// @author       coofly
// @match        https://bbs.nga.cn/*
// @match        https://ngabbs.com/*
// @icon         https://bbs.nga.cn/favicon.ico
// @grant        none
// @license MIT
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/451599/NGAto178.user.js
// @updateURL https://update.greasyfork.org/scripts/451599/NGAto178.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("url = ", document.URL)
    var new_url = document.URL
    new_url = new_url.replace('//bbs.nga.cn', '//nga.178.com')
    new_url = new_url.replace('//ngabbs.com', '//nga.178.com')
    console.log("new_url = ", new_url)
    window.location = new_url
})();
