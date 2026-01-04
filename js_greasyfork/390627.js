// ==UserScript==
// @name         shejiinnSmsExtend
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add more list column for shejiinn.com
// @author       You
// @match        https://www.shejiinn.com/receive-sms-*.html
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/390627/shejiinnSmsExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/390627/shejiinnSmsExtend.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tb  = $('.table');
    var  hder = tb.children("thead").children('tr');
    hder.append('<td>签名</td>');
    hder.append('<td>百度</td>');
    hder.append('<td>天眼查</td>');

    var tbd = tb.children('tbody');
    var rows = tbd.children('tr')

    for(var i=0; i< rows.length;i++){
        var row = $(rows[i])
        var cols = row.children('td')
        var textCol =$(cols[2]);
        var text =  textCol.text();
        var signLen= text.indexOf('】')-text.indexOf('【') -1 ;
        var sign =  text.substr(text.indexOf('【')+1,signLen);
        if (sign.length  <= 0){
             signLen= text.indexOf(']')-text.indexOf('[') -1 ;
             sign =  text.substr(text.indexOf('[')+1,signLen);
        }
        if( sign.length >0 ){
            row.append('<td>'+sign+'</td>');
        row.append('<td><a target="_blank" href="https://www.baidu.com/s?wd='+sign+'">去百度</a></td>');
        row.append('<td><a target="_blank" href="https://www.tianyancha.com/search?key='+sign+'">查企业</a></td>');
        }else{
            row.append('<td>无</td>');
            row.append('<td>无</td>');
            row.append('<td>无</td>');
        }

    }
})();

