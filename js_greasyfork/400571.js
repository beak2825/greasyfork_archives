// ==UserScript==
// @name         Forums.sexy-youtubers.com Gallery Downloader
// @namespace    Hydr0
// @description  Download galleries from posts on forum.sexy-youtubers.com
// @version      1.0.1
// @icon         https://imgur.com/a/sgz2Jnd
// @license      WTFPL; http://www.wtfpl.net/txt/copying/
// @match        https://forums.sexy-youtubers.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://unpkg.com/jszip@3.2.0/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.1/dist/FileSaver.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?v=a834d46
// @noframes
// @connect      self
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/400571/Forumssexy-youtuberscom%20Gallery%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/400571/Forumssexy-youtuberscom%20Gallery%20Downloader.meta.js
// ==/UserScript==

jQuery(function ($) {	
	$('.message-attribution-opposite')
		.map(function () { return $(this).children('li:first'); })
		.each(function () {
				var downloadLink = $('<li><a href="#">⭳ Download</a><li>');
                var $text = downloadLink.children('a');
				downloadLink.insertBefore($(this));
				downloadLink.click(function (e) {
					e.preventDefault();
					
					var urls = $(this)
						.parents('.message-main')
						.first()
						.find('a.js-lbImage,.lbContainer-zoomer')
						.map(function () { return $(this).is('[href]') ? $(this).attr('href') : $(this).data('src'); })
						.get();
						
					var zip = new JSZip(),
						current = 0,
						total = urls.length;
					
					$text.text('Downloading...');
					
					function next () {
						if (current < total) {
							$text.text('Downloading ' + (current+1) + '/' + total);
							
							GM.xmlHttpRequest({
								method: 'GET',
								url: urls[current++],
								responseType: 'arraybuffer',
								onload: function (response) {
                                    try {
                                        var name = response.responseHeaders.match(/^content-disposition.+(?:filename=)(?<filename>.+)$/mi).groups['filename'].replace(/\"/g, '');
									    var data = response.response;
									    zip.file(name, data);
                                    }
                                    catch (err) {
                                        
                                    }
									
									next();
								},
								onerror: function (response) {
									next();
								}
							});
						}
						else {
							$text.text('Generating zip...');
							zip.generateAsync({ type: 'blob' })
								.then(function (blob) { 
                                  	$text.text('Download complete!');
									saveAs(blob, 'Gallery.zip');
								});
							
						}
					}
					next();
				});
			}
		);
});