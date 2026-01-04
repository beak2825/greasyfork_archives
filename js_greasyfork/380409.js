// ==UserScript==
// @name         Node Auto proxy
// @author       JSPro
// @version      1.01
// @description  Auto redirects you to a proxy
// @match      *://*/*
// @exclude     http://*.nodeunblocker.org*
// @namespace https://greasyfork.org/users/277231
// @downloadURL https://update.greasyfork.org/scripts/380409/Node%20Auto%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/380409/Node%20Auto%20proxy.meta.js
// ==/UserScript==
window.location.replace("http://iogames.nodeunblocker.org:8080/node/" + window.location.href)