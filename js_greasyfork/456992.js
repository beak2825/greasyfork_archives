// ==UserScript==
// @name        Keybindings for willyoupressthebutton
// @namespace   Violentmonkey Scripts
// @match       https://willyoupressthebutton.com/*
// @grant       none
// @version     1.0
// @author      Magnus Anderson
// @description 2022-12-22, add keybindings a to not push, f to push, e to reload
// @license MIT
//
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/456992/Keybindings%20for%20willyoupressthebutton.user.js
// @updateURL https://update.greasyfork.org/scripts/456992/Keybindings%20for%20willyoupressthebutton.meta.js
// ==/UserScript==

const newbutton = 'https://willyoupressthebutton.com'
const yesaction = () => {
  let button = document.getElementById('yesbtn')
  if (button)
    button = button.href
  else
    button = newbutton
  window.open(button, '_self')
}
const noaction = () => {
  let button = document.getElementById('nobtn')
  if (button)
    button = button.href
  else
    button = newbutton
  window.open(button, '_self')
}
const reloadaction = () => {
  window.open(newbutton, '_self')
}

VM.shortcut.register('u', yesaction);
VM.shortcut.register('f', yesaction);

VM.shortcut.register('a', noaction);

VM.shortcut.register('e', reloadaction);
VM.shortcut.register('d', reloadaction);
VM.shortcut.register(' ', reloadaction);