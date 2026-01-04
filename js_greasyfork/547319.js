// ==UserScript==
// @name         Universal Text Reversal bypass
// @namespace    github.com/annaroblox
// @version      2.3
// @license      MIT
// @description  Bypass filters by reversing text structure. Modes: (Full) character reversal, (Smart) character-pair swap, (Word Swap) logical word reordering, or (Smart-Swap) combined word & character swap. Visually, the text looks normal.
// @author       AnnaRoblox
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/547319/Universal%20Text%20Reversal%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/547319/Universal%20Text%20Reversal%20bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- CONFIG ---------- */
    const STORAGE_KEY = 'utr_mode';
    const RLO = "\u202E";  // RIGHT-TO-LEFT OVERRIDE
    const PDF = "\u202C";  // POP DIRECTIONAL FORMATTING
    const RLI = "\u2067";  // RIGHT-TO-LEFT ISOLATE
    const LRI = "\u2066";  // LEFT-TO-RIGHT ISOLATE
    const PDI = "\u2069";  // POP DIRECTIONAL ISOLATE

    let isDebugMode = false;
    let mode        = localStorage.getItem(STORAGE_KEY) || 'smart-swap';
    let menuCommandIds = []; // Array to store menu command IDs for unregistering

    /* ---------- CORE TEXT TRANSFORM ---------- */

    const reverseLines = text =>
        text.split('\n')
            .map(l => RLO + [...l].reverse().join('') + PDF)
            .join('\n');

    /**
     * wordIsolateSwap function
     * How it works:
     * This method swaps adjacent pairs of words but preserves the visual appearance.
     * e.g., "hello how are you" becomes "how hello you are" (stored) but displays as "hello how are you"
     * 1. Adjacent word pairs are swapped: (hello,how) -> (how,hello), (are,you) -> (you,are)
     * 2. Each swapped pair is wrapped in RLI...PDI, creating a Right-to-Left context that reverses them back.
     * 3. Each individual word is wrapped in LRI...PDI to force Left-to-Right rendering.
     * 4. The browser renders each RTL pair, swapping them back to appear normal.
     */
    const wordIsolateSwap = text =>
      text
        .split('\n')
        .map(line => {
          const words = line.match(/\S+/g) || [];
          if (words.length === 0) return line;

          // Swap adjacent pairs of words
          const swappedWords = [];
          for (let i = 0; i < words.length; i += 2) {
            if (i + 1 < words.length) {
              // Swap the pair
              swappedWords.push(words[i + 1]);
              swappedWords.push(words[i]);
            } else {
              // Odd word out, keep it in place
              swappedWords.push(words[i]);
            }
          }

          // Wrap each pair in RLI...PDI to reverse it back for display
          let result = '';
          for (let i = 0; i < swappedWords.length; i += 2) {
            if (i + 1 < swappedWords.length) {
              // Wrap the swapped pair to reverse it for display
              result += RLI + LRI + swappedWords[i] + PDI + ' ' + LRI + swappedWords[i + 1] + PDI + PDI;
              // Add space between pairs
              if (i + 2 < swappedWords.length) result += ' ';
            } else {
              // Odd word out, just wrap it normally
              result += LRI + swappedWords[i] + PDI;
            }
          }

          return result;
        })
        .join('\n');

   /**
 * smartSwap function - combines word swapping with character pair swapping
 * Structure: RLI + [LRI + char-swapped-word + PDI] + SPACE + [LRI + char-swapped-word + PDI] + PDI
 * - Character pairs within each word are swapped using RLI+RLO+chars+PDI
 * - Each complete word is wrapped in LRI...PDI
 * - Adjacent word pairs are physically swapped in storage
 * - The outer RLI...PDI reverses the word order for correct display
 */
