// ==UserScript==
// @name        Picarto image link previewer
// @namespace   http://michrev.com/
// @description Save a click or two by viewing some images directly within Picarto's "leaving" pages. By StevenRoy
// @include     https://www.dropbox.com/*
// @include     https://picarto.tv/site/referrer*
// @include     https://www.picarto.tv/site/referrer*
// @version     1.21
// @grant       none
// @supportURL  https://greasyfork.org/en/users/934871
// @downloadURL https://update.greasyfork.org/scripts/451896/Picarto%20image%20link%20previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/451896/Picarto%20image%20link%20previewer.meta.js
// ==/UserScript==

"use strict";

//     _____________  __    __
//    / ___________/ /  \,-' /
//   / /__    ___   / /\,-/ /
//   \___ \  / __\ / /   / /
//______/ / / /   / /   / /    StevenRoy was here
//_______/ /_/   /_/   /_/     02025.02.08



// JB: issues/1092 obviously applies here.



// Sensitivity is proportional to the sum of the numbers being compared
// When a is 200, returns true when b is >=197 and <=204
// When a is 1000, returns true when b is >=981 and <=1020
// (Can also be adjusted by changing the 100 constant but I like it where it is now.)
function ratherclose(a,b) { return Math.abs(a-b)*100<(a+b); }

var img,mcx,mcy,ww,wh,dw,dh,dx,dy,isl,imgfit=0; // window and image size, size lists etc
var eizs,eisize; // elements for zoom setting and size list

function resized() {
  if (!img) { return; } // TSNH - throw()? alert()?
  var de=document.documentElement;
  if (window.innerWidth) { // Preferred in FF because it doesn't shrink when a scrollbar is present.
    ww=window.innerWidth;
    wh=window.innerHeight;
  } else {
    if (de && de.clientWidth) { // Also exists in FF; this one excludes scrollbar if present.
      ww=de.clientWidth;  // (Though that's kinda moot when we're using overflow:hidden)
      wh=de.clientHeight;
    } else {
      return false; // TSNH? Am I forgetting anything?
    }
  }
//  if (mcx===undefined && mcy===undefined) { mcx=ww>>1; mcy=wh>>1; } // until we get mouse coords
  var iw=img.w,ih=img.h; // We use these a lot.
//  var war=ww/wh; // window aspect ratio (1=square, >1=wide) but what is it good for?
  var iar=iw/ih; // image aspect ratio (1920x800 -> 12/5 which is 2.4)
  var wscw=wh*iar; // resulting width from scaling window height to image's AR.

// There can be three zoom-states: original (iw,ih), fit-x (ww,ww/iar), and fit-y (wh*iar,wh)
// ...And then sort 'em. But also eliminate any that are nearly identical.

  isl=[iw]; // image size list, start with original image size
  var am=ratherclose(ww,wscw); // aspect ratio match between image and window?
  if (!ratherclose(iw,ww)) { // but not actual size match.
    if (am) {
      console.log("Aspect ratio match");
//      isl.push(Math.floor(ww+wh*iar+1)>>1); // use average for near-match (This is actually bad.)
// Assuming a very-near-but-not-perfect match: Which size is further from iw? Let's use that one.
      isl.push(Math.abs(iw-ww) > Math.abs(iw-wscw) ? ww : wscw);
    }
    else { isl.push(ww); }
  }
  if (!am && !ratherclose(iw,wscw)) { isl.push(wscw); }
  if (isl.length>1) {
    if (imgfit>=isl.length) { imgfit=isl.length-1; } // for those times when a size vanishes
    isl.sort((a,b) => a-b);
    img.style.cursor=(imgfit==isl.length-1)?"zoom-out":"zoom-in"; // How to affect blank space around img? (But do we want that?)
  } else { imgfit=0; img.style.cursor="default"; }

  dw=isl[imgfit];
  dh=(dw==iw)?ih:(dw/iar); // dh=dw/(iw/ih) ... dh/ih=dw/iw
  if (eizs) { eizs.textContent=Math.round(100*dw/iw)+" %"; }

//  panned(); // setting image size is done in here too now. Except it's now part of the animation process.
}

const stratio=0.04;
const stmult=1/(1-2*stratio);

