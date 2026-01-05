// ==UserScript==
// @name        neobux.com - AdViewer MOD
// @namespace   ns_neobux_AdViewer_Mod
// @description Skip automatically the Adprize Ads (Neobux)
// @include     /^http(s)?\:\/\/(.+\.)?neobux\.com\/v\/\?./
// @version     1.3
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10874/neobuxcom%20-%20AdViewer%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/10874/neobuxcom%20-%20AdViewer%20MOD.meta.js
// ==/UserScript==

// NOTA: Observar creacion de TITLE con un MutationObserver
// NOTA: La observacion de el estado del no ADPrize debe hacerse desde el opener, debido a que es en el opener donde se conoce que ha de hacerse con el bloque

//window.setInterval=function(f,t) { console.log("setInterval(" + f + ", " + t + ")") }
//window.setTimeout=function(f,t) { console.log("setTimeout(" + f + ", " + t + ")") }

/*
var getSearchVar=function(v) {
 if (typeof(v) == "undefined") return undefined;
 var rtn, sBase=location.search.replace(/^\?/,"\&"); if (!sBase.length) return null; sBase+="\&";
 try { rtn=sBase.match(new RegExp("\\&" + v + "\\=.*\\&"))[0].substr(1).split("\&")[0]; rtn=rtn.substr(v.length+1); } catch(undefined) { rtn=(sBase.match(new RegExp("\\&" + v + "\\&")) != null)?"":null; }
 return rtn;
}
*/

//var uJS_search; eval("uJS_search={"+(location.search.substr(1)+"&").replace(/\=/gi,"\:\"").replace(/\&/gi,"\", ").replace(/\,\s$/,"")+"}"); console.log(uJS_search);

var splitSearch=JSON.parse(("{\""+(location.search.substr(1)).replace(/\=/gi,"\"\:\"").replace(/\&|(\/\?)/gi,"\", \"").replace(/\,\s$/,"")+"\"}"));
var observersInstalled=false;

//var isAdPrize=(/^\?(.+\&)?xc=/).test(self.location.search);
//var isAdPrize=(getSearchVar("xc") != null);
//var isAdPrize=(typeof(uJS_search.xc) != "undefined");
var isAdPrize=(typeof(splitSearch.xc) != "undefined");

var uJS_target="uJS_NeobuxAd";
var uJS_docLoaded=false, nextLink="";
var mo=new MutationObserver(callback);
var spanOK=document.createElement("SPAN"); spanOK.textContent="\u2705";
var uJS_countdown, uJS_title;
var countAdPrize="?";

function checkLinks() {
 nextLink=(nxt_bt_a.search.length)?nxt_bt_a.href:"";
 var rtn={}
 //rtn.current=false; try { if (document.querySelector("#prm0").style.display != "none") rtn.current=true; } catch(undefined) {}
 rtn.current=false; try { if (self.prm0.isSized() || self.prm.isSized()) rtn.current=true; } catch(undefined) {}
 rtn.last=false; try { if (nxt_bt_td.style.display == "none") rtn.last=true; } catch(undefined) {}
 rtn.next=(nextLink.length > 0);
 return rtn;
}

function titlePrefix(val) {
 var rtn;
 if (typeof(val) == "undefined") rtn=/^\u22C5\[\u00a0(\?|\d+)\u00a0\]\u2014/;
 else {
  rtn="\u22C5\u005b\u00a0";
  rtn+=(val)?val.toString():"\u2705";
  rtn+="\u00a0\u005d\u2014";
 }
 return rtn;
}

function showFinalTick() {
 mo.disconnect();
 var tickPlace=document.querySelector(".cinza").parentElement.previousElementSibling, w=[document.querySelector("#logocnvs1").getBoundingClientRect().width, document.querySelector("#logocnvs2").getBoundingClientRect().width];
 tickPlace.style.width=w[0]?w[0]:w[1]+"px"; tickPlace.classList.add("uJS_tickOK"); tickPlace.appendChild(spanOK);
 //document.title=document.title.replace(/^\u22C5\[\u00a0\d+\u00a0\]\u2014/,"\u22C5[\u00a0\u2705\u00a0]\u2014");
 document.title=document.title.replace(titlePrefix(),titlePrefix(0));
 
 //var okIMG=prm0.querySelector("img").cloneNode(true);
 //okIMG.setAttribute("id", "script_okIMG");
 //logocnvs1.appendChild(okIMG);
}

