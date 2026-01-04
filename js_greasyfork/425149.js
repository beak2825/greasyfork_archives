// ==UserScript==
// @name         add buttons to tunnelto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds buttons to my torrent colab thing
// @author       You
// @match        https://colab.research.google.com/drive/1vLYMv5nKyoTvjHByfXw-7H3HnLTNuS-L
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425149/add%20buttons%20to%20tunnelto.user.js
// @updateURL https://update.greasyfork.org/scripts/425149/add%20buttons%20to%20tunnelto.meta.js
// ==/UserScript==
var startup = null

function wait_for_bar(){
if (document.getElementById("top-menubar") !== null) {
document.querySelector("#header-doc-toolbar").style.overflow='inherit'
var startup = document.getElementById("top-menubar").appendChild(document.createElement("button"));
    startup.innerHTML = 'startup'
startup.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-lDtl33kuadU_ > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-mp6XoynaX4HN > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    if (document.querySelector("#cell-ELoHkXE1Xnms").style.display == 'none') {
    document.querySelector("#cell-fkaNFMaxHDWz > div.main-content > div.editor-container.horizontal > div.text-top-div > div > span > h1 > paper-icon-button").shadowRoot.querySelector("#icon").click()
    document.querySelector("#cell-ELoHkXE1Xnms > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ELoHkXE1Xnms").scrollIntoView()
    } else {
    document.querySelector("#cell-ELoHkXE1Xnms > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ELoHkXE1Xnms").scrollIntoView()
    }

};
    console.log('startup button made!');
    clearInterval(interval1);
}
}

var interval1 = setInterval(wait_for_bar, 1000)
