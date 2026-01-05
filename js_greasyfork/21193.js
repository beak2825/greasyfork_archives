// ==UserScript==
// @name         Jan Falkowski - Mark poles and transformers
// @version      1.1
// @description  Making things happen
// @author       jawz
// @match        https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21193/Jan%20Falkowski%20-%20Mark%20poles%20and%20transformers.user.js
// @updateURL https://update.greasyfork.org/scripts/21193/Jan%20Falkowski%20-%20Mark%20poles%20and%20transformers.meta.js
// ==/UserScript==

if($("*:contains('Search for areas where electrical wires')").length > 0) {
    $('li').hide();
    $('p').hide();
    $('img').slice(0,4).hide();
    $('#add-wire-rect').click();
    
    $(document).keyup(function (event) {
	    var key = event.keyCode;

	    if (key=='82')
	        $('#remove-rect').click();

	    if (key=='83')
            $('#submit-hit').click();
	});
}

if($("*:contains('Your task is to mark the biggest utility poles')").length > 0) {
    $('li').hide();
    $('p').hide();
    $('img').slice(0,2).hide();
    $('#add-pole1').click();
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Redo';
    btn.type = "button";
    btn.onclick = function() { 
        count = 0;
        $('img').click();
        count = 0;
        $('img').click();
        count = 0;
        $('img').click();
        count = 0;
        for (i=0;i<7;i++) {
            count = 0;
            $('#remove-rect').click();
        }
        $('#add-pole1').click();
        count = 0;
    };
    
    $('#remove-rect').after (btn);
    
    
    var count = 0;

    $('img').click(function () {
        count += 1;

        if (count == 2) {
            $('#add-pole2').click();
        } else if (count == 4) {
            $('#add-pole3').click();
        } else if (count == 6) {
            $('#add-pole4').click();
        } else if (count == 8) {
            $('#add-pole5').click();
        } else if (count == 10) {
            $('#add-pole6').click();
        } 
    });
    $(document).keyup(function (event) {
	    var key = event.keyCode;

	    if (key=='49')
	        $('#add-pole1').click();

	    if (key=='50')
            $('#add-pole2').click();
    
        if (key=='51')
	        $('#add-pole3').click();
    
	    if (key=='52')
            $('#add-pole4').click();
 
        if (key=='53')
            $('#add-pole5').click();

        if (key=='54')
	        $('#add-pole6').click();

	    if (key=='82')
            $('#remove-rect').click();
 
        if (key=='83')
            $('#submit-hit').click();
	});
}