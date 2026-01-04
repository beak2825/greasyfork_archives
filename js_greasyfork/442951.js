// ==UserScript==
// @name            AO3 Text Replacer
// @namespace       https://greasyfork.org/en/users/899130
// @version         1.1
// @description     Replace certain words on AO3 fanfics with new ones of your choosing
// @author          Cor_Caroli
// @include         /https?://archiveofourown\.org/works/\d+/
// @grant           none
// @directions      See the CONFIGURATION SECTION. Edit the words in the word replacement dictionary.
// @downloadURL https://update.greasyfork.org/scripts/442951/AO3%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/442951/AO3%20Text%20Replacer.meta.js
// ==/UserScript==

/***************************/
/** CONFIGURATION SECTION **/
/***************************/

/* * Master list of words to replace. Add as many words to replace as you'd like.
// After making changes to the word replacement dictionary, save (Ctrl+S or whatever hotkey) and then refresh AO3 to see the word replacement changes.
// !! Note that WORDS ARE CASE SENSITIVE !!
// The format is:
// "old word" : "new word",
//
// Example: You want to change all instances of "pancakes" to "waffles" in the fic
// Insert a line of code:
        "pancakes" : "waffles",
// (Remember to keep the comma at the end.)
//
// Alternatively, you can just edit the placeholder code lines with the words you want. E.g. reader insert fics, triggers, etc.
* */
const replaceDictionary = {
    "old word 1" : "new word 1",
    "old word 2" : "new word 2",
    "old word 3" : "new word 3",
    "old word 4" : "new word 4",
    "old word 5" : "new word 5",
    "old word 6" : "new word 6",
    "old word 7" : "new word 7",
};



/********************/
/** SCRIPT SECTION **/
/********************/

// Finds the target div element of the fic and drills down to its innerHTML
var origFic = document.querySelector('#main').innerHTML;

// Function that processes the text replacements in the fic
function ficProcessing(){
    // Initialize variable
    var changedFic = origFic;

    for (let w in replaceDictionary){

        // Needs a regex in order to replace words not in hyperlinks (replacing words in hyperlinks can lead to broken links when navigating to other pages)
        // Checks for hyperlinks and replaces the anchor text, but not the URL
        var regex = new RegExp("(?<!\<[^>]*)\\b" + w + "\\b", 'g');

        changedFic = changedFic.replace(regex, replaceDictionary[w]);
    }

    // Replaces the fic with the new words
    document.querySelector('#main').innerHTML = changedFic;
};

// Runs the function
ficProcessing();