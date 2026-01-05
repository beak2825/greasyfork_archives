// ==UserScript==
// @name        Change font - PT Mono
// @namespace   english
// @description Change font - PT Mono - free from Google Fonts
// @version     2.15

// @include     http*://*archiveofourown.org*
// @include     http*://*yahoo*
// @include     http*://*futureme*
// @include     http*://*jsfiddle.net*
// @include     http*://*kbin.social*
// @include     http*://*biblegateway.com* 

// @include     http*://*mail.google.com*
// @include     http*://*inbox.google.com*
// @include     http*://*keep.google.com*
// @include	http*://*google.com/contacts*
// @include	http*://*contacts.google.com*
// @include	http*://*drive.google.com*
// @include	http*://*calendar.google.com*
// @include	http*://*sites.google.com*
// @include	http*://*analytics.google.com*
// @include	http*://*photos.google.com* 
// @include	http*://*urbandictionary* 


// @include     http*://*facebook.com*
// @include     http*://*greasyfork.org*
// @include     http*://*reddit.com*
// @include     http*://*dreamhost.com*
// @include     http*://*ingdirict.com*
// @include     http*://*ubank.com*
// @include	http*://*support.tourplan.com*
// @include	http*://*asana.com*
// @include	http*://*panthur.com*
// @include	http*://*trello.com*
// @include	http*://*convertcase.net*
// @include	http*://*textmechanic.com*
// @include	http*://*text-compare.com*
// @include	http*://*messenger.com*

// @include	http*://*telstra.com*
// @include	http*://*bankwest.com*
// @include	http*://*dropbox.com*
// @include	http*://*twitter.com*

// @include	http*://*youtube.com* 
// @include	http*://*paypal.com* 
// @include	http*://*pixabay.com* 
// @include	http*://*materialup.com* 
 
// @include	http*://*preceda.com* 

// @include	http*://*pixabay.com* 

// @include	http*://*bitbucket.org* 
// @include	http*://*cloud.google.com* 
// @include	http*://*github.com* 
// @include	http*://*slack.com* 
// @include	http*://*whatsapp.com* 
// @include	http*://*messenger.com* 
// @include	http*://*facebook.com* 
// @include	http*://*discordapp.com* 
// @include	http*://*messages.android.com* 
// @include	http*://*bing.com* 
// @include	http*/wp-admin/* 

// @include	http*://*soundiiz.com*
// @include	http*://*soundcloud.com*
// @include	http*://*np.ironhelmet.com*

// @include	http*tutorialspoint.com*  
// @include	http*reactjs.org*  

// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28525/Change%20font%20-%20PT%20Mono.user.js
// @updateURL https://update.greasyfork.org/scripts/28525/Change%20font%20-%20PT%20Mono.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =  ' textarea, html body textarea,html body,html,html body p,html body span,input,div, html body div,  html body   span,  html body   applet,  html body   object,  html body   iframe,  html body   h1,  html body   h2,  html body   h3,  html body   h4,  html body   h5,  html body   h6,  html body   p,  html body   blockquote,  html body   pre,  html body   a,  html body   abbr,  html body   acronym,  html body   address,  html body   big,  html body   cite,  html body   code,  html body   del,  html body   dfn,  html body   em,  html body   img,  html body   ins,  html body   kbd,  html body   q,  html body   s,  html body   samp,  html body   small,  html body   strike,  html body   strong,  html body   sub,  html body   sup,  html body   tt,  html body   var,  html body   b,  html body   u,  html body   i,  html body   center,  html body   dl,  html body   dt,  html body   dd,  html body   ol,  html body   ul,  html body   li,  html body   fieldset,  html body   form,  html body   label,  html body   legend,  html body   table,  html body   caption,  html body   tbody,  html body   tfoot,  html body   thead,  html body   tr,  html body   th,  html body   td,  html body   article,  html body   aside,  html body   canvas,  html body   details,  html body   embed,  html body   figure,  html body   figcaption,  html body   footer,  html body   header,  html body   hgroup,  html body   menu,  html body   nav,  html body   output,  html body   ruby,  html body   section,  html body   summary,  html body   time,  html body   mark,  html body   audio,  html body   video{font-family:"STALKER1","PT Mono" , "Tahoma" !important;    font: "PT Mono" !important;} body .google-material-icons {    font-family: "Google Material Icons"  !important ;}   md-image ,md-image i{font:inherit  !important ;} html{font-size:118% !important ;} i.mce-i-aligncenter, i.mce-i-alignjustify, i.mce-i-alignleft, i.mce-i-alignright, i.mce-i-backcolor, i.mce-i-blockquote, i.mce-i-bold, i.mce-i-bullist, i.mce-i-charmap, i.mce-i-dashicon, i.mce-i-dfw, i.mce-i-forecolor, i.mce-i-fullscreen, i.mce-i-help, i.mce-i-hr, i.mce-i-indent, i.mce-i-italic, i.mce-i-link, i.mce-i-ltr, i.mce-i-numlist, i.mce-i-outdent, i.mce-i-pastetext, i.mce-i-pasteword, i.mce-i-redo, i.mce-i-remove, i.mce-i-removeformat, i.mce-i-spellchecker, i.mce-i-strikethrough, i.mce-i-underline, i.mce-i-undo, i.mce-i-unlink, i.mce-i-wp-media-library, i.mce-i-wp_adv, i.mce-i-wp_code, i.mce-i-wp_fullscreen, i.mce-i-wp_help, i.mce-i-wp_more, i.mce-i-wp_page {  font: normal 20px/1 dashicons  !important ; } .fa-classic, .fa-regular, .fa-solid, .far, .fas,i.fa-classic, i.fa-regular, i.fa-solid, i.far, i.fas  {  font-family: Font Awesome 6 Free  !important ;}       ';
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




