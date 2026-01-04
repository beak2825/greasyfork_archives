// ==UserScript==
// @name         TrueAchievements Live List Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds filter/search capability for achievement titles and descriptions.
// @author       joequincy
// @match        https://www.trueachievements.com/game/*/achievements
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/31028/TrueAchievements%20Live%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/31028/TrueAchievements%20Live%20List%20Filter.meta.js
// ==/UserScript==


(function () {
  'use strict'

  const selectors = {
    inputInsertionPoint: 'h1.pagetitle+div+div.frm-row',
    sectionPanel: 'ul.ach-panels',
    achievementItem: 'li[id]',
    achievementTitle: 'a.title',
    achievementDescription: 'p'
  }

  RegExp.escape = function (s) {
    return s.replace(/[-\/\\$*+?.()|[\]{}]/g, '\\$&');
  }

  insertStyles()
  insertFilterInput()

  let sections = [...document.querySelectorAll(selectors.sectionPanel)].reduce((acc, section) => {
    const previousSibling = section.previousElementSibling
    if(previousSibling.classList.contains('pnl-hd')) {
      acc.push({
        header: previousSibling,
        achievements: []
      })
    }

    acc.at(-1).achievements.push(...section.querySelectorAll(selectors.achievementItem))

    return acc
  }, [{
    header: null,
    achievements: []
  }])

  function filterList(e) {
    var filterText = new RegExp(RegExp.escape(e.target.value), "i")
    for (let section of sections) {
      let shown = 0
      for (let achievement of section.achievements) {
        const title = achievement.querySelector(selectors.achievementTitle).textContent
        const descriptionElm = achievement.querySelector(selectors.achievementDescription)
        const description = `${descriptionElm.textContent}${descriptionElm.getAttribute("data-af") || ""}`
        const matchesEither = filterText.test(title) || filterText.test(description)
        achievement.classList.toggle("tmhidden", !matchesEither)
        if (matchesEither) { shown++ }
      }

      // hide section header if no achievements are shown
      if (section.header) {
        section.header.classList.toggle("tmhidden", shown === 0)
      }
    }
  }

  function insertFilterInput() {
    // create a block for the input element, and an insertion point
    const insertPoint = document.querySelector(selectors.inputInsertionPoint)
    const insertBlock = document.createElement("div")
    const label = document.createElement("label")
    const textInput = document.createElement("input")

    insertBlock.classList.add("tmfilter")
    insertBlock.appendChild(label)
    insertBlock.appendChild(textInput)

    label.innerText = "Filter/Search: "
    label.setAttribute("for", "tmfilterinput")

    textInput.setAttribute("id", "tmfilterinput")
    textInput.setAttribute("type", "text")
    textInput.setAttribute("placeholder", "Search partial name or description")

    insertPoint.parentElement.insertBefore(insertBlock, insertPoint.nextSibling)
    textInput.addEventListener("input", filterList)
  }

  function insertStyles() {
    // create and insert style element
    const styleElm = document.createElement("style")
    styleElm.title = 'tmfilter'
    document.head.appendChild(styleElm)

    // add specific styles for userscript use
    styleElm.sheet.insertRule("div.tmfilter{padding-bottom:15px;display:flex;}", 0)
    styleElm.sheet.insertRule("div.tmfilter label{padding:calc(.5rem + 1px) .5rem;}", 0)
    styleElm.sheet.insertRule("div.tmfilter input{flex:1;padding:.5rem;max-width:unset;}", 0)
    styleElm.sheet.insertRule(".tmhidden{display:none!important;}", 0)
  }
})()
