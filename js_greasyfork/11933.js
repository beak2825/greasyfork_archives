// ==UserScript==
// @name        fail.fm
// @namespace   http://plaza.ink/
// @description last.fm is kill
// @include     http://*last.fm/*
// @include     https://*last.fm/*
// @version     1.04
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11933/failfm.user.js
// @updateURL https://update.greasyfork.org/scripts/11933/failfm.meta.js
// ==/UserScript==

failFm = {
	init: function(){
		var content = document.getElementById('content'),
			observer = new MutationObserver(failFm.action);
		failFm.action();
		if (content != undefined) {
			observer.observe(content, {attributes: true, childList: true, characterData: true});
		};
		document.addEventListener('click', failFm.removeBlackBar, false);
	},
	action: function(){
		failFm.removeBlackBar();
		failFm.swapNodes();
	},
	swapNodes: function(){
		var artist = null,
			childs = null,
			songs = document.getElementsByClassName('chartlist-ellipsis-wrap');
		for (var i = 0, len = songs.length; i < len; i++) {
			if ((childs = songs[i].children).length == 3 && childs[0].className == 'link-block-target' && childs[2].className == 'chartlist-artists') {
				artist = songs[i].getElementsByClassName('chartlist-artists')[0];
				songs[i].insertBefore(songs[i].getElementsByClassName('link-block-target')[0], artist);
				songs[i].insertBefore(artist, songs[i].getElementsByClassName('artist-name-spacer')[0]);
			}
		}
	},
	removeBlackBar: function(){
		var black = document.getElementsByClassName('overlay-leaderboard')[0],
			emptySpace = document.getElementsByClassName('overlay-content')[0];
		if (black != undefined) {
			var blackHeight = black.offsetHeight * -1,
				blackParent = black.parentNode,
				blackSiblings = blackParent.children,
				curHeight;
			blackParent.removeChild(black);
			for (var i = 0, len = blackSiblings.length; i < len; i++) {
				blackSiblings[i].style.marginTop = blackHeight + 'px';
			}
		}
		if (emptySpace != undefined && emptySpace.getElementsByClassName('gallery-section')[0] != undefined) {
			emptySpace.style.marginTop = (parseInt(window.getComputedStyle(emptySpace).marginTop) + blackHeight) + 'px';
		}
	}
};

window.addEventListener('DOMContentLoaded', failFm.init, false);
