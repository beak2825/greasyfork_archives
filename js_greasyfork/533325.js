// ==UserScript==
// @name         Shadowlister(Torn Auto-Anon Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Toggle all item listings anonymous ON/OFF while keeping manual control
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533325/Shadowlister%28Torn%20Auto-Anon%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533325/Shadowlister%28Torn%20Auto-Anon%20Toggle%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let autoAnon = true;

  // Create container for button with drag header
  const buttonContainer = document.createElement('div');
  Object.assign(buttonContainer.style, {
    position: 'fixed',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    zIndex: '9999',
    borderRadius: '6px',
    overflow: 'hidden',
    opacity: 0.9,
    userSelect: 'none',
    border: '2px solid #0f0',
  });

  // Create drag header
  const dragHeader = document.createElement('div');
  dragHeader.textContent = '⋮⋮';
  Object.assign(dragHeader.style, {
    backgroundColor: '#0f0',
    color: '#222',
    padding: '2px 12px',
    fontSize: '10px',
    textAlign: 'center',
    cursor: 'grab',
    fontWeight: 'bold',
    lineHeight: '1',
  });

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Auto-Anon: ON';
  Object.assign(toggleBtn.style, {
    backgroundColor: '#222',
    color: '#0f0',
    border: 'none',
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    display: 'block',
  });

  toggleBtn.onclick = () => {
    autoAnon = !autoAnon;
    toggleBtn.textContent = `Auto-Anon: ${autoAnon ? 'ON' : 'OFF'}`;
    toggleBtn.style.color = autoAnon ? '#0f0' : '#f00';
    buttonContainer.style.borderColor = autoAnon ? '#0f0' : '#f00';
    dragHeader.style.backgroundColor = autoAnon ? '#0f0' : '#f00';
    applyToAllVisible();
  };

  // Assemble the container
  buttonContainer.appendChild(dragHeader);
  buttonContainer.appendChild(toggleBtn);

  // Make container draggable using the proven approach
  makeDraggable(buttonContainer, dragHeader);

  document.body.appendChild(buttonContainer);

  // Draggable functionality (based on working example)
  function makeDraggable(element, dragHandle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    dragHandle.onmousedown = dragMouseDown;
    dragHandle.ontouchstart = dragTouchStart;
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      dragHandle.style.cursor = 'grabbing';
    }
    
    function dragTouchStart(e) {
      const touch = e.touches[0];
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTouchDrag;
      dragHandle.style.cursor = 'grabbing';
    }
    
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      
      element.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
      element.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
      element.style.transform = 'none';
    }
    
    function elementTouchDrag(e) {
      const touch = e.touches[0];
      pos1 = pos3 - touch.clientX;
      pos2 = pos4 - touch.clientY;
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      
      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      
      element.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
      element.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
      element.style.transform = 'none';
    }
    
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
      dragHandle.style.cursor = 'grab';
    }
  }

  // Tick/Untick all visible checkboxes
  function applyToAllVisible() {
    const allBoxes = document.querySelectorAll('input[id^="itemRow-incognitoCheckbox-"]');
    allBoxes.forEach(box => {
      if (autoAnon && !box.checked) {
        box.click();
      } else if (!autoAnon && box.checked) {
        box.click();
      }
    });
  }

  // Observer for new rows
  const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const checkboxes = node.querySelectorAll?.('input[id^="itemRow-incognitoCheckbox-"]') || [];
        checkboxes.forEach(checkbox => {
          if (autoAnon && !checkbox.checked) {
            checkbox.click();
          } else if (!autoAnon && checkbox.checked) {
            checkbox.click();
          }
        });
      }
    }
  });

  function initObserver() {
    if (location.hash.startsWith('#/addListing')) {
      observer.observe(document.body, { childList: true, subtree: true });
      applyToAllVisible(); // First batch
    }
  }

  window.addEventListener('hashchange', initObserver);
  window.addEventListener('load', initObserver);
  initObserver();
})();