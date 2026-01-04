// ==UserScript==
// @name         Dueling Nexus New Editor
// @namespace    https://duelingnexus.com/
// @version      0.2
// @description  Adding perspective view to Nexus.
// @author       Yasuo Tornado
// @include      https://duelingnexus.com/editor/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422977/Dueling%20Nexus%20New%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/422977/Dueling%20Nexus%20New%20Editor.meta.js
// ==/UserScript==

if (window.top !== window.self)       // Don’t run in frames.
    return;

var currentURL = location.href;


if (currentURL.match("editor/")) {
    location.href = location.href.replace("duelingnexus", "ptr.duelingnexus");
};