function init() {
 Element.prototype.isSized=function() { return ((this.offsetWidth > 0) || (this.offsetHeight > 0)); }
 Element.prototype.isVisible=function() { return ((this.offsetWidth > 0) && (this.offsetHeight > 0)); }
 
 var css="@charset 'UTF-8';\n"; if (isAdPrize) {
  css+=[
   ".uJS_tickOK {font-size: 16px !important; text-align: right !important; cursor: default !important; color: green !important; font-weight: 900 !important; -webkit-touch-callout: none !important; -webkit-user-select: none !important; -khtml-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important;}",
   "#script_okIMG {position: absolute; left: 174px;}",
   "td > .button {visibility: hidden !important;}",
   "td[nowrap] {visibility: visible;}"
  ].join("\n")+"\n";
 }
 
 css+=[
  "#frtp td[style^='background:'] {background-position: 220px !important; background-size: calc(100% - 220px) 100% !important;}",
	"#bnr img {display: none !important}",
  "#frtp + tr table:first-child table:first-child { display: none !important;}"
 ].join("\n");
 
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
}

if (isAdPrize) {
 //countAdPrize=opener.document.querySelector("#ap_ctr .sb:only-child:not(div)").textContent;
 try { countAdPrize=opener.ap_hct.textContent; } catch(undefined) {}
 try { void(document.querySelector(":root > head").valueOf()); } catch(undefined) { document.documentElement.appendChild(document.createElement("head")); }
 try { void(document.querySelector(":root > head > title").valueOf()); } catch(undefined) {
  var t=document.createElement("title");
  //t.textContent=(!isAdPrize)?"NeoBux.":"\u22C5[ " + opener.document.querySelector("#ap_hct").textContent + " ]\u2014 NeoBux.";
  t.textContent=(!isAdPrize)?"NeoBux.":"\u22C5[ " + opener.document.querySelector("#ap_ctr .sb:only-child:not(div)").textContent + " ]\u2014 NeoBux.";
  document.head.appendChild(t);
 }
 if (document.title == "") document.querySelector("head > title").innerHTML=document.querySelector("head > title").innerHTML=titlePrefix(countAdPrize) + "NeoBux.";
 else document.title=titlePrefix(countAdPrize) + document.title;
 
 self.uJS_clearInterval=self.clearInterval;
 self.clearInterval=function(_interval) {
  self.uJS_clearInterval(_interval);
  //self.setTimeout(function() {
   if (!logocnvs1.isSized()) { observersInstall(); callback(); }
  //}, self.rate);
 }
}

init();

function callback() {
 /*
 if (!isAdPrize && readyCurrent()) {
  var currentAdBlockNumber=opener.document.querySelector("a[href*='=" + splitSearch.l + "&']").id.substr(1);
  opener.document.querySelector("#l0l" +  currentAdBlockNumber).classList.remove("unverified");
  return;
 }
 */
 
 var _ready=checkLinks();
 if (_ready.last) showFinalTick();
 else if (_ready.current && _ready.next) {
  //window.open(nextLink, "_self", "", true);
  //console.log("prm0.style.display: " + prm0.style.display); console.log("prm.style.display: " + prm.style.display); alert("See console.log");
  location.replace(nextLink);//history.replaceState({}, "", nextLink); location.reload();
 } else if (prm.isSized()) {
  alert("must click the AdPrize button from opener window");
  try {
   var openerAdPrizeLink=opener.document.querySelector("#ap_h");
   openerAdPrizeLink.target=uJS_target; openerAdPrizeLink.click();
  } catch(undefined) {}
  return;
 }
 //if (prm0.hasAttribute("fire")) {prm0.setAttribute("fire", (parseInt(prm0.getAttrinute("fire"))+1))} else {prm0.setAttribute("fire"),1};
}

//if (isAdPrize) document.title="\u22C5[\u00a0\u2003\u00a0]\u2014 NeoBux";

/*
self.onresize=function() {
 "#frtp td.fixed[style^='background:'] {background-position: 220px !important;}",
}
*/

function observersInstall() {
  var rtn=true;
  try {
   mo.observe(document.querySelector("#prm0"), {childList: true, attributes: true, subtree: true, characterData: true});
   mo.observe(document.querySelector("#prm"), {childList: true, attributes: true, subtree: true, characterData: true});
  } catch(undefined) { rtn=false; }
  return rtn;
}

self.xfb=false;

self.onload=document.onload=document.onreadystatechange=function() {
 if (uJS_docLoaded) return false;
 uJS_docLoaded=true;
 self.xfb=false;
 
 if (isAdPrize) {
  try {
   /*self.uJS_ovalStep=self.D1;
   self.D1=function() {
    self.uJS_ovalStep();
    observersInstalled=observersInstall()
    if (observersInstalled) self.D1=self.uJS_ovalStep;
   }*/
  } catch(err) {console.log(err)}
 }
}

/*
unsafeWindow.areYouReallySure=true;
var lien;
document.getElementById('cnvs').parentNode.parentNode.parentNode.setAttribute('onclick','window.location.assign(\'/v\')')
function checkpub() {
	if(document.getElementById('nxt_bt_a').getElementsByTagName('span')[0] = false) return;
	else if(First) {
	 lien = document.getElementById('nxt_bt_a').href;
	 if (lien != 'javascript:;') {
	  First = false;
	  document.location.href=lien;
	 }
	} 
}


var First = true;
setInterval(checkpub,2000);
*/