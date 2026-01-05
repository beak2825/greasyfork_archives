// ==UserScript==
// @name        userstyles forum spamfilter
// @namespace   trespassersW
// @description hides spam posts at forum.userstyles.org
// @include http*://forum.userstyles.org/*
// @license Public Domain
// @created 2014-06-25
// @updated 2014-07-14
// @version 2.014.0714.3
//  + persistence; *patch; * initstate=Show 
//  * authors blacklist
// @run-at document-end
// @grant GM_none
// @downloadURL https://update.greasyfork.org/scripts/2804/userstyles%20forum%20spamfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/2804/userstyles%20forum%20spamfilter.meta.js
// ==/UserScript==
// inspired by hideheader

(function(){ 
// either 'string' or /RegEx/ in post title
var titlez = [ 
/\b(?!201\d)[\d+-]{10,}?/ // phone numbers
/*  */
,/[^\u0000-\u2FFF\uFB00-\uFFFF]/ // CJK ideographs
,/[\u0400-\u04FF]{3,}?/ // cyrillic
/* */
];
// 'string' or /RegEx/ in author's userprofile href
var authorz = [
'/159525/'
/* * /
,/\/(N|M)+[^\db-nzp-y]?[cKkC]{1,2}O([.+mX{6,9}?n])[^\We-zca]o$/i
/* */
];

var C=0,S,E;
var locStor;
function toggleSpam(x){
 var t = ('N'===x)? false: ('Y'===x)? true: !S.disabled;;
 S.disabled = t;
 E.innerHTML= (t?'hide':'show')+' ['+C+']';
 locStor && locStor.setItem("spamfilter",t?'Y':'N');
}

function stickStyle(css){
 var s=document.createElement("style"); s.type="text/css";
 s.appendChild(document.createTextNode(css));
 return (document.head||document.documentElement).appendChild(s);
}

function islisted(tc, bl){
 if(tc) try{
 for(var j=0,lj=bl.length; j<lj; j++) {
  if( typeof bl[j] === "string" ) {
    if( (tc.indexOf(bl[j])>-1) ) return true; 
  }else if( typeof bl[j].test === "function" ) { // regex ?
    if( bl[j].test(tc) ) return true; 
  }else throw "bad titlez";
 };
 } catch(e){ console.log(e+'\n j:'+j+'; tc:'+tc+'; bl:'+bl) }; 
 return false;
}

var a; //(c) hideheader
a = document.querySelectorAll('#Content .DataList > li.Item');
if(a) for (var i=0, li=a.length, t; i<li; i++) {
  t=a[i].querySelector(".Title");
  if(t && islisted(t.textContent, titlez)){
     a[i].classList.add('forum-uso-spam'); C++;
     continue;
  }
  if(authorz.length){
  t=a[i].querySelector(".ShowDiscussionAuthor >a") ||
    a[i].querySelector(".Author >a");
  if(t && islisted(t.href, authorz)) {
     a[i].classList.add('forum-uso-spamer'); C++;
     continue;
  }}
}

if(!C) return; // all clear

 E=document.createElement('div');
 E.id="forum-uso-spam-info";
 E.style.cssText = '\
position:fixed;\
left:2px;top:2px;\
background:rgba(255,255,255,.255);\
color:red;border:none;\
text-shadow: #411 2px 2px 4px, #F11 -2px -2px 4px;\
border: none;\
cursor:pointer;\
';
 E.addEventListener('click',toggleSpam,false);
 document.body.appendChild(E);
 stickStyle('\
.forum-uso-spam {border: dotted red!important;\
border-width: 1px 0px 1px 2px !important;\
background-color:#FFFCF4}\
.forum-uso-spamer{border: dotted maroon!important;\
border-width: 1px 0px 1px 2px !important;\
background-color:#FFD}\
');
 S=stickStyle('\
li.Item.forum-uso-spam *,li.Item.forum-uso-spamer * {display:none!important;}\
li.Item.forum-uso-spam, li.Item.forum-uso-spamer {padding:0!important;margin:0!important;}\
');
var sh;
try {
  locStor = window.localStorage;
  sh=locStor.getItem("spamfilter");
} catch(e){ locStor=null; }
 toggleSpam(sh||'Y');

})();