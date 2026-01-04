// ==UserScript==
// @name              PornoLab.net | Clean Layout [de-bloated]
// @name:sv           PornoLab.net | Ren Layout [avskalad]
// @name:ru           PornoLab.net | чистый макет | [раздетый]
// @namespace         pornolabs-compact
// @version           1.2.2
// @description       Clean, ad-free layout with improved structure for Pornolab
// @description:sv    Ren, reklamfri layout med förbättrad struktur för Pornolab
// @description:ru    чистый макет без рекламы с улучшенной структурой для Pornolab
// @author            7KT-SWE
// @license MIT
// @icon              https://7kt.se/resources/images/pbicon.png
// @homepageURL       https://7kt.se/
// @contributionURL   https://www.paypal.com/donate/?hosted_button_id=2EJR4DLTR4Y7Q
// @supportURL        https://openuserjs.org/scripts/arvid-demon/PornoLab.net_Clean_Layout_[de-bloated]/issues
// @include           *://pornolab.net/*
// @include           *://pornolab.cc/*
// @include           *://pornolab.biz/*
// @grant GM_addStyle
// @run-at document-end
// @compatible Chrome >=55 + Tampermonkey + Violentmonkey
// @compatible Firefox >=56 + Tampermonkey + Violentmonkey
// @compatible Opera + Tampermonkey + Violentmonkey
// @compatible Edge + Tampermonkey + Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/453951/PornoLabnet%20%7C%20Clean%20Layout%20%5Bde-bloated%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/453951/PornoLabnet%20%7C%20Clean%20Layout%20%5Bde-bloated%5D.meta.js
// ==/UserScript==
if (typeof GM_addStyle !== "function") {
  function GM_addStyle(css) {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    const head = document.documentElement ?? document.getElementsByTagName("head")[0];
    head.appendChild(style);
  }
}

function patch_css() {
  // patch css
  GM_addStyle(`
  .site-logo {
        width: auto;
        height: 92px;
    }
    #main-nav {
        padding: 0px 10px;
    }
    a[href^="https://bongacams8.com/track?c=607068"] {
        display: none;
    }
    a[href^="https://bongacams11.com/track?c=607068"] {
        display: none;
    }
    a[href^="https://externet.org"] {
        display: none !important;
    }
    .freeleech-icon {
        bottom: 139px;
        top: 46px;
        left: 233px;
        color: #1c66d7;
        font-size: 22px;
    }
    #pl-speedbar {
        display: none !important;
    }
    .bypass-alert {
        display: none;
    }
    .sb2-block {
        margin: 0px 0px 10px 5px;
        margin-top: 0px;
        padding: 0px 5px 0 0;
    }
    #cookieNotice {
        display: none;
    }
    #vsxshop-2 {
        display: none !important;
    }
    #bn-toy-1 {
        display: none !important;
    }
    #bn-gsdeluxe-1 {
        display: none !important;
    }
    .maintitle, .pagetitle {
        width: 80%;
        word-break: break-word;
    }
    .topmenu {
        position: absolute;
        justify-content: right;
        float: right;
        right: 0%;
        top: -4px;
        background: transparent;
        border-color: transparent;
        width: min-content;
    }
    #page_header > div:nth-of-type(2) {
        position: absolute !important;
        top: 20.8px !important;
        border-color: transparent !important;
        width: fit-content !important;
        background: #67656569 !important;
        padding: 5px 17px 5px 5px !important;
        margin: 0px 15px 0px !important;
        right: -15px !important;
    }
    h3 {
        letter-spacing: 0px;
    }
    .cat_title {
        letter-spacing: 0px;
    }
    #latest_news > table > tbody tr > td > span,
    #latest_news > table > tbody > tr > td > a,
    #main_content_wrap > table > tbody > tr > td > a[style="font-size: 13px;"],
    #main_content_wrap > table > tbody > tr > td > span[style="font-size: 13px;"] {
        display: none !important
    }
    #adriver-240x120 {
        display: none !important;
    }
    .topmenu td {
        position: relative;
        top: 0px;
        background: transparent;
    }
    #body_container {
        padding: 0 0 25px;
    }
    #page_footer {
        display: none;
    }
    .bottom_info {
        padding-bottom: 10px;
    }
    iframe {
        display: none !important
    }
    #fs-sel-cat {
        margin-top: -3px;
    }
    textarea:focus, input:focus {
        outline: none;
    }
    .splk {
        display: none;
    }
    #vgfgesfsfsder34 {
        display: none;
    }
    .splk3 {
        display: none;
    }
    #logo > table > tbody > tr > .tCenter {
        display: none;
    }
    #gfgfg343 {
        display: none !important;
}
`)
};
patch_css();
