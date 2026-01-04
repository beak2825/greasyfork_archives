// ==UserScript==
// @name         Add Title to Video from the anime name
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Just add Some title on hover to see the full name of the anime
// @author       Root Android And Ethical Hacker
// @match        https://www2.kickassanime.ro/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kickassanime.ro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457995/Add%20Title%20to%20Video%20from%20the%20anime%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/457995/Add%20Title%20to%20Video%20from%20the%20anime%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.video-item-title').hover(function(){
        $(this).prop("title",$(this).text())
    })
})();