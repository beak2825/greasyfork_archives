// ==UserScript==
// @name         BBU自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  蚌埠学院BBU自动登录
// @author       汪布斯
// @match        http://1.1.2.3/0.htm
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418659/BBU%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/418659/BBU%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName("input")[0].value="*****";
    document.getElementsByTagName("input")[1].value="*****";
    function denglu(){
        document.getElementsByTagName("input")[2].click();
    }
    setTimeout(denglu,500);
})();