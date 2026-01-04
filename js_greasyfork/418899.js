// ==UserScript==
// @name        Stop DuckDuckGo changing url on clicking
// @namespace   https://wiki.gslin.com/wiki/StopDuckDuckGoChangingUrlOnClicking
// @match       https://duckduckgo.com/*
// @grant       none
// @run-at      document-idle
// @version     0.20201220.0
// @license     MIT
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Stop DuckDuckGo changing url on clicking to add more privacy.
// @downloadURL https://update.greasyfork.org/scripts/418899/Stop%20DuckDuckGo%20changing%20url%20on%20clicking.user.js
// @updateURL https://update.greasyfork.org/scripts/418899/Stop%20DuckDuckGo%20changing%20url%20on%20clicking.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Block replaceState (History API) to avoid DuckDuckGo from changing url:
    // https://developer.mozilla.org/en-US/docs/Web/API/History_API
    window.history.replaceState = function(){};
})();
