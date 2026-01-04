// ==UserScript==
// @name         Google页面翻译
// @namespace    http://tampermonkey.net/google/translate
// @version      0.2
// @description  使用Google进行页面翻译
// @author       none
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_registerMenuCommand
// @match        *://*/*
// 
// @downloadURL https://update.greasyfork.org/scripts/495006/Google%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/495006/Google%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (window.__google_translator__) {
		window.__google_translator__.showBanner(true);
	} else {
		window.googleTranslateElementInit = function(){
			if (window.__google_translator__) {
				window.__google_translator__.showBanner(true);
			} else {
				var langs = 'ar,ja,ko,ru,fr,de,es,pt,en';
				window.__google_translator__ = new google.translate.TranslateElement({autoDisplay:false,floatPosition:0,multilanguagePage:true,includedLanguages:langs,pageLanguage:'auto'});
			}
		};
		var a=document.createElement('script');
		a.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
		document.getElementsByTagName('head')[0].appendChild(a);
	}
    GM_registerMenuCommand("一键翻译", function() {
        window.__google_translator__.showBanner(true);
    }, {
        domain: "tools",
        icon: ""
    });
})();