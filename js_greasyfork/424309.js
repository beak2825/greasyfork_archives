// ==UserScript==
// @name        canvas screenshot to tga
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description useful for io games like woomy.arras.io (press [:])
// @author      BZZZZ
// @include     *
// @version     0.6
// @grant       none
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/424309/canvas%20screenshot%20to%20tga.user.js
// @updateURL https://update.greasyfork.org/scripts/424309/canvas%20screenshot%20to%20tga.meta.js
// ==/UserScript==

(function(
blobArr,
blobOpt,
linkTag,
Date,
toISOString,
Blob,
appendChild,
removeChild,
getImageData,
getKey,
ArrayBuffer,
Uint8Array,
createObjectURL,
revokeObjectURL,
setHref,
setDownload,
bodyList,
getData,
getWidth,
getHeight,
getContext,
click,
consoleError,
consoleWarn,
canvasList
){
	"use strict";
	bodyList.__proto__=null;
	canvasList.__proto__=null;
	window.addEventListener("keypress",function(evnt){
		try{
			if(getKey(evnt)!=":")return;
			var i=canvasList[0];
			if(!i){
				consoleError("canvas screenshot to tga: no canvas tag");
				return;
			}
			var w=getWidth(i),h=getHeight(i),raw=getData(getImageData(getContext(i,"2d"),0,0,w,h)),w3=w*3,w4=w*4,end,i2=h*w4,i3,tga=new Uint8Array(blobArr[0]=new ArrayBuffer(18+h*w3));
			tga[2]=2;
			tga[12]=w&255;
			tga[13]=w>>8;
			tga[14]=h&255;
			tga[15]=h>>8;
			tga[16]=24;
			i=18;
			while(0<i2){
				i2-=w4;
				end=i+w3;
				i3=i2;
				while(i<end){
					tga[i++]=raw[2+i3];
					tga[i++]=raw[1+i3];
					tga[i++]=raw[i3];
					i3+=4;
				}
			}
			raw=toISOString(new Date());
			i2=raw.length;
			i=0;
			w="shot_";
			while(i<i2)w+=((i3=raw[i++])==":")?"_":i3;
			w+=".tga";
			setDownload(linkTag,w);
			tga=createObjectURL(new Blob(blobArr,blobOpt));
			setHref(linkTag,tga);
			i=bodyList[0];
			try{
				if(i)appendChild(i,linkTag);
			}catch(err){
				consoleWarn("canvas screenshot to tga: failed to append a to body:",err);
			}
			click(linkTag);
			try{
				if(i)removeChild(i,linkTag);
			}catch(err){
				consoleWarn("canvas screenshot to tga: failed to remove a from body:",err);
			}
			revokeObjectURL(tga);
		}catch(err){
			consoleError("canvas screenshot to tga:",err);
		}
	},false);
})(
[null],
{"__proto__":null,"type":"image/x-targa"},
document.createElementNS("http://www.w3.org/1999/xhtml","a"),
Date,
Function.prototype.call.bind(Date.prototype.toISOString),
Blob,
Function.prototype.call.bind(Node.prototype.appendChild),
Function.prototype.call.bind(Node.prototype.removeChild),
Function.prototype.call.bind(CanvasRenderingContext2D.prototype.getImageData),
Function.prototype.call.bind(KeyboardEvent.prototype.__lookupGetter__("key")),
ArrayBuffer,
Uint8Array,
URL.createObjectURL,
URL.revokeObjectURL,
Function.prototype.call.bind(HTMLAnchorElement.prototype.__lookupSetter__("href")),
Function.prototype.call.bind(HTMLAnchorElement.prototype.__lookupSetter__("download")),
document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","body"),
Function.prototype.call.bind(ImageData.prototype.__lookupGetter__("data")),
Function.prototype.call.bind(HTMLCanvasElement.prototype.__lookupGetter__("width")),
Function.prototype.call.bind(HTMLCanvasElement.prototype.__lookupGetter__("height")),
Function.prototype.call.bind(HTMLCanvasElement.prototype.getContext),
Function.prototype.call.bind(HTMLElement.prototype.click),
console.error,
console.warn,
document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","canvas")
);