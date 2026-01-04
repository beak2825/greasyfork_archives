// ==UserScript==
// @name        Collapse comments
// @namespace   https://franklinyu.github.io
// @match       https://lwn.net/Articles/*
// @grant       none
// @version     0.1
// @author      FranklinYu
// @description Add a button to collapse comments of lwn.net
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/482079/Collapse%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/482079/Collapse%20comments.meta.js
// ==/UserScript==

const COLLAPSED = '▷'
const EXPANDED = '▽'

function getTree(comment) {
  const tree = comment?.nextElementSibling
  if (tree && tree.classList.contains('Comment')) {
    return tree
  } else {
    return null
  }
}

for (const comment of document.getElementsByClassName('CommentBox')) {
  if (!getTree(comment)) {
    continue  // leaf comment
  }

  const toggle = document.createElement('button')
  comment.append(toggle)
  toggle.textContent = EXPANDED

  toggle.addEventListener('click', e => {
    const button = e.target
    const tree = getTree(button.parentElement)
    if (!tree) {
      console.warn('unexpected comment event: ', e)
    }

    if (button.textContent === EXPANDED) {
      button.textContent = COLLAPSED
      tree.style.display = 'none'
    } else {
      button.textContent = EXPANDED
      tree.style.display = ''
    }
  })
}