// ==UserScript==
// @name        内网海康论坛-去水印|增加发布时间
// @namespace   Violentmonkey Scripts
// @match       https://viewbbs.hikvision.com/forum-*-thread-*
// @grant       none
// @version     1.1
// @author      -
// @description 2022/3/1 10:00:47
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441132/%E5%86%85%E7%BD%91%E6%B5%B7%E5%BA%B7%E8%AE%BA%E5%9D%9B-%E5%8E%BB%E6%B0%B4%E5%8D%B0%7C%E5%A2%9E%E5%8A%A0%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/441132/%E5%86%85%E7%BD%91%E6%B5%B7%E5%BA%B7%E8%AE%BA%E5%9D%9B-%E5%8E%BB%E6%B0%B4%E5%8D%B0%7C%E5%A2%9E%E5%8A%A0%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
(function() {
var style = document.createElement("style");
style.type = "text/css";
var text = document.createTextNode(`
.water_bg{
  display:none !important;
}
.title-section, .post-list .post, .thread-quote, .nMplug-bd{
background-image: unset !important;
} 
div[style="background: url(/userimg);position: absolute;width: 100%;height: 100%;"] {
display:none;}
`); 
style.appendChild(text);
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
var org = document.getElementsByClassName('u-add-ft')[0].innerHTML;
document.getElementsByClassName('u-add-ft')[0].innerHTML = document.getElementsByClassName('u-add-ft')[0].getAttribute('title') +" | " + org;
})();