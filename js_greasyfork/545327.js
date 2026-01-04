// ==UserScript==
// @name         Character Token
// @namespace    ViolentMonkey
// @version      3.0
// @description  Character.AI token capture tool. Developed by Golden4484 - Educational use only.
// @author       Golden4484
// @license      MIT
// @icon         https://i.imgur.com/WvzjWZV.png
// @match        https://character.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545327/Character%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/545327/Character%20Token.meta.js
// ==/UserScript==

(function(){
  'use strict';
  
  let capturedToken = null;
  let isIntercepting = false;
  
  // Show token result with Character.AI native styling
  function showTokenResult(token) {
    // Remove any existing panel
    const existing = document.getElementById('token-result-panel');
    if (existing) existing.remove();
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'token-result-panel';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease-out;
    `;
    
    // Create modal with Character.AI styling
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease-out;
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideOut {
        to { transform: translateY(20px); opacity: 0; }
      }
    `;
    if (!document.querySelector('style[data-token-modal]')) {
      style.setAttribute('data-token-modal', 'true');
      document.head.appendChild(style);
    }
    
    const tokenPreview = token.length > 50 ? token.substring(0, 50) + '...' : token;
    
    modal.innerHTML = `
      <!-- Header -->
      <div style="
        padding: 24px 24px 0 24px;
        border-bottom: 1px solid #333;
        margin-bottom: 0;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">Authentication Token</h2>
          <button id="close-modal-btn" style="
            background: none;
            border: none;
            color: #999;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            line-height: 1;
            transition: all 0.2s ease;
          " title="Close">&times;</button>
        </div>
        <div style="
          color: #999;
          font-size: 14px;
          margin-bottom: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">Captured via Authorization Header Interception</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px;">
        <!-- Token Display -->
        <div style="margin-bottom: 24px;">
          <label style="
            display: block;
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">Account Token</label>
          <div style="
            background: #262626;
            border: 1px solid #404040;
            border-radius: 12px;
            padding: 12px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            font-size: 13px;
            color: #e5e5e5;
            word-break: break-all;
            line-height: 1.4;
          ">${tokenPreview}</div>
        </div>
        
        <!-- Actions -->
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button id="copy-token-btn" style="
            flex: 1;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 12px;
            padding: 14px 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">Copy to Clipboard</button>
        </div>
        
        <!-- Disclaimer -->
        <div style="
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 12px;
          color: #ef4444;
          font-size: 12px;
          line-height: 1.4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <strong>Educational Use Only:</strong> This tool is provided for educational and research purposes. 
          The authors assume no responsibility for misuse or any damages resulting from the use of this token.
        </div>
      </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Event handlers
    const closeBtn = document.getElementById('close-modal-btn');
    const copyBtn = document.getElementById('copy-token-btn');
    
    // Hover effects
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#333';
      closeBtn.style.color = '#fff';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none';
      closeBtn.style.color = '#999';
    });
    
    copyBtn.addEventListener('mouseenter', () => {
      copyBtn.style.background = '#f0f0f0';
    });
    copyBtn.addEventListener('mouseleave', () => {
      if (!copyBtn.dataset.copied) {
        copyBtn.style.background = '#ffffff';
      }
    });
    
    // Close handlers
    closeBtn.onclick = closeModal;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };
    
    function closeModal() {
      backdrop.style.animation = 'fadeIn 0.2s ease-in reverse';
      modal.style.animation = 'slideOut 0.2s ease-in';
      setTimeout(() => backdrop.remove(), 200);
    }
    
    // Copy token
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(token).then(() => {
        copyBtn.textContent = 'Copied Successfully';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.color = '#ffffff';
        copyBtn.dataset.copied = 'true';
        
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
          copyBtn.style.background = '#ffffff';
          copyBtn.style.color = '#000000';
          delete copyBtn.dataset.copied;
        }, 3000);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = token;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.textContent = 'Copied Successfully';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.color = '#ffffff';
      });
    };
    
    // ESC key to close
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && document.getElementById('token-result-panel')) {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }
  
  // Optimized fetch interceptor
  function setupTokenInterceptor() {
    if (isIntercepting) return;
    isIntercepting = true;
    
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      
      if (!capturedToken) {
        try {
          const [url, options] = args;
          
          if (options && options.headers) {
            const authHeader = options.headers.Authorization || options.headers.authorization;
            
            if (authHeader && (authHeader.startsWith('Token ') || authHeader.startsWith('Bearer '))) {
              const token = authHeader.replace(/^(Token|Bearer)\s+/i, '');
              
              if (token.length > 30 && /^[a-zA-Z0-9]+$/.test(token)) {
                capturedToken = token;
                
                console.log('[Token Interceptor] Token captured successfully');
                console.log('Request URL:', url);
                console.log('Token length:', token.length, 'characters');
                
                showTokenResult(token);
              }
            }
          }
        } catch (error) {
          console.warn('[Token Interceptor] Error processing request:', error);
        }
      }
      
      return response;
    };
  }
  
  // Reset function
  window.resetTokenInterceptor = function() {
    capturedToken = null;
    const existing = document.getElementById('token-result-panel');
    if (existing) existing.remove();
    console.log('[Token Interceptor] Reset completed');
  };
  
  // Initialize
  function initialize() {
    console.log('[Token Interceptor] Initialized - waiting for authentication requests');
    console.log('[Token Interceptor] Activate voice mode in any chat to capture token');
    
    setupTokenInterceptor();
  }
  
  // Start when page loads
  if (document.readState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();