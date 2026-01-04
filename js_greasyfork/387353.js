// ==UserScript==
// @name         Facebook ad-free lifestyle.
// @namespace    http://tampermonkey.net/
// @version      10.3
// @description  haha
// @author       BanditCat
// @match        https://*.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387353/Facebook%20ad-free%20lifestyle.user.js
// @updateURL https://update.greasyfork.org/scripts/387353/Facebook%20ad-free%20lifestyle.meta.js
// ==/UserScript==

(function(){
  'use strict';

  window.setInterval( function(){
    var articles = document.querySelectorAll( 'article' );
    var sel = "";
    var sel2 = "";
    if( articles.length != 0 ){
     sel = 'article';
      sel2 = 'div>span';
    }else{
      sel = '[data-testid=fbfeed_story]';
      sel2 = 'span';
    }
    var stories = document.querySelectorAll( sel );
    [...stories].forEach(function( story ){
      var spans = story.querySelectorAll( sel2 );
      var spantexts = {};
      [...spans].forEach( function( span ){
          if( spantexts[ span.className ] )
           spantexts[ span.className ] += span.innerText;
         else
             spantexts[ span.className ] = span.innerText;
      });
      for( var key in spantexts ){
        if( spantexts[ key ].startsWith( "Sponsored" ) ){
          story.remove();
        }
      }
    });
  }, 2000 );
})();