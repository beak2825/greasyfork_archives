// ==UserScript==
// @name         X Reply and Repost Deleter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Deletes your replies and undoes reposts on X's /with_replies page. Run on x.com/yourusername/with_replies. Resumes after page reloads. Follow X's ToS.
// @author       You
// @match        https://x.com/*/with_replies
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/542112/X%20Reply%20and%20Repost%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/542112/X%20Reply%20and%20Repost%20Deleter.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  // Function to wait for an element
  const waitForElement = (selector, context = document, timeout = 8000, retries = 3) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const tryFind = () => {
        const element = context.querySelector(selector);
        if (element && element.offsetParent !== null) {
          console.log(`Found element ${selector}: Visible = ${element.offsetParent !== null}`);
          return resolve(element);
        }
        if (attempts >= retries) return reject(new Error(`Timeout waiting for ${selector} after ${retries} attempts`));
        attempts++;
        const start = Date.now();
        const interval = setInterval(() => {
          const el = context.querySelector(selector);
          if (el && el.offsetParent !== null) {
            clearInterval(interval);
            resolve(el);
          } else if (Date.now() - start > timeout) {
            clearInterval(interval);
            tryFind();
          }
        }, 200);
      };
      tryFind();
    });
  };

  // Function to simulate a click
  const clickElement = async (element, description) => {
    if (!element) {
      console.error(`No ${description} found.`);
      return false;
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 500));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    console.log(`Clicked ${description}`);
    return true;
  };

  // Function to scroll and wait for new content
  const scrollAndWait = async () => {
    let lastHeight = document.body.scrollHeight;
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, 4000));
      const newHeight = document.body.scrollHeight;
      if (newHeight === lastHeight) break;
      lastHeight = newHeight;
      attempts++;
    }
    console.log("Finished scrolling. Waiting for items to load...");
    const initialCount = document.querySelectorAll('article[data-testid="tweet"]').length;
    await new Promise(resolve => setTimeout(resolve, 12000));
    const newCount = document.querySelectorAll('article[data-testid="tweet"]').length;
    console.log(`Items loaded: ${newCount} (was ${initialCount})`);
  };

  // Function to save progress
  const saveProgress = (batchCount, processedItems, isRunning) => {
    sessionStorage.setItem('xDeleterProgress', JSON.stringify({ batchCount, processedItems, isRunning }));
    console.log(`Saved progress: batch ${batchCount}, processed ${processedItems} items, running: ${isRunning}`);
  };

  // Function to load progress
  const loadProgress = () => {
    const progress = sessionStorage.getItem('xDeleterProgress');
    return progress ? JSON.parse(progress) : { batchCount: 0, processedItems: 0, isRunning: false };
  };

  // Function to process a single item (reply or repost)
  const processItem = async (article, index) => {
    try {
      const tweetText = article.querySelector('div[data-testid="tweetText"]')?.innerText || "No text available";
      const userLink = article.querySelector('a[href*="/"]')?.href || "Unknown user";
      console.log(`Item ${index + 1}: Processing item from ${userLink}: "${tweetText.slice(0, 50)}..."`);
      console.log(`Item ${index + 1}: Article HTML: ${article.outerHTML.slice(0, 200)}...`);

      article.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isRepost = !!article.querySelector('button[data-testid="unretweet"]');

      if (isRepost) {
        console.log(`Item ${index + 1}: Detected as repost. Undoing...`);
        const unretweetButton = article.querySelector('button[data-testid="unretweet"]');
        if (!await clickElement(unretweetButton, "'Unretweet' button")) return false;
        await new Promise(resolve => setTimeout(resolve, 1500));

        const menuItems = document.querySelectorAll('div[role="menuitem"]');
        let undoButton = null;
        for (const item of menuItems) {
          const spans = item.querySelectorAll('span');
          for (const span of spans) {
            if (span.innerText.toLowerCase().includes("undo")) {
              undoButton = item;
              break;
            }
          }
          if (undoButton) break;
        }
        if (!undoButton) {
          console.warn(`Item ${index + 1}: No 'Undo' option found. Menu HTML: ${document.querySelector('div[role="menu"]')?.outerHTML.slice(0, 200) || "No menu"}...`);
          return false;
        }
        if (!await clickElement(undoButton, "'Undo Repost' option")) return false;
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`Item ${index + 1}: Successfully undid repost.`);
        return true;
      } else {
        console.log(`Item ${index + 1}: Detected as reply/post. Deleting...`);
        const moreButtonSelector = 'button[data-testid="caret"]';
        let moreButton;
        try {
          moreButton = await waitForElement(moreButtonSelector, article, 8000, 3);
        } catch (error) {
          console.warn(`Item ${index + 1}: ${error.message}. Trying alternative selector...`);
          moreButton = article.querySelector('button[aria-label="More"]');
          console.log(`Item ${index + 1}: Alternative 'More' button: ${moreButton ? moreButton.outerHTML.slice(0, 200) : "Not found"}...`);
          if (!moreButton) return false;
        }
        if (!await clickElement(moreButton, "'More' button")) return false;
        await new Promise(resolve => setTimeout(resolve, 1500));

        const deleteButtonSelector = 'div[role="menuitem"]';
        const menuItems = document.querySelectorAll(deleteButtonSelector);
        let deleteButton = null;
        for (const item of menuItems) {
          const spans = item.querySelectorAll('span');
          for (const span of spans) {
            if (span.innerText.toLowerCase().includes("delete")) {
              deleteButton = item;
              break;
            }
          }
          if (deleteButton) break;
        }
        if (!deleteButton) {
          console.warn(`Item ${index + 1}: No 'Delete' option found. Menu HTML: ${document.querySelector('div[role="menu"]')?.outerHTML.slice(0, 200) || "No menu"}...`);
          return false;
        }
        if (!await clickElement(deleteButton, "'Delete' option")) return false;
        await new Promise(resolve => setTimeout(resolve, 3000));

        const modal = document.querySelector('div[class*="css-175oi2r"][class*="r-13qz1uu"]') || document.body;
        console.log(`Item ${index + 1}: Modal HTML: ${modal.outerHTML.slice(0, 200)}...`);

        const confirmButtonSelector = 'button[data-testid="confirmationSheetConfirm"]';
        const confirmButton = await waitForElement(confirmButtonSelector, document, 8000, 3);
        if (!await clickElement(confirmButton, "'Confirm Delete' button")) return false;
        console.log(`Item ${index + 1}: Successfully deleted.`);
        return true;
      }
    } catch (error) {
      console.error(`Item ${index + 1}: Error processing: ${error.message}`);
      return false;
    }
  };

  // Create control panel
  const createControlPanel = () => {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.zIndex = '10000';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #000';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.innerHTML = `
      <h3>X Reply and Repost Deleter</h3>
      <p>Status: <span id="deleterStatus">Stopped</span></p>
      <p>Processed: <span id="deleterProcessed">0</span> items in <span id="deleterBatch">0</span> batches</p>
      <button id="startDeleter">Start</button>
      <button id="stopDeleter" disabled>Stop</button>
      <p><small>Run on x.com/yourusername/with_replies. Follow X's ToS.</small></p>
    `;
    document.body.appendChild(panel);
    return panel;
  };

  // Main function
  const main = async () => {
    let { batchCount, processedItems = 0, isRunning } = loadProgress();
    let isStopped = !isRunning;
    const panel = createControlPanel();
    const status = panel.querySelector('#deleterStatus');
    const processedDisplay = panel.querySelector('#deleterProcessed');
    const batchDisplay = panel.querySelector('#deleterBatch');
    const startButton = panel.querySelector('#startDeleter');
    const stopButton = panel.querySelector('#stopDeleter');

    const updateUI = () => {
      status.textContent = isStopped ? 'Stopped' : 'Running';
      processedDisplay.textContent = processedItems;
      batchDisplay.textContent = batchCount;
      startButton.disabled = !isStopped;
      stopButton.disabled = isStopped;
    };
    updateUI();

    startButton.addEventListener('click', () => {
      isStopped = false;
      isRunning = true;
      saveProgress(batchCount, processedItems, isRunning);
      updateUI();
      runLoop();
    });

    stopButton.addEventListener('click', () => {
      isStopped = true;
      isRunning = false;
      saveProgress(batchCount, processedItems, isRunning);
      updateUI();
      console.log('Stopped by user.');
    });

    const runLoop = async () => {
      let consecutiveBatchFailures = 0;
      const maxConsecutiveBatchFailures = 3;
      let isReloading = false;

      window.addEventListener('beforeunload', () => {
        if (!isReloading) {
          saveProgress(batchCount, processedItems, isRunning);
          console.log('Page is refreshing. Progress saved.');
        }
      });

      while (!isStopped) {
        if (!window.location.href.includes('/with_replies')) {
          console.log('Not on /with_replies page. Stopping.');
          isStopped = true;
          isRunning = false;
          saveProgress(batchCount, processedItems, isRunning);
          updateUI();
          return;
        }

        console.log(`Batch ${batchCount + 1}: Waiting for DOM to stabilize...`);
        await new Promise(resolve => setTimeout(resolve, 3000));

        const username = window.location.pathname.split('/')[1];
        const items = Array.from(document.querySelectorAll('article[data-testid="tweet"]')).filter(article => {
          const userLink = article.querySelector('a[href*="/' + username + '"]');
          return userLink !== null;
        });

        if (!items.length) {
          console.log('No more items found. Attempting to load more...');
          await scrollAndWait();
          const newItems = Array.from(document.querySelectorAll('article[data-testid="tweet"]')).filter(article => {
            const userLink = article.querySelector('a[href*="/' + username + '"]');
            return userLink !== null;
          });
          if (!newItems.length) {
            console.log('No more items found after scrolling. Refreshing page...');
            isReloading = true;
            saveProgress(batchCount, processedItems, isRunning);
            location.reload();
            await new Promise(resolve => setTimeout(resolve, 5000));
            consecutiveBatchFailures++;
            if (consecutiveBatchFailures >= maxConsecutiveBatchFailures) {
              console.log('Too many consecutive batch failures. Exiting script.');
              isStopped = true;
              isRunning = false;
              saveProgress(batchCount, processedItems, isRunning);
              sessionStorage.removeItem('xDeleterProgress');
              updateUI();
              return;
            }
            continue;
          }
          items.push(...newItems);
        } else {
          consecutiveBatchFailures = 0;
        }

        console.log(`Batch ${batchCount + 1}: Found ${items.length} items on this page.`);
        let batchFailures = 0;
        const maxBatchFailures = 3;
        const batchTimeout = 60000;
        const batchStart = Date.now();

        for (const [index, item] of items.entries()) {
          if (isStopped) break;
          if (Date.now() - batchStart > batchTimeout) {
            console.log(`Batch ${batchCount + 1}: Timeout reached. Refreshing page...`);
            isReloading = true;
            saveProgress(batchCount, processedItems, isRunning);
            location.reload();
            await new Promise(resolve => setTimeout(resolve, 5000));
            break;
          }
          if (await processItem(item, index)) {
            batchFailures = 0;
            processedItems++;
            saveProgress(batchCount, processedItems, isRunning);
            updateUI();
          } else {
            batchFailures++;
            if (batchFailures >= maxBatchFailures) {
              console.log(`Batch ${batchCount + 1}: Too many failures (${batchFailures}). Refreshing page...`);
              isReloading = true;
              saveProgress(batchCount, processedItems, isRunning);
              location.reload();
              await new Promise(resolve => setTimeout(resolve, 5000));
              break;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 1000));
        }

        if (isStopped) break;
        batchCount++;
        saveProgress(batchCount, processedItems, isRunning);
        updateUI();
        console.log(`Batch ${batchCount}: Finished processing visible items. Scrolling to load more...`);
        await scrollAndWait();
      }

      console.log(`Script completed. Processed ${processedItems} items across ${batchCount} batches.`);
      sessionStorage.removeItem('xDeleterProgress');
      updateUI();
    };

    // Auto-start if was running before refresh
    if (isRunning) {
      console.log('Resuming from previous session...');
      runLoop();
    }
  };

  // Initialize
  main();
})();