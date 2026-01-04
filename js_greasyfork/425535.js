// ==UserScript==
// @name         Udemy Course Creation Date
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  trying to make the world a better place!
// @author       scriptbug
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_addStyle
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425535/Udemy%20Course%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/425535/Udemy%20Course%20Creation%20Date.meta.js
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
     document.querySelector("#udemy > div.main-content-wrapper > div.main-content > div.paid-course-landing-page__container > div.top-container.dark-background > div > div > div:nth-child(4) > div > div.udlite-text-sm.clp-lead > div.clp-lead__element-meta > div:nth-child(1) > div > div > span:nth-child(2)").innerHTML +=" Created Date " + forD;
  });

$(document).ready(function() {});
//document.body.appendChild(button);