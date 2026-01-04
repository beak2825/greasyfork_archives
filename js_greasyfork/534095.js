// ==UserScript==
// @name         Account number warning style
// @namespace    nu.81.citizens.warning
// @version      1.0.2.20250426
// @description  Apply a warning style to bill pay fields paying from an undesired account
// @license      NO LICENSE - Please do not redistribute without permission ❤
// @author       J. Jones
// @match        https://paybills.citizensbankonline.com/imm/PaymentCenter/index/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=citizensbankonline.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534095/Account%20number%20warning%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/534095/Account%20number%20warning%20style.meta.js
// ==/UserScript==

var acct = GM_getValue("accountSuffix", "x1234");
GM_registerMenuCommand("Set account suffix", function() {
    acct = prompt("Value for account suffix?\n(should look like 'x1234')", acct);
    GM_setValue("accountSuffix", acct);
});

console.log(acct);

var newCss = `<style type="text/css">
input[value^="${acct}"].cb_edit {
    background-color: #fcc !important;
}
</style>
`.trim();

$(document).ready(function() {
    setTimeout(function() {
        var body = $($("body")[0]);
        body.html(body.html() + newCss);
    }, 500);
});