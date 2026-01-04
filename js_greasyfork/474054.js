// ==UserScript==
// @name         Voxiom Name Changer with Element Check
// @namespace    https://discord.gg/4T6HGWTBd7
// @version      6.0
// @description  Name Changer
// @author       Jaguar
// @match        https://voxiom.io/*
// @icon         https://cdn.discordapp.com/icons/1140361748747141203/7234c7dfb6b45cb72a80b44a2303a342.png?size=1024https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474054/Voxiom%20Name%20Changer%20with%20Element%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/474054/Voxiom%20Name%20Changer%20with%20Element%20Check.meta.js
// ==/UserScript==

const customUsername = "Jaguar"; // Custom Username

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
  const user = document.querySelector('.sc-lbhJGD.fYyclM');
  if (user) {
    const username = user.textContent;
    observer(username);
    user.textContent = customUsername;
  } else {
    setTimeout(Check, 1);  // Loop if Not Found Since Retarded Loading times ✅😊🤣😂🤣❤❤❤🤣
  }
}
window.addEventListener("load", Check);
