// ==UserScript==
// @name         ScombZ-AutoClick
// @namespace    https://twitter.com/yudai1204
// @version      0.1
// @description  ScombZログインボタンを自動クリック
// @author       yudai1204
// @match        https://scombz.shibaura-it.ac.jp/login
// @icon         https://scombz.shibaura-it.ac.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443658/ScombZ-AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/443658/ScombZ-AutoClick.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function(){
        document.querySelector('.login-btn:nth-child(1)').click();
    };
})();