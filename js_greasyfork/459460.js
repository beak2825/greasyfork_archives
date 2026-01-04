// ==UserScript==
// @name         Filterlist Pagination Center
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Change the class of the UL element from "ant-table-pagination-right" to "ant-table-pagination-center"
// @author       neOpus
// @match        https://filterlists.com/*
// @icon         https://icons.duckduckgo.com/ip2/filterlists.com.ico
// @license      MIT 
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/459460/Filterlist%20Pagination%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/459460/Filterlist%20Pagination%20Center.meta.js
// ==/UserScript==

window.onload = function() {
  var pagination = document.querySelector("ul.ant-table-pagination-right");
  if (pagination) {
    pagination.classList.remove("ant-table-pagination-right");
    pagination.classList.add("ant-table-pagination-center");
  }
};
