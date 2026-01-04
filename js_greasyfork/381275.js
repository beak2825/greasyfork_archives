// ==UserScript==
// @name         Pukiwiki Remove Redundency
// @description  Pukiwiki からいらない項目を消す
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.0.1.20190402092213
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381275/Pukiwiki%20Remove%20Redundency.user.js
// @updateURL https://update.greasyfork.org/scripts/381275/Pukiwiki%20Remove%20Redundency.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var indexs = [2, 4, 6, 7, 8, 10, 11]
    var navi = $("#navigator>a");

    for ( var i = 0; i < indexs.length; i++){
        navi.eq(indexs[i]).remove();
    }

    var menu = $("#menubar>p>a");
    indexs = [3, 7, 8, 12, 13, 18, 19, 20, 21]

    for ( i = 0; i < indexs.length; i++){
        menu.eq(indexs[i]).remove();
    }
})();

