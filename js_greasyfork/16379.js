// ==UserScript==
// @name		sanereddit
// @namespace		sanereddit
// @version		1.6
// @grant		none
// @include		http*://*.reddit.com/*
// @license MIT
// @description	Sanereddit will remove tons of bloat, allowing reddit to be used in a sane manner.
// @downloadURL https://update.greasyfork.org/scripts/16379/sanereddit.user.js
// @updateURL https://update.greasyfork.org/scripts/16379/sanereddit.meta.js
// ==/UserScript==
(function() {
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
		document.body.appendChild(outer);
		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";
		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);
		var widthWithScroll = inner.offsetWidth;
		// remove divs
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll;
	}
	$(function() {
		var sbWidth = getScrollbarWidth();
		var sideBar = document.getElementsByClassName('side') [0];
		var linkList = document.getElementsByClassName('linklisting') [0];
		var commentarea = document.getElementsByClassName('commentarea')[0];
		var comments = document.getElementsByClassName('comment');
		var mds = document.getElementsByClassName('md');
		var root= document.compatMode=='BackCompat'? document.body : document.documentElement;
		function go() {
			$("a.title").css('fontSize','small');
			$("div.thing").css('marginBottom', '0px');
			$("div.footer-parent").hide();
			$("div.content").css("marginTop","0px");
			sideBar.style.display = 'none';
			linkList.style.width = (root.clientWidth - sbWidth) + 'px';
			if (commentarea !== undefined){
				commentarea.style.width= (root.clientWidth - sbWidth) + 'px';//'100%';
			}
			var i = 0;
			for (i = 0; i < comments.length; i++) {
				comments[i].style.width = '100%';
			}
			for (i = 0; i < mds.length; i++) {
				var elem = mds[i];
				var marginRight = 0;
				var depth = $(elem).parentsUntil("div.commentarea").filter('div.thing').length;
				elem.parentElement.style.width = (root.clientWidth - sbWidth - (depth * 31)) + 'px';
				elem.style.maxWidth = '100%';
			}
		}
		// Attach it the resize event
		window.addEventListener('resize', function (event) {
			go();
		});
		// Run it once initially
		go();
	});
})();

