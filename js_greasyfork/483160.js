// ==UserScript==
// @name           TV-Tropes: Image Uploader
// @namespace      ImageUploader
// @description    Adds an icon for image uploading to all pages on tv-tropes.org
// @include        https://tvtropes.org/*
// @license        MIT 
// @version 0.0.1.20231226133706
// @downloadURL https://update.greasyfork.org/scripts/483160/TV-Tropes%3A%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/483160/TV-Tropes%3A%20Image%20Uploader.meta.js
// ==/UserScript==

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

var elements = getElementsByClass("actions-wrapper");

var form = document.createElement('iu_button');
form.innerHTML = '<a href="#" id="ImgUploaderLink" data-modal-target="upload_image"><i class="fa fa-image"></i>  IU</a>';
elements[0].appendChild(form);
