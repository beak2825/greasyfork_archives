// ==UserScript==
// @name         Open Links
// @namespace    https://github.com/mefengl
// @version      1.0.3
// @description  Select links with Z key and open them in new tabs
// @author       mefengl
// @match        *://*/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471560/Open%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/471560/Open%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let selectionRectangle = null;
  let elementsInsideRectangle = [];
  let countLabel = null;
  let zKeyPressed = false;
  let startX, startY;

  function createRectangle(x, y) {
    let div = document.createElement('div');
    div.style.border = '1px dashed red';
    div.style.position = 'fixed';
    div.style.pointerEvents = 'none';
    return div;
  }

  function createCountLabel() {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.bottom = '0px';
    div.style.right = '5px';
    div.style.backgroundColor = 'transparent';
    return div;
  }

  function detectElementsInRectangle() {
    elementsInsideRectangle = Array.from(document.querySelectorAll('a')).filter(el => {
      let rect = el.getBoundingClientRect();
      return rect.top >= parseInt(selectionRectangle.style.top) && rect.left >= parseInt(selectionRectangle.style.left) && rect.bottom <= (parseInt(selectionRectangle.style.top) + parseInt(selectionRectangle.style.height)) && rect.right <= (parseInt(selectionRectangle.style.left) + parseInt(selectionRectangle.style.width));
    });

    elementsInsideRectangle.forEach(el => el.style.border = '1px solid red');

    countLabel.innerText = elementsInsideRectangle.length;
  }

  function removeBordersFromLinks() {
    document.querySelectorAll('a').forEach(el => el.style.border = '');
  }

  let mouseDown = false;
  document.addEventListener('mousedown', () => {
    mouseDown = true;
  });
  document.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'z' && mouseDown) {
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'z') {
      zKeyPressed = true;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'z') {
      zKeyPressed = false;
      openLinksAndClear();
    }
  });


  document.addEventListener('mousedown', (e) => {
    if (!zKeyPressed || e.buttons === 0) {
      clearSelection();
      return;
    }
    e.preventDefault();
    removeBordersFromLinks();
    startX = e.clientX;
    startY = e.clientY;
    selectionRectangle = createRectangle(startX, startY);
    document.body.appendChild(selectionRectangle);
    countLabel = createCountLabel();
    selectionRectangle.appendChild(countLabel);
  });

  document.addEventListener('mousemove', (e) => {
    if (!zKeyPressed || !selectionRectangle || e.buttons === 0) {
      clearSelection();
      return;
    }
    e.preventDefault();
    removeBordersFromLinks();
    selectionRectangle.style.left = Math.min(e.clientX, startX) + 'px';
    selectionRectangle.style.top = Math.min(e.clientY, startY) + 'px';
    selectionRectangle.style.width = Math.abs(e.clientX - startX) + 'px';
    selectionRectangle.style.height = Math.abs(e.clientY - startY) + 'px';
    detectElementsInRectangle();
  });

  function openLinksInBackground(urls) {
    urls.forEach((url) => {
      GM_openInTab(url, { active: false });
    });
  }

  // Clear selection and open links if mouse is released before 'z'
  document.addEventListener('mouseup', (e) => {
    if (!zKeyPressed || !selectionRectangle || e.buttons !== 0) {
      clearSelection();
      return;
    }
    e.preventDefault();
    openLinksAndClear();
  });

  function clearSelection() {
    if (selectionRectangle) {
      document.body.removeChild(selectionRectangle);
      selectionRectangle = null;
    }
    removeBordersFromLinks();
  }

  // To open links and clear selection
  function openLinksAndClear() {
    if (selectionRectangle) {
      const urlsToOpen = [...new Set(elementsInsideRectangle.map(el => el.href))]
      openLinksInBackground(urlsToOpen);
      clearSelection();
    }
  }
})();
