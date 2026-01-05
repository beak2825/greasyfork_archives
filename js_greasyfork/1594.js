// ==UserScript==
// @name        sputnik.ru direct links
// @namespace   trespassersW
// @description straight links in sputnik.ru search results
// @include *://*.sputnik.ru/search*
// @include *://maps.sputnik.ru/*
// @version 2.014.0624
// @updated 2014-06-24
//  2.014.0624 @icon
//  1.2.5 * popup map legend
//  1.1.0 + news
// @created 2014-05-24
// @license LGPL
// @run-at document-end
// @icon https://i.imgur.com/lk4djLP.png
// @grant GM_none
// @downloadURL https://update.greasyfork.org/scripts/1594/sputnikru%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/1594/sputnikru%20direct%20links.meta.js
// ==/UserScript==
(function(){ "use strict";

function gumCss(css){
var S=document.createElement("style"); S.type="text/css";
S.appendChild(document.createTextNode(css));
return (document.head || document.documentElement).appendChild(S);
}

if(location.href.indexOf("://maps.")>0){
 gumCss(".b-column-left:before{\
position: fixed !important;\
visibility: visible !important;\
top: 10px  !important;\
left: 10px !important;\
right: auto !important; bottom: auto !important;\
z-index: 247247 !important;\
background-color: rgba(240, 240, 240, .7) !important;\
opacity: .9 !important;\
width:  64px !important; \
height: 44px !important;\
text-align: center !important;\
border: thin solid grey !important;\
border-radius: 16px 0px 16px 0px !important;\
content: url(data:image/gif;base64,R0lGODlhNgAoAPf/AAD/6gCP/wDC/1MARQBcAHkATQBTAGMAdAByAHAAeQBzAFMAXABQAFQAVQBOAEsASQBcAC0AbQBsAGcAbwBvAGcALgBpAAAAZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABL5LAAAAJgAAHyRAB4ICPn4ACEAEnyRABUTeAA9AAB8kQAAAJD/DQAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG0AAC1wYQDYEfdIAAAAEgAVABL67OkAAJh8kHyRQv///0KP/5x8kQAB0AAARfk8AIAAEsAQABL67OkAAEB8kHyRAP///wAA/w0AAHyQ/xL6cAnvAAB8gQAAABfsaP//AmgBBQIX7AAAGAAAAFgAAAAS+gAAQAAAADwAAAAS+gAAAAAAAAAAAAAAAAAADAACAAEAAHyQAf3sANxMf8B8kHyBDAACHPqMAJQAEgAS+gAACAAOAEgAAAEKtwAAAAIcAFMAAHyAGgACHAAAAADAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAJDcTCDafBx8gwAAAsD6EiH5BAkAAP8ALAAAAAA2ACgAAAjEAP8JHEiwoMGDCBMqXMiwocOHECNKnEixosEAFjMixKixo8AAHD1aBEkSpEiJJVOSPMlQpUuTLDe+nBmzoMqDLmt+LLkwpU6fLXnGFNoQqEiiDpF2VIqTINOMT3fCHBh1YlSjVFcufXrTptaRXb1+dRp2oICzaINOJTs2a1uCaAUUfYuVbUiEZx8qXYvzLVi+au9uBdzTL1TDfRFXrCtT8V/CdgWzzCnW8eCZjH9irqqZps65nD/3FY2SdGnTqFOrXj0wIAA7\
) !important;\
cursor: pointer !important;\
}\
.b-column-left{\
position: fixed !important;\
top: 10px  !important;\
left: 10px !important;\
/*right: auto !important; bottom: auto !important;\
z-index: 247 !important;\
border: 1px solid grey  !important;\
border-radius: 16px 0px 16px 0px !important;\
*/\
opacity: .9 !important;\
visibility: hidden !important;\
margin: 0 !important;\
padding: 0 !important;\
transition: all 0s ease 0.75s !important;\
-webkit-transition: all 0s ease 0.75s !important;\
}\
.b-column-left:hover {\
visibility: visible !important;\
transition: all 0s ease 0.3s !important;\
-webkit-transition: all 0s ease 0.3s !important;\
}\
.b-column-left:hover:before { \
visibility: hidden !important;\
transition: all 0s ease 0.25s !important;\
-webkit-transition: all 0s ease 0.25s !important;\
}\
\
");
 return;
}

//if(location.href.indexOf("://www.")>0 || location.href.indexOf("://news.")>0)
 gumCss("\
.b-s-r-link > a\
,.b-results__url > a\
{\
color: #999;\
text-decoration: none;\
cursor: pointer;\
}\
.b-s-r-link > a:visited\
,.b-results__url > a:visited\
{\
 color: #F77;\
}\
.b-s-r-link > a:hover\
,.b-results__url > a:hover\
{\
 text-decoration: underline;\
}\
");


var sl,tc,al;
sl = document.querySelectorAll("span.b-s-r-link,span.b-results__url");
for(var i =0,li=sl.length; i<li; i++){
 tc=sl[i].textContent;
 al=document.createElement('a');
 al.href=tc;
 al.textContent=tc;
 al.target="_BLANK";
 sl[i].innerHTML='';
 sl[i].appendChild(al);
}

//console.log(i+ " links");
})();