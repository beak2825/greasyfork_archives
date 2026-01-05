// ==UserScript==
// @name newtab
// @description Adds a box with nav links to favourite sites
// @grant none
// @namespace xormak/nav_box
// @include *
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at document-start
// @version 0.0.4
// @downloadURL https://update.greasyfork.org/scripts/13441/newtab.user.js
// @updateURL https://update.greasyfork.org/scripts/13441/newtab.meta.js
// ==/UserScript==

/* 
*
* CREATED BY XORMAK.DEVIANTART.COM
*
*/


var links = [
	{
		name:"DeviantArt",
		url:"http://xormak.deviantart.com/"
	},
	{
		name:"Tumblr",
		url:"https://www.tumblr.com/dashboard"
	},
	{
		name:"Derpibooru",
		url:"https://derpibooru.org/"
	},
	{
		name:"Picarto",
		url:"https://picarto.tv/"
	},
	{
		name:"Youtube",
		url:"https://www.youtube.com/"
	},
]

$(document).ready(function(){
	// 1. CREATE AND APPEND ELEMENTS
	container = document.createElement("div");
	container.setAttribute("id","xor-nav-con");
	$("body").append(container);
	//
	slider = document.createElement("button");
	slider.setAttribute("id","xor-nav-slider");
	$("#xor-nav-con").append(slider);
	$("#xor-nav-slider").append("Toggle");
	// 1. END
	// 2. LOAD LINKS
	function loadlinks () {
		for (x=0;x<5;x++){
			link_src = links[x]; 
			link = document.createElement("a");
			link.setAttribute("class","link");
			link.setAttribute("href",link_src.url);
			link.setAttribute("target","_blank");
			link.innerHTML = link_src.name;
			$("#xor-nav-con").append(link);
		}
	}
	loadlinks();
	// 2. END
	// 3. CSS
	$("#xor-nav-con").css({
		"position":"fixed",
		"width":"200px",
		"min-height":"20px",
		"top":"0px",
		"left":"0px",
		"border":"none",
		"margin":"0px",
		"padding":"0px",
		"box-shadow":"0 0 5px",
		"z-index":"10000000",
	});
	$("#xor-nav-slider").css({
		"position":"relative",
		"top":"0px",
		"left":"0px",
		"width":"200px",
		"height":"20px",
		"border":"none"
	});
	$(".link").css({
		"position":"relative",
		"width":"200px",
		"height":"20px",
		"border":"none",
		"display":"block",
		"text-align":"center",
		"text-decoration":"none",
		"background":"#36465d",
		"color":"white"
	});
	$(".link").mouseover(function(){
		$(this).css({
			"background":"#6882a6",
			"color":"black"
		})
	});
	$(".link").mouseout(function(){
		$(this).css({
			"background":"#36465d",
			"color":"white"
		})
	});
	// 3. END
	// 4. MISC
	$("#xor-nav-slider").click(function(){
		$(".link").slideToggle();
	});
	// 4. END
});