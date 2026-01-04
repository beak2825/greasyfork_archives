// ==UserScript==
// @name         Damned Lies Translation List Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight the entries in the task list which are not finished and nobody works on it
// @author       liushuyu
// @match        https://l10n.gnome.org/languages/*/ui/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371865/Damned%20Lies%20Translation%20List%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/371865/Damned%20Lies%20Translation%20List%20Highlighter.meta.js
// ==/UserScript==

function openURL(url) {
    window.open(url, '_blank');
}

function loadDetailPage(a, url, paint) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.a = a; // HACK: store the element
    xhr.overrideMimeType('text/html');
    xhr.onload = function(event) {
        if (xhr.readyState !== xhr.DONE || xhr.status !== 200) {
            return;
        }
        var parser = new DOMParser();
        var detail_page = parser.parseFromString(xhr.responseText, 'text/html');
        var uploads = detail_page.getElementsByClassName('uploaded_file');
        var someone_completed = false;

        for (let upload of uploads) {
            var stats = upload.getElementsByTagName('span')[0];
            if (!stats) continue;
            stats = stats.innerText.split('/');
            if (stats[1] === '0' || stats[2] === '0') {
                someone_completed = true;
                break;
            }
        }

        if (!someone_completed) {
            a.setAttribute("style", "background: #f0f8ff;");
            a.setAttribute("class", "incomplete-module");
        }
        var last_submission = uploads.item(uploads.length - 1);
        var po_url = null;
        var download_section = null;
        if (last_submission) {
            download_section = last_submission.getElementsByClassName('download_button')[1];
        }
        if (download_section) {
            po_url = download_section.href;
        } else {
            po_url = detail_page.getElementsByClassName('btn-action')[1].href;
        }
        var button = document.createElement('button');
        button.innerHTML = 'Download';
        button.setAttribute('class', 'btn btn-default btn-xs');
        button.setAttribute('onclick', 'openURL("' + po_url + '");');
        a.children[0].insertBefore(button, a.children[0].children[0]);
    }; // ! onload
    xhr.send();
}


(function() {
    'use strict';
    var x = document.getElementById('stats-table');
    var y = x.getElementsByTagName('tbody')[0];
    var z = y.children;
    window.openURL = openURL;

    var not_completed = [];
    for (var i = 0; i < z.length; i++) {
        var a = z[i];
        if (a.id !== '' && a.className != 'completed-module') {
            var url = a.getElementsByTagName('a')[0];
            url = url.getAttribute('href');

            loadDetailPage(a, url);

        } // ! if
    } // ! for

})();
