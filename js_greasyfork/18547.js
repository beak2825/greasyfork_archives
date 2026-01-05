// ==UserScript==
// @name         [MTurk Worker] No HIT Reloader
// @namespace    https://github.com/Kadauchi
// @version      2.1.1
// @description  Reloads pages automatically if no HIT is loaded for provided Group Ids
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/*
// @grant        GM_getTab
// @grant        GM_saveTab
// @downloadURL https://update.greasyfork.org/scripts/18547/%5BMTurk%20Worker%5D%20No%20HIT%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/18547/%5BMTurk%20Worker%5D%20No%20HIT%20Reloader.meta.js
// ==/UserScript==

(function () {
    GM_getTab((tab) => {
        const gid = location.href.match(/projects\/([A-Z0-9]+)/) ? location.href.match(/projects\/([A-Z0-9]+)/)[1] : null;
        const gids = localStorage.NHR_gids ? JSON.parse(localStorage.NHR_gids) : {};

        let timeout = null;

        const reloader = () => {
            if (!gid && gids[tab.gid]) {
                timeout = setTimeout(() => {
                    window.location.replace(`https://worker.mturk.com/projects/${tab.gid}/tasks/accept_random`);
                }, 500);
            }
            else {
                clearTimeout(timeout);
            }
        };

        if (location.href.indexOf(`https://worker.mturk.com/projects`) !== -1) {
            if (gid) {
                tab.gid = gid;
            }
            else {
                reloader();
            }

            if (tab.gid) {
                const button = document.createElement(`button`);
                button.title = `Auto Reload ${tab.gid} If No HIT?`;
                button.className = `m-l-sm fa fa-refresh btn ${gids[tab.gid] ? `btn-success` : `btn-default`}`;
                button.addEventListener(`click`, (event) => {
                    button.classList.toggle(`btn-success`);
                    button.classList.toggle(`btn-default`);

                    gids[tab.gid] = button.classList.contains(`btn-success`);
                    localStorage.NHR_gids = JSON.stringify(gids);

                    reloader();
                });

                document.getElementsByClassName(`navbar-content`)[0].appendChild(button);
            }
        }
        else {
            tab.gid = undefined;
        }

        GM_saveTab(tab);
    });
})();
