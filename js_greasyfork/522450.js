// ==UserScript==
// @name         Redmine: Add notes directly at the bottom
// @namespace    im.outv.redmine.addnotes.redmine
// @version      2024.1
// @description  Make it easy to add notes without the need to click a button.
// @author       Outvi V
// @license      MIT
// @match        https://www.redmine.org/issues/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522450/Redmine%3A%20Add%20notes%20directly%20at%20the%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/522450/Redmine%3A%20Add%20notes%20directly%20at%20the%20bottom.meta.js
// ==/UserScript==

const HIDE_CLASS_NAME = 'addnotes-hide'

function addCss(css) {
  var block = document.createElement('style')
  block.innerText = css
  document.head.appendChild(block)
  return block
}

function isToShow(fieldset) {
    // As of Redmine 6.0.2
    if (['add_notes', 'add_attachments'].includes(fieldset.id)) {
        return true;
    }

    // redmine.org
    if (["Notes", "Files"].includes(fieldset.querySelector("legend")?.innerText)) {
        fieldset.classList.remove("addnotes-hide")
        return true;
    }

    return false;
}

;(function () {
  'use strict'

  const hiddenCss = addCss(`
    .${HIDE_CLASS_NAME} { display: none; }
    `)

  const dUpdate = document.querySelector('#update')
  dUpdate.style = ''

  const dEditAreas = [...dUpdate.querySelectorAll('form div.box > fieldset')]

  for (const fieldset of dEditAreas) {
    if (!isToShow(fieldset)) {
      fieldset.classList.add(HIDE_CLASS_NAME)
    }
  }

  const _showAndScrollTo = window.showAndScrollTo
  window.showAndScrollTo = function (id, focus, ...args) {
    if (id === 'update' && focus === 'issue_notes') {
      hiddenCss.innerText = ''
    }
    _showAndScrollTo(id, focus, ...args)
  }
})()