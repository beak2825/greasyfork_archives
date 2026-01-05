// ==UserScript==
// @name        kukuku_hide_zz
// @description k岛屏蔽某id的串
// @namespace   https://greasyfork.org/zh-CN/scripts/27596
// @include     http://www.kukuku.cc/*
// @include     http://www.kukuku.cc/t/*
// @version     1ku
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27596/kukuku_hide_zz.user.js
// @updateURL https://update.greasyfork.org/scripts/27596/kukuku_hide_zz.meta.js
// ==/UserScript==

var mdzz = ["cfBBq9FJ3a","ID_2"];        //黑名单

var topics = document.getElementsByClassName("h-threads-item");
var replies = document.getElementsByClassName("h-threads-item-reply");

for (i = 0; i < topics.length; i++) {
    var topic = topics[i];
    var title1 = topic.getElementsByClassName("h-threads-info-uid")[0].innerHTML;
    for (j = 0; j < mdzz.length; j++) {
        var md = mdzz[j];
        if (title1.search(md) != -1) {
            topic.childNodes[1].style.color="#B2B2B2";    //淦他娘灰爆
                //第一个node[1]是item-main
            var zzMother = topic.childNodes[1].getElementsByClassName("h-threads-img-box");
            if (zzMother.length !== 0){
                zzMother[0].parentNode.removeChild(zzMother[0]);
            }
            //topic.parentNode.removeChild(topic);
        }
    }
}
for (m = 0; m < replies.length; m++) {
    var reply = replies[m];
    var title2 = reply.getElementsByClassName("h-threads-info-uid")[0].innerHTML;
    for (n = 0; n < mdzz.length; n++) {
        var zz = mdzz[n];
        if (title2.search(zz) != -1) {
            reply.style.color="#B2B2B2";
                //第一个node[3]是item-reply-main
            var zzMother2 = reply.childNodes[3].getElementsByTagName("img");
            if (zzMother2.length !== 0){
                zzMother2[0].parentNode.removeChild(zzMother2[0]);
            }
            //reply.parentNode.removeChild(reply);
        }
    }
}
