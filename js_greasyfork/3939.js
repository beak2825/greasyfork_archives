// ==UserScript==
// @name           Casanova Direct Links
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds Direct Links to the online reader
// @include        http://casanovascans.com/read/*
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        1.3.3
// @date           08-01-2015
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3939/Casanova%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3939/Casanova%20Direct%20Links.meta.js
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
	var dlinks       = "<div id='dlinks' class='uk-navbar-nav dlinks'>\n" +
	                     "\t<h3>Direct Links:</h3>\n" +
					   "</div>";
	var dlinksanchor = "<li class='uk-parent' id='dlinksli'>\n" +
	                     "\t<a href='#' id='dlinksanchor' style=''>" +
					          "<p>Direct Links</p>" +
					       "</a>\n" +
					   "</li>";




	//insert tabs
	$("nav.uk-navbar > ul.uk-navbar-nav").append(dlinksanchor);
	$("div.uk-container nav.uk-navbar").after(dlinks);

	//style tabs

	GM_addStyle("#dlinks {" +
							  "background-color: #FFFFFF;" +
							  "padding-top: 10px;" +
							  "padding-bottom: 05px;" +
							  "display: none;" +
							  "text-align: center;" +
							  "z-index: 999; position: absolute;" +
							  "width: 100%;"+
							  "left: 0px;"+
							"}"
						 );

	//get image source
	var imgsrc = $("img.open").attr("src");
	//console.log(imgsrc);

	//get total amount of pages
	var pages  = $("a[title$='Pages']").html();
	var pages = pages.replace(/\s\<i.*\<\/i\>$/, "");
	//console.log(pages);

	//insert message into Direct Links div.
	var dlmesg = '<p>\n' +
	                '\tUse "Right-click > Save As" dialogue,' +
				      'or a download manager like ' +
			          '<a href="http://www.downthemall.net/" id="dta">' +
					    'DownThemAll'+
					  '</a> ' +
			          'to save the images.\n' +
				  '<br />' +
	              '</p>\n' +
				  '<a href="#" id="dlloading">' +
					'\tLoading...'+
					'\t<br />\n' +
				  '</a>';

	$("#dlinks").append(dlmesg);
	$("#dlinks ").css("font-family", "'Courier'");

	//event handler click on 'Direct Links' button.
	$("#dlinksanchor").click( function() {
	  $("#dlinks").slideToggle("slow");
	});

	//fetch links
	$(".uk-dropdown-small > ul:nth-child(1) li").each(function() {
	var nextpage = $(this).children("a").attr("href");
		//console.log(nextpage);

	GM_xmlhttpRequest({
	method: "GET",
	url: nextpage,
	onload: function(response) {
			//console.log(response.responseText);



			if ( response.responseText.indexOf('class="open"') > 0 ) {
				var raw = response.responseText;
				var content = /<img.*open.*>/.exec(raw)
				//console.log(content);
				var imglink = /"http.*"/.exec(content);
				//console.log(imglink[0]);


				var pagenum = /\d{2}\.(png|jpg)/.exec(imglink[0]);
				//console.log(pagenum[0]);
				var newpageanchor= '<a href=' + imglink[0] + 'id="page' +
														/\d{2}/.exec(pagenum[0]) + '">' +
										"\n\tPage " + (parseInt(/\d*/.exec(pagenum[0]))) + "<br />" +
								   '</a>';

			}

			else {
				imglink[0] = "image not found!";
				pagenum = [""];
				pagenum.push(/\d*$/.exec(newpage));
				var newpageanchor='<a href="#" class="404">Uh-oh.something went wrong</a>' +
								  '<br />';
			}

			//insert links
			$("#dlinks").append(newpageanchor);

			//sort links
			$('#dlinks a[id^="page"]').sort(function (a, b) {
			var re = /[^\d]/g;
			return ~~a.id.replace(re, '') > ~~b.id.replace(re, '');
			})
			.appendTo("#dlinks");



		 }
		});

		//remove loading text
		if ( $(this).is(":last-child") ) {
			$("#dlloading").remove();
		}


	});




});

