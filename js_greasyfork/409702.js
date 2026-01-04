// ==UserScript==
// @name     CodinGame No Signature Help
// @version  0.1
// @grant    none
// @author   Gorbit99
// @include  https://www.codingame.com/ide/*
// @run-at   document-idle
// @description Stops the signature help popup from appearing
// @namespace https://greasyfork.org/users/681070
// @downloadURL https://update.greasyfork.org/scripts/409702/CodinGame%20No%20Signature%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/409702/CodinGame%20No%20Signature%20Help.meta.js
// ==/UserScript==
var newScript = document.createElement("script");
newScript.innerHTML = "monaco.languages.registerSignatureHelpProvider();";
document.body.appendChild(newScript);