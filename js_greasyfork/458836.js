// ==UserScript==
// @name         HejtoAvatarResizer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zwiększa rozmiar awatarów
// @author       SailorMoon
// @match        https://www.hejto.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hejto.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458836/HejtoAvatarResizer.user.js
// @updateURL https://update.greasyfork.org/scripts/458836/HejtoAvatarResizer.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};

addGlobalStyle('.rounded-full.overflow-hidden[style*="width:34px;height:34px;min-width:34px"] { width: 48px !important; height: 48px !important; min-width: 48px !important;}');
addGlobalStyle('.rounded-full.overflow-hidden[style*="width: 34px; height: 34px; min-width: 34px"] { width: 48px !important; height: 48px !important; min-width: 48px !important;}');
addGlobalStyle('.rounded-full.overflow-hidden[style*="width:24px;height:24px;min-width:24px"] { width: 38px !important; height: 38px !important; min-width: 38px !important; margin-top: 26px !important;}');
addGlobalStyle('.rounded-full.overflow-hidden[style*="width: 24px; height: 24px; min-width: 24px;"] { width: 38px !important; height: 38px !important; min-width: 38px !important; margin-top: 26px !important;}');
addGlobalStyle('.overflow-hidden[style*="margin-left:30px"] { margin-left: 44px !important; margin-top: -20px !important;}');
addGlobalStyle('.overflow-hidden[style*="margin-left: 30px"] { margin-left: 44px !important; margin-top: -20px !important;}');
addGlobalStyle('.font-semibold[style*="margin-left:30px"] { margin-left: 44px !important; margin-bottom: -10px !important; color: gray !important;}');
addGlobalStyle('.font-semibold[style*="margin-left: 30px"] { margin-left: 44px !important; margin-bottom: -10px !important; color: gray !important;}');
addGlobalStyle('div.flex > div.flex.gap-2.items-center.pt-1 > a > span { font-size: .93rem;!important;}');


