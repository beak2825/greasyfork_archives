// ==UserScript==
// @name         MAL Manga List Mass Delete Button
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  Adds a mass-delete button to your manga list sidebar. BACK UP your list before using! Credit to Andrei Voinea for the original My Anime List: Mass Delete Button
// @author       zozimus, using ChatGPT
// @match        *://myanimelist.net/mangalist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538833/MAL%20Manga%20List%20Mass%20Delete%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/538833/MAL%20Manga%20List%20Mass%20Delete%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initialize() {
        if (check()) {
            const sidebar = document.getElementsByClassName("list-menu-float");
            if (!sidebar.length) return;

            const button = document.createElement("DIV");
            button.className = "icon-menu export MassDelete";
            button.innerHTML = `
                <svg class="icon icon-export MassDelete" width="24" height="24" viewBox="0 0 24 24">
                    <g transform="translate(-1.000000, 0.000000)">
                        <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                    </g>
                </svg>
                <span class="text">Mass Delete</span>
            `;
            button.addEventListener("click", GetAllManga, false);
            sidebar[0].appendChild(button);
        }
    }

    function check() {
        const header = document.getElementsByClassName("username");
        return header.length && header[0].innerHTML.includes("Your");
    }

    const allManga = [];

    function GetAllManga() {
        const doc = document.documentElement.innerHTML.split("/ownlist/manga/");
        for (let i = 1; i < doc.length; ++i) {
            const id = doc[i].split("/")[0];
            if (!allManga.includes(id)) allManga.push(id);
        }

        if (confirm("This action will DELETE EVERY SINGLE manga entry from your list!\n\nTHIS CANNOT BE UNDONE.\n\nBackup your list before continuing.\n\nProceed?")) {
            if (confirm("Are you absolutely sure you want to delete EVERYTHING from your manga list?")) {
                Erase();
                alert("Deleting list. Refresh after ~30–60 seconds if you have many entries.");
            } else {
                alert("Mass delete canceled. Probably a good call.");
            }
        } else {
            alert("Nothing was deleted. Backup before proceeding.");
        }
    }

    function Erase() {
        for (let i = 0; i < allManga.length; ++i) {
            const link = "/ownlist/manga/" + allManga[i] + "/delete";
            const frame = create_frame(i);
            frame.addEventListener('load', () => post(link, frame));
        }
    }

    function create_frame(i) {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("name", "script-frame" + i);
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        return iframe;
    }

    let loaded = 0;
    function post(path, frame) {
        const form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", path);
        form.setAttribute("target", frame.name);
        document.body.appendChild(form);
        form.submit();

        loaded++;
        if (loaded === allManga.length) {
            setTimeout(() => location.reload(), 5000);
        }
    }

    initialize();
})();
