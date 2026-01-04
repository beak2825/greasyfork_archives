// ==UserScript==
// @name         7sht.me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       三年二班
// @match        http*://54sadsad.com/*
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376392/7shtme.user.js
// @updateURL https://update.greasyfork.org/scripts/376392/7shtme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mid(str,a,b){
        var result=a+'(\\S*)'+b;
        return str.match(result)[1];
    }

    var arry=[],i=0, str='',id,strid1,strid2;
    arry=$('.xg1.y');
    for (i=0;i<=arry.length;i++)
    {

        id= $('h3.xw0')[i].innerHTML.substring(17,22);
        console.log(id);
        strid1=$('div.c.cl')[i].innerHTML;
        strid2=mid(strid1,'.com/','/');


        str=arry[i].innerHTML;
        console.log(str);
        arry[i].innerHTML=str+'<a style="color:red" href=https://54sadsad.com/play/' + id + '/' + strid2 + '.m3u8>  播放</a>';







        //    arry[i].innerHTML=str+'layer.open({type: 1,title: false,area: ["630px", "360px"],shade: 0.8,closeBtn: 0,shadeClose: true,content: "playM3u8(https://54sadsad.com/play/66727/zhongg453.m3u8)"})';

    }
})();