// ==UserScript==
// @name         谷歌翻译Qt文档代码框屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       海
// @match        https://doc.qt.io/*
// @grant        none
// @run-at  document-start
// @require https://code.jquery.com/jquery-2.1.4.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/424867/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91Qt%E6%96%87%E6%A1%A3%E4%BB%A3%E7%A0%81%E6%A1%86%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/424867/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91Qt%E6%96%87%E6%A1%A3%E4%BB%A3%E7%A0%81%E6%A1%86%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){

        $("pre").each(function(){
            var pre = $(this).html()
            $(this).empty()
            $(this).html("<code>"+pre+"</code>")
        });
        $("b").each(function(){
            var b = $(this).html()
            $(this).empty()
            $(this).html("<code>"+b+"</code>")
        });

        var Q = ""
        $("div.context [href],p .name").not("code [href]").each(function(){
            var text = $(this).html()
            var font = $(this).text()
            var font1 = text
            var Q = ""
            var i = 0
            for (i = 0; i < font1.length; i++) {
                if(i!=0 ){
                    if( font1[i]<'A' || font1[i]>'Z'){
                        if( font1[i]<'0' || font1[i]>'9'){
                            Q = Q + font1[i]
                        }else{
                            Q = Q +" "+ font1[i]
                        }
                       
                    }else{
                    Q = Q +" "+ font1[i]
                    }
                }else{
                    Q = Q + font1[i]
                }

            }
            $(this).empty()
            $(this).html(Q+"<font color=\"#9D9D9D\" style=\"font-size: 5px;\">【<code>"+font+"</code>】</font>")
        });

        console.log(Q)
        
     })


})();