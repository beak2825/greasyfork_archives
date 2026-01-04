// ==UserScript==
// @name           Ruby Text Replacement Script
// @description    This script searches for text patterns representing ruby annotations (in the format {RUBY_B#rubyText}baseText{RUBY_E#}), converts them into <ruby> elements, and replaces the text in the DOM. It also dynamically processes new elements added to the DOM using MutationObserver.
// @description:ja このスクリプトは、ルビ注釈のテキストパターン（{RUBY_B#rubyText}baseText{RUBY_E#}形式）を検索し、<ruby>要素に変換してDOM内のテキストを置換します。また、MutationObserverを使用してDOMに新しく追加された要素も動的に処理します。
// @author         Ginoa AI
// @namespace      https://greasyfork.org/ja/users/119008-ginoaai
// @version        1.0
// @match          https://starrail.honeyhunterworld.com/*
// @match          https://hsr18.hakush.in/*
// @icon           https://pbs.twimg.com/profile_images/1648150443522940932/4TTHKbGo_400x400.png
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/523044/Ruby%20Text%20Replacement%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523044/Ruby%20Text%20Replacement%20Script.meta.js
// ==/UserScript==

// Function to replace ruby patterns in text nodes
function replaceTextPatterns(text) {
  return text.replace(/\{RUBY_B#(.*?)\}(.*?)\{RUBY_E#\}/g, function(match, rubyText, baseText) {
    return `<ruby><rb>${baseText}</rb><rt>${rubyText}</rt></ruby>`;
  });
}

// Function to traverse and replace text in text nodes
function traverseAndReplaceTextNodes(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode;
  let nodesToUpdate = [];

  // Collect all text nodes to update
  while (textNode = walker.nextNode()) {
    const originalText = textNode.nodeValue;
    const replacedText = replaceTextPatterns(originalText);

    if (originalText !== replacedText) {
      nodesToUpdate.push({ textNode, replacedText });
    }
  }

  // Perform replacements after traversal
  nodesToUpdate.forEach(({ textNode, replacedText }) => {
    const parentNode = textNode.parentNode;
    parentNode.insertAdjacentHTML('beforeend', replacedText);
    textNode.remove();
  });
}

// Initial text replacement for the document body
traverseAndReplaceTextNodes(document.body);

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (addedNode.nodeType === Node.ELEMENT_NODE) {
        traverseAndReplaceTextNodes(addedNode);
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
