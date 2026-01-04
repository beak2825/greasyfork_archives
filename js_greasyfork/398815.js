// ==UserScript==
// @name         Youtube Antipause (Observer Js api)
// @description  Plays the video 
// @include      *://*.youtube.com/*
// @version      1.03
// @namespace https://greasyfork.org/users/410526
// @downloadURL https://update.greasyfork.org/scripts/398815/Youtube%20Antipause%20%28Observer%20Js%20api%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398815/Youtube%20Antipause%20%28Observer%20Js%20api%29.meta.js
// ==/UserScript==
(
  function() {
    'use strict';
    let movie_player_div = document.getElementById('movie_player');
    let buttons=['confirm-button','action-button'];

    function observe_class_changes(mutationsList) {
      mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class' && movie_player_div.classList.contains('paused-mode')) {
          for (const button in buttons) {
            if (document.getElementById(buttons[button]).offsetParent !== null) {
              document.getElementById(buttons[button]).click();
              movie_player_div.playVideo();
            }
          }
        }
      })
    };
    let mutationObserver = new MutationObserver(observe_class_changes);
    mutationObserver.observe(
      movie_player_div, {
        attributes: true
      }
    );
  })();