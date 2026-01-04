// ==UserScript==
// @name         4chan filter import/export
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add Import/Export functionality to 4chan catalog filter dialog
// @author       namewu
// @match        https://boards.4chan.org/*/catalog
// @icon         https://boards.4chan.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441733/4chan%20filter%20importexport.user.js
// @updateURL https://update.greasyfork.org/scripts/441733/4chan%20filter%20importexport.meta.js
// ==/UserScript==

(function() {
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function importFile(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            localStorage.setItem('catalog-filters', contents);
            location.reload();
        };
        reader.readAsText(file);
    }

    let filterButton = document.querySelector('#filters-ctrl');

    filterButton.addEventListener('click',function() {
        let filterRightButton = document.querySelector('#filters .right');
        if (filterRightButton == null) console.error('Filter dialog not found');
        else {
            if (filterRightButton.dataset.injected != 'true') {
                filterRightButton.dataset.injected = true;
                filterRightButton.innerHTML = '<input type="file" id="filter-import-input" style="display:none"/><button id="filter-export">Export</button> <button id="filter-import">Import</button> ' + filterRightButton.innerHTML;
            }

            let exportButton = document.querySelector('#filter-export');
            let importButton = document.querySelector('#filter-import');

            exportButton.addEventListener('click',function() {
                let data = localStorage.getItem('catalog-filters');
                download('catalog_filter.json', data);
            });

            importButton.addEventListener('click',function() {
                document.getElementById('filter-import-input').click();
            });

            document.getElementById('filter-import-input').addEventListener('change', importFile, false);
        }
    });

})();