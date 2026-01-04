// ==UserScript==
// @name        5ch_ng_name2
// @namespace   https://catherine.v0cyc1pp.com/5ch_ng_name2.user.js
// @include     http://*.5ch.net/*
// @include     https://*.5ch.net/*
// @include     http://*.bbspink.com/*
// @include     https://*.bbspink.com/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     0.1
// @grant       none
// @description ５ちゃんねるの名前をNGワードで消す。
// @downloadURL https://update.greasyfork.org/scripts/379424/5ch_ng_name2.user.js
// @updateURL https://update.greasyfork.org/scripts/379424/5ch_ng_name2.meta.js
// ==/UserScript==


//================================
// Configurations
//   - NGワードを指定してください。
var g_nglist = [
    "見たくない名前",
    "見たくない名前２",
    "見たくない名前３",
];
//================================



console.log("5ch_ng_name start");

//名前は二種類ある
//スレッドページからの名前削除
function name_post() {
    document.querySelectorAll("div.post").forEach(function(elem) {
        var id = elem.getAttribute("id");
        var kids = elem.children[0].children;
        var str = "";
        for (var i = 0; i < kids.length; i++) {
            if (kids[i].classList.contains("name")) {
                str = kids[i].innerText;
            }
        }
        if (str == null || str == undefined) {
            str = "";
        }
        for (i = 0; i < g_nglist.length; ++i) {
            var ngword = g_nglist[i];
            if (ngword == "") {
                continue;
            }
            var obj = new RegExp(ngword, "i");
            var index = str.search(obj);
            if (index != -1) {
                // NGnameでも1の場合は消さない
                console.log("[5ch_ng_name] id=" + id);
                if (id != "1") {
                    elem.nextElementSibling.remove();
                    elem.remove();
                }
            }
        }
    });
}
//板トップdl.threadからの名前削除
function name_thread() {
    document.querySelectorAll("dl.thread > dt").forEach(function(elem) {
        var str = elem.innerText;
        if (str == null || str == undefined) {
            str = "";
        }
        for (var i = 0; i < g_nglist.length; ++i) {
            var ngword = g_nglist[i];
            if (ngword == "") {
                continue;
            }
            var obj = new RegExp(ngword, "i");
            var index = str.search(obj);
            if (index != -1) {
                elem.nextElementSibling.remove();
                elem.remove();
            }
        }
    });
}

function main() {
    name_post();
    name_thread();
}


main();