// ==UserScript==
// @name         Clraik: De-uglifier
// @version      0.1
// @description  Exactly what it says on the tin.
// @author       twitter.com/RotomDex
// @match        http://*.clraik.com/*
// @match        https://*.clraik.com/*
// @namespace    https://greasyfork.org/users/248719
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382054/Clraik%3A%20De-uglifier.user.js
// @updateURL https://update.greasyfork.org/scripts/382054/Clraik%3A%20De-uglifier.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)}

addGlobalStyle('html {background:#ddd !important}'
               +'body {max-width:1200px !important; margin: auto !important}');
addGlobalStyle('.threadbit .nonsticky, .threadbit .sticky, .attachments, .threadbit .alt, .threadbit .discussionrow, .forumhead, .toolsmenu, .threadlisthead, .navtabs, .navtabs li a.navtab, .newcontent_textcontrol,.above_body, .footer, .bbcode_container, div.bbcode_quote, .postbit .posthead, .postbitlegacy .posthead, .eventbit .eventhead, .threadbit .nonsticky, .threadbit .discussionrow, .pagination, .forumbit_nopost .forumbit_nopost .forumrow, .forumbit_post .forumrow, .threadbit, .forum_info .blockhead, .forum_info .blockbody, .navtabs li a.navtab, .blockhead'
               +'{background-image:none !important; -webkit-box-shadow:none !important; box-shadow:none !important}'
               +'.navtabs li a.navtab {border: none !important; color:#263746 !important}'
               +'.navtabs li a.navtab:hover {color:#445f72 !important}'
               +'.blockrow {border:1px solid #c4c4c4 !important}'
               +'.forumhead {font-family:Tahoma !important}'
               +'.forumbit_nopost .forumhead .forumtitle, .forumbit_nopost .forumhead span, .forumbit_nopost .forumhead .collapse, .forumbit_post .forumhead h2 span, #forums .L1 .forumhead a'
               +'{font-family:Tahoma !important; font-weight:bold !important; font-size:13px !important;}'
               +'.navtabs li.selected li a, .navbar_advanced_search li a, .toplinks, .navtabs li a.navtab {font-family:tahoma !important;}'
               +'.navtabs li.selected a.navtab{background:#84a8c0 !important}');