function slightstretch(r){
	var tr=(r-stratio)*stmult; // a straight interpolation; maybe I should try to make it cooler later
	if (tr>=1) return 1;
	if (tr<0) return 0;
	return tr;
}

function panned() { // Animated response to Mouse movement with requestAnimationFrame()
  if (mcx!==undefined && dw>ww) { dx=slightstretch(mcx/ww)*(ww-dw); } else { dx=(ww-dw)/2; }
  if (mcy!==undefined && dh>wh) { dy=slightstretch(mcy/wh)*(wh-dh); } else { dy=(wh-dh)/2; }
  var ics=img.style;
  ics.width=Math.round(dw)+"px"; // These were animated for awesomer zooming, but FF has problems with that!!!
  ics.height=Math.round(dh)+"px";
  ics.left=Math.round(dx)+"px"; // always negative when panning, otherwise positive and centered
  ics.top=Math.round(dy)+"px";
}

function onstopanimate() {} // placeholder
var animating=0;
function animate() {
  if (!animating) return onstopanimate();
  panned();
//  var c=coordstoimg();
  requestAnimationFrame(animate); // Uh oh, now we're doing it!
}

// ** ** ** EVENTS

function shutup(e) {
  if (!e) { e=window.event; if (!e) { return false; } }
  e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation(); // For when "return true" just isn't good enough?
  e.preventDefault(); // And I mean it!
  return e;
}

function smother(evt) { shutup(evt); return false; }

