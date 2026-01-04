// ==UserScript==
// @name         ULR date
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Modify date
// @author       Me
// @match        https://www.playunlight.online/*
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529195/ULR%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/529195/ULR%20date.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let toggle = false;
  const OriginalDate = Date;

  function PatchedDate(...args) {
    const now = new OriginalDate();
    if (toggle) {
      now.setDate(now.getDate() + 3);
      now.setMinutes(now.getMinutes() + 1);
    }
    return now;
  }
  PatchedDate.prototype = OriginalDate.prototype;
  Object.setPrototypeOf(PatchedDate, OriginalDate);

  Date = PatchedDate;

  function addToggle() {
    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'toggle-switch';

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'myToggle';

    const toggleSpan = document.createElement('span');
    toggleSpan.className = 'slider';

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSpan);

    document.body.appendChild(toggleLabel);

    const style = document.createElement('style');
    style.innerHTML = `
        .toggle-switch {
            position: fixed;
            top: 20px;
            right: 20px;
            display: inline-block;
            cursor: pointer;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            width: 50px;
            height: 24px;
            background-color: #ccc;
            border-radius: 24px;
            transition: 0.4s;
        }

        .slider:before {
            content: "";
            position: absolute;
            width: 18px;
            height: 18px;
            background-color: white;
            border-radius: 50%;
            top: 3px;
            left: 3px;
            transition: 0.4s;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }
    `;
    document.head.appendChild(style);
    return toggleInput;
  }
  const toggleInput = addToggle();
  toggleInput.addEventListener('change', function () {
    toggle = !toggle;
    console.log('ULR date:', toggle ? 'ON' : 'OFF');
  });
})();
