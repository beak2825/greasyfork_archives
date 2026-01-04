// ==UserScript==
// @name         Clean TypeScript handbook
// @namespace    http://kuntau.org
// @version      0.1
// @description  Make reading TypeScript documentation better on vertical monitor
// @author       Kuntau
// @match        https://www.typescriptlang.org/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typescriptlang.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454981/Clean%20TypeScript%20handbook.user.js
// @updateURL https://update.greasyfork.org/scripts/454981/Clean%20TypeScript%20handbook.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const checkElmExistTimer = setInterval(function() {
    let topMenuSelector = "top-menu"

    // check our custom button
    if (document.getElementsByClassName("custom-btn").length === 0) {
      const topMenu = document.getElementById(topMenuSelector)
      if (topMenu) {
        addButton(topMenu)
      }
    }
  }, 5000)

  function addButton(Node) {
    const btnSidebar = createButton("☰", "Show/hide sidebar")
    const btnTOC = createButton("☲", "Show/hide table of content")
    const elm = document.createElement("div")

    let sidebarStatus = true
    let tocStatus = true

    elm.style.display = "flex"
    elm.appendChild(btnSidebar)
    elm.appendChild(btnTOC)

    btnSidebar.onclick = function() {
      sidebarStatus = !sidebarStatus
      hideSidebar(sidebarStatus)
    }

    btnTOC.onclick = function() {
      tocStatus = !tocStatus
      hideTOC(tocStatus)
    }

    // Node.style.justifyContent = "flex-start"
    Node.append(elm)
  }

  function createButton(icon, title) {
    const btn = document.createElement("button")
    btn.innerHTML = icon
    btn.setAttribute('class', 'custom-btn')
    btn.setAttribute('title', title)

    return btn
  }

  function hideSidebar(status) {
    const sidebar = document.getElementById("sidebar")
    if (status) {
      sidebar.style.display = "block"
    } else {
      sidebar.style.display = "none"
    }
  }

  function hideTOC(status) {
    const toc = document.getElementsByClassName("handbook-toc")
    if (status) {
      toc[0].style.display = "block"
    } else {
      toc[0].style.display = "none"
    }
  }

})();