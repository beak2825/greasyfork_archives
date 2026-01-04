// ==UserScript==
// @name         DeviantArt Night Mode
// @version      0.4
// @description  A Night mode for DeviantArt
// @icon         https://maxcdn.icons8.com/Share/icon/Logos/deviantart1600.png
// @match        https://www.deviantart.com/*
// @author       Gekido
// @grant        none
// @namespace https://greasyfork.org/users/218397
// @downloadURL https://update.greasyfork.org/scripts/373066/DeviantArt%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/373066/DeviantArt%20Night%20Mode.meta.js
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

addGlobalStyle('body, #output, #navbar-menu .navbar-menu-inner, body.deviantart #overhead, #oh-menu-deviant, #oh-menu-split, #oh-menu-friends, #oh-menu-collect, #oh-menu-cart, #oh-menu-join, #oh-loginbutton, #overhead .oh-mc-split, #oh-menu-greeting, div.pager-messages, div.page2, div.messages .messages-left, div.pager-messages div.page2 div.header, .f { background-color : #06070d !important; }');

addGlobalStyle('#navbar-menu, body.deviantart #overhead, #oh-menu-deviant, #oh-menu-split, #oh-menu-friends, #oh-menu-collect, #oh-menu-cart, #oh-menu-join, #oh-loginbutton, #overhead .oh-mc-split, #oh-menu-greeting, .bubbleview .catbar { border-bottom: 1px solid #000  !important; }');

addGlobalStyle('#oh-menu-deviant { border-left: 1px solid #000  !important; }');

addGlobalStyle('.dev-page-container.bubbleview, body.fullview .dev-page-container.bubbleview, body.gruze .dev-page-container.bubbleview, body.deviant .dev-page-container.bubbleview, .dev-page-view .dev-right-col-bg { background-color : #06070d !important; }');

addGlobalStyle('.browse-container.newbrowse .browse-left-bar .browse-left-bar-inner, .browse-container.newbrowse .browse-left-bar, .dev-page-view.view-mode-full .dev-view-deviation, .dev-page-view.view-mode-full_zoomed .dev-view-deviation, div.mczone, h2.mczone-title, f messages-left{ background-color : #06070d !important; }');

addGlobalStyle('.browse-container.newbrowse .browse-left-bar, div.messages td.messages-left {border-right: 1px solid #000  !important; }');

addGlobalStyle('body.gruze .bubbleview h2{color: #fff !important; }');

addGlobalStyle('h2.mczone-title {border-bottom: none !important;}');

addGlobalStyle('div.mczone, .bubbleview .catbar {border-top: none !important;}');

addGlobalStyle('div.pager-messages div.page2 a.f, .catbar, body.gruze .catbar {background: none !important;}');

addGlobalStyle('div.pager-messages div.page2 div.header  {border-top: 1px solid #000  !important; border-bottom: 1px solid #000 !important; }');

addGlobalStyle('ul.iconset-gruser li.tab { background-color : #e2e8e1 !important; }');

addGlobalStyle('.catbar, #deviant, .blues-bar-ctrl, .gr-top .gr, .gr-body, .feed-action, .feed-action.feed-action-type-deviations .feed-action-content, .feed-action.feed-action-type-deviations .feed-action-deviation-details, .journal-green .gr-box, .feed-action.feed-action-type-gallection_summaries .feed-action-content .gallection-container, .feed-action .feed-action-comments, .feed-action .feed-action-content, .ccomment .ch-ctrl .ch-ctrl, .gr-midbody { background-color : #06070d !important; }');

addGlobalStyle('.blues-bar, .gr-body .gr, #deviantART-v7 footer#depths .depths-inner {border-top: 1px solid #000  !important; }');

addGlobalStyle('.blues-bar {padding-bottom: 0px !important; }');

addGlobalStyle('.blues-bar .blues-bar-ctrl {border-bottom: 1px solid #000 !important; }');

addGlobalStyle('body .blues-bar span.bb a.gmbutton2, .feed-action.feed-action-type-deviations .feed-action-deviation-details .title, body.gruze .bubbleview, body.gruze a {color: #a5a5a5 !important}');

addGlobalStyle('.gr-body, .gr-free .gr-top .gr, .gr-top {border-color: #000 !important}');

addGlobalStyle('i.gr2, i.gr3, .gr-body, .gr-top, i.gr1 + i.gr2, i.gr2 i, i.gr3 i, .gr-top .gr, i.gr1 {background: #06070d !important}');

addGlobalStyle('i.gr3 i, .gr-top .gr, i.gr2, i.gr3, .gr-body, .gr-top, .journal-green .gr-box, .catbar, #deviant, .blues-bar-ctrl, .gr-top .gr, .gr-body, .feed-action, .feed-action.feed-action-type-deviations .feed-action-content, .feed-action.feed-action-type-deviations .feed-action-deviation-details, .journal-green .gr-box, ul.iconset-gruser li.active, ul.iconset-gruser li.active:hover {border-color: #000 !important}');

addGlobalStyle('.feed-action {box-shadow: none !important}');

addGlobalStyle('.gr-midbody {border: none !important}');

addGlobalStyle('body.gruze .bubbleview, ul.iconset-gruser li.tab, i.gr3 i, .gr-top .gr, #aboutme-interests, #deviantART-v7 footer#depths .depths-inner { background: #06070d !important; }');

addGlobalStyle('ul.iconset-gruser li.active, ul.iconset-gruser li.active:hover, .browse-sidebar-opener .button, #browse-sidemenu .browse-facet.browse-facet-state .button.state-open { box-shadow: none !important; }');

addGlobalStyle('ul.iconset-gruser li.active, ul.iconset-gruser li.active:hover, .browse-sidebar-opener .button, #browse-sidemenu .browse-facet.browse-facet-state .button.state-open { background: #515151 !important; }');

addGlobalStyle('i.gr1 + i.gr2, i.gr2 i, i.gr1 { background: #000 !important; }');

addGlobalStyle('.aboutme-interests-values span.aboutme-interests-label {color: #000 !important}');

addGlobalStyle('.ccomment .ch-ctrl .ch-ctrl, .browse-sidebar-opener .button, #browse-sidemenu .browse-facet.browse-facet-state .button.state-open {border: 1px solid #000  !important; }');

addGlobalStyle('.browse-sidebar-opener .button span, #browse-sidemenu .browse-facet.browse-facet-state .button span {background: url("//st.deviantart.net/emoticons/h/halfliquid.gif") no-repeat 0px -1px !important; }');

addGlobalStyle('.torpedo-container .thumb {margin: 5px !important}');

addGlobalStyle('body, .dev-page-view .dev-right-bar-title {color: #b1b1b1 !important}');