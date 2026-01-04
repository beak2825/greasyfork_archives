// ==UserScript==
// @name        check GD (works with greasemonkey for firefox)
// @namespace   https://gdccdated.glitch.me/
// @description is newgrounds song allowed in geometry dash?
// @author      BZZZZ
// @license     GPLv3
// @include     /^https?\:\/\/www\.newgrounds\.com\/audio\/listen\/[0-9]+\/?(?:[?#]|$)/
// @version     0.1
// @grant       GM.xmlHttpRequest
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/457515/check%20GD%20%28works%20with%20greasemonkey%20for%20firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457515/check%20GD%20%28works%20with%20greasemonkey%20for%20firefox%29.meta.js
// ==/UserScript==

'use strict'
try{
	const reqobj={
		'data':`songID=${/^https?\:\/\/www\.newgrounds\.com\/audio\/listen\/([0-9]+)\/?(?:[?#]|$)/.exec(location.href)[1]}&secret=Wmfd2893gb7`,
		'url':'http://www.boomlings.com/database/getGJSongInfo.php',
		'headers':{
			'Content-Type':'application/x-www-form-urlencoded',
			'Origin':'',
			'User-Agent':''
		},
		'responseType':'text',
		'method':'POST',
		'onreadystatechange':r=>{
			if(r.readyState!==4)return
			btn.disabled=false
			btn.style.cursor='pointer'
			if(r.status===200){
				if(r.responseText.includes('|'))btn.value='\u2611 allowed in GD'
				else btn.value='\u2612 not allowed in GD'
			}else btn.value=`\u2370 HTTP error ${r.status} ${r.statusText}`
		}
	}
	const btn=document.createElementNS('http://www.w3.org/1999/xhtml','input')
	btn.type='button'
	btn.value='check GD'
	btn.style.fontSize='18px'
	btn.style.padding='0'
	btn.style.cursor='pointer'
	btn.addEventListener('click',()=>{
		try{
			GM.xmlHttpRequest(reqobj)
		}catch(error){
			console.error('check GD:',error)
			btn.value='\u2370 JS error (see console)'
			return
		}
		btn.style.cursor='wait'
		btn.disabled=true
		btn.value='loading'
	},{'passive':true})
	const span=document.createElementNS('http://www.w3.org/1999/xhtml','span')
	span.attachShadow({'mode':'closed'}).appendChild(btn)
	document.querySelector('.pod-head').appendChild(span)
}catch(error){
	console.error('check GD:',error)
}