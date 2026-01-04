// ==UserScript==
// @name         thread beautifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove threads from forums
// @author       You
// @match        https://www.lordswm.com/forum.php
// @icon         https://www.google.com/s2/favicons?domain=lordswm.com
// @grant        none
// @include      https://www.lordswm.com/forum_thread.php*
// @downloadURL https://update.greasyfork.org/scripts/431493/thread%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/431493/thread%20beautifier.meta.js
// ==/UserScript==

'use strict';

const remove_thread = (thread_id) => {
    const thread = document.querySelector(`a[href="forum_messages.php?tid=${thread_id}"]`);
    if (thread) {
        thread.innerHTML = 'REDACTED';
        thread.style.textDecoration = 'line-through';
        thread.onclick = () => false;

        const last_page = document.querySelector(`a[href="forum_messages.php?tid=${thread_id}&page=last"]`);
        last_page.onclick = () => false;
    }
}

const violatorsThread = 2849993;

(function() {
    remove_thread(violatorsThread);
})();