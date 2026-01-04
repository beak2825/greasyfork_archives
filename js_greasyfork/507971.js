// ==UserScript==
// @name         Download a vocabulary list
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  To download a vocabulary list from a topic on Oxford Learner's Dictionaries.
// @author       Vocabulary
// @match        https://www.oxfordlearnersdictionaries.com/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oxfordlearnersdictionaries.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/507971/Download%20a%20vocabulary%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/507971/Download%20a%20vocabulary%20list.meta.js
// ==/UserScript==

function saveTextToFile(text, filename) {
    var blob = new Blob([text], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function wordLists() {
    let items = $("#wordlistsContentPanel li");
    let lines = "word;position\n";
    for (var i = 0; i < items.length; i++) {
        let element = $(items[i]);
        let text = $(element).find("a").text();
        let pos = $(element).find(".pos").text();
        console.log(text, pos);
        lines += text;
        lines += ";";
        lines += pos;
        lines += "\n";
    }
    saveTextToFile(lines, 'wordLists.csv');
}

(function() {
    'use strict';
    $(document).ready(function() {
        setTimeout(wordLists, 3000);
    });
})();