// ==UserScript==
// @name         Select Text Dictionaries
// @version      1
// @description  copy text block oxford dictionary
// @author       Davi Cardoso
// @include      https://www.oxfordlearnersdictionaries.com/*
// @include      https://www.ldoceonline.com/dictionary/*
// @include      https://learnersdictionary.com/definition/*
// @include      https://www.collinsdictionary.com/dictionary/english/*
// @include      https://www.merriam-webster.com/dictionary/*
// @include       https://www.thefreedictionary.com/*
// @include      https://idioms.thefreedictionary.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      Apache-2.0
// @namespace https://greasyfork.org/users/698317
// @downloadURL https://update.greasyfork.org/scripts/414642/Select%20Text%20Dictionaries.user.js
// @updateURL https://update.greasyfork.org/scripts/414642/Select%20Text%20Dictionaries.meta.js
// ==/UserScript==
(() => {
    "use strict";


$(".inflections, .def, .x, .phon, .pos, .headword, .shcut, .grammar, .vf_prefix, .idm, .pv, .use, .labels, .cf, .dis-g, .prefix, .v, .variants, .DEF, .GRAM, .EXAMPLE, .simpleForm, .exa, .PROPFORMPREP, .PRON, .POS, .LEXUNIT, .PHRVBHWD, .HYPHENATION, .COLLO, .GLOSS, .REFHWD, .PROPFORM, .Inflections, .AMEVARPRON, .SIGNPOST, .COLLOC, .COLLGLOSS, .def_text, .vi, .dre, .both_text, .v_text, .hw_infs_d m_hidden, .quote, .dtText, .ex-sent, .drp, .col, .ds-list, .illustration, .idmseg, .ds-single").on('click', function() {
	var sel, range;
	var el = $(this)[0];
	if (window.getSelection && document.createRange) { //Browser compatibility
	  sel = window.getSelection();
	  if(sel.toString() == ''){ //no text selection
		 window.setTimeout(function(){
			range = document.createRange(); //range object
			range.selectNodeContents(el); //sets Range
			sel.removeAllRanges(); //remove all ranges from selection
			sel.addRange(range);//add Range to a Selection.
             document.execCommand('copy');
            setTimeout(function () {
            var selection = window.getSelection(); // clear text range
            selection.removeAllRanges();
            }, 400);
		},1);
	  }
	}else if (document.selection) { //older ie
		sel = document.selection.createRange();
		if(sel.text == ''){ //no text selection
			range = document.body.createTextRange();//Creates TextRange object
			range.moveToElementText(el);//sets Range
			range.select(); //make selection.
            document.execCommand('copy');
            setTimeout(function () {
            var selection = window.getSelection(); // clear text range
            selection.removeAllRanges();
            }, 400);
		}
	}
});

})();