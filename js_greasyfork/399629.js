// ==UserScript==
// @name         crates.io -> lib.rs
// @version      0.1.5
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL  https://github.com/Logarithmus/crates-io-to-lib-rs
// @copyright    2020, Logarithmus (https://github.com/Logarithmus)
// @description  Replace all links to crates.io with ones to lib.rs, as the latter is much faster because it doesn't use tons of JavaScript
// @author       Logarithmus
// @match        *://*/*
// @namespace https://greasyfork.org/users/475664
// @downloadURL https://update.greasyfork.org/scripts/399629/cratesio%20-%3E%20librs.user.js
// @updateURL https://update.greasyfork.org/scripts/399629/cratesio%20-%3E%20librs.meta.js
// ==/UserScript==

(function() {
    if (window.location.hostname === "crates.io") {
        return
    }

    for (let a of document.getElementsByTagName("a")) {
        // Only modify relevant <a> tags to avoid breaking sites
        if (a.hostname === "crates.io"
         && a.pathname.indexOf("/crates/") === 0) {
            a.hostname = "lib.rs"
        }
    }
})();
