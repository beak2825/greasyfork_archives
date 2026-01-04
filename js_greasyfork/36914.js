// ==UserScript==
// @name         Iwara Video Sticky
// @namespace    http://iwara.video.sticky/
// @version      0.2
// @description  Iwara.tvの動画プレイヤーをスクロールに追従させる
// @match        *://*.iwara.tv/videos/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36914/Iwara%20Video%20Sticky.user.js
// @updateURL https://update.greasyfork.org/scripts/36914/Iwara%20Video%20Sticky.meta.js
// ==/UserScript==

function addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

(function() {
    'use strict';
    addStyle ( `
    .fixed {
        position : fixed;
        top : 0px;
        left:auto;
        z-index : 999;
    }
    ` );
})();

window.onscroll = function() {
	var videoPlayer = document.getElementById( "video-player" );
	var header = document.getElementsByTagName('header')[0];
	var nodeInfo = document.getElementsByClassName( "node-info" )[0];

    var style = videoPlayer.getAttribute('style');
    videoPlayer.setAttribute('style', style + 'width: '+ nodeInfo.offsetWidth +'px !important;');

	var screen_Y = document.documentElement.scrollTop || document.body.scrollTop;

	var headerRect = header.getBoundingClientRect();
	var header_Y = headerRect.top + headerRect.height + screen_Y;

    if(screen_Y >= header_Y) {
		videoPlayer.classList.add('fixed');
	}else{
        videoPlayer.classList.remove('fixed');
    }
};
