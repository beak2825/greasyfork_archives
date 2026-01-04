// ==UserScript==
// @name         Git Wiki
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  go to deepwiki page with one click
// @author       Kevin Kwong <https://github.com/kvoon3>
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535421/Git%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/535421/Git%20Wiki.meta.js
// ==/UserScript==

(function () {
  const currentUrl = window.location.href

  setTimeout(() => {
    const deepwikiBtn = document.createElement('a')
    deepwikiBtn.type = 'button'
    deepwikiBtn.classList.add('prc-Button-ButtonBase-c50BI')
    deepwikiBtn.classList.add('OverviewContent-module__Button--MDoYP')
    deepwikiBtn.innerHTML = 'deepwiki'
    deepwikiBtn.title = 'deepwiki'
    deepwikiBtn.href = currentUrl.replace('github.com', 'deepwiki.com')
    deepwikiBtn.dataset.size = 'medium'
    deepwikiBtn.dataset.variant = 'invisible'

    const buttonList = document.querySelector('.OverviewContent-module__Box_4--rOz8J')
    buttonList.appendChild(deepwikiBtn)
  }, 1000)
})()
