// ==UserScript==
// @name         Bark Engineering
// @namespace    https://greasyfork.org/en/users/27845
// @version      1.3
// @description  NumPad 1-6, 1=Cyberbulling 2=Depression/Cutting/Suicidal thoughts 3=Drug/Alcohol content 4=Sexual content 5=Violence/Threats of Violence 6=None Submits HIT when pressed.
// @author       Pablo
// @include      https://www.mturkcontent.com/*
// @include      https://s3.amazonaws.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/21700/Bark%20Engineering.user.js
// @updateURL https://update.greasyfork.org/scripts/21700/Bark%20Engineering.meta.js
// ==/UserScript==

var autosubmit = true;
window.focus();

window.onkeydown = function (event) {
   if ((event.keyCode === 97)) { // 1 Cyberbullying
       $( "input[value='cyberbullying']" ).click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 98)) { // 2 Depression/Cutting/Suicidal thoughts
       $("input[value='depression']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 99)) { // 3 Drug/Alcohol content
       $("input[value='drugs']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 100)) { // 4 Sexual content
       $("input[value='sex']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 101)) { // 5 Violence/Threats of Violence
       $("input[value='violence']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 102)) { // 6 None
       $("input[value='none']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
// for Cyberbullying Yes/No HIT

   if ((event.keyCode === 49)) { // 1 Cyberbullying
       $( "input[value='cyberbullying']" ).click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
   if ((event.keyCode === 50)) { // 2 No
       $("input[value='none']").click();
       if (autosubmit) {
           $("#submitButton").click();
       }
   }
};