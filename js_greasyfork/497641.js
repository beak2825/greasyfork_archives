// ==UserScript==
// @name         Copy for PR
// @namespace    http://tampermonkey.net/
// @version      5000
// @description  teads yvelin
// @author       Louis Yvelin
// @match        https://github.com/ebuzzing/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497641/Copy%20for%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/497641/Copy%20for%20PR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'unsafe-inline';
    let iconCopyEmpty = '<svg xmlns="http://www.w3.org/2000/svg" id="iconCopyPR" viewBox="0 0 16 16" width="16" height="16"><path d="M3.626 3.533a.249.249 0 0 0-.126.217v9.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-9.5a.249.249 0 0 0-.126-.217.75.75 0 0 1 .752-1.298c.541.313.874.89.874 1.515v9.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-9.5c0-.625.333-1.202.874-1.515a.75.75 0 0 1 .752 1.298ZM5.75 1h4.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 4.75v-3A.75.75 0 0 1 5.75 1Zm.75 3h3V2.5h-3Z"></path></svg>';

    // Prepend a div with a copy icon
    let menu = document.querySelector("body > div.logged-in.env-production.page-responsive > div.position-relative.js-header-wrapper > header > div.AppHeader-globalBar.pb-2.js-global-bar > div.AppHeader-globalBar-end");
    let div = document.createElement('div');
    div.classList = "Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted";
    div.innerHTML = iconCopyEmpty;
    div.id = 'copy-to-pr'
    menu.prepend(div);

    function copyLink() {
        return function() {
            let url = window.location.href.match(/(.*\/pull\/[0-9]+)/)[0];
            let text = document.querySelector("#partial-discussion-header bdi").textContent;

            var repo = document.querySelectorAll('header nav .AppHeader-context-item-label')[1].innerText;
            var p = document.createElement('p');
            p.appendChild(document.createTextNode(`[${repo}] `));

            var a = document.createElement('a');
            a.setAttribute("href", url);
            a.appendChild(document.createTextNode(text));
            p.appendChild(a);
            document.body.appendChild(p);

            let plusLOC = document.querySelector("#diffstat > span.color-fg-success").innerText;
            let minusLOC = document.querySelector("#diffstat > span.color-fg-danger").innerText;
            let nbFiles = document.querySelector("#files_tab_counter").innerText;
            var extraText = document.createTextNode(` (${plusLOC.trim()} ${minusLOC.trim()}, in ${nbFiles.trim()} file${nbFiles.trim() > 1 ? 's' : ''})`);
            p.appendChild(extraText);

            var range = document.createRange();
            range.selectNode(p);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            document.execCommand('copy');
            document.body.removeChild(p);
            console.log('copied');
            document.getElementById('iconCopyPR').style.fill = 'green';
            document.getElementById('iconCopyPR').style.transition = 'transform 0.3s';
            document.getElementById('iconCopyPR').style.transform = 'rotate(360deg)';

            setTimeout(() => {
                document.getElementById('iconCopyPR').style.fill = '';
                document.getElementById('iconCopyPR').style.transform = '';
            }, 300);
        };
    }

    div.addEventListener('click', copyLink());

})();