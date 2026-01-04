// ==UserScript==
// @name     Filman.cc url extractor
// @description url extractor for Filman.cc
// @version  1
// @grant    none
// @include  https://filman.cc/*
// @include  https://www.filman.cc/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/477931/Filmancc%20url%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/477931/Filmancc%20url%20extractor.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    const links = document.getElementById('links');
    if (links !== null) {
        const header = links.children[0];
        const rows = links.children[1];
        let colsDefinitions = undefined;
        if (header.childElementCount > 1) {
            colsDefinitions = header.children[header.childElementCount - 1];
        } else {
            colsDefinitions = header.children[0];
        }
        const newCol = document.createElement('th');
        newCol.classList.add('header');
        newCol.innerHTML = 'URL';
        colsDefinitions.appendChild(newCol);


        for (let row of rows.children) {
            let link_data = undefined;
            try {
                link_data = JSON.parse(atob(row.getElementsByClassName('link-to-video')[0].children[0].getAttribute('data-iframe')));
            } catch (error) {
                link_data = 'NO DATA';
            }
            const newCol = document.createElement('td');
            const link = document.createElement('input');
            link.value = link_data.src;
            link.onclick = function () {
                this.select();
                navigator.clipboard.writeText(this.value);
            };
            newCol.appendChild(link);
            row.appendChild(newCol);
        }
    }
});