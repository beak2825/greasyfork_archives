// ==UserScript==
// @name         North-Plus MarkRead
// @namespace    https://github.com/sssssssl
// @version      0.1
// @description  Mark read thread.
// @author       sl
// @match        https://*.white-plus.net/thread.php?fid-*
// @match        https://*.south-plus.net/thread.php?fid-*
// @match        https://*.imoutolove.me/thread.php?fid-*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/370833/North-Plus%20MarkRead.user.js
// @updateURL https://update.greasyfork.org/scripts/370833/North-Plus%20MarkRead.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLS_THREAD = '.tr3.t_one';
    const TD_ID_PAT = /td_(\d+)/;
    const KEY_VISITED_TD = 'visited_id';
    const CLS_UNREAD = 'np-unread';

    const NP_UNREAD_STYLE = `
    <style>
    .np-unread {
        font-weight : bold;
    }
    </style>`;

    let threads = document.querySelectorAll(CLS_THREAD);

    let visitedThreads = GM_getValue(KEY_VISITED_TD);
    if(!visitedThreads) {
        visitedThreads = [];
    }

    document.head.insertAdjacentHTML('beforeend', NP_UNREAD_STYLE);

    threads.forEach((elem) => {
        let _td = elem.querySelector('td[id]');
        if(_td) {
            let m = TD_ID_PAT.exec(_td.id);
            if(m) {
                let id = parseInt(m[1]);
                if(visitedThreads.indexOf(id) == -1) {
                    let title = _td.querySelector('h3 a');
                    title.classList.add(CLS_UNREAD);

                    _td.onclick = () => {
                        let idx = visitedThreads.indexOf(id);
                        if(idx == -1) {
                            visitedThreads.push(id);
                            GM_setValue(KEY_VISITED_TD, visitedThreads);
                            console.log(`${id} clicked.`);
                        }
                    };
                }
            }
        }
    });

    // Your code here...
})();