// ==UserScript==
// @name 4chan X Link Hover Preview
// @namespace lig
// @license GNU GPLv3
// @description Adds hover preview capability to image/video links
// @version 1.0.3
// @match *://boards.4chan.org/*/*/*
// @match *://boards.4channel.org/*/*/*
// @run-at document-start
// @grant GM.info
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAAAkUlEQVQ4T6WQAQ6AMAgD9yf/5Gv906QYSBGGRk1OXFuaxbEf2y/0Necc8uCl4FxRZa4WEWQ6HPDgIhNuUAUePRFSwIDeeV6gH02YsRx2QoELTQkvel6MIKhYlFTL4NUNoDEhzwUw78vAdJ6poFqGZtiZvbbAAuxVmVTAsyswP/0DngbOXMB+KFiBBSZ4KPjONk6FWw9BoS3PSwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/448768/4chan%20X%20Link%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/448768/4chan%20X%20Link%20Hover%20Preview.meta.js
// ==/UserScript==

const whitelist = [
	"4cdn.org",
	"catbox.moe",
	"cockfile.com",
	"derpicdn.net",
	"deviantart.net",
	"discordapp.net",
	"discordapp.com",
	"fileditch.com",
	"pomf.cat",
	"pomf.se",
	"puu.sh",
	"tumblr.com",
	"uguu.se",
];

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
	let style = document.createElement('style');
	style.innerHTML = `
		a.linkify.loading {
			cursor: progress;
		}
		a.linkify.hideCursor {
			cursor: none;
		}
	`;
	while(document.head === null) {
		await delay(100);
	}
	document.head.appendChild(style);
})();


function bind(link, type) {
	if(link.hoverified) return;
	link.hoverified = true;
	//console.log(link);

	let hostname = new URL(link.href).hostname;
	if(!whitelist.some(w => hostname.endsWith(w)))
		return;

	link.addEventListener('mouseenter', async e => {
		link.classList.add('loading');
		let widthProp, heightProp;
		switch(type) {
			case 'image':
				document.querySelector('#hoverUI').innerHTML = `<img id='ihover' src='${link.href}' style='max-height: 100vh !important;'>`;
				widthProp = 'naturalWidth';
				heightProp = 'naturalHeight';
				break;
			case 'video':
				document.querySelector('#hoverUI').innerHTML = `
					<video id='ihover' src='${link.href}' loop='' autoplay='true'></video>
				`;
				widthProp = 'videoWidth';
				heightProp = 'videoHeight';
				break;
			default: return;
		}
		let ihover = document.querySelector('#ihover');

		let x0 = e.clientX, y0 = e.clientY, w0 = ihover[widthProp], h0 = ihover[heightProp], initiated;
		function updatePosition() {
			let x = 0, y = 0, w = w0, h = h0;
			let docWidth = document.documentElement.offsetWidth;
			w = Math.min(w, docWidth);
			h = Math.min(h, window.innerHeight);
			let factor = Math.min(w/w0, h/h0);
			w = factor*w0;
			h = factor*h0;
			if(w < docWidth) {
				x = x0 + 45;
				if(x + w > docWidth)
					x = docWidth - w;
			}
			if(h < window.innerHeight) {
				y = Math.max(y0 - h/2, 0);
				if(y + h > window.innerHeight)
					y = window.innerHeight - h;
			}
			ihover.style.left 	= x+'px';
			ihover.style.top 	= y+'px';
			ihover.style.width 	= w+'px';
			ihover.style.height = h+'px';

			link.classList.remove('hideCursor');
			clearTimeout(hideCursorTimeout);
			if(initiated && x0 >= x) {
				hideCursorTimeout = setTimeout(() => {
					link.classList.add('hideCursor');
				}, 1000);
			}
			//console.log(`left: ${x}, top: ${y}, width: ${w}, height: ${h}`);
		}
		let hideCursorTimeout;
		function move(e) {
			x0 = e.clientX;
			y0 = e.clientY;
			updatePosition();
		}
		link.addEventListener('mousemove', move)
		link.addEventListener('mouseleave', function unbind() {
			ihover.remove()
			link.removeEventListener('mouseleave', unbind);
			link.removeEventListener('mousemove', move);
			clearTimeout(hideCursorTimeout);
		});
		let init = e => {
			if(initiated) return;
			w0 = w0 || ihover[widthProp];
			h0 = h0 || ihover[heightProp];
			initiated = h0 || w0;
			if(initiated) link.classList.remove('loading');
			//console.log(`[${e.type}] Width: ${w0}, Height: ${h0}`);
			updatePosition();
		}
		ihover.onloadedmetadata = init;
		ihover.onloadeddata = init;
		ihover.onloadstart = init;
		ihover.onloadend = init;
		ihover.onload = init;
	});
}

['PostsInserted', '4chanXInitFinished'].forEach(event => document.addEventListener(event, e => {
	//console.log(`[${event}]`, e.target);
	if(e.target.matches && e.target.matches('#qp')) return;
	['image', 'video'].forEach(type => {
		[...e.target.querySelectorAll(`a.linkify.${type}`)]
		.forEach(link => bind(link, type));
	});
}));