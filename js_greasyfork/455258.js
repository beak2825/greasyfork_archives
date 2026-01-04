// ==UserScript==
// @name        Auto click short link
// @namespace   Auto click Shortlink
// @version      1.0
// @description   Shortlink Auto Click
// @author       @Wagner3356
// @match        https://allfaucet.xyz/links
// @match       https://feyorra.top/links
// @match        https://riadlink.top/links

// @noframes
// @grant        window.close

// @downloadURL https://update.greasyfork.org/scripts/455258/Auto%20click%20short%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/455258/Auto%20click%20short%20link.meta.js
// ==/UserScript==
(function() {

    'use strict';

var time = setTimeout( function(){
                 var botones = document.querySelector('button.btn.btn-success.claim-button');
     if (botones){
                       botones.click(); setTimeout( function(){ window.close();}, 2000);
                 }
     else { clearTimeout(time); alert('no hay links'); }}, Math.floor(Math.random()*1000) + 1200);

 })();
 
