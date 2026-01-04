// ==UserScript==
// @name         Yahoo!Japanニュースオーサーコメント除去
// @version      8.0
// @description  Yahoo!Japanニュースのコメント欄上部に表示されるオーサーコメントを除去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419746/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%82%AA%E3%83%BC%E3%82%B5%E3%83%BC%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/419746/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%82%AA%E3%83%BC%E3%82%B5%E3%83%BC%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
    var cnt=0;
    var flg=0;
    var si=setInterval(function(){
        cnt++;
        var obj1=document.querySelectorAll('[class^=CommentatorCommentListItem__Item-]');
        var obj2=document.querySelectorAll('#contentsWrap')[0].getElementsByTagName('li');
        if(obj1.length>0){
            for(var i=obj1.length-1;i>=0;i--){
                obj1[i].remove();
            };
        };
        if(obj2.length>0){
            for(i=obj2.length-1;i>=0;i--){
                if(obj2[i].innerHTML.indexOf('ico_expert_h30.png')>-1){
                    obj2[i].remove();
                };
            };
        };
        if(cnt>30000){
            clearInterval(si);
        };
    },100);
})();
