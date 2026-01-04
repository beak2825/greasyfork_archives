// ==UserScript==
// @name         Youtube Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Gram Parsons
// @include		  http://tagpro-*.koalabeast.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374690/Youtube%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/374690/Youtube%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

console.clear();


    $( document ).ready(function() {
 //console.clear();
var myList = document.querySelector('#site-nav ul');
console.log(myList);
var Youtube = document.createElement('li');
Youtube.id  = "Youtube";
Youtube.class;
 //var a = document.createElement('a');
       // a.href = "http://www.youtube.com";
      //  a.textContent = "Youtube";
        //Youtube.appendChild(a);
        var box = document.createElement('input');
        box.style.fontColour = 'black';
        box.type ='text';
        box.placeholder = 'Youtube';
        box.style.color = 'black';
//        box.style.backgroundColor = 'black';




        Youtube.appendChild(box);
myList.appendChild(Youtube);


        console.log(myList);
        box.addEventListener("keyup", function(event) {
            console.log(event.keyCode);
            console.log(box.value);
  if (event.keyCode === 13) {
    // Trigger the button element with a click
//window.open('https://www.youtube.com/results?search_query=TAGPROTAMPERMONKEY'+box.value, '_blank');

window.open(window.location.href);
window.location.href = 'https://www.youtube.com/results?search_query=TAGPROTAMPERMONKEY'+box.value;

      
  }
   })




});

})();