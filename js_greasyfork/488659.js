// ==UserScript==
// @name         Title auto-changer
// @namespace    http://compass.education
// @version      13333333-1
// @description  compass is looming....
// @author       Digitalz
// @match        *://www.hoodamath.com/*
// @match        chrome-extension://*
// @match        *://deepai.org/*
// @match        *://unblocked-games.s3.amazonaws.com/*
// @match        *://calculators.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488659/Title%20auto-changer.user.js
// @updateURL https://update.greasyfork.org/scripts/488659/Title%20auto-changer.meta.js
// ==/UserScript==
function gcloak() { var link = document.querySelector("link[rel*='icon']") || document.createElement('link');link.type = 'image/x-icon';link.rel = 'shortcut icon';link.href = 'https://maffrasc-vic.compass.education/Assets/Pix/favicon_v11855.png';document.title = 'Home | Compass';console.log(document.title);document.getElementsByTagName('head')[0].appendChild(link) };gcloak();setInterval(gcloak, 1000);