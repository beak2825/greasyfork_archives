// ==UserScript==
// @name        Türkanime Arama Yardımcısı
// @namespace   https://forum.planetdp.org/index.php?/topic/2846-arama-motorlar%C4%B1n%C4%B1n-arama-adresi-hakk%C4%B1nda/&do=findComment&comment=30775
// @description Türkanime sitesinde URL'den arama yapmaya olanak sağlar (URL Örneği: https://www.turkanime.co/?q=Hinamatsuri).
// @author      nukleer
// @version     1.1
// @icon        data:image/png;base64,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

// @include     *://*turkanime.co/?q=*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/409848/T%C3%BCrkanime%20Arama%20Yard%C4%B1mc%C4%B1s%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/409848/T%C3%BCrkanime%20Arama%20Yard%C4%B1mc%C4%B1s%C4%B1.meta.js
// ==/UserScript==
(function() {
const pageUrl = window.location.href;
if (pageUrl.search(/https?:\/\/.+turkanime\.co/) >= 0) {
	window.stop();

	let urlParams = new URLSearchParams(window.location.search);
	let postKeyword = urlParams.get('q');

	if (urlParams.get('q') && postKeyword !== '') {
		let postForm = document.createElement("form");
		postForm.setAttribute("method", "post");
		postForm.setAttribute("action", "arama");
		let hiddenField = document.createElement("input");
		hiddenField.setAttribute("name", "arama");
		hiddenField.setAttribute("value", postKeyword);
		hiddenField.setAttribute("type", "hidden");
		postForm.appendChild(hiddenField);
		document.getElementsByTagName('html')[0].appendChild(postForm);
		postForm.submit();
	}
}

})();