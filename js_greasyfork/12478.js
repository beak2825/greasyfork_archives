// ==UserScript==
// @name               Dropbooks Romover
// @namespace          http://hogehoge/
// @version            1.*.1
// @description        Remove ads and skip datail page on Dropbooks
// @description:ja     ドロップブックスの広告の削除・詳細ページのスキップ
// @author             H. Amami
// @match              *://dropbooks.tv/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/12478/Dropbooks%20Romover.user.js
// @updateURL https://update.greasyfork.org/scripts/12478/Dropbooks%20Romover.meta.js
// ==/UserScript==

function deleteThis(obj) {
    obj.parentNode.removeChild(obj);
}

if (location.href.indexOf("/detail/") === -1) {
    deleteThis(document.getElementById("main2col").getElementsByTagName("center")[0]);
//    deleteThis(document.getElementsByClassName("content_list")[0]);
    deleteThis(document.getElementById("ad_tsuibi"));
    var a = document.getElementsByTagName("a");
    var h = "";
    for (var i = 0, max = a.length; i < max; i++) {
        h = a[i].href;
        if (h.indexOf("/detail/") > -1) {
            a[i].href = h.replace("/detail/", "/detail/download_zip/");
        }
    }
}

var cnt = 0;

function b() {
    d = document.getElementById("octopus-scr");
    if (d) {
        clearInterval(c);
        deleteThis(d);
        document.body.style.paddingTop = 0;
    }
    if (++cnt > 5) clearInterval(c);
}

var c = setInterval(b, 500);