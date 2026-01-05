// ==UserScript==
// @name        Like Bomber
// @autor       Lanceq
// @namespace   http://lanceq.pl
// @description Like all posts including comments on the selected thread with only one click. By SyfuxX edited by lanceq
// @include     http://facebook.com
// @include     http://facebook.com/*
// @include     http://www.facebook.com
// @include     http://www.facebook.com/*
// @include     https://facebook.com/*
// @include     https://facebook.com
// @include     https://www.facebook.com/*
// @include     https://www.facebook.com
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23913/Like%20Bomber.user.js
// @updateURL https://update.greasyfork.org/scripts/23913/Like%20Bomber.meta.js
// ==/UserScript==


var btnFbLike = document.createElement( 'input' );
with( btnFbLike ) {
  setAttribute( 'type', 'button' );
  setAttribute( 'value', 'Bombarduj' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("_48-k UFILikeLink"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'onclick', 'javascript: var inputs = document.getElementsByClassName("UFILikeLink"); for(var i=0; i<inputs.length;i++) { inputs[i].click(); }' );
  setAttribute( 'style', 'position: fixed; top: 55px; left: 10px; font-weight: bold; font-size: 12px; font-family: calibri; color: white; black; border: 1px solid; border-radius: 25px; background-color: rgb(70, 98, 158);  padding: 2px 5px 2px 5px;' )
}

document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnFbLike );