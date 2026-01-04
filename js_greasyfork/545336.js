// ==UserScript==
// @name         AO3: Import & Export Script Storage
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      2.0
// @description  View & delete AO3 script settings (from localStorage) with hints which script they're from. Import & export settings to file for safekeeping or to transfer to another device.
// @author       escctrl
// @license      MIT
// @match        *://*.archiveofourown.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545336/AO3%3A%20Import%20%20Export%20Script%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/545336/AO3%3A%20Import%20%20Export%20Script%20Storage.meta.js
// ==/UserScript==

'use strict';

// utility to reduce verboseness
const q = (selector, node=document) => node.querySelector(selector);
const qa = (selector, node=document) => node.querySelectorAll(selector);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

// if no other script has created it yet, write out a "Userscripts" option to the main navigation
if (qa('#scriptconfig').length === 0) {
    qa('#header nav[aria-label="Site"] li.search')[0] // insert as last li before search
        .insertAdjacentHTML('beforebegin', `<li class="dropdown" id="scriptconfig">
            <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
            <ul class="menu dropdown-menu"></ul></li>`);
}
// then add this script's config option to navigation dropdown
ins(q('#scriptconfig .dropdown-menu'), 'beforeend', `<li><a href="#" id="open_storage">Import & Export Script Storage
        <span class="switch"><input type="checkbox"><span class="slider round"></span></span></a></li>`);

ins(q("head"), 'beforeend', `<style tyle="text/css"> #storagelist th, #storagelist td { vertical-align: middle; }
    /* The switch - the box around the slider */
        .switch { position: relative; display: inline-block; width: 2em; height: 1em; vertical-align: -0.3em; }
    /* Hide default HTML checkbox */
        .switch input { opacity: 0; width: 0; height: 0; }
    /* The slider */
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 0.8em; width: 0.8em; left: 0.2em; bottom: 0.1em; background-color: white; -webkit-transition: .4s; transition: .4s; }
        input:checked + .slider { background-color: currentColor; }
        input:focus + .slider { box-shadow: 0 0 1px currentColor; }
        input:checked + .slider:before { -webkit-transform: translateX(0.8em); -ms-transform: translateX(0.8em); transform: translateX(0.8em); }
    /* Rounded sliders */
        .slider.round { border-radius: 1em; }
        .slider.round:before { border-radius: 50%; }
    .fadeOut { opacity: 0; transition: opacity 400ms; }
    </style>`);

// on either click on link or change of checkbox (depending where exactly user clicked), switch the localStorage view on/off
q('#open_storage').addEventListener('click', (e)=>{
    e.preventDefault();
    if (!q('#storagecontainer')) {
        if (e.currentTarget.tagName==="A") q('input', e.currentTarget).checked = true; // make sure the slider reflects the status
        showLocalStorage();
    }
    else {
        if (e.currentTarget.tagName==="A") q('input', e.currentTarget).checked = false; // make sure the slider reflects the status
        hideLocalStorage();
    }
});

