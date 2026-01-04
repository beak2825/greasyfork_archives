// ==UserScript==
// @name         Udemy Course Creation Date
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  trying to make the world a better place!
// @author       scriptbug - Facu
// @license      MIT
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316

// @downloadURL https://update.greasyfork.org/scripts/468000/Udemy%20Course%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/468000/Udemy%20Course%20Creation%20Date.meta.js
// ==/UserScript==
var $ = window.$;
var x = document.body.getAttribute("data-clp-course-id");
//var button = document.createElement("Button");
//$(button).attr("id","SomeID");
//button.innerHTML = x;
//button.style = "top:0;left:0;position:fixed;z-index:99999;padding:20px;";
 $.get("https://www.udemy.com/api-2.0/courses/"+x+"/?fields[course]=created", function(data, status){
     var date = data.created;
     var d = new Date(date);
     var forD = d.getMonth()+"/"+d.getFullYear();
     waitForKeyElements (".clp-lead__element-meta", elemento);
     function elemento (jNode) {
         $(".clp-lead__element-meta").append('<div class="clp-lead__element-item hecho"><span>Fecha de creación: ' + forD + '</span></div>');
     }
  });

$(document).ready(function() {});
//document.body.appendChild(button);
