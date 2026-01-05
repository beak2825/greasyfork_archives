// ==UserScript==
// @name           Batoto Direct Links
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds Direct Links to the online reader
// @include        http://www.batoto.net/read/_/*
// @include        http://www.bato.to/read/_/*
// @include        https://bato.to/read/_/*
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        2.1.3.1
// @date           17-07-2015
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3897/Batoto%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3897/Batoto%20Direct%20Links.meta.js
// ==/UserScript==


// The MIT License
//
// Copyright (c) 2014 Joost Bremmer
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

$(document).ready (function () {




	//Add various tabs
	var dlinks       = "<div id='dlinks' class='rounded dlinks'>\n" +
	                     "\t<h3>Direct Links:</h3>\n" +
					     "\t<br />\n" +
					   "</div>";
	var dlinksanchor = "<li style='display: inline-block; margin-right: 20px;'>\n" +
	                     "\t<button type='button' id='dlinksanchor'>" +
					          "Direct Links" +
					       "</button>\n" +
					   "</li>";


	//insert tabs
	$("#read_settings").before(dlinks);
	$("div.moderation_bar li:last-child").before(dlinksanchor);

	//style tabs

	GM_addStyle(".dlinks {" +
							  "background-color: #FFFFFF;" +
							  "padding-top: 10px;" +
							  "padding-bottom: 05px;" +
							  "display: none;" +
							  "text-align: center;" +
							  "border-top: 1px solid #CDCDCD;" +
							  "border-top-right-radius:0px;"+
							  "border-top-left-radius: 0px;" +
							  "border-bottom: 1px solid #CDCDCD;"+
							  "z-index: 999; position: absolute;" +
							  "width: 100%;"+
							  "left: 0px;"+
							"}"
						 );
	$("#comic_wrap").css("z-index","499")




	//get image source
	var imgsrc = $("img#comic_page").attr("src");

	//get total amount of pages
	var pages  = $("select#page_select option:last").html();
	var pages = pages.replace(/page./g, '');


	//insert links into Direct Links div.
	var dlmesg = '<p>\n' +
	                '\tUse "Right-click > Save As" dialogue,' +
				      'or a download manager like ' +
			          '<a href="http://www.downthemall.net/" id="dta">' +
					    'DownThemAll'+
					  '</a> ' +
			          'to save the images.\n' +
				  '<br /><br />' +
	              '</p>\n' +
				  '<a href="#" id="dlloading">' +
					'\tLoading...'+
					'\t<br />\n' +
				  '</a>';

	$("#dlinks").append(dlmesg);

	//event handler click on 'Direct Links' button.
	$("#dlinksanchor").click( function() {

		$("#dlinks").slideToggle("slow");

	});

	$("#page_select:first > option").each(function() {
	var nextpage = $(this).attr("value");
		//console.log(nextpage);

	GM_xmlhttpRequest({
	method: "GET",
	url: nextpage,
	onload: function(response) {
			//console.log(response.responseText);

			if ( response.responseText.indexOf('id="comic_page"') > 0 ) {
				var raw = response.responseText;
				var content = /<img.*comic_page.*>/.exec(raw)
				//console.log(content);
				var imglink = /"http.*(png|jpg)"/.exec(content);
				//console.log(imglink[0]);


				var pagenum = /\d*\.(png|jpg)/.exec(imglink[0]);
				//console.log(pagenum[0]);
				var newpageanchor= '<a href=' + imglink[0] + 'id="page' +
														/\d*/.exec(pagenum[0]) + '">' +
										"\n\tPage " + parseInt(/\d*/.exec(pagenum[0])) + "<br />" +
								   '</a>';

			}

			else {
				imglink[0] = "image not found!";
				var newpageanchor='<a href="#" class="404">Uh-oh.something went wrong</a>' +
								  '<br />';
			}

			$("#dlinks").append(newpageanchor);

			//sort links
			$('#dlinks a[id^="page"]').sort(function (a, b) {
			var re = /[^\d]/g;
			return ~~a.id.replace(re, '') > ~~b.id.replace(re, '');
			})
			.appendTo("#dlinks");


		 }
		});

		if ( $(this).is(":last-child") ) {
				$("#dlloading").remove();
		}


	});


});


