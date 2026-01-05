// ==UserScript==
// @name         CleanDeviantart
// @namespace    http://tampermonkey.net/
// @version      0.1.4.0
// @description  clean invisible publicity and anti-adblock on deviantart
// @author       LordKBX
// @icon http://i.deviantart.net/icons/da_favicon.ico
// @include http://*.deviantart.com/*
// @include https://*.deviantart.com/*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_openInTab
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-start
// @encoding utf-8
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @homepage https://greasyfork.org/fr/scripts/20856-cleandeviantart
// @contactURL mailto:kevboulain@free.fr
// @supportURL mailto:kevboulain@free.fr
// @downloadURL https://update.greasyfork.org/scripts/20856/CleanDeviantart.user.js
// @updateURL https://update.greasyfork.org/scripts/20856/CleanDeviantart.meta.js
// ==/UserScript==
updateInterval = null;
timeInterval = 800;

(function() {
    'use strict';
    updateInterval = setInterval(cleaning, timeInterval);
})();

function cleaning(){
    var item = document.querySelector('img[alt=\"Core\"]');
    if(item !== null){ item.parentNode.parentNode.removeChild(item.parentNode); }
    item = document.querySelector('.mc-ad-chrome');
    if(item !== null){ while(item !== null){ item.parentNode.removeChild(item); item = document.querySelector('.mc-ad-chrome'); } }
    item = document.querySelector('#block-notice');
    if(item !== null){ item.parentNode.removeChild(item); }
    //promo
    item = document.querySelector('#oh-menu-promo');
    if(item !== null){ item.parentNode.removeChild(item); }
    item = document.querySelector('.gogo-upsell');
    if(item !== null){ item.parentNode.removeChild(item); }
}