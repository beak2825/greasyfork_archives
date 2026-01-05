// ==UserScript==
// @name       jawz Bark Engineering
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://www.mturkcontent.com/*
// @match      https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21963/jawz%20Bark%20Engineering.user.js
// @updateURL https://update.greasyfork.org/scripts/21963/jawz%20Bark%20Engineering.meta.js
// ==/UserScript==

if($("*:contains('Below is a message received by an 8 year old on social media')").length > 0) {
    window.focus();
    $('label:contains("Cyberbullying")').before('1.');
    $('label:contains("Depression")').before('2.');
    $('label:contains("Drug")').before('3.');
    $('label:contains("Sexual")').before('4.');
    $('label:contains("Violence")').before('5.');
    $('label:contains("None")').before('6.');
    
    $('input[value="none"]').click();
    
    $(document).keyup(function (event) {
	    var key = event.keyCode;

	    if (key=='97')
	        $('input[value="cyberbullying"]').click();
        
        if (key=='98')
	        $('input[value="depression"]').click();
        
        if (key=='99')
	        $('input[value="drugs"]').click();
        
        if (key=='100')
	        $('input[value="sex"]').click();
        
        if (key=='101')
	        $('input[value="violence"]').click();
        
        if (key=='102')
	        $('input[value="none"]').click();

	    //if (key=='13')
            //$('#submitButton').click();
	});
} if($("*:contains('Is this child being cyberbullied')").length > 0) {
    $('input[value="cyberbullying"]').click(function() { $('input[value="none"]').click(); });
}