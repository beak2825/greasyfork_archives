// ==UserScript==
// @name         Diamondberry
// @namespace    https://greasyfork.org/hexa.cat
// @version      1.7
// @description  Utility for GdC.
// @author       hexa.cat
// @match        https://chatroom.talkwithstranger.com/*
// @grant        none
// @run-at       document-end
// @license      MPL 2.0
// @downloadURL https://update.greasyfork.org/scripts/526194/Diamondberry.user.js
// @updateURL https://update.greasyfork.org/scripts/526194/Diamondberry.meta.js
// ==/UserScript==
(function () {
  /***** IMPORT HIGHLIGHT.JS & STYLES *****/
  if (!document.querySelector('link[href*="highlight.js"]')) {
    const hlStyle = document.createElement('link');
    hlStyle.rel = 'stylesheet';
    hlStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css';
    document.head.appendChild(hlStyle);
  }
  if (!window.hljs) {
    const hlScript = document.createElement('script');
    hlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
    document.head.appendChild(hlScript);
  }
  
  /***** INJECT CSS *****/
  const style = document.createElement('style');
  style.textContent = `
    @import url(https://fonts.bunny.net/css?family=noto-color-emoji:400);
    
    /* Emoji */
    .emoji {
      font-family: "Noto Color Emoji", serif !important;
      font-weight: 400;
      font-style: normal;
    }
    
    /* Headers: H1–H6 with custom sizes and weights.
       Inline elements inside headers inherit the header’s weight. */
    h1 { font-size: 1.5em; font-weight: 900 !important; margin: 0.3em 0; }
    h2 { font-size: 1.4em; font-weight: 800 !important; margin: 0.3em 0; }
    h3 { font-size: 1.3em; font-weight: 700 !important; margin: 0.3em 0; }
    h4 { font-size: 1.2em; font-weight: 600 !important; margin: 0.3em 0; }
    h5 { font-size: 1.1em; font-weight: 600 !important; margin: 0.3em 0; }
    h6 { font-size: 1em;   font-weight: 600 !important; margin: 0.3em 0; }
    h1 *, h2 *, h3 *, h4 *, h5 *, h6 * { font-weight: inherit !important; }
    
    /* Dark themed code block container & copy button */
    .code-block-container {
      position: relative;
      margin: 0.5em 0;
    }
    pre {
      background: #2F3136;
      color: #DCDDDE;
      padding: 8px;
      overflow: auto;
      border-radius: 4px;
      margin: 0;
    }
    code {
      background: transparent;
      color: inherit;
    }
    .hljs {
      background: transparent !important;
      color: inherit !important;
    }
    .code-copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      padding: 2px 6px;
      font-size: 0.8em;
      border-radius: 3px;
      cursor: pointer;
    }
    
    /* Spoiler styling: 1px black dot as cursor */
    .spoiler {
      background-color: black;
      color: black;
      padding: 0 2px;
      border-radius: 2px;
      cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="black"/></svg>') 0 0, auto;
    }
    .spoiler:hover {
      color: white;
    }
    
    /* Subtext styling */
    .subtext { font-size: 0.9em; color: #777; margin: 0.2em 0; }

    /* Hide .call-alert and .toast-container */
  .call-alert { display: none !important; }
  .toast-container { display: none !important; }
  `;
  document.head.appendChild(style);
  // Wait for the DOM to be fully loaded.
document.addEventListener('DOMContentLoaded', function() {
  // Check if the send button exists.
  const sendButton = document.querySelector('.btn-send');
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      // Get the editor's content.
      const editor = document.querySelector('.emojionearea-editor');
      if (editor) {
        // Retrieve the text (works if the editor is a contenteditable div or textarea).
        let text = editor.innerText || editor.value;
        // Replace every single backslash with two backslashes.
        text = text.replace(/\\/g, '\\\\');
        // Update the editor with the modified text.
        // (This means that when the system auto–unescapes a backslash,
        // it will leave one behind—allowing your inline processing to detect it.)
        if (editor.innerText !== undefined) {
          editor.innerText = text;
        } else {
          editor.value = text;
        }
      }
    });
  }
});

  
/***** INLINE PROCESSING *****/
// The helper functions below work as follows:
//
// protectEscapes() looks for any occurrence of a backslash followed by any character.
// Because the system automatically removes a single backslash, if you want to output
// a literal markdown control character (such as "*" or "_") you must type TWO backslashes.
// For example, to display a literal asterisk, type "\\*" in your input. The raw text then
// becomes "\*", which our function will catch and convert into a placeholder.
// Later, restoreEscapes() puts the intended literal character back in place.
function protectEscapes(text) {
  // Match a backslash followed by any character.
  // Note: due to the system’s behavior, a user must type two backslashes to produce
  // a raw backslash. For example, to get a literal asterisk, type "\\*".
  return text.replace(/\\(.)/g, function(match, p1) {
    return "%%LITERAL_" + p1.charCodeAt(0) + "%%";
  });
}

