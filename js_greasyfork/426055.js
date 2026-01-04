// ==UserScript==
// @name         ユナイテッドシネマ無音化
// @namespace    https://greasyfork.org/morca
// @version      0.2
// @description  Mute trailers/ads on Unitedcinemas.
// @author       morca
// @match        https://www.unitedcinemas.jp/*/trailer*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426055/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E7%84%A1%E9%9F%B3%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426055/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E7%84%A1%E9%9F%B3%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    videojs.getPlayer('myPlayerID').ready(function() {
        var myPlayer = this;
        myPlayer.on('loadedmetadata', function(){
            myPlayer.muted(true);
        });
    });
})();