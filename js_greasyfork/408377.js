// ==UserScript==
// @name         Theta Classic Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Turn THETA.tv into SLIVER
// @author       Wulf715
// @match        https://www.theta.tv/*
// @match        https://mod.sliver.tv/*
// @match        https://dashboard.theta.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408377/Theta%20Classic%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/408377/Theta%20Classic%20Theme.meta.js
// ==/UserScript==

//actually lets me do the things that i do in this script
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//base theta.tv values, body changes main background, rest is self explanatory
addGlobalStyle(' body {background: rgb(255, 255, 255);} ');
addGlobalStyle(' .navbar {background: rgb(240, 243, 247);} ');
addGlobalStyle(' .sidebar {background: rgb(240, 243, 247);} ');
addGlobalStyle(' html {font-family: "Proxima Nova";} ');
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item {background-color: rgb(221, 226, 235);} ')
addGlobalStyle(' .content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item .name .details {color: black;}')
addGlobalStyle('.emotes-list.large .from {color: black;} ')
addGlobalStyle('.navbar .wallets .amount-coins, .navbar .wallets .amount-theta, .navbar .wallets .amount-tfuel {color: black;} ')
addGlobalStyle('.channel-card .card-title {color: black;} ')
addGlobalStyle('.game-card .game-name {color: black;} ')
addGlobalStyle('html {color: black;} ')
addGlobalStyle('.store-item-card .store-item-wrap {background-color: rgb(221, 226, 235);} ')
addGlobalStyle('.store-item-card .price span {color: black;} ')
addGlobalStyle('.store-item-card .item-title {color: black;} ')
addGlobalStyle('.tfuel-donations-list-item .sender .sender-username {color: black;} ')
addGlobalStyle('.content.inventory-page .claimed-inventory-content .claimed-inventory-list .claimed-inventory-item .left-container .metadata-container .name {color: black;} ')
addGlobalStyle('.chat-container {color: rgb(240, 243, 247);} ')
addGlobalStyle('.content.channel .stream-panel .stream-footer .tfuel-stream-bar {background-color: rgb(240, 243, 247);};} ')
addGlobalStyle('.content.channel .stream-panel .stream-footer {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.streamer-bar .stream-title {color: black;} ')
addGlobalStyle('.streamer-bar .streamer-username {color: black;} ')
addGlobalStyle('.channel-panel {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.channel-panel.about .channel-desc {color: #768aa8;} ')
addGlobalStyle('.content.channel .stream-panel .tfuel-pool .community-share .streamer {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.content.channel .stream-panel .tfuel-pool .community-share .share-total {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.leaderboards-list-item .user-username {color: black;} ')
addGlobalStyle('.page-container .title {color: black;} ')
addGlobalStyle('.leaderboards-list-item .item-details .amount {color: black;} ')
addGlobalStyle('.content.inventory-page .unclaimed-inventory-content .unclaimed-inventory-list .unclaimed-inventory-item {color: black;}')
addGlobalStyle('.leaderboards-selector .empty-list {background-color: white; color: black;} ')
addGlobalStyle('.footer {background: transparent;} ')

//Buttons!(Interchangable styles)
addGlobalStyle('.slvr-button--tfuel {background: linear-gradient(to right, blue 0%, cyan 100%);} ')
// addGlobalStyle('.slvr-button--tfuel {background: #00bfff;} ')

//Chat.
addGlobalStyle('.chat-container {color: black; background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.chat-container .chat-message .content-container .content {color: black;} ')
addGlobalStyle('.chat-container .chat-footer .chat-input {color: black; background: rgb(240, 243, 247);} ')
addGlobalStyle('.chat-container .chat-footer .chat-input-content {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.content.channel .chat-panel .chat-tabs > a {color: black; background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.chat-container .chat-message .content-container .username {color: black;} ')
addGlobalStyle('.chat-container .system-chat-message {background: rgb(240, 243, 247);} ')
addGlobalStyle('.chat-container .system-chat-message .mention {color: black;} ')
addGlobalStyle('.chat-container .chat-message.is-bot {background: aliceblue;} ')
addGlobalStyle('.conversation-starter {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.conversation-starter__title {color: black;} ')
addGlobalStyle('.conversation-starter__subtitle {color: black;} ')
addGlobalStyle('.chat-container .chat-message .content-container .content .mention {color: black;} ')

//Donations.
addGlobalStyle('.modal-container.donate-tfuel .donate-title {color: black;} ')
addGlobalStyle('.modal-container .modal-content {color: black;} ')
addGlobalStyle('.gift-list .gift-label {color: black;} ')
addGlobalStyle('.modal-container .modal-content {background-color: white;} ')
addGlobalStyle('.modal-container.donate-tfuel .pay-label span {background-color: rgb(240, 243, 247); color: black;} ')
addGlobalStyle('.slvr-button--grey-3 {background: #00bfff;} ')
addGlobalStyle('textarea {background: rgb(240, 243, 247); color: black;} ')
addGlobalStyle('.donation-notifications {background-color: rgb(240, 243, 247);} ')
addGlobalStyle('.donation-notification .note {color: black;} ')
addGlobalStyle('.donation-notification .top-title .username {color: black;} ')
addGlobalStyle('.donation-notification .top-title .amount {color: black;} ')

//Dailys.
addGlobalStyle('.daily-reward-earned-prize__prize-name {color: black;} ')
addGlobalStyle('.daily-reward-header__title {color: black;} ')

//Testing items. Change as needed.
addGlobalStyle('.content.channel .chat-panel .chat-tab-content {color: white;} ')


//Poll stuff, Change?
// addGlobalStyle('.poll-card {background: rgb(240, 243, 247); color: black;} ')
// addGlobalStyle('a, a:active {color: black;} ')
// addGlobalStyle('.poll-card .poll-title {color: black;} ')


//your gonna have to scroll a while to edit this one, changes the color of login prompts
addGlobalStyle(' input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="url"], input[type="color"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"], textarea {background-color: silver;} ')
//things added for the mod portal/dashboard, set all to bottom if no custom colors wanted
addGlobalStyle(' header {background: #242b3b;} ')
addGlobalStyle(' .g-panel .panel-content {background: bottom;} ')
addGlobalStyle(' .g-header {background-color: silver;} ')
addGlobalStyle(' .g-sidemenu {background-color: silver;} ')