// ==UserScript==
// @name       统计选中字符数量(Powered By GPT) Character Count Tracker
// @namespace  https://greasyfork.org/zh-CN/scripts/468911-%E7%BB%9F%E8%AE%A1%E9%80%89%E4%B8%AD%E5%AD%97%E7%AC%A6%E6%95%B0%E9%87%8F-powered-by-gpt-character-count-tracker
// @version    1.0
// @description  Tracks the number of copied characters and displays it on the webpage
// @match      http://*/*
// @match      https://*/*
// @grant      none
// author      韩立
// @downloadURL https://update.greasyfork.org/scripts/468911/%E7%BB%9F%E8%AE%A1%E9%80%89%E4%B8%AD%E5%AD%97%E7%AC%A6%E6%95%B0%E9%87%8F%28Powered%20By%20GPT%29%20Character%20Count%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/468911/%E7%BB%9F%E8%AE%A1%E9%80%89%E4%B8%AD%E5%AD%97%E7%AC%A6%E6%95%B0%E9%87%8F%28Powered%20By%20GPT%29%20Character%20Count%20Tracker.meta.js
// ==/UserScript==

(function() {
  // Create a container element to hold the character count
  var charCountContainer = document.createElement('div');
  charCountContainer.style.cssText = 'position: fixed; bottom: 10px; right: 10px;';

  // Create a span element to display the character count
  var charCountDisplay = document.createElement('span');
  charCountDisplay.style.cssText = 'background-color: #fff; padding: 5px;';

  // Add the display element to the container
  charCountContainer.appendChild(charCountDisplay);

  // Append the container to the document body
  document.body.appendChild(charCountContainer);

  var previousCharCount = 0;

  function updateCharCount() {
    var selectedText = window.getSelection().toString();
    var charCount = selectedText.length;

    if (charCount > 0) {
      // Display the character count if text is selected
      charCountDisplay.textContent = '选中字符: ' + charCount;
      charCountContainer.style.display = 'block';

      if (charCount !== previousCharCount) {
        // Character count has changed, do something here if needed
        previousCharCount = charCount;
      }
    } else {
      // Hide the character count if no text is selected
      charCountContainer.style.display = 'none';
      previousCharCount = 0;
    }
  }

  // Listen for selection change events
  document.addEventListener('mouseup', updateCharCount);
  document.addEventListener('touchend', updateCharCount);
})();
