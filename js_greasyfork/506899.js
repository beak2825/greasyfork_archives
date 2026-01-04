// ==UserScript==
// @name              hwmNightMode
// @author            Мифист, Tamozhnya1
// @namespace         Tamozhnya1
// @description       Ночная тема
// @version           13.2
// @include           https://*.heroeswm.ru/*
// @include           https://*.lordswm.com/*
// @exclude           */chat*
// @exclude           */war*
// @exclude           */cgame*
// @exclude           /\/quest_(?!journal)/
// @exclude           /\.(ru|com)\/$/
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/506899/hwmNightMode.user.js
// @updateURL https://update.greasyfork.org/scripts/506899/hwmNightMode.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
const PlayerId = playerIdMatch ? playerIdMatch[1] : "";
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
const isHeartOnPage = (document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile")) ? true : false;
const isMooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

if(!PlayerId) {
    return;
}
const nightStyle = addStyle(`
:root {
  --dark-mode-color-dark: #221E1B;
  --dark-mode-color-light: #c9b087;
  --dark-mode-front-background-color: #1d1d1d;
  --dark-mode-intermediate-background-color: #2d2d2d;
  --dark-mode-row-hover-background-color: #5d4942;
}
    :root {
        overflow-y: auto;
    }
    :root,
    :root > body {
        color: #ccc;
        background-color: #222;
        border-color: #888;
    }
    :root > body * {
        border-color: #888;
    }
    :root, :root > body [data-page="castle"] {
        background-color: transparent !important;
    }
    :root .wbwhite,
    :root .wblight2,
    .s_tab,
    .s_note {
        background-color: var(--dark-mode-front-background-color) !important;
    }
    :root .wblight,
    .s_tab:hover,
    .s_tab_active,
    .s_tab_active:hover {
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    :root a,
    :root td,
    :root .txt {
        color: #ccc;
    }
    button,
    input[type="button"],
    input[type="submit"] {
        cursor: pointer;
    }
    :root input,
    :root button {
        border-color: initial;
    }
    :root button:hover,
    :root input[type="button"]:hover:root input[type="submit"]:hover {
        background-color: #fff;
    }
    :root :disabled {
        color: #666 !important;
        background-color: #bbb !important;
        cursor: default;
    }
    :root b,
    :root h1,
    :root h2,
    :root h3,
    :root h4,
    :root h5,
    :root h6,
    :root strong {
        color: #d0bda6;
    }
    :root font[color] * {
        color: inherit;
    }
    :root a[href],
    :root a[href] > *,
    :root b > a[href] {
        color: var(--dark-mode-color-light);
    }
    :root a[href]:hover,
    :root a[href]:hover *,
    :root a[href]:hover + font[color] {
        color: #da472d !important;
    }
    :root font[color="black"],
    :root font[color="000000"] {
        color: #999;
    }
    :root font[color="gray"],
    :root font[color="#7D7D7D"] {
        color: #999;
    }
    :root font[color="red"],
    :root font[color="#CC1100"],
    :root font[color="ff0000"] {
        color: #d03535;
    }
    :root font[color="green"],
    :root font[color="00ff00"] {
        color: #4f9a68;
    }
    :root font[color="blue"] {
        color: #3171a3;
    }
    :root font[color="purple"] {
        color: #ab3cab;
    }
    font[style$="color:#696156"] {
        color: var(--dark-mode-color-light) !important;
    }
    #main_top_table table[width="970"] {
        background-color: inherit !important;
    }
    #main_top_table,
    /*#main_top_table img,*/
    #main_top_table td[style*="/right_big.jpg"],
    #main_top_table td[style*="/line/lbkg.jpg"],
    #main_top_table td[style*="/bkgbot.jpg"],
    #main_top_table td[style*="/bkgtop.jpg"] {
        -webkit-filter: invert(1) grayscale(1) contrast(1.05);
        filter: invert(1) grayscale(1) contrast(1.05);
    }
.global_table_div table thead td {
  background-color: var(--dark-mode-intermediate-background-color);
}
.s_container {
  background-color: var(--dark-mode-intermediate-background-color);
}
.frac_enemy_block {
    background-color: var(--dark-mode-front-background-color) !important;
}
    #main_top_table td[style*="/t_bot_bkg.jpg"],
    #main_top_table td[style*="/t_top_bkg.jpg"],
    #main_top_table td[width="9"] {
        -webkit-filter: sepia(1) grayscale(0.5);
        filter: sepia(1) grayscale(0.5);
    }
    #main_top_table img.rs,
    #main_top_table img[src$="/res_line_botc.jpg"],
    #main_top_table img[src$="/res_line_topc.jpg"],
    #main_top_table table[width="580"] img {
        -webkit-filter: none;
        filter: none;
    }
    #main_top_table td[style$="/top/bkg2.jpg);"] {
        background-image: none !important;
        background-color: #333 !important;
    }
    #main_top_table td[height="17"] {
        color: #222;
    }
    #main_top_table td[height="26"][width="88"]:nth-child(3) {
        border-right: 2px solid tan;
    }
    #main_top_table td[height="26"][width="88"]:nth-child(5) {
        border-left: 2px solid tan;
    }
    #breadcrumbs a {
        color: #ccc !important;
    }
    #breadcrumbs a[style$="#ff0000;"] > b {
        color: #ea9f2f;
    }
    #breadcrumbs a:hover,
    #breadcrumbs a:hover blink {
        color: var(--dark-mode-color-light) !important;
    }
    #breadcrumbs li.subnav:hover b {
        color: #dadada !important;
    }
    #breadcrumbs hr {
        border: none;
        height: 1px;
        background-color: #999;
    }
    #breadcrumbs blink {
        color: var(--dark-mode-color-light);
    }
    .cre_mon_parent [valign="middle"] {
        color: #eee;
        background: #333 !important;
        outline: 1px solid gray;
    }
    #add_now_count {
        color: var(--dark-mode-color-light);
    }
    tr[bgcolor],
    td[bgcolor] {
        background-color: inherit;
    }
    tr[bgcolor="#ffffff"],
    td[bgcolor="#ffffff"] {
        background-color: #222;
    }
    tr[bgcolor="#eeeeee"],
    td[bgcolor="#eeeeee"],
    hwm_main_forum_tr1 {
        background-color: #272727;
    }
    tr[bgcolor="#dddddd"] {
        background-color: #404040;
    }
    td.wb[bgcolor="#cbc9fb"] {
        background-color: #263c46;
    }
    img[name="imgcode"] {
        -webkit-filter: invert(0.8);
        filter: invert(0.8);
    }
    img[src$="male.gif"] {
        -webkit-filter: invert(0.86);
        filter: invert(0.86);
    }
    img[src$="/horse_gif.gif"],
    img[src$="/star0t.gif"],
    img[src$="/star1t.gif"],
    img[src$="/star12t.gif"],
    img[src$="/speed_hunt.png"],
    img[src$="/galka.jpg"],
    img[src$="/zvezda.png"],
    img[src$="/zvezda_empty.png"],
    img[src$="/blood_rage.jpg"],
    img[src*="/magic/l"],
    img[src*="/pvp_"] {
        -webkit-filter: invert(0.9) sepia(1);
        filter: invert(0.9) sepia(1);
    }
    [data-page="clan_info"] img[src$="line.gif"],
    img[src*="/map/nl"] {
        border-radius: 50%;
    }
    :root .sweet-overlay {
        background-color: rgba(27, 27, 27, 0.6);
    }
    :root .sweet-alert {
        background-color: #444;
        border: 2px solid #777;
        -webkit-user-select: none;
        user-select: none;
    }
    :root .sweet-alert:not(.showSweetAlert) {
        opacity: 0 !important;
    }
    :root .sweet-alert,
    :root .sweet-alert * {
        transition: none;
        animation: none;
    }
    :root .sweet-alert p {
        color: #aaa;
    }
    :root .sweet-alert button {
        background-color: #607d8b !important;
        box-shadow: none !important;
    }
    :root .sweet-alert button.confirm {
        background-color: #795548 !important;
    }
    :root .sweet-alert button:hover {
        -webkit-filter: brightness(120%);
        filter: brightness(120%);
    }
    #lbOverlay,
    #lbCenter,
    #lbBottomContainer {
        z-index: 100;
    }
/* ------------------------------------------- */
/* auction */
    [data-page="auction"] td[bgcolor="#9ADEED"] {
        background-color: #58423a;
    }
    [data-page="auction"] td[bgcolor="#A09CEA"] {
        background-color: #395f61;
    }
/* forum */
    .forum.c_darker * {
        border-color: #888;
    }
    .forum.c_darker tr:not([class]),
    .forum.c_darker tr[class=''],
    .forum.c_darker tr.hwm_main_forum_tr2 {
        background-color: #222;
    }
    .forum.c_darker tr.hwm_main_forum_tr1,
    .forum.c_darker tr.second {
        background-color: #333;
    }
    .forum.c_darker tr:hover {
        background-color: var(--dark-mode-row-hover-background-color) !important;
    }
    .forum.c_darker th {
        background-color: #555;
    }
    .forum.c_darker td {
        color: #ccc !important;
        background-image: none;
        /*outline: 1px solid #444;
        outline-offset: -2px;*/
    }
    .forum.c_darker td[style$="image: none"] {
        outline: none;
    }
    .forum.c_darker tr > td[colspan] {
        background-color: #6d6d6d;
    }
    .forum.c_darker tr.message_footer td {
        color: #888 !important;
        background-color: #333;
        border: none;
    }
    .forum.c_darker td a[href] {
        color: var(--dark-mode-color-light);
    }
    .forum.c_darker a[href^="forum_thread"] > img {
        -webkit-filter: invert(0.9) sepia(0.6);
        filter: invert(0.9) sepia(0.6);
    }
    .forum.c_darker span[style*="background-color: #C1CDCE"] {
        background-color: #444 !important;
    }
    .forum.c_darker font[style*="color:#696156"] {
        color: #aaa !important;
    }
    .forum.c_darker .fsm,
    .forum.c_darker .forumt,
    .forumt {
        color: var(--dark-mode-color-light) !important;
    }
    #nm_txta {
        background-color: #ddd;
    }
    [data-page="forum_thread"] .forum tr:hover {
        background-color: var(--dark-mode-row-hover-background-color) !important;
    }
    [data-page="forum_thread"] .forum a[href]:hover {
        color: #f8be66 !important;
    }
/* roulette */
    [data-page*="roul"] td.wblight {
        background-color: #555;
    }
    [data-page*="roul"] td.wb2 {
        background-color: #795548;
    }
/* tavern */
    td[style*="/taverna_bkg.jpg"],
    td[style*="/taverna_bkg.jpg"] td[class] {
        background-image: none !important;
        border-color: #666;
    }
    td[style*="/taverna_bkg.jpg"] td.tlight {
        background-color: #333;
    }
    td[style*="/taverna_bkg.jpg"] td.twhite {
        background-color: #464646;
    }
/* events */
    .Global [class^="TextBlockContent"] {
        background: url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_lt.png") no-repeat top left, url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_rt.png") no-repeat top right,
            url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_lb.png") no-repeat bottom left, url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_rb.png") no-repeat bottom right,
            url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_t.png") top left repeat-x, url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_b.png") bottom left repeat-x,
            url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_l.png") top left repeat-y, url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_r.png") top right repeat-y;
        background-size: 2.2%, 2.2%, 2.2%, 2.2%, auto, auto, auto, auto, auto;
        background-color: rgba(35, 35, 35, 0.95);
    }
    .Global .cre_mon_image1[style],
    .Global td[width="60"] {
        background-color: #333 !important;
    }
/* naym_event_set */
    [data-page="naym_event_set"] td.wbwhite[width="100%"][align="center"] td[width="60"] {
        background-color: inherit !important;
    }
/* map */
    #jsmap {
        outline: 2px solid #444;
    }
    .no_touch_selection > div:first-child {
        background-image: linear-gradient(to right, transparent, var(--dark-mode-front-background-color), var(--dark-mode-front-background-color)) !important;
    }
    .ohota_block,
    #map_right_block .wbwhite[style^="border"] {
        border-color: inherit !important;
    }
    [data-page="map"] .ntooltiptext {
        color: #333;
        background-color: rgba(255, 255, 255, 0.85);
        border-color: #222 !important;
        box-shadow: 0 0 10px #555;
    }
/* object-info */
    :root .getjob_block {
        color: inherit;
        background-color: #333;
    }
    :root .getjob_capcha {
        filter: invert(0.9);
    }
    :root #code {
        background: #222;
        color: inherit;
        box-shadow: 0 0 3px;
    }
/* army_info */
    .army_info {
        background-color: #333;
        background-image: none;
        background-image: linear-gradient(#555, #111);
    }
    .scroll_content_half {
        color: inherit;
    }
    .scroll_content_half div {
        color: #d6b47d;
    }
    .army_info_skills {
        text-align: left;
    }
    .army_info_skills > div {
        color: #ccc;
    }
    .army_info_skills [id^="skill_name"] {
        color: #bbb;
        transition: none !important;
    }
    .army_info_skills [id^="skill_name"]:hover {
        color: var(--dark-mode-color-light);
    }
    #easyTooltip {
        width: auto;
        min-width: auto;
        max-width: 320px;
        font-size: 0.95em;
        padding: 0.9em;
        color: #ddd;
        border-color: #bbb;
        background-color: #1c1c1c;
        background-image: none;
        text-align: justify;
        opacity: 1 !important;
    }
/* leader_army */
    #army_info_div .bookmark {
        background-color: #736e6c;
        border-color: inherit;
    }
    #army_info_div .bookmark:hover {
        background-color: #a7a7a7;
    }
    #army_info_div .selected_bookmark {
        background-color: #3a3a3a;
    }
    #bookmark-1 > span,
    #army_info_div .info_header_leadershipAmount {
        color: inherit;
    }
    #army_info_div .amount {
        color: #d6b47d;
    }
    #upper_block .content_separator {
        background: #555;
    }
/* skillwheel */
    #skills_table .area_wheelInfoPanels {
        background-image: none;
        background: url("https://dcdn3.heroeswm.ru/i/combat/corner4_lt.png") no-repeat top left, url("https://dcdn3.heroeswm.ru/i/combat/corner4_rt.png") no-repeat top right,
            url("https://dcdn3.heroeswm.ru/i/combat/corner4_lb.png") no-repeat bottom left, url("https://dcdn3.heroeswm.ru/i/combat/corner4_rb.png") no-repeat bottom right,
            url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_t.png") top left repeat-x, url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_b.png") bottom left repeat-x,
            url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_l.png") top left repeat-y, url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_r.png") top right repeat-y;
        background-size: 20px, 20px, 20px, 20px, auto, auto, auto, auto, auto;
        background-color: #353535;
        outline: 1px solid gray;
    }
    #skills_table .info_head3Wheel {
        color: #cca568;
    }
    #skills_table .wheel_abilitiesList {
        color: #e0c497;
    }
    #skills_table .info_head3_2Wheel {
        color: #888;
    }
    #skill_cur_cost {
        color: inherit;
    }
    #win_Loader {
        -webkit-filter: invert(0.9) sepia(0.7);
        filter: invert(0.9) sepia(0.7);
    }
/* arts_for_monsters */
    [data-page="arts_for_monsters"] i {
        color: #caa472;
    }
/* sms */
    img[src$="sms_flag.gif"] {
        -webkit-filter: invert(0.9) sepia(1) grayscale(1);
        filter: invert(0.9) sepia(1) grayscale(1);
    }
    [data-page="sms"] td.wbwhite b {
        color: inherit !important;
    }
    [data-page^="sms_"] td.wbcapt {
        color: #ccc;
        background-color: #444;
    }
    [data-page^="sms"] a[href] > font[color="#5ACE5A"] > b {
        color: #5ace5a !important;
    }
    [data-page="sms"] a[href="sms.php?filter=new"],
    [data-page="sms_clans"] td[align] > a[href^="/sms_"] {
        text-decoration: none;
    }
    [data-page="sms"] [name="data"] {
        color: #ccc;
        background-color: var(--dark-mode-front-background-color);
    }
/* sms_clans */
    [data-page="sms_clans"] td.wbcapt > b {
        color: inherit !important;
    }
/* tour_hist */
    [data-page$="_hist"] [style^="BACKGROUND"] {
        background-color: #333 !important;
    }
    [data-page$="_hist"] [style^="BACKGROUND-COLOR: #d3d1c6"],
    [data-page$="_hist"] [style^="BACKGROUND-COLOR: #F5F3EA"] {
        background-color: #444 !important;
    }
    img[src$="/mtp1.jpg"],
    img[src$="/mtp2.jpg"],
    img[src$="/mtp3.jpg"] {
        -webkit-filter: invert(0.9) sepia(0.5);
        filter: invert(0.9) sepia(0.5);
    }
/* donate */
    [data-page^="hwm_donate"] div[style*="color: #000000"] {
        color: inherit !important;
    }
    [data-page^="hwm_donate"] .pay-sys {
        background-color: #353535;
    }
/* home */
    [data-page="home"] table[width="90%"] b {
        color: #d0bda6;
    }
    [data-page="home"] table[width="90%"] font[color="black"] {
        color: #bbb;
    }
/* script: hwm_time_restore */
    #main_top_table [src$="/dragon__left.jpg"] + div {
        z-index: 2;
    }
    #main_top_table .hwm_tb * {
        color: tan;
    }
    #main_top_table .hwm_tb span {
        color: #59a7ad !important;
    }
    #main_top_table .hwm_tb span[style$="rgb(255, 0, 0);"] {
        color: #ff9800 !important;
    }
    #main_top_table .hwm_tb img {
        -webkit-filter: none;
        filter: none;
    }
    #main_top_table .hwm_tb td[width="5"] > img {
        visibility: visible;
    }
    #main_top_table .hwm_tb a:hover {
        color: #ccc !important;
    }
    #bgCenter {
        background-color: #333 !important;
    }
/* script: SetsMaster */
    #main_top_table div[id^="menuSetsTab"] {
        color: tan !important;
        border-color: tan;
    }
    #main_top_table div[id^="menuSetsTab"] * {
        color: inherit !important;
    }
    #main_top_table div[id^="menuSetsTab"] li:hover {
        color: #ccc !important;
    }
    #main_top_table div[id^="menuSetsTab"] b[style$="rgb(0, 255, 0);"] {
        color: #76c5cc !important;
    }
    [data-page="army"] center:nth-of-type(2) table {
        background-color: #555;
        border: 1px solid;
        border-collapse: initial !important;
    }
/* ========================= */
/* inventory */
    [data-page="inventory"] .art_durability_hidden {
        display: block !important;
        opacity: 1 !important;
    }
    [data-page="inventory"] .hwm_hint_css {
        color: #222;
        background: #eee;
        border: 2px solid #888 !important;
        z-index: 100;
    }
    :root .container_block {
        color: #eee;
        background-color: #333;
        box-shadow: inset 0 0 0 1px #c2b4a3;
    }
    :root .filter_tab {
        background-color: #fff;
        -webkit-filter: invert(0.9) grayscale(0.6);
        filter: invert(0.9) grayscale(0.6);
    }
    :root .filter_tab_active {
        background-color: #ddd;
    }
    :root .inv_scroll_content {
        color: #eee;
        background-color: #222;
        border: 1px solid;
    }
    :root .inv_scroll_content_expand_sign {
        -webkit-filter: invert(0.9);
        filter: invert(0.9);
    }
    :root .inv_note_kukla {
        background-color: transparent;
        box-shadow: none;
    }
    :root #inv_expandedBlock {
        margin-top: 0.4em;
    }
    :root .btn_standard:not(.btn_disabled) {
        color: #222;
        background-color: #ddd;
        text-shadow: none;
    }
    :root .btn_on_edit {
        background-color: #fff !important;
    }
    :root #inv_menu {
        padding: 0.4em;
        background-color: rgba(225, 225, 225, 0.9);
        z-index: 10;
    }
    :root #inv_menu,
    :root .inv_item_info font {
        color: #222;
    }
    :root .inv_item_select_img[cat],
    .spoiler,
    .news-head__switch,
    .clan-style,
    .shadowedText,
    #pl_info_parts_open_img,
    font[style^="color"],
    .home_scroll_content div,
    .home_scroll_content_expand_sign {
        -webkit-filter: invert(0.8) grayscale(0.6);
        filter: invert(0.8) grayscale(0.6);
    }
    .smithTable, .battle_row {
        filter: invert(0.8) grayscale(0.6);
        color: var(--dark-mode-color-dark) !important;
    }
    .smithTable td,
    .smithTable a[href],
    .battle_row a,
    .battle_row b,
    .script-settings-panel,
    .script-settings-panel td,
    .script-settings-panel b,
    .script-settings-panel a {
        color: var(--dark-mode-color-dark) !important;
    }
    [style*='background-color: rgb'] {
        filter: invert(0.8) grayscale(0.6);
        color: var(--dark-mode-color-dark) !important;
    }
    :root #inv_menu a,
    :root #inv_menu a > * {
        color: #ae5650;
    }
    :root .inventory_item_div_wide {
        background-color: #444;
    }
    .home_container_block {
        background-color: var(--dark-mode-front-background-color);
        border-color: var(--dark-mode-color-light) !important;
    }
    .s_art, .newspaper-panel, .map_hunt_soon, .tj_block {
        color: var(--dark-mode-color-light) !important;
        background-color: var(--dark-mode-front-background-color) !important;
    }
    .newspaper-resources {
        color: var(--dark-mode-color-light) !important;
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    .global_container_block {
        color: var(--dark-mode-color-light) !important;
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    tr[style='background-color: white'] {
        background: var(--dark-mode-intermediate-background-color) !important;
    }
    .home_button2,
    :root .btn_standard:not(.btn_disabled),
    .inv_text_kukla_btn,
    .job_fl_btn,
    .s_art_btn,
    .s_art_btn_small {
        color: var(--dark-mode-color-light) !important;
        background: var(--dark-mode-intermediate-background-color) !important;
    }
    .home_button2>img, img[src*='btn_expand.svg'] {
        filter: invert(0.8) grayscale(0.6);
    }
    .home_note {
        color: var(--dark-mode-color-light);
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    .s_tab_nav a:not(:first-child) {
        background-color: var(--dark-mode-front-background-color) !important;
    }
    .s_tab_nav_active {
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    .inv_note_kukla, .wrapper {
        color: var(--dark-mode-color-light) !important;
    }
    #mapMoving {
        background: linear-gradient(0.15turn, #213c48, #5b843c, #73685c 80%) !important;
    }
    .map_obj_table_div_gray {
        background-color: #201c1c !important;
    }
    .global_container_block_header {
        background-color: #201f1e;
    }
    .map_obj_head {
        background-color: #5b5954 !important;
    }
    .global_table_div table tbody tr:nth-of-type(2n+1) {
        background-color: #201c1c;
    }
    .global_table_div table tbody tr:nth-of-type(2n) {
        background-color: #201c1c;
    }
    .hwm_recruit_ramka {
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    .hwm_recruit_unit_name {
        color: var(--dark-mode-color-light) !important;
    }
    .hwm_param_content_half div {
        color: var(--dark-mode-color-light) !important;
    }
    
    .hwm_leader_bookmark_top, .hwm_recruit_bookmark_top, .hwm_leader_bookmark {
        background-color: var(--dark-mode-front-background-color) !important;
    }
    .hwm_leader_bookmark_top span,
    .hwm_recruit_bookmark_top span,
    .newspaper-title-row {
        color: var(--dark-mode-color-light) !important;
    }
    .hwm_leader_nabory div:hover {
        background-color: #3d3d3d !important;
    }
    .hwm_selected_bookmark_no_action,
    :root .hwm_selected_bookmark,
    :root .hwm_leader_selected_bookmark,
    .home_inside_margins2 div:hover,
    .newspaper-title-item-active {
        background-color: var(--dark-mode-intermediate-background-color) !important;
    }
    .hwm_selected_bookmark_no_action span {
        color: #ccc !important;
    }
    .hwm_recruit_nabory div:hover {
        background-color: #3d3d3d !important;
    }
    :root .hwm_selected_bookmark span {
        color: #ccc !important;
    }
    .hwm_leader_bookmarks div:hover {
        background-color: #3d3d3d !important;
    }
    .hwm_pagination a.active {
        background: var(--dark-mode-intermediate-background-color) !important;
        border-color: #888 !important;
        border: 2px solid rgba(0, 0, 0, 0.6);
        margin-top: -1;
        margin-left: -1;
        margin-right: 0;
        margin-bottom: 1px;
    }
    .hwm_pagination a {
        background: var(--dark-mode-front-background-color) !important;
    }
    .inv_note {
        background-color: var(--dark-mode-front-background-color) !important;
    }
}`);

main();
function main() {
    addStyle(`
:root {
    overflow-y: auto;
}
:root > body {
    overflow-y: visible;
}
#night_mode_switcher {
    width: 22px;
    height: 22px;
    position: fixed;
    right: 10px;
    bottom: 10px;
    margin: 0;
    padding: 4px;
    outline: none;
    border: 1px solid #888;
    background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QCmRXhpZgAASUkqAAgAAAADAA4BAgBcAAAAMgAAABoBBQABAAAAjgAAABsBBQABAAAAlgAAAAAAAABZaW4gWWFuZyBzeW1ib2wgaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kLiBIYXJtb255IGFuZCBiYWxhbmNlIGljb24gd2l0aCByaWdodCBwcm9wb3J0aW9ucywBAAABAAAALAEAAAEAAAD/4QXNaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcyIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjE0MDMwNDcxMDYiIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+RmxhbWV0cmljPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5ZaW4gWWFuZyBzeW1ib2wgaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kLiBIYXJtb255IGFuZCBiYWxhbmNlIGljb24gd2l0aCByaWdodCBwcm9wb3J0aW9uczwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5pc3RvY2twaG90by5jb20vcGhvdG8vbGljZW5zZS1nbTE0MDMwNDcxMDYtP3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsPC9wbHVzOkxpY2Vuc29yVVJMPjwvcmRmOmxpPjwvcmRmOlNlcT48L3BsdXM6TGljZW5zb3I+CgkJPC9yZGY6RGVzY3JpcHRpb24+Cgk8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJ3Ij8+Cv/tAJxQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAgBwCUAAJRmxhbWV0cmljHAJ4AFxZaW4gWWFuZyBzeW1ib2wgaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kLiBIYXJtb255IGFuZCBiYWxhbmNlIGljb24gd2l0aCBy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");
    background-size: cover;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    opacity: .9;
    transition: transform .3s;
}
.night_mode_switched {
    transform: rotate(180deg);
}
#night_mode_switcher:hover {
    opacity: 1;
}
[data-page="frames"]#night_mode_switcher {
    display: none;
}
.inventory_item_broken ~ div .cre_mon_image2 {
    background-color: rgb(255, 17, 0, 0.3);
}
.inventory_item_in_rent ~ div .cre_mon_image2 {
    background-color: rgba(113, 196, 223, 0.3);
}
`);
    document.documentElement.setAttribute('data-page', location.pathname.slice(1).replace(/\.(php|html)$/, ''));

    const switcher = addElement("div", { id: "night_mode_switcher" }, document.body);
    switcher.hidden = getPlayerBool("nightModeSwitcherHidden");
    switcher.addEventListener("click", function() { setPlayerValue("nightMode", !getPlayerBool("nightMode")); toggleNightMode(); });

    toggleNightMode();
    drawSettings();
}
function toggleNightMode() {
    const nightMode = getPlayerBool("nightMode");
    const switcher = document.getElementById("night_mode_switcher");
    switcher.classList.toggle("night_mode_switched", nightMode);
    switcher.title = isEn ? (nightMode ? "Disable night mode" : "Enable night mode") : (nightMode ? "Выключить ночную тему" : "Включить ночную тему");
    nightStyle.disabled = !nightMode;
}
function drawSettings() {
    if(location.pathname == '/pers_settings.php') {
        const search = document.querySelector('td.wbwhite[colspan="2"]').parentNode;
        search.insertAdjacentHTML("beforebegin", `
<tr>
    <td class=wblight colspan=2>
        &nbsp;<b>${isEn ? "Night mode settings" : "Ночная тема: настройки"}</b>
    </td>
</tr>
<tr>
    <td class=wbwhite style="width: 35%;">
        &nbsp;${isEn ? 'Hide switcher' : 'Скрывать кнопку-переключатель'}
    </td>
    <td class=wbwhite align=left>
        &nbsp;<input id=btnHiddenCheckbox type=checkbox />
    </td>
</tr>`);
        document.getElementById("btnHiddenCheckbox").checked = getPlayerBool("nightModeSwitcherHidden");
        document.getElementById("btnHiddenCheckbox").addEventListener("change", function() { setPlayerValue("nightModeSwitcherHidden", this.checked); switcher.hidden = this.checked; });
    }
}
function parseNode(html) {
    const div = addElement('div', { innerHTML: html });
    return div.firstChild.cloneNode(true);
}
// Array and object
function groupBy(list, keyFieldOrSelector) { return list.reduce(function(t, item) { const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector]; (t[keyValue] = t[keyValue] || []).push(item); return t; }, {}); };
function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }
function findKey(obj, selector) { return Object.keys(obj).find(selector); }
function pushNew(array, newValue) { if(array.indexOf(newValue) == -1) { array.push(newValue); } }
function sortBy(field, reverse, evaluator) {
    const key = evaluator ? function(x) { return evaluator(x[field]); } : function(x) { return x[field]; };
    return function(a, b) { return a = key(a), b = key(b), (reverse ? -1 : 1) * ((a > b) - (b > a)); }
}
// HttpRequests
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.responseType = type;

          xhr.onload = () => {
            if (xhr.status === 200) return resolve(xhr.response);
            throwError(`Error with status ${xhr.status}`);
          };

          xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

          xhr.send(body);

          function throwError(msg) {
            const err = new Error(msg);
            err.status = xhr.status;
            reject(err);
          }
    });
}
// Storage
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function setOrDeleteNumberValue(key, value) {
    if(!value || value == "" || isNaN(Number(value))) {
        deleteValue(key);
    } else {
        setValue(key, value);
    }
}
function setOrDeleteNumberPlayerValue(key, value) { setOrDeleteNumberValue(key + PlayerId, value); }
function getStorageKeys(filter) { return listValues().filter(filter); }
// Html DOM
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { return addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findChildrenTextContainsValue(selector, value) { return Array.from(document.querySelectorAll(selector)).reduce((t, x) => { const match = Array.from(x.childNodes).filter(y => y.nodeName == "#text" && y.textContent.includes(value)); return [...t, ...match]; }, []); }
// Popup panel
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
// Script autor and url
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
// Server time
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function toServerTime(clientTime) { return clientTime -  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function toClientTime(serverTime) { return serverTime +  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function truncToFiveMinutes(time) { return Math.floor(time / 300000) * 300000; }
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 6 * 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское // Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
// Misc
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function showBigData(data) { console.log(data); /*addElement("TEXTAREA", { innerText: data }, document.body);*/ }
function round0(value) { return Math.round(value * 10) / 10; }
function round00(value) { return Math.round(value * 100) / 100; }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}
// UpdatePanels
// Если используется url, то это должна быть та же локация с другими параметрами
async function refreshUpdatePanels(panelSelectors, postProcessor, url = location.href) {
    panelSelectors = Array.isArray(panelSelectors) ? panelSelectors : [panelSelectors];
    let freshDocument;
    for(const panelSelector of panelSelectors) {
        const updatePanel = panelSelector(document);
        //console.log(panelSelector.toString())
        //console.log(updatePanel)
        if(updatePanel) {
            freshDocument = freshDocument || await getRequest(url);
            const freshUpdatePanel = panelSelector(freshDocument);
            if(!freshUpdatePanel) {
                console.log(updatePanel)
                continue;
            }
            if(postProcessor) {
                postProcessor(freshUpdatePanel);
            }
            updatePanel.innerHTML = freshUpdatePanel.innerHTML;
            Array.from(updatePanel.querySelectorAll("script")).forEach(x => {
                x.insertAdjacentElement("afterend", addElement("script", { innerHTML: x.innerHTML })); // Передобавляем скрипты, как элементы, что они сработали
                x.remove();
            });
        }
    }
    if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
    return freshDocument;
}
