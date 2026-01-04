// ==UserScript==
// @name         SubScene URL Search
// @name:tr      SubScene URL Araması
// @namespace    https://github.com/nhtctn
// @version      1.5
// @description  If you enter required parameter in URL, it trigger a search on Subscene (URL example: https://subscene.com/subtitles/title?q=Avatar).
// @description:tr Subscene sitesinde eskisi gibi URL'den arama yapmaya olanak sağlar (URL örneği: https://subscene.com/subtitles/title?q=Avatar).
// @author       nht.ctn
// @license      MIT
// @match        *://subscene.com/subtitles/title?q=*
// @match        *://subscene.com/subtitles/searchbytitle*
// @grant        none
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMAUExURQAAACNdfiRdfiRefyZfgCdggCdggShggSpigitjgyxjgy1lhC9mhTBnhjFohjJohzZriTdrijhtijltizpuiztujD1wjT5xjkFzj0R2kkd4k0h4k0h5lEp6lUx7lk58l099mFB+mFKAmlSBm1WCm1aDnFmFnl2IoF+JoWGLomKLo2KMo2OMpGWNpGuSqGuTqW+Vq3CWq3KXrHaar3ibsHqdsXyfsn2fs36gs3+gtICitYOjtoSlt4WluIenuYmouoqpu42rvI6svZCtvpCuvpKvv5OwwJaywZeywpizw5m0w5u1xJy2xZ+4x6S8yqe+zKi/zKvBzqzCzrHF0bHG0bHG0rfK1bnM1rvN17zO2L7P2b/Q2cDQ2sLS28PT3MXU3cjW38rY4M3a4tLe5NLe5dXg5tfh59fi6Nji6Nvk6t3m697n7OHp7eTr7+ft8efu8env8urv8+3x9O/z9vD09vH19/P2+PT3+fX4+fb4+vj6+/n7/Pv8/fz9/f39/v3+/v7+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKFmC1oAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjlsM35OAAACWklEQVRYR+2XWVvTQBSGPVatCwrSIi4gqLiCVAvuKygoWBHrXlEqorjiLrYinX9eZ/mUSciZzpPc8t70fGee87ZJk6azpp4QI8jnYpDXo0qQoZhkjKAVMQZZLUCIhRLkUcciLwU51LHIrQoaCdJHRu6VHk+cakdeiVOwaeirAOXja9EM4RJ0vMO05sVutIM4BN0/MAqq57AQgBe0fMbgMnfXY82CF9zXM7MnW1PbDhW+6SDGsWbBCnbV1MRYyqSm8UWZZreaZMMKRtT8JILkwCcx14zahhWU5fwv+x2zD1tQBWAFX6RgCrULVvBbCoqoXbCCn1IwjdoFK3gtBdXtCA5YwaQU+BwDKzimBOIiEg8rSL3VhttpZA5WQIf1pSje7Edm4AV0TQtErdiGRiQOAY0ag6jeirqGgUtAJ9TFoPh+fh1aK3AKqP05DOLlHrTCuAVE/R9gqAyiE6KRgNJn//0y3UQnSEMB0ebrFWMYRiOAh+D/qVjqQbbxElDqir6qZhBt/AREp/Vn2Idk4SugZ0owimDhLehTgqcIFt6CZiV4hWDhLUgrwRyChbdghxKUESx4QSdewRkluINgwQoGlwZQabZ8VIKIP4Sc4OiiqA3jwSjZ8EjNLzQhWjCCrgU1UO5AbJtWURQQbRjBJT0gaqWBzszOvglzN81HPJzZQyjokQDVqHuJP4kX1MPRptKLlSCsgPbOYNLwvhv9ELyAqHfqD6bF/OWNaIZxCeQN0H/jQelJ8erB5S80jFvgwarACBJvuhJv++pZhBiYjWd8g5zXgsSb7wTU638BugwLwu/3UiYAAAAASUVORK5CYII=
// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388069/SubScene%20URL%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/388069/SubScene%20URL%20Search.meta.js
// ==/UserScript==
/* global $ */
/*jshint esversion: 6 */
(function() {
	'use strict';

	let url = window.location.href;
	let searched = $('input#query').val();

	if (url.search(/subtitles\/title\?q\=/) >= 0 && $('meta#redirecting648').length < 1) {
		window.stop();
		$('head').append('<meta id="redirecting648">');
		if ($("html").attr("searchByTitle") != 1) {
			$("html").attr("searchByTitle", 1);
			let urlParams = new URLSearchParams(window.location.search);
			let postKeyword = urlParams.get('q');
			let postUrl = '/subtitles/searchbytitle';

			if (urlParams.get('q') && postKeyword !== '') {
				let postForm = document.createElement("form");
				postForm.setAttribute("method", "post");
				postForm.setAttribute("action", postUrl);
				let hiddenField = document.createElement("input");
				hiddenField.setAttribute("name", "query");
				hiddenField.setAttribute("value", postKeyword);
				hiddenField.setAttribute("type", "hidden");
				postForm.appendChild(hiddenField);
				document.getElementsByTagName('html')[0].appendChild(postForm);
				postForm.submit();
			}
			else{
				document.location = 'https://subscene.com/subtitles';
			}
		}
	}
	else if (url.search("subtitles/searchbytitle") >= 0 && searched != null) {
		history.pushState({}, "", 'https://subscene.com/subtitles/title?q=' + searched);
	}

})();