// ==UserScript==
// @name         Koreapas Helper
// @description  extension for koreapas.com
// @version      0.1
// @match        *.koreapas.com/*
// @author       kucs_???
// @namespace https://greasyfork.org/users/564173
// @downloadURL https://update.greasyfork.org/scripts/403540/Koreapas%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/403540/Koreapas%20Helper.meta.js
// ==/UserScript==

const removeAd = () => {
    const sites = ['netinsight.co.kr', 'clickmon.co.kr'];
    // disable google ads
    let google = document.getElementsByClassName('adsbygoogle');

    Array.prototype.forEach.call(google, ad => {
        if(ad.getAttribute('data-ad-client')){
            ad.style = '';
            ad.style.display = 'none';
        }
    });

    // disable other ads
    let iframes = document.getElementsByTagName('iframe');
    Array.prototype.forEach.call(iframes, ad => {
        sites.forEach(i => {
          if(ad.src.search(i) !== -1){
              ad.style = '';
              ad.style.display = 'none';
          }
        })
    });
    console.log( "Message by Koreapas Helper.\n" + google.length+iframes.length + " ads removed!");
}

const playgif = () => {
    const test = document.querySelectorAll('[id^="gifb_button_"], [id^="gif_button_"]');
    for(const gif of test) gif.click();
    console.log( "Message by Koreapas Helper.\n"+ test.length + " gifs detected!");
}

const removeUserId = () => {
    document.querySelector('[itemprop="articleBody"]').querySelector('span').remove();
    document.querySelector('[id="color"]').remove()
    let text = document.querySelector('[title="조회수"]').previousElementSibling.previousElementSibling.innerText;
    document.querySelector('[title="조회수"]').previousElementSibling.previousElementSibling.innerText = text.slice(0,-9)
}

(function() {
    'use strict';
    removeAd();
    playgif();
    removeUserId();
})();