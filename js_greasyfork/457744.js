// ==UserScript==
// @name         Redirect Google Videos searches to Youtube
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  Redirects Google Videos search queries to the equivalent Youtube search
// @author       Jonathan Woolf
// @match        *://www.google.com/search*tbm=vid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457744/Redirect%20Google%20Videos%20searches%20to%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/457744/Redirect%20Google%20Videos%20searches%20to%20Youtube.meta.js
// ==/UserScript==

// Get the search query from the Google Videos URL
const query = new URLSearchParams(window.location.search).get("q");

// Redirect to the equivalent Youtube search
window.location.replace(`https://www.youtube.com/results?search_query=${query}`);