// ==UserScript==
// @name       【淘宝商家互助提升人气流量】
// @grant       none
// @version     1.0
// @namespace   淘宝
// @match       https://www.baidu.com/
// @description 点击链接进入
// @downloadURL https://update.greasyfork.org/scripts/414006/%E3%80%90%E6%B7%98%E5%AE%9D%E5%95%86%E5%AE%B6%E4%BA%92%E5%8A%A9%E6%8F%90%E5%8D%87%E4%BA%BA%E6%B0%94%E6%B5%81%E9%87%8F%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/414006/%E3%80%90%E6%B7%98%E5%AE%9D%E5%95%86%E5%AE%B6%E4%BA%92%E5%8A%A9%E6%8F%90%E5%8D%87%E4%BA%BA%E6%B0%94%E6%B5%81%E9%87%8F%E3%80%91.meta.js
// ==/UserScript==
(function() {
    var text="<a href='https://jq.qq.com/?_wv=1027&k=E92X2iqq'>淘宝商家互助请进！</a></p>";
    var texts="<a href='https://jq.qq.com/?_wv=1027&k=E92X2iqq'>淘宝商家互助请进！</a></p>"
    text=text+texts;
    var div=document.createElement("div");
    div.innerHTML=text;

   document.getElementById("lg").appendChild(div).style.fontSize="50px";

})();