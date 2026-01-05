// ==UserScript==
// @name           Auto  Reload on Error 500
// @description   blah blah blab
// @author        P
// @namespace     
// @version       1    
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28335/Auto%20%20Reload%20on%20Error%20500.user.js
// @updateURL https://update.greasyfork.org/scripts/28335/Auto%20%20Reload%20on%20Error%20500.meta.js
// ==/UserScript==

var time = 1000;

(function () 
{
	if (document.getElementsByClassName(error-code) == 'HTTP ERROR 500' )
    	{setTimeout(function() {window.location.reload(true);}, time);}
})();