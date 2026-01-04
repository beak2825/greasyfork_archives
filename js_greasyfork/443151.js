// ==UserScript==
// @name Wolfermus Website Hacks: Main Menu ui.html
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
// @downloadURL https://update.greasyfork.org/scripts/443151/Wolfermus%20Website%20Hacks%3A%20Main%20Menu%20uihtml.user.js
// @updateURL https://update.greasyfork.org/scripts/443151/Wolfermus%20Website%20Hacks%3A%20Main%20Menu%20uihtml.meta.js
// ==/UserScript==

(function() {
let css = `<div class="main-wlf-wrapper">
<!--	<link rel="stylesheet" href="../css/main.css">-->
	<style id="main-wlf-style"></style>
	<script>
		(async function(){
			let mainWlfStyleBox = await document.getElementById("main-wlf-style");
			mainWlfStyleBox.innerHTML = await (await fetch(\`https://greasyfork.org/scripts/443150-wolfermus-website-hacks-main-menu-main-css/code/Wolfermus%20Website%20Hacks:%20Main%20Menu%20maincss.user.css\`)).text();
		})();
	</script>
	
	
	<div class="main-wlf-bg-modal">
		<div class="main-wlf-modal-content">
			<div id="main-wlf-close">+</div>
			<img src="https://i.imgur.com/ZJwDGOz.png" alt="logo" class="wlf-logo">

			<nav class="main-wlf-nav">
				<h1 id="main-wlf-autodetect">Detecting Website...</h1>
				<ul class="main-wlf-ul">
					<li><a id="main-branch">Main Branch</a></li>
					<li><a id="testing-branch">Testing Branch</a></li>
					<li><a id="dev-branch">Development Branch</a></li>
				</ul>
			</nav>

			<footer>
			  <p>Author: Feb199/Dannysmoka<br>
			  Github: <a href="https://github.com/Wolfermus/Wolfermus-Website-Hacks" target="_blank" rel="noopener noreferrer">Wolfermus/Wolfermus-Website-Hacks</a></p>
			</footer>
		</div>
	</div>
</div>`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
