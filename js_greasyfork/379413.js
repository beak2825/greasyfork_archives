// ==UserScript==
// @name         随意看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Adward
// @match    *://*.iqiyi.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379413/%E9%9A%8F%E6%84%8F%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/379413/%E9%9A%8F%E6%84%8F%E7%9C%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jxWebsize = "https://www.adwardmovie.top/?url=";
    var video_urls = $("div[is='i71-playpage-sdrama-list']").attr(":initialized-data");
    var video_urls_to_json = JSON.parse(video_urls);   // 将数组转为json
    var end_urls = new Array();//解析地址集合
    for(var p in video_urls_to_json){//遍历json数组
        end_urls.push(jxWebsize + video_urls_to_json[p].url);
    }
    function createTable(){
         var table = document.createElement('table');
         var tbody = document.createElement('tbody');
         var count = 0;
         for (var i = 0; i < 4; i++) {
          var tr = document.createElement('tr');
          for (var j = 0; j < end_urls.length / 4; j++) {
           var td = document.createElement('td');
           var a = document.createElement("a");
           var inner = document.createTextNode("第"+(count+1) +"集");
           a.appendChild(inner);
           a.setAttribute("href", end_urls[count]);
           a.setAttribute("target", "_blank");
           a.style.background = "#FFFFFF";
           count++;
           td.appendChild(a);
           tr.appendChild(td);
           console.log(td);
          }
          tbody.appendChild(tr);
         }
         table.appendChild(tbody);
         document.getElementById('block-E').appendChild(table);
         table.setAttribute('border', '1');
    }
    createTable();
    // TODOLIST: 其他主流网站解析
})();
