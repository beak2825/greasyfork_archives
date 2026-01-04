// ==UserScript==
// @name        Dillinger.io
// @namespace   https://github.com/XelaNimed
// @version     0.1.6
// @description Adds the ability to export and import documents from local storage in raw format (see "Export as" and "Import from" menus). When exporting documents, you can select the option to automatically delete documents after exporting.
// @author      XelaNimed
// @copyright   2021, XelaNimed (https://github.com/XelaNimed)
// @supportURL  https://github.com/XelaNimed/dillinger-io-user-script/issues
// @homepageURL https://github.com/XelaNimed/dillinger-io-user-script
// @license     MIT; https://raw.githubusercontent.com/XelaNimed/dillinger-io-user-script/master/LICENSE
// @match       https://dillinger.io/
// @icon        https://www.google.com/s2/favicons?domain=dillinger.io&sz=32
// @require     https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js#sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434565/Dillingerio.user.js
// @updateURL https://update.greasyfork.org/scripts/434565/Dillingerio.meta.js
// ==/UserScript==
/* global Swal, jQuery */
(function($) {

    'use strict';

    $(document).ready(function() {

        const exportMenuSelector = '.menu.menu-utilities>li:nth-child(2)>ul';
        const importMenuSelector = '.menu.menu-utilities>li:nth-child(4)>ul';
        const exportMenu = $(exportMenuSelector);
        const importMenu = $(importMenuSelector);
        const exportText = 'Raw';
        const importText = 'Raw';
        const localStorageFilesKey = 'files';
        const localStorageCurrentDocumentKey = 'currentDocument';
        const jsonFileName = 'dilinger_raw';
        const confirmMessageByOverwrite = 'Keep in mind that the script does not check the syntax of the imported data and assumes that the imported file was previously exported. After applying the settings, the page will reload and all saved documents will be overwritten. Continue?';
        const confirmMessageByExport = 'Delete saved documents after exporting and then reloading the page?';
        const inp = document.createElement('input');

        const getDateTime = function() {
            return new Date().toISOString()
                .slice(0, -5)
                .replace('T', '_')
                .split(':').join('-');
        };

        const saveJSON = function (data, filename) {

            if(typeof data === 'object') {
                data = JSON.stringify(data, undefined, 4);
            }

            const blob = new Blob([data], {type: 'text/json'}),
                  a = document.createElement('a'),
                  evt = new MouseEvent("click", {
                      bubbles: true,
                      cancelable: true,
                      view: window
                  });

            a.download = filename + '_' + getDateTime() + '.json';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            a.dispatchEvent(evt);
            a.remove();
        };

        const readJSON = function (files) {
            if(files && files.length === 1) {
                const fr = new FileReader();
                fr.readAsText(files[0]);
                fr.onload = function(e){
                    if(confirm(confirmMessageByOverwrite)) {
                        const json = JSON.parse(e.target.result);
                        localStorage.setItem(localStorageCurrentDocumentKey, JSON.stringify(json[0]));
                        localStorage.setItem(localStorageFilesKey, e.target.result);
                        window.location.reload();
                    } else {
                        inp.value = null;
                    }
                };
            }
        };

        const addExportRaw = function() {
            let a = document.createElement('a');
                a.innerText = exportText;
                a.addEventListener('click', function(e) {
                    let deleteSavedDocs = confirm(confirmMessageByExport);
                    saveJSON(localStorage.getItem(localStorageFilesKey), jsonFileName);
                    if(deleteSavedDocs){
                        localStorage.removeItem(localStorageFilesKey);
                        localStorage.removeItem(localStorageCurrentDocumentKey);
                        window.location.reload();
                    }
                    e.preventDefault();
                });

            let li = document.createElement('li');
                li.appendChild(a);

            exportMenu[0].appendChild(li);
        };

        const addImportRaw = function() {
                inp.type = 'file';
                inp.multiple = false;
                inp.accept = 'application/json';
                inp.style.display = 'none';
                inp.onchange = function() {
                    readJSON(this.files);
                };

            let span = document.createElement('span');
                span.innerText = importText;

            let a = document.createElement('a');
                a.appendChild(span);
                a.addEventListener('click', function(e) {
                    inp.click();
                    e.preventDefault();
                });

            let li = document.createElement('li');
                li.appendChild(a);
                li.appendChild(inp);
                importMenu[0].appendChild(li);
        };

        if(exportMenu.length > 0) {
            addExportRaw();
        } else {
            console.error("Export menu not found by selector: %s", exportMenuSelector);
        }

        if(importMenu.length > 0) {
            addImportRaw();
        } else {
            console.error("Import menu not found by selector: %s", importMenuSelector);
        }

    });

})(window.jQuery);
