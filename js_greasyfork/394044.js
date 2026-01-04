// ==UserScript==
// @name ND Twitter Embedder
// @version 1.1
// @include https://www.noticierodigital.com/forum/*
// @include https://noticierodigital.com/forum/*
// @description Embed Twitterlinks
// @author incogitoND
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/427017
// @downloadURL https://update.greasyfork.org/scripts/394044/ND%20Twitter%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/394044/ND%20Twitter%20Embedder.meta.js
// ==/UserScript==
//funciona en Chrome con Tampermonkey
var d=document;
var linkname,nod,bquot;
var tl = d.querySelectorAll('a[href*="twitter"][href*="/status/"]');
for (var i = 0; i < tl.length; i++) {
    linkname = tl[i].getAttribute('href');
	linkname=linkname.replace(/mobile./,"");
		   nod = tl[i];
		   nod.setAttribute('href',linkname);
           bquot = d.createElement('blockquote');
           bquot.setAttribute('class', 'twitter-tweet');
           bquot.setAttribute('lang', 'es');
           bquot.innerHTML = nod.outerHTML;
           nod.outerHTML = bquot.outerHTML;
       }
 if (tl.length>0){
 var nodHead= d.getElementsByTagName('head')[0];
  let script = d.createElement('script');
  script.src = 'https://platform.twitter.com/widgets.js';
  nodHead.appendChild(script);}