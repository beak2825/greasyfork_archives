// ==UserScript==
// @name         puffer player helpers
// @namespace    https://jinpark.net
// @version      0.1.4
// @description  helpers for puffin player (centers, enlarges player, auto unmute, shows muted state, space for mute/unmute)
// @author       Jin Park
// @match        https://puffer.stanford.edu/player/
// @icon         https://www.google.com/s2/favicons?domain=stanford.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429836/puffer%20player%20helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/429836/puffer%20player%20helpers.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    'use strict';

    document.body.insertAdjacentHTML('beforeend',
`<style>

.row .col-md-9.mt-3 {
  max-width: 100%;
  flex: 0 0 100%;
}

.container.py-4 {
  max-width: 100%
}

</style>`
)

    window.onload = (event) => {
        setTimeout(() => {
          goToPlayer();
          var bts = document.getElementsByClassName('list-group-item list-group-item-action');
          for (let bt of bts) {
            bt.addEventListener('click', () => {goToPlayer(); checkVolume();})
          };
        }, 1500);

        var img = document.createElement('img');
        img.src="https://puffer.stanford.edu/static/puffer/dist/images/volume-off.svg";
        img.id="muted-icon";
        img.style.cssText="position: absolute;top: 5%;right: 5%;display:none;transform:scale(2);";
        document.getElementById('tv-container').appendChild(img);

        document.addEventListener('keydown', (event) => {
          var name = event.key;
          var code = event.code;
          var v = document.getElementsByTagName('video')[0];
          var m = document.getElementById('mute-button');
          if (event.code == "Space") {
              event.preventDefault();
              m.click();
              checkVolume();
          }
        }, true);

    };


    function goToPlayer() {
        var v = document.getElementsByTagName('video')[0];
        var m = document.getElementById('mute-button');
        v.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        if (v.volume == 0) {
            m.click();
        }
    };

    function checkVolume() {
      var v = document.getElementsByTagName('video')[0];
      var i = document.getElementById('muted-icon');
      var m = document.getElementById('mute-button');
      if (v.volume == 0) {
          i.style.display = 'block';
      } else {
          i.style.display = 'none';
      }
    }
})();