// ==UserScript==
// @name         自动跳转到こはる.萌え
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       wcx19911123
// @include      https://koharuhe.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408465/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E3%81%93%E3%81%AF%E3%82%8B%E8%90%8C%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/408465/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E3%81%93%E3%81%AF%E3%82%8B%E8%90%8C%E3%81%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        var url = document.getElementsByTagName("a")[0].href;
        var href = window.location.href;
        if(href.indexOf("?") > -1){
            href = href.substring(href.indexOf("?") + 1);
            window.location.href = url + href;
        }else{
            window.location.href = url;
        }
    };
})();