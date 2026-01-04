// ==UserScript==
// @name         Meneame.net - Ruleta rusa
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Juégate el karma votando noticias sin ver si es muro de pago
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485155/Meneamenet%20-%20Ruleta%20rusa.user.js
// @updateURL https://update.greasyfork.org/scripts/485155/Meneamenet%20-%20Ruleta%20rusa.meta.js
// ==/UserScript==

const External_URL_Location_Desktop = '.news-summary > .news-body > .center-content > h2 > a.ga-event';
const External_URL_Location_Mobile = '.news-summary > .news-body.mobile > h2 > a.ga-event';
//const Default_Proxy = 'https://1ft.io/proxy?q=';
const Default_Proxy = 'https://www.smry.ai/proxy?url=';
const Twitter_Proxy ='https://nitter.net/search?f=tweets&q=';
const Twitter_URL = 'https://twitter.com';
const Icon_SVG = "<a href='URL_MENEO'><svg version='1.1' viewBox='0 0 2.92 2.91' width='20px' height='20px'><g transform='matrix(.0137 0 0 .013 4.1 .6)'><path d='m-193-45.6c-9.08-0.0078-17.8 1.24-24.5 3.51-26.3 39-48.9 27.9-54.6 31.6-4.3 2.72-19.7 22.5-25.9 44.2 12.8 21.4 9.21 41.8 0 63.1 3.45 17.7 12.9 34.3 25.2 44.3 21.3 0.891 40.1 10.8 54.6 31.5 17.1 5.74 35.2 5.62 51.7 0.335 15.2-20.8 31.9-31.5 56.2-32.8 15.5-13.3 21.1-25.9 24-43.3-10.5-17.8-10.9-48.2 0.0093-62.7 0.384-14.6-9.58-31.6-23-41.9-29.9-1.19-45.4-11.9-56.6-33.7-8.38-2.77-17.9-4.03-26.9-4.04zm-59.2 48.4a28.1 28.1 0 0 1 28.1 28.1 28.1 28.1 0 0 1-28.1 28.1 28.1 28.1 0 0 1-28.1-28.1 28.1 28.1 0 0 1 28.1-28.1zm120 0.529a28.1 28.1 0 0 1 28.1 28.1 28.1 28.1 0 0 1-28.1 28.1 28.1 28.1 0 0 1-28.1-28.1 28.1 28.1 0 0 1 28.1-28.1zm-60.4 48.2a13.7 13.7 0 0 1 13.7 13.7 13.7 13.7 0 0 1-13.7 13.7 13.7 13.7 0 0 1-13.7-13.7 13.7 13.7 0 0 1 13.7-13.7zm-59.1 20.4a28.1 28.1 0 0 1 28.1 28.1 28.1 28.1 0 0 1-28.1 28.1 28.1 28.1 0 0 1-28.1-28.1 28.1 28.1 0 0 1 28.1-28.1zm119 0.529a28.1 28.1 0 0 1 28.1 28.1 28.1 28.1 0 0 1-28.1 28.1 28.1 28.1 0 0 1-28.1-28.1 28.1 28.1 0 0 1 28.1-28.1zm-60 34.4a28.1 28.1 0 0 1 28.1 28.1 28.1 28.1 0 0 1-28.1 28.1 28.1 28.1 0 0 1-28.1-28.1 28.1 28.1 0 0 1 28.1-28.1z' fill='#b3b3b3' stroke='#3a3836'/><circle cx='-193' cy='-3.48' r='28.1' fill='#fc0' stroke='#000' stroke-width='1.21'/></g></svg></a>";

function UseProxy(Meneo) {
    if (Meneo && Meneo.tagName.toLowerCase() === "a") {
        Meneo.parentNode.innerHTML = Icon_SVG.replace('URL_MENEO', EncodedURL(Meneo.getAttribute('href'))) + Meneo.parentNode.innerHTML;
    }
}

function EncodedURL(URL2Encode) {
    let isTwitter = ForceHTTPS(URL2Encode).toLowerCase().startsWith(Twitter_URL);
    return (isTwitter ? Twitter_Proxy : Default_Proxy) + encodeURIComponent(isTwitter ? URL2Encode.split('?')[0] : URL2Encode);
}

function ForceHTTPS(URL) {
    return !URL.toLowerCase().startsWith('https://') ? URL.toLowerCase().replace('http://','https://') : URL;
}

function IsMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

(function() {
    var Meneos = document.querySelectorAll(IsMobileDevice() ? External_URL_Location_Mobile : External_URL_Location_Desktop);
    Meneos.forEach(Meneo => UseProxy(Meneo));
})();