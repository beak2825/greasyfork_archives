// ==UserScript==
// @name         Spelpaus remover ATG SE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the spelpaus banner on top of the site atg.se
// @author       You
// @match        https://*.atg.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376218/Spelpaus%20remover%20ATG%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/376218/Spelpaus%20remover%20ATG%20SE.meta.js
// ==/UserScript==

GM_addStyle("div[class$='responsibleGaming'] {display: none;} div[class$='mainContainer'] {margin-top: 0px;}");