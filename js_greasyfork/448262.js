// ==UserScript==
// @name         Tweetdeck Width
// @namespace    https://github.com/Amadeus-AI
// @version      1.0
// @description  Customize Tweetdeck Width
// @author       AmadeusAI
// @match        https://tweetdeck.twitter.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448262/Tweetdeck%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/448262/Tweetdeck%20Width.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

GM_addStyle ( `
    html.dark .is-wide-columns .column {  width:640px }
` );