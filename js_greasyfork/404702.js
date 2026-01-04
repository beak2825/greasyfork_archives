// ==UserScript==
// @name         CSDN文章复制
// @namespace    http://jxnflzc.cn/
// @version      0.2
// @description  可以复制CSDN的文章
// @author       Jxnflzc
// @include      *://blog.csdn.net/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404702/CSDN%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/404702/CSDN%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = $('#content_views').html();
    var r = s.replace(/<\/?.+?>/g,"");
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    var rr = r.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
    //var rr = r.replace(/ /g,"");
    //var btnHtml =
    var btnHtml = '<button style="width:80px;height:20px;position:fixed;margin-top: 20%;" id="copy_article">';
    btnHtml += '复制文章';
    btnHtml += ' </button>';

    var bodyHtml = $('body');
    bodyHtml.prepend(btnHtml);

    $(function () {
        $("#copy_article").click(function () {
            var aux = document.createElement("input");
            aux.setAttribute("value", rr);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
            alert("复制成功");
        });
    });
})();