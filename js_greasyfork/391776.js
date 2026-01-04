// ==UserScript==
// @name        出品者Amazon.co.jpのみ表示
// @version     1.1
// @description Redirect Amazon
// @author      milumon
// @include     https://www.amazon.co.jp/*
// @exclude     https://www.amazon.co.jp/
// @run-at      document-start
// @namespace https://greasyfork.org/users/393520
// @downloadURL https://update.greasyfork.org/scripts/391776/%E5%87%BA%E5%93%81%E8%80%85Amazoncojp%E3%81%AE%E3%81%BF%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/391776/%E5%87%BA%E5%93%81%E8%80%85Amazoncojp%E3%81%AE%E3%81%BF%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var url = location.href;
    if (url.indexOf('&emi')==-1){
        var newURL = location.href + "&emi=AN1VRQENFRJN5" ;
        window.location.replace(newURL);
    }
})();