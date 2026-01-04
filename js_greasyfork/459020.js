// ==UserScript==
// @name        FileCR Search Fix
// @namespace   lemons
// @license     Unlicense
// @match       *://filecr.com/*
// @icon        https://filecr.com/wp-content/uploads/2018/11/favico.png
// @grant       none
// @version     1.3
// @author      lemons
// @description A simple script to re-add the original Search feature, instead of Google Search.
// @downloadURL https://update.greasyfork.org/scripts/459020/FileCR%20Search%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/459020/FileCR%20Search%20Fix.meta.js
// ==/UserScript==

// overwrite search form with the original parameters
document.querySelector(".header--search").setAttribute("action", "https://filecr.com/")
document.querySelector("#search-input").setAttribute("name", "s")