// ==UserScript==
// @name         Xav365
// @namespace    https://g.cn
// @version      1.5.6
// @description  try to take over the world!
// @author       Lover
// @run-at       document-start
// @match        *://xav365.pw/*
// @match        *://365xav.pw/*
// @match        *://xav365.bid/*
// @match        *://365xav.bid/*
// @match        *://xav365.win/*
// @match        *://365xav.win/*
// @match        *://xav365.men/*
// @grant        none
// @unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/370524/Xav365.user.js
// @updateURL https://update.greasyfork.org/scripts/370524/Xav365.meta.js
// ==/UserScript==
window.killads = true;
(function() {
    'use strict';
    var timer = setInterval( function(){
      var links = document.querySelectorAll( 'a[href^="go.php"]' ), linkscount = links.length, linkitem;
      if( linkscount > 0 ){
        for( var index = 0; index < linkscount; index++ ){
          linkitem = links[index].getAttribute( 'href' );
          links[index].setAttribute( 'href', linkitem.split( 'url=' )[1] );
        }
        clearInterval( timer );
      }
    }, 100 );
    document.cookie = "mH69_2132_atarget=1;";
})();