// ==UserScript==
// @web_server    https://web.spbaep.ru/sm/
// @name          SM-OCS
// @author        Dzyatko
// @description   SM-OCS Intergration
// @version       0.001
// @include       *support.rosatom.ru*
// @include		  *support.rosatom.local*
// @grant		  none
// @namespace 	  https://greasyfork.org/users/XXXXXX
// @require		  https://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/15319/SM-OCS.user.js
// @updateURL https://update.greasyfork.org/scripts/15319/SM-OCS.meta.js
// ==/UserScript==
var web_server = 'https://web.spbaep.ru/sm/';


$( document ).ready(function()  {
	remove_context_menu = true;
	// Удаляем контекстное меню #cwc_optionsMenu_detail
	if (remove_context_menu & typeof ContextMenu != "undefined" ) {
		ContextMenu.detach('list/list');
		ContextMenu.detach('TableResults recordlist');
		ContextMenu.detach('detail/detail');
	}	
	// Инициализация формы Инцидента
	im_initialize();
})

function im_initialize() {	
	if ( $("[name='instance/number']").val() == undefined  ) { return false; };
	console.log("Определение формы Инцидента");
	$('head link:last').after("<link rel='stylesheet' type='text/css' href='"+web_server+"my_moco.css'/>");
	
	// VARS =========================================================
	user_element = $("[name='instance/contact.name']");
	user = user_element.val().replace(/ \(.+/g, "");
	
	$("#popHelp").before("<fieldset id='tsdb_div' style='position:absolute; top:880px; left:0%; width: 98%;' onclick='show_hide_tsdb();'><legend class='pointer' id='tsdb_legend'>OCS</legend></fieldset>");
	$("#tsdb_div").append("<div style='width: 100%; border: 1px; display: block;' id='tsdb_iframe'></div>");	
	$.get(web_server + "ocsreport.php?im_user="+user, function(data) {    
    	$("#tsdb_iframe").html(data);
	});
	
	$("body").on("click","#tsdb_legend", function(){ show_hide_tsdb()} );
}							

// Форма Системы учета заявок
function show_hide_tsdb() {
	var ob=document.getElementById('tsdb_iframe');
	if( ob.style.display=='none') { ob.style.display='block'; }
    else  { ob.style.display='none'; }
}