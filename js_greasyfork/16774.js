// ==UserScript==
// @name tumblr-megaeditor-page-preview
// @name:ja tumblr-megaeditor-page-preview
// @namespace namespace http://reppets.hatenablog.com/
// @description show an entry page's preview in inline frame on the Tumblr Mega Editor page when the mouse cursor is on.
// @description:ja Tumblrの複数投稿編集ツール(mega-editor)で、マウスカーソルを当てた投稿の個別ページをインラインフレームにプレビュー表示します。
// @compatible firefox (verified with 43.0.4)
// @compatible chrome (verified with  47.0.2526.111)
// @license https://raw.githubusercontent.com/reppets/tumblr-megaeditor-page-preview/master/LICENSE
// @include https://www.tumblr.com/mega-editor/*
// @version 1.0.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16774/tumblr-megaeditor-page-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/16774/tumblr-megaeditor-page-preview.meta.js
// ==/UserScript==
var TIMEOUT_MILLISEC = 1000;

function toArray(nodeList) {
	return Array.prototype.slice.call(nodeList, 0);
}

function showIFrame(anchor, showOnRight) {
	iframe.source = anchor;
	iframe.setAttribute('src', anchor.getAttribute('href'));
	if (showOnRight) {
		iframe.style.transformOrigin = 'top right'
		iframe.style.left = 'auto';
		iframe.style.right = '10px';
	} else {
		iframe.style.transformOrigin = 'top left';
		iframe.style.left = '10px';
		iframe.style.right = 'auto';
	}
	iframe.style.display = 'block';
}

function hideIFrame() {
	iframe.style.display = 'none';
	iframe.source = null;
}

function appendListener(anchor) {
	if (anchor.hasAttribute('href')) {
		anchor.addEventListener('mouseenter', function(event){
			anchor.showing = setTimeout(function() {
				if (anchor.showing) {
					showIFrame(anchor, event.clientX < window.innerWidth / 2);
					anchor.showing = null;
				}
			}, TIMEOUT_MILLISEC);
		}, false);
		anchor.addEventListener('mouseleave', function() {
			if (anchor.showing) {
				clearTimeout(anchor.showing);
				anchor.showing = null;
			} else {
				anchor.hiding = setTimeout(hideIFrame, TIMEOUT_MILLISEC);
			}
		}, false);
	}
};

// construct an iframe for preview.
var iframe = document.createElement('iframe');
iframe.setAttribute('src', 'about:blank');
iframe.style.zIndex = 2147483647;
iframe.style.display = 'none';
iframe.style.position = 'fixed';
iframe.style.width = '95%';
iframe.style.height = '180%';
iframe.style.top = '50px';
iframe.style.border = '2px solid black';
iframe.style.transform = 'scale(0.5,0.5)';
iframe.style.transformOrigin = 'top left';
iframe.addEventListener('mouseenter', function() {
	if (iframe.source && iframe.source.hiding) {
		clearTimeout(iframe.source.hiding);
		iframe.source.hiding = null;
	}
});
iframe.addEventListener('mouseleave', function() {
	if (iframe.source) {
		iframe.source.hiding = setTimeout(hideIFrame, TIMEOUT_MILLISEC);
	}
});
document.getElementById('body').appendChild(iframe);

// add event listeners to anchors
var initialLinks = toArray(document.querySelectorAll('.l-content a'));
initialLinks.forEach(function(elem,index,array) {
	appendListener(elem);
});

// register an observer to add event listeners to ajax-added anchors.
var observer = new MutationObserver(function(records, observer) {
	records.forEach(function(record,i1,a1) {
		if (record.addedNodes) {
			var nodes = toArray(record.addedNodes);
			nodes.forEach(function(elem, index, array) {
				if (elem.tagName.toLowerCase() === 'a') {
					appendListener(elem);
				}
			});
		}
	});
});
observer.observe(document.getElementsByClassName('l-content')[0], {childList: true});
