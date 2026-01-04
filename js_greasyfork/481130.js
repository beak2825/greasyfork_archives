// ==UserScript==
// @name        Ingredient Searcher - cooksmarts.com
// @namespace   Violentmonkey Scripts
// @match       https://mealplans.cooksmarts.com/meal_plans/*
// @grant       none
// @version     1.1.1
// @author      David Spatholt
// @description 11/30/2023, 6:33:32 PM Turns HTML list items into links for searching Kroger or whatever store you use.
// @license     GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/481130/Ingredient%20Searcher%20-%20cooksmartscom.user.js
// @updateURL https://update.greasyfork.org/scripts/481130/Ingredient%20Searcher%20-%20cooksmartscom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const listItems = document.querySelectorAll('ul.recipe__grocery-list li')

  for (const listItem of listItems) {
    const text = listItem.textContent.trim().replace(/\s+/g, ' ').replace(/\(.*?\)/g, '');
    const link = document.createElement('a');
    //change this to the query string for your store of choice, usually everything before the part of the URL that has the thing you searched for
    var search = 'https://www.kroger.com/search?query='
    //change this to the store you use
    var store ='find it at Kroger'
    link.href = `${search}${text}`;
    link.target = '_blank';
    link.textContent = `${store}`;
    listItem.appendChild(link);
  }
})();