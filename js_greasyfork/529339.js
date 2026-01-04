// ==UserScript==
// @name         Kanka Autosaves
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Saves a copy of the editor's content to local storage at set intervals so you can recover it if you forget to save or lose connection.
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529339/Kanka%20Autosaves.user.js
// @updateURL https://update.greasyfork.org/scripts/529339/Kanka%20Autosaves.meta.js
// ==/UserScript==

/* Preferences */
const interval = 5; // in minutes
const snapshots = 10; // how many snapshots to keep in storage

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {
    // Collect some info about the entry
    const crumb = document.querySelector('.breadcrumb li:nth-last-child(2) a');
    const nameField = document.querySelector('.entity-form input[name="name"]').value;
    const entityName = (crumb.href.match(/entities/)) ? crumb.title : (nameField.length > 0) ? nameField + " <i>(unsaved entity)</i>)" : "<i>(Unnamed " + crumb.title + " entity)</i>";
    const entryType = window.location.href.match(/posts/) ? "post" : "entry";
    const postName = (entryType == "post") ? (nameField.length > 0) ? nameField : "<i>(New post)</i>" : null;

    var recoveryButton = `
		<button type="button" id="autosavesButton" class="note-btn btn btn-default btn-sm" tabindex="-1" title="View autosaves in local storage" aria-label="View autosaves in local storage" data-original-title="View autosaves in local storage">
			<i class="fa-solid fa-clock-rotate-left"></i>
		</button>
		`;
    document.getElementsByClassName('note-toolbar')[0].insertAdjacentHTML("beforeend", recoveryButton);
    document.body.insertAdjacentHTML("beforeend", `<dialog id="autosaves" class="bg-box rounded border text-base-content"><header class="text-right"><button class="px-3 py-2" autofocus>Close</button></header><output style="max-height: 80vh;overflow-y: auto;padding-inline: 1.25rem;"></output></dialog>`);

    // Grab our button and dialog instances
    recoveryButton = document.getElementById('autosavesButton');
    const dialog = document.querySelector("#autosaves");
    const closeButton = document.querySelector("#autosaves button");

    // Add click event to buttons
    closeButton.addEventListener("click", () => {
        dialog.close();
        dialog.querySelector('output').innerHTML = "";
    });

    recoveryButton.addEventListener('click', ()=>{
        dialog.showModal();
        let savedState = JSON.parse( localStorage.getItem('kanka-autosaves') );

        // If we have existing snapshots, show them
        if (savedState && savedState.length > 0) {
            savedState.forEach( (state) => {
                // Create a Date object from the timestamp
                const date = new Date(state.time);
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short',
                    hour12: false
                };
                const formattedTime = date.toLocaleString('en-US', options);
                dialog.querySelector('output').insertAdjacentHTML("beforeend", `<h4 class="text-primary my-1">${state.title}</h4><p class="text-accent-content text-xs">${formattedTime}</p><div>${state.content.substring(0,50)}... <p class="text-accent cursor-pointer">&rarr; Paste into editor</p></div><hr class="my-2">`);
            });

            // Copy to Summernote
            dialog.querySelectorAll('output div').forEach(function(elem, i) {
                elem.addEventListener("click", ()=> {
                    try {
                        $('#entry').summernote('pasteHTML', savedState[i].content);
                    } catch {
                        alert("Failed to paste into the editor");
                    }
                });
            });
        }
        else {
            alert("No snapshot found in local storage.");
        }
    });

    // Autosave
    autosave();

    function autosave () {
        setTimeout(() => {
            var editorValue = "";
            // Code editor
            if ($('#entry + div').hasClass('codeview')) {
                editorValue = $('#entry + div').find('.note-codable').val();
            }
            // Visual editor
            else {
                editorValue = $('#entry').val();
            }

            let formattedName = (entryType == "post") ? postName + " (" + entityName + ")" : entityName;

            let jsonItem = {time: Date.now(), title: formattedName, type: entryType, content: editorValue };

            let savedState = JSON.parse( localStorage.getItem('kanka-autosaves') );

            if (savedState) {
                // Remove excess saves
                while (savedState.length > 0 && savedState.length >= snapshots) {
                    savedState.splice(0, 1);
                }
                // Add to array and save
                savedState.push(jsonItem);
                localStorage.setItem(('kanka-autosaves'), JSON.stringify(savedState));
            }
            else {
                // First save, create array
                localStorage.setItem(('kanka-autosaves'), JSON.stringify([jsonItem]));
            }

            // Re-run
            autosave();
        }, (1000 * 60 * interval));
    }
});