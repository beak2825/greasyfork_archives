// ==UserScript==
// @name         img src To Data URL with jQuery
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.wah.or.kr/side_mento/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11259/img%20src%20To%20Data%20URL%20with%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/11259/img%20src%20To%20Data%20URL%20with%20jQuery.meta.js
// ==/UserScript==

(function(){
		document.addEventListener("DOMNodeInserted", function(){
		$('img[src]:not([src^="data:image"])').each(function(key, image){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = image.width;
			canvas.height = image.height;
			ctx.drawImage(image, 0, 0, image.width, image.height);
			image.src = canvas.toDataURL();
		});
	});
})();