// ==UserScript==
// @name         Glagolitic Transliterator (Latin + Cyrillic)
// @namespace    http://glagolitic.page/
// @version      1.1
// @description  Transliterates both Cyrillic and Latin text into Glagolitic script
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538611/Glagolitic%20Transliterator%20%28Latin%20%2B%20Cyrillic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538611/Glagolitic%20Transliterator%20%28Latin%20%2B%20Cyrillic%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Combined mapping
  const map = {
    // Cyrillic
    'а': 'ⰰ', 'б': 'ⰱ', 'в': 'ⰲ', 'г': 'ⰳ', 'д': 'ⰴ', 'е': 'ⰵ',
    'ж': 'ⰶ', 'з': 'ⰸ', 'и': 'ⰺ', 'ј': 'ⰻ', 'к': 'ⰽ', 'л': 'ⰾ',
    'м': 'ⰿ', 'н': 'ⱀ', 'о': 'ⱁ', 'п': 'ⱂ', 'р': 'ⱃ', 'с': 'ⱄ',
    'т': 'ⱅ', 'у': 'ⱆ', 'ф': 'ⱇ', 'х': 'ⱈ', 'ц': 'ⱌ', 'ч': 'ⱍ',
    'ш': 'ⱎ', 'щ': 'ⱋ', 'ъ': 'ⱏ', 'ы': 'ⰽⰺ', 'ь': 'ⰿ',
    'э': 'ⰵ', 'ю': 'ⱗ', 'я': 'ⱘ',

    'А': 'ⰰ', 'Б': 'ⰱ', 'В': 'ⰲ', 'Г': 'ⰳ', 'Д': 'ⰴ', 'Е': 'ⰵ',
    'Ж': 'ⰶ', 'З': 'ⰸ', 'И': 'ⰺ', 'Ј': 'ⰻ', 'К': 'ⰽ', 'Л': 'ⰾ',
    'М': 'ⰿ', 'Н': 'ⱀ', 'О': 'ⱁ', 'П': 'ⱂ', 'Р': 'ⱃ', 'С': 'ⱄ',
    'Т': 'ⱅ', 'У': 'ⱆ', 'Ф': 'ⱇ', 'Х': 'ⱈ', 'Ц': 'ⱌ', 'Ч': 'ⱍ',
    'Ш': 'ⱎ', 'Щ': 'ⱋ', 'Ъ': 'ⱏ', 'Ы': 'ⰽⰺ', 'Ь': 'ⰿ',
    'Э': 'ⰵ', 'Ю': 'ⱗ', 'Я': 'ⱘ',

    // Latin (approximated)
    'a': 'ⰰ', 'b': 'ⰱ', 'c': 'ⱌ', 'č': 'ⱍ', 'ć': 'ⱍ', 'd': 'ⰴ',
    'e': 'ⰵ', 'f': 'ⱇ', 'g': 'ⰳ', 'h': 'ⱈ', 'i': 'ⰺ', 'j': 'ⰻ',
    'k': 'ⰽ', 'l': 'ⰾ', 'm': 'ⰿ', 'n': 'ⱀ', 'o': 'ⱁ', 'p': 'ⱂ',
    'q': 'ⰽ', 'r': 'ⱃ', 's': 'ⱄ', 'š': 'ⱎ', 't': 'ⱅ', 'u': 'ⱆ',
    'v': 'ⰲ', 'w': 'ⰲ', 'x': 'ⱈ', 'y': 'ⰺ', 'z': 'ⰸ', 'ž': 'ⰶ',

    'A': 'ⰰ', 'B': 'ⰱ', 'C': 'ⱌ', 'Č': 'ⱍ', 'Ć': 'ⱍ', 'D': 'ⰴ',
    'E': 'ⰵ', 'F': 'ⱇ', 'G': 'ⰳ', 'H': 'ⱈ', 'I': 'ⰺ', 'J': 'ⰻ',
    'K': 'ⰽ', 'L': 'ⰾ', 'M': 'ⰿ', 'N': 'ⱀ', 'O': 'ⱁ', 'P': 'ⱂ',
    'Q': 'ⰽ', 'R': 'ⱃ', 'S': 'ⱄ', 'Š': 'ⱎ', 'T': 'ⱅ', 'U': 'ⱆ',
    'V': 'ⰲ', 'W': 'ⰲ', 'X': 'ⱈ', 'Y': 'ⰺ', 'Z': 'ⰸ', 'Ž': 'ⰶ'
  };

  function transliterateToGlagolitic(text) {
    return text.split('').map(char => map[char] || char).join('');
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      const tag = node.parentNode?.tagName?.toUpperCase();
      return tag && !['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(tag)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    if (/[A-Za-zА-Яа-яЉљЊњЋћЏџ]/.test(node.nodeValue)) {
      node.nodeValue = transliterateToGlagolitic(node.nodeValue);
    }
  }

  console.log("🔠 Latin and Cyrillic transliterated to Glagolitic.");
})();
