// ==UserScript==
// @name         修复Potainer账号密码无法自动填写
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复Potainer账号密码无法自动填写的问题
// @author       xky0007@gmail.com
// @match        *
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/523256/%E4%BF%AE%E5%A4%8DPotainer%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E6%97%A0%E6%B3%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/523256/%E4%BF%AE%E5%A4%8DPotainer%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E6%97%A0%E6%B3%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
     var some_id = document.getElementById('password');
     some_id.removeAttribute('autocomplete');
 
})();