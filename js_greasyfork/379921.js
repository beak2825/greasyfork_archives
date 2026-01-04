// ==UserScript==
// @name         Piazza "You're graduating" auto-ignore
// @description  Automatically navigates to the "Not right now" link when Piazza asks for your personal email.
// @version      1.01
// @author       Kevin Wolfe
// @grant        none
// @match        https://piazza.com/graduation_modal
// @namespace https://greasyfork.org/users/267894
// @downloadURL https://update.greasyfork.org/scripts/379921/Piazza%20%22You%27re%20graduating%22%20auto-ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/379921/Piazza%20%22You%27re%20graduating%22%20auto-ignore.meta.js
// ==/UserScript==

location.assign("https://piazza.com/graduation_modal?later=1");