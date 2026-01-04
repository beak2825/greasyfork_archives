// ==UserScript==
// @name         Yahoo!Japanニュース吹き出し消去
// @version      8.8
// @description  Yahoo!Japanニュースの吹き出しを消去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419841/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%90%B9%E3%81%8D%E5%87%BA%E3%81%97%E6%B6%88%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/419841/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%90%B9%E3%81%8D%E5%87%BA%E3%81%97%E6%B6%88%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
    var cnt=0
    var flg=0
    var si=setInterval(function(){
        cnt++;
        if(document.URL=='https://news.yahoo.co.jp/'){
            var obj=document.querySelectorAll('[class^=newsFeed_item]');
            if(obj.length>0){
                obj[0].children[2].click();
                flg++;
            };
        }else{
            if(document.URL.substring(0,41)=='https://news.yahoo.co.jp/comment-timeline'){
            }else{
                 if(document.children[0].innerHTML.indexOf('購入後に全文お読みいただけます。')==-1){
                     obj=document.getElementById('contentsWrap');
                     console.log(obj.children[obj.childElementCount-1].innerText.indexOf('もっと見る'));
                     if(obj.children[obj.childElementCount-1].innerText.indexOf('もっと見る')>=10 && obj.children[obj.childElementCount-1].innerText.indexOf('もっと見る')<1000){
                         obj.children[obj.childElementCount-1].remove();
                         flg++;
                     };
                 };
            };
        };
        if(flg>0||cnt>1000){
            clearInterval(si);
        };
    },200);
})();
