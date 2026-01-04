// ==UserScript==
// @name        Hide Code
// @namespace   Violentmonkey Scripts
// @match       https://leetcode.com/problems/*
// @grant       none
// @version     1.0
// @author      ojwefiasdfoj98298347
// @description Hides the code editor of leetcode problems to prevent spoilers when redoing problems
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511388/Hide%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/511388/Hide%20Code.meta.js
// ==/UserScript==

async function wait_element(root, selector) {
  return new Promise((resolve, reject) => {
    (new MutationObserver(check)).observe(root, {childList: true, subtree: true});
    function check(changes, observer) {
      let element = root.querySelector(selector);
      if(element) {
        observer.disconnect();
        resolve(element);
      }
    }
  });
}

(async () => {
  const container = await wait_element(document, '[data-track-load="code_editor"]');
  const first = container.firstElementChild;
  first.style['display'] = 'none';

  const btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Reveal'));
  btn.setAttribute('type', 'button');
  btn.style['background-color'] = 'red';
  btn.style['height'] = '100%';
  btn.style['font-size'] = '36pt';
  container.prepend(btn);

  btn.addEventListener('click', () => {
    first.style['display'] = '';
    btn.remove();
  })
})()