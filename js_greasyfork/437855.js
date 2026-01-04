// ==UserScript==
// @name        warthunder.com / squadron members to CSV
// @namespace   mimimimimi userscripts
// @match       https://warthunder.com/*/community/claninfo/*
// @match       https://warthunder.ru/ru/community/claninfo/*
// @grant       none
// @version     1.3.1
// @author      M
// @license MIT
// @description Adds a button to WarThunder clan info pages allowing to export members' stats as CSV file.
// @downloadURL https://update.greasyfork.org/scripts/437855/warthundercom%20%20squadron%20members%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/437855/warthundercom%20%20squadron%20members%20to%20CSV.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let table, members, title, stat, activity;
    try {
        table = document.querySelector('div.squadrons-members__table');
        members = table.querySelectorAll('div.squadrons-members__grid-item');
        title = document.querySelector('div.squadrons-info__title').innerHTML.trim();
        stat = document.querySelector('div.squadrons-counter__count-icon--stat').nextElementSibling.innerHTML.trim();
        activity = document.querySelector('div.squadrons-counter__count-icon--activity').nextElementSibling.innerHTML.trim();
    }
    catch (err) {
        console.log("WT2CSV " + err);
        return;
    }
    let clicky = document.createElement('div');
    table.before(clicky);
    clicky.outerHTML = '<div id="clicky" class="button">Save as CSV</div>';
    document.getElementById('clicky').addEventListener('click', saveCSV);

    function saveCSV() {
        let now = new Date(),
            fname = "WT_" + title + "_(" + stat + "_" + activity + ")_members_" + now.toISOString().slice(0, 10) + ".csv";
        download(buildCSV(), fname);
        document.getElementById('clicky').style.display = 'none';
    }
    function buildCSV() {
        let dump = "", sep = ";", col = 6;
        members.forEach(function (el, i) {
            let m = el.textContent.trim();
            if ((i + 1) % col) {
                dump += m + sep;
            } else {
                dump += m + "\r\n";
            }
        });
        return dump;
    }
    function download(data, filename) {
        let a = window.document.createElement('a'),
            url = window.URL.createObjectURL(new Blob([data], {
                type: 'text/csv'
            }));
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
})();