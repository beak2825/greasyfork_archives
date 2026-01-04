// ==UserScript==
// @name         Yahoo!Japanニュースおすすめの有料記事欄消去
// @version      5.0
// @description  Yahoo!Japanニュース右側にある「あわせて読みたい有料記事」欄を消去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419028/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%81%AE%E6%9C%89%E6%96%99%E8%A8%98%E4%BA%8B%E6%AC%84%E6%B6%88%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/419028/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%81%AE%E6%9C%89%E6%96%99%E8%A8%98%E4%BA%8B%E6%AC%84%E6%B6%88%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
    var obj=document.getElementById('yjnFixableArea');
    var cnt=0
    var flg=0
    var si=setInterval(function(){
        cnt++;
        if(obj.innerHTML.indexOf('あわせて読みたい有料記事')>-1){
            obj.innerHTML=obj.innerHTML.substring(0,obj.innerHTML.indexOf('あわせて読みたい有料記事'));
        };
        if(flg>0||cnt>1000){
            clearInterval(si);
        };
    },200);
})();

