// ==UserScript==
// @name NeoGAF - Thread Preview
// @namespace NeoGafThreadPreview
// @description Previews the first post of a thread in a tooltip
// @require http://code.jquery.com/jquery-latest.js
// @require http://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @include http://www.neogaf.com/forum/forumdisplay*
// @include http://neogaf.com/forum/forumdisplay*
// @version 0.35000
// @downloadURL https://update.greasyfork.org/scripts/12810/NeoGAF%20-%20Thread%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/12810/NeoGAF%20-%20Thread%20Preview.meta.js
// ==/UserScript==

addJQuery(main);
var list = [];

function main(){
	addGlobalStyle(".tooltip{ \
		position:absolute; \
		z-index:1020; \
		display:block; \
		word-wrap: break-word; \
		visibility:visible; \
		padding:5px; \
		font-size:11px; \
		opacity:0; \
		filter:alpha(opacity=0) \
	} \
	.tooltip.in{ \
		opacity:.8; \
		filter:alpha(opacity=80) \
	} \
	.tooltip.top{ \
		margin-top:-2px \
	} \
	.tooltip.right{ \
		margin-left:2px \
	} \
	.tooltip.bottom{ \
		margin-top:2px \
	} \
	.tooltip.left{ \
		margin-left:-2px \
	} \
	.tooltip.top .tooltip-arrow{ \
		bottom:0; \
		left:50%; \
		margin-left:-5px; \
		border-left:5px solid transparent; \
		border-right:5px solid transparent; \
		border-top:5px solid #000 \
	} \
	.tooltip.left .tooltip-arrow{ \
		top:50%; \
		right:0; \
		margin-top:-5px \
		border-top:5px solid transparent; \
		border-bottom:5px solid transparent; \
		border-left:5px solid #000 \
	} \
	.tooltip.bottom .tooltip-arrow{ \
		top:0; \
		left:50%; \
		margin-left:-5px; \
		border-left:5px solid transparent; \
		border-right:5px solid transparent; \
		border-bottom:5px solid #000 \
	} \
	.tooltip.right .tooltip-arrow{ \
		top:50%; \
		left:0; \
		margin-top:-5px; \
		border-top:5px solid transparent; \
		border-bottom:5px solid transparent; \
		border-right:5px solid #000 \
	} \
	.tooltip-inner{ \
		max-width:200px; \
		padding:3px 8px; \
		color:#fff; \
		text-align:center; \
		text-decoration:none; \
		background-color:#000; \
		-webkit-border-radius:4px; \
		-moz-border-radius:4px; \
		border-radius:4px \
	} \
	.tooltip-arrow{ \
		position:absolute; \
		width:0; \
		height:0 \
	}");

	list = document.getElementsByClassName("threadbit-title");
	for(var i = 0; i < list.length; i++){
	    list[i].addEventListener("mouseover", mouseOver);
    	//list[i].addEventListener("mouseout", mouseOut);
	}

}

function mouseOver() {
    checkForActiveTip();
	var element = this;
	var timer = setTimeout(function() { getFirstPost(element);}, 500);
	this.onmouseout = function() {  mouseOut(timer, element); };
}

function mouseOut(timer, element) {
    clearTimeout(timer);
    element.IsMouseOver = false;
    if(element.hasAttribute("title")){
		var id = element.id;
		$("#" + id).tooltip('hide');
	}
}

function checkForActiveTip(){
   	for(var i = 0; i < list.length; i++){
	    if(list[i].hasAttribute("title")){
	    	var id = list[i].id;
    		$("#" + id).tooltip('hide');
    	}
	}
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

function getFirstPost(element){
    element.IsMouseOver = true;
	if(element.hasAttribute("title")){
		var id = element.id;
		if(element.IsMouseOver){
		    $("#" + id).tooltip('show');    
		}
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open('GET', element.href, true);
	xhr.responseType = 'document';
	xhr.send();
	xhr.onload = function foo(e) {  
		var doc = e.target.responseXML;
		var list = doc.getElementsByClassName("post");
		element.setAttribute("data-toggle", "tooltip");
		var title = list[0].innerText.trim().substring(0, 250);
		if(title.length >= 250)
		    title += "...";
		element.setAttribute("title", title);
		var id = element.id;
		if(element.IsMouseOver){
		    $("#" + id).tooltip('show');    
		}
	};
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "window.jQ=jQuery.noConflict(true);";
		document.body.appendChild(script);
		main();
	}, false);
	document.body.appendChild(script);
}