// ==UserScript==
// @name Start(ex)
// @namespace http://tampermonkey.net/
// @version 1.41
// @description start
// @author Start
// @match https://colab.research.google.com/*
// @match http://colab.research.google.com/*
// @match https://*.research.google.com/*
// @match http://*.research.google.com/*
// @license MIT
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/442426/Start%28ex%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442426/Start%28ex%29.meta.js
// ==/UserScript==
function SC1() {
  console.log('Working')
    document
        document.querySelector("#cell-JifQ20r-NXe4 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button")
            .shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon")
    .click()
}

setTimeout(SC1, 60000)
function SC2() {
  console.log('Working')
    document
        .querySelector("#ok")
    .click()
}

setTimeout(SC2, 120000)