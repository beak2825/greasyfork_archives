// ==UserScript==
// @name     CodinGame No AutoComplete
// @version  0.2
// @grant    none
// @author   Gorbit99
// @include  https://www.codingame.com/ide/*
// @run-at   document-idle
// @namespace http://tampermonkey.net/
// @description Get rid of code completion pop up in coc
// @downloadURL https://update.greasyfork.org/scripts/409247/CodinGame%20No%20AutoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/409247/CodinGame%20No%20AutoComplete.meta.js
// ==/UserScript==
var newScript = document.createElement("script");
newScript.innerHTML = "monaco.languages.registerCompletionItemProvider();";
document.body.appendChild(newScript);