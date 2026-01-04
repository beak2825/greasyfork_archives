// ==UserScript==
// @name         OpenAI Chat AutoFiller
// @namespace    openai-chat-autofiller
// @version      3.1
// @description  Automatically fill in chat messages on OpenAI Chat using a predefined text when checkbox is checked and user completes a message.补充说明：panel在窗口右上角， 触发条件为“///”。3.0更新说明：可以存储选择最近 3-4 个之前用户使用的自动填充文本
// @author       ChatGPT ＆ philos
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462990/OpenAI%20Chat%20AutoFiller.user.js
// @updateURL https://update.greasyfork.org/scripts/462990/OpenAI%20Chat%20AutoFiller.meta.js
// ==/UserScript==

(function() {
  const recentAutoFillTexts = [];

  const controlPanel = document.createElement('div');
  controlPanel.style.position = 'fixed';
  controlPanel.style.top = '0';
  controlPanel.style.right = '0';
  controlPanel.style.padding = '10px';
  controlPanel.style.backgroundColor = '#fff';
  controlPanel.style.border = '1px solid #ccc';
  controlPanel.style.display = 'flex';
  controlPanel.style.alignItems = 'center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'autofill-checkbox';
  controlPanel.appendChild(checkbox);

  const inputGroup = document.createElement('div');
  inputGroup.style.display = 'none';

  const fillText = document.createElement('input');
  fillText.type = 'text';
  fillText.id = 'autofill-text';
  fillText.value = '每段话的开头请加上“【见字如晤】”回答我';
  fillText.style.width = 'calc(100% - 30px)';
  inputGroup.appendChild(fillText);

  const dropdown = document.createElement('select');
  dropdown.id = 'autofill-dropdown';
  dropdown.style.width = '30px';
  dropdown.style.overflow = 'hidden';
  inputGroup.appendChild(dropdown);

  controlPanel.appendChild(inputGroup);
  document.body.appendChild(controlPanel);

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      inputGroup.style.display = 'flex';
      document.querySelector('textarea').addEventListener('input', autofillText);
    } else {
      inputGroup.style.display = 'none';
      document.querySelector('textarea').removeEventListener('input', autofillText);
    }
  });

  const autofillText = () => {
    const chatInput = document.querySelector('textarea');
    const lastChars = chatInput.value.slice(-3);
    if (lastChars === '///') {
      chatInput.value = chatInput.value.slice(0, -3);
      recentAutoFillTexts.unshift(fillText.value);
      if (recentAutoFillTexts.length > 4) {
        recentAutoFillTexts.pop();
      }
      updateDropdown();
      chatInput.value += fillText.value + '\n';
    }
  };

  function updateDropdown() {
    dropdown.innerHTML = '';
    recentAutoFillTexts.forEach((text, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.text = text;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
      const selectedIndex = dropdown.value;
      if (selectedIndex !== '') {
        fillText.value = recentAutoFillTexts[selectedIndex];
      }
    });
  }
})();
