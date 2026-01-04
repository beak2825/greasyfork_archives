// ==UserScript==
// @namespace cpx.printiq
// @name     Add Missing Search Box
// @description Fix missing search box
// @version  1.2
// @match    https://cpx.printiq.com/Quotes/QuoteDetails.aspx?QuoteNo=*
// @grant    GM_addStyle
// @run-at   document-start
// @locale   en
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/475623/Add%20Missing%20Search%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/475623/Add%20Missing%20Search%20Box.meta.js
// ==/UserScript==

GM_addStyle ( `
    .select2-search--dropdown.select2-search--hide{
    display:block;
}
` );