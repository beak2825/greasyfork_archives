// ==UserScript==
// @name            Hypothesis
// @namespace   https://www.evernote.com/
// @version          5- Inject On All Pages
// @author           Blank man
// @description   Adds hypothesis to evernote
// @match           https://evernote.com/*
// @match           https://evernote.com/
// @match           https://evernote.com*
// @match           https://evernote.com
// @match           https://www.evernote.com/*
// @match           https://www.evernote.com/
// @match           https://www.evernote.com*
// @match           https://www.evernote.com
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/419467/Hypothesis.user.js
// @updateURL https://update.greasyfork.org/scripts/419467/Hypothesis.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    callFunctionFromScript();
}
script.src = 'https://hypothes.is/embed.js';
head.appendChild(script);
