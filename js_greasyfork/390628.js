// ==UserScript==
// @name         visitorsmsExtend
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add extend cloumns to visitorsms.com message list page
// @author       Jttoal
// @match        https://www.visitorsms.com/*/*/message*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390628/visitorsmsExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/390628/visitorsmsExtend.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tb  = $('.pd');
    var  hder = tb.children(".table-primary");
    var lag = hder.children('.col-md-8');
    lag.removeClass('col-md-8');
    lag.addClass('col-md-4')
    hder.append('<div class="col-xs-0 col-md-2  font-weight-bold">签名</div>');
    hder.append('<div class="col-xs-0 col-md-1  font-weight-bold">百度</div>');
    hder.append('<div class="col-xs-0 col-md-1  font-weight-bold">天眼查</div>');

    var rows = tb.children('.table-hover');

    for(var i=0; i< rows.length;i++){
        var row = $(rows[i])
        var textCol = row.children('.reg_contents')
        textCol.removeClass('col-md-8');
        textCol.addClass('col-md-4')
        var text =  textCol.text();
        var signLen= text.indexOf('】')-text.indexOf('【') -1 ;
        var sign =  text.substr(text.indexOf('【')+1,signLen);
        if (sign.length  <= 0){
             signLen= text.indexOf(']')-text.indexOf('[') -1 ;
             sign =  text.substr(text.indexOf('[')+1,signLen);
        }
        if( sign.length >0 ){
            row.append('<div class="col-xs-0 col-md-2 ">'+sign+'</div>');
            row.append('<div class="col-xs-0 col-md-1 "><a  target="_blank" href="https://www.baidu.com/s?wd='+sign+'" style="color:#337ab7">去百度</a></div>');
            row.append('<div class="col-xs-0 col-md-1"><a target="_blank" href="https://www.tianyancha.com/search?key='+sign+'"  style="color:#337ab7">查企业</a></div>');
        }else{
            row.append('<div class="col-xs-0 col-md-2 ">无</div>');
            row.append('<div class="col-xs-0 col-md-2 ">无</div>');
            row.append('<div class="col-xs-0 col-md-2 ">无</div>');
        }

    }
    // Your code here...
})();