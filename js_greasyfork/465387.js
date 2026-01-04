// ==UserScript==
// @name        proboards disable redirect.viglink.com
// @namespace   https://gdccdated.glitch.me/
// @description read name
// @author      BZZZZ
// @license     GPLv3
// @include     /^https?\:\/\/[^.]+\.(?:proboards\.com|freeforums\.net|boards\.net)\//
// @exclude     /^https?\:\/\/www\.proboards\.com\//
// @version     0.1
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/465387/proboards%20disable%20redirectviglinkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/465387/proboards%20disable%20redirectviglinkcom.meta.js
// ==/UserScript==

"use strict"
const x=document.createElement("div")
x.setAttribute("onclick",`"use strict"
document.body.appendChild=new Proxy(document.body.appendChild,{
	apply:(targ,tthis,args)=>{
		if(args.length&&args[0] instanceof HTMLScriptElement&&"/vglnk.js"===args[0].src.slice(-9))throw "nope"
		return targ.apply(tthis,args)
	}
})`)
x.click()