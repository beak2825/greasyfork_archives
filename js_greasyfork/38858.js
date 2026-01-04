// ==UserScript==
// @name         KTANE Manual Renamer
// @namespace    https://matthewmccaskill.ml/
// @version      1.1
// @description  Rename some of the alternate manuals to a more descriptive title.
// @author       ZekNikZ
// @match        https://ktane.timwi.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38858/KTANE%20Manual%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/38858/KTANE%20Manual%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
	    // For the sake of...observation...let's output the mutation to console to see how this all works
	    mutations.forEach(function(mutation) {
		    console.log(mutation.type);
	    });

        $('.manual-select > a > li').each(function(e){
            $(this).text($(this).text().replace(/embellished/g, 'manual with some extra blah put in')
                     .replace(/translated full/g, 'manual with different-looking blah instead')
                     .replace(/translated/g, 'manual with some different-looking blah instead')
                     .replace(/cheat sheet/g, 'manual with all of the blah cut out')
                     .replace(/blank sheet/g, 'manual with some of the blah erased')
                     .replace(/steps skipped/g, 'manual with some of the blah done already')
                     .replace(/optimized/g, 'manual with with some better blah instead')
                     .replace(/rearranged/g, 'manual with the blah in a different order')
                     .replace(/original/g, 'manual with the original blah instead')
                     .replace(/lookup table/g, 'manual with all of the blah done already in table form')
                     .replace(/card reference/g, 'manual with some of the blah explained')
                     .replace(/names/g, 'manual with some of the blah named')
                     .replace(/colored/g, 'manual with some of the blah in color')
                     .replace(/interactive/g, 'manual with interactive blah')
                     .replace(/reworded/g, 'manual with some different blah instead')
                     .replace(/flipped/g, 'manual with the blah flipped')
                     .replace(/condensed/g, 'manual with some of the blah cut out'));
        });
    });
    observer.observe(document.body, {attributes: false, childList: true, characterData: false});
})();