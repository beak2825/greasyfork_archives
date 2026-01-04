// ==UserScript==
// @name        Highlight Player - Chess-Results
// @description Highlights player names on chess-results.com for better readability
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @grant    GM.getValue
// @version     1.2
// @author      Luca
// @match       https://*.chess-results.com/*
// @namespace https://greasyfork.org/users/1507703
// @downloadURL https://update.greasyfork.org/scripts/546782/Highlight%20Player%20-%20Chess-Results.user.js
// @updateURL https://update.greasyfork.org/scripts/546782/Highlight%20Player%20-%20Chess-Results.meta.js
// ==/UserScript==

// Customizable values and player names here
// -----------------------------------------
const highlightColor = 'pink';

highlightPlayer('John','Smith');
highlightPlayer('Anna','Davis');
// End of customizable section
// -----------------------------------------

function highlightPlayer(name, surname) {
	const namesVariations = [name + ' ' + surname, surname + ' ' + name, surname + ', ' + name];
	namesVariations.forEach(highlightWord);
}
function highlightWord(word) {
    const xpath = "//text()[contains(., '" + word + "')]";
    const matches = document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (n = 0; n < matches.snapshotLength; n++) {
        const textNode = matches.snapshotItem(n);
        const parentNode = textNode.parentNode;
        const frag = document.createDocumentFragment();
        textNode.nodeValue.split(word).forEach(function(text, i) {
            var node;
            if (i) {
                node = document.createElement('span');
                node.style.backgroundColor = highlightColor;
                node.appendChild(document.createTextNode(word));
                frag.appendChild(node);
            }
            if (text.length) {
                frag.appendChild(document.createTextNode(text));
            }
        });
        parentNode.replaceChild(frag, textNode);
    }
}