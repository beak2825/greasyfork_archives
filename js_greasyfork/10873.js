// ==UserScript==
// @name        Selective Script Terminator for frames
// @namespace   ns_framed
// @description Don't use scripts on some frames
// @include     *
// @include     /^http:\/\/example\.net\/\#redirect\:.+/
// @include     about:blank?framer#*
// @exclude     /^http(s)?:\/\/(.+\.)?addthis\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?google\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?facebook\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?twitter\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?addthis\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?solvemedia\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?adnxs\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?doubleclick\.net\/.*$/

// @exclude     /^http(s)?:\/\/(.+\.)?paidverts\.com\/.*$/

// @exclude     /^http(s)?:\/\/(.+\.)?buxvertise\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?simplyptp\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?adhitzads\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?codepen\.io\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?jshell\.net\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?jsfiddle\.net\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?disqus\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?matomy\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?tokenads\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?superrewards-offers\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?persona\.ly\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?offertoro\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?trialpay\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?supersonicads\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?crowdflower\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?ebz\.io\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?spot\.im\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?uservoice\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?9gag\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?blogger\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?wordpress\.com\/.*$/
// @exclude     /^http(s)?:\/\/(.+\.)?youtube\.com\/.*$/

// @exclude     /^http(s)?:\/\/(.+\.)?foxtube\.com\/.*$/

// @version     1.0
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10873/Selective%20Script%20Terminator%20for%20frames.user.js
// @updateURL https://update.greasyfork.org/scripts/10873/Selective%20Script%20Terminator%20for%20frames.meta.js
// ==/UserScript==

// NOTA: El redirector va a pasar a ser: http://example.net/#redirector:

Number.prototype.pad = function(size) {
 var s=Math.floor(this);
 return (("0").repeat(size) + s.toPrecision()).slice(-size);
}

var baseRef=function () { // Requiere Number.pad
 if (typeof(arguments.callee.val)!="undefined") return arguments.callee.val;
 var dsDOC=document.documentElement.dataset;
 if (typeof(dsDOC.random)=="undefined") dsDOC.random="refs:";
 do {
  _random=1;
  while (_random===1) { _random=(Math.random()*1e15); }
  _random=_random.pad(15);
 } while((new RegExp("\0020" + _random + "\0020")).test(dsDOC.random + "\u0020"));
 dsDOC.random+=("\u0020" + _random); arguments.callee.val=_random; return _random;
}

var arrDomain2RegExp=function(arrDomain) { return new RegExp(("\^((" + arrDomain.join(")|(").toLowerCase().replace(/\?\./g,"\u2753").replace(/\*\./g,"\u2026").replace(/\./g,"\\.").replace(/\u2026/g,"\.\+\\.").replace(/\u2753/g,"\(\.\+\\.\)\?") + "))\$")); }

baseRef(); // Volver a llamar para obtener el valor de la Referencia

