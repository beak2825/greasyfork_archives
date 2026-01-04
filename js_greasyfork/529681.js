// ==UserScript==
// @name        Azure App Insights expand app map names
// @namespace   Violentmonkey Scripts
// @match       https://appinsights.hosting.portal.azure.net/*
// @grant       none
// @version     1.1
// @author      pl4nty
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description App Insights has a great application map, but it truncates application names. This shows the full name
// @downloadURL https://update.greasyfork.org/scripts/529681/Azure%20App%20Insights%20expand%20app%20map%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/529681/Azure%20App%20Insights%20expand%20app%20map%20names.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  const node = document.querySelectorAll("g[role='presentation'] > g.node-title > .text")

  if (node.length != 0) {
    node.forEach(gNode => {
      const titleElement = gNode.querySelector('title')
      const tspanElement = gNode.querySelector('tspan')

      if (titleElement && tspanElement) {
        tspanElement.textContent = titleElement.textContent
      }
    })
  }
})
