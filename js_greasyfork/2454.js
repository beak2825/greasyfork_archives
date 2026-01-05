// ==UserScript==
// @name        InoReader - Open Article in Background Tab
// @author      Rameez Khan
// @namespace   plus.google.com/+RameezKhanSA
// @description Fixes Firefox functionality to allow for opening of background tabs in InoReader
// @include     http://www.inoreader.com/
// @grant          GM_openInTab
// @version        1.0.0
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2454/InoReader%20-%20Open%20Article%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/2454/InoReader%20-%20Open%20Article%20in%20Background%20Tab.meta.js
// ==/UserScript==

/* 
    Author:  Rameez Khan (plus.google.com/+RameezKhanSA)
    
    Changelist:
       1 : Initial workings
    
    A special thanks to Lyk for pushing me in the right direction with his userscript for feedly (userscripts.org/users/Lyk)
*/

jQuery.noConflict();

(function() {
	var background_key = 59;
		/* 72 is for the ';'-key
		** pick the corresponding number from here: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		*/

	
	jQuery(document).keydown(function(e) {
		if ( e.which == background_key && !(e.altKey || e.ctrlKey || e.metaKey) ) {
			var el = document.activeElement;
    
			// if in textfield, do nothing
			if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' ||
					el.tagName.toLowerCase() == 'textarea')) {
				return true;  
			}
            
//             alert("pressed!");
            var activeElem = jQuery('div#reader_pane');
//             console.log(activeElem);
            
            var articleKids = activeElem.children('div.article_current').children('div.article_full_contents').children('div.article_title').children('a.article_title_link');
//             console.log(articleKids.attr('href'));
            GM_openInTab(articleKids.attr('href'), true);
            
			return true; // To supress default behavior of the event
			// Added for those who have "search as I type" features enabled, etc
		}
	});
})();