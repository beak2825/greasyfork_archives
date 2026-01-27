// ==UserScript==
// @name         Thundr Enhanced
// @namespace    Thundr Enhanced
// @description  Anti-Ban, displays partners IP, faces only matching, auto-message, block buy boost pop-ups and clutter, auto-start, instant partner preview, exposure/fit controls, displays partners device.
// @version      2.3.3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thundr.com
// @match        *://*.thundr.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543695/Thundr%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/543695/Thundr%20Enhanced.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ==========================================
  // 1. CORE ASSETS & CONFIG
  // ==========================================

  // Images for Anti-Ban
  const BLACK_IMAGE_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCADgAOADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==";
  const FACE_IMAGE_B64 = "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";

  let partnerIP = null;

  // CSS Overrides
  const style = document.createElement('style');
  style.innerHTML = `
    /* Hide clutter buttons */
    .css-1kr1pnj, .css-79ryvu, .chakra-button.css-157xzqb, .chakra-button.css-1ocznf9 { display: none !important; }
    /* Instant Preview */
    .breathing-blur { filter: none !important; animation: none !important; opacity: 1 !important; }
  `;
  document.head.appendChild(style);

  // ==========================================
  // 2. UI SETUP: GEAR (SETTINGS) & PIN (IP)
  // ==========================================

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed', top: '80px', right: '20px',
    width: 'max-content', zIndex: 999999,
    fontFamily: 'sans-serif', userSelect: 'none'
  });

  // --- Gear Icon (Settings) ---
  const gearIcon = document.createElement('div');
  gearIcon.textContent = '⚙️';
  Object.assign(gearIcon.style, {
      fontSize: '30px', cursor: 'move', textAlign: 'right',
      textShadow: '0px 0px 4px rgba(0,0,0,0.8)', marginBottom: '10px'
  });

  const gearDropdown = document.createElement('div');
  Object.assign(gearDropdown.style, {
      display: 'none', position: 'absolute', top: '0', right: '40px',
      background: 'rgba(30,30,30,0.5)', border: '1px solid #555',
      borderRadius: '6px', padding: '10px', width: '220px', color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)', textAlign: 'left'
  });

  // --- Pin Icon (IP Info) ---
  const pinIcon = document.createElement('div');
  pinIcon.textContent = '📍';
  Object.assign(pinIcon.style, {
      fontSize: '30px', cursor: 'pointer', textAlign: 'right',
      textShadow: '0px 0px 4px rgba(0,0,0,0.8)',
      filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.8))'
  });

  const pinDropdown = document.createElement('div');
  Object.assign(pinDropdown.style, {
      display: 'none', position: 'absolute', top: '45px', right: '40px',
      background: 'rgba(20,20,20,0.5)', border: '1px solid #f00',
      borderRadius: '8px', padding: '12px', width: '320px', color: '#0f0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
      textAlign: 'left', fontSize: '11px', whiteSpace: 'pre-wrap',
      maxHeight: '400px', overflowY: 'auto'
  });
  pinDropdown.innerHTML = '<span style="color:#888;">Waiting for partner...</span>';

  panel.appendChild(gearDropdown);
  panel.appendChild(pinDropdown);
  panel.appendChild(gearIcon);
  panel.appendChild(pinIcon);
  document.body.appendChild(panel);

  // ==========================================
  // 3. UI LOGIC (DRAGGING, TOGGLING & ALIGNMENT)
  // ==========================================

  let isDragging = false;
  let hasDragged = false;
  let offsetX, offsetY;

  // New: Keeps menus on screen
  function checkMenuPosition() {
      const rect = panel.getBoundingClientRect();
      const isLeft = rect.left < (window.innerWidth / 2);
      const isBottom = rect.top > (window.innerHeight - 300);

      [gearDropdown, pinDropdown].forEach(d => {
          // Horizontal Flip
          if (isLeft) {
              d.style.right = 'auto';
              d.style.left = '40px';
          } else {
              d.style.left = 'auto';
              d.style.right = '40px';
          }

          // Vertical Flip (Simple check to prevent cutting off bottom)
          if (isBottom) {
               if (d === pinDropdown) {
                   d.style.top = 'auto';
                   d.style.bottom = '45px';
               } else {
                   d.style.top = 'auto';
                   d.style.bottom = '0';
               }
          } else {
              if (d === pinDropdown) {
                   d.style.bottom = 'auto';
                   d.style.top = '45px';
               } else {
                   d.style.bottom = 'auto';
                   d.style.top = '0';
               }
          }
      });
  }

  function onDragStart(e) {
      if (e.target !== gearIcon) return;
      if (e.type === 'touchstart') e.preventDefault();

      isDragging = true;
      hasDragged = false;

      const rect = panel.getBoundingClientRect();
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';

      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      gearIcon.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
      if (!isDragging) return;
      hasDragged = true;
      if (e.type === 'touchmove') e.preventDefault();
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      let newLeft = clientX - offsetX;
      let newTop = clientY - offsetY;

      const maxLeft = window.innerWidth - panel.offsetWidth;
      const maxTop = window.innerHeight - panel.offsetHeight;

      panel.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
      panel.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';

      // Update menu direction while dragging
      checkMenuPosition();
  }

  function onDragEnd() {
      isDragging = false;
      gearIcon.style.cursor = 'move';
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);

      if (!hasDragged) {
          const isHidden = gearDropdown.style.display === 'none';
          gearDropdown.style.display = isHidden ? 'block' : 'none';
          if (isHidden) {
              pinDropdown.style.display = 'none';
              checkMenuPosition(); // Ensure correct alignment on open
          }
      }
  }

  gearIcon.addEventListener('mousedown', onDragStart);
  gearIcon.addEventListener('touchstart', onDragStart, { passive: false });

  pinIcon.addEventListener('click', () => {
      const isHidden = pinDropdown.style.display === 'none';
      if (isHidden) {
          pinDropdown.style.display = 'block';
          gearDropdown.style.display = 'none';
          checkMenuPosition(); // Ensure correct alignment on open
          fetchIPInfo();
      } else {
          pinDropdown.style.display = 'none';
      }
  });

  // ==========================================
  // 4. IP FETCHING LOGIC
  // ==========================================

  async function fetchIPInfo() {
      if (!partnerIP) {
          pinDropdown.innerHTML = '<span style="color:#f80;">⚠️ No Partner IP Captured.\nWait for a video connection.</span>';
          return;
      }
      pinDropdown.innerHTML = '<span style="color:#fff;">Fetching info for ' + partnerIP + '...</span>';
      try {
          const response = await fetch(`https://ipwho.is/${partnerIP}`);
          const data = await response.json();
          pinDropdown.innerText = JSON.stringify(data, null, 2);
      } catch (e) {
          pinDropdown.innerHTML = `<span style="color:red">Fetch Failed: ${e.message}</span>`;
      }
  }

  // ==========================================
  // 5. SETTINGS MENU CONTENT
  // ==========================================

  let autoMessageEnabled = JSON.parse(localStorage.getItem('autoMessageEnabled')) ?? true;
  let customMessage = localStorage.getItem('customAutoMessage') ?? "";
  let antiBanEnabled = JSON.parse(localStorage.getItem('thundrAntiBan')) ?? false;
  let facesOnlyEnabled = JSON.parse(localStorage.getItem('thundrFacesOnly')) ?? false;
  let autoMessageSent = false;

  // Auto Message Input
  const amTitle = document.createElement('div');
  amTitle.textContent = 'Auto-Message:';
  amTitle.style.fontWeight = 'bold';
  gearDropdown.appendChild(amTitle);

  const inputWrap = document.createElement('div');
  inputWrap.style.cssText = 'position:relative; width:100%; margin-bottom:12px;';

  const msgInput = document.createElement('input');
  msgInput.type = 'text';
  msgInput.value = customMessage;
  msgInput.placeholder = "Type Message...";
  msgInput.style.cssText = 'width:100%; padding:5px 5px 5px 30px; border-radius:4px; border:1px solid #ccc; box-sizing:border-box; color:white;';
  msgInput.addEventListener('input', () => { customMessage = msgInput.value; localStorage.setItem('customAutoMessage', customMessage); });

  const msgCheck = document.createElement('input');
  msgCheck.type = 'checkbox';
  msgCheck.checked = autoMessageEnabled;
  msgCheck.style.cssText = 'position:absolute; left:8px; top:50%; transform:translateY(-50%); cursor:pointer;';
  msgCheck.addEventListener('change', () => { autoMessageEnabled = msgCheck.checked; localStorage.setItem('autoMessageEnabled', autoMessageEnabled); });

  inputWrap.appendChild(msgCheck);
  inputWrap.appendChild(msgInput);
  gearDropdown.appendChild(inputWrap);

  // Toggles helper
  function createToggle(label, checked, callback) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; margin-bottom:5px;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      cb.style.marginRight = '8px';
      cb.addEventListener('change', (e) => callback(e.target.checked));
      const txt = document.createElement('span');
      txt.textContent = label;
      txt.style.fontSize = '13px';
      row.appendChild(cb);
      row.appendChild(txt);
      return row;
  }

  gearDropdown.appendChild(createToggle('Anti-Ban', antiBanEnabled, v => { antiBanEnabled = v; localStorage.setItem('thundrAntiBan', v); }));
  gearDropdown.appendChild(createToggle('Faces Only', facesOnlyEnabled, v => { facesOnlyEnabled = v; localStorage.setItem('thundrFacesOnly', v); }));

  // ==========================================
  // 6. FUNCTIONALITY: POPUPS, AUTO-START, MSG
  // ==========================================

  // Pop-up Blocker
  new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.querySelector('h2[data-part="title"]')?.textContent.includes('Buy A Boost')) {
              n.querySelector('.chakra-dialog__footer button')?.click();
          }
      }));
  }).observe(document.body, { childList: true, subtree: true });

  // Auto-Start
  setInterval(() => {
      const txt = document.body.textContent;
      if (txt.includes('🏁 Press start') || txt.includes('⬆️ Swipe UP') || txt.includes('fake video')) {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
      }
      handleAutoMessage();
      handleVideoControls();
  }, 1000);

  // Auto-Message
  function handleAutoMessage() {
      if (!autoMessageEnabled || autoMessageSent || !customMessage.trim()) return;

      const textareas = document.querySelectorAll('textarea.chakra-textarea.css-12nex2n');
      textareas.forEach(textarea => {
          const chatContainer = textarea.closest('.css-yftrfm');
          if (!chatContainer) return;

          const sendBtn = chatContainer.querySelector('button.css-lwfflm');

          if (sendBtn && textarea.value.trim() === "") {
              textarea.value = customMessage;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              sendBtn.click();
              autoMessageSent = true;
          }
      });
  }

  // ==========================================
  // 7. WEBSOCKET INTERCEPTORS (Anti-Ban & IP)
  // ==========================================

  // A. Outgoing Interceptor (Anti-Ban)
  const originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function(data) {
      if (antiBanEnabled) {
          try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed) && parsed[3] === 'webrtc_message' && parsed[4]?.type === 'ss') {
                  parsed[4].b64 = facesOnlyEnabled ? FACE_IMAGE_B64 : BLACK_IMAGE_B64;
                  arguments[0] = JSON.stringify(parsed);
              }
          } catch (e) {}
      }
      return originalSend.apply(this, arguments);
  };

  // B. Incoming Interceptor (IP Capture)
  const NativeWebSocket = window.WebSocket;
  window.WebSocket = function(...args) {
      const socket = new NativeWebSocket(...args);
      // Attach "send" hook to this instance if needed, though prototype hook covers it.

      socket.addEventListener('message', (e) => {
          try {
              const msg = JSON.parse(e.data);
              if (!Array.isArray(msg) || msg.length < 5) return;
              const [,, topic, event, payload] = msg;

              // Reset IP Logic
              if (event === 'matched' || event === 'disconnect' || event === 'phx_join') {
                  partnerIP = null;
                  if (pinDropdown.style.display === 'block') {
                      pinDropdown.innerHTML = '<span style="color:#888;">Scanning...</span>';
                  }
                  // Reset Auto-Message flag on match
                  if (event === 'matched') {
                      autoMessageSent = false;
                      // Device Display Logic
                      if (payload?.partner?.settings?.device) {
                          updateDeviceDisplay(payload.partner.settings.device);
                      }
                  }
              }
              // Capture IP Logic
              else if (event === 'webrtc_message' && payload?.data?.candidate) {
                  const c = payload.data.candidate;
                  if (c.includes('typ srflx')) {
                      const match = c.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
                      if (match) {
                          const ip = match[1];
                          // Filter LAN/Cloudflare
                          if (!ip.startsWith('10.') && !ip.startsWith('192.168') && !ip.startsWith('104.')) {
                              partnerIP = ip;
                              // Auto-refresh if menu open
                              if (pinDropdown.style.display === 'block' && pinDropdown.innerText.includes('Scanning')) {
                                  fetchIPInfo();
                              }
                          }
                      }
                  }
              }
          } catch (err) {}
      });
      return socket;
  };
  window.WebSocket.prototype = NativeWebSocket.prototype; // Restore prototype for the send hook to work

  // ==========================================
  // 8. DEVICE HUD & VIDEO CONTROLS
  // ==========================================

  const deviceDisplay = document.createElement('div');
  Object.assign(deviceDisplay.style, {
      position: 'absolute', top: '0', left: '0',
      backgroundColor: 'rgba(0,0,0,0.1)', color: '#fff', padding: '4px 8px',
      borderRadius: '6px', fontSize: '12px', fontWeight: 'bold',
      zIndex: '10', pointerEvents: 'none', opacity: '0', maxWidth: '90%'
  });
  function updateDeviceDisplay(name) {
      deviceDisplay.innerHTML = name;
      deviceDisplay.style.opacity = '1';
  }

  // Video Controls
  let isEnhanced = false;
  let exposeButton, fitButton;
  let fitStates = ['cover', 'fill', 'none'];
  let fitIndex = 0;

  function handleVideoControls() {
      const vid = document.querySelector('.css-14vtn1j video');
      if (vid && !vid.parentElement.classList.contains('Partners-Video')) {
          const wrap = document.createElement('div');
          wrap.className = 'Partners-Video';
          wrap.style.cssText = 'width:100%; height:100%; display:flex; position:relative;';
          vid.parentNode.insertBefore(wrap, vid);
          wrap.appendChild(vid);
          wrap.appendChild(deviceDisplay);
          applyVideoStyles();
      }
      addControlButtons();
  }

  function applyVideoStyles() {
      const wrap = document.querySelector('.Partners-Video');
      const vid = wrap?.querySelector('video');
      if (wrap) wrap.style.filter = isEnhanced ? 'brightness(1000%)' : 'none';
      if (vid) vid.style.objectFit = fitStates[fitIndex];
      if (exposeButton) exposeButton.style.color = isEnhanced ? '#FFD700' : 'white';
  }

  function addControlButtons() {
      const cont = document.querySelector('.css-s16q1a');
      if (!cont || document.getElementById('exposure-button')) return;
      cont.style.flexDirection = 'column';

      // 1. Exposure Button
      // Added 'pointer-events: none' to SVG to ensure the button captures the click, not the icon
      exposeButton = createBtn('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>');
      exposeButton.id = 'exposure-button';

      // Handler function
      const handleExposure = (e) => {
          if (e.cancelable) e.preventDefault(); // Prevents double-firing on some touch devices
          e.stopPropagation();
          isEnhanced = !isEnhanced;
          applyVideoStyles();
      };

      // Add both click and touchend for maximum mobile compatibility
      exposeButton.addEventListener('click', handleExposure);
      exposeButton.addEventListener('touchend', handleExposure);

      cont.appendChild(exposeButton);

      // 2. Fit Button
      // Added 'pointer-events: none' to SVG
      fitButton = createBtn('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="pointer-events: none;"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>');
      fitButton.id = 'fit-button';
      fitButton.style.marginTop = '4px';

      // Handler function
      const handleFit = (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          fitIndex = (fitIndex + 1) % 3;
          applyVideoStyles();
      };

      // Add both click and touchend
      fitButton.addEventListener('click', handleFit);
      fitButton.addEventListener('touchend', handleFit);

      cont.appendChild(fitButton);
  }

  function createBtn(html) {
      const b = document.createElement('button');
      b.className = 'chakra-button css-1d7yi4a';
      b.type = 'button'; // Important for mobile forms
      b.style.cssText = 'width:50px; height:50px; display:flex; align-items:center; justify-content:center; color:white; touch-action: manipulation;';
      b.innerHTML = html;
      return b;
  }

})();