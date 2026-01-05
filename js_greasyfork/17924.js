// ==UserScript==
// @name        Links next to logout
// @description Add up to 5 links bext to the Log out button
// @namespace   Links next to logout
// @author      Hash G.
// @include     *hackforums.net*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/17924/Links%20next%20to%20logout.user.js
// @updateURL https://update.greasyfork.org/scripts/17924/Links%20next%20to%20logout.meta.js
// ==/UserScript==

quickLink = GM_getValue("quickLink", ["", "", "", "", ""]);
quickLinkTitle = GM_getValue("quickLinkTitle", ["", "", "", "", ""]);


for (var i = 4; i > -1; i--) {
	console.log(quickLink[i]);
	if (quickLink[i] != "") {
		$("#panel a[href*='action=logout']").after(" — <a href='"+quickLink[i]+"'>"+quickLinkTitle[i]+"</a>"); 
	}
}


if (location.href.match(/usercp.php/i)) {
	$(".usercp_nav_home").after("<hr id='afterCPLink'><a href='#' id='quickLinksSettings'>Quick links settings</a>");
	$("body").append("<div id='popup_quickLinksSettings' style='background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'><span style='float: center;'>Quick links settings<br><br><input id='quickLink1-link' placeholder='Link' value='"+quickLink[0]+"'></input> <input id='quickLink1-title' placeholder='Title' value='"+quickLinkTitle[0]+"'></input><br><input id='quickLink2-link' placeholder='Link' value='"+quickLink[1]+"'></input> <input id='quickLink2-title' placeholder='Title' value='"+quickLinkTitle[1]+"'></input><br><input id='quickLink3-link' placeholder='Link' value='"+quickLink[2]+"'></input> <input id='quickLink3-title' placeholder='Title' value='"+quickLinkTitle[2]+"'></input><br><input id='quickLink4-link' placeholder='Link' value='"+quickLink[3]+"'></input> <input id='quickLink4-title' placeholder='Title' value='"+quickLinkTitle[3]+"'></input><br><input id='quickLink5-link' placeholder='Link' value='"+quickLink[4]+"'></input> <input id='quickLink5-title' placeholder='Title' value='"+quickLinkTitle[4]+"'></input><br><br><br><br><button id='saveQuickLinksSettings' class='bitButton' >Save</button> <button id='closeQuickLinksSettings' class='bitButton' >Close</button></span></div>");
	
	$("#quickLinksSettings").on("click", function() {
		$("#popup_quickLinksSettings").css("display", "block");
	});
	
	$("#closeQuickLinksSettings").on("click", function() {
		$("#popup_quickLinksSettings").css("display", "none");
	});
	
	
	$("#saveQuickLinksSettings").on("click", function() {
		$("#popup_quickLinksSettings").css("display", "none");
		var quickLink = [$("#quickLink1-link").val(), $("#quickLink2-link").val(), $("#quickLink3-link").val(), $("#quickLink4-link").val(), $("#quickLink5-link").val()];
		var quickLinkTitle = [$("#quickLink1-title").val(), $("#quickLink2-title").val(), $("#quickLink3-title").val(), $("#quickLink4-title").val(), $("#quickLink5-title").val()];
		GM_setValue("quickLink", quickLink);
		GM_setValue("quickLinkTitle", quickLinkTitle);
	});
}

