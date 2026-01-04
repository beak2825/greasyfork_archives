// ==UserScript==
// @name         绕过民生银行移动端年龄检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  绕过民生银行移动端年龄检测，覆写原年龄检测
// @author       You
// @match        https://creditcard.cmbc.com.cn/wsv2*
// @downloadURL https://update.greasyfork.org/scripts/371615/%E7%BB%95%E8%BF%87%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%B9%B4%E9%BE%84%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371615/%E7%BB%95%E8%BF%87%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%B9%B4%E9%BE%84%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
     unsafeWindow.ageRange=function(a,b){return true;}
    
})();