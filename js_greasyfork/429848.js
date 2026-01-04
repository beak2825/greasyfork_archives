// ==UserScript==
// @name Enable custom reacts fb
// @namespace https://www.xda-developers.com
// @version 1.3
// @description Enable custom reacts
// @author Adam Conway
// @match https://www.facebook.com/messages/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/429848/Enable%20custom%20reacts%20fb.user.js
// @updateURL https://update.greasyfork.org/scripts/429848/Enable%20custom%20reacts%20fb.meta.js
// ==/UserScript==

(function() {
'use strict';

const heart = '\u2764';
const clown = '\u{1F921}';

const heartEncoded = encodeURIComponent(heart);

const promptText = `React with:`;


const oldOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function() {
const query = arguments[1];

// Catch heart react specifically
if (query.includes('ADD_REACTION') && query.includes(heartEncoded)) {
// Get replacement reaction
const new_reaction = prompt(promptText, heart);
const encoded = encodeURIComponent(new_reaction);

// Replacing queries
arguments[1] = query.replace(heartEncoded, encoded);
}

// Send
oldOpen.apply(this, arguments);
}
})();