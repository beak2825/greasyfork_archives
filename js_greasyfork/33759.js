// ==UserScript==
// @name        kimcartoon.me No Ads
// @description Remove ads
// @namespace   alaa9jo
// @icon        http://kimcartoon.me/Content/images/favicon.ico
// @match       *://kimcartoon.me/*
// @match       *://kisscartoon.es/*
// @version     2017.9.10
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/33759/kimcartoonme%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/33759/kimcartoonme%20No%20Ads.meta.js
// ==/UserScript==
window.addEventListener('DOMContentLoaded', function (e) {
    if (document.domain == 'kimcartoon.me') {
        removeKimCartoonAds();
        return;
    }

    if (document.domain == 'kisscartoon.es'){
        removeKissCartoonAds();
        return;
    }
});

function removeKimCartoonAds()
{
        /* remove ads */
        for (var elem of document.querySelectorAll(`
            div[class="w-right"],
            div[class="kcAds"],
            div[id="videoAd"]`)) {
            //console.log('[-] removing html sections: ', elem);
            elem.parentElement.removeChild(elem);
        }
}

function removeKissCartoonAds()
{
        /* remove ads */
        for (var elem of document.querySelectorAll(`
            div[id^="BB_SK_"],
            script,
            ins[class="adsbygoogle"],
            div[class="mgbox"],
            iframe`)) {
            elem.parentElement.removeChild(elem);
        }
}