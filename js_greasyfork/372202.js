// ==UserScript==
// @name           WME Privacy Screen
// @description    Removes sensitive/personal information from WME UI for screensharing/streaming purposes
// @namespace      falco_sparverius
// @grant          none
// @version        0.0.3
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @author         falco_sparverius
// @downloadURL https://update.greasyfork.org/scripts/372202/WME%20Privacy%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/372202/WME%20Privacy%20Screen.meta.js
// ==/UserScript==


var sheet = window.document.styleSheets[0];
sheet.addRule(".motivation", "display:none;", 1);
sheet.addRule("#archive-sessions", "display:none;", 1);

