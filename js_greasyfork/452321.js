// ==UserScript==
// @name         Skip_zgzjzj
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用于对zgzjzj的确认跳过
// @author       CrazyGang
// @match        https://*.zgzjzj.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452321/Skip_zgzjzj.user.js
// @updateURL https://update.greasyfork.org/scripts/452321/Skip_zgzjzj.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    setInterval(() => {
        let modalButtons = document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary')
        let playButtons = document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-paused')
        if (modalButtons.length) {
            modalButtons[0].click()
        }
        if (playButtons.length) {
            playButtons[0].click()
        }
    }, 1000)

    // Your code here...
})();