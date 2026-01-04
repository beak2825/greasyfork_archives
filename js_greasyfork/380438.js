// ==UserScript==
// @name         Tools4noobs Summarize: Autocheck all checkboxes
// @namespace    https://greasyfork.org/en/scripts/380438-tools4noobs-summarize-autocheck-all-checkboxes
// @version      1
// @description  automatically check all boxes on Online summarize tool (free summarizing)
// @author       You
// @match        https://www.tools4noobs.com/summarize/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380438/Tools4noobs%20Summarize%3A%20Autocheck%20all%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/380438/Tools4noobs%20Summarize%3A%20Autocheck%20all%20checkboxes.meta.js
// ==/UserScript==

var show_relevance = document.getElementById("show_relevance");
show_relevance.checked = true;

var show_best_words = document.getElementById("show_best_words");
show_best_words.checked = true;

var show_keyheigh = document.getElementById("show_keyheigh");
show_keyheigh.checked = true;

var show_sentences = document.getElementById("show_sentences");
show_sentences.checked = true;