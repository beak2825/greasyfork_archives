// ==UserScript==
// @name        Photobucket avoid 3rd part hosting
// @namespace   Photobucket avoid 3rd part hosting
// @description Avoid stupid photobucket error images
// @include     *
// @version     1.0
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/35429/Photobucket%20avoid%203rd%20part%20hosting.user.js
// @updateURL https://update.greasyfork.org/scripts/35429/Photobucket%20avoid%203rd%20part%20hosting.meta.js
// ==/UserScript==

var imgdata;

function replaceImgElt(elt) {
    var currentImageURL = elt.src;
	if (currentImageURL.toLowerCase().indexOf("photobucket") == -1) {
		return;
	}
	var extension = currentImageURL.split(".").pop().toLowerCase();
	var MimeType;
	if (extension == "jpg" || extension == "jpeg") {
		MimeType = "image/jpeg";
	}
	else {
		MimeType = "image/"+extension;
    }
	GM_xmlhttpRequest({
		method: "GET",
		url: currentImageURL,
		headers: {
			"Connection": "keep-alive",
			"Pragma": "no-cache",
			"Cache-Control": "no-cache",
			"Accept": "image/webp,image/*,*/*;q=0.8",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2550.2 Iron/48.0.2550.2 Safari/537.36",
			"DNT": "1",
			"Referer": currentImageURL,
			"Accept-Encoding": "gzip, deflate, sdch",
			"Accept-Language": "en-US,en;q=0.8"
        },
        overrideMimeType: "text/plain; charset=x-user-defined",
		onload: function(response) {
            imgdata = response.responseText;
            data = new Uint8Array(imgdata.length);
            var i = 0;
            while (i < imgdata.length) {
                data[i] = imgdata.charCodeAt(i);
                i++;
            }
            var blob = new Blob([data], {type: MimeType, endings: "transparent"});
            //create img element from blob
            var bloburl = URL.createObjectURL(blob);
            elt.src = bloburl;
		}
	});
}

function main() {
	imgElts = document.getElementsByTagName("img");
	for (var i=0; i<imgElts.length; i++) {
		replaceImgElt(imgElts[i]);
	}
}

main();