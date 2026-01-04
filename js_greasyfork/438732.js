// ==UserScript==
// @name         TestRailHighlight
// @description  Highlights part of title's field value in TestRail
// @version      1.0
// @include      https://*.testrail.io/*
// @namespace    https://greasyfork.org/users/674500
// @downloadURL https://update.greasyfork.org/scripts/438732/TestRailHighlight.user.js
// @updateURL https://update.greasyfork.org/scripts/438732/TestRailHighlight.meta.js
// ==/UserScript==

var inputTitle = document.getElementById('title');
inputTitle.setSelectionRange(0, 4);
inputTitle.focus();