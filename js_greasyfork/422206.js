// ==UserScript==
// @name         Workaround For Youtube Chat Memory Leaks (obsoleted)
// @namespace    https://twitter.com/laversheet
// @version      0.2
// @description  Fix Youtube Live Chat Memory Leaks
// @author       laversheet
// @match        https://www.youtube.com/live_chat*
// @match        https://www.youtube.com/live_chat_replay*
// @run-at       document-end
// @grant        none
// @license      BSD-3-Clause https://opensource.org/licenses/BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/422206/Workaround%20For%20Youtube%20Chat%20Memory%20Leaks%20%28obsoleted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422206/Workaround%20For%20Youtube%20Chat%20Memory%20Leaks%20%28obsoleted%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
     * (2022-11-25)
     * YouTube seems to have fixed the problem already. So this script is no longer needed.
     *
     * (2021-02-23)
     * Currently, youtube live chat has a bug that never execute some scheduled tasks.
     * Those tasks are scheduled for each time a new message is added to the chat and hold the memory until being executed.
     * This script will let the scheduler to execute those tasks so the memory held by those tasks could be freed.
     */

})();
