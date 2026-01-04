// ==UserScript==
// @name         Selection Context
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Get the selected text along with text before and after the selection
// @author       RoCry
// @license MIT
// ==/UserScript==

/**
 * Gets the selected text along with text before and after the selection
 * @param {number} tryContextLength - Desired length of context to try to collect (before + after selection)
 * @returns {Object} Object containing selectedHTML, selectedText, textBefore, textAfter, paragraphText
 */
function GetSelectionContext(tryContextLength = 500) {
  const MAX_CONTEXT_LENGTH = 8192; // 8K characters max (reduced from 16K)
  const actualContextLength = Math.min(tryContextLength, MAX_CONTEXT_LENGTH);
  const halfContextLength = Math.floor(actualContextLength / 2);

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
    return { selectedHTML: null, selectedText: null, textBefore: null, textAfter: null, paragraphText: null };
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  
  // Improved HTML extraction
  let selectedHTML;
  try {
    // Method 1: Try to get HTML with surrounding elements
    const clonedRange = range.cloneRange();
    const container = document.createElement('div');
    container.appendChild(clonedRange.cloneContents());
    
    // If selection starts/ends in the middle of an element, we need to recreate parent structure
    const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer;
      
    if (parentElement && parentElement.nodeName !== 'BODY') {
      // Get the parent element's tag name and recreate it
      const tagName = parentElement.nodeName.toLowerCase();
      selectedHTML = `<${tagName}>${container.innerHTML}</${tagName}>`;
    } else {
      selectedHTML = container.innerHTML;
    }
  } catch (e) {
    // Fallback method
    console.error('Error extracting HTML from selection:', e);
    selectedHTML = selectedText;
  }

  // Helper function to get text nodes in document order
  function getTextNodesIn(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    let currentNode;
    while (currentNode = walk.nextNode()) {
      textNodes.push(currentNode);
    }
    return textNodes;
  }

  // Get all text nodes in document
  const allTextNodes = getTextNodesIn(document.body);

  // Find start and end text nodes of the selection
  const startNode = range.startContainer;
  const endNode = range.endContainer;

  let textBefore = '';
  let textAfter = '';

  // Collect text before the selection
  let beforeIndex = allTextNodes.findIndex(node => node === startNode) - 1;
  let currentLength = 0;

  // First add partial text from the start node itself
  if (startNode.nodeType === Node.TEXT_NODE) {
    textBefore = startNode.textContent.substring(0, range.startOffset) + textBefore;
    currentLength = textBefore.length;
  }

  // Then add text from previous nodes
  while (beforeIndex >= 0 && currentLength < halfContextLength) {
    const node = allTextNodes[beforeIndex];
    const nodeText = node.textContent;

    // Add the entire node's text
    textBefore = nodeText + '\n' + textBefore;
    currentLength += nodeText.length;

    beforeIndex--;
  }

  // If we didn't get enough context, add ellipsis
  if (beforeIndex >= 0) {
    textBefore = '...\n' + textBefore;
  }

  // Collect text after the selection
  let afterIndex = allTextNodes.findIndex(node => node === endNode) + 1;
  currentLength = 0;

  // First add partial text from the end node itself
  if (endNode.nodeType === Node.TEXT_NODE) {
    textAfter += endNode.textContent.substring(range.endOffset);
    currentLength = textAfter.length;
  }

  // Then add text from subsequent nodes
  while (afterIndex < allTextNodes.length && currentLength < halfContextLength) {
    const node = allTextNodes[afterIndex];
    const nodeText = node.textContent;

    // Add the entire node's text
    textAfter += nodeText + '\n';
    currentLength += nodeText.length;

    afterIndex++;
  }

  // If we didn't get all the text, add ellipsis
  if (afterIndex < allTextNodes.length) {
    textAfter += '\n...';
  }

  // Clean up and trim the text
  textBefore = textBefore.trim();
  textAfter = textAfter.trim();

  // Combine everything for paragraph text
  const paragraphText = (textBefore + ' ' + selectedText + ' ' + textAfter).trim();

  return { selectedHTML, selectedText, textBefore, textAfter, paragraphText };
}

// Export the function for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GetSelectionContext };
} else {
  // For direct browser use
  window.SelectionUtils = window.SelectionUtils || {};
  window.SelectionUtils.GetSelectionContext = GetSelectionContext;
}
