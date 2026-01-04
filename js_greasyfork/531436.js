// ==UserScript==
// @name         Redditmedia Redirect
// @description  Redirect redditmedia.com to reddit.com.
// @author       C89sd
// @version      0.5
// @match        https://www.redditmedia.com/*
// @namespace    https://greasyfork.org/users/1376767
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531436/Redditmedia%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/531436/Redditmedia%20Redirect.meta.js
// ==/UserScript==
location.replace(document.URL.replace("www.redditmedia.com","www.reddit.com"));
