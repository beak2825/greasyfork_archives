// ==UserScript==
// @name Steam 伪装成 蒸汽平台
// @namespace https://github.com/userElaina/this-is-the-China-website
// @version 2023.09.22.01
// @description 中国人就用蒸汽平台
// @author userElaina
// @license MIT
// @match *://*.steampowered.com/*
// @match *://*.steamcommunity.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/461435/Steam%20%E4%BC%AA%E8%A3%85%E6%88%90%20%E8%92%B8%E6%B1%BD%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/461435/Steam%20%E4%BC%AA%E8%A3%85%E6%88%90%20%E8%92%B8%E6%B1%BD%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function f_succ(f, msSleep = 500, maxCount = 10) {
    let count = 0;
    while (true) {
        if (f()) {
            return true;
        }
        count++;
        if (count > maxCount) {
            return false;
        }
        await sleep(msSleep);
    }
}

(async function () {
    // change title
    document.title = document.title.replace('Steam', '蒸汽平台');

    // change logo on top left
    f_succ(() => {
        let logo = document.getElementById("logo_holder");
        if (logo === null) {
            return false;
        }
        logo.childNodes[1].childNodes[1].src = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/steam/logo.svg';
        return true;
    });

    /*
    let giftcard = document.getElementsByClassName('home_page_gutter_giftcard');
    if (giftcard.length > 0) {
        giftcard[0].height = 0;
    }
    */

    // hide giftcard
    f_succ(() => {
        let giftcard = document.getElementsByClassName('top_promo ds_no_flags app_impression_tracked');
        if (giftcard.length <= 0) {
            return false;
        }
        giftcard[0].innerHTML = '';
        return true;
    });

})();
