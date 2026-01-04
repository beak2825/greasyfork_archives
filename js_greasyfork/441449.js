// ==UserScript==
// @name         insert_css
// @include      *
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.1
// @description  insert css
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441449/insert_css.user.js
// @updateURL https://update.greasyfork.org/scripts/441449/insert_css.meta.js
// ==/UserScript==

/*
div.container.full{color: #ccc; background:#232323}div.chapterContent{line-height:200% !important; width: 40% !important; font-size: 22px !important}
a:visited{color: #fabd2f !important;}
*/

(function(){

body=document.querySelector('body')
css_dom=document.createElement('div')
body.after(css_dom)

custom_css=localStorage.getItem('custom_css')
if(!custom_css) custom_css=""

css_dom.innerHTML=`<style>
	button#changeCssBtn{

	}`
	+custom_css+
`</style>
<button onclick="document.changeCSS()" id="changeCssBtn">change css</button>`

document.changeCSS=()=>{
	_custom_css=localStorage.getItem('custom_css')
	if(!_custom_css) _custom_css=""
	custom_css=prompt("css?", _custom_css)
	if(custom_css)
		localStorage.setItem("custom_css", custom_css)
}

})();