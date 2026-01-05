// ==UserScript==
// @name        Mangakoi Always Fullscreen
// @namespace   MangakoiAlwaysFullscreen
// @description Enlarge the current manga page when it loads.
// @include     http://*mangakoi.com/manga/*
// @version     1
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15772/Mangakoi%20Always%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/15772/Mangakoi%20Always%20Fullscreen.meta.js
// ==/UserScript==

if (window.top != window.self)  //-- Don't run on frames or iframes.
    return;

function scriptMain () {
  var enable = localStorage.getItem("autoFullEnable") == "1";

  if (enable)
    enlarge();

  var input = document.createElement('a');
  input.innerHTML = 'Turn auto Fullscreen ';
  if (enable) {
    input.innerHTML += 'On';
  } 
  else {
    input.innerHTML += 'Off';
  }

  input.setAttribute('class', 'btn-three');
  input.setAttribute('id', 'toggleFullscreenBtn');
  //input.addEventListener('click',toggleAlwayFullscreen,false);
  input.onclick = function toggleAlwayFullscreen() {
      var en = localStorage.getItem("autoFullEnable") != "1";
      if(en)
        localStorage.setItem('autoFullEnable', "1");
      else
        localStorage.setItem('autoFullEnable', "0");

      var btn = document.getElementById('toggleFullscreenBtn');
      btn.innerHTML = 'Turn auto Fullscreen ';
      if (en) {
        btn.innerHTML += 'On';
      } 
      else {
        btn.innerHTML += 'Off';
      }
    };
  var buttonsBar = document.getElementsByClassName('mobile-none left') [0];
  buttonsBar.appendChild(input);
}

window.addEventListener ("load", scriptMainLoader, false);

function scriptMainLoader () {
    addJS_Node (null, null, scriptMain);
}

// From : http://stackoverflow.com/questions/10958386/simple-alternative-to-greasemonkey
function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}


