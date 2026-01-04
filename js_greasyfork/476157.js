// ==UserScript==
// @name         Analisi Analyzer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Substitute dates with lesson numbers
// @author       You
// @match        https://elearning.unimib.it/course/view.php?id=43165
// @match        https://elearning.unimib.it/mod/kalvidres/view.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unimib.it
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476157/Analisi%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/476157/Analisi%20Analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var replaceArry = [
        [/Lezione del 4 ottobre/gi, 'Lezione 1'],
        [/Lezione del 5 ottobre/gi, 'Lezione 2'],
        [/Lezione dell'11 ottobre/gi, 'Lezione 3'],
        [/Lezione del 12 ottobre/gi, 'Lezione 4'],
        [/Lezione del 18 ottobre/gi, 'Lezione 5'],
        [/Lezione del 19 ottobre/gi, 'Lezione 6'],
        [/Lezione del 25 ottobre/gi, 'Lezione 7'],
        [/Lezione del 26 ottobre/gi, 'Lezione 8'],
        [/Lezione del 2 novembre/gi, 'Lezione 9'],
        [/Lezione dell'8 novembre/gi, 'Lezione 10'],
        [/Lezione del 9 novembre/gi, 'Lezione 11'],
        [/Lezione del 22 novembre/gi, 'Lezione 12'],
        [/Lezione del 23 novembre/gi, 'Lezione 13'],
        [/Lezione del 25 novembre/gi, 'Lezione 14'],
        [/Lezione del 29 novembre/gi, 'Lezione 15'],
        [/Lezione del 30 novembre/gi, 'Lezione 16'],
        [/Lezione del 6 dicembre/gi, 'Lezione 17'],
        [/Lezione del 13 dicembre/gi, 'Lezione 18'],
        [/Lezione del 14 dicembre/gi, 'Lezione 19'],
        [/Lezione del 20 dicembre/gi, 'Lezione 20'],
        [/Lezione del 21 dicembre/gi, 'Lezione 21'],
        // etc.
    ];
    var numTerms = replaceArry.length;
    var txtWalker = document.createTreeWalker (
        document.body,
        NodeFilter.SHOW_TEXT,
        {acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() ) {
                return NodeFilter.FILTER_ACCEPT;
            }

            return NodeFilter.FILTER_SKIP;
        }
        },
        false
    );
    var txtNode = null;

    while (txtNode = txtWalker.nextNode () ) {
        var oldTxt = txtNode.nodeValue;

        for (var J = 0; J < numTerms; J++) {
            oldTxt = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
        }
        txtNode.nodeValue = oldTxt;
    }



})();