// ==UserScript==
// @name        Github Pages Linker
// @description Add a link to Github Pages (gh-pages) when available.
// @author      ADoyle (adoyle.h@gmail.com)
// @copyright   2024 ADoyle (adoyle.h@gmail.com)
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @version     2.0.0
// @grant       none
// @run-at      document-end
// @include     https://github.com/*/*
// @license MIT
// @namespace https://greasyfork.org/users/898390
// @downloadURL https://update.greasyfork.org/scripts/498476/Github%20Pages%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/498476/Github%20Pages%20Linker.meta.js
// ==/UserScript==


(function() {

	const format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function addLink() {
		if(document.getElementById("GithubPagesLinker")) {
			return;
		}

		var meta = document.querySelector('#repository-container-header').firstElementChild;
		if (!meta) {
			return;
		}

        var tree = location.href.split("/");
		var url = format("https://{0}.github.io/{1}/", tree[3], tree[4]);

		var div = document.createElement("div");
		div.id = "GithubPagesLinker";
        div.className = "mb-1 container-xl px-3 px-md-4 px-lg-5"
		div.style["margin-top"] = "-10px";
		div.style["display"] = "flex";
        div.style["align-items"] = "center";
		meta.parentNode.insertBefore(div, meta.nextSibling);

        const img = document.createElement("img");
        img.setAttribute(
            "src",
            "https://github.githubassets.com/images/icons/emoji/octocat.png",
        );
        img.setAttribute("align", "absmiddle");
        img.classList.add("emoji");
        img.style.height = "16px";
        img.style.width = "16px";
        div.appendChild(img);
		div.appendChild(document.createTextNode("Github Page: "));

		const aa = document.createElement("a");
        aa.style = "margin-left: 0px !important;";
		aa.setAttribute("href", url);
		aa.appendChild(document.createTextNode(url));
		div.appendChild(aa);
	}

	// Init;
	addLink();

	// On pjax;
    document.addEventListener('pjax:end', addLink);

})();