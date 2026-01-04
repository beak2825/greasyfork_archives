// ==UserScript==
// @name         url_clip
// @include      *
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.1
// @description  url clip
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/445103/url_clip.user.js
// @updateURL https://update.greasyfork.org/scripts/445103/url_clip.meta.js
// ==/UserScript==

(function () {
	setTimeout(function () {
		// hexo url
		dom = document.createElement('div');
		dom.id = 'url-hexo-container';
		let title='', imageUrl='';
		title = document.title.replace('"', "'");
		console.log(`\n\n{%url ${location.href} "${title}" %}\n{%endurl%}`);

		if(location.href.startsWith('https://www.bilibili.com/')) {
			imageUrl=document.querySelector('head > meta[itemprop="thumbnailUrl"]').getAttribute('content')
			document.body.prepend(dom);
		}else if(location.href.startsWith('https://www.youtube.com/watch?v=')) {
			imageUrl=document.querySelector('head > meta[property="og:image"]').getAttribute('content')
			container=document.querySelector('#info-contents > ytd-video-primary-info-renderer');
			container.prepend(dom);
		}else if(location.href.startsWith('https://en.wikipedia.org')) {
			document.querySelector('#firstHeading').prepend(dom);
		} else {
			document.body.prepend(dom);
		}

		dom.innerHTML = `<button id="urltag_hide">hide</button><br><span>{%url ${location.href} "${title}" %}</span><br>`
		if(imageUrl)
			dom.innerHTML+=`<span>${imageUrl}</span><br>`
		dom.innerHTML+=`<span>{%endurl%}</span>
			<style>
				#url-hexo-container {
					text-align: center;
					background-color: #000;
					color: #ddd;
					padding: 10px;
					font-size: 20px;
					text-shadow: none;
					z-index: 999999;
					position: relative;
				}
			</style>
		`

		// add event to #urltag_hide : document.querySelector('#url-hexo-container').hidden=true
		document.querySelector('#urltag_hide').addEventListener('click', function () {
			document.querySelector('#url-hexo-container').hidden = true;
		})

	}, 1000*2)

})();