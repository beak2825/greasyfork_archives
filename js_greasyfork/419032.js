// ==UserScript==
// @name         Yahoo!Japanニュース動画除去
// @version      2.0
// @description  Yahoo!Japanニュースの動画部分を除去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419032/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%8B%95%E7%94%BB%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/419032/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%8B%95%E7%94%BB%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
	var obj=document.getElementById('liveStream');
	if(obj){obj.remove();};
	obj=document.getElementsByClassName('yvpub-player')[0];
	if(obj){obj.parentNode.parentNode.remove();};
    var cnt=0
    var flg=0
    var si=setInterval(function(){
        cnt++;
        obj=document.querySelectorAll('#contentsWrap');
        console.log(obj[0]);
        if(obj[0].innerHTML.indexOf('Yahoo!ニュース ライブ')>-1){
            for(var i=obj[0].children.length-1;i>=0;i--){
                if(obj[0].children[i].innerHTML.indexOf('Yahoo!ニュース ライブ')>-1){
                    obj[0].children[i].remove();
                    flg++;
                    break;
                };
            };
        };
        if(flg>0||cnt>1000){
            clearInterval(si);
        };
    },200);
})();
