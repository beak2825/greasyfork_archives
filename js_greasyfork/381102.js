// ==UserScript==
// @name         Always desktop Wikihow
// @version      1.3
// @description  Redirects wikihow's mobile website to desktop
// @author       Mario O.M.
// @namespace    https://github.com/marioortizmanero
// @match        *://m.wikihow.com/*
// @match        *://m.wikihow.mom/*
// @match        *://m.wikihow.fitness/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381102/Always%20desktop%20Wikihow.user.js
// @updateURL https://update.greasyfork.org/scripts/381102/Always%20desktop%20Wikihow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.href = location.href.replace("m.wikihow", "www.wikihow");
})();