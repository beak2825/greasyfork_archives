// ==UserScript==
// @name         Twitter Auto-Blocker (With Counter)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto-blocks users on Twitter.com with a START/STOP button and an accurate visual counter.
// @author       Rue
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493300/Twitter%20Auto-Blocker%20%28With%20Counter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493300/Twitter%20Auto-Blocker%20%28With%20Counter%29.meta.js
// ==/UserScript==

(async () => {
  // Configuration
  const maxBlocks = 500;
  const delayRange = [100, 200]; // Random delay range in milliseconds
  const clickDelayRange = [20, 40]; // Random click delay range in milliseconds

  // Variables
  let totalBlocked = 0;
  let isRunning = false;

  // UI Elements
  const counterElement = document.createElement('div');
  counterElement.style.position = 'fixed';
  counterElement.style.top = '10px';
  counterElement.style.right = '10px';
  counterElement.style.backgroundColor = 'white';
  counterElement.style.padding = '20px';
  counterElement.style.borderRadius = '5px';
  counterElement.style.fontSize = '36px';
  counterElement.style.fontWeight = 'bold';
  counterElement.style.color = 'red';
  counterElement.textContent = `Blocked: ${totalBlocked}`;
  document.body.appendChild(counterElement);

  const startStopButton = document.createElement('button');
  startStopButton.style.position = 'fixed';
  startStopButton.style.top = '80px';
  startStopButton.style.left = '10px';
  startStopButton.style.backgroundColor = 'green';
  startStopButton.style.color = 'white';
  startStopButton.style.padding = '10px';
  startStopButton.style.borderRadius = '5px';
  startStopButton.style.fontSize = '18px';
  startStopButton.textContent = 'Start';
  startStopButton.addEventListener('click', () => {
    isRunning = !isRunning;
    startStopButton.textContent = isRunning ? 'Stop' : 'Start';
    if (isRunning) {
      autoBlockUsers();
    } else {
      alert(`Stopped auto-blocking. ${totalBlocked} users blocked.`);
    }
  });
  document.body.appendChild(startStopButton);

  // Functions
  async function delay(ms) {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, Math.floor(ms + Math.random() * (delayRange[1] - delayRange[0])));
    });
  }

  async function scrollDown() {
    await new Promise(resolve => {
      let start = performance.now();
      let scrollInterval = setInterval(() => {
        let timePassed = performance.now() - start;
        if (timePassed > 1000) {
          clearInterval(scrollInterval);
          resolve();
        } else {
          window.scrollBy(0, 9 + Math.floor(Math.random() * 3));
        }
      }, 10);
    });
  }

  async function autoBlockUsers() {
    while (isRunning && totalBlocked < maxBlocks) {
      let users = document.querySelectorAll('div[data-testid="UserCell"]');
      let count = users.length;
      let blockedCount = 0;
      for (let user of users) {
        if (user.querySelector('div[data-testid$="-unblock"]')) continue;
        user.click();
        await delay(clickDelayRange[0] + Math.random() * (clickDelayRange[1] - clickDelayRange[0]));
        let unblockConfirmation = document.querySelector("[data-testid=userActions]");
        if (!unblockConfirmation) continue;
        unblockConfirmation.click();
        await delay(clickDelayRange[0] + Math.random() * (clickDelayRange[1] - clickDelayRange[0]));
        let blockButton = document.querySelector("[data-testid=block]");
        if (blockButton) {
          blockButton.click();
          await delay(clickDelayRange[0] + Math.random() * (clickDelayRange[1] - clickDelayRange[0]));
          let confirmButton = document.querySelector("[data-testid=confirmationSheetConfirm]");
          if (confirmButton) {
            confirmButton.click();
            await delay(clickDelayRange[0] + Math.random() * (clickDelayRange[1] - clickDelayRange[0]));
            let backButton = document.querySelector("[data-testid=app-bar-back]");
            if (backButton) {
              backButton.click();
              await delay(clickDelayRange[0] + Math.random() * (clickDelayRange[1] - clickDelayRange[0]));
              blockedCount++; // Increment blocked count only if block was successful
            }
          }
        }
      }
      await scrollDown();
      console.log(`Blocked ${blockedCount} users. Total blocked: ${totalBlocked + blockedCount}`);
      totalBlocked += blockedCount;
      counterElement.textContent = `Blocked: ${totalBlocked}`;

      if (totalBlocked >= maxBlocks) {
        isRunning = false;
        startStopButton.textContent = 'Start';
        alert(`Maximum block limit of ${maxBlocks} reached.`);
      }
    }
  }
})();