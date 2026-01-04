// ==UserScript==
// @name         88kanqiu
// @namespace    http://88kanqiu.fun/
// @version      0.3
// @description  88kanqiu remove ads
// @description:zh-cn hai
// @author       jclhr
// @match        http://www.88kanqiu.tv/*
// @match        https://ddys.tv/*
// @icon         https://greasyfork.org/vite/assets/blacklogo96.e0c2c761.png
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/454356/88kanqiu.user.js
// @updateURL https://update.greasyfork.org/scripts/454356/88kanqiu.meta.js
// ==/UserScript==

(() => {
    "use strict";
    //var k=document.getElementsByClassName("sitead");
    document.getElementById("afc_sidebar_2842").remove();
    var k=document.getElementById("sidebar-wechat");
    console.log('get'+k.applets);
    console.log('**********************');
    document.getElementById("sidebar-wechat").remove();
    try{
        document.querySelector('.sitead').remove;
    }
    catch(err){
        let txt="本页有一个错误。\n\n";
		txt+="错误描述：" + err.message + "\n\n";
		txt+="点击确定继续。\n\n";
		alert(txt);
		console.log(txt);
    }


})();
