// ==UserScript==
// @name         BKH Udemy Get ID, Creation Date, Image
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  trying to make the world a better place!
// @author       BKH
// @license      MIT
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316

// @downloadURL https://update.greasyfork.org/scripts/470043/BKH%20Udemy%20Get%20ID%2C%20Creation%20Date%2C%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/470043/BKH%20Udemy%20Get%20ID%2C%20Creation%20Date%2C%20Image.meta.js
// ==/UserScript==
var $ = window.$;
var x = document.body.getAttribute("data-clp-course-id");
//var button = document.createElement("Button");
//$(button).attr("id","SomeID");
//button.innerHTML = x;
//button.style = "top:0;left:0;position:fixed;z-index:99999;padding:20px;";
 $.get("https://www.udemy.com/api-2.0/courses/"+x+"/?fields[course]=created,image_750x422", function(data, status){
     var id = data.id;
     var img = data.image_750x422;
     var date = data.created;
     var d = new Date(date);
     var day = d.getDate();
     var month = d.getMonth() + 1;
     var year = d.getFullYear();
     day = day.toString().padStart(2, '0');
     month = month.toString().padStart(2, '0');
     var forD = day+"/"+month+"/"+year;
     waitForKeyElements (".clp-lead__element-meta", elemento);
     function elemento (jNode) {
         $(".clp-lead__element-meta").append('<div class="clp-lead__element-item hecho" style="display: flex; flex-direction: column; gap: 12px"><div style="padding:8px;color:aqua;border: 1px solid aqua;border-radius:8px">ID: ' + id + '</div><div style="padding:8px;color:aqua;border: 1px solid aqua;border-radius:8px">Ngày tạo: ' + forD + '</div><div style="padding:8px;color:aqua;border: 1px solid aqua;border-radius:8px">Link ảnh: <a href="'+ img +'" target="_blank" style="color: aqua">Download ảnh</a>' + '</div></div>');
     }
  });

$(document).ready(function() {});
//document.body.appendChild(button);
