// ==UserScript==
// @name         Trello remove padding
// @namespace    Violentmonkey Scripts
// @version      1.5
// @description  Remove header and remove bottom padding
// @match        https://trello.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543017/Trello%20remove%20padding.user.js
// @updateURL https://update.greasyfork.org/scripts/543017/Trello%20remove%20padding.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Helper to wait for a selector to appear
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;

      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if ((elapsed += interval) >= timeout) {
          clearInterval(timer);
          reject(new Error(`Timeout: ${selector} not found`));
        }
      }, interval);
    });
  }

  function removeHeadersAndStyleBoard() {
    // Remove all elements with data-js-id="header-container"
    document.querySelectorAll('[data-js-id="header-container"]').forEach(el => el.remove());

    // Remove specific header
    const header = document.querySelector(
      '#trello-board-root > div > div > div > div.board-header.u-clearfix.js-board-header.board-header-redesign-blur'
    );
    if (header) header.remove();

    // Adjust #board styles
    const board = document.querySelector('#board');
    if (board) {
      board.style.setProperty('padding-bottom', '0', 'important');
      board.style.setProperty('margin-bottom', '0');
    }

    // Adjust .board-canvas margin-top
    const canvas = document.querySelector('.board-canvas');
    if (canvas) {
      canvas.style.setProperty('margin-top', '0');
    }

    document.querySelectorAll(`
      #island-nav > div:nth-child(1),
      #island-nav > div:nth-child(2),
      #island-nav > div:nth-child(3),
      #island-nav > span
    `).forEach(el => el.remove());
  }

  var columns = document.querySelectorAll(`#board > li`);

for (let columnIndex = 0; columnIndex < columns.length - 1; columnIndex++) {
	var button = columns[columnIndex].querySelector('div > div > button:nth-child(2)');

	button.addEventListener('click', async (event) => handleClick(event));
}

var parent, liElements, e;

var handleClick = async (event) => {
	var texts = [];
	e = event;
	parent = event.target.parentElement.parentElement.parentElement.parentElement;
	liElements = parent.querySelectorAll(`div > ol > li`);
	
	for (let index = 0; index < liElements.length; index++) {
		texts.push(liElements[index].querySelector(`div > div > div > div > span > a`).textContent);
	}
	
	let text = '';
	
	for (var index = 0; index < texts.length; index++) {
		text += `${index + 1}. ${texts[index]}\n`;
	}
	
	alert(text);
	await navigator.clipboard.writeText(text);
};

  // Run when DOM is ready and target element exists
  window.addEventListener('load', () => {
    waitForElement('#board').then(removeHeadersAndStyleBoard).catch(console.warn);
  });
})();