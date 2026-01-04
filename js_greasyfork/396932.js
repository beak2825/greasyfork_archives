// ==UserScript==
// @name         Zap-Hosting DarkMode
// @name:de      Zap-Hosting DarkMode
// @namespace    http://sironet.eu
// @version      B0.4
// @description  This is a Zap-Hosting.com Dark Theme
// @description:de  Dies ist ein Zap-Hosting.com Dark Theme
// @author       namePlayer
// @contributor  Eric [Zap-Hosting]
// @match        https://zap-hosting.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396932/Zap-Hosting%20DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/396932/Zap-Hosting%20DarkMode.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

(function() {
    'use strict';

    // Main GUI
    GM_addStyle('body, .extend-grey-with-top::before { background: #1C1C1C; }');
    GM_addStyle('span.badge { background: #27AE60; }');
    GM_addStyle('.top-order-calltoaction { background: #27ae60; }');
    GM_addStyle('.action { background: #212121; }');
    // Elements
    GM_addStyle('strong { color: #ECF0F1 }');
    GM_addStyle('p.title { color: #ECF0F1; }');
    GM_addStyle('.icon-text-box { background: #212121; }');
    GM_addStyle('div.text span {color: #ecf0f1;}');
    GM_addStyle('div.text span.label {color: #bdc3c7;}');
    GM_addStyle('.dropdown-heading { background: #1F1F1F; }');
    GM_addStyle('hr {background: #1C1C1C;}');
    GM_addStyle('.navigation-row { background: #1f1f1f; }');
    GM_addStyle('.textbox { -webkit-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64);-moz-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64);box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64); background: #252525; }');
    // Top-Navigation
    GM_addStyle('.mail { color: #27AE60;}');
    GM_addStyle('.fullwidth-dropdown:hover { background: #27ae60; }');
    // Navigation
    GM_addStyle('#nav { background: #1F1F1F; transition: 0.4s;}');
    GM_addStyle('.searchbox { background: #1F1F1F; color: #7f8c8d; }');
    GM_addStyle('span.caption { color: #7f8c8d; }');
    GM_addStyle('a.link-home { color: #27ae60; }');
    GM_addStyle('.standalone-icon { color: #27ae60; }');
    //Special Navs
    GM_addStyle('.service-nav-new .content { background: #1F1F1F; }');
    GM_addStyle('.service-nav-new .content .fa { color: #bdc3c7; }');
    // Between Navs
    GM_addStyle('.heading-box { background: #454545; color: #ECF0G1;}');
    // Main Content
    GM_addStyle('.service-content { background: #1C1C1C; -webkit-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64);-moz-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64);box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.64);}');
    GM_addStyle('.panel-description { color: #ECF0F1; }');
    // Product Panels
    GM_addStyle('.title { background: #1F1F1F; }');
    GM_addStyle('h4.heading { color: #ECF0F1; }');
    GM_addStyle('#vserver-panel, #domains-panel, #voiceserver-panel, #bot-panel, #rootserver-panel, #webspace-panel, #gameserver-panel, #downloads-panel, #mccms-panel, #software-panel { background: #1F1F1F; }');
    GM_addStyle('.countdown, .value { color: #BDC3C7; }');
    GM_addStyle('.text-decoration-none { color: #27AE60; }');
    GM_addStyle('.button-positive { background: #2ECC71; }');
    GM_addStyle('.button-negative { background: #e74c3c; }');
    GM_addStyle('.button-info { background: #2980B9; }');
    GM_addStyle('.button-dark { background: #2C3E50; }');
    GM_addStyle('.element-box-container { background: #1F1F1F; }');
    GM_addStyle('.button-corners { background: #2F2F2F; }');
    GM_addStyle('.button-positive { background: #27ae60; }');
    GM_addStyle('.button-warning { background: #2F2F2F; }');
    // Product List
    GM_addStyle('.element-box { background: #1F1F1F; -webkit-box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.51); -moz-box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.51);box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.51);}');
    GM_addStyle('.element-grey { background: #1F1F1F; ');
    GM_addStyle('.panel-heading { background: #27AE60; }');
    // Sideboard
    GM_addStyle('.sidebar-title-text span.title { color: #3E3E3E; background: #1F1F1F;}');
    GM_addStyle('ul.dropdown-nav li { background: #1F1F1F; }');
    GM_addStyle('ul.dropdown-nav li a .title { color: #ECF0F1; }');
    GM_addStyle('.sidebar-title { background: #212121 !important; border-radius: 10px; border: 2px solid #239955; padding: 15px; }')
    GM_addStyle('.sidebar-title-text span.title { color: #d4d4d4 !important; background: #212121 !important;}');
    // Control Interface
    GM_addStyle('.announcement { background: #1F1F1F; color: white; width: 100%;}');
    GM_addStyle('.box-title { background: #0F0F0F; color: #ecf0f1; }');
    GM_addStyle('.package-status { background: #2E2E2E; -webkit-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); -moz-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); }');
    // GM_addStyle('.box-title { background: #2f2f2f; width: 100%;}');
    // Boxes
    GM_addStyle('.voucher-box .content { background: #212121; }');
    GM_addStyle('.voucher-box p.margin-bottom-0 { background: #3F3F3F3; }');
    GM_addStyle('.text, .container-box { background: #212121; }');
    GM_addStyle('.event-box { background: #1E1E1E; } finished { background: #27ae60; }');
    // Tables
    GM_addStyle('#openTickets *,#closedTickets *,.modal-box,.form-new *, #credit-card-list-container *, #cashbox-dashboard *, #packageList * { background: #212121; color: #fff; }');
    GM_addStyle('.table-new { background: #212121; color: white; }');
    // Posts
    GM_addStyle('.post .content, .post .sidebar { background: #1F1F1F;}');
    GM_addStyle('.post .sidebar { background: #1F1F1F;}');
    // Popups
    GM_addStyle('.modal-box-content { background: #1F1F1F; }');
    GM_addStyle('.modal-box footer { background: #0F0F0F; }');
    GM_addStyle('#rconCmd { background: #4E4E4E; }');
    GM_addStyle('#ticket-answer-message { background: #4E4E4E; color: lightgray;}');
    // Profile
    GM_addStyle('.list * { background: #212121; color: #eee; }');
    GM_addStyle('.list ul li:hover { color: #27ae60; }');
    // Dash-Icons
    GM_addStyle('.pull-right ul li a { color: #E4E4E4; transition: 0.5s; }');
    GM_addStyle('.pull-right ul li:hover a { color: #27AE60; }');
    // 2-fact-auth & Security
    GM_addStyle('#twofactor-container-body { background: #2E2E2E; -webkit-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); -moz-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); }');
    GM_addStyle('#twofactor-container-title { background: #27ae60; -webkit-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); -moz-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); }');
    GM_addStyle('.h6-bold { color: white; } #submitCode { background: #27ae60; }');
    GM_addStyle('.indicator-box { background: #212121; color: white; } ');
    // Mail-Settings
    GM_addStyle('.information-box-with-footer { background: #1F1F1F; }');
    GM_addStyle('.information-box-with-footer footer { background: #2F2F2F; }');
    // Order
    GM_addStyle('.wide-teaser {background: #212121; -webkit-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); -moz-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53);' );
    // Maintanance
    GM_addStyle('.tooltip-maintenance {background: #212121; -webkit-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); -moz-box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53); box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.53);} color: white;');
})();