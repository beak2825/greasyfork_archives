// ==UserScript==
// @name        gofullscreen
// @name:de     gofullscreen
// @description fix missing button for full screen mode at html5 videos
// @description:de Fehlende Vollbild-Modus Schaltfläche reparieren
// @namespace   gnblizz
// @include     *
// @version     1.01
// @compatible  chrome
// @compatible  firefox
// @grant       none
// @icon        data:image/gif;base64,R0lGODlhMAAwAKECAAAAAICAgP///////yH5BAEKAAMALAAAAAAwADAAAALQnI+py+0Po5y02ouz3rz7D4biBJTmiabqyrbuC8fyHAf2jedpzuOvAAwKh6mhUfg7Hks3gHLpehptwIBTioxig0zrdStIgrslMFA8pCKp1oAZjXW6w/Mt/Nl2t8HeFl7o5QZgBagEYyawNxhUl7h4dlelFlZG+QVY6aglmIjjuKd50xla9RKI0mSCqaPJSMM0aEK4mhfbpSnTabM4WXrShtpHI6gqKvmKnCwns0tm2lOsLP3aUy08aK0zvc3d7b09Ei4+Tl5ufo6err7O3n5QAAA7
// @downloadURL https://update.greasyfork.org/scripts/12887/gofullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/12887/gofullscreen.meta.js
// ==/UserScript==
(function(af) {
  var i = af.length;
  if(i) do {
    af[--i].setAttribute('allowfullscreen', 'true');
  } while(i);
}(document.querySelectorAll('iframe:not([allowfullscreen])')))
//public domain by gnblizz
//contact me with my user name + '@web.de'