// ==UserScript==
// @name     Simple Form Save HotKey
// @version  1
// @include *://*.simpleone.ru/record/*
// @include *://localhost:3000/record/*
// @namespace https://greasyfork.org/users/783743
// @description Press Alt + Shift + S to save active form
// @downloadURL https://update.greasyfork.org/scripts/427999/Simple%20Form%20Save%20HotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/427999/Simple%20Form%20Save%20HotKey.meta.js
// ==/UserScript==

window.addEventListener('keyup', (e) => {
    if (e.altKey && e.shiftKey && (e.keyCode == 83)) {
        const saveButton = document.querySelector('[data-test="form_button__save-ui-button"]');
        if (saveButton) {
            saveButton.click();
        }
    }
}, false);
