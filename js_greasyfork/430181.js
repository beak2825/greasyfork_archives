// ==UserScript==
// @name         马军课程 软考高级 小鹅通课程去警告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  主要是这个警告太晃眼了
// @author       bestcondition
// @match        *://*.xiaoe-tech.com/*
// @icon         https://www.google.com/s2/favicons?domain=xiaoe-tech.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430181/%E9%A9%AC%E5%86%9B%E8%AF%BE%E7%A8%8B%20%E8%BD%AF%E8%80%83%E9%AB%98%E7%BA%A7%20%E5%B0%8F%E9%B9%85%E9%80%9A%E8%AF%BE%E7%A8%8B%E5%8E%BB%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430181/%E9%A9%AC%E5%86%9B%E8%AF%BE%E7%A8%8B%20%E8%BD%AF%E8%80%83%E9%AB%98%E7%BA%A7%20%E5%B0%8F%E9%B9%85%E9%80%9A%E8%AF%BE%E7%A8%8B%E5%8E%BB%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hid(){
        document.getElementById('copyRight').setAttribute('hidden',true);
        document.getElementById('lampWrapper').innerHTML='';
    }
    setInterval(hid,1000);
    // Your code here...
})();