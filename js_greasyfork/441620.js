// ==UserScript==
// @name         MailChimp Page Break Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       Kane Simpson
// @match        https://mailchi.mp/*/*-newsletter-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mailchi.mp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441620/MailChimp%20Page%20Break%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/441620/MailChimp%20Page%20Break%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var all_elm_types = [
		"mcnTextBlock", "mcnCaptionBlock", "mcnDividerBlock",
		"mcnImageBlock", "mcnImageGroupBlock"
	];

	var css_string = ".break-the-page {page-break-before: always;}"
	var css_set_elms = ""
	var css_unset_elms = ""
	for (const collection_class_name of all_elm_types) {
		css_set_elms += "." + collection_class_name + ".break-the-page:hover, "
		css_unset_elms += "." + collection_class_name + ":hover, "
	}
	css_set_elms = css_set_elms.substring(0, css_set_elms.length - 2) + " ";
	css_unset_elms = css_unset_elms.substring(0, css_unset_elms.length - 2) + " ";

	css_unset_elms += "{border: 1px blue solid;}"
	css_set_elms += "{border: 1px green solid;}"
	var styles = css_string + " " + css_unset_elms + " " + css_set_elms

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

	var all_elms = [];
	for (const collection_class_name of all_elm_types) {
		var each_collection = document.getElementsByClassName(collection_class_name);
		for (const elm of each_collection) all_elms.push(elm);
	}
	
    for (const elm of all_elms) {
        elm.style.cursor = "crosshair";
        elm.addEventListener("click", function (e) {
            var class_name = "break-the-page";
            if (e.currentTarget.classList.contains(class_name)) {
                e.currentTarget.classList.remove(class_name);
                console.log("Page break removed");
            }
            else {
                e.currentTarget.classList.add(class_name);
                console.log("Page break added");
            }
        });
    }
})();