// ==UserScript==
// @name         Better name changer by Provek (Credits to: Jaguar)
// @namespace    
// @version      1.0
// @description  Better name changer by Provek
// @author       Provek (original script by Jaguar)
// @match        
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474618/Better%20name%20changer%20by%20Provek%20%28Credits%20to%3A%20Jaguar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474618/Better%20name%20changer%20by%20Provek%20%28Credits%20to%3A%20Jaguar%29.meta.js
// ==/UserScript==
 let name = prompt ("What name would you like to have?")
const customUsername = name; // Custom Username
 
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
  const user = document.querySelector('.PlayerNameInfoNameClickable');
  if (user) {
    const username = user.textContent;
    observer(username);
    user.textContent = customUsername;
  } else {
    setTimeout(Check, 1);  // Loop if Not Found Since Retarded Loading times ✅😊🤣😂🤣❤❤❤🤣
  }
}
window.addEventListener("load", Check);