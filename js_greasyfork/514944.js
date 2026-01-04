// ==UserScript==
// @name         Better Router Settings for Tenda
// @namespace    https://naeembolchhi.github.io/
// @version      0.2
// @description  Improves the Tenda router config page.
// @author       NaeemBolchhi
// @match        *://192.168.0.1/*
// @match        *://192.168.2.1/*
// @license      GPL-3.0-or-later
// @icon         https://www.tendacn.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514944/Better%20Router%20Settings%20for%20Tenda.user.js
// @updateURL https://update.greasyfork.org/scripts/514944/Better%20Router%20Settings%20for%20Tenda.meta.js
// ==/UserScript==

// Define stylesheet
const customCSS = `
    * {
        box-sizing: border-box;
    }
    .container {
        width: calc(100% - 5rem);
    }
    .navbar-header,
    .container::before, .container::after,
    .main-container::before, .main-container::after,
    #nav::before, #nav::after,
    #nav-menu::before, #nav-menu::after,
    .row::before, .row::after {
        display: none;
    }
    #nav {
        display: flex;
    }
    #nav, #nav-footer-icon {
        width: calc(15svw - 5rem) !important;
    }
    #nav-menu {
        height: unset !important;
        flex: 1 0 auto;
    }
    #main-content, .main-footer {
        width: calc(85svw - 5rem) !important;
    }
    #main-content {
        height: unset !important;
        margin-bottom: 0 !important;
        flex: 1 0 auto;
    }
    .main-container {
        display: flex;
        margin: 2rem 0;
        flex: 1 0 auto;
    }
    div.md-modal-wrap.md-show:has(#loginPasswordWrapper),
    div.md-overlay:has(+ div.md-show) {
        display: none;
    }
    a {
        outline: 0 !important;
    }
    body, #main_content {
        display: flex !important;
        flex-direction: column;
        height: fit-content;
        min-height: 100%;
        width: 100%;
        flex: 1 0 auto;
    }
    section.container {
        flex: 1 0 auto;
        display: flex;

    }
    header {
        margin-bottom: 0 !important;
        min-height: 40px !important;
    }
    #statusWAN {
        margin-bottom: 2rem;
    }
    footer .row {
        margin: 0 !important;
        display: flex;
    }
    footer .main-footer {
        flex: 1 0 auto;
    }
    fieldset {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative !important;
    }
    #statusInternet fieldset {
        padding-bottom: 4rem;
    }
    #statusInternet fieldset > p {
        position: absolute !important;
        bottom: 0;
        left: 0;
        width: 100% !important;
        text-align: center;
    }
    fieldset:has(input[name='wifiRelayType']) .form-group > div:nth-of-type(1) {
        display: flex;
        width: fit-content;
    }
    #wireless fieldset,
    #wanCfgWrapper fieldset,
    #attachedDevices fieldset,
    #blockedDevices fieldset,
    #controlsDevices fieldset,
    #accessControl fieldset,
    fieldset:has(label[for='LEDEnable']),
    fieldset:has(label[for='wifiTimeEnable']),
    #macFilterWrap fieldset,
    #iptv fieldset,
    #staticIPMapping fieldset,
    #protMapping fieldset,
    #ddnsConfig fieldset,
    #dmzHost fieldset,
    #upnp fieldset,
    #firewall fieldset,
    fieldset:has(#client-btn),
    #ipv6En fieldset,
    #loginPwd fieldset,
    #wanParam fieldset,
    #lanParame fieldset,
    #remoteWeb fieldset,
    #timeSet fieldset,
    #deviceManage fieldset {
        display: block;
    }
    #macFilterWrap fieldset label[for='curFilterMode']+div {
        display: flex;
        flex-direction: column;
    }
`;

// Add stylesheet
function addStyle() {
    let style = document.createElement('style');
    style.textContent = customCSS;
    style.type = 'text/css';

    document.head.appendChild(style);
}

// Fix logo link
function logoLink() {
    let logo = document.querySelector('a[href="http://tendacn.com"]');

    logo.setAttribute('href','javascript:(function()%7Bwindow.location.reload(true)%3B%7D)()%3B');
    logo.removeAttribute('target');
}

addStyle();
logoLink();