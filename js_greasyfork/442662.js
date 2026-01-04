// ==UserScript==
// @name         医科点墨继续教育视频自动进入
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  找我另外一个插件，配合其他插件使用，本插件自动进入视频，另外一个插件自动刷视频
// @author       Coolstuz
// @match        http://www.dianmoyun.com/*
// @match        http://www.dianmoyun.com/StudentInfo/*
// @match        http://www.dianmoyun.com/StudentInfo/kcxx/*
// @include      http://www.dianmoyun.com
// @include      http://www.dianmoyun.com/StudentInfo
// @include      https://www.dianmoyun.com/StudentInfo/kcxx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442662/%E5%8C%BB%E7%A7%91%E7%82%B9%E5%A2%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442662/%E5%8C%BB%E7%A7%91%E7%82%B9%E5%A2%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
   //console.log('zairuchengong');
var n=0;
var t=0;
var z=0;
var i=0;
var c=0;
var temp=0
var app=document.getElementsByClassName("cjk").length
//console.log('app:'+app);
//console.log("**************************************************************************")
for(i;i<app;i++){
    //console.log('i:'+i);
    var timeData={
        appValue1:parseInt(document.getElementsByClassName("bj1")[n].innerText.replace(/ 分钟/,'')),
        appValue2:parseInt(document.getElementsByClassName("bj1")[4+t].innerText.replace(/ 分钟/,'')),
    }
    var user = JSON.stringify(timeData);
	var app1=parseInt(document.getElementsByClassName("bj1")[n].innerText.replace(/ 分钟/,''));
	n=n+8;
    //console.log('app1:'+app1);
	var app2=parseInt(document.getElementsByClassName("bj1")[4+t].innerText.replace(/ 分钟/,''));
	t=t+8;
    //console.log('app2:'+app2);
    //console.log('span.length:'+document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length);
    //console.log('z:'+z);
	if(app2<app1){
        if(document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length==2){
            //$(".cjk").find(".p_1").find("span").find("a")[z].click();
            //console.log('this is true');
            document.getElementsByClassName("cjk")[z].getElementsByTagName("a")[0].click(window.localStorage.setItem('timeData',user))

        }
    }else{
       // console.log('this is false');
    }
    //console.log('span.length:'+document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length);
    if(document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length==2){
		z=z+1;
	}else{
        z=z+1;
    }


    //console.log('i:'+i);

    if(app2>='300'){
        //console.log("完成")
    }
    //console.log("**************************************************************************")
}
/*for(i;i<app;i++){
(function(i) {
    setTimeout(function() {
        console.log('i:'+i);
	var app1=document.getElementsByClassName("bj1")[n].innerText.replace(/ 分钟/,'');
	n=n+8;
    console.log('app1:'+app1);
	var app2=document.getElementsByClassName("bj1")[4+t].innerText.replace(/ 分钟/,'');
	t=t+8;
    console.log('app2:'+app2);
    console.log('span.length:'+document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length);
    console.log('z:'+z);
	if(app2<app1){
        if(document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length==2){
            //$(".cjk").find(".p_1").find("span").find("a")[z].click();
            console.log('this is true');
            //document.getElementsByClassName("cjk")[z].getElementsByTagName("a")[0].click()

        }
    }else{
        console.log('this is false');
    }
    console.log('span.length:'+document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length);
    if(document.getElementsByClassName("cjk")[i].getElementsByTagName("span").length==2){
		z=z+1;
	}else{
        z=z+1;
    }


    console.log('i:'+i);

    if(app2>='300'){
        console.log("完成")
    }
    console.log("**************************************************************************")
    }, (i + 1) * 10000);
})(i)
}*/
    // Your code here...
})();