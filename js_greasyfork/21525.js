// ==UserScript==
// @name	bing year search
// @description	changes default search entry to one year ago
// @author jccalhoun
// @version	0.2.02
// @license GNU General Public License version 3 or any later version; https://www.gnu.org/licenses/gpl-3.0.html
// @include	http://www.bing.com/*
// @include	https://www.bing.com/*

// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant       none
// @namespace https://greasyfork.org/users/9631
// @downloadURL https://update.greasyfork.org/scripts/21525/bing%20year%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/21525/bing%20year%20search.meta.js
// ==/UserScript==


var now = new Date();
var todaysDate = Math.floor(now/8.64e7);
//bing determines date by counting days since the Unix epoch began. this converts the date function to that number
var lastYearDate = todaysDate - 365;
var yearNode = document.createElement('a');
var text = document.createTextNode("Past year");
yearNode.setAttribute("id", "yearSearch");
yearNode.setAttribute("class", "b_toggle");
//sets this class so it has the same styling as the other entries in the dropdown
var searchTerm = window.location.search.match(/(?:\?|&)q=([^&]*)/)[1];
var yearUrl = '/search?q=' + searchTerm + '&filters=ex1%3a%22ez5_' + lastYearDate + '_' + todaysDate + '%22';
yearNode.setAttribute('href', yearUrl);
yearNode.appendChild(text);
document.getElementsByClassName("ftrD")[0].appendChild(yearNode);
