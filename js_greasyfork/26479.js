// ==UserScript==
// @name        		reddit-sidebar
// @namespace   		https://greasyfork.org/en/users/94062-oshaw
// @version     		1
// @description			Hides Reddit's sidebar. Adds search bar toggle
// @author				Oscar Shaw
// @grant				none
// @include     		http://*.reddit.*
// @include     		https://*.reddit.*
// @downloadURL https://update.greasyfork.org/scripts/26479/reddit-sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/26479/reddit-sidebar.meta.js
// ==/UserScript==

function tag(str_tag)        {
	
	switch (str_tag[0]) {
		
		case '.': return document.getElementsByClassName(str_tag.substring(1));
		case '#': return document.getElementById(str_tag.substring(1));
		default:  return document.getElementsByTagName(str_tag);
	}
}
function view(str)           {
	
	window.open().document.body
	.appendChild(document.createElement('pre')).innerHTML
		= str;
}
function attempt(anon)       {
	
	try {
		
		anon();
	}
	catch(str_error) {
		
		console.log(str_error);
	}
}
function defined(var_input)  {
	
	return !(var_input == null || var_input == undefined || var_input == "");
}

var btn_sidebar;
var strs_tagsToHide = [

	//".arrow",
	".rank",
	".tabmenu",
	".post-sharing-button",
	".trending-subreddits-content",
	".footer-parent",
	//".bylink",
	".thumbnail self may-blank",
	".thumbnail default may-blank outbound",
	".next-suggestions",
	".embed-comment",
	".debuginfo"
];

function func_hideSidebar()         {
	
	tag('.side')[0].style.display = 'none';
	tag("#sr-header-area").style.display  = 'none';
}
function func_addToggleButton()     {
	
	var elmt_a = tag(".pref-lang choice")[0];
	clr_a      = window.getComputedStyle(elmt_a).color;
	
	btn_sidebar = document.createElement("btn_sidebar"); {
		
		btn_sidebar.type = "button";
		btn_sidebar.textContent = "Search";
		btn_sidebar.onclick = func_toggleSidebar;
		
		btn_sidebar.setAttribute
		(
			"style", "\
			background: none !important; \
			background-color: Transparent !important;\
			padding: 0 !important;\
			font: inherit;\
			border: none !important;\
			cursor: pointer;"
		);
		
		btn_sidebar.style.color = clr_a;
	}
	var elmt_separator = document.createElement("elmt_separator"); {
		
		elmt_separator.type = "span";
		elmt_separator.textContent = "|";
		elmt_separator.setAttribute
		(
			"style", "\
			color: gray;\
			margin: 0px .7ex 0px .7ex;\
			margin-top: 0px;\
			margin-right: 0.7ex;\
			margin-bottom: 0px;\
			margin-left: 0.7ex;\
			cursor: default;\
			font: inherit;"
		);
	}
	tag("#header-bottom-right").appendChild(elmt_separator);
	tag("#header-bottom-right").appendChild(btn_sidebar);
}
function func_toggleSidebar()       {
	
	var elmt_sidebar = tag(".side")[0];
	if (elmt_sidebar.style.display == "none") {
		
		elmt_sidebar.style.display = "block";
		btn_sidebar.textContent = "Close";
		
		for (var i = 0; i < elmt_sidebar.children.length; i++) {
					
			if (i != 0) elmt_sidebar.children[i].style.display = "none";
		}
	}
	else {
		
		elmt_sidebar.style.display = "none";
		btn_sidebar.textContent = "Search";
	}
	
}
function func_hideElements(str_tag) {
	
	for (var i = 0; i < strs_tagsToHide.length; i++) {
		
		var str_tag = strs_tagsToHide[i];
		switch (str_tag[0]) {
			
			case '#': tag(str_tag).style.display = 'none'; break;
			case '.': {
				
				for (var j = 0; j < tag(str_tag).length; j++) {
					
					tag(str_tag)[j].style.display = 'none';
				}
				break;
			}
			default: break;
		}
	}
}

func_addToggleButton();
func_hideSidebar();
func_hideElements();

tag(".content")[1].style.margin           = "0px";
tag("#siteTable").style.marginRight       = "0px";
tag("#thing_t3_4tnhf2").style.marginRight = "16px";

tag(".menuarea")[0].style.marginLeft      = "0px";
tag(".menuarea")[0].style.marginTop       = "0px";
tag(".menuarea")[0].style.marginBottom    = "0px";

console.log("Compiled");