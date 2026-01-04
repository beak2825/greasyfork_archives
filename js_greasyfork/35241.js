// ==UserScript==
// @name           Travian TiNA magic move option BR PT
// @version        1.0
// @description    Allows you to simply move tickets to other queue - Made by Nikola :)
// @homepage       http://www.travian.rs

// @include        https://support.traviangames.com
// @include        https://support.traviangames.com/
// @include        https://support.traviangames.com/index/

// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js

// @namespace https://greasyfork.org/users/159494
// @downloadURL https://update.greasyfork.org/scripts/35241/Travian%20TiNA%20magic%20move%20option%20BR%20PT.user.js
// @updateURL https://update.greasyfork.org/scripts/35241/Travian%20TiNA%20magic%20move%20option%20BR%20PT.meta.js
// ==/UserScript==

function allinone() {

	if($(".formMoveTicketNotice").length == 0) {
		alert("Works only when \"Answer and move\" popup is open...");
	}
	
	$('.formMoveTicketNotice').height(170);
	$('.formResponseContent').height(75);
	$(".formMoveTicketNotice").val("Hi,\n\n\n\nRegards,\nJL");
	
    var str = $(".formResponseContent").val();
	
	var res = str.replace("\n\n\n--", "\nUm membro da equipa irá analisar o seu caso o mais rapidamente possível e responder-lhe mal tenha uma resposta.\n\n--");
	
	
	$(".formResponseContent").val(res);
}

// Create the button
$('#usertoolbar').prepend("<span id='ammod' class='x-btn-text' style='right:470px; top:5px; position:absolute; cursor:pointer;'><img src='https://support.traviangames.com/images/cog_edit.png' style='margin-bottom:-3px;'/> Magic move :)</span>");


$('#ammod').click(function() {
	allinone();
});

