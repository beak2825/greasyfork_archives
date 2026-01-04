// ==UserScript==
// @name         Re-add Download Button Vimm's Lair
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Grabs the mediaId and re-adds the download button only on pages that have them removed
// @icon         https://cdn.jsdelivr.net/gh/ryuupendragon/icons/png/vimm.png
// @author       anonymous
// @match        https://vimm.net/vault/*
// @downloadURL https://update.greasyfork.org/scripts/539503/Re-add%20Download%20Button%20Vimm%27s%20Lair.user.js
// @updateURL https://update.greasyfork.org/scripts/539503/Re-add%20Download%20Button%20Vimm%27s%20Lair.meta.js
// ==/UserScript==
(function() {
    const downloadForm = document.querySelector('#dl_form');
    const downloadButton = downloadForm?.querySelector('button[type="submit"][style="width:100%"]');

    if (downloadForm && !downloadButton) {
        downloadForm.insertAdjacentHTML('beforeend', '<button type="submit" style="width:34%">Download</button>');
    }
})();