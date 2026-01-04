// ==UserScript==
// @name        scenexe.io zoom+no dark
// @namespace   https://scnxwged.glitch.me/
// @description use mouse wheel or + and - keys, only works in gameplay
// @author      BZZZZ
// @license     GPLv3
// @include     /^https?\:\/\/scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/new\-test\.scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/test\.scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/test2\.scenexe\.io\/([?#]|$)/
// @version     0.4
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/450535/scenexeio%20zoom%2Bno%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/450535/scenexeio%20zoom%2Bno%20dark.meta.js
// ==/UserScript==

'use strict'
const x=document.createElementNS('http://www.w3.org/1999/xhtml','div')
x.setAttribute('onclick',`"use strict";(${()=>{
let
	zoom=1
const
	zoomout=()=>{zoom*=1.0625},
	zoomin=()=>{if((zoom*=0.9375)<1)zoom=1},

	obj={'__proto__':null,'passive':true},p={
		'__proto__':null,
		'configurable':true,
		'enumerable':true,
		'set'(val){this[s]=val},
		'get'(){return this[s]*zoom}
	},s=Symbol('real cameraSizeMultiplier'),dp=Object.defineProperty,rset=Reflect.set
	Object.freeze(obj)
	Object.freeze(p)
	//use removedEntities to not conflict with tank editor
	dp(Object.prototype,'removedEntities',{
		'__proto__':null,
		'configurable':true,
		'enumerable':false,
		'set'(val){
			rset(obj,'removedEntities',val,this)
			dp(this,'cameraSizeMultiplier',p)
		}
	})
	document.getElementById('game-canvas').addEventListener('wheel',event=>{
		if(event.deltaY>0)zoomout()
		else zoomin()
	},obj)
	document.body.addEventListener('keypress',event=>{
		const t=event.target.tagName
		if(t!=='INPUT'&&t!=='TEXTAREA')switch(event.key){
			case '+':
				zoomout()
				return
			case '-':
				zoomin()
		}
	},obj)
}})()`)
x.click()
document.getElementById('darkness-canvas').hidden=true