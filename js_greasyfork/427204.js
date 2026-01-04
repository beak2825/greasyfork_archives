// ==UserScript==
// @name        canvas screenshot to png
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description useful for io games like woomy.arras.io (press [:])
// @author      BZZZZ
// @include     *
// @version     0.5
// @grant       none
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/427204/canvas%20screenshot%20to%20png.user.js
// @updateURL https://update.greasyfork.org/scripts/427204/canvas%20screenshot%20to%20png.meta.js
// ==/UserScript==
 
(function(
linkTag,
Date,
toISOString,
appendChild,
removeChild,
getKey,
createObjectURL,
revokeObjectURL,
setHref,
setDownload,
bodyList,
click,
consoleError,
consoleWarn,
canvasList,
toBlob
){
	"use strict";
	bodyList.__proto__=null;
	canvasList.__proto__=null;
	function saver(Blob){
		try{
			Blob=createObjectURL(Blob);
			setHref(linkTag,Blob);
			var raw=toISOString(new Date()),l=raw.length,c,i=0,w="shot_";
			while(i<l)w+=((c=raw[i++])==":")?"_":c;
			w+=".png";
			setDownload(linkTag,w);
			i=bodyList[0];
			try{
				if(i)appendChild(i,linkTag);
			}catch(err){
				consoleWarn("canvas screenshot to png: failed to append a to body:",err);
			}
			click(linkTag);
			try{
				if(i)removeChild(i,linkTag);
			}catch(err){
				consoleWarn("canvas screenshot to png: failed to remove a from body:",err);
			}
			revokeObjectURL(Blob);
		}catch(err){
		
		}
	}
	window.addEventListener("keypress",function(evnt){
		try{
			if(getKey(evnt)!=":")return;
			var i=canvasList[0];
			if(!i){
				consoleError("canvas screenshot to png: no canvas tag");
				return;
			}
			toBlob(i,saver,"image/png");
		}catch(err){
			consoleError("canvas screenshot to png:",err);
		}
	},false);
})(
document.createElementNS("http://www.w3.org/1999/xhtml","a"),
Date,
Function.prototype.call.bind(Date.prototype.toISOString),
Function.prototype.call.bind(Node.prototype.appendChild),
Function.prototype.call.bind(Node.prototype.removeChild),
Function.prototype.call.bind(KeyboardEvent.prototype.__lookupGetter__("key")),
URL.createObjectURL,
URL.revokeObjectURL,
Function.prototype.call.bind(HTMLAnchorElement.prototype.__lookupSetter__("href")),
Function.prototype.call.bind(HTMLAnchorElement.prototype.__lookupSetter__("download")),
document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","body"),
Function.prototype.call.bind(HTMLElement.prototype.click),
console.error,
console.warn,
document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","canvas"),
Function.prototype.call.bind(HTMLCanvasElement.prototype.toBlob)
);