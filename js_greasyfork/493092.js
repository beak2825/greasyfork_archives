// ==UserScript==
// @name        Anix.to windowed fullscreen and theater mode
// @namespace   https://github.com/irasnalida
// @match       https://anix.to/*
// @match       https://anixtv.to/*
// @icon        https://www.google.com/s2/favicons?domain=anix.to&sz=128
// @grant       none
// @version     2.5.5
// @author      irasnalida
// @description Add buttons for windowed fullscreen and theater mode
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493092/Anixto%20windowed%20fullscreen%20and%20theater%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/493092/Anixto%20windowed%20fullscreen%20and%20theater%20mode.meta.js
// ==/UserScript==

const config = {
  childList: true,
  subtree: false
};
const obs = new MutationObserver(callback);
function callback() {
  if (window.location.href.startsWith("https://anix.to/watch") || window.location.href.startsWith("https://anixtv.to/watch"))
    checkthenadd();
  else{
    const stel = document.getElementById('irslda-styleele');
    stel.remove();
  }
}

function runMutation() {
  const myInterval = setInterval(() => {
    //const el = document.querySelector(".ani-player-control-left>.skiptime");
    const el = document.querySelector("head");
    if (el) {
      clearInterval(myInterval);
      obs.observe(el, config);
      callback();
    }
  }, 500);
}
runMutation();

function checkthenadd() {
  const btn = document.getElementById('irslda-exbtn');
  if (!btn) { actualScript(); }
}

checkthenadd();

function actualScript() {
  document.querySelector(".skiptime.dropdown").style.order = "1";
  var isMode = 0;
  const expandStyle = `
body{overflow: hidden;}
#player > iframe {position: fixed;top: 0px;left: 0px;bottom: 0px;right: 0px;overflow: hidden;backdrop-filter: brightness(0);}
.sidebar,.wrapper > header,.btn-schedule-floating.schedule-toggler,.light.ani-player-control,.ani-season, #ani-episode, .alert-dismissible.alert-primary.alert{display: none !important;}
#ani-player-controls{width: 100%;height: fit-content;position: fixed;padding-block: 5px;top: 0px;left: 0px;opacity: 0;backdrop-filter: blur(22px) brightness(20%) contrast(80%) saturate(250%);transition: opacity 0.22s;}
#ani-player-controls:hover{opacity: 1;}
`;
  const theaterStyle = `
.sidebar{display: none !important;}
#ani-player-section{scroll-margin-top: 5px;}
`;
  const styleElement = document.createElement('style');
  styleElement.id = 'irslda-styleele'
  document.head.appendChild(styleElement);

  let player = document.getElementById('ani-player-section');

  //event listener for key press
  //key event does not work properly due to the iframe player
  document.addEventListener("keyup", function (event) {
    if (event.target === document.querySelector('input')) {
      return;
    }
    if (event.key === "`" || event.key === "Alt") {
      switchMode(2);
    }
    else if (event.key.toLowerCase() === "t") {
      switchMode(3);
    }
    else if (event.key.toLowerCase() === " ") {
      player.scrollIntoView({ behavior: 'smooth' });
    }
    else { }
  });
  //add new expand button in control list
  let playerControlLeft = document.querySelector('.ani-player-control-left');
  const expandBtn = document.createElement('div');
  expandBtn.id = 'irslda-exbtn';
  expandBtn.className = 'ani-player-control';
  expandBtn.innerHTML = "<i class=\"mdi mdi-arrow-expand-all\"></i> <span>Expand</span>";
  playerControlLeft.appendChild(expandBtn);
  expandBtn.addEventListener('click', function () {
    switchMode(2);
  });

  //add new theater button in control list
  const theaterBtn = document.createElement('div');
  theaterBtn.className = 'ani-player-control';
  theaterBtn.innerHTML = "<i class=\"mdi mdi-arrow-expand-horizontal\"></i> <span>Theater</span>";
  playerControlLeft.appendChild(theaterBtn);
  theaterBtn.addEventListener('click', function () {
    switchMode(3);
  });
    function switchMode(toMode) {
    if (isMode === toMode) {
      styleElement.innerHTML = ``;
      isMode = 0;
    }
    else {
      if (toMode === 2) {
        styleElement.innerHTML = expandStyle;
        isMode = 2;
      }
      else if (toMode === 3) {
        styleElement.innerHTML = theaterStyle;
        player.scrollIntoView({ behavior: 'smooth' });
        isMode = 3;
      }
    }
  }
}