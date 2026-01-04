// ==UserScript==
// @name         Batch Download for ux.getuploader.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Batch Download ux.getuploader.com
// @author       hiroki.kitashirakawa @ f95zone.to
// @match        https://ux.getuploader.com/*/
// @match        https://ux.getuploader.com/*/index/date/desc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getuploader.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482948/Batch%20Download%20for%20uxgetuploadercom.user.js
// @updateURL https://update.greasyfork.org/scripts/482948/Batch%20Download%20for%20uxgetuploadercom.meta.js
// ==/UserScript==

(function () {
    var target_tables = [...document.querySelectorAll('table.table.table-small-font.table-hover')];

    // target_tables returns 2 tables, one of the table has a suffix of "-clone", therefore,
    // we can safely ignore it.
    var target_table = target_tables.filter(x => x.id.indexOf('-clone') < 0)[0];

    // If it doesn't exist, don't run.
    if (!target_table) {
        return;
    }

    var base_download_url = 'https://downloadx.getuploader.com';
    var username = location.href.split('/')[3];
    var password = ''; // to be set by a input later

    async function download_protected(user, id, filename, password) {
        var url_template = `https://ux.getuploader.com/${user}/download/${id}`;

        var form = new FormData();
        form.append('password', password);

        var submit = await fetch(url_template, {
            method: 'POST',
            body: form
        });

        var submit_result = await submit.text();

        // Find the ID for downloading
        const index = submit_result.indexOf('<input type="hidden" name="token"');
        const value_range = [
            index + 33 + 8,
            index + 33 + 44
        ];

        const token = submit_result.slice(value_range[0], value_range[1]);

        // Return url via token
        return `https://downloadx.getuploader.com/g/${token}/${user}/${id}/${filename}`;
    }

    async function get_all_urls() {
        var urls = '';
        var table_links = [...target_table.querySelectorAll('tr td a')].filter(x => x.href.indexOf('/download/') >= 0);
        for (var i = 0; i < table_links.length; i++) {
            // Check if current item got lock
            var id = table_links[i].href.split('/').slice(-1)[0];
            var filename = table_links[i].innerText;

            if (table_links[i].parentElement.parentElement.querySelector('.glyphicon.glyphicon-lock') === null) {
                urls += `${base_download_url}/g/${username}/${id}/${filename}\n`;
            } else {
                urls += await download_protected(username, id, filename, password) + '\n';
            }
        }

        return urls;
    }

    function tryPasteToClipboard(links) {
        if (navigator.clipboard === undefined) {
            alert('Failed to put in clipboard! Links on devtools');
            console.log("\n\n" + links);
            return;
        }

        navigator.clipboard.writeText(links)
            .then(() => alert('Pasted on clipboard!'))
            .catch(() => {
                alert('Failed to put in clipboard! Links on devtools');
                console.log("\n\n" + links);
            });
    }

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'password';
    input.onchange = function (e) {
        password = e.currentTarget.value;
    }

    // Create button for interaction
    var btn = document.createElement('a');
    btn.href = '#';
    btn.classList.add('btn', 'btn-default', 'btn-xs');
    btn.title = 'Get all download links';
    btn.innerText = 'Get all download links';
    btn.onclick = function () {
        get_all_urls().then(x => tryPasteToClipboard(x));
    }

    var btnParent = document.querySelector('.pull-left.space');
    btnParent.appendChild(btn);
    btnParent.appendChild(input);
})();