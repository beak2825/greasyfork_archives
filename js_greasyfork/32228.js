// ==UserScript==
// @name         gmx.net: Direkt zum Posteingang
// @namespace    johnny_english
// @version      2.4.2
// @description  Klickt den "E-Mail"-Button nach Login.
// @author       Johnny English, Graphen
// @include      /^https?://(bap\.)?navigator\.gmx\.(net|ch|at)/.*$/
// @icon         https://img.ui-portal.de/gmx/favicon.ico
// @grant        none
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32228/gmxnet%3A%20Direkt%20zum%20Posteingang.user.js
// @updateURL https://update.greasyfork.org/scripts/32228/gmxnet%3A%20Direkt%20zum%20Posteingang.meta.js
// ==/UserScript==

// MIT-licence:
// Copyright (c) 2017 Johnny English


// parallel AJAX disallows plain match after "document-end" (equivalent
// document.onreadystatechange ... document.readyState === 'complete')
new MutationObserver(
  // Array, MutationObserver
  function( mutations, new_observer ) {
    var thisMO = this;

    // there are 4+ iframes, each with its MO
    var tmr = window.setTimeout( function(){
      thisMO.disconnect();
    }, 2000 );

    // searching through mutations wasn't reliable for some reason
    var j, x = document.getElementsByTagName( "atl-menu-item" );
    for( j = 0; j < x.length; ++j ){
      if( x[j].hasAttribute( "data-item-name" ) &&
          x[j].getAttribute( "data-item-name" ) == "mail" ){
        // stop and dispose the particular timer for this MO
        window.clearTimeout( tmr );
        // click on Posteingang
        x[j].click();
        // stop and dispose this particular MO
        thisMO.disconnect();
        break;
      }
    }
  }
).observe( document, {
  childList: true,
  subtree: true
} );
