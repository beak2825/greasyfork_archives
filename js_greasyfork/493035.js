// ==UserScript==
// @name         Acellus Fast Auto Redirect
// @namespace    https://greasyfork.org/en/users/1291009
// @version      1.1
// @description  Auto-redirect the page from www.acellus.com to signin.acellus.com before the page loads
// @run-at       document-start
// @match        *://www.acellus.com/*
// @author       BadOrBest
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @downloadURL https://update.greasyfork.org/scripts/493035/Acellus%20Fast%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/493035/Acellus%20Fast%20Auto%20Redirect.meta.js
// ==/UserScript==

const hostname = location.hostname;
window.location.replace(window.location.href.replace(hostname, 'signin.acellus.com/sign-in/student/'));