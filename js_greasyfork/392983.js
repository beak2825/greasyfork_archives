// ==UserScript==
// @name        becmdSmsExtend
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加百度和企查查快捷查询
// @author       uncle5
// @match        https://www.becmd.com/receive-freesms-*.html
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392983/becmdSmsExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/392983/becmdSmsExtend.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tb  = $('.table');
    var  hder = tb.children("thead").children('tr'); // 开始的地方 开始修改页面数据
    hder.append('<th nowrap="nowrap">签名</th>');
    hder.append('<th nowrap="nowrap">百度</th>');
    hder.append('<th nowrap="nowrap">天眼查</th>');
    var tbd = tb.children('tbody');
    var rows = tbd.children('tr') //获取每一行的内容
    for(var i=0; i< rows.length;i++){
        var row = $(rows[i])
        var cols = row.children('td')
        var textCol =$(cols[3]);//获取text
        var text =  textCol.text();
        var signLen= text.indexOf('】')-text.indexOf('【') -1 ;
        var sign =  text.substr(text.indexOf('【')+1,signLen);//获取签名
        if (sign.length  <= 0){
            signLen= text.indexOf(']')-text.indexOf('[') -1 ;
            sign =  text.substr(text.indexOf('[')+1,signLen);
        }
        if( sign.length >0 ){
            row.append('<td data-title="签名:" style="vertical-align:middle;">'+sign+'</td>');
            row.append('<td data-title="百度:" style="vertical-align:middle;"><a target="_blank" href="https://www.baidu.com/s?wd='+sign+'">去百度</a></td>');
            row.append('<td data-title="企查查:" style="vertical-align:middle;"><a target="_blank" href="https://www.tianyancha.com/search?key='+sign+'">企查查</a></td>');
        }else{
            row.append('<td style="vertical-align:middle;">无</td>');
            row.append('<td style="vertical-align:middle;">无</td>');
            row.append('<td style="vertical-align:middle;">无</td>');
        }

    }
    // Your code here...
})();