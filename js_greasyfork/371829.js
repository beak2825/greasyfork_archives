// ==UserScript==
// @name Fit Images to Screen
// @description Collapses large images to the width of the screen by shift-clicking them.
// @include http://*.endoftheinter.net/showmessages.php*
// @include https://*.endoftheinter.net/showmessages.php*
// @include http://*.endoftheinter.net/message.php*
// @include https://*.endoftheinter.net/message.php*
// @include http://endoftheinter.net/showmessages.php*
// @include https://endoftheinter.net/showmessages.php*
// @include http://endoftheinter.net/linkme.php*
// @include https://endoftheinter.net/linkme.php*
// @include http://links.endoftheinter.net/linkme.php*
// @include https://links.endoftheinter.net/linkme.php*
// @version 0.0.1.20180902114740
// @namespace https://greasyfork.org/users/209796
// @downloadURL https://update.greasyfork.org/scripts/371829/Fit%20Images%20to%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/371829/Fit%20Images%20to%20Screen.meta.js
// ==/UserScript==

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if (node == null) {
		node = document;
    }
	if ( tag == null) {
		tag = '*';
    }
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	for (var i = 0, j = 0; i < elsLen; i++) {
		if (els[i].className == searchClass) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

var userpicColumn = getElementsByClass('userpic', document, '*');
if (userpicColumn.length == 0) {
	var userpicsLength = 0;
} else {
	var userpicsLength = userpicColumn[0].offsetWidth;
}
var leftMenu = getElementsByClass('classic3', document, 'th');
if (leftMenu.length != 0) {
	userpicsLength += leftMenu[0].offsetWidth;
}

var maxWidth = document.body.clientWidth - userpicsLength - 43;

//alert(maxWidth);

function processImages() {
	var imageDivs = getElementsByClass("img-loaded", document, "span");
	//alert(imageDivs.length);
	for (var i = 0; i < imageDivs.length; i++) {
		var imageDiv = imageDivs[i];
		var inimages = imageDiv.getElementsByTagName("img");
		//alert(inimages.length);
		for (var j = 0; j < inimages.length; j++) {
			if (inimages[j].className != "resizedImageGM") {
				inimages[j].className = "resizedImageGM";
				if (inimages[j].width > maxWidth) {
					inimages[j].height = (maxWidth/inimages[j].width) * inimages[j].height;
					inimages[j].width = maxWidth;
					imageDiv.setAttribute('style', 'width: ' + maxWidth + "; height: " + inimages[j].height);
				}
			}
		}
	}
}


var repeated = setInterval(processImages, 250);

document.addEventListener('scroll', processImages, true);
/*
     FILE ARCHIVED ON 10:57:29 Sep 02, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:57:29 Sep 02, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/