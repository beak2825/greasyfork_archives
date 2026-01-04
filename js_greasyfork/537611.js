// ==UserScript==
// @name         qwen Override window.top Getter
// @description  Overrides window.top to return window itself
// @match        *://*/*
// @run-at       document-start
// @version 0.0.1.20250529080758
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537611/qwen%20Override%20windowtop%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/537611/qwen%20Override%20windowtop%20Getter.meta.js
// ==/UserScript==

(function() {
    Object.defineProperty(window, 'top', {
        get: function() { return window.self; },
        configurable: true
    });
    Object.defineProperty(window, 'frameElement', {
        get: function() { return null; },
        configurable: true
    });
    Object.defineProperty(window.location, 'ancestorOrigins', {
        get: function() { return []; },
        configurable: true
    });
})();