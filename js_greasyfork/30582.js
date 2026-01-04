// ==UserScript==
// @name         Duolingo Vocab Search
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Search words from the language you are learning on Duolingo.
// @author       Nekosuki
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30582/Duolingo%20Vocab%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/30582/Duolingo%20Vocab%20Search.meta.js
// ==/UserScript==

GM_addStyle("#vocab-search{ position: fixed; top: 25%; left: 50%; z-index: 2000; width: 550px; margin: 0 0 0 -275px; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3); transition: all 0.2s ease-in-out; opacity: 0 } #vocab-search input { width:100%; border: none; background: #fff; font: 500 24px/32px 'museo-sans-rounded', sans-serif; padding: 5px 10px; color: #4b4b4b; border-radius: 5px; box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05); -webkit-font-smoothing: antialiased; text-align: left; line-height: 24px; padding: 12px 16px; } #vocab-search input::placeholder{ padding-top:3px; font-weight: 300}");


(function() {
    "use strict";
    let modal, input, status;
    let searchInProgress = false;
    let drawModal = function() {
        modal = document.createElement("div");
        modal.id = "vocab-search";
        modal.innerHTML = '<input type="text" placeholder="Dictionary Search"><span style="position:absolute;top:16px;right:15px;color:#aaa;"></span>';
        document.body.appendChild(modal);
        input = modal.querySelector("input");
        status = modal.querySelector("span");
        input.focus();
        hideModal();
    };
    let showModal = function() {
        if(document.activeElement != document.body) return;
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        setTimeout(function() { input.focus(); }, 50);
    };
    let hideModal = function() {
        if(searchInProgress) return;
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(function() {
            input.blur();
            input.value = "";
            status.textContent = "";
        }, 250);
    };
    let toggleModal = function() {
        if(modal.style.visibility == "visible") hideModal();
        else showModal();
    };
    let getURLForWord = function(word, vocab) {
        let words = vocab.vocab_overview;
        let found = null;
        for(let i = 0; i < words.length; i++) {
            if(words[i].normalized_string.toLowerCase() == word.toLowerCase() ||
               words[i].word_string.toLowerCase() == word.toLowerCase()) {
                found = words[i];
                break;
            }
        }
        if(found !== null) {
            found = "https://www.duolingo.com/dictionary/" + vocab.language_string + "/" + found.normalized_string + "/" + found.lexeme_id;
        }
        return found;
    };
    let requestVocab = function(word) {
        searchInProgress = true;
        status.textContent = "searching";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState != 4 || this.status != 200) return;
            var obj = JSON.parse(this.responseText);
            let url = getURLForWord(word, obj);
            searchInProgress = false;
            if(url !== null) wordFound(url);
            else wordNotFound();
        };
        xhr.open("GET", "/vocabulary/overview", true);
        xhr.send();
    };
    let wordFound = function(url) {
        status.textContent = "redirecting";
        setTimeout(function(){ window.location = url; }, 50);
    };
    let wordNotFound = function() {
        status.textContent = "not found";
        input.readOnly = false;
    };
    let submitWord = function() {
        if(searchInProgress || document.activeElement != input) return;
        let word = input.value.trim();
        if(!word || word.length === 0) return;
        input.readOnly = true;
        requestVocab(word);
    };
    let init = function () {
        drawModal();
        document.addEventListener("keypress", function(event) {
            switch(event.keyCode) {
                case 47: // forward slash
                    toggleModal();
                    if(document.activeElement == input) event.preventDefault();
                    break;
                case 27: // escape
                    hideModal();
            }
        });
        input.addEventListener("keydown", function(event) {
            if(!input.readOnly) status.textContent = "";
            if(event.keyCode == 13) { // enter
                submitWord();
                event.stopPropagation();
            }
        });
        document.addEventListener("click", function(event) {
            if(!modal.contains(event.target)) hideModal();
        });
    };
    init();
})();