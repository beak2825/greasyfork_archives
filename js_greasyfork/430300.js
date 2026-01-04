// ==UserScript==
// @name        Close AWS VPN tabs
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:35001/
// @grant window.close
// @version     1.0
// @author      -
// @description 2021-08-03, 9:46:00 a.m.
// @downloadURL https://update.greasyfork.org/scripts/430300/Close%20AWS%20VPN%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/430300/Close%20AWS%20VPN%20tabs.meta.js
// ==/UserScript==
setTimeout(function() { window.close(); }, 2000);