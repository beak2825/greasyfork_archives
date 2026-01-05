// ==UserScript==
// @name         QuickMod
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.5.6
// @description  Adds a dropdown to people's names in the comments and forums for quick mod actions
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12405/QuickMod.user.js
// @updateURL https://update.greasyfork.org/scripts/12405/QuickMod.meta.js
// ==/UserScript==

var lobbyHeight = $("#lobby").height();
if (location.pathname.split("/")[1] == "topic") {
	appendTool();
}

function appendTool() {
	$("[href*='/user'].tt").each(function(i) {
		var offset = $(this).offset();
        var height = $(this).height();
		$("body").append("<div id='test_" + i + "' style='display: none; position: absolute; cursor: pointer; top: " + (offset.top + height) + "px; left: " + offset.left +  "px; z-index: 100;' class='modHover'><div style='width: 100%; height: 30px; background-color: white; color: black; position: relative; text-align: center; border: 1px solid #d33; line-height: 30px; padding: 3px; z-index: 100;' class='modHoverTab' modAction='ban_comments'>Comment Ban</div><div style='width: 100%; height: 30px; background-color: white; color: black; position: relative; text-align: center; border: 1px solid #d33; line-height: 30px; padding: 3px; z-index: 100;' class='modHoverTab' modAction='ban_forum'>Forum Ban</div><div style='width: 100%; height: 30px; background-color: white; color: black; position: relative; text-align: center; border: 1px solid #d33; line-height: 30px; padding: 3px; z-index: 100;' class='modHoverTab' modAction='suspend_account_all'>Lock All Accounts</div><div style='width: 100%; height: 30px; background-color: white; color: black; position: relative; text-align: center; border: 1px solid #d33; line-height: 30px; padding: 3px; z-index: 100;' class='modHoverTab' modAction='ban'>Ban User</div></div>");
		$(this).hover(function() {
				if ($("#lobby").height() != lobbyHeight) {
					updateTool();
					lobbyHeight = $("#lobby").height();
				}
				$("#test_" + i).show();
			}, function() {
				if (typeof InstallTrigger != "undefined") {
					setTimeout(function() {
						if ($(".modHover").filter(function() { return $(this).is(":hover"); }).length == 0) {
							$("#test_" + i).hide();
						}
					}, 50);
				}
				else {
					//Is Chrome
					if ($(".modHover").filter(function() { return $(this).is(":hover"); }).length == 0) {
							$("#test_" + i).hide();
					}
				}
		});
		$("#test_" + i).attr("data-uid", $(this).attr('href').split('/')[2]);
		$("#test_" + i).find(".modHoverTab").attr("data-uid", $(this).attr('href').split('/')[2]);
	});
	
	$(".modHover").hover(function() {
			$("this").show();
		}, function() {
			$(".modHover").hide();
	});
	$(".modHoverTab").mousedown(function(e) {
        if (e.which == 1) $(this).css("background-color", "#CFCFCF");
	});
    $(".modHoverTab").mouseup(function(e) {
        if (e.which == 1) {
            $(this).css("background-color", "#E6E6E6");
            var id = $(this).attr("data-uid");
            var action = $(this).attr("modAction");
			if (confirm(action + " user " + id + "?")) {
				$.get("/moderator/action/" + action + "/user/" + id, function(data) {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
					errordisplay(".errordisplay", data[1]);
				});
			}
        }
    });
    $(".modHoverTab").hover(function() {
        $(this).css("background-color", "#E6E6E6");
    }, function() {
        $(this).css("background-color", "white");
    });
}

function updateTool() {
	$(".modHover").each(function(i) {
		var offset = $("[href*='/user'].tt").eq(i).offset();
        var height = $("[href*='/user'].tt").eq(i).height();
		$(this).css({
			top: offset.top + height,
			left: offset.left
		});
	});
}

$('.comment_container').bind("DOMSubtreeModified",function(){
	setTimeout(function() {
		$(".modHover").remove();
		appendTool();
	}, 100);
});

$('#posts').bind("DOMSubtreeModified",function(){
	setTimeout(function() {
		$(".modHover").remove();
		appendTool();
	}, 100);
});