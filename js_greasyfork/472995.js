// ==UserScript==
// @name         Kirka.io Name and Level Changer
// @namespace    https://discord.gg/HbvVzhsHz
// @version      6.0
// @description   Menu and In game Lvl And Username/Level Changer
// @author       Jaguar
// @match        https://kirka.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472995/Kirkaio%20Name%20and%20Level%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/472995/Kirkaio%20Name%20and%20Level%20Changer.meta.js
// ==/UserScript==
//----------------------------------------------
// Discord: https://discord.gg/HbvVzhsHzj //
//----------------------------------------------

const customUsername = "Jaguar"; // Custom Username
const ClanTag = "i love voxiom" // Custom Clan
const Level = "420" // Custom Level




function replaceText(node, username) {
  const replacedText = node.textContent.replace(new RegExp(username, 'gi'), customUsername);
  node.textContent = replacedText;
}

function handleMutation(mutationsList, username) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const walker = document.createTreeWalker(mutation.target, NodeFilter.SHOW_TEXT, null, false);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.includes(username)) {
          replaceText(node, username);
        }
      }
    }
  }
}


function observer(username) {
  const observer = new MutationObserver(mutationsList => handleMutation(mutationsList, username));
  observer.observe(document.body, { childList: true, subtree: true });
}


function Check() {
  const user = document.querySelector('div[data-v-c5d917c8].nickname');
    if (user) {
    const username = user.textContent;
    observer(username);
    user.textContent = customUsername;
  } else {
    setTimeout(Check, 1); // Loop if Not Found Since  Loading times ✅😊🤣😂🤣❤❤❤🤣
  }
}
window.addEventListener("load", Check);

function LVLANDCLAN() {
  const levelsElement = document.querySelector('.levels');
  const clanTagElement = document.querySelector('.clan-tag');
  const levelValueElement = document.querySelector('.level-value');
  if (levelsElement) levelsElement.textContent = Level;
  if (clanTagElement) clanTagElement.textContent = ClanTag;
  if (levelValueElement) levelValueElement.textContent = Level;
}
setInterval(LVLANDCLAN, 1);


