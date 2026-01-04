// ==UserScript==
// @name         tradingview - Remove Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tradingview - Remove Ads 122
// @author       You
// @match        https://www.tradingview.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/465189/tradingview%20-%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/465189/tradingview%20-%20Remove%20Ads.meta.js
// ==/UserScript==


//*[@id="overlap-manager-root"]/div[2]/div

function removeAdvert(adId) {
    const adElement = document.getElementById(adId);
    if (adElement && adElement.parentNode) {
        adElement.parentNode.removeChild(adElement);
        console.log(`Removed ad element with ID: ${adId}`);
    }
}

setInterval(() => {
    removeAdvert('overlap-manager-root');
    removeAdvert('tv-toastst');
}, 5000); // Kiểm tra và xóa phần tử sau mỗi 5 giây
