// ==UserScript==
// @name     		 Auto Ghost Trader
// @namespace    torn.autoghosttrader
// @version  		 1.1.0
// @description  Automates Ghost Trading in Torn City
// @author   		 AndersAngstrom [3690608]
// @license  		 Private to AndersAngstrom [3690608] – cannot be used or duplicated in any form
// @icon     		 https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match    		 https://www.torn.com/*
// @grant    		 none
// @run-at   		 document-end
// @downloadURL https://update.greasyfork.org/scripts/535556/Auto%20Ghost%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/535556/Auto%20Ghost%20Trader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    userID: 3690608, // 🔁 Replace this with the actual user ID to trade with
    storageKey: 'ghostTradeAmount',
    defaultDescription: 'Auto Ghost Trade',
    maxWaitTime: 10000, // 10 seconds
    uiStyles: {
      container: {
        marginTop: '10px',
        padding: '12.5px',
        background: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      },
      input: {
        padding: '5px',
        width: '90%',
        marginBottom: '5px'
      },
      button: {
        padding: '6px 12px',
        background: '#5cb85c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }
  };

  // DOM Helper functions
  const DOM = {
    walletObservers: [],
    
    getWalletAmount: () => {
      const walletSpan = document.getElementById('user-money');
      return walletSpan ? parseInt(walletSpan.getAttribute('data-money'), 10) : 0;
    },
    
    // Setup an observer to watch for wallet balance changes
    observeWalletChanges: (callback) => {
      const walletSpan = document.getElementById('user-money');
      if (!walletSpan) return false;
      
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-money') {
            const newAmount = parseInt(walletSpan.getAttribute('data-money'), 10);
            callback(newAmount);
          }
        }
      });
      
      observer.observe(walletSpan, { attributes: true });
      DOM.walletObservers.push(observer);
      return observer;
    },
    
    // Clean up observers when needed
    disconnectWalletObservers: () => {
      DOM.walletObservers.forEach(observer => observer.disconnect());
      DOM.walletObservers = [];
    },
    
    waitForElement: (selector, timeout = CONFIG.maxWaitTime) => {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
          const el = document.querySelector(selector);
          if (el) {
            observer.disconnect();
            resolve(el);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout: ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    },
    
    createElement: (tag, styles = {}, attributes = {}) => {
      const element = document.createElement(tag);
      Object.assign(element.style, styles);
      Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
      });
      return element;
    }
  };

  // Trade logic functions
  const Trade = {
    start: async (amount) => {
      try {
        window.location.href = `https://www.torn.com/trade.php#step=start&userID=${CONFIG.userID};`;
        
        // Wait for redirect and check if trade exists
        setTimeout(async () => {
          try {
            await DOM.waitForElement('ul.trades-cont.current');
            const description = document.querySelector('ul.trades-cont.current')?.innerText;

            if (description?.includes(`Description: ${CONFIG.defaultDescription}`)) {
              const viewLink = document.querySelector('ul.trades-cont.current a[href*="trade.php#step=view&ID="]');
              if (viewLink) {
                console.log('Existing trade found. Opening it.');
                viewLink.click();
                Trade.waitForAddMoneyButton(amount);
                return;
              }
            }

            console.log('No matching trade found. Creating new trade.');
            Trade.fillAndSubmit(amount);
          } catch (e) {
            console.log('Error checking for existing trade. Creating new one.', e);
            Trade.fillAndSubmit(amount);
          }
        }, 1000);
      } catch (e) {
        console.error('Failed to start trade:', e);
      }
    },

    fillAndSubmit: (amount = 0) => {
      const checkAndSubmit = () => {
        const textarea = document.getElementById("description");
        const button = document.querySelector("input[type='submit'].torn-btn");

        if (textarea && button) {
          textarea.value = CONFIG.defaultDescription;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));

          if (button.disabled) {
            button.disabled = false;
            button.dispatchEvent(new Event("change", { bubbles: true }));
          }

          button.click();
          Trade.waitForAddMoneyButton(amount);
        } else {
          setTimeout(checkAndSubmit, 500);
        }
      };
      
      setTimeout(checkAndSubmit, 500);
    },

    waitForAddMoneyButton: (amount = 0) => {
      DOM.waitForElement('a[aria-label*="Add money to trade"]')
        .then(btn => {
          btn.click();
          setTimeout(() => Trade.fillAndConfirmMoney(amount), 500);
        })
        .catch(() => {
          console.log('Add money button not found, retrying...');
          setTimeout(() => Trade.waitForAddMoneyButton(amount), 500);
        });
    },

    fillAndConfirmMoney: (amount) => {
      const updateAndConfirm = () => {
        const moneyInput = document.querySelector('input.input-money');
        const confirmBtn = document.querySelector('input[type="submit"].torn-btn');

        if (moneyInput && confirmBtn) {
          // Parse current amount and add new amount
          const currentAmount = parseInt(moneyInput.value.replace(/[^\d]/g, ''), 10) || 0;
          const newAmount = currentAmount + amount;
          
          // Update the input field
          moneyInput.value = newAmount;
          moneyInput.dispatchEvent(new Event('input', { bubbles: true }));
          moneyInput.dispatchEvent(new Event('change', { bubbles: true }));

          // Enable and click the confirm button
          confirmBtn.disabled = false;
          confirmBtn.classList.remove("disabled");
          confirmBtn.click();
          
          // Clear storage after successful trade
          sessionStorage.removeItem(CONFIG.storageKey);
        } else {
          setTimeout(updateAndConfirm, 500);
        }
      };
      
      setTimeout(updateAndConfirm, 500);
    }
  };

  // UI functions
  const UI = {
    addGhostTradeUI: () => {
      const pointsDiv = document.querySelector('.points___UO9AU');
      if (!pointsDiv) return setTimeout(UI.addGhostTradeUI, 500);

      let walletAmount = DOM.getWalletAmount();
      
      // Create container
      const container = DOM.createElement('div', CONFIG.uiStyles.container);
      
      // Create input element
      const input = DOM.createElement('input', CONFIG.uiStyles.input, {
        type: 'text', // Changed to text to allow percentage input
        placeholder: 'Enter amount',
        min: 0
      });
      
      // Function to update UI when wallet changes
      const updateWalletUI = (newAmount) => {
        walletAmount = newAmount;
        
        // If current input is a percentage, no need to adjust
        // If it's a number and exceeds new wallet amount, adjust it
        const currentValue = input.value.trim();
        if (currentValue && !currentValue.includes('%')) {
          const numValue = parseInt(currentValue, 10);
          if (!isNaN(numValue) && numValue > walletAmount) {
            input.value = walletAmount;
          }
        }
      };
      
      // Setup wallet change observer
      DOM.observeWalletChanges(updateWalletUI);
      
      // Function to parse input value (handles empty, number, or percentage)
      const parseInputValue = (inputValue) => {
        if (!inputValue) {
          // Empty input = max amount
          return walletAmount;
        }
        
        // Check if it's a percentage
        if (inputValue.includes('%')) {
          const percentStr = inputValue.replace('%', '').trim();
          const percent = parseFloat(percentStr);
          if (!isNaN(percent)) {
            return Math.floor(walletAmount * (percent / 100));
          }
        }
        
        // Regular number input
        const amount = parseInt(inputValue, 10);
        return !isNaN(amount) ? Math.min(amount, walletAmount) : 0;
      };
      
      // Add input validation and parsing
      input.addEventListener('input', function() {
        const inputValue = input.value.trim();
        
        // Skip validation for empty input or percentage
        if (!inputValue || inputValue.includes('%')) {
          return;
        }
        
        // Number validation
        const numValue = parseInt(inputValue, 10);
        if (!isNaN(numValue) && numValue > walletAmount) {
          input.value = walletAmount;
        }
      });
      
      // Create trade button
      const tradeButton = DOM.createElement('button', CONFIG.uiStyles.button, {
        textContent: 'Ghost Trade'
      });
      
      // Add click handler
      tradeButton.addEventListener('click', () => {
        // Get the latest wallet amount
        const currentWalletAmount = DOM.getWalletAmount();
        const amount = parseInputValue(input.value.trim());
        
        if (amount > 0) {
          sessionStorage.setItem(CONFIG.storageKey, amount);
          //window.location.href = `https://www.torn.com/trade.php?reload=${Date.now()}#step=start&userID=${CONFIG.userID};`;
          const isDirectTradePageLoad = window.location.href.includes(`trade.php`);
          if (isDirectTradePageLoad) {
            window.location.href = `https://www.torn.com/trade.php?reload=${Date.now()}#step=start&userID=${CONFIG.userID}`;
          } else {
            window.location.href = `https://www.torn.com/trade.php#step=start&userID=${CONFIG.userID}`;
          }
          
        } else {
          alert('Please enter a valid amount greater than 0');
        }
      });

      // Assemble and add to page
      container.appendChild(input);
      container.appendChild(tradeButton);
      pointsDiv.parentNode.insertBefore(container, pointsDiv.nextSibling);
    }
  };

  // Initialize the script
  function init() {
    // If we're on a trade page that has our userID in the URL, check if it's a direct load
    //const isDirectTradePageLoad = window.location.href.includes(`trade.php`);
    
    // Check for stored amount or direct load
    const storedAmount = sessionStorage.getItem(CONFIG.storageKey);
    
    if (storedAmount) {
      // Handle stored amount case (from another page)
      Trade.start(parseInt(storedAmount, 10));
    } //else if (isDirectTradePageLoad) {
      // Handle direct load to trade page with our userID
      // Delay slightly to ensure page is fully loaded
      //setTimeout(() => {
        //const walletAmount = DOM.getWalletAmount();
        //if (walletAmount > 0) {
          //Trade.fillAndSubmit(0); // Just create the trade without adding money yet
        //}
      //}, 1000);
    //}
    
    // Add UI to page if we're not on a trade page or if we're waiting for a trade to finish
    if (!window.location.href.includes('trade.php') || (window.location.href.includes('trade.php') && !document.querySelector('ul.trades-cont.current'))) {
      UI.addGhostTradeUI();
    }
    
    // Clean up when navigating away from page
    window.addEventListener('beforeunload', () => {
      DOM.disconnectWalletObservers();
    });
  }

  // Start the script, but ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
