// ==UserScript==
// @name         WaniKani Frequent Incorrect Responses
// @namespace    wkfir
// @version      0.3.0
// @description  Save incorrect responses in notes and display them in item info
// @author       Scott Duffey
// @copyright    2020+, Scott Duffey
// @license      0BSD; https://opensource.org/licenses/0BSD
// @match        https://www.wanikani.com/review/session
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/408249/WaniKani%20Frequent%20Incorrect%20Responses.user.js
// @updateURL https://update.greasyfork.org/scripts/408249/WaniKani%20Frequent%20Incorrect%20Responses.meta.js
// ==/UserScript==
// jshint esversion: 6
(function() {
    'use strict';
    const apiToken = 'API TOKEN HERE';
    var subject;
    var subjectType;
    var readingResponses = undefined;
    var meaningResponses = undefined;
    var promiseRead;
    var promiseWrite;

    async function getNotes(apiToken, subject, subjectType) {
        const headers =
            new Headers({
                'Wanikani-Revision': '20170710',
                Authorization: `Bearer ${apiToken}`,
            });
        var notes = {
            studyMaterialId: '',
            readingNote: null,
            meaningNote: null
        };
        var response = await fetch(`https://api.wanikani.com/v2/subjects?slugs=${subject}&types=${subjectType}`, {
            method: 'GET',
            headers: headers
        });
        var responseBody = await response.json();
        notes.subjectId = responseBody.data[0].id;
        response = await fetch(`https://api.wanikani.com/v2/study_materials?subject_ids=${notes.subjectId}`, {
            method: 'GET',
            headers: headers
        });
        responseBody = await response.json();
        if (responseBody.total_count > 0) {
            notes.studyMaterialId = responseBody.data[0].id;
            const data = responseBody.data[0].data;
            notes.readingNote = data.reading_note;
            notes.meaningNote = data.meaning_note;
        }
        return notes;
    }

    function parseNote(note) {
        if (!note) {
            note = '';
        }
        var parse = {
            before: note + '\n',
            data: {},
            after: ''
        };
        var existing;
        if ((existing = note.match(/{([^}]*)}/))) {
            parse.before = note.substring(0, existing.index);
            parse.after = note.substring(existing.index + existing[0].length, note.length);
            parse.data = JSON.parse(existing[0]);
        }
        return parse;
    }

    // Monitor for when the review item changes
    const character = document.getElementById('character');
    const characterObserver = new MutationObserver(function() {
        subject = character.getElementsByTagName('span')[0].innerText;
        subjectType = character.className;
        readingResponses = undefined;
        meaningResponses = undefined;
        promiseRead = getNotes(apiToken, subject, subjectType);
        promiseWrite = null;
    });
    characterObserver.observe(character, { childList: true, subtree: true });

    // Monitor for when the input bar to turns red
    const inputBar = document.getElementsByTagName('fieldset')[0];
    const inputBarObserver = new MutationObserver(function() {
        if (document.getElementsByClassName('incorrect').length === 0) {
            return;
        }
        if (subjectType === 'radical') {
            return;
        }
        const isReading = document.getElementById('question-type').className === 'reading';
        const userResponse = document.getElementById('user-response').value;
        promiseWrite = promiseRead
        .then(notes => {
            var requestData = {
                study_material: {}
            };
            var note;
            var method;
            if (notes.studyMaterialId) {
                method = 'PUT';
                note = isReading ? notes.readingNote : notes.meaningNote;
                const parsedNote = parseNote(note);
                parsedNote.data[userResponse] = parsedNote.data[userResponse] ? parsedNote.data[userResponse] + 1 : 1;
                note = parsedNote.before + JSON.stringify(parsedNote.data) + parsedNote.after;
            } else {
                method = 'POST';
                requestData.study_material.subject_id = notes.subjectId;
                var data = {};
                data[userResponse] = 1;
                note = JSON.stringify(data);
            }
            requestData.study_material[isReading ? 'reading_note' : 'meaning_note'] = note;
            if (isReading) {
                notes.readingNote = note;
            } else {
                notes.meaningNote = note;
            }
            GM_xmlhttpRequest({
                method: method,
                url: `https://api.wanikani.com/v2/study_materials/${notes.studyMaterialId}`,
                headers: {
                    'Wanikani-Revision': '20170710',
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(requestData)
            });
            return notes;
        });
    });
    inputBarObserver.observe(inputBar, { attributeFilter: ['class'] });


    // When the user displays item info, insert incorrect response data
    var itemInfo = document.getElementById('item-info-col2');
    const itemInfoObserver = new MutationObserver(function() {
        if (subjectType === 'radical') {
            return;
        }
        var promise = promiseWrite ? promiseWrite : promiseRead;
        promise.then(notes => {
            function insertResponses(itemInfo, nextElement, element, text, note) {
                if (nextElement && !element) {
                    var section = document.createElement('section');
                    var h2 = document.createElement('h2');
                    h2.innerText = text;
                    section.appendChild(h2);
                    element = itemInfo.insertBefore(section, nextElement);
                    if (note) {
                        var parsedNote = parseNote(note);
                        var p = document.createElement('p');
                        for (const response in parsedNote.data) {
                            p.innerHTML += response + ': ' + parsedNote.data[response] + '<br>';
                        }
                        section.appendChild(p);
                    }
                }
                return element;
            }
            var itemInfo = document.getElementById('item-info-col2');
            const afterReadingResponses = document.getElementById('item-info-reading-mnemonic');
            readingResponses = insertResponses(itemInfo, afterReadingResponses, readingResponses, 'Incorrect Reading Responses', notes.readingNote);
            if (readingResponses) {
                readingResponses.style.display = afterReadingResponses.style.display;
            }
            const afterMeaningResponses = document.getElementById('item-info-meaning-mnemonic');
            meaningResponses = insertResponses(itemInfo, afterMeaningResponses, meaningResponses, 'Incorrect Meaning Responses', notes.meaningNote);
            if (meaningResponses) {
                meaningResponses.style.display = afterMeaningResponses.style.display;
            }
        });
    });
    itemInfoObserver.observe(itemInfo, { childList: true, subtree: true, attributeFilter: ['style'] });
})();