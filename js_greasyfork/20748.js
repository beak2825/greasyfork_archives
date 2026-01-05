// ==UserScript==
// @name         Reddit Inline Images
// @namespace    https://greasyfork.org/en/users/49817-quodroc
// @version      1.1
// @description  Displays images inline on reddit.com
// @author       quodroc
// @match        https://www.reddit.com/*
// @match        http://www.reddit.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/20748/Reddit%20Inline%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/20748/Reddit%20Inline%20Images.meta.js
// ==/UserScript==

function main() {
	var maxHeight = '450px';
	var buttons = document.querySelectorAll('.expando-button.collapsed');
	var links = document.querySelectorAll('a.title, .md a');
	var direct = /\.(?:jpe?g|png|gif)(?:[?#].*)?$/i;
	var imgur = /imgur\.com\/[a-z0-9]+\/?(?:[?#].*)?$/i;
	var reddit = /i\.reddituploads\.com\/[a-z0-9]+\/?(?:[?#].*)?$/i;
	var dragging = false;
	var i;

	// expand previews
	for (i in buttons) {
		var button = buttons[i];
		if (button.parentNode && button.parentNode.querySelector('.expando[data-cachedhtml*="media-preview"]')) {
			button.click();
			var preview = button.parentNode.querySelector('.preview');
			if (preview) {
				preview.style.maxHeight = maxHeight;
				preview.style.width = 'auto';
				preview.parentNode.parentNode.parentNode.style.maxWidth = null;
			}
		}
	}

	// add image previews
	for (i in links) {
		var link = links[i];
		var url = link.href;
		if (url) {
			if (direct.test(url) || reddit.test(url))
				addImage(link, url, maxHeight);
			else if (imgur.test(url))
				addImage(link, url + '.jpg', maxHeight);
		}
	}

	// make images resizable
	document.addEventListener('click', function (e) {
		var img = e.target;
		if (img.classList.contains('preview')) {
			if (!dragging) {
				img.style.height = null;
				if (img.style.maxHeight)
					img.style.maxHeight = null;
				else
					img.style.maxHeight = maxHeight;
			}
			e.preventDefault();
		}
	});

	document.addEventListener('mousedown', function (e) {
		var img = e.target;
		if (img.classList.contains('preview')) {
			var xo = e.pageX,
				yo = e.pageY,
				ho = img.clientHeight;

			var mousemove = function (e) {
				img.style.height = img.style.maxHeight = Math.max(ho + e.pageY - yo + e.pageX - xo, 0) + 'px';
				img.style.maxWidth = 'none';
				dragging = true;
			};

			var mouseup = function (e) {
				document.removeEventListener('mousemove', mousemove);
				document.removeEventListener('mouseup', mouseup);
				setTimeout(function () { dragging = false; }, 0);
			};

			document.addEventListener('mousemove', mousemove);
			document.addEventListener('mouseup', mouseup);

			img.style.width = 'auto';
			img.parentNode.parentNode.parentNode.style.maxWidth = null;
			e.preventDefault();
		}
	});
}

function addImage(element, url, maxHeight) {
	if (element.parentNode.parentNode.querySelector('.preview'))
		return;

	var a = document.createElement('a');
	a.href = url;

	var img = document.createElement('img');
	img.src = url;
	img.className = 'preview';
	img.style.maxHeight = maxHeight;

	element = element.parentNode;

	img.onerror = function () {
		element.removeChild(a);
	};

	a.appendChild(document.createElement('br'));
	a.appendChild(img);
	element.appendChild(a);
}

main();
