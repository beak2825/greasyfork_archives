// ==UserScript==
// @name         shorcut for angular debugging
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  alias window.vm(sel) to window.ng.probe(document.querySelector(sel)).context and get meaningfull errors in case something goes wrong
// @author       Juan D. Jara
// @match        https://localhost:4200/*, http://localhost:4200/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375003/shorcut%20for%20angular%20debugging.user.js
// @updateURL https://update.greasyfork.org/scripts/375003/shorcut%20for%20angular%20debugging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.vm = function(sel) {
      if (!window.ng) {
        throw new Error('ng is not available on the window scope. For ng to be available you must use angular in development mode');
      }
      const el = document.querySelector(sel);
      if (!el) {
        throw new Error(`Selector "${sel}" did not match any element`);
      }
      return window.ng.probe(el).context;
    }
})();