// ==UserScript==
// @name        INGStyles
// @namespace   hbing
// @description Additional styles for ING
// @include     https://ebanking.ing.be/*
// @include     https://www.ing.be/fr/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22058/INGStyles.user.js
// @updateURL https://update.greasyfork.org/scripts/22058/INGStyles.meta.js
// ==/UserScript==
var myStyles = ".cols_1, .cols_2, .cols_3, .field, .k2-logo, .k2-header-row-1, .k2-nav-lev1-btn, .k2-nav-lev2-btn, .hbfoot, .k2-footer" 
+ " { display: none ! important; visibility: hidden ! important; }";

function addCSS(aCSS) {
// alert(aCSS);
		var S = document.createElement('style');
		S.setAttribute("type", "text/css");

				if(S.styleSheet)
			{ S.styleSheet.cssText=aCSS; }
		else
			{ 
				aC = document.createTextNode(aCSS); 
				S.appendChild(aC);
			}

		document.body.appendChild(S);
} // end func.
 addCSS(myStyles);
 
