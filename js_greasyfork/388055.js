// ==UserScript==
// @name         [DEAD] Redirect Google Search Requests to DuckDuckGo (Incognito only)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  (This script is not working anymore, the incognito-check in chrome was patched by google) Redirect Google to DuckDuckGo..., but only if you are using incognito
// @author       TheBone_
// @match      https://*.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388055/%5BDEAD%5D%20Redirect%20Google%20Search%20Requests%20to%20DuckDuckGo%20%28Incognito%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388055/%5BDEAD%5D%20Redirect%20Google%20Search%20Requests%20to%20DuckDuckGo%20%28Incognito%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
  isPrivateMode().then(function (isPrivate) {
      if(isPrivate){
          var string = window.location.href;
          string = string.replace("google.com/search", "duckduckgo.com/");
          window.location.href=string;
      }
});

    // uncomment if you are transpiling with Babel + Webpack
// const { window, document } = global;

/**
 * Lightweight script to detect whether the browser is running in Private mode.
 * @returns {Promise}
 *
 * Live demo:
 * @see http://live.datatables.net/piduzelo/1
 *
 * This snippet uses ES2015 syntax. If you want to run it in old browsers, transpile it with Babel:
 * @see https://babeljs.io/repl
 *
 * This snippet uses Promises. If you want to run it in old browsers, polyfill it:
 * @see https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js
 *
 * More Promise Polyfills:
 * @see https://ourcodeworld.com/articles/read/316/top-5-best-javascript-promises-polyfills
 */
function isPrivateMode() {
  return new Promise((resolve) => {
    const yes = () => resolve(true); // is in private mode
    const not = () => resolve(false); // not in private mode
    const testLocalStorage = () => {
      try {
        if (localStorage.length) not();
        else {
          localStorage.x = 1;
          localStorage.removeItem('x');
          not();
        }
      } catch (e) {
        // Safari only enables cookie in private mode
        // if cookie is disabled, then all client side storage is disabled
        // if all client side storage is disabled, then there is no point
        // in using private mode
        navigator.cookieEnabled ? yes() : not();
      }
    };
    // Chrome & Opera
    var fs = window.webkitRequestFileSystem || window.RequestFileSystem;
    if (fs) {
      return void fs(window.TEMPORARY, 100, not, yes);
    }
    // Firefox
    if ('MozAppearance' in document.documentElement.style) {
      if (indexedDB === null) return yes();
      const db = indexedDB.open('test');
      db.onerror = yes;
      db.onsuccess = not;
      return void 0;
    }
    // Safari
    const isSafari = navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/);
    if (isSafari) {
      const version = parseInt(isSafari[1], 10);
      if (version < 11) return testLocalStorage();
      try {
        window.openDatabase(null, null, null, null);
        return not();
      } catch (_) {
        return yes();
      }
    }
    // IE10+ & Edge InPrivate
    if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
      return yes();
    }
    // default navigation mode
    return not();
  });
}
})();