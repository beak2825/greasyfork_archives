// ==UserScript==
// @name         Tinder work mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改Tinder页面的标题
// @author       zhaotianxiong
// @match        *://*.tinder.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432979/Tinder%20work%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/432979/Tinder%20work%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(function(){document.title = "会议记录"}, 10000 )
})();