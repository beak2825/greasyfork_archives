// ==UserScript==
// @name         resizemastodo
// @namespace    http://poshcode.org/resizemastodo
// @version      0.4.0
// @description  equal resizable columns in mastodon
// @author       jaykul
// @license      MIT
// @match        https://fosstodon.org/*
// @match        https://*/deck/*
// @match        https://*/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aus.social
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/454684/resizemastodo.user.js
// @updateURL https://update.greasyfork.org/scripts/454684/resizemastodo.meta.js
// ==/UserScript==
const makeResizeable = function (col, all) {
    // Track the current position of mouse
    let x = 0;
    let w = 0;

    if (all === undefined) {
        all = [col];
    }

    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;

        // Calculate the current width of column
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        // Attach listeners for document's events
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // Determine how far the mouse has been moved
        const dx = e.clientX - x;
        // Update the width of column
        all.forEach(function (c) { c.style.width = `${w + dx}px` });
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Add a resizer element
    const resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.top = 0;
    resizer.style.right = 0;
    resizer.style.width = '5px';
    resizer.style.height = '100%';
    resizer.style.cursor = 'col-resize';
    // resizer.style.background = 'red';

    // Add a resizer element to the column
    col.append(resizer);

    resizer.addEventListener('mousedown', mouseDownHandler);
};

function fixColumnsEventually() {
  var cols = document.querySelectorAll('div.column');
  if (cols.length == 0 && retries-- > 0) {
      console.log("Try again " + retries + " more times");
      setTimeout(fixColumnsEventually, 200);
  } else if(cols.length > 0) {
      console.log("Found " + cols.length + " columns to make resizable");
      cols.forEach((col) => {
          // If you want to resize one at a time, don't pass cols here:
          makeResizeable(col, cols);
      });

      const drawer = document.querySelector('div.drawer');
      makeResizeable(drawer);

      // Make the drawer sticky
      drawer.style.position = 'sticky';
      drawer.style.left = 0;
      // Hide things that slide behind the drawer
      drawer.style.zIndex = 100;
      drawer.style.background = window.getComputedStyle(document.body).background;
  } else {
      console.log("Found " + cols.length + " cols and gave up")
  }
}

var retries = 3;
// I'm not supposed to need this, because @run-at is supposed to be enough
setTimeout(fixColumnsEventually, 200);
