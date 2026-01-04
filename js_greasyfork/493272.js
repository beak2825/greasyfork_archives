// ==UserScript==
// @name        [Pixlr] Remove Black Sidebar and Resize Workspace (CSS)
// @namespace   discord@xtaiao
// @match       https://pixlr.com/*
// @grant       none
// @version     1.3
// @author      xtaiao
// @license     MIT
// @description Removes the black sidebar on PIXLR, resizes workspace (using CSS).
// @downloadURL https://update.greasyfork.org/scripts/493272/%5BPixlr%5D%20Remove%20Black%20Sidebar%20and%20Resize%20Workspace%20%28CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493272/%5BPixlr%5D%20Remove%20Black%20Sidebar%20and%20Resize%20Workspace%20%28CSS%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeRightSpace() {
    const rightSpace = document.getElementById("right-space");
    if (rightSpace) {
      rightSpace.parentNode.removeChild(rightSpace);

      const workspace = document.getElementById('workspace');
      workspace.style.right = '0px';

      console.log("Right space removed and workspace resized.");
    }
  }

  removeRightSpace();

  setInterval(removeRightSpace, 500);
})();