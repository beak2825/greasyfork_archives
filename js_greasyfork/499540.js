// ==UserScript==
// @name                Waze Forum Dark Mode
// @namespace           https://greasyfork.org/users/1082691
// @description         Enables dark mode for Waze forum pages
// @include             https://www.waze.com/forum/*
// @grant               none
// @version             1.0
// @author              DevlinDelFuego & Twister-UK
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/499540/Waze%20Forum%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/499540/Waze%20Forum%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function darkMode() {
        const GREYSCALE = ['#101010', '#303030', '#444444', '#787878', '#BABABA', '#F0F0F0'];
        let styles = "";

        // Greyscale theming
        styles += 'body { background-color:' + GREYSCALE[0] + '!important; color:' + GREYSCALE[1] + ' !important; }';
        styles += '.bg-gray-100{ background-color:' + GREYSCALE[1] + '; }';
        styles += 'h1,h2,h3,h4,h5,h6,.forum-header h1{ color:' + GREYSCALE[5] + '; }';
        styles += '.content{ color:' + GREYSCALE[4] + ': }';
        styles += '.postprofile{ color:' + GREYSCALE[4] + ': }';
        styles += '.postprofile strong{ color:' + GREYSCALE[4] + ': }';
        styles += '.bg1{ background-color:' + GREYSCALE[1] + '; }';
        styles += '.bg2{ background-color:' + GREYSCALE[1] + '; }';
        styles += '.waze-grey-800, a.waze-grey-800{ color:' + GREYSCALE[4] + '; }';
        styles += '.waze-grey-900, a.waze-grey-900, .wz-forums-grey-900{ color:' + GREYSCALE[3] + '; }';
        styles += '.text-gray-900{ color:' + GREYSCALE[3] + '; }';
        styles += '.text-gray-800{ color:' + GREYSCALE[5] + '; }';
        styles += '.text-body-2{ color:' + GREYSCALE[3] + '; }';
        styles += '.page-body{ color:' + GREYSCALE[3] + '; }';
        styles += '.bg-gray-200{ background-color:' + GREYSCALE[4] + '; }';
        styles += '.cp-mini{ background-color:' + GREYSCALE[1] + '; }';
        styles += '#phpbb blockquote{ background-color:' + GREYSCALE[0] + '; color:' + GREYSCALE[4] + ' }';
        styles += '#phpbb blockquote a{ color:' + GREYSCALE[5] + ' !important; }';
        styles += '.topiclist li.header{ color:' + GREYSCALE[5] + '; background-color:' + GREYSCALE[4] + ' }';
        styles += 'ul.forums{ background-color:' + GREYSCALE[1] + '; color:' + GREYSCALE[5] + ' }';
        styles += 'li.row dd.posts, li.row dd.views{ color: ' + GREYSCALE[4] + '; }';
        styles += '.postprofile strong{ color: ' + GREYSCALE[4] + '; }';
        styles += '.wz-forums-grey-800{ color: ' + GREYSCALE[4] + '; }';
        styles += '.wz-forums-grey-700{ color: ' + GREYSCALE[4] + '; }';
        styles += '.stat-block{ background-color: ' + GREYSCALE[0] + '; }';
        styles += '.footer-block .footer-block-content div{ color: ' + GREYSCALE[3] + '!important; }';
        styles += '.panel{ color: ' + GREYSCALE[3] + '; background-color: ' + GREYSCALE[1] + '; }';
        styles += '.content{ color: ' + GREYSCALE[4] + '; }';
        styles += 'body#phpbb.hasjs select:not{ background-color: ' + GREYSCALE[1] + '!important; }';
        styles += '#phpbb .row .list-inner{ color: ' + GREYSCALE[3] + '; }';
        styles += 'dd.lastpost{ color: ' + GREYSCALE[3] + '; }';
        styles += 'article.ucp-main{ color: ' + GREYSCALE[3] + '!important; }';
        styles += '.mr-3{ color: ' + GREYSCALE[3] + '; }';
        styles += 'fieldset.fields1{ background-color: ' + GREYSCALE[1] + '; color: ' + GREYSCALE[3] + '!important; }';
        styles += '.mb-3{ color: ' + GREYSCALE[3] + '; }';
        styles += 'form.ucp-form{ color: ' + GREYSCALE[3] + '; }';
        styles += 'div.tabs-content{ background-color: ' + GREYSCALE[3] + '!important; }';
        styles += '.pagination{ color: ' + GREYSCALE[4] + '; }';
        styles += '.topiclist li.header{ color: ' + GREYSCALE[1] + '; }';
        styles += 'td.active{ color: ' + GREYSCALE[3] + '; }';
        styles += '.mainpage-title { color:' + GREYSCALE[0] + '; }';
        styles += '.number { color:' + GREYSCALE[0] + '; }';
        styles += '.text { color:' + GREYSCALE[0] + '; }';
        styles += 'li.row strong { color:' + GREYSCALE[4] + '; }';
        styles += 'li.row:hover{ background-color:' + GREYSCALE[0] + '; }';
        styles += '.mx-3 { color:' + GREYSCALE[5] + '; }';
        styles += '.explain { color:' + GREYSCALE[4] + '!important; }';
        styles += '.pl-6:hover, .pl-3:hover { background-color:' + GREYSCALE[2] + '!important; }';
        styles += '.member__left-col { color:' + GREYSCALE[4] + '!important; }';
        styles += '.member__col { color:' + GREYSCALE[5] + '; }';
        styles += '.memberlist--boxes .h3 { color:' + GREYSCALE[3] + '; }';
        styles += '.post-content-and-profile-wrp { color:' + GREYSCALE[4] + '; }';

        styles += '.footer-block-icon { filter:brightness(4); }';
        styles += 'wz-radio-button, wz-checkbox { filter:invert(); }';
        styles += 'wz-button { filter:brightness(0.85) invert(); }';
        styles += '.before-explain { filter:invert(); }';
        styles += '.waze-already-commented { filter:invert() brightness(2); }';
        styles += '.tabs { filter:invert(); }';

        styles += 'a.topictitle { color:' + GREYSCALE[4] + '!important; }';
        styles += '.footer-block .footer-block-content div { color:' + GREYSCALE[4] + '!important; }';

        styles += '.error { color:#FF8040; }';

        // Colour accents
        styles += '.bg-color-blue-topic{ background-color:#102030; }';
        styles += '.waze-grey-800:hover{ color: #a0a000; }';
        styles += 'a:hover{ color: #ffff00; }';
        styles += '.waze-grey-900:hover{ color: #a0a000; }';


        styles += '.postimage { background-color: white; }';

        addGlobalStyle(styles);
    }

    darkMode();
})();
