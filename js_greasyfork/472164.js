// ==UserScript==
// @name         Sort character lists alphabetically
// @namespace    http://f-list.net/c/Grimokk
// @version      1.2
// @description  The character lists are not sorted alphabetically, making finding characters in the more difficult than it should be. This script sorts them across the page.
// @author       Grimokk
// @match        https://www.f-list.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f-list.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472164/Sort%20character%20lists%20alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/472164/Sort%20character%20lists%20alphabetically.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function _gmSortCharacterList(target) {

        //https://stackoverflow.com/questions/13033472/ordering-a-select-with-javascript-without-jquery
        var sorted = Array.prototype.slice.call(target.options).sort(function(a, b) {
            if(a.label < b.label) return -1;
            if(a.label > b.label) return 1;
            return 0;
        });

        for(var i = 0; i < sorted.length; i++) {
            target.add(sorted[i]);
        }

    }

    // get element used to fill in character lists on note page
    var _gmCharListNotes = document.getElementById("NoteVarCharacters");
    var _gmCharListOther = document.getElementsByName("character_id");
    var _gmCharListChatLogs = document.getElementById("character");


    // only try sorting this if the element actually exists
    if(_gmCharListNotes) {
        _gmSortCharacterList(_gmCharListNotes);
    }

    // only try sorting this if the element actually exists and is a select element
    if(_gmCharListOther && _gmCharListOther.length > 0 && _gmCharListOther[0].type === "select-one") {
        _gmSortCharacterList(_gmCharListOther[0]);
    }

    // only try sorting this if we're on the chat3 page and it is a select element
    if(window.location.href.includes("chat3") && _gmCharListChatLogs && _gmCharListChatLogs.type === "select-one") {
        _gmSortCharacterList(_gmCharListChatLogs);
    }

    // observe document title so we can ensure that character list in logs modal gets sorted again
    // https://stackoverflow.com/questions/2497200/how-to-listen-for-changes-to-the-title-element
    if(window.location.href.includes("chat3")) {
        new MutationObserver(function(mutations) {
            var _gmTitleText = mutations[0].target.innerText;
            if(!_gmTitleText.includes("(") && !_gmTitleText.includes(")")) {
                return;
            }

            // give chat a little bit of time to shuffle the character list before we attempt to sort it
            const characterSortTimeout = setTimeout(function() {
                // using the same ID multiple times is a no-no, but it happens in chat3, so...
                var characterSelects = document.querySelectorAll("[id='character']");

                for(var i = 0; i < characterSelects.length; i++) {
                    if(characterSelects[i].type === "select-one") {
                        _gmSortCharacterList(characterSelects[i]);
                    }
                }
            }, 2000);

        }).observe(
            document.querySelector('title'),
            { subtree: true, characterData: true, childList: true }
        );
    }

})();