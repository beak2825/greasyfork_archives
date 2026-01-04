// ==UserScript==
// @name         [Deprecated] Kanka Backup to Local Storage
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Copies the editor’s content to local storage before saving to allow recovery if something is lost in transit.
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/454261/%5BDeprecated%5D%20Kanka%20Backup%20to%20Local%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/454261/%5BDeprecated%5D%20Kanka%20Backup%20to%20Local%20Storage.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {
    // Find the current entity’s ID (NOTE: DOES NOT WORK FOR NEW ENTITIES (/create))
    const entryType = window.location.href.match(/posts/) ? "post" : "entry";
    let entityID = "";
    if (entryType == "entry") {
        entityID = window.location.href.match(/w\/([\w\d])+\/[a-z]+\/(\d+)/) ? window.location.href.match(/w\/([\w\d])+\/[a-z]+\/(\d+)/)[1] : "new";
    }
    if (entryType == "post") {
        entityID = window.location.href.match(/posts\/(\d+)/) ? window.location.href.match(/posts\/(\d+)/)[1] : "new";
    }

    if (entityID != "new") {
        var recoveryButton = `
		<button type="button" id="recoveryButton" class="note-btn btn btn-default btn-sm" tabindex="-1" title="Recover previous state" aria-label="Recover previous state" data-original-title="Recover previous state">
			<i class="fa-solid fa-clock-rotate-left"></i>
		</button>
		`;
        document.getElementsByClassName('note-toolbar')[0].insertAdjacentHTML("beforeend", recoveryButton);

        // Grab our button instance
        recoveryButton = document.getElementById('recoveryButton');

        // Add click event to button (copy saved content to clipboard)
        recoveryButton.addEventListener('click', ()=>{
            let savedState = "";
            if (entryType == "entry") {
                savedState = JSON.parse( localStorage.getItem('kanka-recovery-entity-'+entityID) );
            }
            if (entryType == "post") {
                savedState = JSON.parse( localStorage.getItem('kanka-recovery-post-'+entityID) );
            }

            if (savedState && savedState.length > 0) {
                // Copy code to clipboard (no IE support)
                navigator.clipboard.writeText(savedState).then(function() {
                    alert("Saved state copied to clipboard");
                }, function() {
                    alert("Failed to access the clipboard");
                });
            }
            else {
                alert("No saved state found for the current " + entryType + ".");
            }
        });
    }

    // Add event to save button(s)
    document.getElementById('form-submit-main').addEventListener('click', ()=>{
        var editorValue = "";
        // Code editor
        if ($('#entry + div').hasClass('codeview')) {
            editorValue = $('#entry + div').find('.note-codable').val();
        }
        // Visual editor
        else {
            editorValue = $('#entry').val();
        }

        if (entryType == "entry") {
            localStorage.setItem('kanka-recovery-entity-'+entityID, JSON.stringify(editorValue));
        }
        if (entryType == "post") {
            localStorage.setItem('kanka-recovery-post-'+entityID, JSON.stringify(editorValue));
        }
    });

});