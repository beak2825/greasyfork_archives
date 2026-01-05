// ==UserScript==
// @name	Allow Copy and Context Menu Continued
// @version	7.3.4
// @author	Anonimous
// @namespace	https://greasyfork.org/en/users/16081-lolipop
// @description	Allow Copy (include hot keys and some css) & Context Menu. Disable (remove) copy text protection and allow copy for all sites. Thanks Lex1 for example http://lexi.ucoz.ru/buttons.html
// @include	*
// @license      GPL version 3 or any later version; www.gnu.org/licenses/gpl-3.0.en.html
// @grant	none
// @run-at	document-start
// @downloadURL https://update.greasyfork.org/scripts/12561/Allow%20Copy%20and%20Context%20Menu%20Continued.user.js
// @updateURL https://update.greasyfork.org/scripts/12561/Allow%20Copy%20and%20Context%20Menu%20Continued.meta.js
// ==/UserScript==

;(function(){

	/* handler names */
	/*
	 * NOTE! 'drag', 'dragend', 'dragstart' - when drag text, use alt + selection for text or add them to array
	 */
	var handlerNameArr = ['contextmenu', 'copy', 'cut', 'paste', 'mousedown', 'mouseup', 'beforeunload', 'beforeprint', 'keyup', 'keydown', 'select', 'selectstart'];

	/* remove protection of window */
	var removeProtection = function removeProtectionName(protectedWindow) {

		/*
		 * document object in frames is same as window https://developer.mozilla.org/en-US/docs/Web/API/Window/frames
		 * frames == iframe + frame
		 */
	
		for(var i=0; i < handlerNameArr.length; i++){
			var handlerName = handlerNameArr[i];
			var handlerOnName = 'on' + handlerName;
			
			if(protectedWindow[handlerOnName])
				protectedWindow[handlerOnName] = null;
			protectedWindow.addEventListener(handlerName, function(e){ e.stopPropagation(); }, true);
		}

	};
	
	/* remove css protection */
	var removeCssProtection = function removeCssProtectionName() {
		var cssStyle = '* { -moz-user-select: text !important; user-select: text !important; } ';
		
		//GreaseMonkey only
		/* @grant	GM_addStyle need */
		//GM_addStyle(cssStyle);
		
		var style = document.createElement('style');
		
		style.type = 'text/css';
		style.innerHTML = cssStyle;
		document.head.appendChild(style);
	};

	/* remove main window protection */
	removeProtection(window);

	/* remove frame window protection */
	var frameList = window.frames;

	for(var i = 0; i < frameList.length; i++) {
		try{
			removeProtection(frameList[i]);
		} catch(e){
		}
	}
	
	removeCssProtection();

})();