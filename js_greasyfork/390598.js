// ==UserScript==
// @name         Big Al sell all
// @namespace    namespace
// @version      0.1
// @description  double click checkbox to toggle all similar
// @author       tos
// @match       *.torn.com/bigalgunshop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390598/Big%20Al%20sell%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/390598/Big%20Al%20sell%20all.meta.js
// ==/UserScript==

function LI_addListener(li) {
  const item_id = li.getAttribute('data-item')
  const checkbox_LABEL = li.querySelector('input[type=checkbox]+LABEL')
  if (checkbox_LABEL) checkbox_LABEL.addEventListener('dblclick', e => document.querySelectorAll(`LI[data-item="${item_id}"] INPUT[type=checkbox]`).forEach(checkbox => checkbox.checked = !checkbox.checked))
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeName && node.nodeName === 'LI' && node.hasAttribute('data-item')) LI_addListener(node)
    }
  }
})

const wrapper = document.querySelector('UL.sell-items-list')
wrapper.querySelectorAll('LI[data-item]').forEach((li) => {
  LI_addListener(li)
})
observer.observe(wrapper, { subtree: true, childList: true })