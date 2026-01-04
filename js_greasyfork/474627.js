// ==UserScript==
// @name         Torn OC travel block
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block travel when an organized crime is ready to be initiated
// @author       You
// @match        *://*.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474627/Torn%20OC%20travel%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/474627/Torn%20OC%20travel%20block.meta.js
// ==/UserScript==

GM_addStyle(`
.dialogBox {
    position: relative;
    z-index: 9999999;
    opacity: 1;
    max-width: 90%;
    overflow: hidden;
    width: 235px;
    background: rgba(0,0,0,0) linear-gradient(180deg,rgba(0,0,0,.302),rgba(0,0,0,.102)) 0 0 no-repeat padding-box;
    border: 1px solid #444;
    border-radius: 5px;
    box-shadow: 0 1px 2px #000;
}
.coloredBox {
    background-color: lightgrey;
    opacity: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    max-height: 400px;
    min-height: 80px;
    padding: 10px;
}
.dark-mode .coloredBox {
    background-color: grey;
}

.dark-mode .coloredBox .titleThing {
    color: #94d82d;
}
.coloredBox .titleThing {
    color: #698c00;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
}

.dialogButtonDiv {
    text-align: center;
    color: var(--user-status-red-color);
}

[class*="modal_"][class*="defender_"] > [class*="dialog_"] {
    position: absolute;
}

.dialogBox .XButton {
    position: absolute;
    right: 0;
    padding: 5px;
    cursor: pointer;
}
.dialogBox .XButton:hover {
    opacity: 0.6;
}

`);

const apiKey = 'YOUR_API_KEY_HERE';
const apiUrl = `https://api.torn.com/user/?selections=crimes&key=${apiKey}`;

const dialogBoxHtml = `
  <div id="BlockTravelBox">
    <span id="closeBtn">✕</span>
    <div>
      <p>An organized crime is ready to be initiated. Do you still want to travel?</p>
    </div>
    <button id="proceedBtn">Proceed Anyway</button>
  </div>
`;

const travelObserver = new MutationObserver(async function(mutations) {
  const travelModel = document.querySelector('[class*="travelModel"]');
  if (travelModel && !document.getElementById("BlockTravelBox")) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.crimes && data.crimes.organized) {
      // Check if an organized crime is ready to be initiated
      if (data.crimes.organized.ready) {
        travelObserver.disconnect();
        travelModel.prepend(dialogBoxHtml);
        document.getElementById('closeBtn').addEventListener('click', function() {
          document.getElementById('BlockTravelBox').remove();
        });
        document.getElementById('proceedBtn').addEventListener('click', function() {
          document.getElementById('BlockTravelBox').remove();
          // Reconnect the observer
          travelObserver.observe(document, { childList: true, subtree: true });
        });
      }
    }
  }
});

(function() {
  'use strict';
  travelObserver.observe(document, { childList: true, subtree: true });
})();
