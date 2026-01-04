// ==UserScript==
// @name        Better messages.google.com
// @namespace   Violentmonkey Scripts
// @match       https://messages.google.com/web/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      Magnus Anderson
// @description Make the textarea scale to half the screen height, rather than 5 lines
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/508935/Better%20messagesgooglecom.user.js
// @updateURL https://update.greasyfork.org/scripts/508935/Better%20messagesgooglecom.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  // Find the target node
  const node = document.querySelector('textarea')
  if (node) {
    node.classList.remove('input')
    node.placeholder = "With every action, you must also cut..."
    node.value = ""
    let style = node.style
    style.backgroundColor = '#00000000'
    style.border = 'none'
    style.outline = 'none'
    style.resize = 'none'
    style.overflow = 'hidden'
    style.maxHeight = "50vh"
    style.color = '#fff'
    style.fieldSizing = 'content'
    style.font = 'var(--text-msg-font-override)'
    style.width = '100%'
    console.log('magnus!', node)

    let container = node.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    container.style.position = 'relative'
    console.log('magnus!2', container)
    // disconnect observer
    return true;
  }
});