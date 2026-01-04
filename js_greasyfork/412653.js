// ==UserScript==
// @name         japanese search
// @namespace    https://gist.github.com/TheFantasticWarrior/a56b5c975818d9060ded8f8f3db07deb
// @version      0.2
// @description  Press Ctrl+J(Command+J on Mac) to search highlighted Japanese words with jisho.org or Ctrl+Shift+J for pronunciation on forvo.com
// @author       TFW
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412653/japanese%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/412653/japanese%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }
    document.addEventListener("keypress", checkKeyPressed, false);

    function checkKeyPressed(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode == "106") {
            window.open('https://forvo.com/search/'+getSelectionText());
        } else if ((e.ctrlKey || e.metaKey) && e.keyCode == "106") {
            window.open('https://jisho.org/search/'+getSelectionText());
        }
    }
})();