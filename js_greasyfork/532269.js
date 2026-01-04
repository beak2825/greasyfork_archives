// ==UserScript==
// @name         Torn Trade Chat Timer (Fixed)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  60s red border timer after sending a trade message on Torn; persists and syncs across tabs; triggers on Enter or Send click only if message clears.
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532269/Torn%20Trade%20Chat%20Timer%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532269/Torn%20Trade%20Chat%20Timer%20%28Fixed%29.meta.js
// ==/UserScript==

(function () {
    const STORAGE_KEY = 'tornTradeTimerEnd';
    let animFrameId = null;
    let svgEl = null, rectEl = null, pathLength = 0;
    let observer = null;
    let eventListenersInitialized = false;
  
    const setupOverlay = (btn) => {
      const { width, height } = btn.getBoundingClientRect();
      
      if (!svgEl) {
        svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('id', 'trade-timer-overlay');
        svgEl.style.cssText = 'position:absolute;top:0;left:0;z-index:1000;pointer-events:none';
        
        rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectEl.setAttribute('x', '1.5');
        rectEl.setAttribute('y', '1.5');
        rectEl.setAttribute('fill', 'none');
        rectEl.setAttribute('stroke-width', '3');
        
        svgEl.appendChild(rectEl);
        btn.appendChild(svgEl);
      }
      
      svgEl.setAttribute('width', width);
      svgEl.setAttribute('height', height);
      rectEl.setAttribute('width', width - 3);
      rectEl.setAttribute('height', height - 3);
      
      pathLength = 2 * (width + height - 6);
      rectEl.setAttribute('stroke-dasharray', pathLength);
      
      return { width, height };
    };
  
    const updateTimerVisual = (remainingMs) => {
      if (!rectEl) return;
      
      if (remainingMs <= 0) {
        rectEl.setAttribute('stroke', 'green');
        rectEl.setAttribute('stroke-dasharray', 'none');
      } else {
        rectEl.setAttribute('stroke', 'red');
        rectEl.setAttribute('stroke-dasharray', pathLength);
        const offset = pathLength * (1 - remainingMs / 60000);
        rectEl.setAttribute('stroke-dashoffset', offset);
      }
    };
  
    const runTimer = (btn) => {
      if (!btn) return;
      
      if (animFrameId) cancelAnimationFrame(animFrameId);
      btn.style.border = 'none';
      
      setupOverlay(btn);
      
      const animate = () => {
        const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
        const remaining = endTime - Date.now();
        
        if (remaining <= 0) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
          if (btn) btn.style.border = '3px solid green';
          if (svgEl) {
            svgEl.remove();
            svgEl = null;
            rectEl = null;
          }
          localStorage.removeItem(STORAGE_KEY);
        } else {
          updateTimerVisual(remaining);
          animFrameId = requestAnimationFrame(animate);
        }
      };
      
      const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
      const remaining = endTime - Date.now();
      updateTimerVisual(remaining);
      
      animFrameId = requestAnimationFrame(animate);
    };
  
    const startTimer = (btn) => {
      if (!btn) return;
      localStorage.setItem(STORAGE_KEY, Date.now() + 60000);
      runTimer(btn);
    };
  
    const handleSend = (ta, btn) => {
      if (!ta || !btn) return;
      
      setTimeout(() => {
        if (!ta.value.trim()) startTimer(btn);
      }, 200);
    };

    const initializeTradeButton = (tradeBtn) => {
      if (!tradeBtn) return;
      
      if (getComputedStyle(tradeBtn).position === 'static')
        tradeBtn.style.position = 'relative';
      
      const stored = parseInt(localStorage.getItem(STORAGE_KEY));
      if (stored && stored > Date.now()) {
        runTimer(tradeBtn);
      } else {
        tradeBtn.style.border = '3px solid green';
      }
    };
    
    const setupChat = () => {
      const tradeBtn = document.getElementById('channel_panel_button:public_trade');
      const ta = document.querySelector('textarea.textarea___V8HsV');
      const send = document.querySelector('button.iconWrapper___tyRRU');
      
      if (tradeBtn) {
        initializeTradeButton(tradeBtn);
      }
      
      if (tradeBtn && ta && send && !eventListenersInitialized) {
        if (!ta._timerKeydownHandler) {
          ta._timerKeydownHandler = (e) => {
            if (e.key === 'Enter') handleSend(ta, tradeBtn);
          };
        }
        
        if (!send._timerClickHandler) {
          send._timerClickHandler = () => handleSend(ta, tradeBtn);
        }
        
        ta.removeEventListener('keydown', ta._timerKeydownHandler);
        send.removeEventListener('click', send._timerClickHandler);
        
        ta.addEventListener('keydown', ta._timerKeydownHandler);
        send.addEventListener('click', send._timerClickHandler);
        
        eventListenersInitialized = true;
      } else if (!tradeBtn || !ta || !send) {
        eventListenersInitialized = false;
      }
    };
    
    const setupChatObserver = () => {
      if (observer) {
        observer.disconnect();
      }
      
      const chatRoot = document.getElementById('chatRoot');
      if (!chatRoot) {
        const docObserver = new MutationObserver(() => {
          const chatRoot = document.getElementById('chatRoot');
          if (chatRoot) {
            docObserver.disconnect();
            setupChatObserver();
          }
        });
        
        docObserver.observe(document.body, { childList: true, subtree: true });
        return;
      }
      
      observer = new MutationObserver(() => {
        setupChat();
      });
      
      setupChat();
      
      observer.observe(chatRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    };
    
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        const tradeBtn = document.getElementById('channel_panel_button:public_trade');
        if (!tradeBtn) return;
        
        const val = parseInt(e.newValue);
        if (val && val > Date.now()) runTimer(tradeBtn);
        else {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
          if (svgEl) {
            svgEl.remove();
            svgEl = null;
            rectEl = null;
          }
          tradeBtn.style.border = '3px solid green';
        }
      }
    });
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupChatObserver);
    } else {
      setupChatObserver();
    }
})();
  