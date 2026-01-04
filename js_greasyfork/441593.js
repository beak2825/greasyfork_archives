// ==UserScript==
// @name         Poprawiacz "na Ukrainie" zamiast "w Ukrainie"
// @version      0.1
// @description  Prosty skrypt zamieniający w tekstach określenie "w Ukrainie" na lepiej brzmiące "na Ukrainie"
// @author       Luck_89
// @match        https://*/*
// @match        http://*/*
// @exclude      https://greasyfork.org/*
// @icon         https://i.imgur.com/SfaEDIN.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/888116
// @downloadURL https://update.greasyfork.org/scripts/441593/Poprawiacz%20%22na%20Ukrainie%22%20zamiast%20%22w%20Ukrainie%22.user.js
// @updateURL https://update.greasyfork.org/scripts/441593/Poprawiacz%20%22na%20Ukrainie%22%20zamiast%20%22w%20Ukrainie%22.meta.js
// ==/UserScript==

var replaceArry = [
    [/w Ukrainie/g,    'na Ukrainie'],
    [/w Ukrainę/g,     'na Ukrainę'],
    [/W Ukrainie/g,    'Na Ukrainie'],
    [/W UKRAINIE/g,    'NA UKRAINIE'],
    [/W Ukrainę/g,     'Na Ukrainę'],
    [/. w ukrainie/g,    '. Na Ukrainie'],
    [/. w ukrainę/g,     '. Na Ukrainę'],
    [/w ukrainie/g,    'na Ukrainie'],
    [/w ukrainę/g,     'na Ukrainę'],
    [/W ukrainie/g,    'Na Ukrainie'],
    [/W ukrainę/g,     'Na Ukrainę'],
    // itd.
];
var numTerms    = replaceArry.length;
var txtWalker   = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {   acceptNode: function (node) {
        if (node.nodeValue.trim() )
            return NodeFilter.FILTER_ACCEPT;

        return NodeFilter.FILTER_SKIP;
    }
    },
    false
);
var txtNode     = null;

while (txtNode  = txtWalker.nextNode () ) {
    var oldTxt  = txtNode.nodeValue;

    for (var J  = 0;  J < numTerms;  J++) {
        oldTxt  = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    txtNode.nodeValue = oldTxt;
}