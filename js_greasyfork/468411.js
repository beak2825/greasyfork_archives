// ==UserScript==
// @name         河农大一键评教
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  教务系统自动评教 需要取消勾选限未提交 Aprdec.top
// @author       AprDec 孟夏十二
// @match        https://jw.henau.edu.cn/frame/homes.html?*
// @icon         https://luchetuchuang.oss-cn-beijing.aliyuncs.com/img/68b46296de747aa1d3691471c6b0e99.jpg
// @grant        GM_addStyle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468411/%E6%B2%B3%E5%86%9C%E5%A4%A7%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468411/%E6%B2%B3%E5%86%9C%E5%A4%A7%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

var toupiao = function() {

var topWin = document.getElementById("dialog-frame").contentWindow;
topWin.document.querySelector("#wdt_0_0_1").checked = true
topWin.document.querySelector("#wdt_0_1_1").checked = true
topWin.document.querySelector("#wdt_0_2_1").checked = true
topWin.document.querySelector("#wdt_1_0_1").checked = true
topWin.document.querySelector("#wdt_1_1_1").checked = true
topWin.document.querySelector("#wdt_1_2_1").checked = true
topWin.document.querySelector("#wdt_2_0_1").checked = true
topWin.document.querySelector("#wdt_2_1_1").checked = true
topWin.document.querySelector("#wdt_2_2_1").checked = true
topWin.document.querySelector("#wdt_2_3_1").checked = true
topWin.document.querySelector("#wdt_2_4_1").checked = true
topWin.document.querySelector("#wdt_2_5_1").checked = true
topWin.document.querySelector("#wdt_3_0_1").checked = true
topWin.document.querySelector("#wdt_3_1_1").checked = true
topWin.document.querySelector("#wdt_3_2_1").checked = true
topWin.alert = function(){return true};
topWin.confirm = function(){return true};
 if(topWin.document.querySelector("#butSave")){
     topWin.document.querySelector("#butSave").click()
 }else{
    topWin.document.querySelector("input.button").click()}


}

function clickNextElementAndToupiao(elements, index = 0) {
    if (index < elements.length) {
        var currentElement = elements[index];
        var aElement = currentElement.querySelector('a');
           aElement.click();
        if (aElement) {
            setTimeout(function(){
                toupiao();
            },5000)
            setTimeout(function() {
                    var tbodyElement = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('tbody');
    var trElements = Array.from(tbodyElement.querySelectorAll('tr'));
                clickNextElementAndToupiao(trElements, index + 1);
            }, 6000);
        } else {
            clickNextElementAndToupiao(elements, index + 1);
        }
    }
}
let div = document.createElement("div");
div.innerHTML = " <a style='text-decoration: none; color: green;' href='https://www.aprdec.com'>看一下学长博客吧~</a><p style='color: red;'>要取消勾选限未提交</p>"
let btn = document.createElement("button");
btn.innerHTML = "点击投票";
btn.className = 'ontap';
btn.onclick = function() {
    window.confirm = function() {return true}
    var _alert=window.alert;
    window.alert=function(){
        return true;
    }
    var tbodyElement = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('tbody');
    var trElements = Array.from(tbodyElement.querySelectorAll('tr'));
    clickNextElementAndToupiao(trElements);

};
btn.style.border='2px black solid'
btn.style.borderRadius='4px'
btn.style.padding='4px'
btn.style.width='150px'
btn.style.marginBottom='5px'
div.style.position = "absolute";
div.style.zIndex = "1300";
div.style.bottom='50px'
div.appendChild(btn);
document.body.appendChild(div);