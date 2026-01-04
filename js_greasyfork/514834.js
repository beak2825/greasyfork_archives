// ==UserScript==
// @name         AtCoder-429 Error-Auto Reload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @description  429 Errorが出たら自動でリロードします
// @author       元祖のヨッシー
// @match        https://atcoder.jp/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=atcoder.jp
// @grant        none
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514834/AtCoder-429%20Error-Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/514834/AtCoder-429%20Error-Auto%20Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.title==="429 Too Many Requests"){
        location.reload();
    }
})();