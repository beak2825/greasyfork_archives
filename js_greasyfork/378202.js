// ==UserScript==
// @name         获取b站的封面
// @name:en-US   Fetch video covers from Bilibili
// @namespace    https://dobby233liu.github.com/
// @version      0.1.63
// @description  如题
// @description:en-US As of title
// @compatible   firefox Firefox手机版的USI插件尚不支持；可以与 Bilibili Evolved 共存
// @compatible   chrome  可以与 Bilibili Evolved 共存
// @compatible   opera  可以与 Bilibili Evolved 共存
// @compatible   safari  未测试，但可能可以
// @license      WTFPL
// @author       Liu Wenyuan
// @match        *://*.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-body
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @downloadURL https://update.greasyfork.org/scripts/378202/%E8%8E%B7%E5%8F%96b%E7%AB%99%E7%9A%84%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378202/%E8%8E%B7%E5%8F%96b%E7%AB%99%E7%9A%84%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

// var $ = unsafeWindow.jQuery

function getBilibiliEvolvedIsDarkMode(usw){
    var be = usw.bilibiliEvolved;
    return ((typeof be != 'undefined' || be != null) ? be.settings.useDarkStyle : false);
}
var myUrlObject = document.createElement("a");

var mobile = false;
if (unsafeWindow.location.hostname == "m.bilibili.com"){
     mobile = true;
}

function main(){
        var pcFakeAs = ".more-ops-list ul";
        var mobileAppendAfter = ".index__info__src-videoPage-videoInfo-";
        var mobileLinkClass = "index__writer__src-videoPage-videoInfo-";
        var picUrl = "";
        var pcLi = unsafeWindow.document.createElement("li");
        if (mobile) {
            picUrl = unsafeWindow.__INITIAL_STATE__.reduxAsyncConnect.videoInfo.pic
        } else {
            picUrl = unsafeWindow.__INITIAL_STATE__.videoData.pic;
        }
        if (mobile) {
            myUrlObject.classList.add(mobileLinkClass);
        }
        if (getBilibiliEvolvedIsDarkMode(unsafeWindow)){
            myUrlObject.style.color = "#eee";
        }
        myUrlObject.innerHTML = "封面";
        myUrlObject.href = picUrl;
        myUrlObject.target = "_blank";
        if (mobile && (typeof unsafeWindow.document.querySelector(mobileAppendAfter) != 'undefined' || unsafeWindow.document.querySelector(mobileAppendAfter) != null)){
            unsafeWindow.document.querySelector(mobileAppendAfter).appendChild(myUrlObject);
        } else if (typeof unsafeWindow.document.querySelector(pcFakeAs) != 'undefined' || unsafeWindow.document.querySelector(pcFakeAs) != null){
            pcLi.appendChild(myUrlObject);
            unsafeWindow.document.querySelector(pcFakeAs).appendChild(pcLi);
        } else {
            main();
        }
}

function AllToPng(){
    'use strict';
    myUrlObject.href = myUrlObject.href + "@100Q.png";
}

function AllToJpg(){
    'use strict';
    myUrlObject.href = myUrlObject.href + "@100Q.jpg";
}

GM_registerMenuCommand("--> PNG", AllToPng, '', '', 'j');
GM_registerMenuCommand("--> JPG", AllToJpg, '', '', 'j');

if (mobile){
    waitForKeyElements(".index__info__src-videoPage-videoInfo-", main, false);
}else{
    waitForKeyElements(".more-ops-list ul", main, false);
}