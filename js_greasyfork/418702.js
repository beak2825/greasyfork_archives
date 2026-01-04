// ==UserScript==
// @name         Better GreasyFork Forum
// @namespace    BetterGreasyForkForum
// @version      6
// @description  Automatically show only "All but Script Discussions" on the GreasyFork Forum.
// @author       hacker09
// @match        https://greasyfork.org/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://greasyfork.org/&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418702/Better%20GreasyFork%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/418702/Better%20GreasyFork%20Forum.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("li.forum-link > a").href = '/discussions/no-scripts'; //Make the Default Forum button redirect to another url
})();