// ==UserScript==
// @name         ⛣批改网_作文快捷查重
// @namespace    3hex.det
// @version      0.1.2
// @description  批改网_作文📄快捷查重🔍︎
// @author       3hex
// @match        http://www.pigai.org/index.php?c=write*
// @icon         http://cdn3.pigai.org//res/images/2012/logo.png
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427411/%E2%9B%A3%E6%89%B9%E6%94%B9%E7%BD%91_%E4%BD%9C%E6%96%87%E5%BF%AB%E6%8D%B7%E6%9F%A5%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/427411/%E2%9B%A3%E6%89%B9%E6%94%B9%E7%BD%91_%E4%BD%9C%E6%96%87%E5%BF%AB%E6%8D%B7%E6%9F%A5%E9%87%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //console.log("hello");

    var EID = []
    var RID = []
    var TEXT = []
    var i=0;
    var info = $('.stu_title .stu_title_link a');
    for(i=0;i<info.length;i++)
    {
        EID[i] = $(info[i]).attr('href')
        RID[i] = $(info[i]).attr('href')
        TEXT[i] = $(info[i]).text();

        var reg = /eid=\d+/
        var result = EID[i].match(reg)
        EID[i] = result[0].replace('eid=','');

        reg = /rid=\d+/
        result = RID[i].match(reg)
        RID[i] = result[0].replace('rid=','');
    }
    //console.log(EID);
    //console.log(RID);
    //console.log(TEXT);

    var http_info = {};
    var http_d = [];
    var copy_a = '<a href="@@URL@@" target="_blank" class="wx_qrcode" style="color: red;text-decoration:underline" title="点击查看相似详情">相似度查看</a>'
    for(i=0;i<info.length;i++)
    {
        var http_info_t = 'http://qq.pigai.org/?c=wx_t&a=img&scene=EID,RID';
        var copy = copy_a;
        console.log(http_info_t.replace('RID', RID[i]).replace('EID', EID[i]));
        http_info[TEXT[i]] = copy.replace('@@URL@@',http_info_t.replace('RID', RID[i]).replace('EID', EID[i]));
        http_d[i] = copy.replace('@@URL@@',http_info_t.replace('RID', RID[i]).replace('EID', EID[i]));
    }
    //console.log(http_info);


    for(i=0;i<info.length;i++)
    {
        var tmp = $('.stu_title .stu_title_link')[i];
        $(tmp).append(http_d[i]);
    }

})();