function mousecoords(e) { // event
  if ("pageX" in e && "pageY" in e) {
    mcx = e.pageX; mcy = e.pageY;
  } else { // We want coords relative to top (origin) of document, this should do it:
    mcx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    mcy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
}

function smdown(evt) {
//  var e=shutup(evt);
  imgfit++;
  if (imgfit>=isl.length) { imgfit=0; } // Select next (or first) size
  resized();
  smmove(evt); // trigger move() after coordinates change
  return false; // Does this value do anything?
}

function smmove(evt) {
  var e=shutup(evt);
  mousecoords(e);
//  panned();
  return false;
}

function makezoomableimage(i) {
	img=i;
	img.w=img.naturalWidth;
	img.h=img.naturalHeight;

	if (eisize) { eisize.innerHTML=img.w+" x "+img.h; }

	window.onresize=resized; resized();
//  i.onmousedown=smdown;
  i.onmousedown=smother;
  i.onmouseup=smother; // not used!
  window.onmousemove=smmove;
//  i.onclick=smother; // none of these used either
  i.onclick=smdown; // alternative strategy, maybe less good, maybe not?
  i.ondblclick=smother;
//  i.oncontextmenu=smother;
  if (!animating) { animating=1; animate(); } // This starts the maaaaagic!
	img.style.position="fixed";
	img.style.maxWidth="unset"; // Leave it to Picarto to screw with zooms...
  return i;
}

const c64pal="000 fff c05 6ef c5d 6c5 42b fe7 c84 641 f79 555 888 cfa a9f ccc";
// That's my c64 palette. I'm going for a balance of authentic and vivid.
var waitindicator=function(){
	var waittimer,wc=4,wde,wrefc=0;
	return function(){
		if(!wde) {
			document.body.appendChild(wde=Object.assign(document.createElement("div"),{
				innerHTML:'W<span>a</span><span>i</span><span>t</span><span>.</span><span>.</span><span>.</span>',
//				id:'loading',
				style:"z-index:90999;box-sizing:border-box;font-size:20pt;line-height:18pt;font-family:" /* 'Roboto', */ +"'Andale Mono',monospace;"+
					"position:fixed;height:30px;width:160px;top:50%;left:50%;text-align:center;"+
					"margin:-15px 0 0 -80px;background:#000;color:#fff"
			}));
		}
		if (wde && !waittimer) { waittimer=setInterval(function(){
			if (!wde) { return clearInterval(waittimer); } // never underestimate the capacity of browsers to screw up
			wc=(wc+4)&60;
			var wcc=wc;
			wde.style.color="#"+c64pal.substr(wc,3); // A very specific set of colors...
			Array.prototype.forEach.call(wde.children,(e)=>{
				wcc=wcc+4&60;
				e.style.color="#"+c64pal.substr(wcc,3);
			});
		},150); }
		wrefc++;
		return function(){
			if (wrefc>0) { wrefc--; }
			setTimeout(()=>{
				if (wrefc==0 && wde) { wde.parentNode.removeChild(wde); wde=false; }
			},250); // in case of sequential busy-states, delay vanish of busy indicator
		};
	};
}();

// So much gutting of previous code because we don't
// need -any- of the canvas functions...
function loadimage(src,cb) {
	var wi=waitindicator();
	var ix=document.createElement("img");
//  ix=new Image();
	ix.onload=function() {
		wi(); cb(ix); // pass img to callback
	}
	ix.src=src;
} // that basically replaces an entire image manipulation library!
// (Although replacing <canvas> with <image> does seem to make this perform worse (and often crash) in FF52
//   if my awesome animation function is used... I just won't use it then. Problem solved.)

function loadtext(fn,cb) {
  var req = new XMLHttpRequest();
  req.open("GET", fn, true);
  req.overrideMimeType("application/json"); // Does this actually -do- anything?
  req.onload = function (oEvent) {
    var t = req.responseText;
    if (t) { cb(t); }
  };
  req.send(null);
}



// Freaking dummkopfs Picarto seems to like to lazy-load all its actual page content,
// meaning things we want to replace won't exist at this function's execute-time.
// Of course there's a stupid workaround... (and those are often the best kind!)
var retrycount=0;
function itsapicartopage(addr){
	var keeplink=document.links ,m;
	var mb=document.getElementById("main-container"); // within div#root within body
//				console.log(mb,keeplink);
	if (mb && mb.children && mb.children.length && keeplink && keeplink[0] && keeplink[0].href==addr) {
		keeplink=keeplink[0].parentNode;
		mb=mb.childNodes[0];
		m=parsedbaddr(addr);
		const firstimageloaded=(ix)=>{
			mb.innerHTML='';
			mb.style="position:fixed; overflow:hidden; min-height:100vh; height:100vh; width:100%; padding:0; margin:0; display:block";
			keeplink.style="position:fixed;right:0;bottom:0;margin:20px";
			eisize=document.createElement("div");
			eizs=document.createElement("span");
			mb.appendChild(makezoomableimage(ix)); // this sets the eisize content now
			mb.appendChild(keeplink);
			var d1=document.createElement("div"); // additional UI element, mainly for balanced aesthetics!
			d1.className=keeplink.className; // This may vary!
			d1.style="position:fixed;left:0;bottom:0;margin:20px;text-align:center";
			keeplink.style.backgroundColor=d1.style.backgroundColor=getComputedStyle(document.body).backgroundColor;
//			eisize.innerHTML=img.w+" x "+img.h;
			mb.appendChild(d1);
			d1.appendChild(eisize);
			d1.appendChild(eizs);
		};
		const showtweettext=(tx)=>{
			console.log("showtweettext called");
			if (!(tx && tx.text)) return;
			var d1=document.createElement("div");
			console.log("showtweettext proceeding",d1,tx.text);
			d1.className=keeplink.className; // This may vary!
			d1.style="position:fixed;left:0;top:0;margin:20px;text-align:left;width:50%";
			d1.style.backgroundColor=getComputedStyle(document.body).backgroundColor;
			mb.appendChild(d1);
			d1.textContent=tx.text;
			if (tx.author) {
				var a=document.createElement("a");
				a.className=keeplink.getElementsByTagName("a")[0].className;
				a.style.display="block";
				a.href=tx.author.url;
				a.textContent=tx.author.name;
				d1.insertBefore(a,d1.firstChild);
				if (tx.author.avatar_url) {
					var i=document.createElement("img");
					i.src=tx.author.avatar_url;
					i.style="float:left;width:50px";
					d1.insertBefore(i,d1.firstChild);
// 				var br=document.createElement("br");
				}
			}
		};
		const maybemultimode=(urls,onloadcb)=>{
			if (!(urls && urls.length)) return false; // definitely a redundant check
			loadimage(urls[0],ix=>{
				firstimageloaded(ix);
				if (onloadcb) { onloadcb(); }
				if (urls.length>1) { // oh boy here we go with fancy stuff again
					var mimg=[ix];
					var ci=0; // current image number
					var epn=document.createElement("span");
					epn.style.display="block";
					epn.innerHTML="<a href=#>\u21e6</a><a href=#>\u21e8</a><span>1</span> / "+urls.length;
					eizs.parentNode.insertBefore(epn,eizs.parentNode.firstChild);
					var a=epn.getElementsByTagName('a');
					if (a.length != 2) throw "WTF our <a> elements vanished";
					a[0].style.float="left";
					a[1].style.float="right";
					a[0].onclick=a[1].onclick=function(e){
						e=shutup(e);
						var ni=ci;
						if (e.currentTarget===a[1]) {
							ni++; if (ni>urls.length) ni=0;
						} else {
							if (ni==0) ni=urls.length;
							ni--;
						} // TODO: This part isn't finished yet.
//						makezoomableimage(mimg[ni]) // also sets the eisize content
					};
				}
			});

			return urls.length;
		};
		if (m) {
			loadimage(m,firstimageloaded);
		} else if ((m=addr.match(/\/\/(?:www\.)?(?:x|twitter|fxtwitter|twxtter|fixupx)\.com\/.+\/status\/([0-9]+)\/?$/i))
			&& m.length) {
			var wi=waitindicator();
			console.log('Dead bird detected, loading post number:',m[1]);
			loadtext('https://api.fxtwitter.com/'+'unknown'+'/status/'+m[1],(tx)=>{
				wi();
//					console.log(tx);
				tx=JSON.parse(tx);
				if (!(tx.code==200 && tx.tweet)) throw "Didn't get a valid response from fxtwitter.com";
				tx=tx.tweet;
				console.log(tx);
				m=tx.media && tx.media.all && tx.media.all.length && tx.media.all.filter(e => e.type=="photo");

// TODO: when e.type is "video" we can get a thumbnail url, display it as plain image but also create a "play" button
// (and then what?)

				if (m && m.length) {
					maybemultimode(m.map(u=>u.url), ()=>{ showtweettext(tx) } );
				} else showtweettext(tx);

			});
		}
	} else if (retrycount<20) { retrycount++; console.log("Retrying"); setTimeout(itsapicartopage,500,addr); }
}

function parsedbaddr(a){
//	console.log("Parsing addr:",a);
	a=a.replace(/e=[0-9]+&/,''); // no idea what this does, but I saw it once so now I gotta add code to ignore it.
	var m=a.match(/\/\/(?:www\.|dl\.)?dropbox\.com\/(?:e\/)?scl\/fi\/([^/?.]+)\/.+\?(.+)$/i); // where does the e go?
	if (m && m.length && m[2]) {
//		console.log("2:",m);
		var rlkey=false;
		m[2].split('&').forEach(n=>{
			if (rlkey) return; // found one so stop looking
			var a=n.split('=');
			if ((a.length==2) && (a[0]=='rlkey')) rlkey=a[1];
		});
// TODO: Figure out what size= and size_mode= do, if anything. Are they needed?
		if (rlkey) return "https://www.dropbox.com/temp_thumb_from_token/c/"+m[1]+"?rlkey="+rlkey+"&size=1200x1200&size_mode=4";
		return false;
	}
	m=a.match(/\/\/(?:www\.|dl\.)?dropbox\.com\/.+\/[^/?.]*\.(jpg|jpeg|png|gif|webp)(\?dl=0)?$/);
	if (m && m.length && m[1]) {
//		console.log("1:",m);
		if (m[2] == '?dl=0') a=a.replace(/\?dl=0/,'');
		else if (m[2]) throw ("TSNH: Weird query in db addr");
		return a+'?dl=1'; // Functioning link to the image itself (easy mode)
	}
	return false;
}

var l=top.location.href;
var m=l.match(/\/\/(?:www\.)?picarto\.tv\/.+?go=(http(?:s)?%3A%2F%2F[^&]+)/);
if (m && m.length && m[1]) itsapicartopage(decodeURIComponent(m[1]));

// (Also, the Dropbox site is broken in Firefox 52 but we can detect that
// and force images to appear there anyway. This one's for the WinXP users. Shrug.)
else if (m=parsedbaddr(l)) { // If we're on the dropbox site...
	var bv=navigator.userAgent.match(/Firefox\/([0-9]+)/); // but using a browser that db WON'T WORK ON
	if (bv && bv[1] && (bv[1]-0)<=52) {
		var i0=document.createElement("img"); // Just dump the image (sorry, no fancy viewer this time)
		i0.src=m;
		document.body.appendChild(i0);
	}
}

