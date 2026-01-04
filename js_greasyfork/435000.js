// ==UserScript==
// @name        kill youtube comments and sidebar
// @namespace   kandelabr
// @match       https://*.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description makes youtube comments and sidebar invisible
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/435000/kill%20youtube%20comments%20and%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/435000/kill%20youtube%20comments%20and%20sidebar.meta.js
// ==/UserScript==   */

["comments", "secondary", "related"].forEach(e=>document.getElementById(e).style.visibility='hidden');