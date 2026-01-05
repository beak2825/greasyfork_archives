// ==UserScript==
// @name        Remove Feedburner Link Information
// @namespace   http://userscripts.org/users/Scuzzball
// @include     *
// @version     1.0
// @description Removes tracking info from feedburner links
// @downloadURL https://update.greasyfork.org/scripts/2019/Remove%20Feedburner%20Link%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/2019/Remove%20Feedburner%20Link%20Information.meta.js
// ==/UserScript==

if(window.location.search.match(/utm_source=feedburner/))
{
    window.location.search = '';
}