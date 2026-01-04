// ==UserScript==
// @name         TC Bazaar Max Buy
// @namespace    namespace
// @version      0.1.3
// @description  description
// @author       tos
// @match       *.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376760/TC%20Bazaar%20Max%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/376760/TC%20Bazaar%20Max%20Buy.meta.js
// ==/UserScript==

const autoprice = (li) => {
  const stock = li.querySelector('span.instock').innerText
  li.querySelector('input[id^=item]').value = stock
}

if (document.querySelector('ul.items-list') !== null) {
  document.querySelectorAll('ul.items-list li').forEach(li => {
    if (li.classList && !li.classList.contains('empty')) autoprice(li)
  })
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('bazaar-page-wrap')) {
        node.querySelectorAll('ul.items-list li').forEach(li => {
          if (li.classList && !li.classList.contains('empty')) autoprice(li)
        })
      }
      if (node.nodeName && node.nodeName ==='LI' && node.classList && !node.classList.contains('empty')) {
        autoprice(node)
      }
    }
  }
})

const wrapper = document.querySelector('#bazaar-page-wrap')
observer.observe(wrapper, { subtree: true, childList: true })