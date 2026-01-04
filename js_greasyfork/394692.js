 // ==UserScript==
// @name         motherless-gallery
// @version      1.0.1.9u
// @description  View search results, favorites, groups and more in a gallery
// @author       Madagambada
// @namespace    https://github.com/Madagambada
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://unpkg.com/nanogallery2/dist/jquery.nanogallery2.min.js
// @resource     css https://unpkg.com/nanogallery2/dist/css/nanogallery2.min.css
// @resource     font https://raw.githubusercontent.com/nanostudio-org/nanogallery2/master/src/css/nanogallery2.woff.css
// @match        https://motherless.com/term/images/*
// @match        https://motherless.com/images/*
// @match        https://motherless.com/live/images
// @match        https://motherless.com/gi/*
// @match        https://motherless.com/GI*
// @match        https://motherless.com/porn/*/images*
// @match        https://motherless.com/f/*/images*
// @match        https://motherless.com/u/*t=i
// @match        https://motherless.com/term/videos/*
// @match        https://motherless.com/videos/*
// @match        https://motherless.com/live/videos
// @match        https://motherless.com/gv/*
// @match        https://motherless.com/GV*
// @match        https://motherless.com/porn/*/videos*
// @match        https://motherless.com/f/*/videos*
// @match        https://motherless.com/u/*t=v
// @match        https://motherless.com/GM*
// @match        https://motherless.com/u/*t=a
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/394692/motherless-gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/394692/motherless-gallery.meta.js
// ==/UserScript==

// pre init
var final = [];
var tumb = [];
var data_url = [];
var title = [];
var galleryload = 0;
var NP = $("a[rel*='next']").attr('href');
var PP = $("a[rel*='prev']").attr('href');
// set hock on the page
$("div[class*='content-inner']").prepend('<div id="gallery_hook"></div>');

(function() {
	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 96 && galleryload == 0) {
			//init
			GM_addStyle(GM_getResourceText("css"));
			GM_addStyle(GM_getResourceText("font"));
			galleryload = 1;
			//https://forums.digitalpoint.com/threads/how-to-store-all-img-tags-in-one-array-using-jquery.2547757/
			var imagesArray = $("img[class*='static']").map(function() {
				return $(this).attr('data-strip-src');
			}).get();
			//filter
			imagesArray = jQuery.grep(imagesArray, function(item) {
				return item.match(/cdn5-thumbs.motherlessmedia.com\/thumbs\//g) != null;
			});
			for (var i = 0; i < imagesArray.length; i++) {
				tumb[i] = imagesArray[i];
				imagesArray[i] = imagesArray[i].replace('?from_helper', '');
				for (var u = 0; u < 2; u++) {
					imagesArray[i] = imagesArray[i].replace('thumbs', 'images');
				}
				title[i] = imagesArray[i];
				if (imagesArray[i].includes("strip", 31)) {
					tumb[i] = tumb[i].replace('strip', 'small');
					imagesArray[i] = imagesArray[i].replace('-strip.jpg', '.mp4');
					for (var o = 0; o < 2; o++) {
						imagesArray[i] = imagesArray[i].replace('images', 'videos');
						//console.log(imagesArray[i]);
					}
				}
				data_url[i] = imagesArray[i];
				var tamplate1 = "<a rel='noopener noreferrer' target='_blank' href='";
				var tamplate2 = "'>open site in new tab</a>";

				title[i] = title[i].replace('cdn5-images.motherlessmedia.com/images', 'motherless.com');
				title[i] = tamplate1 + title[i].substring(0, title[i].length - 4) + tamplate2;
			}
			for (var p = 0; p < imagesArray.length; p++) {
				final.push({
					src: data_url[p],
					srct: tumb[p],
					title: title[p]
				});
			}

			//https://nanogallery2.nanostudio.org/
			jQuery("#gallery_hook").nanogallery2({
				// ### gallery settings ###
				thumbnailHeight: 150,
				thumbnailWidth: 150,
				allowHTMLinData: true,
				viewerGallery: "none",
				viewerTools: {
					topRight: 'label, rotateLeft, rotateRight, fullscreenButton, closeButton'
				},
				thumbnailLabel: {
					"display": false
				},
				// ### gallery content ###
				items: final
			});
		}
	}, false);
})();

(function() {
	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 99) {
			if (window.location.href.indexOf("/live/") != -1) {
				location.reload();
			}
			if ($("a[rel*='next']").length) {
				window.location = NP;
			}
		} else if (e.keyCode == 97) {
			if (window.location.href.indexOf("/live/") != -1) {
				location.reload();
			}
			if ($("a[rel*='prev']").length) {
				window.location = PP;
			}
		} else if (e.keyCode == 98 && galleryload == 1) {
			if (window.location.href.search("#nanogallery/gallery_hook/0/") > 1) {
				$('#gallery_hook').nanogallery2('closeViewer');
			}
			$('#gallery_hook').nanogallery2('displayItem', '0/1');
		}
	}, false);
})();