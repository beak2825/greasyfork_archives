// ==UserScript==
// @name         DeepWiki Code Copy
// @namespace    deepwiki_code_copy
// @description  Add copy button to code blocks on DeepWiki
// @version      1.1.0
// @author       roojay(https://github.com/roojay520)
// @license      http://opensource.org/licenses/MIT
// @match        https://deepwiki.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534146/DeepWiki%20Code%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/534146/DeepWiki%20Code%20Copy.meta.js
// ==/UserScript==

GM_addStyle(`
  .code-copy-button {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    z-index: 100;
    border: none;
    outline: none;
  }
  
  .code-copy-button:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .code-copy-button.copied {
    background-color: #4caf50;
  }
  
  pre {
    position: relative;
  }
`);

(function() {
  /** Store processed code blocks to avoid duplicate processing */
  const processedPre = new WeakSet();

  /** Add copy buttons to code blocks */
  function addCopyButtonsToCodeBlocks() {
    /** Get all top-level pre elements (not nested inside other pre elements) */
    const preElements = Array.from(document.querySelectorAll('pre')).filter(pre => {
      // Check if this pre is nested inside another pre
      const parentPre = pre.closest('pre:not(:scope)');
      return !parentPre; // If no parent pre, it's a top-level pre
    });
    
    preElements.forEach(pre => {
      // Skip if already processed
      if (processedPre.has(pre)) {
        return;
      }
      
      // Mark as processed
      processedPre.add(pre);
      
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.textContent = 'Copy';
      
      // Add copy functionality
      copyButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Get clean code content by cloning the pre element, removing the button, and getting text
        const preClone = pre.cloneNode(true);
        const buttonInClone = preClone.querySelector('.code-copy-button');
        if (buttonInClone) {
          buttonInClone.remove();
        }
        const codeContent = preClone.textContent || '';
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeContent).then(() => {
          // Visual feedback on success
          copyButton.classList.add('copied');
          copyButton.textContent = 'Copied!';
          
          // Reset after 2 seconds
          setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = 'Copy';
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          
          // Fallback copy method
          const textarea = document.createElement('textarea');
          textarea.value = codeContent;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          
          try {
            document.execCommand('copy');
            copyButton.classList.add('copied');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.classList.remove('copied');
              copyButton.textContent = 'Copy';
            }, 2000);
          } catch (err) {
            console.error('Fallback copy failed:', err);
            copyButton.textContent = 'Copy failed';
          }
          
          document.body.removeChild(textarea);
        });
      });
      
      // Add button to code block
      pre.appendChild(copyButton);
    });
  }

  /** Initialize script */
  function initScript() {
    // Process initially loaded code blocks
    addCopyButtonsToCodeBlocks();
    
    // Watch for DOM changes to handle dynamically loaded code blocks
    const observer = new MutationObserver((mutations) => {
      let hasNewPre = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          
          // Check for new pre elements or nodes that might contain pre elements
          const hasPreNodes = addedNodes.some(node => {
            if (node.nodeName === 'PRE') return true;
            if (node.nodeType === 1 && node.querySelector('pre')) return true;
            return false;
          });
          
          if (hasPreNodes) {
            hasNewPre = true;
          }
        }
      });
      
      if (hasNewPre) {
        addCopyButtonsToCodeBlocks();
      }
    });
    
    // Start observing document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Start script when page is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
  } else {
    initScript();
  }
})();