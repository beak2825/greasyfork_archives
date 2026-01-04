// ==UserScript==
// @name         Github Dashboard Filter
// @description  Minimizes pushs and commits from github actions and bots from github.com dashboard
// @namespace    RyoLee
// @author       RyoLee
// @version      1.3
// @copyright    2022, RyoLee (https://github.com/RyoLee)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @match        https://github.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445696/Github%20Dashboard%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/445696/Github%20Dashboard%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function hideBots () {
    document.querySelectorAll('#dashboard div.push:not(.shotBot), #dashboard div.Details:not(.shotBot)').forEach(function (div) {
      const label = div.querySelector('.body .d-flex .d-flex .Label')
      const isAppUrl = div.querySelector('.body .d-flex .d-flex a.Link--primary[href^="/apps/"]')
      if (isAppUrl || (label && label.textContent === 'bot')) {
        div.style.display = 'none'
      }
    })
  }

  hideBots()
  const iv = window.setInterval(hideBots, 200)
  window.setTimeout(() => window.clearInterval(iv), 5000)
  window.setInterval(hideBots, 4000)
})()