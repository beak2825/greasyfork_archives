// ==UserScript==
// @name Napoleon & Frank's Push Basecamp Tasks To Next Day
// @namespace Violentmonkey Scripts
// @description Pushing all the to-dos in the list to tomorrow.
// @version     1.3
// @match https://basecamp.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392164/Napoleon%20%20Frank%27s%20Push%20Basecamp%20Tasks%20To%20Next%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/392164/Napoleon%20%20Frank%27s%20Push%20Basecamp%20Tasks%20To%20Next%20Day.meta.js
// ==/UserScript==

//WORKING prompts for each to do

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth();
var day = today.getDate();
var dayOfWeek = today.getDay();

window.addEventListener("load", function() {
  if (confirm("Are you sure you want to push ALL these to-dos to tomorrow?")) {
    if (dayOfWeek == 5) {
      var date = year + "-" + (month + 1) + "-" + (day + 3);
      var count = 0;
      $(".has_balloon").each(function() {
        var taskDueDate = $(this);
        setTimeout(function() {
          $(taskDueDate).mouseover();
          $(taskDueDate).addClass("exclusively_expanded expanded");
          $(taskDueDate)
            .find('input[type="hidden"]')
            .val(date);
          $("taskDueDate")
            .find("a")
            .click();
        }, count * 500);
        count++;
      });
    } else {
      var date = year + "-" + (month + 1) + "-" + (day + 1);
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
        }, count * 500);
        count++;
      });
    }
  } else {
    alert("You Pressed Cancel");
  }
});
