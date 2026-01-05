// ==UserScript==
// @name         reddit-block
// @namespace    https://github.com/ThePhantomGamer/reddit-block
// @version      0.1
// @description  redirect all reddit.com traffic -> /r/getoffreddit
// @author       ThePhantomGamer
// @match        http://*.reddit.com/*
// @match        https://*.reddit.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/28913/reddit-block.user.js
// @updateURL https://update.greasyfork.org/scripts/28913/reddit-block.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var get_off = 'https://www.reddit.com/r/getoffreddit/';
  if(window.location != get_off){
    window.location = get_off;
  }
})();


