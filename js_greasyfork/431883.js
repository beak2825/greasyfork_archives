// ==UserScript==
// @name         Facebook PitchBlack
// @name:tr      Facebook Simsiyah Tema
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Change Facebook Dark Theme Colors To Pitch Black And Red!
// @description:tr Facebook Temasını Kapkaranlık ve Kırmızılar ile Dolu Bir Temaya Dönüştürün
// @copyright    2021 Kraptor (https://openuserjs.org/users/Kraptor)
// @license MIT
// @author       Kraptor
// @match        https://www.facebook.com/
// @include      https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431883/Facebook%20PitchBlack.user.js
// @updateURL https://update.greasyfork.org/scripts/431883/Facebook%20PitchBlack.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//Colors
addGlobalStyle(":root,.__fb-dark-mode{--surface-background: #040203; important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-deemphasized-button-text: #98050C; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--fb-logo-color:#98050C; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-icon:#98050C; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-button-text:#FFFFFF; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-button-pressed:#98050C; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-button-background-experiment:#2374E1; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--primary-button-background:#98050C; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--hover-overlay:rgba(0, 0, 0, 0.05); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--media-hover:rgba(152, 5, 12, 0.15); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--hover-overlay:rgba(0, 0, 0, 0.05); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--media-hover:rgba(152, 5, 12, 0.15); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--hover-overlay:rgba(152, 5, 12, 0.1); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--card-background: #040203; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--card-background-flat: #040203; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--comment-background: #4B0205; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--highlight-bg: #4B0205; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--messenger-card-background: #040203; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--messenger-reply-background: #040203;!important;}");
addGlobalStyle(":root,.__fb-dark-mode{--nav-bar-background-gradient-wash:linear-gradient(to top, #040203, rgba(4, 2, 3,.9), rgba(4, 2, 3,.7), rgba(4, 2, 3,.4), rgba(4, 2, 3,0)); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--nav-bar-background: #040203; !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--nav-bar-background-gradient:linear-gradient(to top, #040203, rgba(4, 2, 3,.9), rgba(4, 2, 3,.7), rgba(4, 2, 3,.4), rgba(4, 2, 3,0)); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--nav-bar-background-gradient-wash:linear-gradient(to top, #040203, rgba(4, 2, 3,.9), rgba(4, 2, 3,.7), rgba(4, 2, 3,.4), rgba(4, 2, 3,0)); !important;}");
addGlobalStyle(":root,.__fb-dark-mode{--web-wash: #040203; !important;}");