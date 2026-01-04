// ==UserScript==
// @name         高亮显示学院最新通知
// @namespace    http://caiyh.xyz/
// @version      0.1.5
// @description  高亮加粗显示材料学院最新通知
// @author       sky
// @match        http://mse.upc.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398337/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%AD%A6%E9%99%A2%E6%9C%80%E6%96%B0%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/398337/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%AD%A6%E9%99%A2%E6%9C%80%E6%96%B0%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

var obj_title = document.getElementsByClassName("news_title");
var obj_meta = document.getElementsByClassName("news_meta");

var day1 = new Date();
day1.setTime(day1.getTime() - 24*60*60*1000);
var s1 = day1.getFullYear() + "-" + (day1.getMonth()+1) + "-" + day1.getDate();
var Date1 = new Date(s1);

for (var i=0; i<47; i++){
    var s2 = document.getElementsByClassName("news_meta").item(i).textContent;
    var Date2 = new Date(s2);
    Date2.setTime(Date2.getTime());
    s2 = Date2.getFullYear() + "-" + (Date2.getMonth()+1) + "-" + Date2.getDate();
    Date2 = new Date(s2);
    if (Date2 >= Date1){
        var aObj = document.getElementsByClassName("news_title")[i].getElementsByTagName('a')[0];
        aObj.style.cssText = 'color: blue; font-weight: bold';
        obj_meta.item(i).style.cssText = 'color: blue; font-weight: bold';
    }
    if (Date2 > Date1){
        var aObj1 = document.getElementsByClassName("news_title")[i].getElementsByTagName('a')[0];
        aObj1.style.cssText = 'color: red; font-weight: bold';
        obj_meta.item(i).style.cssText = 'color: red; font-weight: bold';
    }
}