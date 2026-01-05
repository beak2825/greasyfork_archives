// ==UserScript==
// @name         Cik | Public Extension Mozilla Firefox
// @namespace    Cik - Public Extension Mozilla Firefox
// @version      1.3
// @description  Made by Cik | Host: Sniikz (only works with greasemonkey)
// @author       Sniikz
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21083/Cik%20%7C%20Public%20Extension%20Mozilla%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/21083/Cik%20%7C%20Public%20Extension%20Mozilla%20Firefox.meta.js
// ==/UserScript==

if (typeof GM_info === "undefined" || GM_info.scriptHandler) {
    alert("Your browser does not support this version of OGARio by szymy LE!");
} else {
    // Prevent and remove original script
    document.addEventListener("beforescriptexecute", function(event) {
        if (event.target.src.search("agario.core.js") != -1) {
            event.preventDefault();
            event.stopPropagation();
            event.target.parentNode.removeChild(event.target);
            document.removeEventListener("beforescriptexecute", this, true);
        }
    }, true);
    // Inject scripts
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
		injectCSS("http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css");
		injectCSS("http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css");
		injectCSS("https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/mek.css");
		injectCSS("https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/2.css");
		injectCSS("https://googledrive.com/host/0B-rarv9FlL8-TklBOHVzMm0wMGs/css.css");
		injectJS("http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js", null, false);
		injectJS("http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", null, false);
		injectJS("https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/ext.js", null, true);
		injectJS("https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/2.js", null, true);

    }, true);
}