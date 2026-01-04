// ==UserScript==
// @name         LocalStorage Export/Import
// @author       adityash4rma
// @version      2.0
// @namespace    https://greasyfork.org/en/users/1450540-adityash4rma
// @description  Add Tampermonkey menu commands to export and import localStorage data from any website!
// @icon         https://cdn-icons-png.flaticon.com/512/18091/18091224.png
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/530919/LocalStorage%20ExportImport.user.js
// @updateURL https://update.greasyfork.org/scripts/530919/LocalStorage%20ExportImport.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // This project is inspired by: https://gist.github.com/shufengh/e331c3d9a91d142dc0786ba6ddc95872
    function exportLocalStorage() {
        var obj = JSON.stringify(localStorage, null, 4);
        var vLink = document.createElement('a');
        var vBlob = new Blob([obj], {type: "octet/stream"});
        var vUrl = window.URL.createObjectURL(vBlob);
        vLink.setAttribute('href', vUrl);
        vLink.setAttribute('download', location.hostname + '-export.json');
        vLink.click();
    }

    function importLocalStorage() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.click();

        fileInput.addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function(e) {
                    try {
                        var jsonData = JSON.parse(e.target.result);
                        for (var key in jsonData) {
                            if (jsonData.hasOwnProperty(key)) {
                                localStorage.setItem(key, jsonData[key]);
                            }
                        }
                        alert("LocalStorage has been updated from the JSON file.");
                    } catch (err) {
                        alert("Error parsing JSON: " + err);
                    }
                };
                reader.onerror = function() {
                    alert("Error reading file.");
                };
            } else {
                alert("No file selected.");
            }
        });
    }
    
    function clearLocalStorage() {
        localStorage.clear()
    }
    
    GM_registerMenuCommand("Export LocalStorage", exportLocalStorage);
    GM_registerMenuCommand("Import LocalStorage", importLocalStorage);
    GM_registerMenuCommand("Clear LocalStorage", clearLocalStorage);
})();
