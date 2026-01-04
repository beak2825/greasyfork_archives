// ==UserScript==
// @name         HideFilesSection
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  I just need to see readme!!!
// @author       lane
// @match        https://github.com/*
// @exclude      https://github.com/*/*/tree/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407897/HideFilesSection.user.js
// @updateURL https://update.greasyfork.org/scripts/407897/HideFilesSection.meta.js
// ==/UserScript==

;(async function () {
  const sleep = function * (sec) {
    while (true) {
      yield new Promise(res => setTimeout(res, sec * 1000))
    }
  }

  for await (const __ of sleep(0.5)) {
     const e = document.querySelector('.rgh-toggle-files');
     if (e) {
        e.click()
        break
     }
  }
})()