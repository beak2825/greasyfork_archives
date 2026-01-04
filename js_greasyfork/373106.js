// ==UserScript==
// @name         斗鱼无弹幕
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  自动屏蔽所有斗鱼直播间弹幕
// @author       arryboom
// @match        *://www.douyu.com/*
// @grant        none
// @run-at document-idle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/373106/%E6%96%97%E9%B1%BC%E6%97%A0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373106/%E6%96%97%E9%B1%BC%E6%97%A0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var time = 0;
	var tstatus=0;
	var tastatus=0;
    /*document.querySelector==$*/
console.log("################start################");
setTimeout(function(){document.querySelector("div[class^='showdanmu-']").click();console.log("###Douyu###");},7000);
setTimeout(function(){document.querySelector("div[class='layout-Player-videoAbove']").hidden=true;console.log("###Douyu###");},7000);
setTimeout(function(){document.querySelector("div[class^='bg-']").hidden=true;console.log("###Douyu###");},7000);
setTimeout(function(){
tstatus=document.querySelector("div[class='ShieldTool-enter']").firstChild.className.indexOf("is-checked");
tastatus=document.querySelector("div[class='ShieldTool-enter']").firstChild.className.indexOf("is-allChecked");
if (tstatus<0 && tastatus<0){
/*$("span[class^='shie-input']").children(".shie-checkbox-icon").click();*/
console.log("enter t");
document.querySelector("h5[class^='ShieldTool-check']").click();
//$('.PlayerCaseSub-Main').hide();
//$(".layout-Player-aside").hidden=1;

//$(".layout-Bottom").hidden=1;
};
if (tastatus>0 && tstatus<0){
/*$("span[class^='shie-input']").children(".shie-checkbox-icon").click();*/
console.log("enter ta");
document.querySelector("h5[class^='ShieldTool-check']").click();
setTimeout(function(){document.querySelector("h5[class^='ShieldTool-check']").click();},2000);
//$('.PlayerCaseSub-Main').hide();
//$(".layout-Player-aside").hidden=1;

//$(".layout-Bottom").hidden=1;
};

},5000);


    ////////////////Disable Chat Form///////////
    /*
setTimeout(function(){
//document.querySelector("div[class='layout-Player-aside']").style.visibility="hidden";
document.querySelector("div[class='layout-Player-aside']").style.display="none";
document.querySelector("div[class='layout-Bottom']").style.display="none";
document.querySelector("div[class='LotteryContainer']").style.display="none";
//LotteryContainer
},5000);*/

})();

