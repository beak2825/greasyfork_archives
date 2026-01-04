// ==UserScript==
// @name         Bypass Modiji Team SPY (Chrome)
// @namespace    CHROME Scripts
// @version      11.2
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @icon         https://lh3.googleusercontent.com/-HPcn7AqepNg/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknb1BkQiq-8_KUVOYcNAJ4swKivDQ/photo.jp
// @description  Automatically bypass Modiji URL (Chrome)
// @homepageURL  https://t.me/team_spy_pro
// @supportURL   https://t.me/team_spy_pro
// @include      /^https:\/\/[^\/]+\/safe\.php\?link=https:\/\/modijiurl\.com\/[^\/]+\/\?mid=.*$/
// @include      /^https:\/\/modijiurl\.com\/[^\/]+\/\?mid=.*$/
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522096/Bypass%20Modiji%20Team%20SPY%20%28Chrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522096/Bypass%20Modiji%20Team%20SPY%20%28Chrome%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    const redirect = finalUrl => window.location.assign(finalUrl);
    const getParam = (url, param) => new URLSearchParams(url).get(param);
    const rot13 = str => str.replace(/[A-Za-z]/g, char => String.fromCharCode((char.charCodeAt(0) % 32 + 13) % 26 + (char < 'a' ? 65 : 97)));
    const popupsToRedirects = () => window.open = (url, target, features) => (window.location.href = url, window);
    const afterDOMLoaded = (callback) => document.addEventListener('DOMContentLoaded', callback);
    const afterWindowLoaded = (callback) => window.addEventListener('load', callback);
    const isValidUrl = url => /^(?:https?|ftp):\/\/(?:\w+\.){1,3}\w+(?:\/\S*)?$/.test(url);
    const clickIfExists = (selector) => { let intervalId = setInterval(() => { let button = document.querySelector(selector); if (button) { clearInterval(intervalId); button.click(); } }, 1000); };
    const redirectIfExists = (selector) => { let intervalId = setInterval(() => { let button = document.querySelector(selector); if (button.href && isValidUrl(button.href)) { clearInterval(intervalId); redirect(button.href); } }, 500); };
    const clickIfExistsNonStop = (selector) => { let intervalId = setInterval(() => { let button = document.querySelector(selector + ':not(.disabled)'); if (button) { button.click(); } }, 500); };
    const redirectIfNotDisabled = (selector) => { let intervalId = setInterval(() => { let linkButton = document.querySelector(selector + ':not(.disabled)'); if (linkButton && !linkButton.href.includes('/undefined')) { clearInterval(intervalId); setTimeout(function() { redirect(linkButton.href); }, 500); } }, 500); };
    const clickIfNotDisabled = (buttonSelector) => { let intervalId = setInterval(() => { let button = document.querySelector(buttonSelector); if (!button.hasAttribute('disabled') && !button.classList.contains('disabled')) { clearInterval(intervalId); setTimeout(function() { button.click(); }, 500); } }, 500); };
    const checkElementVisible = element => element !== null && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) && (!element.getAttribute('style') || !element.getAttribute('style').includes('display:none'));
    const clickIfVisible = selector => { afterDOMLoaded(function() { let intervalId = setInterval(() => { let element = document.querySelector(selector); if (checkElementVisible(element)) { clearInterval(intervalId); element.click(); } }, 1000); }); };
    const preventForcedFocusOnWindow = () => {
        window.onblur = null;
        window.onfocus = null;
        document.hasFocus = () => true;
        Object.defineProperty(document, 'webkitVisibilityState', { get() { return 'visible'; } });
        Object.defineProperty(document, 'visibilityState', { get() { return 'visible'; } });
        Object.defineProperty(document, 'hidden', { get() { return false; } });
    };

    function browserIsChrome() {
        return navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') === -1;
    }

    if (/^https:\/\/[^\/]+\/safe\.php\?link=https:\/\/modijiurl\.com\/[^\/]+\/\?mid=.*$/.test(url) && browserIsChrome()) {
        redirect(url.split('?link=')[1]);
    }

    if (/^https:\/\/modijiurl\.com\/[^\/]+\/\?mid=.*$/.test(url)) {
        redirectIfNotDisabled('#getLinkButton');
    }

})();
