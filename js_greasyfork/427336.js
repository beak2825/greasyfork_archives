// ==UserScript==
// @name        No VRoid
// @namespace   https://github.com/GizmoOAO/no-vroid
// @match       https://booth.pm/*/search/*
// @match       https://booth.pm/*/browse/*
// @grant       none
// @version     1.1
// @author      GizmoOAO
// @license     MIT
// @description No VRoid pls
// @downloadURL https://update.greasyfork.org/scripts/427336/No%20VRoid.user.js
// @updateURL https://update.greasyfork.org/scripts/427336/No%20VRoid.meta.js
// ==/UserScript==
(function () {
  'use strict'

  let searchKeys = [
    'vrc',
    'vrchat'
  ]

  function noVRoid() {
    document.querySelectorAll('.item-card').forEach(node => {
      let titleNode = node.querySelector('.item-card__title')
      let title = titleNode && titleNode.textContent ? titleNode.textContent.toLowerCase() : ''
      if (title.search('vroid') !== -1) {
        console.log("[No VRoid]", titleNode.textContent)
        node.style.display = 'none'
      }
    })
  }

  function getSearchValue() {
    let query = document.getElementById('query')
    return query ? query.value.toLowerCase() : ''
  }

  let searchValue = getSearchValue()
  if (searchKeys.some(key => {
    return key === searchValue
  })) noVRoid()
})()
