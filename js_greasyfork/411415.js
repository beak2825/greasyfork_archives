// ==UserScript==
// @name              night_mode
// @author            Мифист
// @namespace         Мифист
// @description       Ночная тема
// @homepage          https://greasyfork.org/ru/users/687755-мифист
// @icon              https://i.ibb.co/hCpwbP0/yan.png
// @version           11.0
// @encoding          utf-8
// @include           https://*heroeswm.ru/*
// @include           https://*lordswm.com/*
// @include           http://*178.248.235.15/*
// @exclude           */chat*
// @exclude           */war*
// @exclude           */cgame*
// @exclude           /\/quest_(?!journal)/
// @exclude           /\.(ru|com)\/$/
// @run-at            document-start
// @grant             none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/411415/night_mode.user.js
// @updateURL https://update.greasyfork.org/scripts/411415/night_mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var $ = (function(reg) {function fn(e, c) {if (e.nodeType) return e;if (!c && e[0] === '#' && !reg.test(e)) return document.getElementById(e.slice(1));if (c && typeof c === 'string') c = fn(c);return (c === null) ? c : (c || document).querySelector(e);}function extend(target, source) {for (var key in source) {target[key] = source[key];}return target;}return extend(fn, {toArray: function(a) {var res = [], i = 0;for (; i < a.length; res.push(a[i++]));return res;},parseNode: function(html, callback) {var div = document.createElement('div'); div.innerHTML = html; div = div.firstChild.cloneNode(!0); callback && callback(div); return div;},index: function(e) {return fn.toArray(e.parentNode.children).indexOf(e);},rnd: function(n) {return Math.random() * n >> 0;},extend: extend});})(/[\s.,:>+~\[]/);
  var $$ = function(s, c) {c = c && $(c);return (c === null) ? [] : $.toArray((c || document).querySelectorAll(s));};

  if (!Element.prototype.remove) Element.prototype.remove = function() {
    this.parentNode && this.parentNode.removeChild(this);
  };

  var ver = '11.0';
  var key = 'nightMode';
  var userDataKey = 'nightModeUserData';
  var css = {
    main: $.parseNode('<style>:root {overflow-y: auto;}:root, :root > body {color: #ccc;background-color: #222;border-color: #888;}:root > body * {border-color: #888;}:root .wbwhite,:root .wblight2 {background-color: #1d1d1d;}:root .wblight {background-color: #2d2d2d;}:root a,:root td,:root .txt {color: #ccc;}button,input[type="button"],input[type="submit"] {cursor: pointer;}:root input,:root button {border-color: initial;}:root button:hover,:root input[type="button"]:hover:root input[type="submit"]:hover {background-color: #fff;}:root :disabled {color: #666 !important;background-color: #bbb !important;cursor: default;}:root b,:root h1,:root h2,:root h3,:root h4,:root h5,:root h6,:root strong {color: #d0bda6;}:root font[color] * {color: inherit;}:root a[href],:root a[href] > *,:root b > a[href] {color: #c9b087;}:root a[href]:hover,:root a[href]:hover *,:root a[href]:hover + font[color] {color: #da472d !important;}:root font[color="black"],:root font[color="000000"] {color: #999;}:root font[color="gray"],:root font[color="#7D7D7D"] {color: #999;}:root font[color="red"],:root font[color="#CC1100"],:root font[color="ff0000"] {color: #d03535;}:root font[color="green"],:root font[color="00ff00"] {color: #4f9a68;}:root font[color="blue"] {color: #3171a3;}:root font[color="purple"] {color: #ab3cab;}font[style$="color:#696156"] {color: #c9b087 !important;}#main_top_table table[width="970"] {background-color: inherit !important;}#main_top_table img,#main_top_table td[style*="/right_big.jpg"],#main_top_table td[style*="/line/lbkg.jpg"],#main_top_table td[style*="/bkgbot.jpg"],#main_top_table td[style*="/bkgtop.jpg"] {-webkit-filter: invert(1) grayscale(1) contrast(1.05);filter: invert(1) grayscale(1) contrast(1.05);}#main_top_table td[style*="/t_bot_bkg.jpg"],#main_top_table td[style*="/t_top_bkg.jpg"],#main_top_table td[width="9"] {-webkit-filter: sepia(1) grayscale(.5);filter: sepia(1) grayscale(.5);}#main_top_table img.rs,#main_top_table img[src$="/res_line_botc.jpg"],#main_top_table img[src$="/res_line_topc.jpg"],#main_top_table table[width="580"] img {-webkit-filter: none;filter: none;}#main_top_table td[style$="/top/bkg2.jpg);"] {background-image: none !important;background-color: #333 !important;}#main_top_table td[height="17"] {color: #222;}#main_top_table td[height="26"][width="88"]:nth-child(3) {border-right: 2px solid tan;}#main_top_table td[height="26"][width="88"]:nth-child(5) {border-left: 2px solid tan;}#breadcrumbs a {color: #ccc !important;}#breadcrumbs a[style$="#ff0000;"] > b {color: #ea9f2f;}#breadcrumbs a:hover,#breadcrumbs a:hover blink {color: #c9b087 !important;}#breadcrumbs li.subnav:hover b {color: #dadada !important;}#breadcrumbs hr {border: none;height: 1px;background-color: #999;}#breadcrumbs blink {color: #c9b087;}.cre_mon_parent [valign="middle"] {color: #eee;background: #333 !important;outline: 1px solid gray;}#add_now_count {color: #c9b087;}tr[bgcolor],td[bgcolor] {background-color: inherit;}tr[bgcolor="#ffffff"],td[bgcolor="#ffffff"] {background-color: #222;}tr[bgcolor="#eeeeee"],td[bgcolor="#eeeeee"] {background-color: #272727;}tr[bgcolor="#dddddd"] {background-color: #404040;}td.wb[bgcolor="#cbc9fb"] {background-color: #263c46;}img[name="imgcode"] {-webkit-filter: invert(.8);filter: invert(.8);}img[src$="male.gif"] {-webkit-filter: invert(.86);filter: invert(.86);}img[src$="/horse_gif.gif"],img[src$="/star0t.gif"],img[src$="/star1t.gif"],img[src$="/star12t.gif"],img[src$="/speed_hunt.png"],img[src$="/galka.jpg"],img[src$="/zvezda.png"],img[src$="/zvezda_empty.png"],img[src$="/blood_rage.jpg"],img[src*="/magic/l"],img[src*="/pvp_"] {-webkit-filter: invert(.9) sepia(1);filter: invert(.9) sepia(1);}[data-page="clan_info"] img[src$="line.gif"],img[src*="/map/nl"] {border-radius: 50%;}:root .sweet-overlay {background-color: rgba(27, 27, 27, 0.6);}:root .sweet-alert {background-color: #444;border: 2px solid #777;-webkit-user-select: none;user-select: none;}:root .sweet-alert:not(.showSweetAlert) {opacity: 0 !important;}:root .sweet-alert,:root .sweet-alert * {transition: none;animation: none;}:root .sweet-alert p {color: #aaa;}:root .sweet-alert button {background-color: #607D8B !important;box-shadow: none !important;}:root .sweet-alert button.confirm {background-color: #795548 !important;}:root .sweet-alert button:hover {-webkit-filter: brightness(120%);filter: brightness(120%);}#lbOverlay, #lbCenter, #lbBottomContainer {z-index: 100;}/* ------------------------------------------- *//* auction */[data-page="auction"] td[bgcolor="#9ADEED"] {background-color: #58423a;}[data-page="auction"] td[bgcolor="#A09CEA"] {background-color: #395f61;}/* forum */.forum.c_darker * {border-color: #888;}.forum.c_darker tr {background-color: #222;}.forum.c_darker tr > td[bgcolor="#F5F3EA"],.forum.c_darker tr.second {background-color: #333;}.forum.c_darker th {background-color: #555;}.forum.c_darker td {color: #ccc !important;background-image: none;outline: 1px solid #444;outline-offset: -2px;}.forum.c_darker td[style$="image: none"] {outline: none;}.forum.c_darker tr > td[colspan] {background-color: #6d6d6d;}.forum.c_darker tr.message_footer td {color: #888 !important;background-color: #333;border: none;}.forum.c_darker td a[href] {color: #c9b087;}.forum.c_darker a[href^="forum_thread"] > img {-webkit-filter: invert(.9) sepia(.6);filter: invert(.9) sepia(.6);}.forum.c_darker span[style*="background-color: #C1CDCE"] {background-color: #444 !important;}.forum.c_darker font[style*="color:#696156"] {color: #aaa !important;}.forum.c_darker .fsm,.forum.c_darker .forumt {color: inherit;}#nm_txta {background-color: #ddd;}[data-page="forum_thread"] .forum tr:hover {background-color: #5d4942 !important;}[data-page="forum_thread"] .forum a[href]:hover {color: #f8be66 !important;}/* roulette */[data-page*="roul"] td.wblight {background-color: #555;}[data-page*="roul"] td.wb2 {background-color: #795548;}/* tavern */td[style*="/taverna_bkg.jpg"],td[style*="/taverna_bkg.jpg"] td[class] {background-image: none !important;border-color: #666;}td[style*="/taverna_bkg.jpg"] td.tlight {background-color: #333;}td[style*="/taverna_bkg.jpg"] td.twhite {background-color: #464646;}/* events */.Global [class^="TextBlockContent"] {background:url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_lt.png") no-repeat top left,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_rt.png") no-repeat top right,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_lb.png") no-repeat bottom left,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/corner4_rb.png") no-repeat bottom right,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_t.png") top left repeat-x,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_b.png") bottom left repeat-x,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_l.png") top left repeat-y,url("https://dcdn3.heroeswm.ru/i/naym_event_rogues/winChatDesktop_border_r.png") top right repeat-y;background-size: 2.2%, 2.2%, 2.2%, 2.2%, auto, auto, auto, auto, auto;background-color: rgba(35, 35, 35, 0.95);}.Global .cre_mon_image1[style],.Global td[width="60"] {background-color: #333 !important;}/* naym_event_set */[data-page="naym_event_set"] td.wbwhite[width="100%"][align="center"] td[width="60"] {background-color: inherit !important;}/* map */#jsmap {outline: 2px solid #444;}.no_touch_selection > div:first-child {background-image: linear-gradient(to right, transparent, #1d1d1d, #1d1d1d) !important;}.ohota_block,#map_right_block .wbwhite[style^="border"] {border-color: inherit !important;}[data-page="map"] .ntooltiptext {color: #333;background-color: rgba(255, 255, 255, .85);border-color: #222 !important;box-shadow: 0 0 10px #555;}/* object-info */:root .getjob_block {color: inherit;background-color: #333;}:root .getjob_capcha {filter: invert(.9);}:root #code {background: #222;color: inherit;box-shadow: 0 0 3px;}/* army_info */.army_info {background-color: #333;background-image: none;background-image: linear-gradient(#555, #111);}.scroll_content_half {color: inherit;}.scroll_content_half div {color: #d6b47d;}.army_info_skills {text-align: left;}.army_info_skills > div {color: #ccc;}.army_info_skills [id^="skill_name"] {color: #bbb;transition: none !important;}.army_info_skills [id^="skill_name"]:hover {color: #c9b087;}#easyTooltip {width: auto;min-width: auto;max-width: 320px;font-size: .95em;padding: .9em;color: #ddd;border-color: #bbb;background-color: #1c1c1c;background-image: none;text-align: justify;opacity: 1 !important;}/* leader_army */#army_info_div .bookmark {background-color: #736e6c;border-color: inherit;}#army_info_div .bookmark:hover {background-color: #a7a7a7;}#army_info_div .selected_bookmark {background-color: #3a3a3a;}#bookmark-1 > span,#army_info_div .info_header_leadershipAmount {color: inherit;}#army_info_div .amount {color: #d6b47d;}#upper_block .content_separator {background: #555;}/* skillwheel */#skills_table .area_wheelInfoPanels {background-image: none;background:url("https://dcdn3.heroeswm.ru/i/combat/corner4_lt.png") no-repeat top left,url("https://dcdn3.heroeswm.ru/i/combat/corner4_rt.png") no-repeat top right,url("https://dcdn3.heroeswm.ru/i/combat/corner4_lb.png") no-repeat bottom left,url("https://dcdn3.heroeswm.ru/i/combat/corner4_rb.png") no-repeat bottom right,url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_t.png") top left repeat-x,url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_b.png") bottom left repeat-x,url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_l.png") top left repeat-y,url("https://dcdn3.heroeswm.ru/i/combat/winChatDesktop_border_r.png") top right repeat-y;background-size: 20px, 20px, 20px, 20px, auto, auto, auto, auto, auto;background-color: #353535;outline: 1px solid gray;}#skills_table .info_head3Wheel {color: #cca568;}#skills_table .wheel_abilitiesList {color: #e0c497;}#skills_table .info_head3_2Wheel {color: #888;}#skill_cur_cost {color: inherit;}#win_Loader {-webkit-filter: invert(.9) sepia(.7);filter: invert(.9) sepia(.7);}/* arts_for_monsters */[data-page="arts_for_monsters"] i {color: #caa472;}/* sms */img[src$="sms_flag.gif"] {-webkit-filter: invert(.9) sepia(1) grayscale(1);filter: invert(.9) sepia(1) grayscale(1);}[data-page="sms"] td.wbwhite b {color: inherit !important;}[data-page^="sms_"] td.wbcapt {color: #ccc;background-color: #444;}[data-page^="sms"] a[href] > font[color="#5ACE5A"] > b {color: #5ace5a !important;}[data-page="sms"] a[href="sms.php?filter=new"],[data-page="sms_clans"] td[align] > a[href^="/sms_"] {text-decoration: none;}[data-page="sms"] [name="data"] {color: #ccc;background-color: #1d1d1d;}/* sms_clans */[data-page="sms_clans"] td.wbcapt > b {color: inherit !important;}/* tour_hist */[data-page$="_hist"] [style^="BACKGROUND"] {background-color: #333 !important;}[data-page$="_hist"] [style^="BACKGROUND-COLOR: #d3d1c6"],[data-page$="_hist"] [style^="BACKGROUND-COLOR: #F5F3EA"] {background-color: #444 !important;}img[src$="/mtp1.jpg"],img[src$="/mtp2.jpg"],img[src$="/mtp3.jpg"] {-webkit-filter: invert(.9) sepia(.5);filter: invert(.9) sepia(.5);}/* donate */[data-page^="hwm_donate"] div[style*="color: #000000"] {color: inherit !important;}[data-page^="hwm_donate"] .pay-sys {background-color: #353535;}/* home */[data-page="home"] table[width="90%"] b {color: #d0bda6;}[data-page="home"] table[width="90%"] font[color="black"] {color: #bbb;}/* script: hwm_time_restore */#main_top_table [src$="/dragon__left.jpg"] + div {z-index: 2;}#main_top_table .hwm_tb * {color: tan;}#main_top_table .hwm_tb span {color: #59a7ad !important;}#main_top_table .hwm_tb span[style$="rgb(255, 0, 0);"] {color: #FF9800 !important;}#main_top_table .hwm_tb img {-webkit-filter: none;filter: none;}#main_top_table .hwm_tb td[width="5"] > img {visibility: visible;}#main_top_table .hwm_tb a:hover {color: #ccc !important;}#bgCenter {background-color: #333 !important;}/* script: SetsMaster */#main_top_table div[id^="menuSetsTab"] {color: tan !important;border-color: tan;}#main_top_table div[id^="menuSetsTab"] * {color: inherit !important;}#main_top_table div[id^="menuSetsTab"] li:hover {color: #ccc !important;}#main_top_table div[id^="menuSetsTab"] b[style$="rgb(0, 255, 0);"] {color: #76c5cc !important;}[data-page="army"] center:nth-of-type(2) table {background-color: #555;border: 1px solid;border-collapse: initial !important;}/* ========================= *//* inventory */[data-page="inventory"] .art_durability_hidden {display: block !important;opacity: 1 !important;}[data-page="inventory"] .hwm_hint_css {color: #222;background: #eee;border: 2px solid #888 !important;z-index: 100;}:root .container_block {color: #eee;background-color: #333;box-shadow: inset 0 0 0 1px #c2b4a3;}:root .filter_tab {background-color: #fff;-webkit-filter: invert(.9) grayscale(.6);filter: invert(.9) grayscale(.6);}:root .filter_tab_active {background-color: #ddd;}:root .inv_scroll_content {color: #eee;background-color: #222;border: 1px solid;}:root .inv_scroll_content_expand_sign {-webkit-filter: invert(.9);filter: invert(.9);}:root .inv_note_kukla {background-color: transparent;box-shadow: none;}:root #inv_expandedBlock {margin-top: .4em;}:root .btn_standard:not(.btn_disabled) {color: #222;background-color: #ddd;text-shadow: none;}:root .btn_on_edit {background-color: #fff !important;}:root #inv_menu {padding: .4em;background-color: rgba(225,225,225,.9);z-index: 10;}:root #inv_menu,:root .inv_item_info font {color: #222;}:root .inv_item_select_img[cat] {-webkit-filter: invert(.8) grayscale(.6);filter: invert(.8) grayscale(.6);}:root #inv_menu a,:root #inv_menu a > * {color: #ae5650;}:root .inventory_item_div_wide {background-color: #444;}.inventory_item_in_rent ~ div .cre_mon_image2 {background-color: rgba(113, 196, 223, .3);}.inventory_item_broken ~ div .cre_mon_image2 {background-color: rgb(255, 17, 0, .3);}</style>'),
    headerColored: $.parseNode('<style>#main_top_table b,#main_top_table table.hwm_tb * {color: #ffd875;}#main_top_table div[id^="menuSetsTab"] {color: #ffd875 !important;}#main_top_table td[width="88"] {border-width: 0 !important;}#main_top_table td[height="17"] {color: #ccc;}#main_top_table img,#main_top_table td {-webkit-filter: none !important;filter: none !important;}#main_top_table img[src$="_topll_80.jpg"],#main_top_table img[src$="_topr2_80.jpg"] {content: url("https://i.ibb.co/frf905t/res-line-topll-80.png");}#main_top_table img[src$="_top0.jpg"],#main_top_table img[src$="_toprr.jpg"] {content: url("https://i.ibb.co/T8pgh0r/res-line-top0.png");}#main_top_table img[src$="logot.jpg"] {content: url("https://i.ibb.co/nsWmc8k/logot.png");}#main_top_table td[style$="/right_big.jpg);"] {background-image: url("https://i.ibb.co/9hK2xrd/right-big.png") !important;}#main_top_table td[style*="/lbkg.jpg"] {background-image: url("https://i.ibb.co/b5q3Dwj/lbkg.png") !important;}#main_top_table img[src*="dragon"] {content: url("https://i.ibb.co/wgLHkFj/dragon-left.png");}#main_top_table img[src$="/left_big0_56.jpg"] {content: url("https://i.ibb.co/y69yYWQ/left-big0-56.png");}#main_top_table img[src$="/left_big2_92.jpg"] {content: url("https://i.ibb.co/xm7g9sD/left-big2-92.png");}#main_top_table img[src$="dec_88.jpg"] {content: url("https://i.ibb.co/gVJb89v/ldec-88.png");}#main_top_table img[src$="part.jpg"] {content: url("https://i.ibb.co/p4zM1ym/lpart.png");}#main_top_table img[src$="32_39.jpg"] {content: url("https://i.ibb.co/sgTGdSb/h-top-32-39.png");}#main_top_table img[src$="32_10.jpg"] {content: url("https://i.ibb.co/GdGQsWm/h-top-32-10.png");}#main_top_table img[src*="_bot"][src$="_80.jpg"] {content: url("https://i.ibb.co/mFwH3rS/res-line-botl-80.jpg");}#main_top_table img[src$="t_end.jpg"] {content: url("https://i.ibb.co/n650yBY/t-end.png");}#main_top_table img[src$="_bot0.jpg"],#main_top_table img[src$="_botrr.jpg"] {content: url("https://i.ibb.co/Dfdj0gZ/res-line-bot0.png");}#main_top_table td[style$="/bkgtop.jpg);"] {position: relative;background-image: url("https://i.ibb.co/rc0qfLf/res-line-topc.png") !important;}#main_top_table td[style$="/bkgtop.jpg);"]:before {content: "";width: 100%;height: 2px;position: absolute;background-color: #222;}#main_top_table img[src$="topr2_80.jpg"],#main_top_table img[src$="botr_80.jpg"],#main_top_table img[src$="rdec_88.jpg"],#main_top_table img[src$="rpart.jpg"],#main_top_table img[src$="line_32_39.jpg"],#main_top_table img[src$="right_36.jpg"] {-o-transform: scaleX(-1);-moz-transform: scaleX(-1);-webkit-transform: scaleX(-1);transform: scaleX(-1);}</style>'),
    switcher: $.parseNode('<style>#night_mode_switcher {width: 22px;height: 22px;position: fixed;right: 10px; bottom: 10px;margin: 0;padding: 0;color: transparent;outline: none;border: 1px solid #888;border-radius: 50%;background: url("https://i.ibb.co/dJCMwGN/switcher.png") center /contain;background-color: #333;cursor: pointer;z-index: 9999;opacity: .9;transition: transform .3s;}#night_mode_switcher:hover {opacity: 1;}[data-page="frames"] #night_mode_switcher {display: none;}</style>')
  };
  var userData = JSON.parse(localStorage[userDataKey] || null) || {
    version: ver,
    btnHidden: 0,
    headerColored: 0
  };

  if (!localStorage[userDataKey]) reloadUserData();

  function reloadUserData() {
    localStorage[userDataKey] = JSON.stringify(userData);
  }

  var path = location.pathname.slice(1).replace(/\.(php|html)$/, '');
  var html = document.documentElement;
  var head = document.head;
  var switcher = $.parseNode('<button id="night_mode_switcher" title="Включить/выключить ночную тему"></button>');

  function nightModeOn() {
    localStorage[key] = true;
    head.appendChild(css.main);
    userData.headerColored && head.appendChild(css.headerColored);
  }
  function nightModeOff() {
    localStorage[key] = '';
    css.main.remove();
    css.headerColored.remove();
  }
  function nightModeToggle() {
    var check = String(!localStorage[key]).replace('false', '');
    return check ? nightModeOn() : nightModeOff();
  }

  head.appendChild($.parseNode('<style>:root {overflow-y: auto;} :root > body {overflow-y: visible;}</style>'));
  html.setAttribute('data-page', path);
  switcher.onclick = nightModeToggle;
  switcher.hidden = userData.btnHidden;
  switcher.appendChild(css.switcher);

  if (userData.version !== ver) {
    userData.version = ver;
    reloadUserData();
  }
  if (localStorage[key]) {
    nightModeOn();
    console.log('Night mode, v. ' + ver);
  }

  function init() {
    document.body.appendChild(switcher);

    if (path !== 'pers_settings') return;

    (function(search) {
      function newTr(elems) {
        var tr = document.createElement('tr');
        elems.forEach(function(el) {
          tr.appendChild(el);
        });
        return tr;
      }
      function newTd(pos, html) {
        var td = document.createElement('td');
        td.className = 'wbwhite';
        if (!pos) td.width = '35%';
        else td.align = 'left';
        td.innerHTML = '&nbsp;' + html;
        return td;
      }

      var tdl_0 = newTd(0, 'Цветная шапка');
      var tdr_0 = newTd(1, '<input type="checkbox" name="headerColored" />');
      var tr_0 = newTr([tdl_0, tdr_0]);

      tdr_0.children[0].checked = userData.headerColored;
      tdr_0.children[0].onchange = function() {
        userData[this.name] = this.checked;
        this.checked ? head.appendChild(css.headerColored) : css.headerColored.remove();
        reloadUserData();
      };

      var tdl_1 = newTd(0, 'Скрывать кнопку-переключатель');
      var tdr_1 = newTd(1, '<input type="checkbox" name="btnHidden" />');
      var tr_1 = newTr([tdl_1, tdr_1]);

      tdr_1.children[0].checked = userData.btnHidden;
      tdr_1.children[0].onchange = function() {
        switcher.hidden = userData[this.name] = this.checked;
        reloadUserData();
      };

      var tr_head = document.createElement('tr');
      var td_head = document.createElement('td');
      var rows = [tr_head, tr_0, tr_1];

      td_head.className = 'wblight';
      td_head.colSpan = 2;
      td_head.innerHTML = '&nbsp;<b>Ночная тема: настройки</b>';
      tr_head.appendChild(td_head);
      rows.forEach(function(row) {
        search.parentNode.insertBefore(row, search);
      });
    })($('td.wbwhite[colspan="2"]').parentNode);
  }

  document.readyState === 'complete' ? init() : window.addEventListener('load', init);
})();