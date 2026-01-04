// ==UserScript==
// @name        Sibnet Video HTML5 AutoPause
// @description Автоматически ставит видео на паузу
// @namespace   https://video.sibnet.ru/
// @include     *://video.sibnet.ru/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31340/Sibnet%20Video%20HTML5%20AutoPause.user.js
// @updateURL https://update.greasyfork.org/scripts/31340/Sibnet%20Video%20HTML5%20AutoPause.meta.js
// ==/UserScript==
(function(){
	try{
		document.getElementById('video_html5_wrapper_html5_api').pause();
	}catch(e){
		console.error(e);
	}
})();