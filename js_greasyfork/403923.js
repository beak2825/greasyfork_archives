// ==UserScript==
// @name         twitter已关注隐藏 旧UI
// @description  twitter正在关注列表只显示未关注 旧UI
// @version      1.0
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include       https://twitter.com/*/following
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403923/twitter%E5%B7%B2%E5%85%B3%E6%B3%A8%E9%9A%90%E8%97%8F%20%E6%97%A7UI.user.js
// @updateURL https://update.greasyfork.org/scripts/403923/twitter%E5%B7%B2%E5%85%B3%E6%B3%A8%E9%9A%90%E8%97%8F%20%E6%97%A7UI.meta.js
// ==/UserScript==
var ziji = GM_getValue("ziji","在这里输入自己的推特名");
GM_setValue("ziji", ziji);
if (location.href.split(".com/")[1].indexOf(ziji)>-1){return}
function gl() {
        var topics = document.getElementsByTagName('span');
        for (var i = 0; i < topics.length; i++) {
           var a = topics[i];
            if (a.textContent.indexOf("正在关注")>-1 || a.textContent.indexOf("已屏蔽")>-1 ){
           if (a.parentElement.parentElement.parentElement.parentElement.getAttribute("class")=="UserActions   UserActions--small u-textLeft"){
           var oValue = getComputedStyle(a.parentElement,null).display;
            if (oValue=="block"){
                   // console.log('移除      ' + a);
            a.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        }}}}
}
gl;
setInterval(gl, 1500);
