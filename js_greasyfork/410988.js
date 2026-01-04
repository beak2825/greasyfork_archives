// ==UserScript==
// @name        Gmail logo change to jtb 
// @namespace   english
// @description Gmail logo change to jtb  private
// @include     http*://*outlook.office365.com*
// @include     http*://*sharepoint.com*
// @version     1.1
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/410988/Gmail%20logo%20change%20to%20jtb.user.js
// @updateURL https://update.greasyfork.org/scripts/410988/Gmail%20logo%20change%20to%20jtb.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =  ' textarea, html body textarea,html body,html,html body p,html body span,input,div, html body div,  html body   span,  html body   applet,  html body   object,  html body   iframe,  html body   h1,  html body   h2,  html body   h3,  html body   h4,  html body   h5,  html body   h6,  html body   p,  html body   blockquote,  html body   pre,  html body   a,  html body   abbr,  html body   acronym,  html body   address,  html body   big,  html body   cite,  html body   code,  html body   del,  html body   dfn,  html body   em,  html body   img,  html body   ins,  html body   kbd,  html body   q,  html body   s,  html body   samp,  html body   small,  html body   strike,  html body   strong,  html body   sub,  html body   sup,  html body   tt,  html body   var,  html body   b,  html body   u,  html body   i,  html body   center,  html body   dl,  html body   dt,  html body   dd,  html body   ol,  html body   ul,  html body   li,  html body   fieldset,  html body   form,  html body   label,  html body   legend,  html body   table,  html body   caption,  html body   tbody,  html body   tfoot,  html body   thead,  html body   tr,  html body   th,  html body   td,  html body   article,  html body   aside,  html body   canvas,  html body   details,  html body   embed,  html body   figure,  html body   figcaption,  html body   footer,  html body   header,  html body   hgroup,  html body   menu,  html body   nav,  html body   output,  html body   ruby,  html body   section,  html body   summary,  html body   time,  html body   mark,  html body   audio,  html body   video{font-family:"PT Mono" !important;    font: "PT Mono" !important;} ';
document.getElementsByTagName('head')[0].appendChild(style);

/*
.DPvwYc,body .DPvwYc, html body span.DPvwYc {     font-family: "Material Icons Extended" !important; } 

 WebFontConfig = {
      google: { families: 'PT Mono' }
   };

   (function(d) {
      var wf = d.createElement('script'), s = d.scripts[0];
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
      wf.async = true;
      s.parentNode.insertBefore(wf, s);
   })(document);


*/
var meta = document.createElement('link');
meta.href='https://fonts.googleapis.com/css?family=Open+Sans';
meta.href='stylesheet';
meta.type='text/css';

document.getElementsByTagName('head')[0].appendChild(meta);

