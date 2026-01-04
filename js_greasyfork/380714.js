// ==UserScript==
// @name         22Pixx.xyz Ads remove
// @namespace    Notlaxydope
// @version      0.1
// @description  Alter The Url on the GO
// @author       laxydope
// @match        https://22pixx.xyz/x*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380714/22Pixxxyz%20Ads%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/380714/22Pixxxyz%20Ads%20remove.meta.js
// ==/UserScript==

location.pathname = location.pathname.replace(/^\/x-o\//, "/y-o/");