var uJS_accesibleParent; try { uJS_accesibleParent=parent.document.documentElement; uJS_accesibleParent=true; } catch(undefined) { uJS_accesibleParent=false; }
var uJS_accesibleTop; try { uJS_accesibleTop=top.document.documentElement; uJS_accesibleTop=true; } catch(undefined) { uJS_accesibleTop=false; }
var uJS_isFramer=false; try { uJS_isFramer=(self.location.href.match(/^about:blank\?framer#.+$/).length != 0); } catch(undefined) {}

var forceOnAncestor=arrDomain2RegExp( ["?.neobux.com", "?.paidverts.com", "?.cashnhits.com"] );
var ignoreOnDescendant=arrDomain2RegExp( ["?.buxvertise.com"] );
var isAncestor=false, ignoreFrameBlocking=false;

/*
(function() {
 var re;
 if (uJS_accesibleTop) { isAncestor=true; re=arrDomain2RegExp(forceAncestor); }
 else if (!uJS_accesibleTop) && (top==parent) // Aqui hay que mirar si es descendiente directo de un ancestor (mirando el referrer a ver si es el about:blank#framer)
 
 if (!re.test(location.hostname)) ignoreFrameBlocking=true;
})();
*/ // Esta es la rutina donde estoy trabajando ahora

var uJS_hash=function() {
 var _str=self.location.href, pos=(_str.indexOf("#")+1); _str=pos?_str.substr(pos):"";
 return _str;
}

var uJS_replaceChildFrames=function() {
 [].forEach.call(document.querySelectorAll("iframe"), function(elem,item,arr) {
  var _cloneElem=elem.cloneNode(false);
  _cloneElem.setAttribute("sandbox","");
  elem.parentElement.replaceChild(_cloneElem, elem);
 });
}

window.noScript_testTip=function() { uJS_addTip(); }

var uJS_addTip=function() {
 var dimmer=document.createElement("div");
 dimmer.classList.add("uJS_overlay");
 var info=document.createElement("div");
 info.classList.add("uJS_infotip", "uJS_unselectable");
 info.innerHTML="Scripts aren\'t allowed to frames pointing to another hostname.<BR>You may disable this script if you are looking for frame-breakers.".replace(/\s/g,"&nbsp;").replace(/\-/g,"&#8209;"); //reemplaza los [SPACE] por [NON-BREAKING-SPACE] y los "-" por [NON-BREAKING-HYPHEN]
 document.body.appendChild(dimmer);
 document.body.appendChild(info);
};

// estaria bien agregar un marco de un pixel de ancho alrededor del infotip de color solido blanco

(function() {
 var css = [
  "iframe[name='uJS_framed'] { border: none; left: 0px; width: 100%; top: 0px; height: 100%; }",
  "body.uJS_framer { margin: 0px; }",
  ".uJS_overlay { z-index: 2147483647; visibility: visible !important; cursor: default; position: fixed; top: 0; bottom: 0; left: 0; right: 0; background-color: #000; -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)'; filter: alpha(opacity=50); -moz-opacity: 0.5; -khtml-opacity: 0.5; ; opacity: 0.75; }",
  ".uJS_infotip { z-index: 2147483647; visibility: visible !important; cursor: default; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 9px; border: 1px solid #000; outline: 1px solid #FFF; color: #000; line-height: 11px; font-family: monospace; font-size: 9px; background-color: #C0C0C0; }",
  ".uJS_infotip > a { color: #00F; font-family: monospace; font-size: 9px; text-decoration: none; }",
  ".uJS_unselectable {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;}"
 ].join("\n");
 if (self.name == "uJS_framed") css+="body:not(.uJS_visible), noscript:not(.uJS_visible) { visibility: hidden !important; }";
 
 if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
 } else if (typeof PRO_addStyle != "undefined") {
  PRO_addStyle(css);
 } else if (typeof addStyle != "undefined") {
  addStyle(css);
 } else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
   heads[0].appendChild(node); 
  } else {
   // no head yet, stick it whereever
   document.documentElement.appendChild(node);
  }
 }
})();

window.onload=function() {
 [].forEach.call(document.querySelectorAll("noscript"), function(elem,item,arr) { try { if (elem.firstElementChild == null) {
  if (elem.innerHTML.match(/\<.*\>.+\<\/.+\>/).length == 0) elem.classList.add("uJS_visible");
 } } catch(undefined) {} });
 if (uJS_isFramer) {
  var _frame=document.createElement("IFRAME");
  _frame.setAttribute("sandbox", "");
  _frame.setAttribute("name","uJS_framed");
  document.body.appendChild(_frame);
  document.body.classList.add("uJS_framer", "uJS_visible");
  _frame.setAttribute("src", uJS_hash());
 } else if (self.name == "uJS_framed") {
  uJS_addTip(); document.body.classList.add("uJS_visible");
 } else if (!uJS_accesibleTop) {
  uJS_replaceChildFrames(); document.body.classList.add("uJS_visible");
 }
}

window.onbeforescriptexecute=function(e) {
 if (!uJS_accesibleTop) {
  self.open("about:blank?framer#" + self.location.href, "_self", "", true);
  e.preventDefault();
 }
}

//Queda: revisar si es posible hacerlo sin crear el IFRAME, y hacer que filtre los hostnames que debe revisar en el parent y que los tome de los include
// about:blank#framer#[URL]
// ahi debe apuntar, eso o apuntar a about:blank#framer y evisar document.referrer
// tras saber cual es la web mirndola en el referrer o extrayendola de la url,
// crear un marco con sandbox en el que cargar la web y agregarle el infotip