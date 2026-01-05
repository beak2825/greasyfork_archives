// ==UserScript==
// @name           Point.md Black List
//
// @description    Allows you to block unwanted user's comments
//
// @namespace      http://127.0.0.1
// 
// @author         systemfailure (http://userscripts.org/users/systemfailure) 
//
// @license        GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
//
// @homepage       http://127.0.0.1 
//
// @version        1.05
//
// @include        http://*point.md/*
//
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
//
// @history        1.0 first version
// @grant       GM_getValue
// @grant       GM_setValue
//
// @downloadURL https://update.greasyfork.org/scripts/11582/Pointmd%20Black%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/11582/Pointmd%20Black%20List.meta.js
// ==/UserScript==

// init
var blockedIDs = JSON.parse(GM_getValue("blockedIDs",  null)) ||  {};;
if (!blockedIDs){
	GM_setValue("blockedIDs", JSON.stringify([]));
}
blockedIDs = eval(GM_getValue("blockedIDs"));

var blockComments = function(){
	var blockedMessages = [];
	// blocking comments entirely
	for (var i = 0; i < blockedIDs.length; i++){
		var blockedID = blockedIDs[i];
		$("li[data-comment-user-id='" + blockedID + "']").each(function () {
			if (!$( this ).hasClass("blocked")){
				var login = $( this ).attr("data-comment-login");
				$( this ).html('Comment of "' + login + '" blocked by Black List');
				$( this ).css({
					'min-height': '0px',
					'color': 'grey',
					'height': 'auto',
					'font-size': '4px',
					'padding': '0px 0px 0px 60px'
				});
				$( this ).addClass("blocked");
				blockedMessages.push($( this ).attr("data-comment-id"));
			}
		});
	}
	
	// hide replies to the blocked comments
	for (var i = 0; i < blockedMessages.length; i++){
		var blockedMessage = blockedMessages[i];
		$(".quote[data-quote-ref-id='" + blockedMessage + "']").each(function () {
			if (!$( this ).hasClass("hidden")){
				// completely block reply as well
				var parentContainer = $( this ).parent( ".userComment" );			
				if (!parentContainer.hasClass("blocked")){
					parentContainer.html('This reply was completely blocked');
					parentContainer.css({
						'min-height': '0px',
						'color': 'grey',
						'height': 'auto',
						'font-size': '4px',
						'padding': '0px 0px 0px 60px'
					});
					parentContainer.addClass("blocked");
				}
				
				// hide quote only
				/*
				$( this ).html('This reply was hidden');
				$( this ).css({
					'min-height': '0px',
					'color': 'grey',
					'height': 'auto',
					'font-size': '8px'
				});				
				$( this ).addClass("hidden");
				*/
			}
		});
	}
}

var init = function (){
		// ban button:
	$(".userComment").each(function() {
		var userID = $( this ).attr("data-comment-user-id");
	
		var banButton = $('<div>', {
            class: 'banButton'
        });
		banButton.html('ban!');
		banButton.click(function() {
			blockedIDs.push('' + userID);
			GM_setValue("blockedIDs", JSON.stringify( blockedIDs ));
			blockComments();
		});
		banButton.css({
			'float': 'left',
			'color': 'grey',
			'font-size': '10px',
			'margin-right': '5px',
			'cursor': 'pointer',
			'border-radius': '3px',
			'border': '1px solid white'
		});
		banButton.mouseenter(function() {
			$(this).css({
				'border': '1px solid grey'
			});
		}).mouseleave(function() {
			$(this).css({
				'border': '1px solid white'
			});
		});
		
		$( this ).find('.nickNameInfo').append(banButton);
	
	});
	
	// TODO: unban button:
	/*$(".blocked").each(function() {
		var userID = $( this ).attr("data-comment-user-id");
	
		var unbanButton = $('<div>', {
            class: 'banButton'
        });
		unbanButton.html('unban!')
	
		$( this ).find('.nickNameInfo').append(unbanButton);
	});*/
	
	// TODO: show comment:
	
	// block comments
	blockComments();
	
	// add listeners to the pagination links
	$("ul.paginator-pages-list > li").bind("click", function() {
		window.setTimeout(init, 1000);
	});
}

$(document).ready(function(){
	init();	
});