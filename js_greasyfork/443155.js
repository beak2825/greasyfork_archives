// ==UserScript==
// @name Wolfermus Website Hacks: Main Wordle ui.html
// @namespace https://greasyfork.org/en/users/900467-feb199
// @version 0.1.1
// @description This script contains html for website hacks that i have created and wanted to share
// @author Feb199/Dannysmoka
// @homepageURL https://github.com/Wolfermus/Wolfermus-Website-Hacks
// @supportURL https://github.com/Wolfermus/Wolfermus-Website-Hacks/issues
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/443155/Wolfermus%20Website%20Hacks%3A%20Main%20Wordle%20uihtml.user.js
// @updateURL https://update.greasyfork.org/scripts/443155/Wolfermus%20Website%20Hacks%3A%20Main%20Wordle%20uihtml.meta.js
// ==/UserScript==

(function() {
let css = `<div class="wlfWrapper">
<!--	<link rel="stylesheet" href="../css/main.css">-->
	<style id="wordle-wlf-style"></style>
	<script>
		(async function(){
			let wordleWlfStyleBox = await document.getElementById("wordle-wlf-style");
			wordleWlfStyleBox.innerHTML = await (await fetch(\`https://greasyfork.org/scripts/443154-wolfermus-website-hacks-main-wordle-main-css/code/Wolfermus%20Website%20Hacks:%20Main%20Wordle%20maincss.user.css\`)).text();
		})();
	</script>
	

	<img src="https://i.imgur.com/ZJwDGOz.png" alt="logo" class="wlfLogo">

	<nav class="wlfNav">
		<ul class="wlfUl">
			<li><a id="autoOutput">Auto Mode [Please Wait Loading...]</a></li>
			<li><a id="debugOutput">Debug Mode [Please Wait Loading...]</a></li>
			<li><a>[wip]</a></li>
			<li><a>[wip]</a></li>
		</ul>
		<a class="wlf-Output">Loading Script...</a>
	</nav>
</div>`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
