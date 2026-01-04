// ==UserScript==
// @name         maya document enhance
// @namespace    https://mayoi.me/
// @version      0.1
// @description  highlighting python in maya document
// @author       kns002
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/languages/python.min.js
// @match        https://help.autodesk.com/cloudhelp/*/CommandsPython/*
// @icon         https://knowledge.autodesk.com/sites/default/files/product-logo-sm/maya-2017-badge-75x75.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432282/maya%20document%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/432282/maya%20document%20enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function lcss(href){
		var el = document.createElement('link')
		el.href = href
		el.type="text/css"
		el.rel="stylesheet"
		document.querySelector("head").appendChild(el)
	}

    lcss("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css")

    hljs.configure({languages: ['python']});
    document.querySelectorAll('body > pre').forEach((el) => {
        hljs.highlightElement(el);
    });
})();