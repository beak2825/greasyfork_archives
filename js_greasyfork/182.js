// ==UserScript==
// @name        flightradar24.com No Timeout
// @namespace   https://greasyfork.org/users/58/flightradar24notimeout
// @description Stops flightradar24.com disabling your session after 30 mins
// @include     http://www.flightradar24.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/182/flightradar24com%20No%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/182/flightradar24com%20No%20Timeout.meta.js
// ==/UserScript==
clearTimeout(idleTimeout);