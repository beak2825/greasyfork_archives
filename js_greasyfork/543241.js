// ==UserScript==
// @name         Trim email input everywhere
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  trim email inputs because Firefox fails to do so
// @author       JLuc
// @match        *://*/*
// @grant        none
// @license      GPL
// @browser      Firefox
// @issue        https://bugzilla.mozilla.org/show_bug.cgi?id=1670462
// @downloadURL https://update.greasyfork.org/scripts/543241/Trim%20email%20input%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/543241/Trim%20email%20input%20everywhere.meta.js
// ==/UserScript==

function trim_emails() {
    document.addEventListener('blur', function(e) {
        if (e.target.type === 'email') {
            e.target.value = e.target.value.trim();
        }
    }, true);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trim_emails);
} else {
    // DOM déjà chargé
    trim_emails();
}