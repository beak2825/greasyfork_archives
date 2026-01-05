// ==UserScript==
// @name       		Judgment Requester
// @version    		0.1
// @description  	Judgment Requesterv
// @match      		https://www.mturkcontent.com/dynamic/hit*
// @match      		https://s3.amazonaws.com/mturk_bulk/hits/*
// @require			http://code.jquery.com/jquery-latest.min.js
// @copyright  		2014+, ChetManley
// @namespace x
// @downloadURL https://update.greasyfork.org/scripts/2564/Judgment%20Requester.user.js
// @updateURL https://update.greasyfork.org/scripts/2564/Judgment%20Requester.meta.js
// ==/UserScript==

var content = document.getElementById("wrapper");
content.tabIndex = "0";
content.focus();

document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
    switch (keycode) {
        case 65: //A
            $("input:radio[name='item']").val(['-2']);
            document.getElementById("mturk_form").submit();
            break;
        case 83: //S
            $("input:radio[name='item']").val(['-1']);
            document.getElementById("mturk_form").submit();
            break;
        case 68: //D
            $("input:radio[name='item']").val(['0']);
            document.getElementById("mturk_form").submit();
            break;
        case 70: //F
            $("input:radio[name='item']").val(['1']);
            document.getElementById("mturk_form").submit();
            break;
        case 71: //G
            $("input:radio[name='item']").val(['2']);
            document.getElementById("mturk_form").submit();
            break;
           }
}