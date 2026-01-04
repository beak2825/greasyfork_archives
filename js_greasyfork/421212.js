// ==UserScript==
// @name         Tweet CopyPasta の動画URLから ?tag=.. を消すやつ
// @namespace    pyokopyoko
// @version      1
// @description  コピーボタンを押した時に ?tag=.. を消してからコピーするように変更します
// @author       pyokopyoko
// @match        https://tweet-copypasta.netlify.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421212/Tweet%20CopyPasta%20%E3%81%AE%E5%8B%95%E7%94%BBURL%E3%81%8B%E3%82%89%20tag%3D%20%E3%82%92%E6%B6%88%E3%81%99%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/421212/Tweet%20CopyPasta%20%E3%81%AE%E5%8B%95%E7%94%BBURL%E3%81%8B%E3%82%89%20tag%3D%20%E3%82%92%E6%B6%88%E3%81%99%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
	document.querySelector("button:not(.is-success)").addEventListener("click", (e) => {
		navigator.clipboard.writeText(document.querySelector("textarea").value.replace(/(?<=\.mp4)\?tag=\d+/g, "").replace(/\r?\n/g, "\r\n"));
	});
})();