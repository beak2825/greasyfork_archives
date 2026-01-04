// ==UserScript==
// @name         大牛多邻国快速切题 / 提交 / 重做
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Perform actions on key press on Daniuduolingo
// @author       Eunice
// @match        https://daniuduolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496983/%E5%A4%A7%E7%89%9B%E5%A4%9A%E9%82%BB%E5%9B%BD%E5%BF%AB%E9%80%9F%E5%88%87%E9%A2%98%20%20%E6%8F%90%E4%BA%A4%20%20%E9%87%8D%E5%81%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/496983/%E5%A4%A7%E7%89%9B%E5%A4%9A%E9%82%BB%E5%9B%BD%E5%BF%AB%E9%80%9F%E5%88%87%E9%A2%98%20%20%E6%8F%90%E4%BA%A4%20%20%E9%87%8D%E5%81%9A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addUserSelectAll () {
    let style = document.createElement('style');
    style.innerHTML = `:not(input,textarea) { user-select: auto !important; }`;
    document.head.appendChild(style);
  }

  // Call the functions to remove and add the CSS rules
  addUserSelectAll();
  // Function to simulate multiple mouse events
  function simulateMouseEvents (element, events) {
    if (element) {
      events.forEach(eventType => {
        var event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window
        });
        element.dispatchEvent(event);
      });
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey) {
      let elements, targetElement, events = ['click'];

      // Skip ArrowRight and ArrowLeft if the active element is a textarea
      if (document.activeElement.tagName.toLowerCase() === 'textarea' &&
        (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        return;
      }

      if (event.key === 'ArrowRight') {
        elements = document.getElementsByClassName('nextPreviewBtns');
        if (elements.length > 0) {
          targetElement = elements[elements.length - 1].lastElementChild;
        }
      } else if (event.key === 'ArrowLeft') {
        elements = document.getElementsByClassName('nextPreviewBtns');
        if (elements.length > 0) {
          targetElement = elements[0].lastElementChild;
        }
      } else if (event.key === 'Enter') {
        elements = document.getElementsByClassName('btnRight');
        if (elements.length > 0) {
          let submitButton = elements[0].lastElementChild;
          if (submitButton.disabled) {
            elements = document.getElementsByClassName('el-textarea__inner');
            if (elements.length > 0) {
              elements[0].focus();
              return;
            }
          } else {
            targetElement = submitButton;
          }
        }
      } else if (event.key === '`') { // Check for Ctrl + `
        elements = document.getElementsByClassName('volume');
        if (elements.length > 0) {
          targetElement = elements[0];
        }
      } else if (event.key === 'Q' || event.key === 'q') {
        elements = document.getElementsByClassName('itemTitle');
        if (elements.length > 0) {
          targetElement = elements[0];
        }
      }

      if (targetElement) {
        simulateMouseEvents(targetElement, events);
      }
    }
  });
})();
