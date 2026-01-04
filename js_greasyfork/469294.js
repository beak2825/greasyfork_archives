// ==UserScript==
// @name         scroll-driven progress bar demo
// @namespace    https://greasyfork.org/en/scripts/469294-scroll-driven-progress-bar-demo
// @version      0.2
// @license      MIT
// @description  this is a demo for scroll-driven animation representation
// @author       yif
// @match        https://developer.chrome.com/
// @match        https://jandan.net/p/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.mi.com/global/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469294/scroll-driven%20progress%20bar%20demo.user.js
// @updateURL https://update.greasyfork.org/scripts/469294/scroll-driven%20progress%20bar%20demo.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  addProgressBar(
    document.querySelector('.notion-frame')
  );

  function addProgressBar(root) {
    // add progress ele to body
    root || (root = document.body);

    root.prepend(
      getProgressEle()
    );

    // add keyframes to stylesheet | <style>
    addStyleRules(
      getKeyFramesRule()
    );
  }

  function getProgressEle() {
    const progress = document.createElement('div');
    progress.setAttribute('id', 'progress');
    progress.setAttribute('style', `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 1em;
      border-radius: 0 0.5em 0.5em 0;
      background: #ec6617;
      transform-origin: 0 50%;
      animation: grow-progress auto linear;
      animation-timeline: scroll(nearest block);
      z-index: 999;
    `);

    return progress;
  }

  function getKeyFramesRule() {
    return `
      @keyframes grow-progress {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); border-radius: 0; }
      }
    `;
  }

  function addStyleRules(rules) {
    const styles = document.createElement('style');
    styles.innerHTML = rules;

    document.head.append(styles);
  }
})();