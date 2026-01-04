// ==UserScript==
// @name         Christmas Town
// @namespace    somenamespace
// @version      0.2
// @description  desc
// @author       tos
// @match        *.torn.com/christmas_town.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36489/Christmas%20Town.user.js
// @updateURL https://update.greasyfork.org/scripts/36489/Christmas%20Town.meta.js
// ==/UserScript==

const highlight = (node) => {
  console.log(node)
  for (const child of node.children) {
      child.querySelector('img').style.backgroundColor = 'red'
      console.log(child.querySelector('img').src)
    }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
	if (mutation.target.className && mutation.target.className.includes('map-overview')) {
      const map_wrap = mutation.target.querySelector('.items-layer')
      observer.disconnect()
      observer.observe(map_wrap, { subtree: true, childList: true })
      const items = document.querySelector('.items-layer')
      if (items && items.children.length > 0) highlight(items)
    }
    if (mutation.target.className && mutation.target.className.includes('items-layer')) {
      const items = mutation.target
      if (items.children.length > 0) highlight(items)
    }
  }
});

const xmas_wrap = document.querySelector('#christmastownroot')
observer.observe(xmas_wrap, { subtree: true, childList: true })