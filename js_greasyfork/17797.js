// ==UserScript==
// @name CAPSMADNESS
// @description Makes all text in chat captalised
// @include http://www.kongregate.com/games/*/*

// @version 0.0.1.20160322214300
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17797/CAPSMADNESS.user.js
// @updateURL https://update.greasyfork.org/scripts/17797/CAPSMADNESS.meta.js
// ==/UserScript==

var a = document.createElement('script');
a.innerHTML = 'ChatDialogue.prototype.displayMessage = function (a, b, c, d){var e = this;this._holodeck.filterIncomingMessage(b, function(i){e.displayUnsanitizedMessage(a,i.toUpperCase(),c,d)})}';
document.body.appendChild(a);