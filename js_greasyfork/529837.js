// ==UserScript==
// @name        (Backup Menu) ++ AO3: Kudosed and seen history
// @description Added menu to export to .txt and import your backup
// @namespace   https://greasyfork.org/en/scripts/5835-ao3-kudosed-and-seen-history
// @version     1.3
// @author      MAD90's
// @grant       none
// @license     MIT
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/529837/%28Backup%20Menu%29%20%2B%2B%20AO3%3A%20Kudosed%20and%20seen%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/529837/%28Backup%20Menu%29%20%2B%2B%20AO3%3A%20Kudosed%20and%20seen%20history.meta.js
// ==/UserScript==

(function ($) {
    "use strict";

    function exportToTxt() {

        var export_lists = {
            kudosed: localStorage.getItem('kudoshistory_kudosed') || ',',
            seen: localStorage.getItem('kudoshistory_seen') || ',',
            bookmarked: localStorage.getItem('kudoshistory_bookmarked') || ',',
            skipped: localStorage.getItem('kudoshistory_skipped') || ',',
            checked: localStorage.getItem('kudoshistory_checked') || ','
        };

        var now = new Date();
        var currentDate = now.getDate().toString().padStart(2, '0') + '-' +
                          (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
                          now.getFullYear(); // DD-MM-YYYY format

        var textToSave = JSON.stringify(export_lists, null, 2);
        var blob = new Blob([textToSave], { type: "text/plain" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `AO3_history_${currentDate}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromTxt(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var importedData = JSON.parse(e.target.result);
                if (!importedData.kudosed || !importedData.seen || !importedData.bookmarked || !importedData.skipped || !importedData.checked) {
                    throw new Error("Missing required data fields.");
                }

                localStorage.setItem('kudoshistory_kudosed', importedData.kudosed);
                localStorage.setItem('kudoshistory_seen', importedData.seen);
                localStorage.setItem('kudoshistory_bookmarked', importedData.bookmarked);
                localStorage.setItem('kudoshistory_skipped', importedData.skipped);
                localStorage.setItem('kudoshistory_checked', importedData.checked);

                alert("[AO3 Backup] Import successful.");
            } catch (error) {
                alert("[AO3 Backup] Error: Invalid file format.");
            }
        };
        reader.readAsText(file);
    }

    $(document).ready(function () {
        var menu = $('<li class="dropdown"><a>Export/Import</a></li>');
        var menuList = $('<ul class="menu dropdown-menu"></ul>');
        menuList.append($('<li></li>').append($('<a href="#">Export to .txt</a>').click(exportToTxt)));

        var importOption = $('<li></li>').append($('<a href="#">Import Backup</a>'));
        var fileInput = $('<input type="file" accept=".txt" style="display: none;">');
        fileInput.on('change', importFromTxt);
        importOption.find('a').click(() => fileInput.click());

        menuList.append(importOption);
        menu.append(menuList);
        $('ul.primary.navigation.actions').children().last().before(menu)
        $(document.body).append(fileInput);
    });

})(jQuery);