const smartSwap = text =>
  text
    .split('\n')
    .map(line => {
      const words = line.match(/\S+/g) || [];
      if (words.length === 0) return line;

      // Apply character pair swapping to each word
      const processedWords = words.map(word => {
        const chars = [...word];
        let charSwapped = '';
        for (let i = 0; i < chars.length; i += 2) {
          if (i + 1 < chars.length) {
            // Swap the pair: chars[i+1] + chars[i]
            const swappedPair = chars[i + 1] + chars[i];
            charSwapped += RLI + RLO + swappedPair + PDI;
          } else {
            charSwapped += chars[i];
          }
        }
        // Wrap entire word in LRI...PDI
        return LRI + charSwapped + PDI;
      });

      // Swap adjacent pairs of words
      const swappedWords = [];
      for (let i = 0; i < processedWords.length; i += 2) {
        if (i + 1 < processedWords.length) {
          swappedWords.push(processedWords[i + 1]);
          swappedWords.push(processedWords[i]);
        } else {
          swappedWords.push(processedWords[i]);
        }
      }

      // Wrap all pairs in RLI...PDI to reverse word order for display
      let result = '';
      for (let i = 0; i < swappedWords.length; i += 2) {
        if (i + 1 < swappedWords.length) {
          // Wrap the swapped pair in RLI...PDI
          result += RLI + swappedWords[i] + ' ' + swappedWords[i + 1] + PDI;
          if (i + 2 < swappedWords.length) result += ' ';
        } else {
          // Odd word out
          result += swappedWords[i];
        }
      }

      return result;
    })
    .join('\n');

    /**
     * Selective word swap - swaps any specified word pairs
     * For each pair:
     * - If one word is the last word: first word output normally, then RLI block with rest reversed
     * - Otherwise: reverse the entire range between them
     */
    const selectiveWordSwap = (text, indicesToSwap) => {
      return text
        .split('\n')
        .map(line => {
          const words = line.match(/\S+/g) || [];
          if (words.length === 0) return line;

          // Create swap pairs (ensure min, max order)
          const swapPairs = [];
          for (let i = 0; i < indicesToSwap.length; i += 2) {
            if (i + 1 < indicesToSwap.length) {
              const idx1 = indicesToSwap[i];
              const idx2 = indicesToSwap[i + 1];
              swapPairs.push([Math.min(idx1, idx2), Math.max(idx1, idx2)]);
            }
          }

          // Build result
          let result = '';
          const processed = new Set();

          for (let i = 0; i < words.length; i++) {
            if (processed.has(i)) continue;

            // Check if this index starts a swap pair
            const pair = swapPairs.find(p => p[0] === i);

            if (pair) {
              const [startIdx, endIdx] = pair;

              // Special case: if swapping with the last word
              if (endIdx === words.length - 1) {
                // Output the first swapped word normally
                result += LRI + words[startIdx] + PDI;
                processed.add(startIdx);

                // Add space before RLI block if there are words in between
                if (startIdx + 1 <= endIdx) result += ' ';

                // Start RLI block
                result += RLI;

                // Add words from startIdx+1 to endIdx in REVERSE order
                for (let j = endIdx; j >= startIdx + 1; j--) {
                  result += LRI + words[j] + PDI;
                  if (j > startIdx + 1) result += ' ';
                  processed.add(j);
                }

                // End RLI block
                result += PDI;
              } else {
                // Normal case: reverse the entire range
                // Start RLI block
                result += RLI;

                // Add words in REVERSE order (from end to start)
                for (let j = endIdx; j >= startIdx; j--) {
                  result += LRI + words[j] + PDI;
                  if (j > startIdx) result += ' ';
                  processed.add(j);
                }

                // End RLI block
                result += PDI;
              }

              // Add space after the block if not at the end
              if (endIdx + 1 < words.length) result += ' ';
            } else {
              // Not part of a swap, check if already processed
              if (!processed.has(i)) {
                result += LRI + words[i] + PDI;
                processed.add(i);
                // Add space after the word if not at the end
                if (i + 1 < words.length) result += ' ';
              }
            }
          }

          return result;
        })
        .join('\n');
    };

    /**
     * smartReverse function
     * How it works: Swaps pairs of characters within each word.
     */
    const smartReverse = text =>
      text
        .split('\n')
        .map(line => {
          const tokens = line.match(/(\s+|\S+)/g) || [];
          const transformedTokens = tokens.map(tk => {
            if (/^\s+$/.test(tk)) return tk;
            const chars = [...tk];
            let processedWord = '';
            for (let i = 0; i < chars.length; i += 2) {
              if (i + 1 < chars.length) {
                const swappedPair = chars[i + 1] + chars[i];
                processedWord += RLI + RLO + swappedPair + PDI;
              } else {
                processedWord += chars[i];
              }
            }
            return processedWord;
          });
          return transformedTokens.join('');
        })
        .join('\n');

    // Dispatcher function to select the correct transformation
    const transform = txt => {
        switch (mode) {
            case 'full':
                return reverseLines(txt);
            case 'wordswap':
                return wordIsolateSwap(txt);
            case 'smart-swap':
                return smartSwap(txt);
            case 'smart':
            default:
                return smartReverse(txt);
        }
    };

    /* ---------- WORD SELECTION UI ---------- */

    function createWordSelectionModal(text) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'utr-word-selector-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;

        // Create modal container
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Select Words to Swap';
        title.style.cssText = 'margin: 0 0 15px 0; color: #333;';
        modal.appendChild(title);

        // Instructions
        const instructions = document.createElement('p');
        instructions.textContent = 'Click words in pairs to swap them. When swapping with the last word, middle words stay in place. Otherwise, the entire range is reversed.';
        instructions.style.cssText = 'margin: 0 0 15px 0; color: #666; font-size: 14px;';
        modal.appendChild(instructions);

        // Word container
        const wordContainer = document.createElement('div');
        wordContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
            min-height: 60px;
        `;

        const words = text.match(/\S+/g) || [];
        const selectedIndices = [];
        const wordElements = [];

        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.dataset.index = index;
            wordSpan.style.cssText = `
                padding: 6px 12px;
                background: white;
                border: 2px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                user-select: none;
            `;

            wordSpan.addEventListener('click', () => {
                const idx = parseInt(wordSpan.dataset.index);
                const selectedIdx = selectedIndices.indexOf(idx);

                if (selectedIdx > -1) {
                    // Deselect
                    selectedIndices.splice(selectedIdx, 1);
                    wordSpan.style.background = 'white';
                    wordSpan.style.borderColor = '#ddd';
                    wordSpan.style.color = 'black';
                } else {
                    // Select
                    selectedIndices.push(idx);
                    const pairIndex = selectedIndices.length - 1;
                    const color = pairIndex % 2 === 0 ? '#4CAF50' : '#2196F3';
                    wordSpan.style.background = color;
                    wordSpan.style.borderColor = color;
                    wordSpan.style.color = 'white';
                }
            });

            wordElements.push(wordSpan);
            wordContainer.appendChild(wordSpan);
        });

        modal.appendChild(wordContainer);

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        // Apply button
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply Swap';
        applyBtn.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;
        applyBtn.addEventListener('click', () => {
            if (selectedIndices.length >= 2) {
                const transformed = selectiveWordSwap(text, selectedIndices);
                applyTransformedText(transformed);
            }
            document.body.removeChild(overlay);
        });

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(applyBtn);
        modal.appendChild(buttonContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    function applyTransformedText(transformed) {
        const sel = window.getSelection();
        const inputInfo = locateRealInput(sel.focusNode || document.activeElement);

        if (!inputInfo) {
            copyToClipboard(transformed);
            try { document.execCommand('insertText', false, transformed); }
            catch (e) { copyToClipboard(transformed); }
            return;
        }

        const { element: el, type } = inputInfo;
        let start, end;

        if (type === 'input' || type === 'textarea') {
            start = el.selectionStart ?? 0;
            end = el.selectionEnd ?? 0;
        } else {
            const range = sel.rangeCount ? sel.getRangeAt(0) : null;
            if (!range) { start = end = 0; }
            else {
                const pre = range.cloneRange();
                pre.selectNodeContents(el);
                pre.setEnd(range.startContainer, range.startOffset);
                start = pre.toString().length;
                end = start + range.toString().length;
            }
        }

        replaceTextInInput(el, type, transformed, start, end);
    }

    /* ---------- UI / MENU ---------- */
    function buildMenu() {
        menuCommandIds.forEach(id => GM_unregisterMenuCommand(id));
        menuCommandIds = [];

        menuCommandIds.push(
            GM_registerMenuCommand('Process selected text', processSelection)
        );

        menuCommandIds.push(
            GM_registerMenuCommand(
                `Mode: ${mode.toUpperCase()} (click to toggle)`,
                () => {
                    const modes = ['full', 'smart', 'wordswap', 'smart-swap'];
                    const currentIndex = modes.indexOf(mode);
                    mode = modes[(currentIndex + 1) % modes.length]; // Cycle through the modes
                    localStorage.setItem(STORAGE_KEY, mode);
                    buildMenu();
                },
                'm'
            )
        );

        menuCommandIds.push(
            GM_registerMenuCommand(
                `DEBUG: ${isDebugMode ? 'ON' : 'OFF'} (click to toggle)`,
                () => { isDebugMode = !isDebugMode; buildMenu(); },
                'd'
            )
        );
    }

    /* ---------- CLIPBOARD & INPUT HANDLING ---------- */

    function copyToClipboard(textToCopy) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(textToCopy);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).catch(console.error);
        } else {
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            ta.style.position = 'fixed'; ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
        }
    }

    function isEditableElement(el) {
        if (!el || !el.nodeType || el.nodeType !== 1) return false;
        const tag = el.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return true;
        if (el.contentEditable === 'true' || el.isContentEditable || el.designMode === 'on') return true;
        const role = el.getAttribute('role');
        if (role === 'textbox' || role === 'searchbox') return true;
        return false;
    }

    function findEditableInShadowDOM(root) {
        if (!root) return null;
        if (root.activeElement && isEditableElement(root.activeElement)) return root.activeElement;
        if (root.activeElement?.shadowRoot) {
            const found = findEditableInShadowDOM(root.activeElement.shadowRoot);
            if (found) return found;
        }
        const selectors = ['input:not([type="hidden"])', 'textarea', '[contenteditable="true"]', '[role="textbox"]', '[role="searchbox"]'];
        for (const selector of selectors) {
            const el = root.querySelector(selector);
            if (el && isEditableElement(el)) return el;
        }
        return null;
    }

    function locateRealInput(node) {
        let cur = node;
        while (cur) {
            if (cur.nodeType === 1 && isEditableElement(cur)) {
                const tag = cur.tagName?.toLowerCase();
                return { element: cur, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
            }
            if (cur.shadowRoot) {
                const shadowEditable = findEditableInShadowDOM(cur.shadowRoot);
                if (shadowEditable) {
                    const tag = shadowEditable.tagName?.toLowerCase();
                    return { element: shadowEditable, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                }
            }
            cur = cur.parentNode || cur.host;
            if (!cur && node.getRootNode) {
                const root = node.getRootNode();
                if (root?.host) cur = root.host;
            }
        }
        let active = document.activeElement;
        while (active) {
            if (isEditableElement(active)) {
                const tag = active.tagName?.toLowerCase();
                return { element: active, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
            }
            if (active.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
            else if (active.shadowRoot) {
                const shadowEditable = findEditableInShadowDOM(active.shadowRoot);
                if (shadowEditable) {
                    const tag = shadowEditable.tagName?.toLowerCase();
                    return { element: shadowEditable, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                }
                break;
            } else break;
        }
        try {
            for (const frame of document.querySelectorAll('iframe')) {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow?.document;
                    if (frameDoc?.activeElement && isEditableElement(frameDoc.activeElement)) {
                        const tag = frameDoc.activeElement.tagName?.toLowerCase();
                        return { element: frameDoc.activeElement, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                    }
                } catch (e) { /* Cross-origin */ }
            }
        } catch (e) {}
        return null;
    }

    function replaceTextInInput(el, type, reversed, start, end) {
        if (type === 'input' || type === 'textarea') {
            const original = el.value;
            const replacement = original.slice(0, start) + reversed + original.slice(end);
            const scrollTop = el.scrollTop;
            el.value = replacement;
            el.setSelectionRange(start, start + reversed.length);
            el.scrollTop = scrollTop;
            el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            const sel = window.getSelection();
            if (document.queryCommandSupported('insertText')) {
                try {
                    if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        if (start !== end) range.deleteContents();
                    }
                    document.execCommand('insertText', false, reversed);
                    el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                    return;
                } catch (e) {}
            }
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(reversed);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                sel.removeAllRanges();
                sel.addRange(range);
                el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            }
        }
    }

    function processSelection() {
        const sel = window.getSelection();
        const inputInfo = locateRealInput(sel.focusNode || document.activeElement);

        if (!inputInfo) {
            const selected = sel.toString();
            if (selected) {
                const reversed = transform(selected);
                if (isDebugMode) copyToClipboard(reversed);
                try { document.execCommand('insertText', false, reversed); }
                catch (e) { copyToClipboard(reversed); }
            }
            return;
        }

        const { element: el, type } = inputInfo;
        let original, start, end;

        if (type === 'input' || type === 'textarea') {
            original = el.value;
            start = el.selectionStart ?? 0;
            end   = el.selectionEnd ?? 0;
        } else {
            original = el.textContent || '';
            const range = sel.rangeCount ? sel.getRangeAt(0) : null;
            if (!range) { start = end = 0; }
            else {
                const pre = range.cloneRange();
                pre.selectNodeContents(el);
                pre.setEnd(range.startContainer, range.startOffset);
                start = pre.toString().length;
                end   = start + range.toString().length;
            }
        }

        const chunk = (start === end) ? original : original.slice(start, end);
        if (!chunk) return;

        const reversed = transform(chunk);
        if (isDebugMode) copyToClipboard(reversed);
        replaceTextInInput(el, type, reversed, start, end);
    }

    function openWordSelectorForSelection() {
        const sel = window.getSelection();
        const inputInfo = locateRealInput(sel.focusNode || document.activeElement);

        let selectedText = '';

        if (!inputInfo) {
            selectedText = sel.toString();
        } else {
            const { element: el, type } = inputInfo;
            if (type === 'input' || type === 'textarea') {
                const start = el.selectionStart ?? 0;
                const end = el.selectionEnd ?? 0;
                selectedText = el.value.slice(start, end);
            } else {
                const range = sel.rangeCount ? sel.getRangeAt(0) : null;
                if (range) {
                    selectedText = range.toString();
                }
            }
        }

        if (selectedText && selectedText.trim()) {
            createWordSelectionModal(selectedText);
        }
    }

    // Alt + R for normal processing
    document.addEventListener('keydown', e => {
        if (e.altKey && !e.ctrlKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            processSelection();
        }
    }, true);

    // Ctrl + Alt + R for word selector
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            openWordSelectorForSelection();
        }
    }, true);

    buildMenu();
})();