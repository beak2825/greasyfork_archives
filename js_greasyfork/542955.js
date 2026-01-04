// ==UserScript==
// @name         bloxd.io fake item amount display
// @namespace    https://bloxd.io/
// @version      1.0.0.1
// @description  fake item amount display to troll your friends by showing huge inventory stacks, no real duping
// @match        *://*.bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542955/bloxdio%20fake%20item%20amount%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/542955/bloxdio%20fake%20item%20amount%20display.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const MAX_LIMIT = 999999;
  let enabled = true;

  const gui = document.createElement('div');
  gui.style.position = 'fixed';
  gui.style.top = '12px';
  gui.style.right = '12px';
  gui.style.width = '180px';
  gui.style.backgroundColor = '#1a1a1a';
  gui.style.border = '1px solid #555';
  gui.style.borderRadius = '4px';
  gui.style.padding = '10px';
  gui.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  gui.style.color = '#ccc';
  gui.style.zIndex = 999999;

  const title = document.createElement('div');
  title.textContent = 'Amount Setter';
  title.style.fontWeight = '600';
  title.style.fontSize = '14px';
  title.style.marginBottom = '8px';
  title.style.color = '#ddd';
  gui.appendChild(title);

  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.alignItems = 'center';
  inputContainer.style.marginBottom = '8px';

  const label = document.createElement('label');
  label.textContent = 'Amount:';
  label.style.flex = '1';
  label.style.fontSize = '13px';
  label.style.color = '#bbb';
  inputContainer.appendChild(label);

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.max = MAX_LIMIT.toString();
  input.value = '999';
  input.style.flex = '2';
  input.style.padding = '4px 6px';
  input.style.fontSize = '13px';
  input.style.borderRadius = '3px';
  input.style.border = '1px solid #444';
  input.style.backgroundColor = '#222';
  input.style.color = '#eee';
  input.style.outline = 'none';
  input.addEventListener('focus', () => {
    input.style.borderColor = '#3a9af9';
    input.style.boxShadow = '0 0 5px #3a9af9';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = '#444';
    input.style.boxShadow = 'none';
  });
  inputContainer.appendChild(input);

  gui.appendChild(inputContainer);

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Disable';
  toggleBtn.style.width = '100%';
  toggleBtn.style.backgroundColor = '#3a9af9';
  toggleBtn.style.border = 'none';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.fontWeight = '600';
  toggleBtn.style.fontSize = '14px';
  toggleBtn.style.padding = '6px 0';
  toggleBtn.style.borderRadius = '3px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.transition = 'background-color 0.2s ease';

  toggleBtn.addEventListener('mouseenter', () => {
    toggleBtn.style.backgroundColor = '#2a7adf';
  });
  toggleBtn.addEventListener('mouseleave', () => {
    toggleBtn.style.backgroundColor = enabled ? '#3a9af9' : '#555';
  });
  toggleBtn.addEventListener('click', () => {
    enabled = !enabled;
    toggleBtn.textContent = enabled ? 'Disable' : 'Enable';
    toggleBtn.style.backgroundColor = enabled ? '#3a9af9' : '#555';
  });

  gui.appendChild(toggleBtn);

  document.body.appendChild(gui);

  function updateFakeAmount(selector, val) {
    if (!enabled) return;
    const items = document.querySelectorAll(selector);
    items.forEach(item => {
      const wrapper = item.querySelector('.ItemWrapper');
      if (wrapper) {
        let amt = wrapper.querySelector('.ItemAmount.SmallTextLight');
        if (!amt) {
          amt = document.createElement('div');
          amt.className = 'ItemAmount SmallTextLight';
          wrapper.appendChild(amt);
        }
        amt.textContent = val.toString();
      }
    });
  }

  function loop() {
    let val = parseInt(input.value) || 999;
    if (val < 1) val = 1;
    if (val > MAX_LIMIT) val = MAX_LIMIT;
    updateFakeAmount('.InvenItem.Selected', val);
    updateFakeAmount('.DraggedInvenItem', val);
    requestAnimationFrame(loop);
  }

  loop();
})();
