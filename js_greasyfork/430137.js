// ==UserScript==
// @name         Endless Google Search Enhancer
// @namespace    SearchEnhancer
// @version      11
// @description  Shows up to 100 search results at once on all pages! *Optional= Open (or not) search results on a new tab.
// @author       hacker09
// @include      *://www.google.*
// @include      *://www.google.it/*
// @exclude      /^(https:\/\/www.google\.(com|it)\/)(finance|preferences|maps\?q=.*|flights\?q=.*|.*tbm=isch)(\/.*)?/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/430137/Endless%20Google%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/430137/Endless%20Google%20Search%20Enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (GM_getValue('Amount of results to Show') === undefined) //If the amount of results to show isn't defined
  { //Starts the if condition
    GM_setValue('Amount of results to Show', 100); //Set the default amount of results to show as 100
    GM_setValue('Open in new window?', 0); //Set the script to not open websites on a new tab
  } //Finishes the if condition

  if (location.pathname === '/search' && location.href.match('&num=' + GM_getValue('Amount of results to Show') + '&newwindow=' + GM_getValue('Open in new window?')) === null) //If the current search doesn't have the user choices applied
  { //Starts the if condition
    location.href = location.href += '&num=' + GM_getValue('Amount of results to Show') + '&newwindow=' + GM_getValue('Open in new window?'); //Redirect to add the user choices
  } //Finishes the if condition
})();