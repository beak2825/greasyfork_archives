// ==UserScript==
// @name        DECIPHER - Bolding, Italics, Underline
// @version     1
// @description Watches for CTRL+b/i/u to enable bolding/italicising/underlining
// @author      Scott / SSearle
// @include     https://survey-*.dynata.com/survey/selfserve/*
// @include     *:xmledit
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/403413/DECIPHER%20-%20Bolding%2C%20Italics%2C%20Underline.user.js
// @updateURL https://update.greasyfork.org/scripts/403413/DECIPHER%20-%20Bolding%2C%20Italics%2C%20Underline.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jQuery = unsafeWindow.jQuery; 	//Need for Tampermonkey or it raises warnings.

	jQuery(".xmledit").on('keydown', function ( e )							//START OF KEY CHECKER
		{																	//

			var text = "";													//Holds text to be tagged
			var tempOEBox = "<input type=\"text\" id=\"451\" size=\"5\">"	//Temporary holding place for text
			//jQuery(".xmledit").attr('tabindex',"-1");
            //jQuery(".CodeMirror-code").attr('tabindex',"-2");


			if ((e.metaKey || e.ctrlKey) && window.getSelection)			//If CTRL (or similar) key is pressed down
				{															//

				if ( String.fromCharCode(e.which).toLowerCase() === 'b')	//If B is pressed
					{														//
						console.log( "BOLD CODE" );							//Debug write
						text = window.getSelection().toString();			//Get the selected text
                        text = "<strong>" + text + "</strong>"				//Add the tags
						jQuery("#codeOutputBox").val(text)					//Put into XMLBoi for a moment
						jQuery("#codeOutputBox").select();					//Select the text
						document.execCommand('copy');						//Copy it to memory
						jQuery("#codeOutputBox").val("")					//Clean up XMLBoi
						alert("Replacement text copied to clipboard");		//Let user know text is ready
					}														//

				if ( String.fromCharCode(e.which).toLowerCase() === 'u')	//If U is pressed
					{														//
						console.log( "UNDERLINE CODE" );					//
						text = window.getSelection().toString();			//
                        text = "<u>" + text + "</u>"						//
						jQuery("#codeOutputBox").val(text)					//
						jQuery("#codeOutputBox").select();					//
						document.execCommand('copy');						//
						jQuery("#codeOutputBox").val("")					//
						alert("Replacement text copied to clipboard");		//
					}														//

				if ( String.fromCharCode(e.which).toLowerCase() === 'i')	//If I is pressed
					{														//
						console.log( "ITALIC CODE" );						//
						text = window.getSelection().toString();			//
                        text = "<em>" + text + "</em>"						//
						jQuery("#codeOutputBox").val(text)					//
						jQuery("#codeOutputBox").select();					//
						document.execCommand('copy');						//
						jQuery("#codeOutputBox").val("")					//
						alert("Replacement text copied to clipboard");		//
					}														//
				}															//
		});																	//END OF KEY CHECKER

})();