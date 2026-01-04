// ==UserScript==
// @name         HUSMLSSSS: HUSM Learning Support System Support System
// @namespace    http://tampermonkey.net/
// @version      1.8.25.1
// @description  学修支援システムを支援するシステムです
// @author       r1825
// @match        http://ls.hama-med.ac.jp/keysearch
// @match        http://ls.hama-med.ac.jp/list/*
// @match        http://ls.hama-med.ac.jp/video/*
// @icon         https://www.google.com/s2/favicons?domain=hama-med.ac.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/427773/HUSMLSSSS%3A%20HUSM%20Learning%20Support%20System%20Support%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/427773/HUSMLSSSS%3A%20HUSM%20Learning%20Support%20System%20Support%20System.meta.js
// ==/UserScript==

let data;

(function() {
    'use strict';

    data = GM_getValue("r1825-data");
    if ( data == undefined ) data = "";

    if ( location.href.match(/list\/r[0-9a-z]*/) ) {
        $('.subject_list_title').append('<p><button id="r1825-button-register">登録</button></p>');
        $('.subject_list_title').append('<p><button id="r1825-button-unregister">登録解除</button></p>');
    }

    let arr = data.split(",");
    for ( let i = 0; i < (arr.length-1)/2; i++ ) {
        $($(".drawer-nav .drawer-menu li")[2 + i]).append('<li><a href="http://ls.hama-med.ac.jp/list/' + arr[2 * i + 1] + '">' + arr[2 * i] + '</a></li>');
    }
})();

$('#r1825-button-register').on('click', function() {
    let title = $($('.subject_list_title p')[0]).text();
    let code = location.href.replace("http://ls.hama-med.ac.jp/list/", "");
    title = title.replace(code + " : ", "");
    data = data + title + "," + code + ",";
    GM_setValue("r1825-data", data);
});

$('#r1825-button-unregister').on('click', function() {
    let title = $($('.subject_list_title p')[0]).text();
    let code = location.href.replace("http://ls.hama-med.ac.jp/list/", "");
    title = title.replace(code + " : ", "");
    let set = title + "," + code + ",";
    data = data.replace(set, "");
    GM_setValue("r1825-data", data);
});