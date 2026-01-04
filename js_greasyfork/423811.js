// ==UserScript==
// @name         增加手机端cookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://music.163.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423811/%E5%A2%9E%E5%8A%A0%E6%89%8B%E6%9C%BA%E7%AB%AFcookie.user.js
// @updateURL https://update.greasyfork.org/scripts/423811/%E5%A2%9E%E5%8A%A0%E6%89%8B%E6%9C%BA%E7%AB%AFcookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "appver=8.0.30";
    document.cookie = "os=iphone";
    // Your code here...
})();