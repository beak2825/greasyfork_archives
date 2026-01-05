// ==UserScript==
// @name         NodeCraft Dark Mode
// @namespace    http://p455w0rd.net/
// @version      1.2
// @description  Give NodeCraft CP a nice dark theme
// @author       @TheRealp455w0rd
// @match        https://nodecraft.com/services*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/23235/NodeCraft%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/23235/NodeCraft%20Dark%20Mode.meta.js
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

addGlobalStyle('header #logo { background:url(http://nodecraft.com/assets/images/logo/solid-white-transparent.png) no-repeat center/100%; width:318px!important; height:86px!important; }');
addGlobalStyle('div.content { background:#000!important;color:#fff!important }');
addGlobalStyle('#npHeader .npStatusButton span { background:transparent!important }');
addGlobalStyle('#npHeader .npStatusButton.start span, div#players ul li, .bukget .bukgetPlugins li .text strong { color:#000!important }');
addGlobalStyle('#npHeader .npStatusButton span:hover, div.contentHeader, #nodePanel #npSidebar nav ul li a, #nodePanel #npSidebar nav>ul>li>a .icon:before, .bukget .bukgetContent .bukgetNavbar>ul>li>a, .bukget .bukgetContent .bukgetNavbar>ul>li>a .icon:before { color:#fff!important }');
addGlobalStyle('#nodePanel #npSidebar nav>ul>li.active>a:hover, #nodePanel #npSidebar nav>ul>li>a:nth-child(1):hover { color:#ccdae8!important; }');
addGlobalStyle('.bukget .bukgetPlugins li { background:#888!important; }');
addGlobalStyle('ul.contentItems, ul.contentItems li, ul.dayPicker { color:#000!important;background:#232323!important }');
addGlobalStyle('div.input input, div.field label, select.ng-pristine option, select.ng-pristine, div.contentBody, .bukgetTitle { color:#fff!important;background:#232323!important }');
addGlobalStyle('div#maintenence, div#npHeader, div.npStatusButton, div#npSidebar nav ul li a, div.contentHeader, div#npContent div div.padding, div.infoSection table tbody tr td, div#nodePanel, .owl-theme .owl-controls, div.owl-prev, div.owl-next, #recommendedLists, .bukget .pluginPage .pluginMain, .bukget .pluginPage .pluginSidebar, .pagination { background:#232323!important }');
addGlobalStyle('div#npStatus div.start, div#npStatus div.stop { height:74px!important; }');
addGlobalStyle('.bukget .bukgetPlugins li .text p { color:#232323!important; }');
addGlobalStyle('.bukget .install { background:#232323!important; }');
addGlobalStyle('.bukget .install:hover { background:#229113!important;color:#000!important; }');
addGlobalStyle('div#SSDGaguePerc.span { background:#0ea7e7!important; }');
addGlobalStyle('div#npStatusBar { overflow:hidden!important; }');
addGlobalStyle('.bukget .bukgetPlugins li.noPlugins { width:825px!important;overflow:hidden!important;color:#232323!important; }');
addGlobalStyle('div#npInfoBoxes .box, div.diskGaugeBar, #nodePanel #fileManager>ul li:hover { background:#5a5b5d!important; }');
addGlobalStyle('header { background:rgba(0,0,0,1) url(../images/headerbg.png) 0 -10px!important; }');
addGlobalStyle('div#npInfoBoxes div.box h4, div#npInfoBoxes div.box p strong, div#npInfoBoxes div.box p span { color:#fff!important }');
addGlobalStyle('div#npInfoBoxes div.box p strong, .bukget .bukgetPlugins li .text strong { font-weight:bold!important }');

// Uncomment following line to hide Bukkit Plugins link
//addGlobalStyle('#nodePanel #npSidebar nav>ul>li.subNav>ul>li:nth-child(2) { display:none; }');