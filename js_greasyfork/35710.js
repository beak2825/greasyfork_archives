// ==UserScript==
// @name        MistyCloudTranslations.com_focus
// @version     1
// @namespace   zack0zack
// @description MistyCloudTranslations.com auto-Focus
// @include     *mistycloudtranslations.com/gdbbm-c*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35710/MistyCloudTranslationscom_focus.user.js
// @updateURL https://update.greasyfork.org/scripts/35710/MistyCloudTranslationscom_focus.meta.js
// ==/UserScript==



window.addEventListener("load",function() {
	document.getElementById('site-navigation').parentNode.removeChild( document.getElementById('site-navigation') );
},true)