function restoreEscapes(text) {
  return text.replace(/%%LITERAL_(\d+)%%/g, function(match, p1) {
    return String.fromCharCode(p1);
  });
}

function processInline(text) {
  // First, protect escaped characters.
  text = protectEscapes(text);
  
  // Process combined bold+italic markers (either "*_" or "_*").
  text = text.replace(/(?:\*_|_\*)([\s\S]+?)(?:_\*|\*_)/g, '<strong><em>$1</em></strong>');
  
  // Underline combinations (allowing multiline)
  text = text.replace(/__\*\*\*([\s\S]+?)\*\*\*__/g, '<u><strong><em>$1</em></strong></u>');
  text = text.replace(/__\*\*([\s\S]+?)\*\*__/g, '<u><strong>$1</strong></u>');
  text = text.replace(/__\*([\s\S]+?)\*__/g, '<u><em>$1</em></u>');
  text = text.replace(/__(.+?)__/g, '<u>$1</u>');
  
  // Bold+italic (triple asterisks), bold (double asterisks), and italics (single asterisk, underscore, single quote, or double quote)
  text = text.replace(/\*\*\*([\s\S]+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
  text = text.replace(/_([\s\S]+?)_/g, '<em>$1</em>');
  text = text.replace(/"([\s\S]+?)"/g, '<em>$1</em>');
  
  // Strikethrough
  text = text.replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
  
  // Links (masked and unembeddable)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  text = text.replace(/<((?:https?:\/\/)[^>]+)>/g, '<a href="$1" rel="noopener noreferrer">$1</a>');
  
  // Plain links
  text = text.replace(/((?:https?:\/\/)[^\s<]+)/g, '<a href="$1" rel="noopener noreferrer">$1</a>');
  
  // Spoiler tags
  text = text.replace(/\|\|([\s\S]+?)\|\|/g, '<span class="spoiler">$1</span>');
  
  // Finally, restore the escaped characters.
  text = restoreEscapes(text);
  
  return text;
}


  
  /***** BLOCK-LEVEL PARSING *****/
  function parseMarkdown(text) {
    // 1. Protect code blocks with placeholders.
    let codeBlockPlaceholders = [];
    text = text.replace(/```(\w+)?\n([\s\S]*?)\n?```/g, function(match, lang, code) {
      let placeholder = `%%%CODEBLOCK${codeBlockPlaceholders.length}%%%`;
      codeBlockPlaceholders.push({ placeholder, lang: lang || '', code });
      return placeholder;
    });
    
    // 2. Protect inline code with placeholders.
    let inlineCodePlaceholders = [];
    text = text.replace(/`([^`]+?)`/g, function(match, code) {
      let placeholder = `%%%INLINECODE${inlineCodePlaceholders.length}%%%`;
      inlineCodePlaceholders.push({ placeholder, code });
      return placeholder;
    });
    
    // 3. Process headers (H1–H6) and subtext.
    text = text.replace(/^######\s+(.*)$/gm, function(match, p1) {
      return '<h6>' + processInline(p1.trim()) + '</h6>';
    });
    text = text.replace(/^#####\s+(.*)$/gm, function(match, p1) {
      return '<h5>' + processInline(p1.trim()) + '</h5>';
    });
    text = text.replace(/^####\s+(.*)$/gm, function(match, p1) {
      return '<h4>' + processInline(p1.trim()) + '</h4>';
    });
    text = text.replace(/^###\s+(.*)$/gm, function(match, p1) {
      return '<h3>' + processInline(p1.trim()) + '</h3>';
    });
    text = text.replace(/^##\s+(.*)$/gm, function(match, p1) {
      return '<h2>' + processInline(p1.trim()) + '</h2>';
    });
    text = text.replace(/^#\s+(.*)$/gm, function(match, p1) {
      return '<h1>' + processInline(p1.trim()) + '</h1>';
    });
    text = text.replace(/^-#\s+(.*)$/gm, function(match, p1) {
      return '<div class="subtext">' + processInline(p1.trim()) + '</div>';
    });
    
    // 4. Process block quotes.
    text = text.replace(/^>>>\s+([\s\S]+?)(?=\n\S|$)/gm, function(match, p1) {
      return '<blockquote>' + processInline(p1.trim()) + '</blockquote>';
    });
    text = text.replace(/^>\s+(.*)$/gm, function(match, p1) {
      return '<blockquote>' + processInline(p1.trim()) + '</blockquote>';
    });
    
    // 5. Process the remaining text as paragraphs.
    // Split on blank lines.
    let paragraphs = text.split(/\n\s*\n/);
    for (let i = 0; i < paragraphs.length; i++) {
      let para = paragraphs[i].trim();
      // If the paragraph already starts with a block-level tag, leave it.
      if (/^<(h[1-6]|blockquote|ul|ol|div|pre)/i.test(para)) {
        paragraphs[i] = para;
      } else {
        // Check if the paragraph is a list.
        let lines = para.split('\n');
        let isUnordered = lines.every(line => /^\s*[-*]\s+/.test(line));
        let isOrdered = lines.every(line => /^\s*\d+\.\s+/.test(line));
        if (isUnordered) {
          let out = "<ul>\n";
          for (let line of lines) {
            let item = line.replace(/^\s*[-*]\s+/, '');
            out += "<li>" + processInline(item.trim()) + "</li>\n";
          }
          out += "</ul>";
          paragraphs[i] = out;
        } else if (isOrdered) {
          let out = "<ol>\n";
          for (let line of lines) {
            let item = line.replace(/^\s*\d+\.\s+/, '');
            out += "<li>" + processInline(item.trim()) + "</li>\n";
          }
          out += "</ol>";
          paragraphs[i] = out;
        } else {
          // Normal paragraph: process inline on the entire block and convert internal newlines to <br>.
          paragraphs[i] = processInline(para).replace(/\n/g, '<br>');
        }
      }
    }
    text = paragraphs.join("\n");
    
    // 6. Reinstate inline code placeholders.
    for (let obj of inlineCodePlaceholders) {
      text = text.replace(obj.placeholder, `<code>${obj.code}</code>`);
    }
    
    // 7. Reinstate code block placeholders with a copy button.
    for (let obj of codeBlockPlaceholders) {
      let replacement;
      if (obj.lang) {
        replacement = `<div class="code-block-container">
  <button class="code-copy-button">Copy</button>
  <pre><code class="hljs language-${obj.lang}">${obj.code}</code></pre>
</div>`;
      } else {
        replacement = `<div class="code-block-container">
  <button class="code-copy-button">Copy</button>
  <pre><code class="hljs">${obj.code}</code></pre>
</div>`;
      }
      text = text.replace(obj.placeholder, replacement);
    }
    
    return text;
  }
  
  /***** EMOJI WRAPPING *****/
  const emojiRegex = /([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FBA0}-\u{1FBAF}\u{1FAD0}-\u{1FADF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]+)/gu;
  function wrapEmojisInTextNode(textNode) {
    const text = textNode.nodeValue;
    if (!emojiRegex.test(text)) return;
    emojiRegex.lastIndex = 0;
    const parts = text.split(emojiRegex);
    const fragment = document.createDocumentFragment();
    let emojiSpan = null;
    for (const part of parts) {
      if (emojiRegex.test(part)) {
        if (!emojiSpan) {
          emojiSpan = document.createElement('span');
          emojiSpan.className = 'emoji';
        }
        emojiSpan.textContent += part;
      } else {
        if (emojiSpan) {
          fragment.appendChild(emojiSpan);
          emojiSpan = null;
        }
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      }
    }
    if (emojiSpan) {
      fragment.appendChild(emojiSpan);
    }
    textNode.parentNode.replaceChild(fragment, textNode);
  }
  function wrapEmojis(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      wrapEmojisInTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains('emoji')) return;
      Array.from(node.childNodes).forEach(child => wrapEmojis(child));
    }
  }
  /***** PROCESS CHAT MESSAGES *****/
  function formatChatMessage(el) {
    if (el.dataset.formatted === 'true') return;
    
    // Replace <img class="emojione"> with its alt text.
    el.querySelectorAll('img.emojione').forEach(img => {
      const alt = img.getAttribute('alt') || '';
      const span = document.createElement('span');
      span.className = 'emoji';
      span.textContent = alt;
      img.parentNode.replaceChild(span, img);
    });
    
    const raw = el.innerText;
    const html = parseMarkdown(raw);
    el.innerHTML = html;
    
    // Apply highlight.js to code blocks if available.
    el.querySelectorAll('pre code').forEach(block => {
      if (window.hljs) {
        hljs.highlightElement(block);
      }
    });
    
    wrapEmojis(el);
    el.dataset.formatted = 'true';
    
    // Attach copy-button functionality.
    el.querySelectorAll('.code-copy-button').forEach(button => {
      button.addEventListener('click', function() {
        const codeElem = button.parentElement.querySelector('pre code');
        if (codeElem) {
          const codeText = codeElem.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            button.innerText = 'Copied!';
            setTimeout(() => { button.innerText = 'Copy'; }, 2000);
          });
        }
      });
    });
  }
  
  /***** INITIALIZATION & OBSERVER *****/
  const isMod = document.querySelector('#is_mod').value === "1";
  const originalContentMap = new Map();

  document.querySelectorAll('.chat-txt, .file-caption').forEach(el => {
    if (isMod) {
      console.log(el.innerText);
      originalContentMap.set(el, el.innerHTML);
    }
    formatChatMessage(el);
  });

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ((node.matches('.chat-txt') || node.matches('.file-caption')) && !node.dataset.formatted) {
            if (isMod) {
              console.log(node.innerText);
              originalContentMap.set(node, node.innerHTML);
            }
            formatChatMessage(node);
          } else {
            node.querySelectorAll('.chat-txt, .file-caption').forEach(el => {
              if (isMod) {
                console.log(el.innerText);
                originalContentMap.set(el, el.innerHTML);
              }
              formatChatMessage(el);
            });
          }
        }
      });
      mutation.target.querySelectorAll('.chat-txt.deleted').forEach(deletedNode => {
        const chtElement = deletedNode.closest('.cht');
        if (chtElement) {
          if (isMod) {
            const originalContent = originalContentMap.get(deletedNode);
            if (originalContent) {
              deletedNode.innerHTML = originalContent;
              deletedNode.style.color = 'red';
              deletedNode.style.fontWeight = 'bold';
              deletedNode.classList.remove('deleted');
            }
          } else {
            chtElement.style.display = 'none';
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  let messageCount = 0;

  function addMexMessage() {
    const _chatBox = document.querySelector('.chat-box');
    if (_chatBox) {
      const _mexMessage = document.createElement('div');
      _mexMessage.className = 'chat-txt mex-message';
      _mexMessage.style.display = 'none';
      _mexMessage.innerText = `
      --------------------
      This was sent with Diamondberry
      Add it here: https://diamondberry.run
      Note that whoever sent this doesn't see this message lol`;
      _chatBox.appendChild(_mexMessage);
    }
  }

  function _formatChatMessage(el) {
    if (el.dataset.formatted === 'true') return;

    // Replace <img class="emojione"> with its alt text.
    el.querySelectorAll('img.emojione').forEach(img => {
      const alt = img.getAttribute('alt') || '';
      const span = document.createElement('span');
      span.className = 'emoji';
      span.textContent = alt;
      img.parentNode.replaceChild(span, img);
    });

    const raw = el.innerText;
    const html = parseMarkdown(raw);
    el.innerHTML = html;

    // Apply highlight.js to code blocks if available.
    el.querySelectorAll('pre code').forEach(block => {
      if (window.hljs) {
        hljs.highlightElement(block);
      }
    });

    wrapEmojis(el);
    el.dataset.formatted = 'true';

    // Attach copy-button functionality.
    el.querySelectorAll('.code-copy-button').forEach(button => {
      button.addEventListener('click', function() {
        const codeElem = button.parentElement.querySelector('pre code');
        if (codeElem) {
          const codeText = codeElem.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            button.innerText = 'Copied!';
            setTimeout(() => { button.innerText = 'Copy'; }, 2000);
          });
        }
      });
    });

    // Check for mex message and hide it
    if (el.innerText.toLowerCase().includes('mex')) {
      el.style.display = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.querySelector('.btn-send');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        messageCount++;
        if (messageCount % 2 === 1) {
          addMexMessage();
        }
      });
    }
  });
})();