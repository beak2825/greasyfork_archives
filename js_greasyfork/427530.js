// ==UserScript==
// @name         Delete amazon addresses
// @version      0.1
// @description  when you delete one amazon address it'll go through and delete them all!
// @author       tickl
// @match        https://www.amazon.com/a/addresses?alertId=yaab-deleteAddressSuccess
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @namespace https://greasyfork.org/users/779051
// @downloadURL https://update.greasyfork.org/scripts/427530/Delete%20amazon%20addresses.user.js
// @updateURL https://update.greasyfork.org/scripts/427530/Delete%20amazon%20addresses.meta.js
// ==/UserScript==

Array.from(document.getElementsByClassName("a-link-normal delete-link"))[1].click()

setTimeout(() => { Array.from(document.getElementsByClassName("a-button-input"))[0].click() }, 600);