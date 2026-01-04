// ==UserScript==
// @name         拖動!新課綱銜接平台!!
// @namespace    https://greasyfork.org/users/795886
// @version      0.4
// @description  讓你任意的拖動進度條!
// @author       ZRE
// @include      *://ecc.pro.edu.tw/BackEnd/TR_Watch/Index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429694/%E6%8B%96%E5%8B%95%21%E6%96%B0%E8%AA%B2%E7%B6%B1%E9%8A%9C%E6%8E%A5%E5%B9%B3%E5%8F%B0%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/429694/%E6%8B%96%E5%8B%95%21%E6%96%B0%E8%AA%B2%E7%B6%B1%E9%8A%9C%E6%8E%A5%E5%B9%B3%E5%8F%B0%21%21.meta.js
// ==/UserScript==

(function() {
	videojs("MainVideo").ready(function () {
		var sheet = document.createElement('style');
		sheet.innerHTML = `
		.video-js .vjs-time-control{display: block;}
		.video-js .vjs-remaining-time{display: none;}
		.vjs-progress-control {display: inherit !important;}
		`;
		document.body.appendChild(sheet);
		this.off('seeking');
		this.off('seeked');
        this.off('timeupdate');
		this.on('timeupdate', function(){
			this.controlBar.currentTimeDisplay.updateContent();
			this.controlBar.progressControl.seekBar.startUpdate();
		});
	  });
})();