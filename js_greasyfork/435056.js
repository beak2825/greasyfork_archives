// ==UserScript==
// @name         skip warning page in blogspot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  title self-explanatory
// @author       Yhria
// @match        https://*.blogspot.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435056/skip%20warning%20page%20in%20blogspot.user.js
// @updateURL https://update.greasyfork.org/scripts/435056/skip%20warning%20page%20in%20blogspot.meta.js
// ==/UserScript==

document.getElementsByTagName("iframe")[0].remove()
document.getElementsByTagName("body")[0].getElementsByTagName("style")[0].remove()