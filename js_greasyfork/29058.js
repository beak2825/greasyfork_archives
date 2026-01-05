// ==UserScript==
// @name         contentEditable
// @version      1.1
// @description  Applies contentEditable when F7 is pressed
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/29058/contentEditable.user.js
// @updateURL https://update.greasyfork.org/scripts/29058/contentEditable.meta.js
// ==/UserScript==

var j=118;
// Set "j" to any keyCode you wish. 
// KeyCode 118 is the [ F7 ] key.

(function() {
	var a=false,b=document.body;
    window.addEventListener('keydown',function(e){
		if(e.keyCode==j){  
			if(!a){
				b.setAttribute('contentEditable',"");
				b.setAttribute("spellcheck","false");
			}else{
				b.removeAttribute('contentEditable');
				b.removeAttribute('spellcheck');
			}
			a=!a;
		}
	});
})();