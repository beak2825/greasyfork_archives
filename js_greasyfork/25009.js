// ==UserScript==
// @name         Mobygames BBCode
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.1
// @include      http://www.mobygames.com/game/*
// @include      https://www.mobygames.com/game/*
// @description  try to take over the world!
// @author       NeutronNoir
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/23948-html2bbcode/code/HTML2BBCode.js
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/25009/Mobygames%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/25009/Mobygames%20BBCode.meta.js
// ==/UserScript==
function button_css () {
	return "\
		#save_link {\
			position: fixed;\
			left: 0;\
			top: 0;\
			z-index: 999999;\
			cursor: pointer;\
            height: 5%;\
            background-color: lightblue;\
		}\
	";
}

(function() {
    'use strict';
    GM_addStyle(button_css());
    if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
	$("body").prepend('<input type="button" id="save_desc" value="Save description"/>');
    $("#save_desc").click(function() {
        GM_setClipboard(html2bb($(".col-md-8, .col-lg-8").html().replace(/[\n]*/g, "").replace(/.*<h2>Description<\/h2>/g, "").replace(/<div.*/g, "").replace(/< *br *>/g, "\n")), "text");
        alert("Description copied to clipboard");
    });
})();