// ==UserScript==
// @name      Fuck Mangashow
// @namespace idk
// @version   3
// @grant     unsafeWindow
// @include   http*://mangashow.me/bbs/board.php?bo_table=msm_manga&wr_id=*
// @include   http*://manamoa.net/bbs/board.php?bo_table=manga&wr_id=*
// @description Add a button to download the whole chapter from mangashow.
// @downloadURL https://update.greasyfork.org/scripts/377968/Fuck%20Mangashow.user.js
// @updateURL https://update.greasyfork.org/scripts/377968/Fuck%20Mangashow.meta.js
// ==/UserScript==

var div       = document.createElement ('div');
div.innerHTML = '<button id="buttonPng" type="button">'
                + 'DOWNLOAD CHAPTER PNG</button>'
				+ '<button id="buttonJpeg" type="button">'
                + 'DOWNLOAD CHAPTER JPEG</button>'
                ;
div.setAttribute ('id', 'myContainer');
document.body.insertBefore(div, document.getElementById("thema_wrapper"))

document.getElementById ("buttonPng").addEventListener (
    "click", downloadPng, false
);
document.getElementById ("buttonJpeg").addEventListener (
    "click", downloadJpeg, false
);

function getFucked(img_url, filename, imgType) {
	var me = unsafeWindow.vv, canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), img = new Image;
	img.crossOrigin = "anonymous";
	img.src = img_url;
	canvas.width=img.naturalWidth;
	canvas.height=img.naturalHeight;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	img.onload=function(){
		me.rtc(canvas, null, img, 0);
		var link = document.createElement("a");
		link.download = filename;
		var uri = canvas.toDataURL(imgType);
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

function downloadPng(ev) {
	var i = 0;
	var id = -1;
	id = window.setInterval(function() {
		getFucked(unsafeWindow.img_list[i], ("0"+(i+1)).slice(-2) + ".png", "image/png");
		i=i+1;
		if (i==unsafeWindow.img_list.length) {
			window.clearInterval(id);
		}
	}, 1001);
}

function downloadJpeg(ev) {
	var i = 0;
	var id = -1;
	id = window.setInterval(function() {
		getFucked(unsafeWindow.img_list[i], ("0"+(i+1)).slice(-2) + ".jpg", "image/jpeg");
		i=i+1;
		if (i==unsafeWindow.img_list.length) {
			window.clearInterval(id);
		}
	}, 1001);
}