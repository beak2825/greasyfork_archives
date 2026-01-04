// ==UserScript==
// @name        GitHub light
// @match       https://github.com/*
// @grant       none
// @run-at      document-start
// @description GitHub light/day theme default for not signed-in users
// @author      wOxxOmMOD
// @version 0.0.1.20210508180805
// @namespace https://greasyfork.org/users/766635
// @downloadURL https://update.greasyfork.org/scripts/426180/GitHub%20light.user.js
// @updateURL https://update.greasyfork.org/scripts/426180/GitHub%20light.meta.js
// ==/UserScript==

document.documentElement.setAttribute('data-color-mode', 'light');