// ==UserScript==
// @name        Picarto compatibility for older browsers like FF52
// @namespace   http://michrev.com/
// @description Restore some compatibility between Picarto and older browsers (like FF 52) -- StevenRoy
// @include     https://www.picarto.tv/*
// @include     https://picarto.tv/*
// @include     https://www.picarto.tv
// @include     https://picarto.tv
// @version     2.005
// @run-at document-start
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513149/Picarto%20compatibility%20for%20older%20browsers%20like%20FF52.user.js
// @updateURL https://update.greasyfork.org/scripts/513149/Picarto%20compatibility%20for%20older%20browsers%20like%20FF52.meta.js
// ==/UserScript==
"use strict";

//     _____________  __    __
//    / ___________/ /  \,-' /
//   / /__    ___   / /\,-/ /
//   \___ \  / __\ / /   / /
//______/ / / /   / /   / /
//_______/ /_/   /_/   /_/



// This is what "spread syntax" in object literals looks like:
// {...r, r:e, g:t, b:n}
// { ...methods, r, g, b }
// But because that feature doesn't exist in the latest FF for 32-bit Windows, it needs to be converted.
// (It didn't exist until 2018 and every major browser stopped updating long before then. Screw them.)

// These examples become:
// Object.assign({},r,{r:e, g:t, b:n})
// Object.assign({},methods,{ r, g, b })

// There's a similar feature for arrays but -that- is already supported! Go figure.

function grabscript(url){
	console.log("Fetching:",url);
	var response=GM_xmlhttpRequest({
		method: "GET",
		url: url,
		synchronous: true // Imagine trying to make this script without this feature.
	});
	if (!response.responseText) { throw("Something stupid happened while trying to load:",url,response); }
	console.log('Script fetched, length:'+response.responseText.length);
	return response.responseText;
}

// This adds (actually re-adds) a script to the current page so it can run.
function addScript(text) {
	var newScript = document.createElement('script');
	newScript.type = "text/javascript";
	newScript.textContent = text;
	var head = document.getElementsByTagName('head')[0];
//	console.log("We're adding the thing, length:",text.length);
	head.appendChild(newScript);
//	console.log('We added the thing, length:',text.length);
	return newScript;
}

if (!unsafeWindow.String.prototype.trimStart) { // (iiabdfi)
  unsafeWindow.String.prototype.trimStart=unsafeWindow.String.prototype.trimLeft;
  unsafeWindow.String.prototype.trimEnd=unsafeWindow.String.prototype.trimRight;
}
if (!unsafeWindow.URL.canParse) {
  unsafeWindow.URL.canParse=exportFunction(function canParse(url) {
    var base = arguments.length < 2 || arguments[1] === undefined ? undefined : arguments[1];
    try {
      return !!new URL(url, base);
    } catch (error) {
      return false;
    }
  },unsafeWindow);
}

var delayscripts=[]; // exportFunction doesn't make all of these work: hence more trickiness required...
delayscripts.push("if (!window.AbortController) { window.AbortController=function(){"+
" this.abort=function(){ this.signal.aborted++; }; this.signal={aborted:0}; } };");
delayscripts.push('if (!("IntersectionObserver" in window)) {window.IntersectionObserver=function(cb, oo) {'+
' this.observe=this.unobserve=()=>{}; }}'); // Screw doing it -right-, I just want the page mostly-working again.
delayscripts.push("if (!window.globalThis) { window.globalThis=window; };");

// Oh, this is a weird one: When adding flat() to Array.prototype, it has to be manually
// set to non-enumerable, otherwise the function ends up being mistaken for a configuration
// option by the MistVideo player... Which is a REALLY REALLY STUPID thing to have to workaround but here we go.
delayscripts.push("if (!Array.flat) Object.defineProperty(Array.prototype,'flat',{enumerable:false,value:function(dep=1,stk=[]){"+
// "/*console.log('flat():',this);*/if (!(this instanceof Array)) { return this; }"+
"for(let i of this){ if (dep>0 && i instanceof Array){ i.flat(dep-1,stk); } else stk.push(i); } return stk; } });");
/*
// These three aren't used yet, but I predict at least one will show up eventually...
delayscripts.push("if (!String.replaceAll) { String.prototype.replaceAll=function(sr,ds){"+
	" return this.replace(sr,ds); } };");
delayscripts.push("if (!Array.flatMap) { Array.prototype.flatMap=function(mf){"+
	" return this.flat().map(mf); } };");
*/

// So, here's the deal:

// On other pages, I could just use beforescriptexecute to intercept problem scripts,
// fix the syntax error with a single responseText.replace(), then re-add it.

// In this case, the script I need to intercept isn't loaded like a script!
// When something is loaded using the Worker object, beforescriptexecute does NOTHING!

