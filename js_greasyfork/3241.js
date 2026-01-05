// ==UserScript==
// @name        steam phishing prevention removal
// @namespace   https://greasyfork.org/users/2226-adam
// @include     https://steamcommunity.com/linkfilter/?url=*
// @version     0.1
// @grant       none
// @description steam wants to save me from phishing. Thanks but I got this.
// @downloadURL https://update.greasyfork.org/scripts/3241/steam%20phishing%20prevention%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/3241/steam%20phishing%20prevention%20removal.meta.js
// ==/UserScript==
window.location = String(window.location).substring(43);