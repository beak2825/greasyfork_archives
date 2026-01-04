// ==UserScript==
// @name         Drag
// @description  The extension adds drag and drop when loading the report
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://pro.guap.ru/inside/student/reports/*/create
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479765/Drag.user.js
// @updateURL https://update.greasyfork.org/scripts/479765/Drag.meta.js
// ==/UserScript==

(function() {
    const drop_area = document.getElementsByClassName('card')[0];
    const load_button = document.getElementsByClassName('btn-info')[0];

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        drop_area.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false)
    });

    drop_area.addEventListener('drop', (e) => {
        document.getElementById('file').files = e.dataTransfer.files;
        load_button.text = e.dataTransfer.files[0].name;
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        drop_area.addEventListener(eventName, _ => {
            drop_area.style.cssText = 'box-shadow: 0 0 .5rem rgba(0,250,0,.75) !important;'
        }, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
        drop_area.addEventListener(eventName, _ => {
            drop_area.style.cssText = 'box-shadow: var(--suai-shadow) !important'
        }, false)
    });
})();