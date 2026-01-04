// ==UserScript==
// @name Remove redirection tracking from Qwant Lite
// @namespace StephenP
// @version 1.1
// @description A script that removes redirection tracking from Qwant Lite.
// @author StephenP
// @grant none
// @include https://lite.qwant.com/?q=*
// @include https://lite.qwant.com/?*&q=*
// @downloadURL https://update.greasyfork.org/scripts/404635/Remove%20redirection%20tracking%20from%20Qwant%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/404635/Remove%20redirection%20tracking%20from%20Qwant%20Lite.meta.js
// ==/UserScript==
var results=document.body.getElementsByClassName("title");
if(results.length==0){
  results=document.body.getElementsByClassName("result-image");
}
if(results.length==0){
  results=document.body.getElementsByClassName("result-video");
}
if(results.length==0){
  results=document.body.getElementsByClassName("result--with-image");
}
var link;
for(var i=0;i<results.length;i++){
  link=decodeURIComponent(results[i].children[0].href);
  if(link.includes("lite.qwant.com/")){
     results[i].children[0].href=decodeURIComponent(results[i].children[0].href).slice(link.lastIndexOf("=/")+2);
  }
}