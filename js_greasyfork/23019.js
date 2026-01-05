// ==UserScript==
// @name         HSLO LITE - Mozilla Firefox with Greasemonkey
// @version      2.5
// @author       SZYMY | 2COOLIFE
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @description  Mozilla Firefox with greasemonkey
// @namespace https://greasyfork.org/users/16956
// @downloadURL https://update.greasyfork.org/scripts/23019/HSLO%20LITE%20-%20Mozilla%20Firefox%20with%20Greasemonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/23019/HSLO%20LITE%20-%20Mozilla%20Firefox%20with%20Greasemonkey.meta.js
// ==/UserScript==

// Copyright © 2016 ogario.ovh | OAG

if (typeof GM_info === "undefined" || GM_info.scriptHandler) {
    alert("Your browser does not support this version of OGARio by szymy. Please install the chrome version.");
} else {
    document.addEventListener("beforescriptexecute", function(event) {
        if (event.target.src.search("agario.core.js") != -1 || event.target.textContent.search("window.NREUM") != -1) {
            event.preventDefault();
            event.stopPropagation();
            event.target.parentNode.removeChild(event.target);
            document.removeEventListener("beforescriptexecute", this, true);
        }
    }, true);
    document.addEventListener("DOMContentLoaded", function(event) {
        function injectJS(src, onload, body) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			script.charset = 'utf-8';
			script.onload = onload;
			if (body) {
				document.body.appendChild(script);
				return;
			}
			document.head.appendChild(script);
		}
		function injectCSS(href) {
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = href;
			head.appendChild(link);
		}
			injectCSS("https://fonts.googleapis.com/css?family=Oswald:400,300");
			injectCSS("https://fonts.googleapis.com/css?family=Ubuntu:300,400,500");
		injectCSS("http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css");
		injectCSS("http://ogario.ovh/download/v2/dep/toastr.min.css");
		injectCSS("http://oag-agar.tk/HSLOLITE/style.css");
		injectJS("http://oag-agar.tk/HSLOLITE/sniff.js", null, false);
		injectJS("http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js", null, false);
		injectJS("http://ogario.ovh/download/v2/dep/toastr.min.js", null, false);
		injectJS("http://oag-agar.tk/HSLOLITE/main.js", null, true);
    }, true);
}