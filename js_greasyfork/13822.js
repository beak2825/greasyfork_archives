// ==UserScript==
// @name         A9 Validation (all keybindings)
// @namespace    https://greasyfork.org/users/11580
// @version      1.3
// @icon         http://i.imgur.com/hKKkPgY.png
// @description  Category Validation and Logo Validation
// @description  Validate an image. 
// @author       Kadauchi (and bottles)
// @include      https://www.mturkcontent.com/dynamic/*
// @include      https://s3.amazonaws.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/13822/A9%20Validation%20%28all%20keybindings%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13822/A9%20Validation%20%28all%20keybindings%29.meta.js
// ==/UserScript==

var autosubmit = false;

// Variable to check for the type of HIT.
var Category_Validation = $('u:contains("Select the first option that applies to the image on the ")');

if (Category_Validation.length) {
	
	$("#truth").click(function(){
		$("input[value='Valid_Object']").click();
	});

    $("input[value='Missing_Object']").focus();
	$("input[value='Missing_Object']").click();

    // Keybinds
    window.onkeydown = function(e) {

        // Only one.
        if (e.keyCode === 96) { // Numpad0
            $("input[value='Valid_Object']").click();
            $("input[value='Partial_Object']").prop('checked', false);
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }

        // Only one, blocked or out.
        if (e.keyCode === 98) { // Numpad2
            $("input[value='Valid_Object']").click();
            $("input[value='Partial_Object']").click();
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }

        // More than one.
        if (e.keyCode === 99) { // Numpad3
            $("input[value='Multiple_Objects']").click();
            $("input[value='Partial_Object']").prop('checked', false);
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }
        
        // Unsure (bottles' addition)
        if (e.keyCode === 97) { // Numpad1
            $("input[value='Cannot_See_Unsure']").click();
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }

        // The image contains adult content and/or obscenity and/or financial and/or residential addresses.
        if (e.keyCode === 100) { // Numpad4
            $("input[value='Obscene_Finance']").click();
            $("input[value='Partial_Object']").prop('checked', false);
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }

        // No.
        if (e.keyCode === 101) { // Numpad5
            $("input[value='Missing_Object']").click();
            $("input[value='Partial_Object']").prop('checked', false);
            if (autosubmit) {
                $("input[id='submitButton']").click();
            }
        }

        //Submit
        if (e.keyCode === 13) { // Enter or NumpadEnter 
            $("input[id='submitButton']").click();
        }
    };
}

// Makes radio and checkboxes bigger.
$("input[type='radio']").css({ width: '1.25em', height: '1.25em'});
$("input[type='checkbox']").css({ width: '1.25em', height: '1.25em'});