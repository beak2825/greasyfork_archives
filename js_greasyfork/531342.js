// ==UserScript==
// @name         Autohides playerlist on bullseye and add toggle icon to show it.
// @version      v0.3
// @description  Click eye to show/hide bullseye playerlist(auto hidden by default)
// @author       trausi
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      none
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1452061
// @downloadURL https://update.greasyfork.org/scripts/531342/Autohides%20playerlist%20on%20bullseye%20and%20add%20toggle%20icon%20to%20show%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/531342/Autohides%20playerlist%20on%20bullseye%20and%20add%20toggle%20icon%20to%20show%20it.meta.js
// ==/UserScript==

const autohidden = true;
let sentinel = false;

const targetClass = ".slanted-wrapper_root__XmLse";
const playerlistClass = ".game-panorama_playerList__tITUA";

async function main() {
  if (sentinel) {
    return;
  }
  sentinel = true

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '👁'; // tiny eye emoji or you can use "≡" or "P"
  toggleBtn.title = 'Toggle Player List';


  Object.assign(toggleBtn.style, {
    position: 'absolute',
    top: '6px',
    right: '6px',
    padding: '2px 6px',
    fontSize: '12px',
    border: 'none',
    borderRadius: '4px',
    background: '#5b3b9d',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 9999,
    opacity: 0.8
  });

  toggleBtn.addEventListener('mouseenter', () => {
    toggleBtn.style.opacity = 1;
  });
  toggleBtn.addEventListener('mouseleave', () => {
    toggleBtn.style.opacity = 0.8;
  });

  toggleBtn.addEventListener('click', () => {
    const playerList = document.querySelector(playerlistClass);
    if (playerList) {
      playerList.style.display = (playerList.style.display === 'none') ? '' : 'none';
    }
  });

  const targetDiv = document.querySelector(targetClass);
  if (targetDiv) {
    targetDiv.prepend(toggleBtn);
  }
  if (autohidden) {
    const playerList = document.querySelector(playerlistClass);
    if (playerList) {
      playerList.style.display = (playerList.style.display === 'none') ? '' : 'none';
    }
  }
  console.log("He1111re");
}



new MutationObserver((mutations) => {

  if (!document.querySelector(playerlistClass)) {
    sentinel = false;
    return;
  }
  main();
}).observe(document.body, { subtree: true, childList: true });