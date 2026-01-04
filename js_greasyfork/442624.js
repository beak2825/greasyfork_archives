// ==UserScript==
// @name         医科继续教育自动刷新脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  某医科视频自动刷新，打开看视频的页面后，挂着，每49分钟自动页面刷新,打开脚本后每次进入刷新一下页面
// @author       Coolstuz
// @match        https://www.dianmoyun.com/Course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('载入成功');
var json=window.localStorage.getItem('timeData');
			var userinfo=JSON.parse(json)
			    console.log(userinfo);
			console.log(userinfo.appValue1);
            console.log(userinfo.appValue2);


    var flag
    if(document.getElementsByClassName("menu-list")[0].getElementsByTagName("a").length==4){
         flag=1;
    }else{
         flag=0;
    }
   setTimeout(function(){
            //location.reload(true);

           window.location.href = document.referrer;
        }, 3000000);

    

})();