// So I tried to edit the Worker constructor, using ES6 subclasses and exportFunction
// to create a version of the object that could load, edit and inject the fixed code. That was hard...

// I came so dang close to that actually working, too, but started running into
// Error: Permission denied to access property "addEventListener"
// ...Seems pages can't access Worker objects loaded from blobs created in userscripts
// because of some "same-origin security" bull.
// I spent so many frustrating hours trying to find a way around that...

// Finally I decided, I had to try a different approach, and I got creative:

var firstscript=1;
window.addEventListener('beforescriptexecute', function(e) {
	if (firstscript) { firstscript=0; addScript(delayscripts.join("\n")); }
	var src = e.target.src;
	console.log("Checking script:"+(src?src:"(unknown)"));
	if (src && src.search(/\/static\/js\/1\.[0-9a-f]+\.chunk\.js/) != -1) { // static/js/1.b2dade89.chunk.js
		console.log('Intercepted probable chat script'); // This is the script that loads the Worker
		var onl=e.target.onload; // There's a callback when the script loads. We gotta keep the callback when we replace the script!
//		console.log('onload:',onl);
		e.target.onload=e.target.onerror=null; // Prevent the onerror handler when we cancel this.
		e.preventDefault();
		e.stopPropagation();
		var scr=grabscript(src); // load the script so we can edit it...
		// Original code: _=new Worker("/chatworker.min.js?ver=".concat(m.l)),
console.log('grabbed, adding');
		scr=addScript("window.AAA=1;console.log('Running edited script');\n"+scr.replace(/new Worker/g,"editedWorker")+"\n\n"+
// And now that script has the function that does the loading, editing, and fixing of the other script...
		'function editedWorker(n){console.log("Fetching worker: "+n);var d=new XMLHttpRequest(); d.open("GET","https://picarto.tv"+n,false); d.send(null);'+
'console.log("Fetch status:"+d.status);'+
			'd=d.responseText.replace(/\\{\\.\\.\\.([^,}]+)(?:,([^}]+))?\\}/g,(m,p1,p2)=>{return "Object.assign({},"+p1+(p2? ",{"+p2+"}" :"")+")";})'+
			'.replace(/importScripts\\("([a-z.]+)"\\)[,;]/g,(m,p1)=>{'+
				'return \'importScripts("https://picarto.tv/\'+p1+\'");\'; // absolute paths required here for some stupid reason\n'+
			'});'+

			'return new Worker(URL.createObjectURL(new Blob(["console.log(\'Fixed worker running - SrM was here\');\\n"+d ])));'+
		'}');
console.log('added');
		if (window.AAA) { onl(); } else { scr.onload=scr.onerror=onl; } // New script, same callback
	}
});

window.addEventListener('afterscriptexecute', function(e) {
//	console.log('ase:',e,("MistUtil" in unsafeWindow));
	if (("MistUtil" in unsafeWindow) && ("class" in unsafeWindow.MistUtil) && ("add" in unsafeWindow.MistUtil.class) && !("oldadd" in unsafeWindow.MistUtil.class)) {
//		console.log("muc function detected");
// No longer need this debugging... for now...
/*		let muc=unsafeWindow.MistUtil.class;
		muc.oldadd=muc.add;
		muc.add=exportFunction(function (e,t){
			if("classList"in e){
				try { e.classList.add(t); } catch(ex) { console.log("Failed classList.add of:",t,"to:",e); throw(ex); }
			} else {
				try {var i=this.get(e);i.push(t),this.set(e,i)} catch (ex) { console.log("Failed push of:",t,"to:",e); throw(ex); }
			}
		},muc);
		console.log("muc function replaced");*/
		let mua=unsafeWindow.MistUtil.css;
		if (mua && "applyColors" in mua) {
			mua.oldapplyColors=mua.applyColors;
			mua.applyColors=exportFunction(function(e,t){
//				console.log("applyColors:",e,t);

				return e.replace(/\$([^\s;},]+)/g,function(e,i){ // Picarto BUG! This needed to exclude commas too
// Because of this line in the CSS: background: linear-gradient(to top, $background, transparent);
					var r=i.split("."),n=t;
					for(var a in r){
						if (r[a] in n) {
//							console.log("Applying to part",r[a],"of parameter",i,"value",n[r[a]]);
							n=n[r[a]];
						} else {
//							console.log("Applying to part",r[a],"of parameter",i,"no value");
							return "";
						}
					}
					return n;
				});

//				console.log("returned from applyColors:",mua.oldapplyColors(e,t));
			},mua);
		}
/*		var oldMistUI=unsafeWindow.MistUI;
		unsafeWindow.MistUI=exportFunction(function(e,t){
			console.log("MistUI:",e,t);
			return oldMistUI(e,t);
		},unsafeWindow);*/
	}
});