// ==UserScript==
// @name    Brainscape Bene
// @author  LucunJi
// @version 1.1.0
// @match	https://www.brainscape.com/l/dashboard/*/decks*
// @grant   none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js
// @license MIT
// @description	Import/export your Brainscape decks from/into csv files without a Pro account.
// @namespace	https://github.com/LucunJi
// @homepageURL https://github.com/LucunJi/brainscape-bene
// @supportURL  https://github.com/LucunJi/brainscape-bene/issues
// @downloadURL https://update.greasyfork.org/scripts/442099/Brainscape%20Bene.user.js
// @updateURL https://update.greasyfork.org/scripts/442099/Brainscape%20Bene.meta.js
// ==/UserScript==

$(document).ready(function (event) {
    tryReplaceBtn(event);
});

function tryReplaceBtn(event) {
    var timer = setInterval(function () {
        var importBtn = $('.import-deck.pro-required');
        var exportBtn = $('.export-deck.pro-required');
        if (importBtn.length > 0) {
            importBtn = importBtn.get(0);
            importBtn.replaceWith(importBtn = importBtn.cloneNode(true));
            importBtn.classList.remove('pro-required');
            importBtn.addEventListener('click', event => {
                importCSV(event);
                event.stopImmediatePropagation();
            });
        }
        if (exportBtn.length > 0) {
            exportBtn = exportBtn.get(0);
            exportBtn.replaceWith(exportBtn = exportBtn.cloneNode(true));
            exportBtn.classList.remove('pro-required');
            exportBtn.addEventListener('click', event => {
                exportCSV(event);
                event.stopImmediatePropagation();
            });
        }
    }, 50);

    event.stopImmediatePropagation();
}

function importCSV(event) {
    // get deck title
    var packId = $(event.target).parents('.pack-decks-section[data-pack-id]').attr('data-pack-id');
    var deckName = prompt('Enter the title of your new deck below');
    if (deckName === null) return;
    if (deckName.trim() === "") {
        alert('The title cannot be an empty string');
        return;
    }

    // get input file
    var fileSelector = document.createElement('input');
    fileSelector.type = 'file';
    fileSelector.accept = '.csv';
    fileSelector.onchange = function (event) {
        if (event.target.files.length < 1) return;

        var reader = new FileReader();
        reader.onload = function () {
            var parsedCSV = Papa.parse(reader.result);
            if (parsedCSV['errors'].length > 0) {
                alert(`The csv file is not illegal: ${parsedCSV['errors'][0]['message']}`);
                return;
            }

            // convert to params
            var data = new FormData();
            var timestamp = Date.now()
            for (var entry of parsedCSV['data']) if (entry.length >= 2) {
                data.append(`deck[cards_attributes][${timestamp}][reveal]`, 'false');
                data.append(`deck[cards_attributes][${timestamp}][question]`, entry[0]);
                data.append(`deck[cards_attributes][${timestamp}][answer]`, entry[1]);
                timestamp++;
            }

            // send post request
            fetch(`https://www.brainscape.com/api/decks?packID=${packId}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content_type: 'text', name: deckName })
            })
                .then(res => res.json())
                .then(res => fetch(`https://www.brainscape.com/decks/${res['deckID']}/cards/quick_add`, {
                        method: 'POST',
                        headers: { 'x-csrf-token': $("[name=csrf-token]").attr('content') },
                        body: data
                    })
                )
                .then(response => location.reload())
                .catch(err => alert(`failed to import new deck ${err}`));
        };
        reader.readAsText(event.target.files[0]);
    };

    fileSelector.click();
}

function exportCSV(event) {
    var packId = $(event.target).parents('.pack-decks-section[data-pack-id]').attr('data-pack-id');
    var deckId = $(event.target).parents('.deck-row[id]').attr('id');
    var deckName = $(event.target).parents('.deck-name').html();
    fetch(`https://www.brainscape.com/api/packs/${packId}/decks/${deckId}/preview`, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(res => {
            var csvData = res['cards'].map(card =>
                [card['question'], card['answer'], card['questionHtml'], card['answerHtml'], card['level']]
            );
            var fileDownloader = document.createElement('a');
            fileDownloader.setAttribute('href',
                'data:text/plain;charset=utf-8, ' + encodeURIComponent(Papa.unparse(csvData)));
            fileDownloader.setAttribute('download', res['deck']['name'] + '.csv');
            fileDownloader.click();
        })
}
