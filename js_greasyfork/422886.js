// ==UserScript==
// @name          DM5 image zoom
// @author        Shiaupiau (https://github.com/stu43005)
// @include       http://*.dm5.com/*
// @include       https://*.dm5.com/*
// @version       1.1
// @namespace https://greasyfork.org/users/445066
// @description 動漫屋放大鏡
// @downloadURL https://update.greasyfork.org/scripts/422886/DM5%20image%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/422886/DM5%20image%20zoom.meta.js
// ==/UserScript==

(function init(func) {
	setTimeout(function () {
		if (typeof jQuery === 'undefined') {
			console.log('[DM5 image zoom] No jQuery, try again later');
			init(func);
			return;
		}
		const script = document.createElement('script');
		script.textContent = '(' + func.toString() + ')(window)';
		document.body.appendChild(script);
	}, 500);
})(function () {
	const zoomRatio = 2;

	const resultWidth = 300;
	const resultHeight = 300;

	if (!jQuery(".view-main").length) return;

	jQuery("body").append(`<div id="img-zoom-container" style="position: fixed; right: 20px; bottom: 100px; background-color: #1a1a1a; padding: 10px; border-radius: 3px;"><div id="img-zoom-result" style="width: ${resultWidth}px; height: ${resultHeight}px;"></div></div>`);

	jQuery(".rightToolBar").prepend(`<a href="javascript:void(0);" title="放大鏡" id="img-zoom-button" class="logo_3" style="display: block !important;"><div class="tip">放大鏡</div></a>`);

	jQuery("#img-zoom-button").click(function () {
		jQuery("#img-zoom-container").toggle();
	});

	const lensWidth = resultWidth / zoomRatio;
	const lensHeight = resultHeight / zoomRatio;

	const result = document.getElementById("img-zoom-result");
	jQuery(document).on("mousemove touchmove", ".view-main img", moveLens);

	function moveLens(e) {
		/* Prevent any other actions that may occur when moving over the image */
		e.preventDefault();

		const img = e.target;
		/* Set background properties for the result DIV */
		result.style.backgroundImage = "url('" + img.src + "')";
		result.style.backgroundSize = (img.width * zoomRatio) + "px " + (img.height * zoomRatio) + "px";

		/* Get the cursor's x and y positions: */
		const pos = getCursorPos(e, img);
		/* Calculate the position of the lens: */
		let x = pos.x - (lensWidth / 2);
		let y = pos.y - (lensHeight / 2);
		/* Prevent the lens from being positioned outside the image: */
		if (x > img.width - lensWidth) { x = img.width - lensWidth; }
		if (x < 0) { x = 0; }
		if (y > img.height - lensHeight) { y = img.height - lensHeight; }
		if (y < 0) { y = 0; }
		/* Display what the lens "sees": */
		result.style.backgroundPosition = "-" + (x * zoomRatio) + "px -" + (y * zoomRatio) + "px";
	}

	function getCursorPos(e, img) {
		let x = 0, y = 0;
		e = e || window.event;
		/* Get the x and y positions of the image: */
		const a = img.getBoundingClientRect();
		/* Calculate the cursor's x and y coordinates, relative to the image: */
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/* Consider any page scrolling: */
		x = x - window.pageXOffset;
		y = y - window.pageYOffset;
		return { x: x, y: y };
	}
});
