// ==UserScript==
// @name         飞猫下载地址脚本
// @namespace    undefined
// @version      0.1441
// @description  获取飞猫网盘下载地址生成按钮
// @author       hellx
// @date         2018-06-01
// @modified     2019-03-23
// @match        *://*.feemoo.com/*
// @require      http://code.jquery.com/jquery-1.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368838/%E9%A3%9E%E7%8C%AB%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/368838/%E9%A3%9E%E7%8C%AB%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $(function () {
        $("#sendpck").children("img").trigger("click");
        var tag_yyl = $("p.blviewf:contains('云预览')");
        if (tag_yyl[0]){
            var id =  tag_yyl[0].getAttribute("onclick").replace(/[^0-9]/ig,"");
            var html = '<span id="combtn" onclick="vip_downvip_down(\'com\',\''+id+'\');" class="bc" style="background-color: rgb(171, 205, 230); display: inline-block; float: none;">普通下载</span>'
           tag_yyl.parent().empty().append(html);
           $("#combtn").trigger("click");
        }
    });

})();