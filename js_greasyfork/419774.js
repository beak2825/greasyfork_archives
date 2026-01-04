// ==UserScript==
// @name         Progress Knight Dynamic Layout
// @namespace    https://ihtasham42.github.io/progress-knight/
// @version      1.0.1
// @description  Fixes UI to be dynamic - its not perfect, but it is better than nothing
// @author       CitizenStile <citizenstile@pm.me>
// @match        *://ihtasham42.github.io/progress-knight/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/419774/Progress%20Knight%20Dynamic%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/419774/Progress%20Knight%20Dynamic%20Layout.meta.js
// ==/UserScript==

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var elemParent = getElementByXpath("/html/body/div/div")
//   parentHeight.style.height = 'auto'
//   parentHeight.style.width = 'auto'
var elemMenu = getElementByXpath("/html/body/div/div/div[2]")
elemMenu.style.width = 'auto'
var elemBody = getElementByXpath("/html/body/div/div/div[3]")
elemBody.style.width = 'auto'
elemBody.style.height = 'auto'