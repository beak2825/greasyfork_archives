// ==UserScript==
// @name           Facebook Logout Shortcut Just Press Alt+L
// @namespace  
// @version        3.1.4
// @description    Press Alt+L to logout
// @include        http*://*.facebook.com/*
// @grant          none
// @copyright      Devendra Pratap Singh
// @downloadURL https://update.greasyfork.org/scripts/2656/Facebook%20Logout%20Shortcut%20Just%20Press%20Alt%2BL.user.js
// @updateURL https://update.greasyfork.org/scripts/2656/Facebook%20Logout%20Shortcut%20Just%20Press%20Alt%2BL.meta.js
// ==/UserScript==

window.onload = function(){
    document.getElementById('userNavigationLabel').click();
    document.getElementById('userNavigationLabel').click();
}

var eventUtility = {
    addEvent : function(el, type, fn) {
        if (typeof addEventListener !== "undefined") {
            el.addEventListener(type, fn, false);
        } else if (typeof attachEvent !== "undefined") {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    }
};

(function() {
	eventUtility.addEvent(document, "keydown",
		function(evt) {
			var code = evt.keyCode,
			altKey = evt.altKey;
            
			if (altKey && code === 76) {
                console.log("logging out!");
				document.forms[document.forms.length-1].submit();
			}
		});
}());