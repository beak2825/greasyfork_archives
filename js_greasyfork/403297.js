// ==UserScript==
// @name         FuckHuijiWiki
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  灰机Wiki不登陆不让看？垃圾网站快爬
// @author       FuckHuijiWiki
// @match        *://ff14.huijiwiki.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/403297/FuckHuijiWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/403297/FuckHuijiWiki.meta.js
// ==/UserScript==


$(document).ready(function() {
    'use strict';
    $("body").find("*[id*='AdContainer']").remove();
    $("body").find("*[id*='HuijiAppBanner']*").remove();
    // Your code here...
})();