function showLocalStorage() {
    // Read LocalStorage and create a table from it
    let storage_list = [];
    for (let i = 0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key =="accepted_tos") continue;
        storage_list.push([key, localStorage.getItem(key), getScriptNotes(key)]);
    }
    let stdcontent = q('div.splash');

    if (storage_list.length > 0) {
        // sort by name!
        storage_list.sort((a, b)=>{
            return a[0].localeCompare(b[0]);
        });

        let table = `<div id="storagecontainer">
        <p>Select items in the table and <button type="button" id="storagedelete">Delete</button> them, <button type="button" id="storagedl">Export</button> them to a file, or <button type="button" id="storageul">Import</button> settings from such a file. <input type="file" accept="application/json" id="storagefile" style="display: none" /></p>
        <table id="storagelist"><thead><tr><th><input type="checkbox" id="storageselall"></th><th>Key</th><th>Source</th><th>Content</th><th>Length</th></tr></thead><tbody>`;
        storage_list.forEach((v, i) => {
            table += `<tr><td><input type="checkbox" class="storagesel"></td><td class='storagekey'>${v[0]}</td><td>${v[2]}</td><td>${v[1].slice(0, 30)}${(v[1].length>30) ? "..." : ""}</td><td style="text-align: right;">${v[1].length} char${(v[1].length==1) ? "" : "s"}</td></tr>`;
        });
        table += `</tbody></table><p style="margin-top: 1em;">A Source listed as <i>unknown</i> means that you have or had a script installed which wrote this data,
            but the Import/Export script doesn't know its name. You can check your installed scripts to figure out which script it's from.</p></div>`;

        stdcontent.style.display = 'none';
        ins(stdcontent, 'beforebegin', table);
    }
    else {
        stdcontent.style.display = 'none';
        ins(stdcontent, 'beforebegin', `<div id="storagecontainer"><p>There is no data for AO3 stored in your browser's localStorage. <button type="button" id="storageul">Import</button> settings from a file. <input type="file" accept="application/json" id="storagefile" style="display: none" /></p></div>`);
    }
    // event listeners for various buttons and checkboxes
    q('#storagecontainer').addEventListener('click', (e)=>{
        if (e.target.tagName==="BUTTON" && e.target.id === 'storagedelete') {
            let boxes = qa('.storagesel');
            for (let box of boxes) {
                if (!box.checked) continue;
                let row = box.closest('tr');
                let key = q('.storagekey', row).textContent;
                localStorage.removeItem(key);
                row.classList.add('fadeOut');
                setTimeout(() => row.remove(), 400);
            }
        }
        else if (e.target.tagName==="BUTTON" && e.target.id === 'storagedl') {
            downloadFile(storage_list);
        }
        else if (e.target.tagName==="BUTTON" && e.target.id === 'storageul') {
            q('#storagefile').click(); // we show a pretty button but trigger the usual file browse button
        }
        else if (e.target.tagName==="INPUT" && e.target.id === 'storagesel') {
            q('#storagefile').click(); // we show a pretty button but trigger the usual file browse button
        }
    });
    q('#storagefile').addEventListener('change', uploadFile); // react when a file was selected
    q('#storageselall').addEventListener('change', (e)=>{
        qa('.storagesel').forEach((b) => { b.checked = e.target.checked; });
    });
}

function hideLocalStorage() {
    q('#storagecontainer').remove();
    q('div.splash').style.display = 'block';
}

function downloadFile(storage_list) {
    const a = document.createElement('a'); // Create <a> element

    // collect the content we're supposed to export
    let export_keys = [];
    let boxes = qa('.storagesel');
    for (let box of boxes) {
        if (!box.checked) continue;
        let row = box.closest('tr');
        export_keys.push(q('.storagekey', row).textContent);
    }
    if (export_keys.length === 0) {
        alertError("Please select at least one setting to export and try again.");
        return;
    }
    let export_arr = [];
    for (let s of storage_list) {
        if (export_keys.includes(s[0])) export_arr.push([ s[0], s[1] ]);
    }

    const blob = new Blob([JSON.stringify(export_arr)], {type: 'application/json'}); // Create a blob with our settings
    const url = URL.createObjectURL(blob); // Create an object URL from blob
    a.setAttribute('href', url); // Set <a> element link with that blob URL
    a.setAttribute('download', `ao3-script-storage-${new Date().toISOString().replaceAll(/[^\d\w]/g,'')}.json`); // Set download filename
    a.click(); // Start downloading
}

function uploadFile() {
    const uploaded = this.files[0]; // the selected file
    if (!uploaded) alertError("No file selected. Please try again.");
    else if (uploaded.type !== 'application/json') alertError("Unsupported file type. Please try again with a JSON file.");
    else {
        const reader = new FileReader();
        reader.onload = () => { overwriteStorage(reader.result); };
        reader.onerror = () => { alertError("Error reading the file. Please try again."); };
        reader.readAsText(uploaded); // read the file
    }
}

function overwriteStorage(content) {
    try {
        content = JSON.parse(content); // parse the content back into a [[key, val], ...] array
    } catch (error) { // JSON syntax error
        alertError("File does not contain valid JSON. Please try again with a JSON file.");
        return;
    }
    // file content was otherwise malformed
    if (!Array.isArray(content) || content.length < 1 || !content.every((curr) => curr.length === 2)) {
        alertError("File does not contain valid settings. Please try again with a proper export file.");
        return;
    }
    for (let entry of content) {
        localStorage.setItem(entry[0], entry[1]); // push everything into the browser storage
    }
    q('#storagecontainer').remove(); // refresh the display
    showLocalStorage();
}

function alertError(msg) {
    alert(msg);
}

