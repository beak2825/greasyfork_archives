// ==UserScript==
// @name        Wanikani Sounds
// @namespace   wksounds
// @description Adds sounds for correct and incorrect on WaniKani reviews.
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     1.0.1
// @author      Jeremy Short
// @copyright   -
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16230/Wanikani%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/16230/Wanikani%20Sounds.meta.js
// ==/UserScript==

// Audio by: https://www.freesound.org/people/Bertrof/

$(document).ready(function(){
    var o;(o=new MutationObserver(function(ms) {
        ms.forEach(function(m) {
            (function(s){s?(function(_){_.volume=0.5;_.play();})(new Audio('https://www.freesound.org/data/previews/131/1316'+(57+(~~(s[0]=='c')*5))+'_2398403-lq.mp3')):null;})(m.target.className[0]);
        });
    })).observe(document.querySelector('#answer-form fieldset'), {attributes: true, subtree: true, attributeFilter: ['class']});
    var so;(so=new MutationObserver(function(ms){
        ms.forEach(function(m){
            var a=document.querySelector('audio');
            var p=a?a.getAttribute('autoplay')=='autoplay'?(a.removeAttribute('autoplay'),true):false:null;
            if(p)setTimeout(function(){if(p)a.play();}, 1000);
        });
    })).observe(document.querySelector('#option-audio'), {attributes: true, subtree: true, attributeFilter: ['class']});
});