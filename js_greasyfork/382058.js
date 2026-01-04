// ==UserScript==
// @name         SG Needs Jide
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一个基德的脚本
// @author       文爱
// @include      https://bbs.sgamer.com/thread*
// @include      https://bbs.sgamer.com/forum.php?mod=viewthread*
// @include      https://bbs.sgamer.com/forum-283-1.html
// @include      https://bbs.sgamer.com/forum.php?mod=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382058/SG%20Needs%20Jide.user.js
// @updateURL https://update.greasyfork.org/scripts/382058/SG%20Needs%20Jide.meta.js
// ==/UserScript==
(function() {

    // 是否隐藏勋章，默认为true隐藏，改为false为不隐藏
    var hideMedal = true;
    // 是否开启纯净模式
    var purePage = true;

    window.jide = function (id) {
        var post_id = "postmessage_" + id;
        var post_msg = document.getElementById(post_id).innerText.replace( /^\s/, '');
        document.getElementById("fastpostmessage").innerText = post_msg;
        document.getElementById("fastpostform").submit();
    }

    window.randomReply = function() {
        var reply = new Array("基德基德", "好贴，我顶", "纯路人，支持lz", "伐木伐木")
        document.getElementById("fastpostmessage").innerHTML = reply[Math.floor((Math.random()*reply.length))];
        document.getElementById("fastpostform").submit();
    }

    if (hideMedal) {
        var mds = document.getElementsByClassName("md_ctrl");
        var j;
        for (j = mds.length - 1; j >= 0; j --) {
            mds[j].innerHTML = "";
        }
    }

    var plc = document.getElementsByClassName("plc");

    var i,pi,line;

    for (i = 2; i < plc.length; i ++) {

        pi = plc[i].getElementsByClassName("pi");
        if (pi.length == 0) continue;

        var msg_id = plc[i].parentElement.parentElement.parentElement.id.substring(3);

        line = pi[0].getElementsByClassName("pti")[0].getElementsByClassName("authi")[0];

        if (i == 2) {
            line.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='randomReply()'>随机回复</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='jide(" + msg_id + ")'>复制伐木</a>";
        } else {
            line.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='jide(" + msg_id + ")'>复制伐木</a>";
        }

    }

    if(purePage) {
        document.getElementsByClassName("bm_c cl pbn")[0].parentNode.removeChild(document.getElementsByClassName("bm_c cl pbn")[0]);

        var c = document.getElementById("threadlisttableid");

        var z = 0;
        var ts = c.getElementsByTagName("tbody");
        for (z = 0; z < 6; z ++) {
            var t = ts[z];
            t.parentNode.removeChild(t);
        }

    }

})();