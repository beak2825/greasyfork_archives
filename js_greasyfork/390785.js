// ==UserScript==
// @name Reorder pizza-online list
// @namespace Violentmonkey Scripts
// @match https://pizza-online.fi/*
// @grant none
// @version 1.0.0
// @description Reorders pizza-online.fi vendor list by descending score
// @downloadURL https://update.greasyfork.org/scripts/390785/Reorder%20pizza-online%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/390785/Reorder%20pizza-online%20list.meta.js
// ==/UserScript==

var list    = document .querySelector ("ul.vendor-list");
var listItems = document.querySelectorAll("ul.vendor-list > li");
var listItemsArr = [].slice.call(listItems).sort(
  function(a, b) { 
    var aRating = a.querySelector("span.rating > strong");
    var bRating = b.querySelector("span.rating > strong");
    if (aRating === null)
      return 1;
    if (bRating === null)
      return -1;
    return aRating.textContent < bRating.textContent ? 1 : -1; 
  }
);
listItemsArr.forEach(
  function(li) {
    list.appendChild(li);
  }
);