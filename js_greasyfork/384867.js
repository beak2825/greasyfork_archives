// ==UserScript==
// @name         打开oschina的文章章节
// @namespace    https://my.oschina.net
// @version      0.3
// @description  try to take over the world!
// @author       suveng
// @match        *://my.oschina.net/*
// @downloadURL https://update.greasyfork.org/scripts/384867/%E6%89%93%E5%BC%80oschina%E7%9A%84%E6%96%87%E7%AB%A0%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/384867/%E6%89%93%E5%BC%80oschina%E7%9A%84%E6%96%87%E7%AB%A0%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var sideMenuLauncher = document.getElementById('sideMenuLauncher')
    console.log(sideMenuLauncher);
    if(sideMenuLauncher){
        sideMenuLauncher.click();
    }
})();