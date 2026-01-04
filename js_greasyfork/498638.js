// ==UserScript==
// @name         B站网页端迷你小窗播放器尺寸修改
// @version      1.0.1
// @license      MIT
// @description  修改网页端的迷你播放器,默认放大2倍
// @author       SingHill
// @match        *://www.bilibili.com/*
// @match        *://www.bilibili.com/video/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/498638/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E8%BF%B7%E4%BD%A0%E5%B0%8F%E7%AA%97%E6%92%AD%E6%94%BE%E5%99%A8%E5%B0%BA%E5%AF%B8%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/498638/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E8%BF%B7%E4%BD%A0%E5%B0%8F%E7%AA%97%E6%92%AD%E6%94%BE%E5%99%A8%E5%B0%BA%E5%AF%B8%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    setTimeout(replacesize(), 1000);
    //setInterval(function(){console.log(document.querySelector('style[data-injector="nano"]'));}, 500);
})();
function replacesize(){
    var 小窗宽 = 640 ; //原本尺寸是320 px, 想要放大2倍就填640 ,高度会自动根据宽度算出来
    var styleElement = document.querySelector('style[data-injector="nano"]');
    var styleContent = styleElement.innerText;
    var modifiedStyleContent = styleContent.replace(/\.bpx-player-container\[data-revision="2"\]\[data-screen=mini\]\{height:\s*180px;width:\s*320px\}/g,'.bpx-player-container[data-revision="2"][data-screen=mini]{height:'+小窗宽*0.635+'px;width:'+小窗宽+'px}').replace(/\.bpx-player-container\[data-revision="2"\]\[data-screen=mini\]\{height:\s*203px;width:\s*360px\}/g,'.bpx-player-container[data-revision="2"][data-screen=mini]{height:'+Math.floor(小窗宽*0.635*1.1278)+'px;width:'+Math.floor(小窗宽*1.1278)+'px}');

    // 将修改后的内容重新赋值给style元素
    styleElement.innerText = modifiedStyleContent;
     console.log("修改小窗完成");
}