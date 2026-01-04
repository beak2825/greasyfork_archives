// ==UserScript==
// @namespace         https://greasyfork.org/users/297963
// @name              GitHub - Find active Forks button
// @author            Celuni
// @description       Adds a button to find active Forks
// @version           1.0.1
// @match             *://github.com/*/*
// @grant             none
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/397171/GitHub%20-%20Find%20active%20Forks%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/397171/GitHub%20-%20Find%20active%20Forks%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        let ulActions = document.querySelectorAll('div.application-main ul.pagehead-actions')[0];
        if (ulActions !== undefined) {
            let findFork = document.location.pathname.substr(1).split('/');
            findFork = 'https://techgaun.github.io/active-forks/index.html#' + findFork[0] + '/' + findFork[1];
            ulActions.innerHTML = ulActions.innerHTML + `
            <li>
                <a href="${findFork}" target="_blank">
                <button class="btn btn-sm btn-with-count" id="findActiveForks">
                    <svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true">
                        <path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/>
                    </svg>
                    Find active Forks
                </button>
                </a>
            </li>`;
        }
    } catch (e) {
        console.log(e);
    }
})();