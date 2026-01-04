// ==UserScript==
// @name         Rotten Tomatoes YT Trailer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Button to open Rotten Tomatoes trailers in YT 
// @author       You
// @match        https://www.rottentomatoes.com/m/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451656/Rotten%20Tomatoes%20YT%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/451656/Rotten%20Tomatoes%20YT%20Trailer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let titleElement = document.getElementsByClassName('scoreboard__title')[0]
    let movieTitle = titleElement.innerHTML
    titleElement.innerHTML += `
         <img
            height="35"
            style="padding: 0px 20px 8px"
            onclick='window.open("https://www.youtube.com/results?search_query=${movieTitle}", "_blank")'
            src="https://cdn.cdnlogo.com/logos/y/57/youtube-icon.svg">
         </img>
    `
})();