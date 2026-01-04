// ==UserScript==
// @name         TTS jpdb
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  TTS for sentence list, hide English translations
// @author       chaiknees
// @match        https://jpdb.io/review*
// @icon         https://www.google.com/s2/favicons?domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439124/TTS%20jpdb.user.js
// @updateURL https://update.greasyfork.org/scripts/439124/TTS%20jpdb.meta.js
// ==/UserScript==

(function() {
    'use strict';
      let voice;
      let lines = [];
      function speakIn( nv ) {
          voice = nv;
      }
      function read( text ) {
          let voiceline = new SpeechSynthesisUtterance( text );
          voiceline.rate = 0.8;
          voiceline.voice = voice;
          voiceline.onend = function( event ) {
              console.log( `Had fun in ${event.elapsedTime} seconds.` );
              if ( lines.length > 0 ) {
                  read( lines.shift() );
              };
          };
          window.speechSynthesis.speak( voiceline );
      }
      function takeSententences() {
          for (let elem of Array.from(document.querySelectorAll('.answer-box .sentence, .used-in .jp')).slice(0, 2)) {
              let words = [];
              for (let node of Array.from(elem.childNodes)) {
                  if (node.nodeType === Node.TEXT_NODE) {
                      words.push( node.textContent );
                  } else if ( node.tagName === 'RUBY' ) {
                      words.push( node.childNodes[ 0 ].textContent );
                  } else if ( node.tagName === 'SPAN' ) {
                      words.push( node.textContent );
                  }
              }
              lines.push( words.join( '' ) );
          }
      }
      function hideTranslation() {
          document.querySelector('#show-checkbox-examples').checked = true;
          for (let elem of Array.from(document.querySelectorAll('.used-in .en, .sentence-translation'))) {
              elem.style.color = '#222';
              elem.addEventListener('mouseover', function(event) {
                  event.target.style.color = 'darkgray';
              });
              elem.addEventListener('mouseout', function(event) {
                  event.target.style.color = '#222';
              });
          }
      }
      hideTranslation();
      let voiceReady = false;
      window.speechSynthesis.onvoiceschanged = function() {
        let voices = window.speechSynthesis.getVoices().filter( function( voice ) {
          return voice.lang == 'ja-JP';
        } );
        speakIn( voices[ 0 ] );
        voiceReady = true;
     };
     let word = '';
     setInterval(function() {
         let nv = document.querySelector('.answer-box a.plain').textContent;
         if ( nv !== word && voiceReady ) {
             word = nv;
             takeSententences();
             setTimeout(() => read( lines.shift() ), 750);
         }
     }, 250);
})();