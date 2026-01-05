// ==UserScript==
// @name				Time Machine
// @id					timeflower
// @namespace			timeflower

// @description			Allows you to make change the rate and direction of time flow
// @version				0.0.3-0.0.3

// @include				https://kolanich.github.io/Time-Machine-userscript/

// @author				KOLANICH
// @copyright			KOLANICH, 2015
// @license				Unlicensed
// @contributionURL		https://github.com/KOLANICH/Time-Machine-userscript
// @contributionAmount	feel free to fork and contribute


// @grant				GM.registerMenuCommand
// @grant				GM.getResourceUrl
// @run-at				document-start
// @optimize			1
// @resource			inject.js ./inject.js
//
// @downloadURL https://update.greasyfork.org/scripts/15603/Time%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/15603/Time%20Machine.meta.js
// ==/UserScript==

/*This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>*/

"use strict";
let el=document.createElement("timeshifter-signal-element");
document.head.appendChild(el);
let s=document.createElement("SCRIPT");
GM.getResourceUrl("inject.js").then((res)=>{
	s.src=res;
	document.head.insertBefore(s, document.head.firstChild);
});

let setRate=function setRate(rate){
	el.dispatchEvent(new CustomEvent('setRate', {detail:rate}));
};

let presets= [-10,-1,0.1,0.5,1,2,10,100,1000,10000];

function createControlBox(){
	document.addEventListener("DOMContentLoaded", ()=>{
	let d=document.createElement("div");
	let t=document.createElement("input");
	t.type="number";
	t.required=true;
	t.maxlength=t.size=5;
	t.placeholder="1";
	//t.disabled=true;
	d.appendChild(t);
	let dl=document.createElement("datalist");
	for(let p of presets){
		let b=document.createElement("option");
		b.value=p;
		dl.appendChild(b);
	}
	t.appendChild(dl);
	t.addEventListener("change", (evt)=>{
		if(!evt.target.reportValidity())
			evt.target.value=1;
		setRate(evt.target.value);
	}, false);
	document.body.appendChild(d);
	d.style.position="fixed";
	d.style.top="50%";
	d.style.right="0px";
	d.style.zIndex="99999";
	}, false);
}

if(GM.registerMenuCommand){
	presets.forEach((r)=>{
		GM.registerMenuCommand(r+"x",setRate.bind(this,r));
	});
	//GM.registerMenuCommand("Show intervals",()=>{console.log(intervals);});
}else{
	createControlBox();
}
