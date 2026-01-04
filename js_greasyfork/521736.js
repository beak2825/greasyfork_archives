// ==UserScript==
// @name         帮你一键下载诚通网盘的文件
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  帮你一键下载诚通网盘的文件(需下载客户端
// @author       TINKOUBUN
// @match        https://url74.ctfile.com/f/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctfile.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521736/%E5%B8%AE%E4%BD%A0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%AF%9A%E9%80%9A%E7%BD%91%E7%9B%98%E7%9A%84%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521736/%E5%B8%AE%E4%BD%A0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%AF%9A%E9%80%9A%E7%BD%91%E7%9B%98%E7%9A%84%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        'use strict';
        load_passcode();
        verify_passcode();
        setTimeout(() => {
            file_down( 0, 1)
        }, 1000);
    }, 1000)
})();