// ==UserScript==
// @name        wiki3d
// @include     *wikipedia*
// @supportURL  https://github.com/sxlgkxk/browser_script/issues
// @version     0.3
// @description wiki 3d
// @namespace   http://sxlgkxk.github.io/
// @author      sxlgkxk
// @icon        http://sxlgkxk.github.io/im/avatar.jpg
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446194/wiki3d.user.js
// @updateURL https://update.greasyfork.org/scripts/446194/wiki3d.meta.js
// ==/UserScript==

/*
	1. 代码功能: wiki内容的3d化

*/

(function () {

	//-------------------------------- common functions --------------------------------

	function addScript(src, content='') {
		let scripts_dom = document.createElement('script');
		if (content){
			scripts_dom.textContent = content;
			scripts_dom.type = 'module';
		} else {
			scripts_dom.src = src;
			scripts_dom.type = 'text/javascript';
		}
		document.getElementsByTagName('head')[0].appendChild(scripts_dom);
	}
	addScript('https://unpkg.com/axios/dist/axios.min.js')
	addScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')

	function addStyle(html) {
		let style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}

	//-------------------------------- code snippets --------------------------------

	//-------------------------------- main --------------------------------

	let doms=document.querySelector('#bodyContent').querySelectorAll('a')
	let urlSet=new Set()
	for(let dom of doms){
		let url=dom.href
		if(url.match(/^https:\/\/en.(m\.)*wikipedia.org\/wiki/)){
			if(url.match(/^https:\/\/en.(m\.)*wikipedia.org\/wiki\/.*?([:\(#]|Main_Page|undefined)+.*?/))
				continue
			if(url == location.href)
				continue
			urlSet.add(url)
		}
	}
	let urls=Array.from(urlSet)
	// urls=urls.sort(()=>Math.random()-0.5)
	let content=``;
	for(let url of urls){
		let name=new URL(url).pathname
		content+=`${name}\n`
	}

	//-------------------------------- wrap up --------------------------------

	// three.js
	let scripts_dom = document.createElement('script');
	scripts_dom.textContent =`{
		"imports": {
			"three": "https://unpkg.com/three/build/three.module.js"
		}
	}`;
	scripts_dom.type = 'importmap';
	document.getElementsByTagName('head')[0].appendChild(scripts_dom);

	// dom insert
	let three_dom = document.createElement('div')
	document.body.before(three_dom)
	three_dom.id='three_panel'

	addScript('', `
		// import { wikiInit } from 'https://sxlgkxk.github.io/cdn/3d/mc/mc.js';
		import { wikiInit } from 'http://127.0.0.1:4000/cdn/3d/mc/mc.js';
		wikiInit("three_panel", \`${content}\`);
	`)
	addStyle(`
		#three_panel {
			margin-bottom: 10px;
			margin-top: 10px;
		}
	`) 


})();