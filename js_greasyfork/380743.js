// ==UserScript==
// @name         Freesound.org download without login (direct link, no login)
// @namespace    https://greasyfork.org/users/200700
// @version      1.0.0
// @description  Download from freesound.org without login; freesound no login
// @author       SuperOP535
// @match        *://freesound.org/people/*/sounds/*
// @grant        none
// @run-at       document-load
// @downloadURL https://update.greasyfork.org/scripts/380743/Freesoundorg%20download%20without%20login%20%28direct%20link%2C%20no%20login%29.user.js
// @updateURL https://update.greasyfork.org/scripts/380743/Freesoundorg%20download%20without%20login%20%28direct%20link%2C%20no%20login%29.meta.js
// ==/UserScript==

(function() {
  var ogg = document.getElementsByClassName('ogg_file')[0].href;
  var mp3 = document.getElementsByClassName('mp3_file')[0].href;
  var logdl = document.getElementById('download_login_button');

  if(logdl) {
    var filename = logdl.href.split('/').pop().split('.'); filename.pop(); filename = filename.join('.');
    var dl = document.getElementById('download');
    dl.removeChild(logdl);
    var MP3 = document.createElement('a');
    MP3.innerText = 'Download MP3';
    MP3.download = filename + '.mp3';
    MP3.href = mp3;
    MP3.style.float = 'right';
    dl.appendChild(MP3);
    var OGG = document.createElement('a');
    OGG.innerText = 'Download OGG';
    OGG.download = filename + '.ogg';
    OGG.href = ogg;
    dl.appendChild(OGG);
  }
})();