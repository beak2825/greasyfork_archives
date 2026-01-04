// ==UserScript==
// @name        ComicK - Cleanup ComicK
// @namespace   https://github.com/BreezeSpark
// @match       https://comick.io/*
// @icon        https://comick.io/favicon.ico
// @version     5.29.2025.1
// @description Remove specific elements with MutationObserver.
// @author      BreezeSpark
// @run-at      document-start
// @grant       none
// @supportURL  https://github.com/BreezeSpark/Userscripts/issues
// @homepageURL https://github.com/BreezeSpark/Userscripts
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528592/ComicK%20-%20Cleanup%20ComicK.user.js
// @updateURL https://update.greasyfork.org/scripts/528592/ComicK%20-%20Cleanup%20ComicK.meta.js
// ==/UserScript==

(function () {
  // ------------------------------- Settings ----------------------------------\\
  const SETTINGS = {
    hideCommentSection: true, // Set to false to keep the comment section
    hideHomepageSidePanel: true // Set to false to keep the homepage side panel
  }
  // ---------------------------------------------------------------------------\\

  const hideElement = (selector, condition) => {
    const element = document.querySelector(selector)
    if (element && (!condition || condition(element))) {
      element.style.display = 'none'
    }
  }

  const ELEMENTS_TO_HIDE = [{
    selector: 'div.rounded.dark\\:border-gray-700.text-xs'
  },
  {
    selector: 'div.text-center.text-xs.py-2',
    condition: (el) => el.textContent.includes('ADVERTISEMENT')
  },
  {
    selector: 'div.pl-3.pb-1.lg\\:pl-4.lg\\:pb-3.pr-0.float-right.w-4\\/12.xl\\:w-3\\/12.space-y-5.overflow-hidden',
    condition: () => SETTINGS.hideHomepageSidePanel
  },
  {
    selector: '#comment-section',
    condition: () => SETTINGS.hideCommentSection
  },
  {
    selector: 'div.w-full.flex.justify-center'
  },
  {
    selector: 'div.rounded.p-2.flex.border-l-8',
    condition: (el) => el.textContent.includes('This comic is not indexed.')
  }
  ]

  const hideTargetElements = () => {
    ELEMENTS_TO_HIDE.forEach(({
      selector,
      condition
    }) => {
      hideElement(selector, condition)
    })
  }

  const adjustLayout = () => {
    if (!SETTINGS.hideHomepageSidePanel) return
    const mainElement = document.querySelector('main#main')
    if (mainElement) {
      Object.assign(mainElement.style, {
        marginLeft: 'auto',
        marginRight: 'auto',
        float: 'none',
        display: 'block'
      })
    }
  }

  hideTargetElements()
  adjustLayout()

  const observer = new MutationObserver(() => {
    hideTargetElements()
    adjustLayout()
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })
})()
