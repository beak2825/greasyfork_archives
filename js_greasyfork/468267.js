// ==UserScript==
// @name        西瓜视频自动自适应网页全屏剧场模式
// @namespace   476321082
// @match       https://www.ixigua.com/*
// @description  This script does something cool.
// @license      MIT
// @grant       none
// @version     0.2
// @author      -
// @downloadURL https://update.greasyfork.org/scripts/468267/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%87%AA%E9%80%82%E5%BA%94%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468267/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%87%AA%E9%80%82%E5%BA%94%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
  'use strict';

const header = document.querySelector('header');
const showHeaderDistance = 10; // distance in pixels from the top of the page

// Add style to the document
const style = document.createElement('style');
style.innerHTML = `
  header.hide {
    visibility: hidden;
  }
  .Page_Projection.new-style .xgplayer:not(.xgplayer-is-fullscreen) {
    max-height: 100vh;
  }
  .layoutstatus-header--Normal .v3-app-layout__content {
    padding-top: 0px;
  }
`;
document.head.appendChild(style);

  header.classList.add('hide');
// Toggle header visibility based on mouse position or event
function toggleHeaderVisibility(event) {
  if (event.type === 'mousemove' && event.clientY < showHeaderDistance) {
    header.classList.remove('hide');
  } else if (event.type === 'mouseleave') {
    header.classList.add('hide');
  }
}

window.addEventListener('mousemove', toggleHeaderVisibility);
header.addEventListener('mouseleave', toggleHeaderVisibility);

// Click theater mode button on page load
window.addEventListener('load', () => {
  const theaterModeButton = document.querySelector('[tabindex="0"][aria-label="剧场模式"]');
  if (theaterModeButton) {
    theaterModeButton.click();
  }
});

})();
