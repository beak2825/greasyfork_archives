// ==UserScript==
// @name        5ch_ng_thread2
// @namespace   http://catherine.v0cyc1pp.com/5ch_ng_thread2.user.js
// @include     http://*.5ch.net/*
// @include     https://*.5ch.net/*
// @include     http://*.bbspink.com/*
// @include     https://*.bbspink.com/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description ５ちゃんねるのスレッドをNGワードで消す。
// @downloadURL https://update.greasyfork.org/scripts/380538/5ch_ng_thread2.user.js
// @updateURL https://update.greasyfork.org/scripts/380538/5ch_ng_thread2.meta.js
// ==/UserScript==


//================================
// Configurations
//   - NGワードを指定してください。
var g_nglist = [
    "見たくないスレッド",
    "見たくないスレッド２",
    "見たくないスレッド３",
];
//================================



console.log("5ch_ng_thread start");

//スレッドは３種ある
//板トップdiv.THREAD_MENUからのスレッド削除
function thread_menu() {
    document.querySelectorAll("div.THREAD_MENU p").forEach(function(elem) {
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
                elem.remove();
            }
        }
    });
}

//板トップdiv.THREAD_CONTENTSからのスレッド削除
function thread_contents() {
    document.querySelectorAll("div.THREAD_CONTENTS").forEach(function(elem) {
        var kids = elem.children;
        var str = "";
        for (var i = 0; i < kids.length; i++) {
            if (kids[i].classList.contains("thread_title")) {
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
                elem.remove();
            }
        }
    });
}

//スレッド全一覧はこちら からのスレッド削除
function thread_ichiran() {
    document.querySelectorAll("#trad > a").forEach(function(elem) {
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
                elem.remove();
            }
        }
    });
}

function main() {
    thread_menu();
    thread_contents();
    thread_ichiran();

}


main();