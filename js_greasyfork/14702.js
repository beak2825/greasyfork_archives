// ==UserScript==
// @name        Webm Toggle Loop
// @namespace   com.jeddunk.webmtoggleloop
// @author      Jeddunk
// @description Creates a button which toggles looping on or off
// @match       *://*/*.webm*
// @match       *://*/*.mp4*
// @run-at      document-start
// @version     1.0.2.1
// @grant       none
// @locale      english
// @downloadURL https://update.greasyfork.org/scripts/14702/Webm%20Toggle%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/14702/Webm%20Toggle%20Loop.meta.js
// ==/UserScript==
(function () {
  var toggleValue = 'ON';
  var vids = document.getElementsByTagName('video');
  for (i = 0; i < vids.length; i++) vids[i].setAttribute('style','z-index: 9999');
  if (document.body.children.length != 1) return;
  var q = document.body.children[0];
  if (q.tagName != 'VIDEO') return;
  var o = q.cloneNode();
  var vidCont = document.createElement('div');
  vidCont.className = 'btnContainer';
  q.parentNode.appendChild(vidCont);
  var bt = document.createElement('input');
  bt.className = 'btnToggle';
  bt.type = 'button';
  bt.value = 'TOGGLE';
  bt.style.width = '100px';
  bt.addEventListener('click', function (e) {
    if (toggleValue == 'ON') {
      loopOff();
    } else {
      loopOn();
    }
  }, true);
  vidCont.appendChild(bt);
  function loopOn() {
    for (i = 0; i < vids.length; i++) {
      vids[i].setAttribute('loop', '');
      vids[i].play();
    }
    toggleValue = 'ON';
    bt.value = 'LOOP: ' + toggleValue;
  }
  function loopOff() {
    for (i = 0; i < vids.length; i++) vids[i].removeAttribute('loop');
    toggleValue = 'OFF';
    bt.value = 'LOOP: ' + toggleValue;
  }
  loopOff();
})();
