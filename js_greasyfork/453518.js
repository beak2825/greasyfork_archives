// ==UserScript==
// @name         洛谷大吉每一天luogu
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description 让你的洛谷运势每天都是大吉！
// @author       Fcersoka
// @match        https://www.luogu.com.cn*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453518/%E6%B4%9B%E8%B0%B7%E5%A4%A7%E5%90%89%E6%AF%8F%E4%B8%80%E5%A4%A9luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/453518/%E6%B4%9B%E8%B0%B7%E5%A4%A7%E5%90%89%E6%AF%8F%E4%B8%80%E5%A4%A9luogu.meta.js
// ==/UserScript==

$('document').ready(function(){
    var x=document.querySelectorAll(".lg-punch-result");
    var y=document.querySelectorAll(".am-u-sm-6");
    if(x[0].innerHTML=="§ 大凶 §"){
        var sum="<span id='yi' style='font-weight:bold'>宜：</span>出行<br><span style='font-size:10px;color:#7f7f7f'>一路顺风</span></br>";
        sum+="<span id='yi' style='font-weight:bold'>宜：</span>继续完成WA的题<br><span style='font-size:10px;color:#7f7f7f'>下一次就可以AC了</span></br>";
        y[0].innerHTML=sum;
    }
    x[0].innerHTML="§ 大吉 §";
    x[0].style="color:#e74c3c!important";
    y[1].innerHTML="万事皆宜";
    y[1].style="color:rgba(0, 0, 0, .75)!important";
    y[1].style="font-weight:bold";

});