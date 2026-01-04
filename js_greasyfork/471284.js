// ==UserScript==
// @name         ktuvit!!
// @namespace     https://www.ktuvit.me/
// @version      1.0 - 20.7.23
// @description  adding photos on ktuvit
// @author       iSolt
// @match        *https://www.ktuvit.me/BrowseSeries.aspx*
// @match        *https://www.ktuvit.me/BrowseFilms.aspx*
// @match        https://www.ktuvit.me/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471284/ktuvit%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/471284/ktuvit%21%21.meta.js
// ==/UserScript==



document.body.innerHTML = document.body.innerHTML.replaceAll('<!--', '');

document.body.innerHTML = document.body.innerHTML.replaceAll('--&gt;', '');