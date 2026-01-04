// ==UserScript==
// @namespace vimm's lair 
// @name         Re-add Download Button Vimm's Lair
// @version      1.0
// @description  Grabs the mediaId and re-adds the download button on broken pages
// @author       anonymous
// @match        https://vimm.net/vault/*
// @downloadURL https://update.greasyfork.org/scripts/522647/Re-add%20Download%20Button%20Vimm%27s%20Lair.user.js
// @updateURL https://update.greasyfork.org/scripts/522647/Re-add%20Download%20Button%20Vimm%27s%20Lair.meta.js
// ==/UserScript==
(function() {
    const actionContainer = document.querySelector("div[style='margin-top:12px']");
    if (!actionContainer) {
        return;
    }

    const downloadForm = document.forms['dl_form'];
    if (!downloadForm) {
        console.error('Download form not found');
        return;
    }

    const gameIdField = downloadForm.elements['mediaId'];
    if (!gameIdField) {
        console.error('Game ID not available');
        return;
    }

    const gameId = gameIdField.value.trim();
    if (!gameId) {
        console.error('Invalid game ID');
        return;
    }

    const unavailableElements = [
        document.querySelector("#upload-row"),
        document.querySelector("#dl_size + span.redBorder")
    ];

    unavailableElements.forEach(el => {
        if (el) {
            el.remove();
        }
    });

    const downloadSection = document.createElement('div');
    downloadSection.innerHTML = `
        <div style="margin-top:12px; text-align:center">
            <form action="//download2.vimm.net/" method="POST" id="dl_form" onsubmit="return submitDL(this, 'tooltip4')">
                <input type="hidden" name="mediaId" value="${gameId}">
                <input type="hidden" name="alt" value="0" disabled="">
                <button type="submit" style="width:33%">Download</button>
            </form>
        </div>`;

    actionContainer.parentNode.insertBefore(downloadSection, actionContainer);
})();