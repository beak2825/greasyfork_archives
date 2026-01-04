// ==UserScript==
// @name         Redirect Waze Map Editor in production to the beta
// @namespace    https://tomputtemans.com/
// @version      0.3
// @description  Forward any page loaded on the Waze production site towards its corresponding page on the beta WME
// @author       Glodenox
// @include      /^https:\/\/www\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389677/Redirect%20Waze%20Map%20Editor%20in%20production%20to%20the%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/389677/Redirect%20Waze%20Map%20Editor%20in%20production%20to%20the%20beta.meta.js
// ==/UserScript==

window.location.replace(window.location.href.replace('https://www.waze.com', 'https://beta.waze.com'));