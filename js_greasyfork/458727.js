// ==UserScript==
// @name         WKSentenceCard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sentence Card script for wanikani
// @author       Noah
// @match        https://www.wanikani.com/review/session
// @connect      api.wanikani.com
// @connect      api.wanikani.com/v2/study_materials
// @connect      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458727/WKSentenceCard.user.js
// @updateURL https://update.greasyfork.org/scripts/458727/WKSentenceCard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Variables
    var apiToken = ""
    var currentWord = ""
    var currentSentence = ""
    var sentenceDialog = null
    var sentenceButton = null
    var this_item = null
    var isMaterial = false

    // Load Dependencies
    wkof.include('ItemData,Apiv2,Settings,Menu');

    // install menu -> load settings(apikey etc) -> create sentence button -> create key listener
    wkof.ready('ItemData,Apiv2,Settings,Menu').then(install_menu).then(load_settings).then(create_sentence_button).then(set_key_listner);

    function edit_card(sentence, del = false) {
        var request = get_sentence_id_request(this_item.id)
        fetch(request).then(response => response.json()).then(responseBody => {
            var id = responseBody.data[0].id
            var note = responseBody.data[0].data.meaning_note
            // remove the s{} thing if nothing in sentence
            if (sentence === "") {
                sentence = note.replace(/s{.*}/gm, "")
            } else {
                if (note.match(/s{.*}/gm) !== null) {
                    sentence = note.replace(/s{.*}/gm, "s{"+sentence+"}")
                } else {
                    sentence = note+"s{"+sentence+"}"
                }
            }
            var apiEndpointPath = 'study_materials/';
            var body = {
                "study_material": {
                    "meaning_note": sentence,
                }
            }
            body = JSON.stringify(body)
            GM_xmlhttpRequest({
                method: "PUT",
                url: 'https://api.wanikani.com/v2/' + apiEndpointPath+id,
                headers: {
                    'Wanikani-Revision': '20170710',
                    'Authorization': 'Bearer ' + apiToken,
                    'Content-Type': 'application/json',
                },
                data: body,
                onload: function(response) {
                    if (del === false) {
                        //console.log("PUT response: " + response.responseText);
                        currentSentence = sentence
                        display_sentence(currentSentence)
                    } else {
                        display_sentence(currentWord)
                    }
                }
            });
        })
    }

    function make_card(sentence) {
        sentence = "s{"+sentence+"}"
        var apiEndpointPath = 'study_materials';
        var body = {
            "study_material": {
                "subject_id": $.jStorage.get("currentItem").id,
                "meaning_note": sentence,
            }
        }
        body = JSON.stringify(body)
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://api.wanikani.com/v2/' + apiEndpointPath,
            headers: {
                'Wanikani-Revision': '20170710',
                'Authorization': 'Bearer ' + apiToken,
                'Content-Type': 'application/json',
            },
            data: body,
            onload: function(response) {
                //console.log("POST response: " + response.responseText);
                currentSentence = sentence
                display_sentence(currentSentence)
            }
        });
    }

    function get_sentence_id_request(id) {
        // get the sentence note id from the item
        var apiEndpointPath = 'https://api.wanikani.com/v2/study_materials?subject_ids=';
        var requestHeaders =
            new Headers({
                'Wanikani-Revision': '20170710',
                Authorization: 'Bearer ' + apiToken,
                subject_ids:[id]
            });
        return new Request(apiEndpointPath+id, {
            method: 'GET',
            headers: requestHeaders
        });
    }

    function set_key_listner() {
        $.jStorage.listenKeyChange('currentItem', function(key, action) {
            if (action === 'updated' && typeof $.jStorage.get('currentItem').voc !== "undefined") {
                //runs when we get a new card to answer
                if ($.jStorage.get('currentItem').voc !== currentWord){
                    currentWord = $.jStorage.get("currentItem").voc
                    currentSentence = ""
                    isMaterial = false
                    fetch_items()
                } else {
                    display_sentence(currentSentence)
                }
                sentenceButton.disabled = false
            } else {
                currentSentence = ""
                currentWord = ""
                isMaterial = false
                sentenceButton.disabled = true
            }
        })
    }

    function fetch_items() {
        // config to get the study materials
        var config = {
            wk_items: {
                options: {
                    study_materials: true
                },
                filters: {
                    item_type: 'voc'
                }
            }
        };
        wkof.ItemData.get_items(config).then(process_items);
    }
    function process_items(items) {
        var type_index = wkof.ItemData.get_index(items, 'item_type');
        var voc_by_name = wkof.ItemData.get_index(type_index.vocabulary, 'slug');
        this_item = voc_by_name[currentWord]
        // if the study materials exist then ...
        if (typeof this_item.study_materials !== "undefined") {
            isMaterial = true
            if (typeof this_item.study_materials.meaning_note !== "undefined" && this_item.study_materials.meaning_note !== "") {
                currentSentence = this_item.study_materials.meaning_note
                display_sentence(currentSentence)
            }
        }
    }

    function match_sentence(sentence) {
        return sentence.match(/s{.*}/gm).toString().replace("s{", "").toString().replace("}", "").toString()
    }

    function display_sentence(sentence) {
        document.getElementById("character").getElementsByTagName("span")[0].innerHTML = (sentence !== currentWord ? match_sentence(sentence).replaceAll(currentWord, "<span style=\"color:yellow\">"+currentWord+"</span>") : currentWord)
    }

    function create_sentence_button() {
        // make the button
        create_button()
        // make the dialog for the button
        create_dialog()
        // set line height for vocab display(this probly should not be here...)
        document.getElementById("character").style.lineHeight="2.2em"
    }

    // create button
    function create_button() {
        sentenceButton = document.createElement("button");
        sentenceButton.id = "sentenceButton"
        sentenceButton.innerHTML = "文";
        sentenceButton.style.fontSize = "1rem";
        sentenceButton.style.margin = "0.5rem";
        sentenceButton.style.color = "#888888"
        sentenceButton.style.position = "absolute"
        sentenceButton.style.background = "#fbfbfb"
        sentenceButton.style.border = "thin solid white"
        sentenceButton.style.bottom = 0
        sentenceButton.style.right = 0
        document.getElementById("character").appendChild(sentenceButton);
    }

    // create dialog
    function create_dialog() {
        // create all the elements
        sentenceDialog = document.createElement("dialog")
        var form = document.createElement("form")
        var input = document.createElement("input")
        var createbtn = document.createElement("button")
        var deletebtn = document.createElement("button")
        var closebtn = document.createElement("button")

        // add style/id/etc. to elements
        sentenceDialog.id = "sentenceDialog"

        closebtn.innerHTML="close"
        createbtn.innerHTML="create"
        deletebtn.innerHTML="delete"

        // add all the elements to DOM
        document.body.appendChild(sentenceDialog);
        sentenceDialog.appendChild(form)
        form.appendChild(input)
        form.appendChild(createbtn)
        form.appendChild(closebtn)
        form.appendChild(deletebtn)

        // create the dialog buttons listners

        //click the 文 button
        sentenceButton.addEventListener("click", () => {
            sentenceDialog.showModal()
            input.value = match_sentence(currentSentence)
        })
        // the close button
        closebtn.addEventListener("click", () => {
            sentenceDialog.close()
        })
        // the create button
        createbtn.addEventListener("click", () => {
            // if there is no study material
            if (isMaterial === false) {
                make_card(input.value)
            } else {
                // else edit the note
                edit_card(input.value)
            }
            sentenceDialog.close()
        })
        // the delete button
        deletebtn.addEventListener("click", () => {
            // if there is a sentence
            if (currentSentence !== "") {
                edit_card("", true)
            }
            sentenceDialog.close()
        })

        form.addEventListener("submit", (event) => {
            event.preventDefault() // prevent from buttons from refreshing page
        })
    }

    function load_settings() {
        var defaults = {api_key: ""};
        wkof.Settings.load('settings_wksc', defaults).then(process_settings);
    }

    function process_settings(settings) {
        apiToken=settings.api_key
    }

    function install_menu() {
        wkof.Menu.insert_script_link({
            name:      'settings_wksc',
            title:     'WKSentenceCard',
            on_click:  open_settings
        });
    }

    function open_settings() {
        var config = {
            script_id: 'settings_wksc',
            title: 'WaniKani Sentence Card',
            on_save: load_settings,
            content: {
                api_key: {
                    type: 'text',
                    label: 'An API key',
                    hover_tip: 'Make sure the key has write access for notes',
                    validate: validate_api_key
                },
            }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    function validate_api_key(value, config) {
        var is_valid = wkof.Apiv2.is_valid_apikey_format(value);
        if (is_valid) {
            return {
                valid:is_valid,
                msg:"API key is valid form"
            }
        } else {
            alert("API key is not valid form")
            return "API key is not valid form"
        }

    }







})();