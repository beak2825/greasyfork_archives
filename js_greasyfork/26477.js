// ==UserScript==
// @name       		    slideshow
// @namespace  		    https://greasyfork.org/en/users/94062-oshaw
// @version    		    3
// @description			View Imgur media in a slideshow format
// @author				Oscar Shaw
// @grant   			none
// @include				https://*.reddit.*/r/*
// @include			 	http://imgur.com/*
// @include				https://imgur.com/*
// @require				http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at				document-start
// @downloadURL https://update.greasyfork.org/scripts/26477/slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/26477/slideshow.meta.js
// ==/UserScript==

/* "name":				"library.js",
   "program":			"Slideshow",
   "description":   	""
*/

function say(str_input,     tab_input = window) {
	
	tab_input.console.log(str_input);
	
} say("Compiled");
function list(arrkvp_input, tab_input = window) {
	
	var str_output = "";
	
	for (var i = 0; i < arrkvp_input.length; i++) {
		
		str_output += (
			
			  arrkvp_input[i][0] + ": \t\t"
			+ arrkvp_input[i][1] + "\n"
		);
	}
	
	say(str_output, tab_input);
}
function shout(str_input,   tab_input = window) {
	
	tab_input.alert(str_input);
}
function tag(str_element,   tab_input = window) {
	
	switch (str_element[0]) {
		
		case '.': return tab_input.document.getElementsByClassName(str_element.substring(1));
		case '#': return tab_input.document.getElementById(str_element.substring(1));
		default: return;
	}
}
function sayTab(str_body,   str_title = "")     {
	
	window.open().document.body.appendChild(document.createElement('pre')).innerHTML
		= (str_title != "" ? str_function + "\n\n" : "")
		+ str_body;
}
function tryCatch(anon)                         {
	
	try { anon(); }
	catch(str_error) { say(str_error); }
}
function isDef(var_input)                       {
	
	return !(var_input == null || var_input == undefined || var_input == "");
}
function func_xhr(obj_input)                    {
	
	say("func_xhr requesting " + obj_input.url_destination);
	
	var xhr	= new XMLHttpRequest();
	xhr.onload = function() {
		
		try { var json = JSON.parse(this.responseText); }
		catch(str_error) {
			
			say("func_error\n\n" + str_error + "\n\n" + this.responseText);
			obj_input.func_error(str_error);
		}
		
		if (!isDef(json.status)) obj_input.func_success(json);
		if (json.status == 200) {
			
			say("func_success");
			obj_input.func_success(json);
		}
		else {
			
			say("func_failure");
			obj_input.func_failure(json.status);
		}
	};
	xhr.open("GET", obj_input.url_destination, true);
	
	if (obj_input.str_headerKey != undefined && obj_input.str_headerValue != undefined) {
		
		xhr.setRequestHeader(
		
			obj_input.str_headerKey,
			obj_input.str_headerValue
		);
	}
	xhr.send();
}
function func_htmlUnescape(str_input)           {
	
    return str_input
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

/* "name":				"parsers.js",
   "program":			"Slideshow",
   "description":   	""
*/

function func_imgurUrlToJson(url_input, func_callback, arrstr_endpoints = ["append", "album", "image"]) {
	
	const constr_imgurApiId = "b5abfbf0e29baf1";
	var hash_source = url_input.substring(url_input.lastIndexOf("/") + 1);
	var anon_request = function(str_endpoint, func_next) {
		
		var obj_xhrInputs;
		switch(str_endpoint) {
			
			case "append": {
				
				obj_xhrInputs = { url_destination: url_input + ".json" }
				break;
			}
			case "album": {
				
				obj_xhrInputs = {
					
					  url_destination: "https://api.imgur.com/3/album/" + hash_source
					, str_headerKey: "Authorization"
					, str_headerValue: "Client-ID " + constr_imgurApiId
				}
				break;
			}
			case "image": {
				
				obj_xhrInputs = {
					
					  url_destination: "https://api.imgur.com/3/image/" + hash_source
					, str_headerKey: "Authorization"
					, str_headerValue: "Client-ID " + constr_imgurApiId
				}
				break;
			}
			
			default: break;
		}
		
		func_xhr({
			
			  url_destination: obj_xhrInputs.url_destination
			, func_success: function(json_response) { func_callback(json_response); }
			, func_error: func_next
			, func_failure: func_next
			, str_headerKey: obj_xhrInputs.str_headerKey
			, str_headerValue: obj_xhrInputs.str_headerValue
		});
	};
	
	var i = 0;
	anon_request(arrstr_endpoints[i], function() {
		
		if (isDef(arrstr_endpoints[i + 1])) {
			
			i++;
			anon_request(arrstr_endpoints[i], function() {
				
				if (isDef(arrstr_endpoints[i + 1])) {
					
					i++;
					anon_request(arrstr_endpoints[i]);
				}
			});
		}
	}, function() {
		
		if (isDef(arrstr_endpoints[i + 1])) {
			
			i++;
			anon_request(arrstr_endpoints[i], function() {
				
				if (isDef(arrstr_endpoints[i + 1])) {
					
					i++;
					anon_request(arrstr_endpoints[i]);
				}
			});
		}
	});
}
function func_imgurJsonToSsdn(json_input)         {
	
	say("func_imgur_jsonToSsdn");
	
	var bool_isAppend = json_input.data.hasOwnProperty("image");
	var node_inputHeader = bool_isAppend ? json_input.data.image : json_input.data;
	var node_imageArray = bool_isAppend ? json_input.data.image.album_images.images : json_input.data.images;
	
	var ssdn_output = {
		
		node_header:
		{
			  str_title:			(node_inputHeader.title === null) ? "" : node_inputHeader.title
			, str_description:		(node_inputHeader.description === null) ? "" : node_inputHeader.description
			, str_poster:			node_inputHeader.account_url
			, int_length:			bool_isAppend ? node_inputHeader.num_images : node_inputHeader.images_count
			, int_views:			node_inputHeader.views
			, int_points:			node_inputHeader.points
			, int_ups:				node_inputHeader.ups
			, int_downs:			node_inputHeader.downs
		}
		, node_payload:				[]
	};
	var int_outputLength = ssdn_output.node_header.int_length;
	ssdn_output.node_header.int_length = (int_outputLength == null) ? 1 : int_outputLength;
	
	if (ssdn_output.node_header.int_length > 1) { // If album
		
		$.each(node_imageArray, function(i, node_image) {
		
			ssdn_output.node_payload.push({
				
				  str_title:		(node_image.title === null) ? "" : node_image.title
				, str_description:	(node_image.description === null) ? "" : node_image.description
				, url_direct:		bool_isAppend ? "http://i.imgur.com/" + node_image.hash + node_image.ext : node_image.link
			});
		});
		
	}
	else { // If image
		
		ssdn_output.node_payload.push({
			
			  str_title:			undefined
			, str_description:		undefined
			, url_direct:			node_inputHeader.link
		});
	}
	
	say("func_imgur_jsonToSsdn payload completed");
	return ssdn_output;
}
function class_redditParser(url_input, func_send) {
	
	function func_stringToUrlArray(str_input) {
		
		// say("func_stringToUrlArray");
		
		var array_urls = [];
		
		if (isDef(str_input.match(/http(.*?)(?=["?])/g))) {
			
			$.each(str_input.match(
			
				/http(.*?)(?=["?])/g
			
			), function(i, url) { array_urls.push(url); });
		}
		
		// say("func_stringToUrlArray completed");
		return array_urls;
	}
	function func_isUrlImageDirect(url_input) {
		
		return (url_input.indexOf(".jpg") != -1
				|| url_input.indexOf(".png") != -1
				|| url_input.indexOf(".gif") != -1);
	}
	function func_redditThreadHeaderToSsdnHeader(json_redditHeader) {
		
		return {
			
			node_header: {
				
				str_title: json_redditHeader.title
			}
		};
	}
	function func_urlWithRedditContextToSsdnPayload(url, json_redditComment) {
		
		return {
			
			node_payload:
			[
				{
					  str_title: json_redditComment.author
					, str_description: func_htmlUnescape(json_redditComment.body_html)
					, int_points: json_redditComment.score
					, url_direct: url
				}
			]
		};
	}
	function func_main() {
		
		func_xhr({ url_destination: url_input + ".json", func_success: function(json_reddit) {
			
			{ func_send( // Fabricate and send header
			
				func_redditThreadHeaderToSsdnHeader
				(json_reddit[0].data.children[0].data)

			); }
			
			$.each(json_reddit[1].data.children, function(i, json_comment) { // Each comment
				
				if (!isDef(json_comment.data.body_html)) return;
				
				$.each(func_stringToUrlArray(json_comment.data.body_html), function(j, url) {
					
					if (func_isUrlImageDirect(url)) { // Direct
						
						{ func_send(
						
							func_urlWithRedditContextToSsdnPayload
							(url, json_comment.data)
							
						); }
					}
					else if (url.indexOf("imgur") != -1) { // Indirect
						
						func_imgurUrlToJson(url, function(json_indirectUrlResponse) {
							
							$.each(json_indirectUrlResponse.data.images,
								function(k, json_imgurImage) {
								
								ssdn_output = func_urlWithRedditContextToSsdnPayload(
									json_imgurImage.link,
									json_comment.data);
								
								var node_image = ssdn_output.node_payload[0];
								node_image.int_index = k + 1;
								node_image.int_length = json_indirectUrlResponse.data.images.length;
								node_image.url_album = url;
								
								func_send(ssdn_output);
							});
							
						}, ["album", "image"]);
					}
					
				}); // Next url in comment
				
			}); // Next comment
		}});
		
	} func_main();
	
	say("class_redditParser completed");
}

/* "name":				"slideshow.js",
   "program":			"Slideshow",
   "description":   	""
*/

function class_slideshow(tab) {
	
	const contab_home       = tab;
	
	var css_head            = ""; { // CSS
		
		{ css_head += 
			"\
			<script type='text/javascript' src='http://ajax.googleapis.com/\
			ajax/libs/jquery/1.4.1/jquery.min.js'></script>\
		"; }
		{ css_head += "<title></title><style>"; }
		{ css_head += // #ctn_main, #ctn_image, 
			"\
			#ctn_main\
			{\
				top:					0px;\
				right:					0px;\
				height: 				" + contab_home.innerHeight + "px;\
				width: 					" + contab_home.innerWidth + "px;\
				position: 				absolute;\
			}\
			#ctn_image\
			{\
				height: 				" + contab_home.innerHeight + "px;\
				width:					100%;\
			}\
			#act_image\
			{\
				display:				block;\
				height:					" + contab_home.innerHeight + "px;\
				width:				 	100%;\
				position:				absolute;\
				background-position:	center center;\
				background-repeat:		no-repeat;\
				background-size:		contain;\
				z-index:				1;\
			}\
		"; }
		{ css_head += // .grp_details
			"\
			.grp_textBoxes\
			{\
				margin:					0px;\
				text-align:				center;\
			}\
			.grp_details\
			{\
				display:				none;\
				z-index:				1;\
			}\
			.grp_bold\
			{\
				font-weight:			bold;\
			}\
			#ctn_header\
			{\
				width:					100%;\
			}\
			#act_header\
			{\
				box-sizing:				border-box;\
				padding-top:			0px;\
				padding-bottom:			7px;\
				padding-left:			45px;\
				padding-right:			45px;\
			}\
			#ctn_footer\
			{\
				width: 					100%;\
			}\
			#act_footer\
			{\
				box-sizing:				border-box;\
				padding-top:			10px;\
				padding-bottom:			10px;\
				padding-left:			45px;\
				padding-right:			45px;\
				bottom:					0px;\
				width:					100%;\
			}\
			#p_imageNumbers\
			{\
				display:				none;\
			}\
			ul\
			{\
				padding:				0px;\
				margin:					0px;\
			}\
			ol\
			{\
				padding:				0px;\
				margin:					0px;\
			}\
			p\
			{\
				padding:				0px;\
				margin:					0px;\
			}\
		"; }
		{ css_head += // .grp_navButtons
			"\
			.grp_navButtons\
			{\
				top:					0px;\
				display:				none;\
				line-height:			" + contab_home.innerHeight + "px;\
				height:					100%;\
				margin:					0px;\
				cursor:					pointer;\
				text-align:				center;\
				vertical-align:			middle;\
				position:				absolute;\
				z-index:				10;\
			}\
			#btn_prev\
			{\
				left:					0px;\
				padding-left:			15px;\
				padding-right:			15px;\
			}\
			#btn_next\
			{\
				padding-left:			15px;\
				padding-right:			15px;\
				right:					0px;\
			}\
		"; }
		{ css_head += // css_head suffix
			"\
			</style>\
		"; }
	}
	var html_body           = ""; { // HTML
		
		{ html_body += // #ctn_main prefix
			"\
			<div id = 'ctn_main'>\
		"; }
		{ html_body += // #ctn_header
			"\
			<div class = 'grp_details' id = 'ctn_header'>\
				<div id = 'act_header'>\
					<h1 class = 'grp_textBoxes' id = 'h1_title'></h1>\
					<p class = 'grp_textBoxes' id = 'p_subtitle'></p>\
				</div>\
			</div>\
		"; }
		{ html_body += // #ctn_image
			"\
			<div class = 'grp_image' id = 'ctn_image'>\
				<div class = 'grp_image' id = 'act_image'></div>\
			</div>\
		"; }
		{ html_body += // #ctn_footer
			"\
			<div class = 'grp_details' id = 'ctn_footer'>\
				<div id = 'act_footer'>\
					<p class = 'grp_textBoxes' id = 'p_desc'></p>\
					<p class = 'grp_textBoxes grp_bold' id = 'p_imageNumbers'></p>\
				</div>\
			</div>\
		"; }
		{ html_body += // #ctn_main suffix, .grp_navButtons, 
			"\
				<div class = 'grp_navButtons' id = 'btn_prev'></div>\
				<div class = 'grp_navButtons' id = 'btn_next'></div>\
			</div>\
		"; }
	}
	var ssdn_source         = { node_header: {}, node_payload: [] };
	var int_imageCurrent    = 0;
	var bool_detailsDisplay = false;
	
	function func_detailsDisplay(bool_newDetailsDisplay = bool_detailsDisplay) {
		
		bool_detailsDisplay = bool_newDetailsDisplay;
		if (bool_detailsDisplay) { // Show
			
			var int_allocateHeightHeader = 0;
			var int_allocateHeightFooter = 0;
			{ var bool_showHeader = 
			
				   isDef(tag("#h1_title", contab_home).textContent)
				|| isDef(tag("#p_subtitle", contab_home).textContent)
			};
			{ var bool_showFooter = 
			
				    isDef(tag("#p_desc", contab_home).textContent)
				|| tag("#p_imageNumbers", contab_home).style.display == "block"
			};
			
			if (bool_showHeader) {
				
				tag("#ctn_header", contab_home).style.display = "block";
				int_allocateHeightHeader = tag("#ctn_header", contab_home).clientHeight;
			}
			if (bool_showFooter) {
				
				tag("#ctn_footer", contab_home).style.display = "block";
				int_allocateHeightFooter = tag("#act_footer", contab_home).clientHeight;
			}
			
			$.each(tag(".grp_image", contab_home), function(i, elmt) {
				
				elmt.style.height = (
				
					  contab_home.innerHeight
					- int_allocateHeightHeader
					- int_allocateHeightFooter
						
				).toString() + "px";
			});
		}
		else { // Hide
			
			$.each(tag(".grp_details", contab_home), function(i, elmt) {
				
				elmt.style.display = "none";
			});
			$.each(tag(".grp_image", contab_home), function(i, elmt) {
				
				elmt.style.height = contab_home.innerHeight.toString() + "px";
			});
		}
		
		say("func_detailsDisplay completed", contab_home);
	}
	function func_imageDisplay(int_newImageCurrent = int_imageCurrent) {
		
		// If reached end or beginning of album, stop
		if (!isDef(ssdn_source.node_payload[int_newImageCurrent])) {
			
			say("func_imageDisplay completed early with " + int_imageCurrent, contab_home);
			return;
		}
		
		int_imageCurrent = int_newImageCurrent;
		var node_image = ssdn_source.node_payload[int_imageCurrent];
		
		{ tag("#act_image", contab_home).style.backgroundImage = (
		
			  "url(" 
			+ ((!isDef(node_image.url_direct)) ? "" : node_image.url_direct)
			+ ")"
			
		); }
		{ tag("#p_desc", contab_home).innerHTML = (
		
			(
				(!isDef(node_image.str_title)) ? ""
				: (	"<span class = 'grp_bold'>"
					+ node_image.str_title
					+ "</span> " )
					
			) + (
			
				(!isDef(node_image.str_description)) ? ""
				: node_image.str_description
			)
		); }
		{ tag("#p_imageNumbers", contab_home).innerHTML = (
			
			(int_imageCurrent + 1).toString()
			+ " / "
			+ (
			
				(!isDef(ssdn_source.node_header))
				? ssdn_source.node_payload.length
				: (
				
					(!isDef(ssdn_source.node_header.int_length))
					? ssdn_source.node_payload.length
					: ssdn_source.node_header.int_length
					
				)
				
			).toString()
			
		); }
		
		if (isDef(tag(".md", contab_home)[0])) {
			
			$.each(tag(".md", contab_home)[0].querySelectorAll('a'), function(i, elmt) {
			
				if (elmt.href.indexOf(node_image.url_direct) != -1
					|| elmt.href.indexOf(node_image.url_album) != -1) {
					
					var str_indexAndLength = "";
					if (isDef(node_image.int_index)
						&& isDef(node_image.int_length)
						&& (node_image.int_length != 1)) {
						
						str_indexAndLength
							= " (" + node_image.int_index + " / "
							+ node_image.int_length + ")";
					}
					
					elmt.innerHTML = (
					
						'<span class = "grp_bold">'
						+ elmt.innerHTML
						+ str_indexAndLength
						+ '</span>'
					);
				}
			});
		}
		
		func_detailsDisplay();
	}
	function func_headerUpdate() {
		
		var node = (!isDef(ssdn_source.node_header))
			? {}
			: ssdn_source.node_header;
		
		{ (tag("#h1_title", contab_home)).textContent =
		
			(!isDef(node.str_title)) ? ""
			: node.str_title;
		}
		{ (tag("#p_subtitle", contab_home)).innerHTML =
		
			((!isDef(node.str_poster)) ? "" :
			
				"Posted by <span class = 'grp_bold'>\
				<a href = 'http://imgur.com/user/"
				+ node.str_poster + "'>"
				+ node.str_poster
				+ "</a></span>"
			
			) +
			
			((isDef(node.str_poster) && (isDef(node.int_points)
				|| isDef(node.int_views))) ? " with " : "") +
		
			((!isDef(node.int_points)) ? "" :
			
				"<span class = 'grp_bold'>"
				+ node.int_points
				+ " point" + ((node.int_points > 1) ? "s" : "") + "</span>"
			
			) +
			
			((isDef(node.int_points) && isDef(node.int_views)) ? " and " : "") +
			
			((!isDef(node.int_views)) ? "" :
			
				"<span class = 'grp_bold'>"
				+ node.int_views
				+ " view" + ((node.int_views > 1) ? "s" : "") + "</span>"
			
			)
		}
		
		if (isDef(ssdn_source.node_header.str_title)) func_detailsDisplay(true);
		
		contab_home.document.title = ssdn_source.node_header.str_title;
	}
	function func_pageSetup() {
		
		// contab_home.document.head.innerHTML = css_head   ;
		// contab_home.document.body.innerHTML = html_body  ;
		// contab_home.document.title          = "Slideshow";
		
		$("html").html("<head></head><body></body>");
		$("head").html(css_head);
		$("body").html(html_body);
		
		tag("#btn_prev", contab_home).textContent = "<"  ;
		tag("#btn_next", contab_home).textContent = ">"  ;
		
		say("func_pageSetup completed", contab_home);
	}
	function func_pageListeners() {
		
		say("func_pageListeners", contab_home);
		
		contab_home.document.addEventListener('keydown', function(key) {
			
			key.cancelBubble = true;
			key.stopImmediatePropagation();
			
			switch(key.keyCode) {
				
			case 39: func_imageDisplay(int_imageCurrent + 1); break;
			case 37: func_imageDisplay(int_imageCurrent - 1); break;
			case 38: case 40: func_detailsDisplay(!bool_detailsDisplay); break;
			
			default: break;
			
			}
			return false;
			
		}, !contab_home.opera);
		contab_home.addEventListener("resize", function() {
			
			tag("#ctn_main", contab_home).style.width = contab_home.innerWidth + "px";
			tag("#ctn_main", contab_home).style.height = contab_home.innerHeight + "px";
			
			func_detailsDisplay();
			$.each(tag(".grp_navButtons", contab_home), function(i, elmt) {
				
				elmt.style.lineHeight = contab_home.innerHeight + "px";
			});
		});
		
		tag("#btn_prev",  contab_home).onmousedown = function() {
			
			func_imageDisplay(int_imageCurrent - 1);
		};
		tag("#btn_next",  contab_home).onmousedown = function() {
			
			func_imageDisplay(int_imageCurrent + 1);
		};
		tag("#act_image", contab_home).onmousedown = function() {
			
			func_detailsDisplay(!bool_detailsDisplay);
		};
		
		say("func_pageListeners completed", contab_home);
	}
	function func_main() {
		
		func_pageSetup();
		func_pageListeners();
		func_detailsDisplay();
		
		say("class_slideshow.func_main completed", contab_home);
		
	} func_main();
	
	this.meth_sourceAdd = function(ssdn_input) { try {
		
		if (isDef(ssdn_input.node_header)) { // Header
			
			ssdn_source.node_header = ssdn_input.node_header;
			func_headerUpdate();
		}
		if (isDef(ssdn_input.node_payload)) { // If input payload exists
			
			$.each(ssdn_input.node_payload, function(i, node) {
				
				ssdn_source.node_payload.push(node);
			});
		}
		if (ssdn_source.node_payload.length > 1) { // Update
			
			$("#p_imageNumbers").css("display", "block");
			$(".grp_navButtons").css("display", "block");
			$("#act_menuButton").css("display", "block");
			$("#btn_next").text(">");
			$("#btn_prev").text("<");
			
			(tag("#p_imageNumbers", contab_home)).style.display = "block";
			$.each(tag(".grp_navButtons", contab_home), function(i, elmt) {
				
				elmt.style.display = "block";
			});
		}
		
		func_imageDisplay();
		
	} catch(str_error) { say(str_error, contab_home); } };
}

/* "name":				"launcher.js",
   "program":			"Slideshow",
   "description":   	""
*/

function func_main(str_source)                    {
	
	window.stop();
	var obj_slideshow = new class_slideshow(window);
	
	if (str_source == "imgur") {
		
		func_imgurUrlToJson(location.href, function(json_output) {
			
			var ssdn_input = func_imgurJsonToSsdn(json_output);
			obj_slideshow.meth_sourceAdd(ssdn_input);
			
			if (ssdn_input.node_header.int_length > ssdn_input.node_payload.length) {
				
				func_imgurUrlToJson(location.href, function(json_output) {
					
					var ssdn_append = func_imgurJsonToSsdn(json_output);
					ssdn_append.node_header = null;
					ssdn_append.node_payload.splice(0, ssdn_input.node_payload.length);
					
					obj_slideshow.meth_sourceAdd(ssdn_append);
					
				}, ["album"]);
			}
		});
	}
	if (str_source == "reddit") {
		
		var obj_redditParser = new class_redditParser(location.href, function(ssdn_outputEntry) {
			
			obj_slideshow.meth_sourceAdd(ssdn_outputEntry);
		});
	}
	say("func_main completed");
	
}
function func_handler()                           {
	
	if (location.href.includes("imgur.com")) func_main("imgur");
	if (location.href.includes("reddit.com")) {
		
		$(function() {
			
			var p_launch   = document.createElement("p");  {
				
				p_launch.textContent = "slideshow";
				p_launch.onclick = function() { func_main("reddit"); };
				{ p_launch.setAttribute(
				
					"style", "\
					background: none !important; \
					background-color: Transparent !important;\
					padding: 0 !important;\
					font: inherit;\
					border: none !important;\
					cursor: pointer;\
					font-weight: bold;"
				); }
				{ p_launch.style.color = (
				
					window
					.getComputedStyle(tag(".bylink comments may-blank")[0])
					.color
				); }
			}
			var ctn_launch = document.createElement("li"); {
				
				ctn_launch.appendChild(p_launch);
			}
			
			{ tag(".flat-list buttons")[0].insertBefore(
		
				ctn_launch,
				tag(".flat-list buttons")[0].children[1]
			); }
		});
	}
	
} func_handler();