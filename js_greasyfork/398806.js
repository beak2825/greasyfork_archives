// ==UserScript==
// @name         BV2AV
// @namespace    https://www.7gugu.comm/
// @version      0.2
// @description  BV转AV,并且显示到视频信息栏
// @author       7gugu
// @include        /https?:\/\/bilibili\.com\/
// @match        https://www.bilibili.com/video/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398806/BV2AV.user.js
// @updateURL https://update.greasyfork.org/scripts/398806/BV2AV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    算法来源:
    https://www.zhihu.com/question/381784377/answer/1099438784
    */
    var table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF",
    tr = new Object();
    for (var i = 0; i < 58; i++) {
        tr[table[i]] = i;
    }
    var s = [11, 10, 3, 8, 4, 6],
    xor = 177451812,
    add = 8728348608;

    function dec(x) {
        var r = 0;
        for (var i = 0; i < 6; i++) {
            r += tr[x[s[i]]] * 58 ** i;
        }
    return (r - add) ^ xor;
    }

    var bv = window.location.pathname;
	bv = bv.substring(bv.lastIndexOf('/'), bv.length);
    bv = bv.replace("\/","");
    if(bv.substr(0,2)!="BV")return;
    var av = dec(bv);

    var id = setInterval(function(){
        var html = $(".like").html();
        html = html.replace(/<!---->/g, "");
        html = html.replace("<i class=\"van-icon-videodetails_like\" style=\"color:;\"></i>", "");
        if(html.substr(0,2) != "--"){
            $(".video-data:first").append("<span style='margin-left:16px'><a href='https://www.bilibili.com/video/av"+av+"'>av"+av+"</a></span>");
            clearInterval(id);
        }
    }, 1000);



})();