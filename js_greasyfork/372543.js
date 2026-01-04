// ==UserScript==
// @name         Hide Surviv.io Invite Link.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the surviv.io invite link!
// @author       Superior
// @match        *://surviv.io/*
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372543/Hide%20Survivio%20Invite%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/372543/Hide%20Survivio%20Invite%20Link.meta.js
// ==/UserScript==

jQuery('#team-url').remove()
jQuery('#team-code').remove()
