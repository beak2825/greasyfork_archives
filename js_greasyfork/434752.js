// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy the url of a page then close it
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/434752/Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/434752/Copy%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("Button");
    button.innerHTML = "URL";
    button.style = "top:0;right:0;position:absolute;z-index: 9999;background-color: purple; height: 30px; width: 30px";
    button.id = "testb";
    document.body.appendChild(button);
	$("#testb").click( function() {
        var dummy = document.createElement('input'),
            text = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        window.close();
	});
}


)();