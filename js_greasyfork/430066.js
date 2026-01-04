// ==UserScript==
// @name         Zhongwen Anki Addon
// @description  Adds Anki Connect functionality to the Zhongwen browser extension
// @version      0.6
// @include      *
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @namespace    https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/430066/Zhongwen%20Anki%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/430066/Zhongwen%20Anki%20Addon.meta.js
// ==/UserScript==

(async function() {
    /* ====================SETUP==================== */

    // The name of the deck where to look for and add cards
    const DECK = ">汉语<";

    // The type of card to add in case no card was found
    const CARD_TYPE = "Chinese (Advanced)";

    // The name of the field where the word (i.e. the highlighted text, just like with ALT+X/Skritter)
    // should be inserted. All other fields are left blank.
    // (I use an Anki addon called "Chinese Support Redux" to fill out the rest of the fields)
    const WORD_FIELD = "Hanzi";

    /* ===================OPTIONS=================== */

    // Which key to use to add the current word to Anki.
    const KEY = 'q';

    // Whether or not to open the Anki card browser when pressing the key.
    const OPEN_BROWSER = true;

    /* ============================================= */



    function anki(action, params={}, version=6) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:8765",
                data: JSON.stringify({action, version, params}),
                headers:    {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: (response) => {
                    response = JSON.parse(response.responseText);
                    // console.log(response);
                    try {
                        if (Object.getOwnPropertyNames(response).length != 2) {
                            throw 'response has an unexpected number of fields';
                        }
                        if (!response.hasOwnProperty('error')) {
                            throw 'response is missing required error field';
                        }
                        if (!response.hasOwnProperty('result')) {
                            throw 'response is missing required result field';
                        }
                        if (response.error) {
                            throw response.error;
                        }
                        resolve(response.result);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: () => {
                    reject('failed to issue request');
                }
            });
        });
    }

    window.addEventListener('keydown',async (ev) => {
        console.log(ev);

        const zhongwen_window = document.getElementById('zhongwen-window');
        if(zhongwen_window != null && zhongwen_window.style.display != 'none') {
            if(ev.key == KEY) {
                ev.preventDefault();

                const word = window.getSelection().toString();
                if(word != "") {
                    const query = 'deck:"'+DECK+'" '+WORD_FIELD+':"'+word+'"';
                    const notes = await anki('findNotes',{"query":query});
                    console.log(notes);

                    if(notes.length == 0) {
                        const field_names = await anki('modelFieldNames',{'modelName': CARD_TYPE});
                        if(field_names.indexOf(WORD_FIELD) > -1) {
                            const fields = {};
                            for(const fn in field_names) {
                                fields[fn] = "";
                            }
                            fields[WORD_FIELD] = word;

                            console.log(await anki('addNote',{'note':{
                                'deckName':DECK,
                                'modelName':CARD_TYPE,
                                'fields':fields,
                                'options':{},'tags':[]}}));
                        } else {
                            console.log("Zhongwen Anki Addon ERROR: The provided CARD_TYPE does not contain the field WORD_FIELD!");
                        }
                    }
                    if(OPEN_BROWSER) {
                        anki('guiBrowse',{'query':query});
                    }
                }
            }
        }
    });
})();
