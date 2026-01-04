// ==UserScript==
// @name         top.gg vote unblocker
// @namespace    top.gg vote unblocker
// @version      1.0
// @description  Vote for a discord bot without watching a shitty unskippable ad.
// @author       TURTLE
// @license      GPL
// @match        *://top.gg/bot/*/vote*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416060/topgg%20vote%20unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/416060/topgg%20vote%20unblocker.meta.js
// ==/UserScript==
var autoVote = function() {
   if ( window.location.href.match(/\?auto/) ) {
      document.getElementById('vote-button-container').children['0'].click();
   }
};

var overrideStyle = function() {
   var element = document.getElementById('vote-root');
   if ( element.style.display !== 'block' ) {
      element.style.display = 'block';
   }
};

autoVote();
overrideStyle();