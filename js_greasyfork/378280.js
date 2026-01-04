// ==UserScript==
// @name         Pin Highlight Query
// @author       Tehapollo
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378280/Pin%20Highlight%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/378280/Pin%20Highlight%20Query.meta.js
// ==/UserScript==

$(document).ready(function(){
 var startscan = setInterval(function(){ highlight(); }, 250);

    function highlight(){

 var Topic = document.getElementsByClassName('col-sm-8 col-sm-offset-NaN')[0].querySelector('h3').innerText;
 var Result = document.querySelectorAll("div._su._st._sv._sl._5k._sn._sr._nl._nm._nn._no")[0].innerHTML;
 var replace = Topic.replace("The Query:",'');
 var trim = replace.trim();
 var words = trim.split(" ");
 const product = Result
 const regexp = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
 const html = product.replace(regexp, '<span class="highlight" style="background-color:lightgreen">$&</span>');
document.querySelectorAll("div._su._st._sv._sl._5k._sn._sr._nl._nm._nn._no")[0].innerHTML= html
clearInterval(startscan);

   
 }
     $(document).keypress(function(event){

         var startscan = setInterval(function(){ highlight(); }, 250);
         });

})();