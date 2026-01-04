// ==UserScript==
// @name         adblock really NB!解除bejson.com屏蔽广告后的提示
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  adblock really NB！解除bejson.com屏蔽广告后的提示。
// @author       shanlan
// @match        *://www.bejson.com/*
// @grant        none
// @icon         http://www.bejson.com/favicon.ico
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/399383/adblock%20really%20NB%21%E8%A7%A3%E9%99%A4bejsoncom%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E7%9A%84%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/399383/adblock%20really%20NB%21%E8%A7%A3%E9%99%A4bejsoncom%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E7%9A%84%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.killads = true;

})();