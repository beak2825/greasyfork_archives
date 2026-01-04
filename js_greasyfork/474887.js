// ==UserScript==
// @name         Alternativeto.net searchengine links
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.1
// @description  Adds links to search engines on Alternativeto search results page to make it easier to find download links for software
// @author       Alistair1231
// @icon         https://icons.duckduckgo.com/ip2/alternativeto.net.ico
// @grant        none
// @match        https://alternativeto.net/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474887/Alternativetonet%20searchengine%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/474887/Alternativetonet%20searchengine%20links.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/474887-alternativeto-net-searchengine-links
// https://openuserjs.org/scripts/Alistair1231/Alternativeto.net_searchengine_links/
// https://github.com/Alistair1231/my-userscripts/raw/master/alternativeto-searchengine-links.user.js
/*jshint esversion: 6 */
(function () {
    "use strict";
    let parents = document.querySelectorAll("div[data-testid='app-header'] h2");
    parents.forEach(function (parent) {
      let name = parent.querySelector("a").innerHTML;
      parent.parentElement.innerHTML += `&emsp;<a href="https://www.bing.com/search?form=&q=${name}+download"><img width=30px src="https://icons.duckduckgo.com/ip2/bing.com.ico"><br>Bing</img></a>&emsp;
  <a href="https://www.google.com/search?q=${name}+download">&#8287;&#8287;<img width=30px src="https://icons.duckduckgo.com/ip2/www.google.com.ico"><br>Google</img></a>&emsp;
  <a href="https://duckduckgo.com/?t=h_&q=${name}+download"><img width=30px src="https://icons.duckduckgo.com/ip2/duckduckgo.com.ico"><br>DDG</img></a>`;
    });
  })();
  