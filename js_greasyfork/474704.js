// ==UserScript==
// @name         ChubVenusThemer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A theme for ChubVenus, just replace the variables with the colors you want. It does not affect however the LeaderBoard and Subscription pages
// @author       A horny bastard
// @match        https://venus.chub.ai/*
// @grant          GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474704/ChubVenusThemer.user.js
// @updateURL https://update.greasyfork.org/scripts/474704/ChubVenusThemer.meta.js
// ==/UserScript==
/* Change Color */

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Replace these hexadecimal values with the colors you want
var hyperlinkColor = 'blue'; //color for clickable links
var backgroundColor = '#8abae9';
var textColor = '#FFFFFF';
var actionsTextColor = '#000000'; //textcolor for actions with **
var bannerColor = '#81a5e3'; //color of the banner in the top of the website
var topBannerBorder = '#3d72cc';
var chatBoxBackgroundColor = '#557cbd'; //also affects the login box
var warningBarColor1 = '#592785'; //"Banned from OpenAI? Get unmetered access to uncensored alternatives for as little as $5 a month."
var warningBarColor2 = '#692796'; //"Banned from OpenAI? Get unmetered access to uncensored alternatives for as little as $5 a month."²
var defaultButtonColor = '#3e2bcf';
var secondaryButtonColor = '#1876c9';
var borderButtonColor = '#FFFFFF';
var cardColor = '#c5c0ff'; //character card color
var cardRibbonColor = '#FFFFFF'; //the little ribbon with the icons and etc
var cardRibbonTextColor = '#1068eb';
var cardBorderColor = '#FFFFFF';
var cardTextColor = '#1068eb';
var cardActionsTextColor = '#FFFFFF';
var tagBorderColor = '#FFFFFF';
var tagsColor = '#c5c0ff';
var radioButtonUncheckedColor = '#FFFFFF';
var radioButtonCheckedColor = '#8abae9';
var categoryToolbarPrimaryBackgroundColor = '#c5c0ff'; //toolbar with all the possible categories of bots
var categoryToolbarSecondaryBackgroundColor = '#c5c0ff';
var selectedCategory = 'white';
var categoryToolbarBorderColor = '#FFFFFF';
var categoryTextColor = '#1068eb';
var dropdownMenuBackgroundColor = '#FFFFFF'; //dropdown menu with options
var dropdownMenuTextColor = '#1068eb';

//Down below is the CSS being altered and divided in categories

//GENERAL
addGlobalStyle('a {color: ' + hyperlinkColor + '!important}'); //hyperlinks color
addGlobalStyle('p { color: ' + textColor + ' !important'); //text color
addGlobalStyle('.venus-css-override .ant-layout { background: ' + backgroundColor + ' }'); //background color
addGlobalStyle(':where(.css-hz1je1).ant-input { background: ' + chatBoxBackgroundColor + ' }'); //textbox color
addGlobalStyle(':where(.css-hz1je1).ant-layout-header { color:' + textColor + '; background-color: '+ topBannerBorder +' }'); //top banner border
addGlobalStyle(':where(.css-hz1je1).ant-menu-dark, :where(.css-hz1je1).ant-menu-dark>.ant-menu { color: ' + textColor + '; background-color: '+ topBannerBorder +' }'); //banner color
addGlobalStyle(':where(.css-hz1je1).ant-layout-footer { ext-align: center; argin-top: 0px; adding-top: 4rem; background-color: ' + backgroundColor + ' !important ;padding-bottom: 8rem; }'); //footer
addGlobalStyle('.bg-indigo-900 { background-color: ' + warningBarColor1 + ' }'); //warning bar first layer
addGlobalStyle('.bg-indigo-800 { background-color: ' + warningBarColor2 + ' }'); //warning bar second layer

//MODALS
addGlobalStyle(':where(.css-hz1je1).ant-modal .ant-modal-content { background: ' + chatBoxBackgroundColor + ' !important; }'); //API modal
addGlobalStyle(':where(.css-hz1je1).ant-modal .ant-modal-header { background: ' + chatBoxBackgroundColor + ' !important; }'); //modal header

//TAGS
addGlobalStyle(':where(.css-hz1je1).ant-tag-error { color: ' + textColor + '; background-color: ' + tagsColor + '; border: 1px solid ' + tagBorderColor + ' }');//tags
addGlobalStyle(':where(.css-hz1je1).ant-tag { color: ' + textColor + '; background-color: ' + tagsColor + '; border:1px solid ' + tagBorderColor + ' }'); //tags
//TAGLIST MENU
addGlobalStyle('.ant-select-selector {background-color: ' + dropdownMenuBackgroundColor + ' !important; color: ' + dropdownMenuTextColor + ';}'); //tag list colors
addGlobalStyle(':where(.css-hz1je1).ant-select-dropdown {background-color: ' + dropdownMenuBackgroundColor + ' !important;}'); //tag menu dropdown background
addGlobalStyle(':where(.css-hz1je1).ant-select-dropdown .ant-select-item {color: ' + dropdownMenuTextColor + ' !important;}'); //tag menu dropdown text color
addGlobalStyle('.ant-radio-inner {background-color: white !important; border-color: ' + radioButtonUncheckedColor + ' !important}'); //radio input background unchecked
addGlobalStyle(':where(.css-hz1je1).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {background-color: ' + dropdownMenuBackgroundColor + ' !important; border-color: ' + radioButtonCheckedColor + ' !important}'); //radio input background checked
addGlobalStyle(':where(.css-hz1je1).ant-select .ant-select-selection-placeholder {color: ' + dropdownMenuTextColor + '}');
//LOGIN
addGlobalStyle(':where(.css-hz1je1).ant-input-affix-wrapper { background-color: '+ chatBoxBackgroundColor +';}');

