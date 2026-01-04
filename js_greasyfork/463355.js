// ==UserScript==
// @name		1_Yahoo-Fantasy-Dark-Night
// @description		dark mode & hide ads
// @match		*://*.fantasysports.yahoo.com/*
// @match		*://login.yahoo.com/*
// @match		https://*.fantasysports.yahoo.com/*
// @match		https://login.yahoo.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463355-1_yahoo-fantasy-dark-night
// @author		sports_wook
// @version		2026.01.03.2
// @downloadURL https://update.greasyfork.org/scripts/463355/1_Yahoo-Fantasy-Dark-Night.user.js
// @updateURL https://update.greasyfork.org/scripts/463355/1_Yahoo-Fantasy-Dark-Night.meta.js
// ==/UserScript==


GM_addStyle (`

body, html.Phone, html.Ybar3 {
   background-color: #000 !important;
}

// iPad layout fixes
#outer-wrapper {
  display: inline !important;
}
#atomic
   width: 120% !important;
}
//

:root, : root {
   --ys-ui-blue-highlight: #494c5c !important;
}

#flyout > div[id^="yui"] > span[class^="_ys"] {
   color: #FFF !important;
}

.nav-item-flyout {
   background-color: #161719 !imporant;
}

.teamtable th, .Table th {
    /*! background: #161719 !important; */
   background: #161719 !important;
   background-color: #161719 !important;
   background-image: none !important;
}

.mbr-desktop-hd {
   background-color: #161719 !important;
}

.loginish {
   background-color: #000 !important;
   color: #fff !important;
}

#ybar-nav-placement > div > ul > li {
   border: none !important;
}

.nav-item-flyout {
   border-radius: 8px !important;
   border: 1px solid rgb(68, 68, 68);
}

#ybar-nav-placement > div > ul > li #flyout div > span:first-of-type {
   --ys-text-primary: #DDD !important;
}

div[id^="navtray-"] div > ul > li > div > div > div > a > span, div[id^="navtray-"] div > ul > li > div > a > div > span, div[id^="navtray-"] > div > div > span {
   color: #FFF !important;
}

#ybar-nav-placement > div > ul > li #flyout ul > li > div > a, #flyout > div > ul > li > div > a {
   border: 1px solid #444 !important;
}

a[id="edit-teams"] {
   background-color: #232a31 !important;
}

#flyout > div > ul > li > div > a > div > div {
   background-color: #494c5c !important;
   color: #EEE !important;
}

#ybar-nav-placement a {
   color: #EEE !important;
}

.Btn, .Btn-secondary, .Btn-primary, .Btn-short, .Btn-short.Btn, .Flyoutselectbox, a#comparePlayers, #open-modal-button > button, #fantasyflyout > #navtray-fantasy > #flyout > div:nth-of-type(2) > ul > li > div > a > div > div:nth-of-type(2) > button,#login-container > a, #Stencil button[class^="start-optimal-players"], #Stencil label[class*="Select-chips"], .Btn-tertiary.Mstart-med, #assistant-gm-next > button {
   background-color: #161719 !important;
   border: 1px solid #444 !important;
   color: #EEE !important;
}

.Btn:hover, .Btn-secondary:hover, .Btn-primary:hover, .Btn-short:hover, .Btn-short.Btn:hover, a#comparePlayers:hover, #open-modal-button > button:hover, #fantasyflyout > #navtray-fantasy > #flyout > div:nth-of-type(2) > ul > li > div > a > div > div:nth-of-type(2) > button:hover, #login-container > a:hover, #Stencil button[class^="start-optimal-players"]:hover, #Stencil label[class*="Select-chips"]:hover, .Btn-tertiary.Mstart-med:hover, #assistant-gm-next > button:hover {
   --ys-special-grey-hover: #494c5c !important;
   background-color: #494c5c !important;
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

#yspmaincontent > div > dialog div > a {
   background-color: #232a31;
   border: 1px solid #444 !important;
   color: #EEE !important;
}

#yspmaincontent > div > dialog div > a:hover {
   --ys-special-grey-hover: #494c5c !important;
   background-color: #494c5c !important;
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

#ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] div[class^="_sectionHeader"] h3, #ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] ul li div h5, #fantasyflyout > #navtray-fantasy > #flyout ul > li a div > span, #fantasy li h4 a, .Nav-h:not(.Nav-main) > .Navitem.Selected > .Navtarget, .Nav-h:not(.Nav-main) > .Navitem:not(.Selected):hover > .Navtarget, body, .user-id, #Grid-h-top Pbot-med F-bright, #Stencil .F-faded, div[data-tst="sit_start_suggestions"] > div > div > div div[class*="YahooSans-Medium"], div[data-tst="add_drop_suggestions"] > div > div > div div[class*="YahooSans-Medium"], div[data-tst="trade_suggestions"] > div > div > div div[class*="YahooSans-Medium"], table[data-tst="suggestion_entry_points"] tbody td > div:nth-of-type(1), table[data-tst="suggestion_entry_points"] tbody td > div:nth-of-type(1) > div:nth-of-type(2) > div > div, .Flyoutselectbox div, th span, #fantasyflyout > #navtray-fantasy > #flyout ul > li a div > span, .Control-inline.Inlineblock > label, .Control-label, span.Checkbox-text, section[id="wzrd-me-vs-league"] {
   color: #EEE !important;
}

input#playersearchtext, input#statusselect {
   color: #EEE !important;
   background: #000 !important;
   border-radius: 32px !important;
}

select, #statusselect {
   color: #BCC !important;
   background-color: #000 !important;
   border: 1px solid #444 !important;
   background-image: url("data:image/svg+xml;utf8,<svg height='40' viewBox='0 0 28 40' width='28' xmlns='http://www.w3.org/2000/svg'><path d='m-.101695 0h28v40h-28z' fill='rgb(69,69,69)'/><path d='m11.024969 17.169747c-.22949-.220165-.613374-.223632-.84767.0017-.2366989.227678-.2354974.591152-.0018.815363l3.825029 3.679823 3.82623-3.680979c.229487-.220739.233092-.589993-.0018-.815359-.236098-.2271-.613974-.226522-.847669-.0017l-2.976758 2.863304z' fill='rgb(205,205,205)'/></svg>") !important;
}

input#playersearchtext, input#statusselect {
   color: #BCC !important;
   background-color: #000 !important;
}

#Stencil form[class^="Form"]:has(input[id="playersearchtext"]) {
   border: 1px solid #444 !important;
}

.playersearchbox .yui3-ysfplayersearch {
   background: #000 !important;
   border: 1.75px solid #333 !important;
   color: #EEE !important;
}

#fantasyflyout > div[id^="navtray-"] > #flyout ul > li a:hover:not(a[data-ylk*="navtray"]), .playersearchbox .yui3-ysfplayersearch-item:hover, #ybar-nav-placement > div > ul > li #flyout ul > li > div > a:hover, ._ys_15r0wya {
   background-color: #494c5c !important;
   color: #8EC0FF !important;
   --ys-ui-blue-highlight: #494c5c !important;
}

#ybarAccountMenuBody svg[id^="yui_"] {
   fill: #8EC0FF !important;
   --yb-profile-panel-hover-text: #8EC0FF !important;
}

._yb_h2zgsf, ._yb_10syyxx {
   color: #EEE !important;
}

._yb_10syyxx:hover {
   background-color: transparent !important;
}

#ybarAccountMenuBody > div > div:hover {
   background-color: #494c5c !important;
}

.Dropdown {
   border-radius: 8px !important;
   border: 1px solid #444 !important;
}

.Checkbox input:checked + label .Checked {
   background: #8EC0FF !important;
   border-color: #8EC0FF !important;
}

.playersearchbox .yui3-ysfplayersearch {
   background: #000 !important;
   border: 1.75px solid #333 !important;
   color: #EEE !important;
}


#ad_top_right, #ad_mid_right, div[aria-label="Advertisement"], div[id^="google_ads_iframe"], div[class*="adlocation"], .Tst-adlocation-LREC, #yspcontentmainhero > *[id^="yui"], #whatsnew-prize, .player-notes iframe, div[id^="sb_rel_react-playernotes-LREC"], .player-notes div[id^="yui_"]:has(div[class="darla"]), div[id^="react-playernotes-LREC"], #yspmaincontent a.Beacon, #ffl-banner, div[class*="Page-masthead"], div[class*="Masthead Relative"], .df-ad, #yspcontentmainhero.Thm-snow > a, #yspmaincontent.Thm-snow > a, div[id*="promo"], div[class*="promo"], div[id*="yspad"], #static-yahoocup-promo-overlay, .monalixa, .monalixa-beacon, .tab-bets, #adunit, #ads, .ads, #ad, .ad, .ad.ad-1, div[class^="ad-"], div[id^="ad-"], div[class^="ad_"], div[id^="ad_"], div[aria-label="Advertisement"], div[class*="-adlocation"], div[id*="-adlocation"], #yspmh, .Page-masthead, section[id*="-promo"], #player-note-content .player-notes ul > div[id^="yui_"]:has(div[id^="react-playernotes"]), .content-ads, .CAN_ad, table.ad_slug_table, .login-bg-outer, .login-bg-outer > .login-bg-inner, #gpt-passback, html body.jar, div#login-ad-rich, .login-box-ad-fallback, #login-box-ad-fallback, .login-bg-outer, #yspmain > #yspmaincontent > .yui3-overlay-mask, div[id^="yui_"].yui3-overlay-modal:has(section#monalixa-overlay), form[id="add-drop-players-form"] > section.No-m:has(header), a[data-slk="Sponsor Image"], div:has(> #mid_center-celebratewin), a[id="FantasyChatButton"], .Page-bd::before, .Page-bd::after, div[data-tst="product-switcher"] > ul > li:not(:first-of-type), [id^="wzrd-"] div:has(>button[aria-label^="Follow us"]) {
   display: none !important;
   width: 0px !important;
   height: 0px !important;
}


#player-note-content div > span[title^="Batting"] {
  color: #FFF !important;
}

::backdrop, :root, [data-color-scheme="light"] {
   --ys-ui-primary-inverse: #232a31 !important;
}

#fantasy section li.Py-med a {
   color: #bbc !important
}

#Stencil .F-reset label[class*="Select-chips"]:hover {
   color: #8EC0FF !important;
}

#Stencil .F-reset {
   color: #DDD !important;
}

#Stencil a {
   color: #DDD;
}

.Nav-flyout ul.Dropdown, form.Selectbox {
   background: #232a31 !important;
   background-color: #232a31 !important;
}

.Nav-flyout .Navtarget:hover {
   background: #232a31 !important;
   background-color: #232a31 !important;
}


ul[role="presentation"] > li > a[class*="rapid-noclick-resp"]::after {
   display: unset !important;
   bottom: -11px !important;
}

ul[role="presentation"] > li > a[class*="rapid-noclick-resp"]::after {
   background-color: #8EC0FF !important;
}

form.Selectbox select.Mod-select option:hover, ._yb_1tq4n:hover {
   background: #494c5c !important;
   background-color: #494c5c !important;
}

.ybar-ytheme-crunch ._yb_f7lfa ._yb_1tq4n:hover ._yb_1fvio {
   background: #232a31 !important;
   border-radius: 0px !important;
}

#Stencil .Bg-shade {
   background: transparent !important;
}

#Stencil .Linkable:hover a:not(.Btn, .Btn-primary), .ybar-ytheme-crunch ._yb_f7lfa ._yb_1fvio:hover, #Stencil .F-link {
   color: #8EC0FF !important;
}

.Flyoutselectbox:hover {
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

.Flyoutselectbox .flyout-content {
   border-color: #444 !important;
}

.Flyoutselectbox .flyout_trigger:hover, .Flyoutselectbox .Js-next:hover, .Flyoutselectbox .Js-prev:hover {
   color: #8EC0FF !important;
!   border: 1px solid #AAA !important;
   background-color: #494c5c !important;
}

.Desktop .ysf-rosterswapper:not(.swapping) tbody tr:hover, .Desktop .ysf-rosterswapper:not(.swapping) tbody tr:focus, .Desktop .ysf-rosterswapper:not(.swapping) tbody tr:hover {
  background: #373737 !important;
}

div, a {
   --yb-text-secondary: #EEE !important;
   --yb-text-primary: #8EC0FF  !important;
   --yb-text-hover-color: #8EC0FF !important;
   --yb-white: #232a31 !important;
   --yb-midnight: #8EC0FF !important;
}

#atomic, .template-html5 .Subnav-main-wrap:before, .template-html5 .Subnav-main-wrap:after, .template-html5 .Page-bd:before, .template-html5 .Page-bd:after, .template-html5 .Page-ft:before, .template-html5 .Page-ft:after, .Page-maincontent, .Page-footercontent, .Page-ft, section {
   background: #000 !important;
   background-color: #000 !important;
}

#Stencil .F-shade {
   color: #aaa !important;
}

.Table, .Table th, .Table td, #Stencil .Bdr, #Stencil .Bdrx, #Stencil .Bdry, #Stencil .Bdrtop, #Stencil .Bdrbot, #Stencil .Bdrstart, #Stencil .Bdrend, .Ta-end, .Bdrstart, .Mawpx-40, .Fz-xxs, #sit_start_assistant table[data-tst*="table"] {
   border-color: #333 !important;
}

.Table td.Ta-end.Nowrap div {
   color: #DDD !important;
}

tbody tr td section a, .Inline div[class^="F-rank-"] a {
   color: unset !important;
}

header, h1, h2, .ybar-ytheme-crunch ._yb_f7lfa ._yb_1fvio._yb_1ww8p {
   color: #FFF !important;
}

.template-html5 .Page-bd, #statTable0 tbody, .yui-sv-content, .ct-box-bd.yui-sv-bd {
   background: #000 !important;
}

.Thm-inherit .ysf-rosterswapper tbody .bench {
   background-color: #1C1D1F !important;
}

footer a, section a, a:hover, #fantasy section li.Py-med a:hover {
   color: #8EC0FF !important;
}

#Stencil .F-rank-good {
   color: #008343 !important;
}

#Stencil .F-rank-neutral {
   color: #5b636a !important;
}

#Stencil .F-rank-bad {
   color: #cc0e25 !important;
}

.Nav-h:not(.Nav-main) > .Navitem > .Navtarget, .Table thead > tr:not(.First) th, .Table thead > tr.First.Last th, .Table th {
   color: #C0C0C0 !important
}

.Nav-h:not(.Nav-main):not(.Nav-plain) .Navitem.Selected::after {
   background-color: #8EC0FF !important;
}

#fantasy li a:hover {
   color: #8EC0FF !important;
}

#gamehome-teams .Bg-shade2 {
   background: transparent !important;
}

#Stencil .Bg-shade2 {
   background: #000 !important;
}

#Stencil .Bdrtop, .Bdrbot {
   border-style: none !important;
   border-width: 0px !important;
}

#Stencil .Linkable:hover {
   background: #494c5c !important;
   border-radius: 8px !important;
}

li p {
   color: #bbc !important;
}

:root {
   --yb-profile-hover: #000;
   --tertiaryColor: #5b636a;
   --headerBgColor: #161719;
   --lv2BgColor: #000;
   --lv3BgColor: #000;
!   --seperatorColor: #e0e4e9;
   --linkColor: #8EC0FF;
   --linkActiveColor: #8EC0FF;
!   --hoverBgColor: #e0f0ff;
!   --itemIconBgColor: #f0f3f5;
!   --itemIconColor: #1d2228;
}

input#ybar-sbq, #ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] {
   background: #000 !important;
   border: 0.25px solid #444 !important;
}

#ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] ul li {
   background: #000;
}

#ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] ul li:hover {
   background: #494c5c !important;
}

#ybar-search-box-container div[class^="_suggestionList"] div[class^="_resultsContainer"] div[class^="_sectionHeader"] {
   background: #232a31 !important;
   border-top: none !important;
}

#Stencil .F-trade {
   color: #8EC0FF !important;
}

#Stencil .Ptop-xs, #Stencil.Tablet .Tablet-ptop-xs, #Stencil.Phone .Phone-ptop-xs {
  padding-top: 8px;
}

.ybar-ytheme-crunch div > ul > li > div > ul > li > a:hover, #ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div {
   text-shadow: none !important;
   background-color: #232a31 !important;
}

#ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li > ul > li > a:hover, #ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li > ul > li > a[aria-label^="Selected"], #ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li > ul > li:last-of-type > button {
   background: #494c5c !important;
   background-color: #494c5c !important;
   --yb-selected-item-background: #494c5c !important;
   --yb-editions-button: #494c5c !important;
}

#ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li > ul > li:last-of-type > button {
   background-color: #232a31 !important;
}

#ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li:last-child span {
   color: #DDD;
}

#ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li a[aria-label=": Games"]:hover, #ybar-inner-wrap nav[role="navigation"] > ul > li:last-child > div > ul > li a[aria-label=": Tech"]:hover {
   --yb-selected-item-background: #494c5c !important;
   --yb-editions-button: #494c5c !important;
}

a[id="ybarMailLink"] svg, a[id="ybarMailLink"] svg path {
   stroke: #EEE !important;
}

a[id="ybarMailLink"]:hover svg path, .ybar-ytheme-crunch a[id="ybarMailLink"]:hover svg path, .ybar-ytheme-crunch .ybar-menu-hover-open div:hover {
   --yb-marshmallow: #494c5c !important;
}

.List > .Listitem {
   color: #CCC !important;
}

.List-rich > .Listitem {
   border-color: #444 !important;
}

div[data-tst="sit_start_suggestions"] > div > div > div, div[data-tst="add_drop_suggestions"] > div > div > div, div[data-tst="trade_suggestions"] > div > div > div {
   background-color: #000 !important;
   border: 1px solid #333 !important;
   color: #eee !important;
}

div[data-tst="sit_start_suggestions"] > div > div {
!   background-color: #000 !important;
!   border: 1px solid #444 !important;
!   color: #EEE !important;
}

#Stencil .Mbot-xxl, #Stencil.Tablet .Tablet-mbot-xxl, #Stencil.Phone .Phone-mbot-xxl {
   margin-bottom: 10px !important;
}

.Atomic .Td\(n\) {
   background: none !important;
}

#ybar-inner-wrap, table thead, table thead tr[id^="yui_"].First, .yui3-widget-content-expanded.yui3-widget-stdmod.yui3-overlay-content.Ta-start.Atomic.Overlay, .tablelegend section, #hybrid_entry_point.Atomic.Relative table tbody, #hybrid_entry_point > table > thead > tr > th span > button {
   background-color: #161719 !important;
   background-image: none !important;
}

#hybrid_entry_point > table > thead > tr > th span > button:hover {
   text-decoration: underline !important;
   color: #8EC0FF !important;
}

table[data-tst="suggestion_entry_points"] {
   border: 1px solid #333 !important;
}

!.Bgc($shade) {
!   background-color: #2b2b2c !important;
!}

.Atomic .Bgc\(\$shade\) {
   background: #444444 !important;
}

.Atomic .C\(\#fff\) {
   color: #161719 !important;
}

.Atomic .Bgc\(selected\), .Atomic .Bgc\(table-hdr-bg\) {
   background-color: #192021 !important;
}

.Atomic .Bgc\(\#fff\), .Atomic .Bgc\(main-bg-color\), .Atomic .Bgc\(primary-bg\) {
   background-color: #000 !important;
}

.Table-interactive tr:hover > td a:not(.Btn, .Btn-primary, .ysf-game-status) {
   color: #8EC0FF !important;
}

.Atomic .C\(blue1\) {
   color: #ADD4FF !important;
}

.Thm-inherit .highlight {
   -webkit-animation: highlight-glass 0s ease-out !important;
   -moz-animation: highlight-glass 0s ease-out !important;
   animation: highlight-glass 0s ease-out !important;
}

.Desktop .ysf-rosterswapper.swapping tr.swaptarget:hover, .Desktop .ysf-rosterswapper.swapping tr.swaptarget:focus {
   opacity: 1 !important;
   cursor: pointer !important;
}

.ybar-page-info {
   background: #000 !important;
}

.Desktop .ysf-rosterswapper:not(.swapping) tbody tr:hover, .Desktop .ysf-rosterswapper:not(.swapping) tbody tr:focus, .Desktop .ysf-rosterswapper:not(.swapping) tbody tr:hover, .Table > tbody > tr:hover, .Table-interactive tr:hover > td:not([data-tooltip-id^="wzrd-"]) {
   background: #494c5c !important;
}

.Thm-inherit .ysf-rosterswapper.swapping tr.swaptarget:not(._poop_), .editable.swaptarget {
   background: #494c5c !important;
}

.Desktop .ysf-rosterswapper.swapping tbody tr.swaptarget:hover td:not(._TEST_), .Desktop .ysf-rosterswapper.swapping tbody tr.swaptarget:focus td:not(._poop_), .Desktop .ysf-rosterswapper.swapping tbody tr.swaptarget:hover td, .Desktop .ysf-rosterswapper.swapping tbody tr.swaptarget:focus td {
   background: #6D728A !important;
}

#fantasyflyout > #navtray-fantasy > #flyout > div:nth-of-type(2) {
   --ys-text-primary: #EEE !important;
   --ys-text-secondary: #EEE !important;
   --ys-ui-blue-highlight: #494c5c !important;
   --ys-special-grey-hover: #494c5c !important;
}

#statTable1-wrap.tablewrap, #statTable2-wrap.tablewrap, #statTable3-wrap.tablewrap {
   margin-top: 30px !important;
}

div[data-tst="research_assistant_link"] > a:hover, div[data-tst="trade_hub_link"] > a:hover, ul#legend > li.Listitem > a > span:hover {
   text-decoration: underline !important;
}

#Stencil .Bg-overlay {
   background-color: #161719 !important;
   border: 2px solid #444 !important;
}

div[class*="Bgc(color-light-green)"], div[class*="Bgc(green-highlight)"] {
   background-color: #25a45d !important;
}

div[class*="Bgc(color-light-red-invalid)"] > div {
   color: #000 !important;
}

div[class*="Bgc(color-light-red-invalid)"] {
  background-color: #cf152a !important;
}

div[class*="Bgc($c-fuji-grey-c)"] {
   background-color: #BBC !important
}

div:has( > #react-playernote-overlay), div[class^="ReactModal__Content"][class$="ReactModal__Content--after-open"] {
   border: 2px solid #000 !important;
   border-radius: 25px !important;
   overflow: hidden !important;
   padding: 0 !important;
   margin: 0 !important;
   box-shadow: 0 0 250px 200px #494c5c !important;
   position: fixed !important;
   top: 50% !important;
   left: 50% !important;
   transform: translate(-50%, -50%);
}

.wz-text-slate-800 {
  background: #161719 !important;
}

.wz-text-slate-900 {
  color: #FFF !important;
}

li[class*="sidebar-player-row"] div:first-of-type > div[class*="Bdc"]:first-of-type {
  border: 2px solid #555 !important;
}

.Atomic .Bg\\(\\$selected-player-sidebar-bg\\), .Atomic .Bg\\(\\$selected-player-sidebar-bg\\)\\:h:hover {
   background: rgba(190, 197, 248, 0.3) !important;
   border-radius: 5px !important;
}

.player-sidebar > ul > li.search > input {
   background: #000 !important;
   border: 2px solid #444 !important;
}

.player-sidebar > ul > li.search > svg {
   fill: #999 !important;
}

.Atomic .Bgc\(\$accent\), .Atomic .Bgc\(\$c-fuji-grey-c\), .Atomic .Bgc\(\$accent\)\:h:hover, .Atomic .Bgc\(\$c-fuji-grey-c\)\:h:hover {
   background-color: #161719;
}

ul[role="tablist"] {
   background: #333333 !important;
}

#player-note-content ol > li > button[aria-selected="true"] {
   background: rgba(190, 197, 248, 0.15) !important;
   border-radius: 8px !important;
}

#ybarAccountMenuBody {
   background-color: #232a31 !important;
   border: 1px solid #444 !important;
}

#ybarAccountMenuBody:hover {
   background-color: var(--playbook-ui-primary-inverse-dim-1);
}

.Atomic .Bdc\\(\\$blue\\), .Atomic .Bdc\\(\\$accent\\), .Atomic .Bdc\\(\\$shade\\) {
   border-color: #484c5c !important;
}

.Atomic .Fill\\(\\$text-primary\\)\\! {
   fill: #6e7780 !important;
}

.Atomic .Bdbc\\(\\$accent\\) {
   border-bottom-color: #6e7780 !important;
}

#react-playernote-overlay {
   --ys-ui-table-bg: #232a31;
   --ys-ui-accent: #444;
   --ys-ui-secondary: #DDD;
}

#player-note-content ul[id^="yui_"] > li[id^="yui_"] > svg {
   fill: #FFF;
   stroke: #FFF;
}

#player-note-content input[id^="yui_"] {
   background: #000 !important;
   border: 2px solid #444 !important;
   color: #999 !important;
}

#react-playernote-overlay thead tr th {
   --ys-ui-secondary: #DDD;
}

#react-playernote-overlay ul[role="tablist"] > li > button, .ybar-ytheme-crunch ._yb_f7lfa ._yb_1fvio {
   color: #b0b0b0 !important;
}

header div[class*="Bdbc($accent)"] {
   border-bottom-color: #555 !important;
}

#react-playernote-overlay > #player-note-content table {
   border-top: 1px solid #333 !important;
   border-bottom: 1px solid #333 !important;

}

#react-playernote-overlay > #player-note-content table > tbody > tr > td, #react-playernote-overlay > #player-note-content table > thead > tr > th, section > div[class*="Bdc($accent)"] {
   border-color: #333 !important;
}

#react-playernote-overlay > #player-note-content div > section > header div[class*="Bdbc($accent)"], #react-playernote-overlay > #player-note-content div > section.player-notes, #react-playernote-overlay > #player-note-content div > section.player-notes > ul > li > section {
   background-color: #161719 !important;
}

.Atomic div[class*="C($text-primary)"], .depth-chart-player-name,div[data-tst="fantasy-team-overview-name"], table[data-tst="hub-team-analysis"] > tbody > tr > th > div > div:nth-of-type(2) > div:nth-of-type(2) {
   color: #EEE !important;
}

.depth-chart-player-name > span[class*="Bgc($accent)"] {
   color: #000 !important;
}

header div[class*="Bgc($tab-underline-color)"] {
   background-color: #8EC0FF !important;
}

#react-playernote-overlay > #player-note-content div[class*="base-bg"], #player-note-content div[class*="shade"][class*="Bgc"] {
   background-color: #161719 !important;
   color: #DDD !important;
}

#player-note-content .player-sidebar div[class*="base-bg"]
   background-color: transparent !important;
   border-color: #444 !important;
}

#player-note-content section > header div[class*="accent"], #player-note-content section.player-notes, #player-note-content section.player-notes > ul > li > section, section.player-notes {
   background: #161719 !important;
   background-color: #161719 !important;
}

#react-playernote-overlay ul[role="tablist"] > li > button:hover {
   color: #8EC0FF !important;
}


!#react-playernote-overlay > #player-note-content div[class*="text-primary"], #react-playernote-overlay > #player-note-content div[class*="base-bg"] {
!   background: #232a31 !important;
!   color: #DDD !important;
!}

#react-playernote-overlay > #player-note-content section[class*="roster-status"], #react-playernote-overlay > #player-note-content section[class*="player-bio-stat-bar"] {
   background: unset !important;
}

!#react-playernote-overlay > #player-note-content section:not([class*="roster-status"]) {
!   background: #000 !important;
!   background-color: #000 !important;
!}

#matchup.Mod {
   background: unset !important;
}

#matchup-header td div, #matchups td div, #bench-table td div {
   color: #DDD !important;
}

#react-playernote-overlay > #player-note-content section #tabpanel section table tbody tr:hover td {
   background: rgba(190, 197, 248, 0.3) !important;
}

.Stuck, table > tbody[class*="Bgc(white)"] {
   color: #232a31 !important;
   background: #161719 !important;
   border-radius: 8px !important;
   border: 1px solid #444 !important;
}

table > thead[class*="Bgc(background-info-gray)"] {
   border-top: none !important;
   border-left: none !important;
   border-right: none !important;
   background-color: #000 !important;
}

div[class*="Bgc(color-light-red-invalid)"] > div[class*="YahooSans-Bold"], div[class*="Bgc(color-light-green)"] > div[class*="YahooSans-Bold"] {
   color: #000 !important;
}

.Atomic div[class*="YahooSans-Medium Ta(c)"] {
   color: #EEE !important;
   border-radius: 8px !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div {
   background: #000 !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div {
   background-color: #000 !important;
   border: 1px solid #444 !important;
   padding: 5px !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div > button[class$="YahooSans-Bold"] {
   background-color: #161719 !important;
   color: #EEE !important;
   border: 1px solid #666 !important;
   margin-left: 3px !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div > button[class$="YahooSans-Medium"] {
   background: #000;
   color: #AAA !important;
   border: 1px solid #000 !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div > button[class$="YahooSans-Bold"]:hover {
   background-color: #494c5c !important;
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

div[id="hybrid_entry_point"] div[data-tst$="_suggestions"] > div:nth-of-type(1) > div > button[class$="YahooSans-Medium"]:hover {
   background-color: #494c5c !important;
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

a[data-tst*="-link-"] > svg {
   fill: #8EC0FF !important;
   stroke: #8EC0FF !important;
   stroke-width: 0px !important;
}

#matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade Hidden"]):hover, #matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade2 Bg-shade Hidden"]):hover {
   background: #494c5c !important;
}

#matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade2 Bg-shade Hidden"]), #matchups #matchupcontent1 table tbody tr:has(td[class*="Bg-shade2"]) td {
   background-color: #1C1D1F !important;
}

#matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade2 Bg-shade Hidden"]):hover {
   background: #494c5c !important;
}

#matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade Hidden"]) {
   background: #000 !important;
}

.yfa-icon.playernote-new, .yfa-icon.playernote-recent, .yfa-icon.playernote-old, .yfa-icon.video-new, .yfa-icon.video-recent, .yfa-icon.video-old {
  background-image: url("https://s.yimg.com/cv/apiv2/fantasy/img/player-note-sprite.png") !important;
}

#matchups #matchupcontent1 table tbody tr:has(td[class="Alt Bg-shade2 Bg-shade Hidden"]):hover > td {
  background: #494c5c !important;
}

#team-card-matchup, .Card {
  background-color: #161719 !important;
  color: #EEE !important;
  border: 1px solid #333 !important;
}

.Btn-disabled {
  background: transparent !important;
}

.Avatar-xs, .Avatar-sm, .Avatar-med, .Avatar-lg {
  border: none !important;
}

button.close-card svg {
  fill: #FFF !important;
  stroke: #FFF !important;
}

#Stencil .Ell {
  color: #DDD !important;
}

#player-note-content div > div[class*="Ell"] {
  color: #BBB !important;
}

.Mod {
  background: transparent !important;
}

.Nav-h:not(.Nav-main) {
  border-bottom-color: transparent !important;
}

#FantasyChatEntrypoint div[class*="FantasyChat"] > div {
  border-color: #333 !important;
}

*[class*="C\(blue-1c\)"] {
  color: #8EC0FF !important;
}

svg[data-icon="chevron-right"], svg[data-icon="chevron-right"] > path, svg[data-icon="star"] > path, svg[data-icon="star-filled"] > path {
  fill: #8EC0FF !important;
}

.watch:hover {
  color: #8EC0FF !important;
}

#player-note-content div[class^="My"] {
  color: #DDD !important;
}

.Atomic .Bgc\(--ys-ui-table-bg\) {
  background-color: transparent !important;
}

#redzone .RedZone table[class*="active"]:first-of-type > tbody:first-of-type td[class*="flash-cellpos"][class*="Bgc"][class*="Fw"], #redzone .RedZone table[class*="active"]:first-of-type > tbody:first-of-type td[class*="flash-cellnullnull"][class*="Bgc"][class*="Fw"] {
  background-color: #161719 !important;
  --ys-ui-blue-highlight: #161719 !important;
}

* {
  --ys-ui-table-bg: transparent !important;
  --ys-ui-accent: transparent !important;
  --ys-ui-base-bg: #161719 !important;
  --ys-ui-blue-highlight: #8ec0ffa1 !important;
  --ys-ui-green-highlight: #00552b9c !important;
  --ys-ui-red-highlight: #cc0e25ab !important;
  --ys-text-secondary: #c0c0c0 !important;
  --ys-core-blue: #8ec0ff !important;
}

#redzone .RedZone table[class*="active"]:first-of-type > tbody:first-of-type {
  background: #000 !important;
  --ys-ui-table-bg: transparent !important;
  --ys-ui-accent: transparent !important;
  --ys-ui-base-bg: transparent  !important;
  --ys-ui-blue-highlight: transparent !important;
  --ys-ui-green-highlight: transparent !important;
  --ys-ui-red-highlight: transparent  !important;
  --ys-text-secondary: transparent !important;
  --ys-core-blue: transparent !important;
}

#redzone .RedZone table[class*="active"]:first-of-type > tbody:first-of-type {
  --ys-core-blue: #8ec0ff !important;
}

section[class^="roster-status"] > div > div:last-of-type {
  background: #333 !important;
  border: none !important;
  border-radius: 0px !important;
}

#felo-overlay, section[id="start-active-overlay"] {
  background: #212324 !important;
  border: 3px solid #AAA9 !important;
  border-radius: 15px !important;
}

#Stencil .Bg-selected {
  --playbook-ui-blue-highlight: #494c5c !important;
}

#Stencil .Bg-shade2 {
  --playbook-ui-shade: #494c5c !important;
}

.played-block {
  height: 5px;
  background-color: #8ec0ff !important;
  display: inline-block;
}

.remaining-block {
  height: 5px;
  background-color: #212324 !important;
  display: inline-block;
}

#ybar-navigation ul li a > div, #flyout > div > ul > li > div > a > div > div, #flyout > div > ul > li > div > a > div > div > div, #flyout > div > ul > li > div > a > div > div > div > div, #flyout > div > ul > li > div > a > div > div > div > div > div, #flyout > div > ul > li > div > a > div > div > div > div > div > div {
  background: none !important;
}

#ybar-nav-placement div[id^="navtray-"] div > ul > li > div > a > div:last-of-type > div:last-of-type, #ybar-nav-placement div[id^="navtray-"] div > ul > li > div > a > div:last-of-type > div:last-of-type:has(> span), .LineClamp\(2\) {
  background-color: transparent !important;
  background: transparent !important;
}

#ybar-nav-placement div[id^="navtray-"] div > ul > li > div > a:hover {
  background: #494c5c !important;
}

#ybar-navigation ul > li div > div > div > div {
  background-color: #161719 !important;
}


#ybar-navigation ul li div:hover {
  background-color: none !important;
}

#ybar-nav-more-dropdown {
  background: #161719 !important;
}

button[aria-controls="ybar-nav-more-dropdown"] {
  color: #8ec0ff !important;
}

#ybar-navigation ul li div > ul > li > a:hover, #ybar-nav-more-menu > #ybar-nav-more-dropdown > ul > li > a:hover, #ybar-navigation ul li div >ul > li:hover {
  background: #161719 !important;
  color: #8ec0ff !important;
}

table > tbody > tr > td[style^="background-color: rgb("] {
  color: #000 !important;
}

table > tbody > tr > td[style^="background-color: rgb(173, 235, 173)"] {
  background-color: #66FF66 !important;
}

table > tbody > tr > td[style^="background-color: rgb(216, 255, 204)"] {
  background-color: #99FF99 !important;
}

table > tbody > tr > td[style^="background-color: rgb(255, 255, 204)"] {
  background-color: #FFFF66 !important;
}

table > tbody > tr > td[style^="background-color: rgb(255, 214, 204)"] {
  background-color: #FFCC66 !important;
}

table > tbody > tr > td[style^="background-color: rgb(249, 122, 122)"] {
  background-color: #FF5050 !important;
}

#ybar-navigation > .ybar-mod-navigation ul[id^="yui_"][class^="_yb_"] div:has(> #fantasyflyout)  {
  background: #161719 !important;
  border: 1px solid #444 !important;
}

#ybar-navigation > .ybar-mod-navigation ul[id^="yui_"][class^="_yb_"] > li > div:has(> ul)  {
  background: #161719 !important;
  border: 1px solid #444 !important;
}

.ybar-menu-hover-open button[class^="_yb"]:hover {
   --yb-popover-background: #161719 !important;
}

nav[role="navigation"] > ul > li:last-of-type > button {
   color: #ddd;
}

a[id="ybarMailLink"] svg path {
   stroke: transparent !important;
}

#yspmaincontent > div > dialog {
   background-color: #161719 !important;
   border: 2px solid #000 !important;
   box-shadow: 0 0 250px 200px #494c5c !important;
}

div[id^="yui_"][class="W(40%)"] span > div {
   color: #EEE !important;
}

#yspmaincontent > div > dialog h3 > span {
   color: #8EC0FF !important;
}

#yspmaincontent > div > dialog > div > button {
   background-color: #232a31;
   border: 1px solid #444 !important;
   color: #EEE !important;
}

#yspmaincontent > div > dialog > div > button:hover {
   --ys-special-grey-hover: #494c5c !important;
   background-color: #494c5c !important;
   border: 1px solid #AAA !important;
   color: #8EC0FF !important;
}

#yspmaincontent > div > dialog > div > button > svg {
   fill: #EEE !important;
}

div[data-wf-body*="EventCard"] > a, div[class^="game-"] > section > a, div[class^="game-"] > section > footer > a {
   background: #161719 !important;
}

div[data-wf-body*="EventCard"] > a span, div[class^="game-"] > section > a span, div[class^="game-"] > section > a:last-of-type > div div:has(>span):has(svg) > div {
   color: #EEE !important;
}

div[data-wf-body*="EventCard"] > a > header div, div[class^="game-"] > section > a:first-of-type > div >div > div > div > div {
   color: #c0c0c0 !important;
}

.RailResponsive {
   margin-top: 10px !important;
}

ul.Dropdown {
   background: #232a31 !important;
}

ul.Dropdown > li:hover {
   background: #494c5c !important;
   background-color: #494c5c !important;
   color: #8EC0FF !important;
}

form.wafer-form div:has(>button) {
   background-color: #161719 !important;
   border: 1px solid #444 !important;
   color: #EEE !important;
}

form.wafer-form div:has(>button):hover {
   background-color: #161719 !important;
   border: 1px solid #AAA !important;
}

form.wafer-form div > button > svg, form.wafer-form div > button > svg:hover {
   fill: #8ec0ff !important;
}

form.wafer-form div > button:hover, form.wafer-form > div > label div > div:has(>span):has(input#scoreboard-date-filter):hover {
   background-color: #494c5c !important;
}

div:has( > div[id="ybar-navigation"]) {
   background-color: #161719 !important;
}

.wz-bg-gray-50, div[style^="background-color: rgb(240, 243, 245)"] button {
  background: #333333 !important;
  background-color: #333333 !important;
}

section#wzrd-adds-tracker, section#wzrd-league-control-bar > div, div[style^="background-color: rgb(240, 243, 245)"] {
  background-color: #161719 !important;
  border: 1px solid #333 !important;
  border-radius: 8px !important;
}

.wz-bg-gray-50:hover {
  background-color: #494c5c !important;
}

.wz-bg-white {
  background-color: #161719 !important;
}

.wz-text-gray-500 {
  color: #EEE !important;
}

span.wz-inline-block {
  color: #000 !important;
}

#Stencil .F-position, #scoreboard section > a[data-tst^="gamestatus"]:first-of-type div {
  color: #CCC !important;
}

#scoreboard section > a[data-tst^="gamestatus"] ~ footer > a {
  background-color: #333 !important;
}

#scoreboard section > a[data-tst^="gamestatus"] {
  background: #161719 !important;
}

#scoreboard div[class*="game"] section {
  border: 1px solid #333 !important;
}

#Stencil .F-timestamp {
  color: #AAA !important;
}

.wz-to-indigo-600, .wz-from-blue-600 {
  --tw-gradient-to: #8EC0FF !important;
  --tw-gradient-from: #8EC0FF !important;
}

div[class*="wz-bg-white"][class$="80"] {
  background-color: #000 !important;
}

#.wz-text-to-white, #matchup header td div, #matchups td div, #bench table td div {
#  color: #000 !important;
#}

.wz-to-white, .wz-from-slate-50 {
  background: #161719 !important;
  background-color: #161719 !important;
}

.wz-text-white {
  color: #000 !important;
  --tw-text-opacity: 0 !important;
}

.wz-flex-1 span, .wz-transition-all tbody tr.First > td:last-of-type, .wz-transition-all tbody tr.Last > td:last-of-type {
  color: #EEE !important;
}

div[id^="wzrd-tooltip"][class^="react-tooltip"], .backdrop-filter {
  background: #8EC0FF !important;
  background-color: #8EC0FF !important;
}

div[id^="wzrd-tooltip"][class$="react-tooltip__show"][role="tooltip"] {
  border: 1px solid #666 !important;
}

.wz-bg-gray-100 {
  background-color: transparent !important;
}

div[id^="wzrd-tooltip-excluded"] {
  color: #000 !important;
}

div[id^="wzrd-tooltip"][class$="react-tooltip__show"][role="tooltip"] > div > div:last-child, .wz-text-slate-600, div[class^="react-tooltip"] [class*="wz-text"] {
  color: #EEE !important;
}

.Atomic div[class*="Bgc(--ys-mono-green-1)"] {
  background-color: #92D050 !important;
}

.Atomic div[class*="Bgc(--ys-ui-accent)"] {
  background-color: #999 !important;
}

.Atomic div[class*="Bgc(--ys-mono-red-1)"] {
  background-color: #CC0E25 !important;
}

#buzzindex ul.Nav-chips > li.Navitem.Selected {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
}

#buzzindex ul.Nav-chips > li.Navitem.Selected a, #buzzindex ul.Nav-chips > li.Navitem.Selected a:hover {
  color: #8EC0FF !important;
}

#buzzindex ul.Nav-chips > li.Navitem {
  background: #333333 !important;
  background-color: #333333 !important;
  border: 1px solid #444 !important;
}

#buzzindex ul.Nav-chips > li.Navitem:hover {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
}

#buzzindex ul.Nav-chips > li.Navitem a:hover {
  color: #EEE !important;
}

.Table-interactive:not(.smartphone) tr:hover > td a:not(.Btn, .Btn-primary, .ysf-game-status) {
  color: #8EC0FF !important;
}

div[class*="roster-actions"][class*="buttonContainer"] > a, div[class^="actions"] > button, a.wz-inline-flex {
  background: #333333 !important;
  background-color: #333333 !important;
  border: 1px solid #444 !important;
  color: #EEE !important;
}

div[class*="roster-actions"][class*="buttonContainer"] > a:hover, div[class^="actions"] > button:hover, a.wz-inline-flex:hover {
  background: #494c5c !important;
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

textarea {
  background-color: #161719 !important;
  color: #FFF !important;
  border-color: #13408c !important;
}

.Atomic svg[class^="Fill(--ys-text-primary)"] {
  fill: #EEE !important;
  --ys-text-primary: #EEE !important;
  stroke: #EEE !important;
}

.Atomic svg[class^="Fill(--ys-text-primary)"]:hover {
  fill: #8EC0FF !important;
  --ys-text-primary: #8EC0FF !important;
  stroke: #8EC0FF !important;
}

.Atomic .Jc(c) {
  justify-content: left !important;
}

#player-note-content a[class*="player-name"], #player-note-content div[style="text-align: right;"] {
  text-align: left !important;
}

div[role="combobox"] > button, div[role="combobox"] > ul, div[role="combobox"] > ul > li {
  background: #161719 !important;
  color: #EEE !important;
  border-color: #444 !important;
}

div[role="combobox"] > button:hover, div[role="combobox"] > ul > li:hover {
  background: #494C5C !important;
  color: #8EC0FF !important;
  border-color: #8EC0FF !important;
}

.Nav-flyout {
  background: transparent !important;
}

div:has( > button#assistant-gm-button) {
  background: none !important;
}

button#assistant-gm-button {
  background: #161719 !important;
}

button#assistant-gm-button > span {
  color: #FFF !important;
}

button#assistant-gm-button > svg {
  fill: #FFF !important;
}

button#assistant-gm-button:hover > span {
  color: #8EC0FF !important;
}

button#assistant-gm-button:hover > svg {
  fill: #8EC0FF !important;
}

.Atomic div[class*="injury-pill-bg"] {
  margin-bottom: -8px !important;
}

.wz-bg-slate-50\/50, .hover\:wz-bg-slate-50\/50:hover {
  background-color: #333 !important;
  border: 1px solid #444 !important;
}

.wz-bg-slate-50\/50 span {
  color: #FFF !important;
}

.wz-flex-shrink-0 > button[class^="wz"] {
  background: #161719 !important;
  border: 1px solid #444 !important;
  color: #EEE !important;
}

.wz-flex-shrink-0 > button[class^="wz"]:hover {
  background: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

button[class*="wz-bg-white"][class*="20"], #assistant-gm-modalTitle button {
  background-color: #161719 !important;
  border: 1px solid #444 !important;
  color: #EEE !important;
}

button[class*="wz-bg-white"][class*="30"]:hover, form button[class^="wz"]:hover, #assistant-gm-modalTitle button:hover {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

#assistant-gm-modalTitle button svg path {
  fill: #FFF !important;
}

#assistant-gm-modalTitle button:hover svg path, svg[data-icon="checkmark-circle-filled"], svg[role="img"]:not(button#assistant-gm-button > svg[data-icon="stardust-unfilled"]) > path {
  fill: #8EC0FF !important;
}

.assistantPlayerContainer {
  border-left: 2px solid #8EC0FF !important;
}

.Atomic {
  --ys-ui-purple: #8EC0FF !important;
}

div:has(>a#ybarMailLink):hover {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

div:has(>a#ybarMailLink):hover > a#ybarMailLink > svg > path {
  color: #8EC0FF !important;
  fill: #8EC0FF !important;
}

#ybar-l1-more-menu, #ybar-l1-more-menu a[aria-label="Selected edition"] ~ button {
  --yb-selected-item-background: #161719 !important;
  --yb-editions-button: #161719 !important;
}

input[class^="wz"] {
  background: #161719 !important;
  color: #FFF !important;
}

form button[class^="wz"] {
  background-color: #000 !important;
  color: #FFF !important;
}

div[class^="wz"] > table tr td.Ta-c div:not(.Fw-b):last-child:not(:has(>div)):not(.Fw-b > *) {
  color: #000 !important;
}

h4[class^="wz"], h5[class^="wz"] {
  color: #8EC0FF !important;
}

.wz-text-gray-900 {
  color: #FFF !important;
}

div[class^="wz"][role="option"] {
  border: 2px solid #333 !important;
}

div[class^="wz"][role="option"]:hover {
  background: #8EC0FF;
  color: #000 !important;
}

div[class^="wz"][role="option"]:hover div[class^="wz-text"] {
  color: #000 !important;
}

.wz-text-blue-600 {
  color: #8EC0FF !important;
}

.wz-text-gray-600 {
  color: #CCC !important;
}

#tabpanel section[class^="game-log"] table > tbody > tr:hover > td, #tabpanel section[class^="game-log"] table > tbody > tr:hover > td:not(._ys_1j0fbhj) {
  mix-blend-mode: unset !important;
}

.Alert-confirmation > div[class*="visible-alert"] {
  background-color: #161719 !important;
  color: #EEE !important;
  border: 1px solid #333 !important;
}

dialog[name="assistant-gm-modal"] > header {
  background: #333333 !important;
}

dialog[name="assistant-gm-modal"] > header h3 {
  color: #EEE !important;
}

dialog[name="assistant-gm-modal"] > div {
  background: #161719 !important;
}

dialog[name="assistant-gm-modal"] > div span {
  color: #EEE !important;
}

.Tout {
  background-color: #494c5c !important;
  color: #8EC0FF !important;
  border-color: #AAA !important;
}

.Atomic div[class*="Cp($player-headshot-clip-path-large)"] {
  clip-path: none !important;
}

.Atomic div[class*="Bg($header-player-bg)"] {
  background: none !important;
}

.Atomic div[class*="W(220px)"] {
  border: 1px solid #000 !important;
}

.tablewrap, #players-table, table, .players {
  border-radius: 8px !important;
}

.table, div:has(>table) {
  border-radius: 8px !important;
}

table {
  border-collapse: unset !important;
}

.Table td {
  border-bottom-style: none !important;
}

form#ybar-sf div:has(>p) {
  background-color: #8EC0FF !important;
}

button[id="ybar-search"] {
  background-color: #333333 !important;
  border: 1px solid #444 !important;
}

button[id="ybar-search"]:hover {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

.ybar-ytheme-crunch ._yb_10309ej._yb_vo5o9k {
  border: 1px solid #8EC0FF !important;
}

button#ybar-search > svg > path, a#ybarMailLink > svg > path, a#ybar-logo> svg > path[fill^="var(--yb-logo-brand"] {
  fill: #8EC0FF !important;
}

a#ybar-logo> svg > path[fill^="var(--yb-logo-property"] {
  fill: #494c5c !important;
}

button[data-ylk*="navtray-fantasy"] {
  background: #333333 !important;
  background-color: #333333 !important;
  border: 1px solid #444 !important;
  color: #EEE !important;
}

button[data-ylk*="navtray-fantasy"]:hover {
  --ys-special-grey-hover: #494c5c !important;
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
  --ys-button-border-width: 1px !important;
}

div[class^="RailResponsive"] > span[class="Hidden"] {
  color: #c0c0c0 !important;
}

.Page-maincontent:has(.RailResponsive) {
  padding: 0px !important;
  margin-top: -16px !important;
}

section#teamnotes > .teamnotes-content > .Bg-shade > div {
  background-color: #161719 !important;
  border-radius: 8px !important;
  padding: 6px !important;
  color: #eee !important;
  border: 2px solid #444 !important;
}

section#teamnotes > .teamnotes-content > .Bg-shade > div > span {
  font-size: 14px !important;
  color: #8ec0ff !important;
}

section#teamnotes > .teamnotes-content > .Bg-shade {
  border: none !important;
  margin-top: -16px !important;
  margin-bottom: -16px !important;
}

.Atomic .Start\(-35\%\) {
  left: -45% !important;
}

#assistant-gm-impact-details div[class*="Bgc(--ys-ui-shade)"] {
  background: #161719 !important;
}

#assistant-gm-impact-details div[class*="Bgc(--ys-ui-shade)"] span {
  color: #8EC0FF !important;
}

#sit_start_assistant table span, #sit_start_assistant span, #sit_start_assistant div[data-tst*="suggestions-list"] div[data-tst*="input"] input[type="text"], #sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"], #sit_start_assistant table[data-tst*="table"] tbody th[class*="--ys-text-primary"], #sit_start_assistant table[data-tst="standard-stats-table"] tbody > tr > th > div {
  color: #EEE !important;
}

#sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"] {
  border: 1px solid #333 !important;
  border-radius: 16px !important;
  background-color: #161719 !important;
}

#sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"]:hover {
  background-color: #494c5c !important;
  border: 1px solid #AAA !important;
  color: #8EC0FF !important;
}

#sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"] svg path {
  fill: #EEE !important;
}

#sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"] div:hover > svg path {
  fill: #8EC0FF !important;
}

#sit_start_assistant table[data-tst*="table"] {
  border: 1px solid #333 !important;
}

#sit_start_assistant div[class*="--ys-text-secondary"] span {
  color: #c0c0c0 !important;
}

div[data-tst="roster-list"] > div > button:hover, #sit_start_assistant table > tbody > tr:hover {
  background: #494c5c !important;
  border: none !important;
}

div[data-tst="roster-list"] > div > button img {
  border-color: #333 !important;
}

#sit_start_assistant table[data-tst*="table"] tbody tr button div > span, #sit_start_assistant table[data-tst*="table"] tbody tr button > span:last-child, #sit_start_assistant table[data-tst*="table"] tbody tr th button > span:last-child, #sit_start_assistant table[data-tst*="table"] tbody button[data-tst="ra-show-all-expert-ranks"] > span, #sit_start_assistant div[data-tst="rounded-dropdown-stats-wrapper"]:hover {
  color: #8ec0ff !important;
}

button[data-tst*="selected"] div[class*="--ys-ui-blue"] {
  background-color: #8ec0ff !important;
}

#sit_start_assistant div[class*="--ys-ui-base-bg"], #sit_start_assistant table[data-tst*="table"] tbody, #sit_start_assistant div[data-tst*="no-players-selected-view"], #sit_start_assistant table[data-tst*="table"] tbody button {
  background: #000 !important;
}

#sit_start_assistant div[data-tst*="suggestions-list"] div[data-tst*="input"] input[value=""] {
  color: #AAA !important;
}

#sit_start_assistant div[data-tst*="suggestions-list"] div[data-tst*="count"] {
  background-color: #8ec0ff !important;
}

table > tbody > tr[id^="yui_"]:has(>td[style^="font-weight"]) {
  background-color: #333444 !important;
  color: #8EC0FF !important;
}

table > tbody > tr[id^="yui_"]:has(>td[style^="font-weight"]) > td[class^="wz-py-2"]:not(:has(>b)) {
  color: #8EC0FF !important;
}

table > tbody > tr[id^="yui_"] > td[class^="wz-py-2"]:not(:has(>b)) {
  color: #000 !important;
}

table > tbody > tr[id^="yui_"] > td[class^="wz-py-2"][style^="font-weight"]:first-child {
  font-weight: 500 !important;
}

a[data-tst="gamestatus-live"] div:has(>img[loading="lazy"]) > div > div {
  color: #EEE !important;
}

`);