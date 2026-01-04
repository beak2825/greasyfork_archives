// ==UserScript==
// @name         Dragon Tea Decipher
// @namespace    https://github.com/BobbyWibowo
// @version      1.1.3
// @description  Decipher Atbash cipher on Dragon Tea website, to facilitate customizing display font.
// @author       Bobby Wibowo
// @license      MIT
// @match        *://dragontea.ink/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dragontea.ink
// @run-at       document-end
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/sentinel-js@0.0.7/dist/sentinel.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/530679/Dragon%20Tea%20Decipher.user.js
// @updateURL https://update.greasyfork.org/scripts/530679/Dragon%20Tea%20Decipher.meta.js
// ==/UserScript==

/* global sentinel */

(function () {
  'use strict';

  const _LOG_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });

  const log = (message, ...args) => {
    const prefix = `[${_LOG_TIME_FORMAT.format(Date.now())}]: `;
    if (typeof message === 'string') {
      return console.log(prefix + message, ...args);
    } else {
      return console.log(prefix, message, ...args);
    }
  };

  /** CONFIG **/

  const SELECTORS_ARTICLE = '.chapter-type-text .reading-content .text-left, ' +
    '.wp-manga-genre-novels .description-summary .summary__content';

  const ENV = {
    MODE: GM_getValue('MODE', 'PROD')
  };

  let logDebug = () => {};
  if (ENV.MODE !== 'PROD') {
    log('MODE =', ENV.MODE);
    logDebug = log;
  }

  /** UTILS **/

  const traverseElement = (element, func) => {
    // Preserve <script> and <style> elements.
    if (['SCRIPT', 'STYLE'].includes(element.tagName)) {
      return false;
    }

    let child = element.lastChild;
    while (child) {
      if (child.nodeType === 1) {
        traverseElement(child, func);
      } else if (child.nodeType === 3) {
        // Only do function on Text nodes.
        // https://developer.mozilla.org/en-US/docs/Web/API/Text
        func(child);
      }
      child = child.previousSibling;
    }
    return true;
  };

  const enAtbash = string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const tebahpla = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
    const alphabetLower = 'abcdefghijklmnopqrstuvwxyz';
    const tebahplaLower = 'zyxwvutsrqponmlkjihgfedcba';

    let decodedString = '';
    for (let i = 0; i < string.length; i++) {
      const codedLetter = string.charAt(i);

      if (/[^a-zA-Z]/.test(string[i])) {
        decodedString += string[i];
      } else if (string[i] === string[i].toUpperCase()) {
        const letterIndex = alphabet.indexOf(codedLetter);
        const tebalphaLetter = tebahpla.charAt(letterIndex);
        decodedString += tebalphaLetter;
      } else {
        const letterIndex = alphabetLower.indexOf(codedLetter);
        const tebalphaLetter = tebahplaLower.charAt(letterIndex);
        decodedString += tebalphaLetter;
      }
    }
    return decodedString;
  };

  const doArticle = element => {
    if (element.dataset.cipherUndone) {
      return false;
    }

    // Mark as processed.
    element.dataset.cipherUndone = true;

    let _children = 0;

    traverseElement(element, child => {
      // https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data
      child.data = enAtbash(child.data);
      _children++;
    });

    if (_children > 0) {
      logDebug(`Called enAtbash() on ${_children} child node(s).`);
    }

    return true;
  };

  sentinel.on(SELECTORS_ARTICLE, element => {
    if (doArticle(element)) {
      log('Deciphered article.');
    }
  });
})();