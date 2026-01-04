// ==UserScript==
// @name Basecamp Date Changer
// @namespace Violentmonkey Scripts
// @description Prompts you for a date, then changes all your basecamp to-do's to that day.
// @version     1.0
// @locale United States
// @match https://basecamp.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/393002/Basecamp%20Date%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/393002/Basecamp%20Date%20Changer.meta.js
// ==/UserScript==

//WORKING prompts for each to do

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var day;

window.addEventListener("load", function() {
  if ((day = prompt("What Date Do You Want To Change These To?"))) {
    console.log(day);
    var date = year + "-" + month + "-" + day;
    var count = 0;
    $(".has_balloon").each(function() {
      var taskDueDate = $(this);
      setTimeout(function() {
        $(taskDueDate).mouseover();
        $(taskDueDate).addClass("exclusively_expanded expanded");
        $(taskDueDate)
          .find('input[type="hidden"]')
          .val(date);
        $(taskDueDate)
          .find("a")
          .click();
      }, count * 400);
      count++;
    });
  } else {
    alert("You Pressed Cancel");
  }
});
