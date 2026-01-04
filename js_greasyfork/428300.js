// ==UserScript==
// @name         txt文本阅读器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  本地txt小说的增强阅读体验
// @author       You
// @match        file:///*/*.htm
// @grant        none
// @license      123123123
// @downloadURL https://update.greasyfork.org/scripts/428300/txt%E6%96%87%E6%9C%AC%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/428300/txt%E6%96%87%E6%9C%AC%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.getElementsByTagName("html")[0].innerText;
var pattern = /第[\S*]{1}章|第[\S*]{2}章|第[\S*]{3}章|第[\S*]{4}章|第[\S*]{5}章|第[\S*]{6}章/g;
var indexs = [];
var result2;
while ((result2 = pattern.exec(a)) != null)  {
    indexs.push(result2.index);
}
var titles = [];
var newa = "";
var lastindex = 0;
for(var i in indexs){
  var title = a.substring(indexs[i],indexs[i]+20);
  title =  title.substring(0,title.lastIndexOf(" "))
  console.log(title)
  var content = a.substring(lastindex,indexs[i]) +"<br><br><a  href='#'  id='"+i+"'>" + title + "</a><br><br>";
  content = content.replaceAll("。","。<br><br>")
  newa = newa  + content;
  lastindex = indexs[i] + title.length;

  titles.push("<a href='#"+i+"'>" + title + "</a>")
}

newa += a.substring(lastindex);
var html = "";
for(var k in titles){
  html += "<p style='padding-left: 10px;'>"+titles[k]+"</p>"
}

document.write("<div id='left' style='position:fixed;width:200px;height:100%;overflow: scroll;background:#eee;display: inline-block;float: left;'>"+html+"</div><div id='right' style='margin-left: 220px;letter-spacing: 2px;font-family: \"Arial\",\"Microsoft YaHei\",\"黑体\",\"宋体\",sans-serif;font-size: 20px;'>"+newa+"</div>")

    // Your code here...
})();