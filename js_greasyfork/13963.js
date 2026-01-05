// ==UserScript==
// @name			China Post Mail Utility
// @namespace		http://your.homepage/
// @version			0.1.1
// @description		enter something useful
// @author			You
// @match			http://intmail.11185.cn/zdxt/gjyjqcgzcx/gjyjqcgzcx_gjyjqcgzcxLzxxQueryPage.action*
// @grant			none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/13963/China%20Post%20Mail%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/13963/China%20Post%20Mail%20Utility.meta.js
// ==/UserScript==

(function(){
	var removeSpecialCharInContent = function(){
		var stateTexts = document.getElementsByTagName('v_zt');

		for(var i=0; i<stateTexts.length; i+=1){
			stateTexts[i].innerHTML = stateTexts[i].innerHTML.replace('【', '').replace('】', '.').replace(/innerHTML[0-9]/g, '');
		}
	};
	removeSpecialCharInContent();

	var style = document.createElement('style');
	style.type = 'text/css';
	
	style.appendChild(document.createTextNode('data {display:table;border-spacing:0;border-collapse:collapse;}\
	page {display:none;}\
	data,\
	v_cxcljbh,\
	v_zt,\
	v_gjdm,\
	d_sjsj,\
	n_xh {padding:.5em;border:1px solid #000;}\
	rdata {display:table-row;}\
	rdata * {display:table-cell;}'));

	document.getElementsByTagName('head')[0].appendChild(style);

	/**
	// There's problem on Firefox
	var gte = document.createElement('div');
	gte.setAttribute('id', 'google_translate_element');
	document.body.appendChild(gte);

	window.googleTranslateElementInit = function() {
		new google.translate.TranslateElement({pageLanguage: 'zh-CN', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
	}

	var gscript = document.createElement('script');
	gscript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
	document.getElementsByTagName('head')[0].appendChild(gscript);
	/**/
})();