function getScriptNotes(key) {
    switch (key) {
        case "accepted_tos":
            return "set by AO3";
        case "ao3jail":
            return "used by some scripts to stop when encountering Retry Later, OK to delete";
        case "aia_refdate":
        case "aia_ref":
            return "<a href='https://greasyfork.org/en/scripts/475525'>AO3: [Wrangling] Mark Co- and Solo-Wrangled Fandoms</a>";
        case "floatcmt":
            return "<a href='https://greasyfork.org/en/scripts/489335'>AO3: Sticky Comment Box</a>";
        case "glossary":
            return "<a href='https://greasyfork.org/en/scripts/450347'>AO3: Glossary Definition Previews</a>";
        case "agecheck_new":
        case "agecheck_old":
            return "<a href='https://greasyfork.org/en/scripts/444335'>AO3: [Wrangling] Highlight Bins with Overdue Tags</a>";
        case "cmtfmtcustom":
        case "cmtfmtstandard":
            return "<a href='https://greasyfork.org/en/scripts/484002'>AO3: Comment Formatting and Preview</a>";
        case "iconify0":
        case "iconify-count":
        case "iconify-version":
            return "set by Iconify, used by various scripts for icons on buttons";
        case "kbdpages":
        case "kbdshortcuts":
            return "<a href='https://greasyfork.org/en/scripts/451524'>AO3: [Wrangling] Keyboard Shortcuts</a>";
        case "smallertagsearch":
            return "<a href='https://greasyfork.org/en/scripts/443886'>AO3: [Wrangling] Smaller Tag Search</a>";
        case "unread_inbox_count":
        case "unread_inbox_date":
        case "unread_inbox_conf":
            return "<a href='https://greasyfork.org/en/scripts/474892'>AO3: Badge for Unread Inbox Messages</a>";
        case "script-replaceYN":
        case "script-replaceYN-on":
            return "<a href='https://greasyfork.org/en/scripts/477499'>AO3: Replace Y/N in works with your name</a>";
        case "tags_saved_date_map":
            return "<a href='https://greasyfork.org/en/scripts/438063'>AO3: [Wrangling] UW Tag Snooze Buttons</a>";
        //case "": // not yet migrated to localStorage
        //    return "<a href='https://greasyfork.org/en/scripts/432628'>AO3: [Wrangling] Snooze Buttons</a>";
        case "kudoshistory_kudosed":
        case "kudoshistory_checked":
        case "kudoshistory_seen":
        case "kudoshistory_bookmarked":
        case "kudoshistory_skipped":
            return "<a href='https://greasyfork.org/en/scripts/5835'>AO3: Kudosed and seen history</a>";
        case "ao3tracking_list":
        case "ao3tracking_lastcheck":
            return "<a href='https://greasyfork.org/en/scripts/8382'>AO3: Tracking</a>";
        case "wrangleActionButtons":
            return "<a href='https://greasyfork.org/en/scripts/501991'>AO3: [Wrangling] Action Buttons Everywhere</a>";
        case "wrangleShortcuts_act":
        case "wrangleShortcuts_tag":
            return "<a href='https://greasyfork.org/en/scripts/507705'>AO3: [Wrangling] Keyboard Shortcuts</a>";
        case "rainbowTables":
            return "<a href='https://greasyfork.org/en/scripts/445805'>AO3: [Wrangling] Rainbow Tables</a>";
        case "wrangleResources":
            return "<a href='https://greasyfork.org/en/scripts/511102'>AO3: [Wrangling] Fandom Resources Quicklinks</a>";
        case "ao3_chapter_shortcuts_config":
            return "<a href='https://greasyfork.org/en/scripts/549571-ao3-chapter-shortcuts'>AO3: Chapter Shortcuts</a>";
        case "ao3_wizard_config":
            return "<a href='https://greasyfork.org/en/scripts/550537-ao3-site-wizard'>AO3: Site Wizard</a>";
        case "ao3_reading_quality_config":
            return "<a href='https://greasyfork.org/en/scripts/549777-ao3-reading-time-quality-score'>AO3: Reading Time & Quality Score</a>";
        case "ao3_advanced_blocker_config":
            return "<a href='https://greasyfork.org/en/scripts/549942-ao3-advanced-blocker'>AO3: Advanced Blocker</a>";
        default:
            return "<i>unknown</i>";
    }
}