//CHAT
addGlobalStyle('em { color: '+ actionsTextColor +' !important'); //textcolor for actions with **
addGlobalStyle(':where(.css-hz1je1).ant-collapse .ant-collapse-content { color: ' + textColor + '; background-color: ' + backgroundColor + ' }'); //textbox color');
addGlobalStyle(':where(.css-hz1je1).ant-btn-default { color: ' + textColor + '; background-color: '+ defaultButtonColor +'; border-color: '+ borderButtonColor +' }'); //default button color');
addGlobalStyle(':where(.css-hz1je1).ant-btn-primary { color: ' + textColor + '; background-color: '+ secondaryButtonColor +';  border-color: '+ borderButtonColor +' }'); //primary button color');
addGlobalStyle(':where(.css-hz1je1).ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) { color: ' + textColor + '; background-color: '+ defaultButtonColor +' }'); //like button
addGlobalStyle(':where(.css-hz1je1).ant-radio-button-wrapper { color: ' + textColor + '; background-color: '+ secondaryButtonColor +' }'); //textbox color'); //dislike button

//CARDS
addGlobalStyle(':where(.css-hz1je1).ant-card {background-color: ' + cardColor + ' !important ; border-color: ' + cardBorderColor + ' !important;}'); //cards
addGlobalStyle('.mb-2 { color: ' + cardTextColor + ' }'); //card description text color
addGlobalStyle('.ant-card-head { color: ' + cardTextColor + ' !important}'); //card head
addGlobalStyle('.ant-card-meta-description { color: ' + cardTextColor + ' !important}'); //card body
addGlobalStyle('.ant-radio-button-wrapper {border-color: ' + cardBorderColor + ' !important}'); //card border color
addGlobalStyle(':where(.css-hz1je1).ant-card .ant-card-actions {color: '+ cardActionsTextColor +'; background-color: ' + cardColor + '; border-color: ' + cardBorderColor + '}'); //card actions
addGlobalStyle('.fake-ribbon {background-color: ' + cardRibbonColor + '}'); //ribbon
addGlobalStyle(':where(.css-hz1je1).ant-card {color: ' + cardRibbonTextColor + '}'); //ribbon text color
addGlobalStyle(':where(.css-hz1je1).ant-ribbon {background-color: ' + cardRibbonColor + ' !important}'); //character screen ribbon color
addGlobalStyle('.ant-ribbon-text {color: ' + cardRibbonTextColor + '! important}');//character screen text ribbon color
//CATEGORY TOOLBAR
addGlobalStyle(':where(.css-hz1je1).ant-segmented {background-color: ' + categoryToolbarPrimaryBackgroundColor + ' !important ; border-color: ' + categoryToolbarBorderColor + ' !important;}');
addGlobalStyle(':where(.css-hz1je1).ant-segmented .ant-segmented-item-selected {background-color: ' + selectedCategory + ' !important ; border-color: ' + categoryToolbarBorderColor + ' !important; color: ' + categoryTextColor + '}'); //Selected Category
addGlobalStyle(':where(.css-hz1je1).ant-pagination .ant-pagination-item-active {background-color: ' + categoryToolbarSecondaryBackgroundColor + ' !important ; border-color: ' + categoryToolbarBorderColor + ' !important; color:  ' + categoryTextColor + '}'); //Page display
addGlobalStyle(':where(.css-hz1je1).ant-pagination .ant-pagination-options-quick-jumper input {background-color: ' + categoryToolbarSecondaryBackgroundColor + ' !important ; border-color: ' + categoryToolbarBorderColor + ' !important; color: ' + categoryTextColor + '}'); //page jumper

//DROPDOWN MENU
addGlobalStyle(':where(.css-hz1je1).ant-dropdown .ant-dropdown-menu, :where(.css-hz1je1).ant-dropdown-menu-submenu .ant-dropdown-menu {background-color: ' + dropdownMenuBackgroundColor + ' !important; color: ' + dropdownMenuTextColor + ';'); //Notifications
addGlobalStyle('.ant-dropdown-menu {background-color: ' + dropdownMenuBackgroundColor + ';}'); //Dropdown Menu Background Color
addGlobalStyle('.ant-dropdown-menu-item {color: ' + dropdownMenuTextColor + ' !important;}'); //Dropdown Menu Background Color

//CHAT TREE
addGlobalStyle(':where(.css-hz1je1).ant-drawer .ant-drawer-content { background: ' + backgroundColor + ' }');
addGlobalStyle('.message-details { color: ' + textColor + '; background-color: '+ cardColor +' }');

//SHARE NOTICE
addGlobalStyle(':where(.css-hz1je1).ant-message .ant-message-notice .ant-message-notice-content { background: ' + backgroundColor + ' }');








