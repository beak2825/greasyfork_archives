// ==UserScript==
// @name     Duolingo Wordbank Toggle
// @version  1.0.1
// @description A Greasemonkey script that adds "Show Word Bank" to Duolingo to make copy and pasting easier.
// @license  Apache-2.0
// @grant    none
// @include  https://www.duolingo.com/*
// @namespace https://greasyfork.org/users/1456430
// @downloadURL https://update.greasyfork.org/scripts/532487/Duolingo%20Wordbank%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/532487/Duolingo%20Wordbank%20Toggle.meta.js
// ==/UserScript==

// Github:       https://github.com/YChiasma/Duolingo_Wordbank
// Greasyfork:   https://greasyfork.org/en/scripts/532487-duolingo-wordbank-toggle

var bodyObserver = new MutationObserver((bodyMutationList, bodyMutationObserver) => {
  var rootDiv = document.getElementById("root");
  
  if(null != rootDiv) {
    bodyMutationObserver.disconnect();
    var rootDivObserver = new MutationObserver((rootDivMutationList, rootDivMutationObserver) => {
      var wordBank = document.querySelector("[data-test='word-bank']");
      
      if(null != wordBank) {
        var overlay = document.getElementById('gm-collapsible-overlay');
        
        if(null == overlay) {
          main();
        }
        else {
          updateWordBank();
        }
      }
    });
    rootDivObserver.observe(rootDiv, {childList: true, subtree: true});
  }
});
bodyObserver.observe(document.body, {childList: true, subtree: true});

function updateWordBank() {
  var wordBankText = Array.from(document.querySelector("[data-test='word-bank']").children).map(x => x.textContent).join(", ");
  
  overlay = document.getElementById('gm-collapsible-overlay');
  overlay.innerHTML = wordBankText;
}

function main() {
  var wordBankText = Array.from(document.querySelector("[data-test='word-bank']").children).map(x => x.textContent).join(", ");
  
  // Create and inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #gm-overlay-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10001;
      background: #333;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 0.5rem;
      font-size: 14px;
    }
    #gm-collapsible-overlay {
      position: fixed;
      top: 3.5rem;
      right: 1rem;
      width: 250px;
      max-height: 400px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      overflow: auto;
      padding: 1rem;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'gm-overlay-toggle';
  toggleBtn.textContent = 'Show Word Bank';
  document.body.appendChild(toggleBtn);

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'gm-collapsible-overlay';
  overlay.innerHTML = wordBankText;
  document.body.appendChild(overlay);

  // Toggle logic
  toggleBtn.addEventListener('click', () => {
    const isHidden = overlay.style.display === 'none' || overlay.style.display === '';
    overlay.style.display = isHidden ? 'block' : 'none';
  });
}

main();

