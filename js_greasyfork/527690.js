// ==UserScript==
// @name         motherless-gallery-alt
// @version      0.0.3
// @description  View search results, favorites, groups and more in a gallery
// @author       Skapes
// @namespace    https://greasyfork.org/users/1438341
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/nanogallery2/3.0.5/jquery.nanogallery2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js
// @resource     css https://cdnjs.cloudflare.com/ajax/libs/nanogallery2/3.0.5/css/nanogallery2.min.css
// @resource     font https://cdnjs.cloudflare.com/ajax/libs/nanogallery2/3.0.5/css/nanogallery2.woff.min.css
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
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/527690/motherless-gallery-alt.user.js
// @updateURL https://update.greasyfork.org/scripts/527690/motherless-gallery-alt.meta.js
// ==/UserScript==

// pre init
var final = [];
var galleryload = 0;
var NP = $("a[rel*='next']").attr('href');
var PP = $("a[rel*='prev']").attr('href');
// set hock on the page
$("div[class*='content-outer']").prepend('<div id="gallery_hook"></div>');

(function() {
	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 96 && galleryload == 0) {
			//init
			GM_addStyle(GM_getResourceText("css"));
			GM_addStyle(GM_getResourceText("font"));
			galleryload = 1;

			var imagesArray = $("img[class*='static']").map(function() {
				return {
				  title: $(this).attr('alt'),
				  url: $(this).attr('data-strip-src'),
				  thumb: $(this).attr('data-strip-src'),
				  extUrl: $(this).attr('data-strip-src'),
				}
			}).get();
			//console.log(imagesArray);

			//filter
			imagesArray = jQuery.grep(imagesArray, function(item) {
				return item.url.match(/cdn5-thumbs.motherlessmedia.com\/thumbs\//g) != null;
			});

			for (var i = 0; i < imagesArray.length; i++) {
				imagesArray[i].url = imagesArray[i].url.replace('?from_helper', '');
				for (var u = 0; u < 2; u++) {
					imagesArray[i].url = imagesArray[i].url.replace('thumbs', 'images');
				}
				// item is a video
				if (imagesArray[i].url.includes("strip", 31)) {
					imagesArray[i].thumb = imagesArray[i].thumb.replace('strip', 'small');
					imagesArray[i].extUrl = imagesArray[i].extUrl.replace('-strip', '');
					imagesArray[i].url = imagesArray[i].url.replace('-strip.jpg', '.mp4');
					for (var o = 0; o < 2; o++) {
						imagesArray[i].url = imagesArray[i].url.replace('images', 'videos');
					}

				}
				imagesArray[i].extUrl = imagesArray[i].extUrl.replace('cdn5-thumbs.motherlessmedia.com/thumbs', 'motherless.com');
				imagesArray[i].extUrl = imagesArray[i].extUrl.substring(0, imagesArray[i].extUrl.length - 4);

				imagesArray[i].title = he.decode(imagesArray[i].title);
			}

			for (var p = 0; p < imagesArray.length; p++) {
				final.push({
				  src: imagesArray[p].url,
				  srct: imagesArray[p].thumb,
				  title: imagesArray[p].title,
				  downloadURL: imagesArray[p].url,
				  customData: {
				    extUrl: imagesArray[p].extUrl
				  }
				});
			}

			//https://nanogallery2.nanostudio.org/
			jQuery("#gallery_hook").nanogallery2({
				// ### gallery settings ###
				galleryDisplayMode: 'fullContent',
				thumbnailHeight: 'auto',
				thumbnailWidth: '300',
				thumbnailBaseGridHeight: 50,
				thumbnailAlignment: 'fillWidth',
				thumbnailL1GutterWidth: 4,
				thumbnailL1GutterHeight: 4,
				viewerGallery: 'bottom',
				viewerToolbar: { // bottom toolbar
				  display: true,
				  standard:  'label',
				  minimized: 'label'
				},
				viewerTools: {
				  topRight: 'custom1, custom2, rotateLeft, rotateRight, fullscreenButton, closeButton'
				},
				viewerHideToolsDelay: 30000,
				thumbnailLabel: {
				  display: false
				},
				thumbnailToolbarImage: {
				  topRight : 'download'
				},
				locationHash: true,
				icons: {
				  viewerCustomTool1: '<i class="nGY2Icon-ngy2_download2"></i>',
				  viewerCustomTool2: '<i class="nGY2Icon-ngy2_external2"></i>'
				},
				fnImgToolbarCustClick: myToolbarCustClick,
				// ### gallery content ###
				items: final
			});

		}

		// Click event on custom lightbox toolbar element
		function myToolbarCustClick(customElementName, $customIcon, item) {

		  // Display the title of the current displayed image
		  if (customElementName == 'custom1') {
			var arg = {
			  url: item.src,
			  name: item.src.split('/').pop()
			};
			GM_download(arg);
		  } else if (customElementName == 'custom2') {
			//alert('Image link: ' + item.customData.extUrl);
			GM_openInTab(item.customData.extUrl, true)
		  }
		}

		document.querySelectorAll('.content-inner').forEach(el => el.hidden = true);

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