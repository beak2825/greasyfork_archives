// ==UserScript==
// @name         Copy and Past All
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world! FY
// @author       Kriz
// @copyright    2017+ Kriz
// @match        https://tac.trecom.pl/mcd-serwis/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31623/Copy%20and%20Past%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/31623/Copy%20and%20Past%20All.meta.js
// ==/UserScript==

jQuery(function($) {   
    	$("#merchant").keydown(function(e){
    		if (e.keyCode == 9 && !e.shiftKey ) {
    			e.preventDefault();
    			$("#contactPerson").focus();
    		}
	});
    	$("#ticketCategory").keydown(function(f){
    		if (f.keyCode == 9 && ! f.shiftKey) {
    			f.preventDefault();
    			$("#title").focus();
    		}
    	});
            $("#title").keyup(function(){
        	if ($("#title").val) { // checked
        	var copyText = $("#title").val();
            $("#description").val(copyText);
    	}
	});
     var select = dijit.byId('statusId');
       select.on('change', function(){
            var copyClose = $("#dijit_form_TextBox_9").val();
            $("#fixAccepter").val(copyClose);
    });
});