// ==UserScript==
// @name		 GGn PSXDatacenter Image Grabber
// @namespace	 https://gazellegames.net/
// @version		 0.06
// @description	 PSXDatacenter Image Grabber for GGn
// @author		 NeutronNoir
// @match		 https://gazellegames.net/upload.php*
// @match		 https://gazellegames.net/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25777/GGn%20PSXDatacenter%20Image%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/25777/GGn%20PSXDatacenter%20Image%20Grabber.meta.js
// ==/UserScript==

function urlencode (str) {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function get_psxdatacenter_images(gameTitle) {
	
	return new Promise(function (resolve, reject) {
		var request = new GM_xmlhttpRequest({
				method: "GET",	//Search on DuckDuckGo for the first result on PSXDatacenter
				url: "https://www.duckduckgo.com/html/?q=" + urlencode("site:psxdatacenter.com " + gameTitle),
				onload: function(response) {
					if (response.status != 200) {
						reject("Cannot search DuckDuckGo for \"site:psxdatacenter.com+" + urlencode(gameTitle) + "\"");
						console.log(response);
				  } else {
						var psxDatacenterUrl = $(response.responseText).find(".result__url").first().attr("href");
					  resolve(psxDatacenterUrl);
					}
				}
			});
	}).then(function (psxDatacenterUrl) {
		return new Promise( function (resolve, reject) {
			var request = new GM_xmlhttpRequest({
				method: "GET",	//Use the result from DuckDuckGo to get the PSXDatacenter page, make an array of the images and return it
				url: psxDatacenterUrl,
				onload: function(response) {
					if (response.status != 200) {
						reject("Cannot get page " + psxDatacenterUrl);
					} else {
						var images = $(response.responseText).find("#table22 img").get();
						var image_array = images.map(function (item, index) {
							return "http://psxdatacenter.com/" + $(item).attr("src").replace(/..\/..\/..\/(.*)/, "$1");
						});
						var cover = "http://psxdatacenter.com/" +$(response.responseText).find("#table28>tbody>tr>td>a").first().attr("href").replace(/..\/..\/..\/(.*)/, "$1").replace("html", "jpg");
						resolve({"images": image_array, "cover": cover});
					}
				}
			});
		});
	});
}

(function() {
	'use strict';
	var title;
	
	if (document.location.href.indexOf("action=editgroup") != -1) {
		title = $("input[name='name']");
		$("#image_block").prepend("<input type='button' id='search_psxdatacenter' value='Search PSXDatacenter for screenshots'>");
	} else {
		title = $("#title");
		$("#title").after("<input type='button' id='search_psxdatacenter' value='Search PSXDatacenter for screenshots'>");
	}
	
	$("#search_psxdatacenter").on("click", function () {
		get_psxdatacenter_images(title.val()).then( function (image_obj) {
			var image_array = image_obj.images;
			var add_screen = $("#image_block a[href='#']").first();
			image_array = image_array.slice(0, 16);
			image_array.forEach(function (item, index) {
				if (index >= 3) add_screen.click();
			});
			$("input[name='screens[]']").each(function(index) {
				$(this).val(image_array[index]);
			});
			$("input[name='image']").val(image_obj.cover);
		}).catch(function (error) {
			alert(error);
		});
	});
})();