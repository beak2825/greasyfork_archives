// ==UserScript==
// @name        Y-marker
// @namespace   trespassersW
// @description Sets up keyboard shortcuts for placing bookmarks and navigation inside webpage.
// @include        http://*
// @include        https://*
// @include        file://*
// ** about:config -> greasemonkey.fileIsGreaseable <- true
// @version 16.03.04
// @license  MIT
// @released 2013-12-11
// @run-at document-end
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/236/Y-marker.user.js
// @updateURL https://update.greasyfork.org/scripts/236/Y-marker.meta.js
// ==/UserScript==
/*  
 16.03.04 bookmarklets works in chrome
 16.02.26 
  [+] hotkey configuration dialogue invoked from GM menu;
  [+] Bookmarlets interface: 
   javascript:postMessage('Y-marker0','*') - jump to bookmark # 0
   javascript:postMessage('Y-marker0=','*') - set up bookmark #0
 16.02.22 
  [+] press Alt-Shift-0 twice to set starting Y-position for whole domain; 
* 13-12-12 click on msg removes all marks
* 1.1 don't run in editable fields
*/
(function(){ "use strict";
if(top!=self || !document || !document.body ) return;
var W = unsafeWindow || window; // localStorage doesn't live in sandbox?
/* key kombinations to invoke the skript */
var kShift = 1,  kCtrl = 2, kAlt = 4, kWin = 8; 
var kJump = kAlt; 
var kMark = kAlt+kShift;

/* sec; 0 to disable; -1 status bar only */
var tipShowtime = 2.2;  

var kNobs = "-0123456789";
var kKeys = { 
 173: 0, 48: 1, 49: 2, 50: 3, 51: 4, 52: 5, 53: 6, 54: 7, 55: 8, 56: 9, 57: 10,
 189: 0, /* chrome, opera caps lock */
 109: 0  /* opera */
};
var minus1="-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1",
    min1=minus1.split(',');
var LH=location.hostname || "Ym", LHP=LH+location.pathname;

function kNob(k){ return kNobs.charAt(k); }

var U=undefined, D=window.document;
var _L=  function() {};
//_L=console.log.bind(console);

var statMsg;
function msg(t,k, y){
 statMsg = "";
 if(U!==k)
  statMsg += "["+kNob(k)+"] ";
 if(U!==y)
  statMsg += ""+pt(y)+"% ";
 statMsg += t;
}

var locStor,locStored;

// see SQlite manager -> %FFpath%\webappstore.sqlite -> find -> key -> contains Ym#

try {
  locStor = W.localStorage;
  locStored=locStor.getItem("Ym#"+location.pathname);
} catch(e){ locStor = locStored =null;  };
  
function pt(y) {
 try{
  y =Math.round(y*1000/(document.body.scrollHeight+1))/10;
  if(y>111.1) y=111.1;
 }catch(e){console.log("math\n"+e); return -1}
 return y;
}

var Ym;
var pz;

function ldYm(){
  var s,t,y;
  if(locStor && locStored){
    pz=locStored.split(",");
    svYm();
    locStor.removeItem("Ym#"+location.pathname);
    console.log('Ym: locS -> GM_S '+LHP);
    locStor = locStored = null;
  }
  s=GM_getValue(Ym,null);
  if(!s){ s=minus1;
  }else {
   try{ y=JSON.parse(s);
   }catch(e){console.log('ldYm: buggy data\n'+e)};
   s=y[LHP] || y[LH] || minus1;
  }

  pz=s.split(",");
  if(y && (y=y['#HotKeys#'])){
   kJump = +y[0], kMark = +y[1];
  }
}

function svYm(d){
 var y={},s=pz.join(",");
 try{
   y=JSON.parse(GM_getValue(Ym,'{}'));
 }catch(e){console.log('svYm: buggy data\n'+e);}
 if(!d) y[LHP]= s; 
 else if(d==='#'){
   y['#HotKeys#']=[kJump,kMark];
 }else{ //  marker for whole domain
   y[LH]= s;
 }
 GM_setValue(Ym,JSON.stringify(y));
}

function rmYm(){
 var y={};
 try{
   y=JSON.parse(GM_getValue(Ym,'{}'));
 }catch(e){console.log('rmYm: buggy data\n'+e); y={}; }
  if(y[LH]) delete y[LH],  _L("rmH: " +LH);
  if(y[LHP]) delete y[LHP],  _L("rmHP: " +LHP);
 GM_setValue(Ym,JSON.stringify(y));
 pz=min1;
}

function jumpY(k){
 var y=pz[k];
 if(y > -1) {
   if( y!= scrollY ){
    pz[0] = scrollY;
    scroll(0,y);
    msg("jump",k,y);
   }else
    msg("here",k,y); 
   return 1;
 }
 msg("none",k); 
 return 0;
}

function markY(k){
 var d="";
 if(k==1 && scrollY == pz[k] ) d="!";
 pz[k]=scrollY;
 if(k>=1)
  svYm(d);
 msg("mark"+d,k,pz[k]);
 return 1;
}

var kMap= {16: kShift, 17:kCtrl, 18: kAlt, 91: kWin};
var keyMod=0;
var kkWin= (kMark | kJump) & kWin;

function klear(e) { 
 var k= e.keyCode; 
 if(!k) return;
 var km=kMap[k];
 if(km) {
  keyMod &= -1 ^ km;
 }
}

function onKeydown(e) {
 try{
 var rc=0, k= e.keyCode; 
 if(!k) return;
 // Don't run in input, select, textarea etc.
 var E = D.activeElement.tagName.toLowerCase();
 if (E == "input" || E == "select" || E == "textarea" ||
    (E=D.activeElement.contentEditable) == "true" ||
     E == "") 
   {  keyMod = 0; return; }
 
 var km =kMap[k]; // ff doesnt track metaKey. stsuko
 if(km) {
   keyMod |= km;
   if( kkWin && km === kWin ) //???
    e.preventDefault(), e.stopPropagation();
   return;
 }
 km=keyMod; 
 if( U=== (k=kKeys[k]) ){ keyMod = 0; return; }
 if( km === kJump ) {
   rc = jumpY(k);
 }else if( km === kMark ) {
   rc = markY(k);
 }else {
  return;
 }
 statSay();
 if(rc) e.preventDefault(),e.stopPropagation();
 }catch(e){console.log('smth wromg\n'+e)};
}
 
function mk(p, t, id, s) {
  var e = D.createElement(t);
  e.id=id;
  e.style.cssText = s;
  return p.appendChild(e);
};

/* RIP status bar replacement */
var sb;
function _css(){ 
if(!sb) sb = mk(
//D.body, 
D.documentElement, // 2014-06-30 ???!!1 
'section', "Y-marker-userjs-inf",
"position: fixed!important;\
z-index: 214748!important;\
top: 0px; right: 1px; bottom: auto; left: auto;\
background: rgba(221,255,221,.75)!important;\
padding: 2px 3px 2px 8px; margin:0;\
border: none;\
border-radius: 12px 3px 3px 12px;\
color: #131!important;\
opacity: 1; display:none;\
font: normal 12px/14px sans-serif !important;\
text-shadow: #373 2px 2px 4px, #7F7 -2px -2px 4px;\
cursor:no-drop;\
"
);
/* click removes all  */
if(tipShowtime>0){
 sb.addEventListener("click",function (e) {
  rmYm(); //locStor.removeItem(Ym);
  ldYm(); noTout();
 },false);
};
}


var tO;
function onTout(){
 tO=0; sb.style.display="none";
}
function noTout(){ 
 if(tO) clearTimeout(tO), onTout();
}

function statSay(t) {
 if(statMsg){
 _css();
   if(tipShowtime) 
     W.status=statMsg;
   if(tipShowtime>0){
     noTout();
     sb.innerHTML= statMsg;
     sb.style.display="block";
     tO=setTimeout(onTout, (t? t: tipShowtime)*1000);
   }
 } 
 statMsg="";
}

Ym="Ym#";//+location.pathname;

ldYm();
for(var k=1; k<2; k++){ /* pz.length */
 if(pz[k]>-1){ 
  scroll(0,pz[k]); 
  msg('jump',k,pz[k]);
  statSay(5);
  break; 
 }
};

function $i(id, parent){
	return (parent || document).getElementById(id)
}

var hk;
function saveHk(){
 function K(id, b)
 { return $i('Ym-bt'+id).checked? b: 0 }
  kJump=K('JS',kShift)|K('JA',kAlt)|K('JW',kWin)|K('JC',kCtrl);
  kMark=K('MS',kShift)|K('MA',kAlt)|K('MW',kWin)|K('MC',kCtrl);
  svYm('#');
}

function setKeys(){
 function J(j){return kJump&j? 'checked': ''}
 function M(m){return kMark&m? 'checked': ''}
  if(hk)   hk.parentNode.removeChild(hk);
  hk = D.createElement('section');
  hk.style.cssText = 
"position: fixed!important;\
z-index: 214748!important;\
top: 10px; left: 16px; bottom: auto; right: auto;\
background: rgb(221,255,221)!important;\
padding: 4px; margin:0;\
border: 1px solid #131;\
border-radius: 3px; \
color: #131!important;\
opacity: 1; display:block;\
font: normal 12px/14px sans-serif !important;\
";
  hk.innerHTML=('\
<form style="padding:0;margin:0"><b>\
<center style="padding-bottom:.5em">Y-marker hotkeys</center></b>\
<b style="width:3em;display:inline-block;">Jump</b>: &nbsp;&nbsp;\
Shift<input type=checkbox id=Ym-btJS '+J(kShift)+'> &nbsp;&nbsp;\
Alt<input type=checkbox id=Ym-btJA '+J(kAlt)+'> &nbsp;&nbsp;\
Win<input type=checkbox id=Ym-btJW '+J(kWin)+'> &nbsp;&nbsp;\
Ctrl<input type=checkbox id=Ym-btJC '+J(kCtrl)+'> <br>\
<b style="width:3em;display:inline-block;">Mark</b>: &nbsp;&nbsp;\
Shift<input type=checkbox id=Ym-btMS '+M(kShift)+'> &nbsp;&nbsp;\
Alt<input type=checkbox id=Ym-btMA '+M(kAlt)+'> &nbsp;&nbsp;\
Win<input type=checkbox id=Ym-btMW '+M(kWin)+'> &nbsp;&nbsp;\
Ctrl<input type=checkbox id=Ym-btMC '+M(kCtrl)+'><hr><center>\
<input type="button" tabIndex=1 value="Save" id="Ym-btSave"> &nbsp;\
<input type="button" tabIndex=2 value="Cancel" id="Ym-btCancel">\
</center></form>\
');
hk.addEventListener("click",function(e){
 var t= e.target,c=0;
 if(!t || !t.id) return;
 if(t.id=="Ym-btSave")try{
   c=1;
   saveHk();
 }catch(e){console.log("Ym: problem in hotkey dialog\n"+e)}
 else if(t.id=="Ym-btCancel"){
   c=1;
 }
 if(c){
   e.preventDefault(), e.stopPropagation();
   hk.parentNode.removeChild(hk),hk=null;
 }
},false);
 D.documentElement.appendChild(hk);
}

function wMsg(e){
 //event.source!=window in Chrome
 if(typeof e.data==='string' && e.data.substr(0,8)==='Y-marker'){
  e.stopPropagation();
  if(e.data === 'Y-marker hotkeys')
    return setKeys();
  var m=e.data.match(/Y-marker\s*([0-9-])(\=?)/);
  var p = (m[1]==='-')?0: +m[1]+1;
  if(m[2])
    markY(p);
  else
    jumpY(p);
  statSay();
 } 
}

addEventListener("keydown",onKeydown,false);
addEventListener("keyup",klear,false);
GM_registerMenuCommand("Y-marker hotkeys", setKeys);

window.addEventListener("message", wMsg, false);

})();
