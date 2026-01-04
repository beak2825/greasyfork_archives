// ==UserScript==
// @name        Redirect New Reddit
// @namespace   RedirectNewReddit
// @match       *://www.reddit.com/*
// @grant       none
// @license MIT
// @version     1.0
// @author      Feivian4
// @description Redirect to new reddit layout
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/488680/Redirect%20New%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/488680/Redirect%20New%20Reddit.meta.js
// ==/UserScript==

(function() {
    window.location.replace(window.location.href.replace('www.reddit.com', 'new.reddit.com'));
})();