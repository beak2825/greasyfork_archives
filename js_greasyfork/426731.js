// ==UserScript==
// @name         old.reddit redirect
// @version      1.2f
// @description  Forces reddit.com to redirect to old.reddit.com
// @author       /u/faz712
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://amp.reddit.com/*
// @match        https://new.reddit.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/773999
// @downloadURL https://update.greasyfork.org/scripts/426731/oldreddit%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/426731/oldreddit%20redirect.meta.js
// ==/UserScript==

(function () {
	'use strict';
  location.replace('https://old.reddit.com' + location.pathname);
})();