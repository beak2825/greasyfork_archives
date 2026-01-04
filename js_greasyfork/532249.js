// ==UserScript==
// @name         Trade Chat Timer on Button for Chat 3.0
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Show a timer that shows the time left to post next message in trade chat with a sound notification
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/532249/Trade%20Chat%20Timer%20on%20Button%20for%20Chat%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/532249/Trade%20Chat%20Timer%20on%20Button%20for%20Chat%2030.meta.js
// ==/UserScript==

(() => {
    const STORAGE_KEY = 'tornTradeTimerEnd';
    const TIMER_DURATION = 62000;
    let svgEl = null, rectEl = null, pathLength = 0;
    let observer = null;
    let animFrameId = null;
  
    const createSVGElement = (type, attributes = {}) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type);
      Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
      return el;
    };
  
    const setupOverlay = (btn) => {
      const { width, height } = btn.getBoundingClientRect();
  
      if (!svgEl) {
        svgEl = createSVGElement('svg', {
          id: 'trade-timer-overlay',
          style: 'position:absolute;top:0;left:0;z-index:1000;pointer-events:none'
        });
  
        rectEl = createSVGElement('rect', {
          x: '1.5',
          y: '1.5',
          fill: 'none',
          'stroke-width': '3'
        });
  
        svgEl.appendChild(rectEl);
        btn.appendChild(svgEl);
      }
  
      Object.entries({ width, height }).forEach(([key, value]) => svgEl.setAttribute(key, value));
      Object.entries({ width: width - 3, height: height - 3 }).forEach(([key, value]) => rectEl.setAttribute(key, value));
  
      pathLength = 2 * (width + height - 6);
      rectEl.setAttribute('stroke-dasharray', pathLength);
    };
  
    const updateTimerVisual = (remainingMs) => {
      if (!rectEl) return;
  
      const isComplete = remainingMs <= 0;
      rectEl.setAttribute('stroke', isComplete ? 'green' : 'red');
      rectEl.setAttribute('stroke-dasharray', isComplete ? 'none' : pathLength);
  
      if (!isComplete) {
        const offset = pathLength * (1 - remainingMs / TIMER_DURATION);
        rectEl.setAttribute('stroke-dashoffset', offset);
      }
    };

    const playNotificationSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Audio notification not supported:', error);
      }
    };

    const cleanupTimer = (btn) => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (svgEl) {
        svgEl.remove();
        svgEl = null;
        rectEl = null;
      }
      if (btn) btn.style.border = '3px solid green';
      
      playNotificationSound();
      localStorage.removeItem(STORAGE_KEY);
    };

    const runTimer = async (btn) => {
      if (!btn) return;
  
      if (animFrameId) cancelAnimationFrame(animFrameId);
      
      btn.style.border = 'none';
      let timerCompleted = false;
  
      if (svgEl) {
        svgEl.remove();
        svgEl = null;
        rectEl = null;
      }
      setupOverlay(btn);
  
      const animate = () => {
        const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
        const remaining = endTime - Date.now();
  
        if (remaining <= 0 && !timerCompleted) {
          timerCompleted = true;
          cleanupTimer(btn);
        } else if (remaining > 0) {
          updateTimerVisual(remaining);
          animFrameId = requestAnimationFrame(animate);
        }
      };

      const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
      updateTimerVisual(endTime - Date.now());
      animFrameId = requestAnimationFrame(animate);
    };
  
    const startTimer = (btn) => {
      if (!btn) return;
      localStorage.setItem(STORAGE_KEY, Date.now() + TIMER_DURATION);
      runTimer(btn);
    };

    const waitForMessageSend = (textarea) => {
      return new Promise((resolve) => {
        const originalValue = textarea.value.trim();
        if (!originalValue) {
          resolve(false);
          return;
        }

        const checkCleared = () => {
          if (!textarea.value.trim()) {
            resolve(true);
          }
        };

        setTimeout(checkCleared, 100);
        
        const inputHandler = () => {
          if (!textarea.value.trim()) {
            textarea.removeEventListener('input', inputHandler);
            resolve(true);
          }
        };
        textarea.addEventListener('input', inputHandler);
        
        setTimeout(() => {
          textarea.removeEventListener('input', inputHandler);
          resolve(false);
        }, 1000);
      });
    };

    const getTradeChat = () => {
      const chatContainers = document.querySelectorAll('[id*="public_trade"], [class*="root___"]:has([class*="title___"])');
      
      for (const container of chatContainers) {
        const titleElement = container.querySelector('[class*="title___"]');
        if (titleElement && titleElement.textContent.trim() === 'Trade') {
          return container;
        }
      }
      
      return document.getElementById('public_trade') || document.querySelector('[id*="public_trade"]');
    };

    const isTradeChat = (element) => {
      const tradeChat = getTradeChat();
      if (!tradeChat) return false;
      return tradeChat.contains(element);
    };
  
    const initializeTradeButton = (tradeBtn) => {
      if (!tradeBtn || tradeBtn._timerInitialized) return;
  
      if (getComputedStyle(tradeBtn).position === 'static') {
        tradeBtn.style.position = 'relative';
      }
  
      const stored = parseInt(localStorage.getItem(STORAGE_KEY));
      stored && stored > Date.now() ? runTimer(tradeBtn) : (tradeBtn.style.border = '3px solid green');
      
      tradeBtn._timerInitialized = true;
    };

    const setupChatHandlers = (ta, send, tradeBtn) => {
      if (ta._timerSetup) return;

      const handleSendAttempt = async () => {
        if (isTradeChat(ta) && ta.value.trim()) {
          const messageSent = await waitForMessageSend(ta);
          if (messageSent) {
            startTimer(tradeBtn);
          }
        }
      };

      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSendAttempt();
        }
      });

      if (send) {
        send.addEventListener('click', handleSendAttempt);
      }

      ta._timerSetup = true;
    };

    const checkAndSetupElements = () => {
      const tradeBtn = document.getElementById('channel_panel_button:public_trade');
      const tradeChat = getTradeChat();
      
      if (tradeBtn) {
        initializeTradeButton(tradeBtn);
      }

      if (tradeChat && tradeBtn) {
        const ta = tradeChat.querySelector('textarea[class*="textarea___"]');
        const send = tradeChat.querySelector('button[class*="iconWrapper___"]');

        if (ta) {
          setupChatHandlers(ta, send, tradeBtn);
        }
      }
    };
  
    const setupChatObserver = () => {
      if (observer) observer.disconnect();
  
      const chatRoot = document.getElementById('chatRoot');
      if (!chatRoot) {
        const docObserver = new MutationObserver(() => {
          if (document.getElementById('chatRoot')) {
            docObserver.disconnect();
            setupChatObserver();
          }
        });
        docObserver.observe(document.body, { childList: true, subtree: true });
        return;
      }

      let lastCheck = 0;
      observer = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastCheck > 100) {
          lastCheck = now;
          checkAndSetupElements();
        }
      });
  
      checkAndSetupElements();
      observer.observe(chatRoot, { childList: true, subtree: true });
    };
  
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const tradeBtn = document.getElementById('channel_panel_button:public_trade');
        if (tradeBtn) {
          const stored = parseInt(localStorage.getItem(STORAGE_KEY));
          if (stored) {
            if (stored > Date.now()) {
              runTimer(tradeBtn);
            } else {
              cleanupTimer(tradeBtn);
              initializeTradeButton(tradeBtn);
            }
          } else {
            initializeTradeButton(tradeBtn);
          }
        }
        checkAndSetupElements();
      }
    });
  
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        const tradeBtn = document.getElementById('channel_panel_button:public_trade');
        if (!tradeBtn) return;
  
        const val = parseInt(e.newValue);
        val && val > Date.now() ? runTimer(tradeBtn) : cleanupTimer(tradeBtn);
      }
    });
  
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', setupChatObserver)
      : setupChatObserver();
  })();