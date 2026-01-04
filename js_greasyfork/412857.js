// ==UserScript==
// @name        GitHub Pages Link
// @version     0.1.0
// @description A userscript that adds pages link to repository
// @license     MIT
// @author      Jim Cheung
// @namespace   https://github.com/jinhucheung
// @include     https://github.com/*
// @run-at      document-idle
// @grant       none
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/412857/GitHub%20Pages%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/412857/GitHub%20Pages%20Link.meta.js
// ==/UserScript==
(function() {
  "use strict";

  var selectors = {
    // repository content
    repoContent: ".repository-content",
    // pages enironments
    pagesEnv: ".BorderGrid-cell a[href$='environment=github-pages']",
    // pages link
    pagesLink: "a[role='link']",
    // repo link on side
    repoLinkGridPreSibling: ".BorderGrid .BorderGrid-row:first-child > .BorderGrid-cell > h2 ~ .f4",
    // repo link on header
    repoLinkHeaderPreSibling: "#js-repo-pjax-container > .hide-full-screen > .d-block > p"
  }

  var pagesHostTemplete = "{space}.github.io"
  var pagesLinkTemplete =
    '<div class="d-flex flex-items-center {containerClass}">' +
      '<svg mr="2" classes="flex-shrink-0" height="16" class="octicon octicon-link flex-shrink-0 mr-2" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>' +
      '<span class="flex-auto min-width-0 css-truncate css-truncate-target width-fit">' +
        '<a title="https://{pagesLink}" role="link" target="_blank" class="text-bold" rel="noopener noreferrer" href="https://{pagesLink}">{pagesLink}</a>' +
      '</span>' +
    '</div>'

  function isEnablePages() {
    var repoContent = document.querySelector(selectors.repoContent)
    return repoContent && repoContent.querySelector(selectors.repoLinkGridPreSibling) && getPagesLink()
  }

  function isNotFoundPagesLink() {
    return !document.querySelector(selectors.pagesLink)
  }

  function getPagesLink() {
    var paths = location.pathname.split("/")
    var space = paths[1] || ""
    var repoPath = paths[2] || ""
    var pageLink = pagesHostTemplete.replace("{space}", space)

    if (repoPath.toLowerCase() !== pageLink.toLowerCase()) {
      if (!document.querySelector(selectors.pagesEnv)) return

      pageLink = pageLink + "/" + repoPath
    }
    return pageLink
  }

  function addPagesLink() {
    var pagesLink = getPagesLink()
    if (!pagesLink) return false

    var repoLinkGridPreSibling = document.querySelector(selectors.repoLinkGridPreSibling)
    if (repoLinkGridPreSibling) {
      var repoLinkGridContent = pagesLinkTemplete.replaceAll("{containerClass}", "mt-3").replaceAll("{pagesLink}", pagesLink)
      repoLinkGridPreSibling.outerHTML += repoLinkGridContent
    }

    var repoLinkHeaderPreSibling = document.querySelector(selectors.repoLinkHeaderPreSibling)
    if (repoLinkHeaderPreSibling) {
      var repoLinkHeaderContent = pagesLinkTemplete.replaceAll("{containerClass}", "mb-2").replaceAll("{pagesLink}", pagesLink)
      repoLinkHeaderPreSibling.outerHTML += repoLinkHeaderContent
    }

    return true
  }

  function setup() {
    return isEnablePages() && isNotFoundPagesLink() && addPagesLink()
  }

  function init() {
    var success = setup()
    if (!success) {
      window.setTimeout(init, 2000)
    }
  }

  document.addEventListener("pjax:end", init)
  init()
})()