// ==UserScript==
// @name         Keymap Overlay For Monkeytype
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify keymap layout by replacing keys, works with keymap next
// @author       Pira
// @match        https://monkeytype.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466946/Keymap%20Overlay%20For%20Monkeytype.user.js
// @updateURL https://update.greasyfork.org/scripts/466946/Keymap%20Overlay%20For%20Monkeytype.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keyMapping = {
        q: "q",
        w: "w",
        e: "e",
        r: "r",
        t: "t",
        y: "y",
        u: "u",
        i: "i",
        o: "o",
        p: "p",
        "[": "[",
        "]": "]",
        a: "a",
        s: "s",
        d: "d",
        f: "f",
        g: "g",
        h: "h",
        j: "j",
        k: "k",
        l: "l",
        ";": ";",
        "'": "'",
        z: "z",
        x: "x",
        c: "c",
        v: "v",
        b: "b",
        n: "n",
        m: "m",
        ',': ",",
        '.': ".",
        '/': "/"
    };

    async function modifyKeymap() {
  const keys = document.querySelectorAll('.keymapKey');
  const updatedMapping = {};

  keys.forEach(function(key) {
    const letter = key.querySelector('.letter');
    const currentKey = letter.textContent.toLowerCase();
    const newKey = keyMapping[currentKey];

      if (currentKey === ',<' && keyMapping[currentKey]) {
                letter.textContent = keyMapping[currentKey];}
    if (newKey) {
      const tempValue = letter.textContent;
      letter.textContent = newKey;
      key.setAttribute('data-key', newKey.toLowerCase() + newKey.toUpperCase());
      updatedMapping[newKey.toLowerCase()] = currentKey;
    } else {
      updatedMapping[currentKey] = currentKey;
    }
  });

  Object.assign(keyMapping, updatedMapping);
}


    function updateActiveKey() {
        const activeKeyElement = document.querySelector('.activeKey');
        const activeKey = activeKeyElement.textContent.toLowerCase();
        const mappedKey = keyMapping[activeKey];

        if (mappedKey) {
            activeKeyElement.textContent = mappedKey.toUpperCase();
        }
    }

    // Right-click event listener
    window.addEventListener("contextmenu", async function(event) {
        event.preventDefault();

        // Modify the keymap
        await modifyKeymap();

        // Update the active key
        updateActiveKey();
    });
})();
