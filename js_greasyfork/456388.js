// ==UserScript==
// @name          Wikipedia Dark NoudioMod
// @namespace     greasyfork
// @description	  A dark version of Wikipedia.org
// @author        Noudio
// @license       MIT
// @homepage      https://greasyfork.org/en/users/995447-noudio
// @include       http://wikipedia.org/*
// @include       https://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @include       http://wikimedia.org/*
// @include       https://wikimedia.org/*
// @include       http://*.wikimedia.org/*
// @include       https://*.wikimedia.org/*

// @run-at        document-idle
// @version       4.12
// @downloadURL https://update.greasyfork.org/scripts/456388/Wikipedia%20Dark%20NoudioMod.user.js
// @updateURL https://update.greasyfork.org/scripts/456388/Wikipedia%20Dark%20NoudioMod.meta.js
// ==/UserScript==
(function() {

    function isDomain(x) {
        return document.domain.substring(document.domain.indexOf(x)) == x;
    }
    var isPedia = isDomain("wikipedia.org");
    var isMedia = isDomain("wikimedia.org");
    if (!isPedia && !isMedia)
        return;

    //console.log('hi!');

    var css = "";
    css+= `

    body {
        background-color: #191919!important;
        background-image: url()!important;
        background-attachment: fixed!important;
        background-repeat: repeat-x!important;
    }

    a {
        color: #32a9da!important;
    }

    a:hover {
        color: #6ad3ff!important;
    }

    #p-logo a {
    filter: invert(85%);
    }

    h1, h2, h3, h4, h5, h6 {
        color: rgba(220, 220, 220, 1)!important;
    }

    #mw-head-base,
    #mw-page-base,
    #mw-head,
    #mw-panel {
    background-color: rgba(20, 20, 20, 0)!important;
    background-image: none!important;
    }

    #content.mw-body {
       background-color: rgba(100, 100, 100, 0.2)!important;
       border-color: rgba(220, 220, 220, 0.2)!important;
    }

    * {
        border-color: rgba(220, 220, 220, 0.2)!important;
    }

    p,
 dd,
 .sisterproject {
     color: rgba(220, 220, 220, 0.8)!important;
     background: rgba(30,30,30,0.8) !important;
 }

 .hauptartikel-pfeil,
 i,
 strong {
     color: #fff!important;
 }

 .settings-menu-items .menu-section:hover {
     background-color: rgba(220, 220, 220, 0.05)!important;
     color: rgba(220, 220, 220, 0.8)!important;
 }

 .settings-menu-items .menu-section {
     color: rgba(220, 220, 220, 0.6)!important;
 }

 .uls-input-settings .uls-input-settings-inputmethods-list {
     background-color: rgba(220, 220, 220, 0.1)!important;
 }

 li,
 td,
 tr,
 th,
 td > h2,
 td > div > h2,
 dt {
     color: rgba(220, 220, 220, 0.6)!important;
     background-color: rgba(220, 220, 220, 0.01)!important;
 }
 ul {

     list-style-image: none!important;
 }

 dt {
     color: rgba(220, 220, 220, 0.8)!important;
     background-color: rgba(220, 220, 220, 0.01)!important;
     text-shadow: 0px 2px 0px #111!important;
 }

 .rellink {
     color: #daef8f!important;
     background-color: rgba(220, 220, 220, 0.01)!important;
 }

 code,
 .mw-geshi,
 pre,
 .catlinks,
 .NavContent > p {
     color: rgba(220, 220, 220, 0.6)!important;
     background-color: rgba(100, 200, 255, 0.1)!important;
 }


 #hauptseite .inhalt,
 .infobox {
     background-color: rgba(220, 220, 220, 0.1)!important;
 }

 .toptextcells > tbody tr td div {
     background-color: transparent!important;
 }

 .infobox > div,
 div.flaggedrevs_short {
     background-color: #444!important;
     color: #eee!important;
 }

 #mw-fr-revisiondetails {
 background-color: rgba(20, 20, 20, 0.9)!important;
 }

 #mw-panel.collapsible-nav .portal{
 background-image: url()!important;
 }

 [id^=\"wpTextbox\"] {
     background-color: rgba(20, 20, 20, 1.0)!important;
     color: #ddd!important;
 }

 div.thumbinner,
 div.thumbinner > a > img,
 #toc,
 .toccolours,
 #catlinks,
 div[id^=\"mw-Anonymous\"],
 #filetoc {
 background-color: rgba(20, 20, 20, 0.3)!important;
 border-color: rgba(220, 220, 220, 0.1)!important;
 }

 #ChangeToU2014_v1_anononly {
 border-color: rgba(220, 220, 220, 0.1)!important;
 background: rgba(20, 20, 20, 0.3)!important;
 }

 #ChangeToU2014_v1_anononly *,
 div[id^=\"mw-Anonymous\"],
 #stockphoto_base > span > span:last-of-type {
 color: #aaa!important;
 }

 div.vectorMenu h3 a {
     background: none!important;
 }

 div.thumbinner > .thumbcaption,
 #siteSub {
 color: rgba(220, 220, 220, 0.5)!important;
 }

 .hintergrundfarbe5,
 table {
     background-color: rgba(30, 30, 30, 0.85)!important;
 }

 div#simpleSearch {
     background-color: rgba(220, 220, 220, 0.05)!important;
     background-image: none!important;
 }


 .imeselector-menu,
 div.vectorMenu ul,
 .vector-menu .vector-menu-tabs ,
 #language-settings-dialog,
 .grid.uls-menu.uls-wide.callout {
     background: rgba(20, 20, 20, 0.95)!important;
     background-color: rgba(20, 20, 20, 0.95)!important;
 }

 #languagesettings-panels
 .menu-section.active,
 .menu-section.active:hover,
 .uls-language-settings-close-block {
     background-color: rgba(220, 220, 220, 0.15)!important;
     color: #eee!important;
 }

 .uls-menu .search,
 .uls-menu .search > .ten.columns > #search-input-block > #languagefilter,
 .uls-menu .search > .ten.columns > #search-input-block > #filtersuggestion,
 #uls-no-found-more {
 background: rgba(220, 220, 220, 0.05)!important;
 color: #eee!important;
 }

 .settings-text {
     color: #777!important;
 }

 #languagesettings-settings-panel {
 background-color: rgba(220, 220, 220, 0.05)!important;
 }

 .imeselector a, .ime-disable {
     color: rgba(220, 220, 220, 0.5)!important;
 }

 div.vectorTabs,
 div.vectorTabs ul,
 div.vectorTabs ul li,
 div.vectorTabs ul li span {
     background-image: none!important;
     background-color: transparent!important;
     border: none!important;
 }

 div.vectorTabs ul li {
     box-shadow: inset 0px -30px 25px -35px rgba(160, 160, 160, 0.5)!important;
     margin-left: -1px!important;
     transition: 0.4s!important;
 }

 div.vectorTabs ul li:hover {
     box-shadow: inset 0px -25px 25px -35px rgba(255, 255, 255, 1)!important;
     margin-left: -1px!important;
     transition: 0.4s!important;
 }

 .wikitable.float-right > tbody > tr > th a {
     color: #999!important;
     text-decoration: underline!important;
 }

 .wikitable.float-right > tbody > tr > th a:hover {
     color: #eee!important;
     text-decoration: underline!important;
 }

 div.NavHead,
 table.wikitable > tr > th,
 table.wikitable > * > tr > th,
 table.wikitable > * > tr:last-of-type > td,
 #mw-content-text > p > span {
 background: rgba(255, 255, 255, 0.1)!important;
 }

 .body > select {
     background-color: #222!important;
     padding-top: 1px!Important;
     height: 22px!Important;
     color: #aaa!important;
     width: 130px!Important;
     border: none!important;
     box-shadow: inset 0px 15px 10px -10px #303030, inset 0px 1px 1px  #777!important;
     margin: 5px 0px 5px 0px!important;
     border-radius: 20px!important;
     transition: 0.4s!important;
 }

 input[type=\"button\"] {
     background-color: #222!important;
     height: 23px!Important;
     color: #aaa!important;
     width: 130px!Important;
     border: none!important;
     box-shadow: inset 0px 15px 10px -10px #303030, inset 0px 1px 1px  #777!important;
     margin: 5px 0px 5px 0px!important;
     border-radius: 20px!important;
     transition: 0.4s!important;
 }

 input[type=\"button\"]:hover {
     background-color: #303030!important;
     height: 23px!Important;
     color: #aaa!important;
     width: 130px!Important;
     border: none!important;
     box-shadow: inset 0px 15px 10px -10px #404040, inset 0px 1px 1px  #888!important;
     margin: 5px 0px 5px 0px!important;
     border-radius: 20px!important;
     transition: 0.4s!important;
 }

 .tex {
     background-color: #eee!important;
     padding: 10px!important;
     border-radius: 5px!important;
 }

 .bookshelf-container .bookend {
     background-image: url()!important;
 }

 .search-container.language-search > form > label {
     color: #eee!important;
 }

 .divider {
     opacity: 0.4!important;
 }

 fieldset {
     background-color: rgba(200, 200, 200, 0.2)!important;
 }

 .central-featured-lang > .link-box > em {
     color: #888!important;
 }

 .central-featured-lang > .link-box > small {
     color: #666!important;
 }

 h1.central-textlogo > img {
     visibility: hidden!important;
 }

 h1.central-textlogo {
     background-image: url()!important;
     background-repeat: no-repeat!important;
     background-position: center!important;
 }

 #wpTextbox1 {", /* saját */
 background-color: black;
 }
 .mw-highlight {", /* saját */
     background-color: #000 !important;
 }

 /* remove strange gradient background */
 .vector-menu-tabs,
 .vector-menu-tabs a,
 .vector-menu-tabs-legacy li,
 .vector-menu-tabs-legacy li.selected {
     background: inherit !important;
 }

 /* Noudio changes on top... */
 .vector-menu-tabs-legacy li a {
     background: rgba(30,30,30,1.0) !important; /* override load.php sheet */
     border: 1px solid rgba(220, 220, 220, 0.2) !important;
     border-bottom-width: 0px !important;
     border-top-left-radius: 10px !important;
     border-top-right-radius: 10px !important;
     /* visibility: hidden; */
 }
 .vector-menu-tabs-legacy li.selected a {
     background: rgba(29, 66, 104,1.0) !important; /* override load.php sheet */
     border: 1px solid rgba(220, 220, 220, 0.2) !important;
     border-bottom-width: 0px !important;
     border-top-left-radius: 10px !important;
     border-top-right-radius: 10px !important;
 }

 .mw-parser-output .navbox, .mw-parser-output .navbox-subgroup {
     background: rgba(30,30,30,0.8) !important;
 }


 #content.mw-body {
     background: rgba(20,20,20,0.8);
 }

 .vector-search-box-input  {
     background: rgba(87, 153, 185, 1.0) !important;
 }

  #searchInput,
  .mw-ui-input {
     color: rgba(220, 220, 220, 1.0) !important;
     background: rgba(87, 153, 185, 1.0) !important;
     background: rgba(35,  78, 123, 1.0) !important;
 }

 /* MainPageBG. */
 div#mp-left.mp-box,
 div#mp-right.mp-box,
 div#mp-topbanner.mp-box,
 div#mp-middle.mp-box,
 div#mp-lower.mp-box {
     background: rgba(30,30,30,0.8);
 }

 h2#mp-tfa-h2.mp-h2 span.mw-headline,
 .mw-headline {
     background: rgba(50,50,50,0.6);
 }

 /* pastel kleuren */

 .mw-parser-output #mp-left.mp-box h2.mp-h2 {
     background: rgba(10,15,30,0.3);
 }
 .mw-parser-output #mp-right.mp-box h2.mp-h2 {
     background: rgba(10,30,15,0.3);
 }
 .mw-parser-output #mp-right.mp-box h2.mp-h2 {
     background: rgba(30,15,10,0.3);
 }
 .mw-parser-output #mp-middle.mp-box h2.mp-h2 {
     background: rgba(15,30,10,0.3);
 }
 .mw-parser-output #mp-lower.mp-box h2.mp-h2 {
     background: rgba(15,30,10,0.3);
 }
 .mw-parser-output #mp-bottom.mp-box h2.mp-h2 {
     background: rgba(30,10,15,0.3);
 }
 .mw-parser-output #mp-sister.mp-box h2.mp-h2 {
     background: rgba(15,10,30,0.3);
 }

 .mw-body {
     color: rgba(220, 220, 220, 0.6) !important;
     background: rgba(30,30,30,0.8) !important;
 }

 /* content page */
 .mw-parser-output div.contentsPage.contentsPage--topic,
 .mw-parser-output div.contentsPage.contentsPage--topic div.contentsPage__title,
 .mw-parser-output div.contents-pages-footer {
     background: rgba(30,30,30,0.8);
 }
 .contentsPage__section .mw-headline {
     color: rgba(111, 161, 210, 0.85);
     background: rgba(30,30,30,0.8);
 }

 div.module-shortcutboxplain.plainlist.noprint {
     background: rgba(50,50,50,0.9);
 }

 /* current events */

 /* text bg's */
 div.p-current-events div.p-current-events-news-browser,
 div.p-current-events div.p-current-events-headlines,
 div.p-current-events * div.current-events div.current-events-main.vevent,
 div.p-current-events * div.current-events-sidebar.mw-made-collapsible,
 div.p-current-events * div.current-events-main.noprint,
 div.p-current-events * table.current-events-calendar caption {
     background: rgba(30,30,30,0.8);
 }

 div.p-current-events * div.p-current-events-calside div.noprint {
     background: rgba(30,30,30,0.8) !important; /* override hardcoded style */
 }

 div.p-current-events * div.current-events * span.summary,
 div.p-current-events * div.p-current-events-calendar div {
     color: #6ad3ff !important;
 }

 /* header bg's */
 div.p-current-events div.p-current-events-headlines h2,
 div.p-current-events * div.current-events-title,
 div.p-current-events * div.current-events-heading.plainlinks {
     background: rgba(15,10,30,0.3);
 }
 /* right side */
 div.mw-parser-output * div.p-current-events-calendar,
 div.mw-parser-output * div.p-current-events-calendar > div,
 div.p-current-events * div.mw-made-collapsible div h2,
 div.p-current-events * div.mw-made-collapsible span {
     background: rgba(15,30,10,0.3);
 }
 .mw-parser-output .current-events-sidebar>div:not(.mw-collapsible-content) {
     background: rgba(15,30,10,0.3) !important /* override default settings */
 }

 /* about page */
 div.introto__main * div.introto__tabs-main {
     background: rgba(30,30,30,0.8) !important; /* override hardcoded style */
 }

 /* popups */

 .mw-ui-icon-settings:before {
     filter: invert(85%);
 }

 .mwe-popups .mwe-popups-container {
     border: 3px solid rgba(120,100,120,1.0);
 }

 .mwe-popups .mwe-popups-container,
 .mwe-popups .mwe-popups-container p,
 .mwe-popups .mwe-popups-container img {
     background: rgba(50,50,50,1.0) !important;
     color: rgba(80,150,140,1.0); !important;
     /* visibility: hidden; */
 }

 .mwe-popups .mwe-popups-extract[dir='ltr']:after{
     right:0;
     background-image:linear-gradient(to right,rgba(50,50,50,0.0), rgba(50,50,50,1.0))
 }
 .mwe-popups .mwe-popups-extract[dir='rtl']:after{
     left:0;
     background-image:linear-gradient(to left,rgba(50,50,50,0.0), rgba(50,50,50,1.0))
 }
 .mwe-popups .mwe-popups-extract blockquote:after{
     width:100%;
     height:25px;
     bottom:0;
     background-image:linear-gradient(to bottom,rgba(50,50,50,0.0), rgba(50,50,50,1.0))
 }

 /* ui user interface elements */
 .mw-ui-vform-field label {
     color: rgba(120,100,120,1.0); !important;
 }

 .mw-ui-button {
     background: rgba(120,120,120,1.0) !important;
 }

 .mw-ui-button:not(:disabled):hover {
     background: rgba(10,10,10,1.0) !important;
 }

 .mw-parser-output .side-box-text {
     background: rgba(30,30,30,0.8);
 }

 .mw-parser-output .side-box-flex {
     background: rgba(10,10,10,0.8);
 }

 .infobox .infobox-header,
 .infobox .infobox-subheader,
 .infobox .infobox-subheader div,
 .infobox .infobox-image,
 .infobox .infobox-full-data,
 .infobox .infobox-below
 .mw-parser-output div.quotebox.pullquote.floatright,
 .mw-parser-output .quotebox {
     /* background: rgba(30,30,30,0.8) !important; */
     background: rgba(20,20,20,0.2) !important;
     color: rgba(220, 220, 220, 0.6) !important;
 }
 div.mw-parser-output table.infobox caption.infobox-title {
     color: rgba(220, 220, 220, 0.6) !important;
 }

 .mw-parser-output .sidebar-list-title,
 .mw-parser-output div.floatright.noresize {
     background: rgba(30,30,30,0.8) !important;
 }
 .mw-parser-output .portal-bar-bordered {
     /* background: inherit !important; */
     background: rgba(30,30,30,0.8) !important;
 }

 /* image viewer */
 .mw-mmv-post-image {
     background: rgba(40,40,40,1.0) !important;
 }
 .mw-mmv-image-metadata {
     background: rgba(20,20,20,0.2) !important;
     border-color: rgba(20,20,20,0.2) !important;
 }

 .mw-parser-output {
     background: rgba(40,40,40,1.0) !important;
 }

 /* talk page */
 div.plainlinks,
 .mw-parser-output .sidebar,
 .mw-parser-output .centralized-discussion-title,
 .mw-parser-output .centralized-discussion-vps,
 /* body.ns-talk  .mw-parser-output .mp-toolbox-daily, */
 .mw-parser-output .mp-toolbox,
 .mw-parser-output .talkheader-help,
 .mw-parser-output .host-left-box {
     background: rgba(20,20,20,0.2) !important;
 }




 /* title page and various pics */

 img[alt="The Signpost"],
 .central-textlogo__image,
 .central-featured-logo {
    filter: invert(85%);
 }

 .central-featured-lang :hover {
     background: rgba(40,40,40,1.0) !important;
     color: #6ad3ff !important;
 }
 .pure-form input[type="search"] {
     background: rgba(20,20,20,0.8) !important;
     border-color: rgba(50,50,50,0.8) !important;
     color: rgba(220, 220, 220, 0.8) !important;
 }
 .search-container fieldset {
     background: rgba(50,50,50,0.8) !important;
 }
 div.styled-select.js-enabled,
 .search-container .js-langpicker-label {
     color: rgba(220, 220, 220, 1.0) !important;
 }
 div.styled-select.js-enabled:hover,
 .search-container .js-langpicker-label:hover {
     background: rgba(20,20,20,0.8) !important;
     color: rgba(220, 220, 220, 0.8) !important;
 }
 .search-container .sprite.svg-arrow-down {
     filter: brightness(400%);
 }

 select#searchLanguage {
     background: rgba(20,20,20,0.8) !important;
     border-color: rgba(50,50,50,0.8) !important;
     color: rgba(220, 220, 220, 0.8) !important;
 }
 .lang-list-button {
     /* color: rgba(87, 153, 185, 1.0) !important; */
     color: #6ad3ff !important;
     background: rgba(50,50,50,1.0) !important;
     border-color: rgba(50,50,50,1.0) !important;
     outline: 1.6rem solid rgba(50,50,50,1.0) !important;
 }
 .lang-list-button:hover {
     background: rgba(70,70,70,1.0) !important;
     border-color: rgba(70,70,70,1.0) !important;
     outline: 1.6rem solid rgba(70,70,70,1.0) !important;
 }
 .lang-list-border {
     visibility: hidden !important;
 }
 .lang-list-container {
     background: rgba(50,50,50,1.0) !important;
 }

 /* added for new 2023 wikipedia layout */

 .mw-logo {
    filter: invert(85%);
 }

 #footer-icons {
    filter: invert(85%);
 }

 .mw-page-container
 {
     background: #191919 !important;
 }

 .vector-toc,
 #vector-main-menu
 {
     background: rgba(30,30,30,0.8) !important;
 }
 .vector-dropdown > .vector-menu-content
 {
     background: rgba(25,25,25,1.0);
 }


 /* .vector-toc::after */
 .vector-toc-pinned #vector-toc-pinned-container .vector-toc::after,
 .vector-feature-zebra-design-disabled #vector-toc-pinned-container .vector-toc::after
 {
	   background: linear-gradient(rgba(20,20,20,0.0),rgba(20,20,20,1.0)) !important;
 }

 .mw-parser-output div.hp,
 .mw-parser-output div.hp-header,
 .mw-parser-output div.hp-footer,
 .mw-parser-output div.hp-portalen,
 .mw-parser-output .hauptseite-box-content,
 .mw-parser-output .hauptseite-box-title
 {
     background: rgba(30,30,30,1.0) !important;
 }


 .mw-parser-output .sister-bar,
 .mw-parser-output .portalborder,
 .mw-parser-output .module-shortcutboxplain {
     background: rgba(70,70,70,1.0) !important;
 }

/* New Header... 230423 */

 div.vector-header-container,
 .mw-parser-output .main-box,
 .mw-parser-output .main-top,
 .mw-parser-output #frame-main2,
 .mw-parser-output #frame-interlang,
 .mw-parser-output .main-page-body > div:last-of-type,
 .mw-parser-output #mp-2012-column-right-block-a {
    background-color: rgba(20,20,20,0.0) !important;
 }

 .mw-parser-output #mp-2012-banner,
 .mw-parser-output #mp-2012-column-right-block-b  {
    background: rgba(20,20,20,0.0) !important;
 }

 .mw-parser-output .main-header {
   background-color: rgba(20,20,20,0.0) !important;
 }

 .mwe-math-fallback-image-display,
 .mwe-math-mathml-display,
 .mwe-math-fallback-image-inline
 {
    filter: invert(80%);
 }

 .mwe-math-fallback-image-inline.mw-invert {
  filter: invert(80%);
 }

 .vector-icon.mw-ui-icon-ellipsis.mw-ui-icon-wikimedia-ellipsis {
  filter: invert(80%);
 }

 .vector-icon.mw-ui-icon-menu.mw-ui-icon-wikimedia-menu {
  filter: invert(80%);
 }

 .vector-icon.vector-icon--x-small.mw-ui-icon-wikimedia-expand {
  filter: invert(80%);
 }

 .mw-parser-output .contentsPage--topic .contentsPage__intro {
   background: unset !important;
 }
 .mw-parser-output .contentsPage__section {
   background: unset !important;
 }
 .mw-parser-output .contentsPage--topic .contentsPage__heading {
   background: unset !important;
 }

figure[typeof~="mw:File/Thumb"] > figcaption, figure[typeof~="mw:File/Frame"] > figcaption {
   background: unset !important;
}

 /* #accueil_2017_bandeau */
 #accueil_2017_en-tete {
    filter: invert(90%);
    background: rgba(240,240,240,1.0);
 }

 .mw-headline,
 h2#mp-tfa-h2.mp-h2 span.mw-headline {
    background-color: rgba(20,20,20,0.0);
 }



 div#accueil_2017_bloc-titre p,
 div#accueil_2017_bloc-titre div.mw-heading.mw-heading2.ext-discussiontools-init-section
 {

    background: rgba(20,20,20,0.0) !important;
    color: rgba(10,10,10,1.0); !important;
 }


 /* At last very smart automatic backgrounds for items that have it hardcoded: */

 [style*="background-color:"],
 [style*="background:#"],
 [style*="background: #"],
 [style*="background:rgb"],
 [style*="background: rgb"],
 [style*="background: white"],
 [style*="background:white"],
 [style*="background: antiquewhite"],
 [style*="background:antiquewhite"]
 {
     background: rgba(30,30,30,1.0) !important;
     color: #34a1e8 !important; /* standout */
 }
 /*
 [style*="color"] {
     color: #34a1e8 !important;
 }
 */

.vector-sticky-pinned-container::after {
    /* background: linear-gradient(rgba(0, 0, 0, 0),#040403); */
    /* background: linear-gradient(#00000082,#00000082); */
    /* background-color: #00000000; */
    background: linear-gradient(#00000000,#00000000);
}

.vector-pinned-container {
    /* background-color: #00000082; */
    background-color: #00000010;
}

:root {
  --color-base: #a0a0a0ff;
  --box-shadow-color-base: #000;
  --background-color-base: #181818ff;
  --background-color-base-fixed: #181818ff;
  --border-color-base: #a2a9b1;
  --background-color-interactive: #282828ff;
  --background-color-neutral-subtle: #303030ff;
}



 `;

 function addCss (css) {
     const noudioStyleNode = document.createElement('style');
     noudioStyleNode.innerHTML = css;
     document.head.appendChild(noudioStyleNode);
 }

 addCss(css);
 //setTimeout(function(){addCss(css);}, 100);
})();
//Taf!
