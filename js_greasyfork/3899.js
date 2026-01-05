// ==UserScript==
// @name           MangaStream Torrent links
// @namespace      https://github.com/ToostInc/userscripts
// @description    Adds Torrent links to the read online pages
// @include        http://www.readms.com/r/*
// @include        http://readms.com/r/*
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2010+, Joost Bremmer
// @license        MIT
// @version        3.0.4
// @date           03-10-2014
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3899/MangaStream%20Torrent%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/3899/MangaStream%20Torrent%20links.meta.js
// ==/UserScript==

// The MIT License
//
// Copyright (c) 2010 Joost Bremmer
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

$(document).ready (function () {


	//Add various tabs

	var torrentsanchor = "&nbsp&nbsp<a href='#' id='Torrentsbtn' class='btn'>Torrents</a>";
	$("div.btn-group:last").after(torrentsanchor);

	var dlinksanchor="&nbsp&nbsp<div class='btn' id='dlinksanchor'>Direct Links</div>"
	$("#Torrentsbtn").after(dlinksanchor);

		//Direct Links
	var dlinks = "<div class='subnav pager' id='dlinks'"+
					   "style='display: none;" +
					   "border-top: 1px solid #CDCDCD;"+
					   "z-index: 499; left: 0px;'>"+
				 "\n\t<h2>Direct links:</h2>" +
				 "</div>"
	$("ul.pager").after(dlinks);

	var torrents = '<div class="subnav pager" id="results"'+
						'style="display: none;'+
						'border-top: 1px solid #CDCDCD;'+
						'left: 0px;' +
						'padding-bottom: 05px;">' +
				   '\n\t<h2>Torrent:</h2>' +
				   '\n\t<span id="torrentlink">Searching...</span>' +
				   '\n\n' +
				   '</div>'
	$("#dlinks").before(torrents);






	//insert links into Direct Links div.
	var dlmesg = '<p id="dlmesg">\n' +
	                '\tUse "Right-click > Save As" dialogue,' +
				      'or a download manager like ' +
			          '<a href="http://www.downthemall.net/" id="dta">' +
					    'DownThemAll'+
					  '</a> ' +
			          'to save the images.\n' +
	              '</p>\n' +
				  '<a href="#" id="dlloading">' +
					'\tLoading...'+
					'\t<br />\n' +
				  '</a>';

	$("#dlinks").append(dlmesg);

	var dlinksdiv = '<div id="dlinkscontainer"'+
							'style="text-align: left;'+
							'position: relative;'+
							'left: 48%;'+
							'min-width: 70px;">' +
					'</div>'

	$("#dlinks").append(dlinksdiv);



	//Function for clicking Torrents
	$("#Torrentsbtn").click(function torrents() {


		var title = document.title;

		var title = title.replace(/ -.*/,"");

		var title = title.replace(/'/,"");

		var query = title + " Mangastream"

		var query = query.replace(/\s/g,"+");

		var url = "http://www.nyaa.eu/?page=search&term="+query+
		          "&sort=2"

		//console.log(url);

		$("#results").slideToggle("slow");

		GM_xmlhttpRequest({
		method: "POST",
		url: url,
		headers:{ "Content-Type": "application/x-www-form-urlencoded" },
		onload: function (response) {
				var raw = response.responseText;
				if (response.responseText.indexOf("No torrents found.") == -1) {
					//console.log(raw);
					if (raw.indexOf("Files in torrent:") == -1) {
						var content=/<td class="tlistdownload">.*?<\/td>/
						            .exec(raw);
						var content=content.toString().replace("www-dl.png",
						"www-download.png");
						//console.log(content);
						var torrentlink = content.toString();
						//console.log(torrentlink);
					}

					else if (raw.indexOf("Files in torrent:") > -1) {
						//console.log("Single torrent");
						var content = /<div class="viewdownloadbutton">.*?<\/div>/
						              .exec(raw);
						//console.log(content);
						var torrentlink = content.toString();
					}

					//console.log(torrentlink);
					$("#torrentlink").html(torrentlink);

				}

				else if(response.responseText.indexOf("No torrents found.") > -1) {
					var othertitle = title.replace(/'/,"").replace(/\s/g,"+");
					var otherurl  = "http://www.nyaa.eu/?term="+othertitle+
					                "&cats=2_0&listorder=1&page=search&sort=1";
					var otherlink = "No Results Found...Maybe search for <a href='"
					                +otherurl+"' id='otherurl'>other</a> groups?";
					$("#torrentlink").html(otherlink);

				}
			}

		});

	});



	//Function for clicking Direct Links
	$("#dlinksanchor").click( function directlinks() {

		$("#dlinks").slideToggle("slow");
	});

	//get image source
	var imgsrc = $("img#manga-page").attr("src");
	//console.log("current image is: " + imgsrc);

	//get total amount of pages
	var pages  = $("div.btn-group:nth-child(2) > ul li:last > a").html();
	var pages = pages.match(/\d{2}/g);
	//console.log("Total amount of pages: " + pages);

	var baseurl = location.href;
	var baseurl = baseurl.split("/");

	for (var i = 1 ; i < pages; i++) {

		var nextpage = baseurl.slice(0,7) + "/" + i;
		var nextpage = nextpage.replace(/\,/g,"/");

		//console.log(nextpage);

		GM_xmlhttpRequest({
		method: "GET",
		url: nextpage,
		onload: function(response) {
				//console.log(response.responseText);

			if ( response.responseText.indexOf('id="manga-page"') > 0 ) {
				var raw = response.responseText;
				var content = /<img.*manga-page.*>/.exec(raw)
				//console.log(content);
				var imglink = /"http.*(png|jpg)"/.exec(content);
				//console.log(imglink[0]);


				var pagenum = /\d*[\-|\d]*?..?(jpg|png)/.exec(imglink[0]);
				//console.log(pagenum[0]);
				var newpageanchor= '<a href=' + imglink[0] + 'id="page' +
								   /^\d*[A-z]?/.exec(pagenum[0]) + '">\n' +
								   "\n\tPage " + /^\d*\-?\d{2}[A-z]?/.exec(pagenum[0])  + "<br />" +
								   '</a>';

			}

			else {
				var imglink = [];
				imglink[0] = "image not found!";
				var newpageanchor='<a href="#" class="404">Uh-oh.something went wrong</a>' +
				                  '<br />';
			}

			$("#dlinkscontainer").append(newpageanchor);

			//sort links
			$('#dlinks a[id^="page"]').sort(function (a, b) {
				var re = /page/g;
				return ~~a.id.replace(re, '') > ~~b.id.replace(re, '');
			})
			.appendTo("#dlinkscontainer");


		 }

		});


	};

	$("#dlloading").remove();


});
