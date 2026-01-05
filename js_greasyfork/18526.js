// ==UserScript==
// @name         Grepolis Claim / Loot Alarm
// @namespace    http://smafe.com
// @version      0.2.0
// @description  Gives an alarm after X seconds based on the period your looting / claiming for.
// @author       Smafe Web Solutions
// @match        https://*.grepolis.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/18526/Grepolis%20Claim%20%20Loot%20Alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/18526/Grepolis%20Claim%20%20Loot%20Alarm.meta.js
// ==/UserScript==

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if(s=e.extend({},u.defaults,s),"number"==typeof s.expires){var a=s.expires,d=s.expires=new Date;d.setMilliseconds(d.getMilliseconds()+864e5*a)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var f=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;m>l;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){f=r(j,c);break}t||void 0===(j=r(j))||(f[g]=j)}return f};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});

var claimTimeout = false;
var claimAudio = new Audio( 'http://zed.wearelogik.com/grepolis-claimed.mp3' );
claimAudio.addEventListener( 'ended', function() {
  this.currentTime = 0;
  this.play();
}, false );

function QueueSound() {

  if( claimTimeout ) {
    claimAudio.pause();
    claimAudio.currentTime = 0;
    $( '.claimResources' ).remove();
    $( '.ui_quickbar .left .container' ).fadeIn();
    window.clearTimeout( claimTimeout );
  }

  claimTimeout = setTimeout( function() {
    $( '.ui_quickbar .left .container' ).fadeOut( function() {
      $( '.ui_quickbar .left' ).prepend( '<div class="claimResources">Krev ressurser fra bondelandsbyer !!!</div>' );
    } );
    claimAudio.play();
  }, parseInt( $.cookie( 'grepolis-claim-ready' ) ) - parseInt( jQuery.now() ) );

}

$( document ).ready( function() {

  $( 'head' ).append( $( '<style>.ui_quickbar .claimResources { font-weight: bold; color: red; position: absolute; top: 0; left: 47px; right: 93px; text-align: center; width: 50%; height: 22px; }</style>' ) );

  if( parseInt( $.cookie( 'grepolis-claim-ready' ) ) ) {
    QueueSound();
  }

  $( 'body' ).on( 'click', '#fto_claim_button', function() {

    var time = $( '#time_options_wrapper .fto_time_checkbox.active' ).attr( 'data-option' );

    $.cookie( 'grepolis-claim-ready', ( parseInt( jQuery.now() ) ) + ( parseInt( time ) * 1000 ) );

    QueueSound();

  } );

} );