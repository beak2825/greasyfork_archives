// ==UserScript==
// @name         Save Unsent AI Prompts
// @namespace    Violent Monkey Scripts
// @version      1.0
// @description  Auto-save unsent AI prompts as drafts
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526320/Save%20Unsent%20AI%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/526320/Save%20Unsent%20AI%20Prompts.meta.js
// ==/UserScript==

/*
Doesn't it suck that chatgpt saves all your history unless you don't send it. There is no draft system in chatgpt.

This userscript will make it so you can dig for it in localStorage if you really need it.

Continued discussion about this userscript can be found here: https://goatmatrix.net/c/Userscripts/9sBaPCiRRE
*/

;(async function(){
 for await (let newTarget of targetDivs()) {
  applyHandler(newTarget);
 }
})();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
 }

 // Continuously looks for new #prompt-textarea divs
 async function* targetDivs() {
  let found = new Set();
  while(true) {
   let divs = document.querySelectorAll('#prompt-textarea');
   for(let div of divs) {
    if(!found.has(div)) {
     found.add(div);
     yield div;
    }
   }
   await timeout(500);
  }
 }

function shouldSaveDraft(oldVal, newVal) {
  // Save if text was added or replaced (not pure deletion).
  if (newVal.length > oldVal.length) return true;
  if (newVal.length === oldVal.length && newVal !== oldVal) return true;
  return false;
}

function saveDraft(id, text) {
 localStorage.setItem('draft-'+id, text);
}

function applyHandler(div) {
 let currentId = null;
 let oldValue = '';

 // Called whenever mutations occur
 function onDivMutate() {
  let newValue = div.innerHTML.trim();
  if (!newValue) {
   // If there's nothing left, reset
   currentId = null;
   oldValue = '';
   return;
  }
  // If we had no oldValue, this is the first time we're typing => new ID
  if (!oldValue || !currentId) {
   currentId = Date.now();
  }
  // Only save if something was added (newValue got longer than oldValue)
  if(shouldSaveDraft(oldValue,newValue)) {
   saveDraft(currentId,newValue);
  }
  // Update the known current content
  oldValue = newValue;
 }

 // Observe changes in the div (childList & characterData changes)
 let observer = new MutationObserver(onDivMutate);
 observer.observe(div, {childList: true, characterData: true, subtree: true});
}
