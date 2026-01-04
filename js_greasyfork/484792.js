// ==UserScript==
// @name         新标签页打开链接
// @namespace    http://tampermonkey.net/
// @version      2024-01-14
// @description  在新标签页打开所有链接
// @author       H-OH
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484792/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/484792/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    "use strict";
	document.querySelectorAll("a").forEach(function(link) {
		if (link.getAttribute("href") !== "#" && link.getAttribute("href") !== "") {
			link.setAttribute("target", "_blank");
		}
	});
})();