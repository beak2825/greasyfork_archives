// ==UserScript==
// @name         MyVidsterWide
// @namespace   https://greasyfork.org/users/1415-botmtl
// @version      1
// @description  Trying out stuff on myVidster. 
// @include      http://www.myvidster.com/subscriptions/*
// @include      http://www.myvidster.com/
// @include      http://www.myvidster.com/?list=popular
// @include 	 http://www.myvidster.com/page/*
// @include 	 http://www.myvidster.com/video_shuffle/*
// @author       botmtl
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/386-waituntilexists/code/waitUntilExists.js
// @require      http://cdn.jsdelivr.net/jquery.columnizer/1.6.0/jquery.columnizer.js
// @require 	 http://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/jquery.layout.min.js
// @resource     smoothness http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css
// @resource 	 layoutdefault http://cdnjs.cloudflare.com/ajax/libs/jquery-layout/1.3.0-rc-30.79/layout-default.min.css
// @grant    	 GM_addStyle
// @grant    	 GM_getResourceText
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/4171/MyVidsterWide.user.js
// @updateURL https://update.greasyfork.org/scripts/4171/MyVidsterWide.meta.js
// ==/UserScript==

var smoothnessCSS = GM_getResourceText ("smoothness");
GM_addStyle (smoothnessCSS);

var layoutdefaultCSS = GM_getResourceText ("layoutdefault");
GM_addStyle (layoutdefaultCSS);

