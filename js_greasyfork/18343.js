// ==UserScript==
// @author       @leoncastro
// @contributor  @gnblizz; https://userstyles.org/styles/126125/google-don-t-bug-me
// @license      Public Domain; http://creativecommons.org/publicdomain/zero/1.0/
// @namespace    http://greasyfork.org
// @name         goog-no-reminder
// @version      0.06
// @description  Remove "A privacy reminder from Google" permanently
// @include      /(https?:)?\/\/(www\.)?google\.((com)|((com?\.)?[\w]{2}))\/.*/
// @include      /(https?:)?\/\/(www\.)?youtube\.com\/.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome
// @compatible   opera
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18343/goog-no-reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/18343/goog-no-reminder.meta.js
// ==/UserScript==
//
!(function(){

 function _addStyle(css)
 {
  var dad,obj;
  obj=document.createElement('style');
  obj.setAttribute('type','text/css');
  obj.innerHTML=css;
  dad=document.getElementsByTagName('head');
  (dad&&dad.length?dad[0]:document).appendChild(obj);
 }
 function onstart(fn){fn()}
 function onready(fn){(document.readyState!='loading')?fn():document.addEventListener('DOMContentLoaded',fn)}

 var gg=/(https?:)?\/\/(www\.)?google\.((com)|((com?\.)?[\w]{2}))\/.*/,
     yt=/(https?:)?\/\/(www\.)?youtube\.com\/.*/;

 if(gg.exec(location.href))
 {
  onstart(function(){
   _addStyle('#cnsh,#cnso,#cnsi{display:none!important}');
  });
  onready(function(){
   document.body.className=document.body.className.replace(/\bnsc\b/,'');
  });
 }
 else if(yt.exec(location.href))
 {
  onstart(function(){
   _addStyle('\
    .yt-consent,.yt-dialog-bg,#yt-consent-dialog{display:none!important}\
    .sitewide-consent-visible .yt-fragment-target{margin-top:-50px!important;padding-top:50px!important}\
    .appbar-hidden.sitewide-consent-visible #masthead-positioner-height-offset{height:50px!important}\
    .sitewide-consent-visible #masthead-positioner-height-offset{height:91px!important}\
    .sitewide-consent-visible #appbar-guide-menu{margin-top:50px!important}\
   ');
  });
  onready(function(){
   var b=window.top.document.querySelector('#body');
   if(b)
   {
    b.className=b.className.replace(/\bsitewide-consent-visible\b/,'');
    b.className=b.className.replace(/\byt-dialog-active\b/,'');
   }
  });
 }

})();
