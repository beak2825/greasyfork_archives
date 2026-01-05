// ==UserScript==
// @name        sound link fix
// @namespace   gnblizz
// @description Prevents the default action for linked .wav/.mp3 files. Inplace playback using HTML5 instead.
// @include     *
// @version     1.02
// @grant       none
// @icon        data:image/gif;base64,R0lGODlhEAAQAKECAAAAAAD//////////yH5BAEKAAIALAAAAAAQABAAAAItlI+pi+GcXIAGCEmBxXfpiz2IZoHSQ5LHKaXfegpu2Uyyq9jjS1V0z+vJhIkCADs=
// @downloadURL https://update.greasyfork.org/scripts/11405/sound%20link%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11405/sound%20link%20fix.meta.js
// ==/UserScript==
// sample page  http://japanese.about.com/od/japanesevocabulary/a/expression.htm
var i = document.links.length;
if(i) do {
  var link = document.links[--i];
  if(/\.(mp3|ogg|wav)$/i.test(link.href))
    link.addEventListener('click', WavFixOnClickHandler);
} while(i);
function WavFixOnClickHandler(event) {
  function CleanUp() { wrp.parentNode.removeChild(wrp); wrp = ctrl = null; };
  event.preventDefault();
  var node = event.currentTarget, wrp = document.createElement('span'), ref = node.getAttribute('href');
  wrp.setAttribute('style', 'position:relative;');
  wrp.innerHTML = '<audio controls autoplay><source src="' + ref + '" type="audio/' + ref.slice(-3).replace('mp3','mpeg') + '"></audio>';
  var ctrl = wrp.firstChild;
  ctrl.style.display = 'none';
  ctrl.onended = CleanUp;
  ctrl.lastChild.onerror = function() { alert('There was a technical problem.\n\nPlease try an option from the\ncontext menu of this link instead'); CleanUp(); };
  ctrl.onloadedmetadata = function(event) {
    if(ctrl.duration > 15) {
      var btn = document.createElement('BUTTON');
      btn.type = 'button';
      btn.textContent = 'stop this noise';
      btn.style = 'position:absolute;top:-8px;left:8px';
      wrp.appendChild(btn);
      btn.onclick = function() { ctrl.pause(); CleanUp(); };
    }
  }
  node.parentNode.insertBefore(wrp, node);
  return false;
}
// public domain by gnblizz
// contact me with my username + '@web.de'