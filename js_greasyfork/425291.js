// ==UserScript==
// @name         more retail controls
// @version      1.0
// @description  more retail controls: alt+arrows for nex/prev, alt+backspace for archive, copy breadcrumbs button
// @author       Ruben Van Hee
// @changelog    created
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @match        https://*.lightspeedapp.com/*
// @match        https://*.lightspeedpos.com/*
// @match        https://*.merchantos.com/*
// @namespace https://greasyfork.org/users/428438
// @downloadURL https://update.greasyfork.org/scripts/425291/more%20retail%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/425291/more%20retail%20controls.meta.js
// ==/UserScript==
(function() {
	'use strict';
	//arrowfunction control
    function morecontrols(){
		document.addEventListener('keydown',function(e){
		/**/console.log(e);
		if (e.altKey){
			if(e.key=='ArrowRight'){/**/console.log('next');recordForward('view');}
			if(e.key=='ArrowLeft'){/**/console.log('back');recordBack('view');}
			if(e.key=='Backspace'){/**/console.log('archive');window.merchantos.controls.customFunctionOnClick(this,{name: 'archive',pannel_id: 'view',context: 'view',confirm_msg: 'Archive record?',prevent_repeat: false,save_on_changes: false,extra: null});}
		}
		});
	}
	//getcrumbs
	function BTN() {
		// 1. Create the button
		let button = document.createElement("button");
		button.innerHTML = "copy path";
		// 2. Add event handler
		button.addEventListener ("click", function() {
			getCrumbs();
		});
		// 3. Append somewhere
		let navi = document.getElementsByClassName('cr-topbar__breadcrumbs')[0];
		navi.insertAdjacentElement('afterend',button);
	}
	function getCrumbs() {
		let text = $('.cr-topbar__breadcrumbs')[0].innerText.replace(/(\n)+/g,' > '); //puts the aray into a string
		console.log(text);
		const textarea = document.createElement('textarea');
		textarea.innerHTML = text;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'absolute';
		textarea.style.left = '-9999px';
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}
	document.addEventListener("page:load", (()=>{
		morecontrols();
		BTN();
	}));
})();