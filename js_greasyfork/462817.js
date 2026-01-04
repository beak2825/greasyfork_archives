// ==UserScript==
// @name         Wani Kani Export
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Export Wani Kani To Anki
// @author       Noah Barsky
// @match        https://www.wanikani.com/
// @connect      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463051/Wani%20Kani%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/463051/Wani%20Kani%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This is the variable to set to make the anki cards be due on the correct day
    var ankiCollectionDateOffset = 0

    var mycss = ".card {font-family: MS UI Gothic;font-size: 50px;text-align: center;color: white;background-color: black;}img {width: auto;height: auto;max-width: 600px;max-height: 300px;}.expression { margin-bottom: -0.0em; margin-top: 1.2em;}ul {list-style-type:none;display: inline;margin: 0px; padding: 0px;}"
    var srsStages = [0, 1, 1, 1, 2, 7, 14, 30, 120]

    // Include the ItemData module, and wait for it to be ready.
    wkof.include('ItemData');
    wkof.ready('ItemData')
    var gogobutton = document.createElement("button");
    var progressmeter = document.createElement("p");

    document.body.appendChild(gogobutton)
    document.body.appendChild(progressmeter)

    progressmeter.innerHTML = "Press the button to export!"
    gogobutton.innerHTML = "Export Wanikani to Anki"
    gogobutton.onclick = function() {fetch_items()};

    function fetch_items() {
        progressmeter.innerHTML = "Fetching Items"
        var config = {
            wk_items: {
                options: {assignments: true, study_materials: true, review_statistics: true},
                filters: {
                    srs: {value: 'burn', invert: true},
                    item_type: 'voc'
                }
            }
        };

        wkof.ItemData.get_items(config)
            .then(process_items);
    }
    function invoke(action, version, params={}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PUT",
                url: 'http://127.0.0.1:8765',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({action, version, params}),
                onload: function(response) {
                    resolve(JSON.parse(response.response));
                }
            });
        });
    }

    function makeCards(items) {
        progressmeter.innerHTML = "Making Anki Cards"
        var cards = []
        for (var i = 0; i < items.length; i++) {
            cards.push(cardFromItem(items[i]))
        }
        invoke("addNotes",6,{notes:cards}).then(response => getAllCards())
        //invoke("addNotes",6,{notes:cards}).then(response => processNewCard(response.result, cards, items))
    }

    function getAllCards() {
        invoke('findCards', 6, {"query": "deck:wkexport"}).then(response => invoke('cardsInfo', 6, {"cards": response.result})).then(response => {
            var currentTime = new Date();
            console.log(response.result)
            function setsrs(i, time) {
                if (i < response.result.length) {
                    var data = JSON.parse(response.result[i].fields.wkdata.value)
                    var cardid = response.result[i].cardId
                    var dueTime = new Date(data.assignments.available_at);
                    var due = Math.round((dueTime - time) / 60000 / 1440)+ankiCollectionDateOffset
                    if (due < 0) { due = 0 }
                    console.log(i%10 + ',' + due + ',' + srsStages[data.assignments.srs_stage])
                    invoke('setSpecificValueOfCard', 6, {
                        "card": cardid,
                        "keys": ["type", "queue", "due", "ivl"],
                        "newValues": [2, 2, due, srsStages[data.assignments.srs_stage]],
                        "warning_check": true
                    }).then(rresponse => {
                        console.log(rresponse)
                    })

                    if (i % 20 === 0 ) {
                        setTimeout(function(){
                            setsrs(i+1, time)
                        }, 500);
                    } else {
                        setTimeout(function(){
                            setsrs(i+1, time)
                        }, 20);
                    }
                }
            }
            setsrs(0, currentTime)
        })
    }

    function processNewCard(response, cards, items) {
        progressmeter.innerHTML = "Setting Card Properites"
        console.log(response)
        console.log(items)
        var currentTime = new Date();

        for (var i = 0; i < response.length; i++) {
            var dueTime = new Date(items[i].assignments.available_at);
            var due = Math.round((dueTime - currentTime) / 60000 / 1440)
            if (due < 0) { due = 0 }
            invoke('setSpecificValueOfCard', 6, {
                "card": response[i],
                "keys": ["type", "queue", "due", "ivl"],
                "newValues": [2, 2, due+640, srsStages[items[i].assignments.srs_stage]],
                "warning_check": true
            }).then(rresponse => {
                console.log(rresponse)
                progressmeter.innerHTML = "Setting Card Properites:" + i
            })
        }
    }

    function cardFromItem(item) {
        var question = item.data.slug
        var reading = ""
        var meanings = ""
        try {
            question = item.study_materials.meaning_note.match(/s{.*}/gm).toString().replace("s{", "").toString().replace("}", "").toString()
        } catch {}

        for (var read in item.data.readings) {
            if (item.data.readings[read].accepted_answer === true) {
                reading += item.data.readings[read].reading + "    "
            }
        }
        for (var mean in item.data.meanings) {
            if (item.data.meanings[mean].accepted_answer === true) {
                meanings += item.data.meanings[mean].meaning + "    "
            }
        }

        return {
            "deckName": "wkexport",
            "modelName": "WKExportModel",
            "fields": {
                "question": question,
                "reading": reading,
                "meaning": meanings,
                "meaning_mnemonic": item.data.meaning_mnemonic,
                "reading_mnemonic": item.data.reading_mnemonic,
                "wkdata": JSON.stringify(item)
            },
            "tags": [
                "wkexport"
            ],
        }
    }

    function makeModel(items) {
        progressmeter.innerHTML = "Making Anki Model"
        var params = {
            "modelName": "WKExportModel",
            "inOrderFields": ["question", "reading", "meaning", "meaning_mnemonic", "reading_mnemonic", "wkdata"],
            "css": mycss,
            "cardTemplates": [
                {
                    "Front": "<div class=expression>{{question}}</div>",
                    "Back": "{{FrontSide}}<hr id=answer>{{reading}}<br><div style='font-size: 25px;'>{{meaning}}<br>{{meaning_mnemonic}}<br>{{reading_mnemonic}}</div>"
                }
            ]
        }
        invoke('createModel',6,params).then(makeCards(items))
    }

    function process_items(items) {
        // TODO: Do something with the items we retrieved.
        console.log('Retrieved ' + items.length + ' items.');
        console.log(items)

        // Make deck
        invoke('createDeck', 6, {deck: 'wkexport'}).then(makeModel(items))
    }
})();












