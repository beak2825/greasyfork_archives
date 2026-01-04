// ==UserScript==
// @name         大甲高工國文線上測驗自動作答器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  大甲高工國文線上測驗自動作答
// @author       李季衡
// @match        https://dd437.info/PlatformQUIZ__kdsaf83k8IBdX8o/evaluation_finish.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421237/%E5%A4%A7%E7%94%B2%E9%AB%98%E5%B7%A5%E5%9C%8B%E6%96%87%E7%B7%9A%E4%B8%8A%E6%B8%AC%E9%A9%97%E8%87%AA%E5%8B%95%E4%BD%9C%E7%AD%94%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421237/%E5%A4%A7%E7%94%B2%E9%AB%98%E5%B7%A5%E5%9C%8B%E6%96%87%E7%B7%9A%E4%B8%8A%E6%B8%AC%E9%A9%97%E8%87%AA%E5%8B%95%E4%BD%9C%E7%AD%94%E5%99%A8.meta.js
// ==/UserScript==

(function() {
var html
html = '<div style="height:5%;width:100%;background-color:#F2F2F2;font-size:20px;"><center><input type="button"id="answer80"value="自動作答(80分)"style="width:185px;height:40px;font-size:20px;"><input type="button"id="answer85"value="自動作答(85分)"style="width:185px;height:40px;font-size:20px;"><input type="button"id="answer90"value="自動作答(90分)"style="width:185px;height:40px;font-size:20px;"><input type="button"id="answer95"value="自動作答(95分)"style="width:185px;height:40px;font-size:20px;"><input type="button"id="answer100"value="自動作答（100分）"style="width:185px;height:40px;font-size:20px;"> </center>';
document.body.insertAdjacentHTML('beforeBegin', html);

document.getElementById('answer100').onclick = function(){
var r=document.getElementById("button0");var object=document.getElementsByName('ajexCheckANS');var hehe=document.getElementsByName('ITno');
    var aa='CBBACCBCCCBADBCBBAAC';object[1].click();for(var i in aa){object[1].value=aa[i];hehe[0].value=Number(73601)+Number(i);r.click();}}
document.getElementById('answer95').onclick = function(){
var r=document.getElementById("button0");var object=document.getElementsByName('ajexCheckANS');var hehe=document.getElementsByName('ITno');
    var aa='CBBACCBCCCBADBCBBAAD';object[1].click();for(var i in aa){object[1].value=aa[i];hehe[0].value=Number(73601)+Number(i);r.click();}}
document.getElementById('answer90').onclick = function(){
var r=document.getElementById("button0");var object=document.getElementsByName('ajexCheckANS');var hehe=document.getElementsByName('ITno');
    var aa='CBBACCBCCCBADBCBBABD';object[1].click();for(var i in aa){object[1].value=aa[i];hehe[0].value=Number(73601)+Number(i);r.click();}}
document.getElementById('answer85').onclick = function(){
var r=document.getElementById("button0");var object=document.getElementsByName('ajexCheckANS');var hehe=document.getElementsByName('ITno');
    var aa='CBBACCBCCCBADBCBBBBD';object[1].click();for(var i in aa){object[1].value=aa[i];hehe[0].value=Number(73601)+Number(i);r.click();}}
document.getElementById('answer80').onclick = function(){
var r=document.getElementById("button0");var object=document.getElementsByName('ajexCheckANS');var hehe=document.getElementsByName('ITno');
    var aa='CBBACCBCCCBADBCBABBD';object[1].click();for(var i in aa){object[1].value=aa[i];hehe[0].value=Number(73601)+Number(i);r.click();}}
<!--正確答案:CBBACCBCCCBADBCBBAAC>
})();