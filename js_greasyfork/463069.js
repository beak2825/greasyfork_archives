// ==UserScript==
// @name         Make Dappervolk Trades Notes Lowercase
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces lowercase text in Dappervolk Trade Lot descriptions when making a new trade.
// @author       Flordibel
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=dappervolk.com
// @match        http://dappervolk.com/trade/create
// @match        https://dappervolk.com/trade/create
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463069/Make%20Dappervolk%20Trades%20Notes%20Lowercase.user.js
// @updateURL https://update.greasyfork.org/scripts/463069/Make%20Dappervolk%20Trades%20Notes%20Lowercase.meta.js
// ==/UserScript==

GM_addStyle(`.trade-create .lot-content.trade .lot-trade-note textarea {
    text-transform: none;
}`)