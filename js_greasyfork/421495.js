// ==UserScript==
// @name         Nhentai scroll
// @namespace    https://github.com/Yan-Bin-Lin/nhentai_scroll_slide
// @version      0.5
// @description  scroll to read picture in nhentai
// @author       Lin Yan Bin
// @match        https://nhentai.net/g/*/*/
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421495/Nhentai%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/421495/Nhentai%20scroll.meta.js
// ==/UserScript==
(function() {
	let target = '#image-container';
    let ic = $("#image-container");
    let num = parseInt($("span.num-pages").first().text());
    let img = ic.find("img");
    let src = img.attr("src");
    let base = src.slice(0, src.lastIndexOf("/") + 1);
    let width = img.attr("width");
    let height = img.attr("height");
	let start = parseInt(window.location.pathname.slice(0, -1).split('/').pop()) + 1

	function insertImage(event) {
		let base = event.data.base
		let i = event.data.i
			let url = base + (i - 1).toString()
			if ($(target).find('img[src$="' + url + '.jpg"]').length > 0) {
				$('img[src$="' + url + '.jpg"]').after($(this));
			} else if ($(target).find('img[src$="' + url + '.png"]').length > 0) {
				$('img[src$="' + url + '.png"]').after($(this));
			} else {
				$(this).appendTo(target);
			}
		}


    function loadImage(base, i, width, height) {
		let url = base + i.toString();
        $('<img src="'+ url + '.jpg' +'">')
		.one("load", {base: base, i: i}, insertImage)
		.one("error", function() {
           $('<img src="'+ url + '.png' +'">')
			.one("load", {base: base, i: i}, insertImage)
        });
    }

    for (let i = start;i <= num; i++){
		  window.setTimeout(function() {
			  loadImage(base, i, width, height);
  }, 750 * (i - start));

    }

})();