if (window.location.href.indexOf("www.myvidster.com/video_shuffle/")!=-1) {
	$(document).ready(function(e) {
		//Create the new container
		$('body > table:nth-child(4)').after("<div id='newContainer'></div>");
		var $newContainer = $("#newContainer");
		
		//Append the details_header tr (myVidster » shuffle » popular videos New | Popular)
		//$('div.details_header').clone().css("padding","0px").appendTo($newContainer);
		$('div.details_header').clone().appendTo($newContainer);
		
		//Find the thumbnail-container div, clone it, work it, and add it to the newContainer
		var $thumbnailContainerDiv = $('div#thumbnail-container').clone();
		$thumbnailContainerDiv.find('br', '.collected').remove();
		$thumbnailContainerDiv.find('div.empty_clear_floats').remove();
		$thumbnailContainerDiv.find('li.thumbnail').css({"height":"140px", "width":"182px", "padding":"3px"});
		$thumbnailContainerDiv.appendTo($newContainer);
		
		//Find footer and add it to the newContainer
		$("div.footer").clone().appendTo($newContainer);
		
		//Remove old table
		$("body > table").remove();
		
		//cute stuff
		$("div.container").css("border-bottom","0px");
	})
}
else if (window.location.href.indexOf("http://www.myvidster.com/subscriptions/")!=-1) {
	$(document).ready(function(e) {
		$('body').append('<div class="ui-layout-center"></div>'+
						 '<div class="ui-layout-north"></div>'+
						 '<div class="ui-layout-south"></div>' +
						 '<div class="ui-layout-west"></div>');
		
		//page header
		$north = $('div.ui-layout-north');
		$north.append('<div style="float:left;padding-right:20px;text-align:left;padding-top:0px;"><img src="http://img2.myvidster.com/images/myVidster_logo.gif" border="0" style="height:35px;"></div>');
		$north.append('<div style="float:left;padding-right:20px;text-align:left;padding-top:0px;"><span class="home-header">collect the videos you love</span><br><span class="home-sub">collect | share | explore</span></div>');
		$north.append('<div id="sddmContainer" style="float:left;padding-right:20px;text-align:left;padding-top:15px;"></div>');
		$north.append('<div id="uiwidgetContainer" style="float:left;padding-right:20px;text-align:left;padding-top:10px;"></div>');
		$('#sddm').detach().appendTo('#sddmContainer');
		$('div.ui-widget').detach().appendTo('#uiwidgetContainer');
		
		//page footer
		$south = $('div.ui-layout-south');
		$("div.footer").detach().appendTo($south);
		$("html body.ui-layout-container div#cometchat_flashcontent").clone().appendTo($south);
		$("html body.ui-layout-container div#cometchat").clone().appendTo($south);
		$("#cometchat_hidden").clone().appendTo($south);
		$("#cometchat_tooltip").clone().appendTo($south);

		//Subscription sidebar
		$(".details_video > table").eq(0).detach().wrap("<div id='yoursubscriptions'></div>").parent().appendTo('div.ui-layout-west');
		
		//Green nav bar
		$("div.ui-layout-center").append("<div id=\"vidContainerTop\" style=\"color:white;background-color:#6C3;padding:5px;height:26px;display:block;\"></div>");
		$(".pagination:eq(0)").first().clone().css("float","left").appendTo("#vidContainerTop");
		$("#infobox3 h2").clone().css("padding-top","5px").wrap( "<div style='float:left'></div>" ).parent().appendTo("#vidContainerTop");
		$(".pagination:eq(1)").first().clone().css("float","left").appendTo("#vidContainerTop");
		$("#infobox3 span").clone().wrap( "<div id='newpopshufflerecent' style='float:right;padding-right:5px;padding-left:25px;'></div>" ).parent().appendTo("#vidContainerTop");
		
		//video		
		$(".posted_video").clone().css({"height":"100px", "width":"455px", "border":"1px solid gray", "float":"left"}).appendTo("div.ui-layout-center");
		
		$('body').layout({ 	closable:	true,	// pane can open & close
							resizable:	false,	// when open, pane can be resized 
							slidable:	true,	// when closed, pane can 'slide' open over other panes - closes on mouse-out
							livePaneResizing: false,
							stateManagement__enabled: true,
							west__maxSize: 325,
							west__size: 325,
							south__maxSize: 50,
							south__size: 50 });
		$("body > table").remove();
		$("html body.ui-layout-container div#cometchat_flashcontent").remove();
		$("html body.ui-layout-container div#cometchat").remove();
	})
}
else {
	$(document).ready(function(e) {
		var $videoContainer = $( "<div id='videoContainer' style='float:left;width:1536px;' />" ).append("<div id=\"vidContainerTop\" style=\"color:white;background-color:#6C3;padding:5px;height:26px;\"></div>");
		var $subContainer = $( "<div id='subContainer' style='float:right;width:348px' />" );
		var $vidsubContainer = $( "<div id='vidsubContainer' style='clear:both' />" ).append($videoContainer, $subContainer);
		$(".container").append($vidsubContainer);
		
		//Navigation
		$(".pagination:eq(0)").first().clone().css("float","left").appendTo("#vidContainerTop");
		$("#infobox3 h2").clone().css("padding-top","5px").wrap( "<div style='float:left'></div>" ).parent().appendTo("#vidContainerTop");
		$(".pagination:eq(2)").first().clone().css("float","left").appendTo("#vidContainerTop");
		$("#infobox3 span").clone().wrap( "<div id='newpopshufflerecent' style='float:right;padding-right:5px;padding-left:25px;'></div>" ).parent().appendTo("#vidContainerTop");
		
		//posted_videos go into videoContainer
		$(".posted_video").clone().css({"height":"100px", "width":"500px", "border":"1px solid gray"}).appendTo("#videoContainer");
		
		$("h2").remove();

		//subscriptions channels go into subContainer
		$(".details_video > table").eq(0).clone().wrap("<div id='yoursubscriptions'></div>").parent().appendTo("#subContainer");
		$("#yoursubscriptions").before("<h2>Your Subscriptions</h2>");
		
		//structure for accordion
		$("#infobox > table").eq(2).clone().wrap("<div id='featuredcollections'></div>").parent().appendTo("#subContainer");
		$("#featuredcollections").before("<h2>Featured Collections</h2>");
		$("#infobox > table").eq(3).clone().wrap("<div id='featuredgroups'></div>").parent().appendTo("#subContainer");
		$("#featuredgroups").before("<h2>Featured Groups</h2>");
		$("#infobox > table").eq(5).clone().wrap("<div id='poweruser'></div>").parent().appendTo("#subContainer");
		$("#poweruser").before("<h2>Power User Collections</h2>");
		$("#infobox > table").eq(6).clone().wrap("<div id='newlypop'></div>").parent().appendTo("#subContainer");
		$("#newlypop").before("<h2>Newly Popular Tags</h2>");
		
		//start accordion
		$( "#subContainer" ).accordion({ header: "h2",
										 collapsible: true,
										 heightStyle: "content",
										 active: false });

		//Remove old layout
		$("body > table").remove();
	});
}