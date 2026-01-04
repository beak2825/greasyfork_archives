// ==UserScript==
// @name         GC Block Pet Names
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.2
// @description  Allows you to block specific pet names and replace them with "A Neopet".
// @author       sanjix
// @match        https://www.grundos.cafe/userlookup/?user=*
// @match        https://www.grundos.cafe/petlookup/?pet_name=*
// @match        https://www.grundos.cafe/palette/*
// @match        https://www.grundos.cafe/~*
// @match        https://www.grundos.cafe/*/?pet_name=*
// @match        https://www.grundos.cafe/book_award/*
// @match        https://www.grundos.cafe/music_pros/*
// @match        https://www.grundos.cafe/plushie_pros/*
// @match        https://www.grundos.cafe/gourmet_club/*
// @match        https://www.grundos.cafe/dome/1p/highscores/*
// @match        https://www.grundos.cafe/island/training/?type=toppets
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523064/GC%20Block%20Pet%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/523064/GC%20Block%20Pet%20Names.meta.js
// ==/UserScript==

// Enter pet names exactly as they appear on the site between the [] brackets on line 25 below.
// Each name should be in quotation marks (single or double is fine). Separate names with commas.
// For example the line below would hide the pets with the names "Pet 1", "Pet2", and "No":
// var block = ['Pet 1', 'Pet2', 'No'];
var block = [];
var petNames = document.querySelectorAll('.ul--petname, .pet--name, .pet--traits--name, .pet--petpetheader strong');
var header = document.querySelector('h1');
var text = document.querySelectorAll('#page_content a, #page_content p, #page_content strong, #page_content em, #page_content h2, #page_content b, #page_content h3, #page_content h4, #page_content h5, #page_content h6');

// If you want to customize the replacement text, change the text between the single quotes in the line below
var replace = 'A Neopet';
petNames.forEach((name) => {
    if (block.includes(name.textContent)) {
        name.textContent = replace;
    }
});
block.forEach((name) => {
    if (header != null && header.textContent.includes(name)) {
        header.textContent = header.textContent.replace(name, replace);
    }
//     var pageText = document.evaluate('//em[contains(.,' + name + ')]',
//         document,
//         null,
//         XPathResult.ANY_UNORDERED_NODE_TYPE,
//         null
//     );
//     if (pageText.singleNodeValue != null && pageText.singleNodeValue.textContent.includes(name)) {
//         pageText.singleNodeValue.textContent = pageText.singleNodeValue.textContent.replace(name, replace);
//     }
});
text.forEach((node) => {
    if (node.children.length == 0) {
        block.forEach((name) => {
            if (node.textContent.includes(name)) {
                node.textContent = node.textContent.replaceAll(name, replace);
            }
        });
    }
});
