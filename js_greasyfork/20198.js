// ==UserScript==
// @name         OGARio - xNEL99x Public Edition Mozilla Firefox
// @namespace    http://xagar-scriptx.tk
// @version      2.0
// @description  OGARio Edited
// @author       szymy - NEL99
// @match        http://agar.io/*
// @include      https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/20198/OGARio%20-%20xNEL99x%20Public%20Edition%20Mozilla%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/20198/OGARio%20-%20xNEL99x%20Public%20Edition%20Mozilla%20Firefox.meta.js
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
		injectCSS("http://xagar-scriptx.tk/public/ogar-xnel99x.css");
		injectCSS("http://googledrive.com/host/0B66yR_spsJnAYnpGRndVWUVqbkk");
		injectJS("http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js", null, false);
		injectJS("http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", null, false);
		injectJS("http://xagar-scriptx.tk/public/ogar.sniff-xnel99x.js", null, true);
		injectJS("http://xagar-scriptx.tk/public/ogar-xnel99x.js", null, true);
		injectJS("http://googledrive.com/host/0B66yR_spsJnAWUFnN0xFcmZ5dmc", null, false);

    }, true);
}