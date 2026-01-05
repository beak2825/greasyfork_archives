// ==UserScript==
// @name        kukuku_hide_someone
// @description k岛屏蔽某id的串
// @namespace   https://greasyfork.org/zh-CN/scripts/27581
// @include     http://www.kukuku.cc/*
// @include     http://www.kukuku.cc/t/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27581/kukuku_hide_someone.user.js
// @updateURL https://update.greasyfork.org/scripts/27581/kukuku_hide_someone.meta.js
// ==/UserScript==

var mdzz = ["ID_1", "ID_2"];        //黑名单

var topics = document.getElementsByClassName("h-threads-item");
var replies = document.getElementsByClassName("h-threads-item-reply");

for (i = 0; i < topics.length; i++) {
    var topic = topics[i];
    var title1 = topic.getElementsByClassName("h-threads-info-uid")[0].innerHTML;
    for (j = 0; j < mdzz.length; j++) {
        var md = mdzz[j];
        if (title1.search(md) != -1) {
            topic.parentNode.removeChild(topic);
        }
    }
}
for (m = 0; m < replies.length; m++) {
    var reply = replies[m];
    var title2 = reply.getElementsByClassName("h-threads-info-uid")[0].innerHTML;
    for (n = 0; n < mdzz.length; n++) {
        var zz = mdzz[n];
        if (title2.search(zz) != -1) {
            reply.parentNode.removeChild(reply);
        }
    }
}
