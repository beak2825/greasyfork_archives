// ==UserScript==
// @name         line
// @include      *
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.2
// @description  add line
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447286/line.user.js
// @updateURL https://update.greasyfork.org/scripts/447286/line.meta.js
// ==/UserScript==

(function () {

	//-------------------------------- common functions --------------------------------

	function addScript(src) {
		var scripts_dom = document.createElement('script');
		scripts_dom.src = src;
		scripts_dom.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(scripts_dom);
	}

	function addStyle(html) {
		style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}

	//-------------------------------- code snippets --------------------------------

	addStyle(`
		#line_button{
			color: #fff;
			background-color: #000;
			border-radius: 5px;
			position: fixed;
			right: 10px;
			width: 50px;
			top: ${document.documentElement["scrollTop"]+window.innerHeight*0.5-25+'px'};
			height: 50px;
			z-index: 99999;
		}
	`)

	//-------------------------------- line dom --------------------------------

	body = document.querySelector('body')
	container = document.createElement('div')
	container.innerHTML = `
		<button id="line_button" onclick="document.addLine()">line</button>
	`
	document.body.before(container)

	function addLine(){
		let line_dom = document.createElement('div')
		line_dom.style.position = 'absolute'
		line_dom.style.top = document.documentElement["scrollTop"]+window.innerHeight*0.5+'px'
		line_dom.style.left = '0'
		line_dom.style.width = '100%'
		line_dom.style.height= '3px'
		line_dom.style.backgroundColor = '#f00'
		line_dom.style.zIndex = '999999'
		console.log(line_dom)
		document.body.appendChild(line_dom)
	}
	document.addLine = addLine

})();