// ==UserScript==
// @name        Github: Increase visibility of "hidden conversations"
// @namespace   Violentmonkey Scripts
// @match       https://github.com/navikt/aksel/pull/3761*
// @grant       none
// @version     1.1
// @run-at document-end
// @author      popular-software
// @description 28/05/2025, 12:31:02
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537518/Github%3A%20Increase%20visibility%20of%20%22hidden%20conversations%22.user.js
// @updateURL https://update.greasyfork.org/scripts/537518/Github%3A%20Increase%20visibility%20of%20%22hidden%20conversations%22.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  const nodes = document.body.querySelectorAll(`.js-review-hidden-comment-ids,.discussion-item-header`);

  for (let node of nodes) {
    node.style = "font-size: 2rem;";
    const buttonWrapper = node.querySelector('div.Box');
    buttonWrapper.style = "border: 5px solid red;"
    const buttons = buttonWrapper.querySelectorAll('button');
    for (let button of buttons) {
      button.style = "color: red !important;"
    }
  }

});
