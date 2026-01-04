// ==UserScript==
// @name        Convert URL to Link on YouTube Sorry Pages
// @description Turns the URL at the bottom of YouTube Sorry (captcha) pages into a clickable link
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/sorry/index
// @grant       none
// @version     2.0
// @author      Jupiter Liar
// @license     Attribution CC BY
// @description 7/27/2023, 7:45 PM
// @downloadURL https://update.greasyfork.org/scripts/471152/Convert%20URL%20to%20Link%20on%20YouTube%20Sorry%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/471152/Convert%20URL%20to%20Link%20on%20YouTube%20Sorry%20Pages.meta.js
// ==/UserScript==

function convertCaptchaUrlToLink() {
  const debugEnabled = false; // Set to true to enable the debugger
  const debuggerMaxHeight = 'calc(100vh - 16px)';

  const createDebugger = () => {
    const debuggerDiv = document.createElement('div');
    debuggerDiv.style.position = 'fixed';
    debuggerDiv.style.top = '8px';
    debuggerDiv.style.left = '8px';
    debuggerDiv.style.display = 'block';
    debuggerDiv.style.padding = '8px';
    debuggerDiv.style.backgroundColor = 'white';
    debuggerDiv.style.color = 'black';
    debuggerDiv.style.fontFamily = 'sans-serif';
    debuggerDiv.style.maxHeight = debuggerMaxHeight;
    debuggerDiv.style.overflowY = 'auto';
    document.body.appendChild(debuggerDiv);
    return debuggerDiv;
  };

  const debugMessage = (message) => {
    if (debugEnabled && debuggerDiv) {
      debuggerDiv.innerText += `${message}\n`;
    }
  };

  let debuggerDiv;
  if (debugEnabled) {
    debuggerDiv = createDebugger();
    debugMessage('Debugger enabled.');
    debugMessage('Searching for URL to convert...');
  }

  let isConverted = false; // Flag to track if conversion has occurred

  const traverseElements = (elements) => {
    for (const element of elements) {
      if (isConverted) return; // Exit early if conversion is already done

      if (element.tagName === 'DIV' && element.style.fontSize === '13px') {
        const urls = extractUrls(element.textContent);
        if (urls.length > 0) {
          if (debugEnabled) {
            debugMessage('URL(s) found:');
            for (const url of urls) {
              debugMessage(url);
            }
            debugMessage('Converting URL(s) to link...');
          }

          for (const url of urls) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = url;

            const container = document.createElement('span');
            const urlText = document.createTextNode('URL: '); // Add this line to create the text node
            container.appendChild(urlText); // Add the text node before the link
            container.appendChild(link);

            // Find the "URL:" text node and replace it with the container
            const urlTextNode = findTextNodeContaining(element, 'URL: ');
            if (urlTextNode) {
              urlTextNode.parentNode.replaceChild(container, urlTextNode);
            }
          }

          if (debugEnabled) {
            debugMessage('URL(s) converted to link(s).');
          }

          isConverted = true; // Set the flag to true after conversion
          return;
        }
      }

      if (element.children.length > 0) {
        traverseElements(element.children);
      }
    }
  };

  const extractUrls = (text) => {
    const urlRegex = /https?:\/\/[^\s<]+/g;
    return text.match(urlRegex) || [];
  };

  const findTextNodeContaining = (element, text) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.includes(text)) {
        return node;
      }
    }
    return null;
  };

  setTimeout(() => {
    if (debugEnabled) {
      debugMessage('Giving up.');
    }
  }, 60000);

  traverseElements(document.body.children);
}

convertCaptchaUrlToLink();
