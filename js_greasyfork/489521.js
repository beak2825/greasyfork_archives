// ==UserScript==
// @name        Faucetearner.org Auto Claim
// @description https://faucetearner.org/?r=400927265871
// @author      Alen
// @version     2.1
// @icon        https://cdn.investing.com/crypto-logos/20x20/v2/xrp.png
// @antifeature  referal-link
// @match       https://faucetearner.org/faucet.php*
// @namespace https://greasyfork.org/users/937752
// @downloadURL https://update.greasyfork.org/scripts/489521/Faucetearnerorg%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/489521/Faucetearnerorg%20Auto%20Claim.meta.js
// ==/UserScript==
//Please use my Referal-Link  https://faucetearner.org/?r=916067998176 Thanks
// 定义函数以点击按钮
function clickNowOfferButton() {
    var button = document.querySelector('button.reqbtn');
    if (button) {
        button.click();
    }
}

setInterval(clickNowOfferButton, 60000);

function refreshPage() {
    location.reload();
}


setInterval(refreshPage, 30 * 60 * 1000);