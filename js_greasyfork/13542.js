// ==UserScript==
// @name	altsearch links
// @description	Adds search on other sites for google, bing, and yahoo
// @version	2020.02.20
// @include	http://www.google.com*
// @include	https://*.google.com*
// @include	http://www.google.com*
// @include	https://www.google.com*
// @include https://duckduckgo.com*
// @include http://duckduckgo.com*
// @include	http://www.wolframalpha.com*
// @include	http://www3.wolframalpha.com*
// @include	http://yandex.ru*
// @include	http://nigma.ru*
// @include	http://www.bing.com*
// @include	https://www.bing.com*
// @include	http://ru.wikipedia.org/w/*
// @include	http://nova.rambler.ru/*
// @include	http://rambler.ru/*
// @include http://scholar.google.com*
// @include http://search.yahoo.com*
// @include https://search.yahoo.com*
// @include http://academic.research.microsoft.com/*
// @grant       none
// @namespace https://greasyfork.org/users/9631
// @downloadURL https://update.greasyfork.org/scripts/13542/altsearch%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/13542/altsearch%20links.meta.js
// ==/UserScript==

//var SEARCH_ON = 'Search on:';
//var POSITION = 'left';



var PLACEHOLDER_SELECTORS = '#resultStats, #b_results, .b-wordstat__text, .searchresults b, #ext_link, #sidebar, .b-global-wrapper, #gs_ab, #left, #zero_click_wrapper, bing-summary, .bing-summary, #bing-summary, #ucs';
var results = document.querySelector(PLACEHOLDER_SELECTORS);
var other = document.createElement('div');

other.setAttribute("id", "altsearch");
other.setAttribute("style", "width: 1000px; font-size: small; margin: 10px 10px 5px 159px;");

if (window.location.href.indexOf("?query=") > -1) {
    query = window.location.href.match(/\?query=[^&]*/gi)[0].substr(7);
  
} else if (window.location.href.indexOf("?q=") > -1) {
  
    query = window.location.href.match(/\?q=[^&]*/gi)[0].substr(3);
  
} else if (window.location.href.indexOf("&q=") > -1 ) {
  
query = window.location.href.match(/\&q=[^&]*/gi)[0].substr(3);

} else {
    query = window.location.href.match(/\?p=[^&]*/gi)[0].substr(3);
}

query = query.replace(/\+filterui%3[^&^+]*/gi,"");
links = "Try this search on " +
    "<a href =\"https://www.google.com/search?q=" + query + "\">Google</a>, " +
    "<a href =\"http://www.bing.com/search?q=" + query + "\">Bing</a>, " +
    "<a href =\"http://search.yahoo.com/search?p=" + query + "\">Yahoo</a>, " +
    "<a href =\"http://www.swagbucks.com/?f=51&t=w&p=1&q=" + query + "\">Swagbucks</a>, " +
    "<a href =\"https://duckduckgo.com/?q=" + query + "\">DuckDuckGo</a>, " +
    "<a href =\"http://www.wolframalpha.com/input/?i=" + query + "\">WolframAlpha</a>, " +
    "<a href =\"http://twitter.com/search?q=" + query + "\">Twitter</a>, " +
    "<a href =\"http://scholar.google.com/scholar?q=" + query + "\">Google Scholar</a>, " +
    "<a href =\"http://academic.research.microsoft.com/Search?query=" + query + "\">MS Academic</a>";
other.innerHTML = links;

if (window.location.host == "www.bing.com") {
console.log("bing baby!");
var bingBottomResults = document.querySelector(".b_pag");
var other2 = other.cloneNode(true);
//bingBottomResults.parentNode.insertBefore(other2, bingBottomResults);
  bingBottomResults.before(other2);
}

//results.parentNode.insertBefore(other, results); //this is old way next line is new way https://gomakethings.com/how-to-insert-an-element-before-another-one-in-the-dom-with-vanilla-javascript/
results.before(other);