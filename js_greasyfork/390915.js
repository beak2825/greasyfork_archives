// ==UserScript==
// @name IPD Check Network Connected
// @version 1.0.0
// @description Checks if 'Network Connected' is 'No' in IPD
// @namespace Violentmonkey Scripts
// @match https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/390915/IPD%20Check%20Network%20Connected.user.js
// @updateURL https://update.greasyfork.org/scripts/390915/IPD%20Check%20Network%20Connected.meta.js
// ==/UserScript==

if (document.getElementsByName("netc")[0].value == "N")
{
  alert("NETWORK CONNECTED IS SET TO 'NO'");
}