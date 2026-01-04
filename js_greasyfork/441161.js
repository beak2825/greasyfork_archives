// ==UserScript==
// @name         Bypass DT safety tunnel
// @namespace    stonerteam
// @version      0.1
// @description  Remove donutteam saftey tunnel
// @author       The StonerTeam
// @include      http*://tunnel.donutteam.com*
// @icon         https://stoner.team/favicon.png
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/441161/Bypass%20DT%20safety%20tunnel.user.js
// @updateURL https://update.greasyfork.org/scripts/441161/Bypass%20DT%20safety%20tunnel.meta.js
// ==/UserScript==

// Get tunnels paremeters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Get and decode URI
const url = urlParams.get('url');
const decodedUrl = decodeURI(url);

//Redirect
window.location.replace(decodedUrl);