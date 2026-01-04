// ==UserScript==
// @name         OldMessenger
// @namespace    http://example.com/temporary_namespace
// @version      0.1
// @description  Remove the blue Facebook bar on new messenger page
// @author       Eric Zhang
// @match        https://www.facebook.com/messages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409683/OldMessenger.user.js
// @updateURL https://update.greasyfork.org/scripts/409683/OldMessenger.meta.js
// ==/UserScript==

var fbBar = document.getElementById('pagelet_bluebar');
if (fbBar) fbBar.parentNode.removeChild(fbBar);

