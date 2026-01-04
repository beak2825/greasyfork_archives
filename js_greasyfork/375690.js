// ==UserScript==
// @name         Website to editor
// @namespace    http://tampermonkey.net/
// @icon         https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/10346186_1645759148993427_6744387242769246115_n.jpg?_nc_cat=102&_nc_ht=scontent.fdad1-1.fna&oh=b460d464946fcbcb92d4783d903412ef&oe=5C8F4A97
// @version      0.1
// @description  Easy to edit anything in website.
// @author       HuuKhanh
// @include http://*/*
// @include https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375690/Website%20to%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/375690/Website%20to%20editor.meta.js
// ==/UserScript==

/*
- Enter rate to search bar then press '`' to change raterate
*/
(function() {
    'use strict';
    document.getElementsByTagName('html')[0].setAttribute("contenteditable", "false");
    document.getElementsByTagName('html')[0].addEventListener("keydown", function(event) {
	var x = event.which || event.keyCode;
    var isShiftKey = event.shiftKey;
	if(x == 69) {
		var isEnable = document.getElementsByTagName('html')[0].getAttribute("contenteditable");
        console.log(isEnable);
        console.log(isShiftKey);
        if(isEnable === 'false' && isShiftKey) {
            document.getElementsByTagName('html')[0].setAttribute("contenteditable", "true");
        }
		else {
            document.getElementsByTagName('html')[0].setAttribute("contenteditable", "false");
        }
	}
}) ;
})();