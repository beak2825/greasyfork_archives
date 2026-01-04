// ==UserScript==
// @name         Color dots
// @namespace    http://www.ancestry.com/
// @version      0.1
// @description  Same thing we do every night Pinky
// @author       You
// @match        https://www.ancestry.com/discoveryui-matches/list/*
// @match        https://www.ancestry.com/discoveryui-matches/compare/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      GNU GPLv3
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/471726/Color%20dots.user.js
// @updateURL https://update.greasyfork.org/scripts/471726/Color%20dots.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
var $ = window.jQuery;

(function() {
    'use strict';

    const
    label0 = '0. Assessment',               // name of 1st dot
    bg_color0 = 'black',                    // color of 1st dot (as a named color -- see list at https://www.w3.org/wiki/CSS/Properties/color/keywords)
    f_color0 = 'white',
    letter0 = '?',

    label1 = '01. Ikeler',                  // name of 2nd dot
    bg_color1 = '#CF2127',                  // color of 2nd dot (as HEX value)
    f_color1 = 'white',
    letter1 = 'I',

    label2 = '02. Smith',                   // name of 3rd dot
    bg_color2 = 'rbg(219, 120, 41)',        // color of 3rd dot (as RGB value)
    f_color2 = 'white',
    letter2 = 'Sᵐ',

    label3 = '03. Eves',                    // name of 4th dot
    bg_color3 = 'rgba(237, 218, 67, 1.00)', // color of 4th dot (as RGBA value)
    f_color3 = 'white',
    letter3 = 'Eᵛ',

    label4 = '04. McHenry',                 // etc.
    bg_color4 = 'rgb(164, 195, 59)',
    f_color4 = 'white',
    letter4 = 'Mᶜ',

    label5 = '05. Shook',
    bg_color5 = 'rgb(120, 194, 89)',
    f_color5 = 'white',
    letter5 = 'Sᵏ',

    label6 = '06. Metz',
    bg_color6 = 'rgb(85, 148, 140)',
    f_color6 = 'white',
    letter6 = 'Mᵉ',

    label7 = '07. Shelling',
    bg_color7 = 'rgb(69, 110, 181)',
    f_color7 = 'white',
    letter7 = 'Sˡ',

    label8 = '08. Ernst',
    bg_color8 = 'rgb(122, 54, 149)',
    f_color8 = 'white',
    letter8 = 'Eᵗ',

    label9 = '09. Westland',
    bg_color9 = 'rgb(229, 163, 180)',
    f_color9 = 'white',
    letter9 = 'W',

    label10 = '10. Stump',
    bg_color10 = 'rgb(237, 201, 153)',
    f_color10 = 'white',
    letter10 = 'Sᵗ',

    label11 = '11. Erdman',
    bg_color11 = 'rgb(243, 241, 143)',
    f_color11 = 'white',
    letter11 = 'Eᵈ',

    label12 = '12. Cornelius',
    bg_color12 = 'rgb(223, 231, 123)',
    f_color12 = 'white',
    letter12 = 'C',

    label13 = '13. Lervold',
    bg_color13 = 'rgb(187, 221, 173)',
    f_color13 = 'white',
    letter13 = 'L',

    label14 = '14. Gaare',
    bg_color14 = 'rgb(167, 216, 188)',
    f_color14 = 'white',
    letter14 = 'G',

    label15 = '15. Keefe',
    bg_color15 = 'rgb(161, 218, 225)',
    f_color15 = 'white',
    letter15 = 'K',

    label16 = '16. Freeman',
    bg_color16 = 'rgb(197, 160, 202)',
    f_color16 = 'white',
    letter16 = 'F',

    label17 = 'a. Too private',
    bg_color17 = 'unset',
    f_color17 = 'white',
    letter17 = '',
    emoji17 = '👻',

    label18 = 'b. Pinned to tree',
    bg_color18 = 'unset',
    f_color18 = 'white',
    emoji18  = '🌳',

    label19 = 'c. Messaged user',
    bg_color19 = 'unset',
    f_color19 = 'white',
    emoji19  = '📫',

    label20 = 'd. Received reply',
    bg_color20 = 'unset',
    f_color20 = 'white',
    emoji20  = '💌',

    label21 = 'e. Confirmed by user',
    bg_color21 = 'unset',
    f_color21 = 'white',
    emoji21 = '✅',

    label22 = 'f. Unconnected (floater)',
    bg_color22 = 'unset',
    f_color22 = 'white',
    emoji22 = '🏝️',

    label23 = 'g. Submitted to Shared cM Project',
    bg_color23 = 'unset',
    f_color23 = 'white',
    emoji23 = '📓'

    GM_addStyle ( `
    .indicatorGroup[title="${label0}"] {
        background-color: ${bg_color0} !important;
        color: ${f_color0};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label0}"]:before {
        content: "${letter0}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label1}"] {
        background-color: ${bg_color1} !important;
        color: ${f_color1};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label1}"]:before {
        content: "${letter1}";
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label2}"] {
        background-color: ${bg_color2} !important;
        color: ${f_color2};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label2}"]:before {
        content: "${letter2}";
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label3}"] {
        background-color: ${bg_color3} !important;
        color: ${f_color3};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label3}"]:before {
        content: "${letter3}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label4}"] {
        background-color: ${bg_color4} !important;
        color: ${f_color4};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label4}"]:before {
        content: "${letter4}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label5}"] {
        background-color: ${bg_color5} !important;
        color: ${f_color5};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label5}"]:before {
        content: "${letter5}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label6}"] {
        background-color: ${bg_color6} !important;
        color: ${f_color6};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label6}"]:before {
        content: "${letter6}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label7}"] {
        background-color: ${bg_color7} !important;
        color: ${f_color7};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label7}"]:before {
        content: "${letter7}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label8}"] {
        background-color: ${bg_color8} !important;
        color: ${f_color8};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label8}"]:before {
        content: "${letter8}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label9}"] {
        background-color: ${bg_color9} !important;
        color: ${f_color9};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label9}"]:before {
        content: "${letter9}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label10}"] {
        background-color: ${bg_color10} !important;
        color: ${f_color10};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label10}"]:before {
        content: "${letter10}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label11}"] {
        background-color: ${bg_color11} !important;
        color: ${f_color11};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label11}"]:before {
        content: "${letter11}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label12}"] {
        background-color: ${bg_color12} !important;
        color: ${f_color12};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label12}"]:before {
        content: "${letter12}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label13}"] {
        background-color: ${bg_color13} !important;
        color: ${f_color13};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label13}"]:before {
        content: "${letter13}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label14}"] {
        background-color: ${bg_color14} !important;
        color: ${f_color14};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label14}"]:before {
        content: "${letter14}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label15}"] {
        background-color: ${bg_color15} !important;
        color: ${f_color15};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label15}"]:before {
        content: "${letter15}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label16}"] {
        background-color: ${bg_color16} !important;
        color: ${f_color16};
        text-align: center !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label16}"]:before {
        content: "${letter16}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label17}"] {
        background-color: ${bg_color17} !important;
        color: ${f_color17};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label17}"]:before {
        content: "${letter17}";
        text-align: center !important;
        font-size: smaller;
        vertical-align: middle;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label17}"]:before {
        content: "${emoji17}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label18}"] {
        background-color: ${bg_color18} !important;
        color: ${f_color18};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label18}"]:before {
        content: "${emoji18}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label19}"] {
        background-color: ${bg_color19} !important;
        color: ${f_color19};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label19}"]:before {
        content: "${emoji19}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label20}"] {
        background-color: ${bg_color20} !important;
        color: ${f_color20};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label20}"]:before {
        content: "${emoji20}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label21}"] {
        background-color: ${bg_color21} !important;
        color: ${f_color21};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label21}"]:before {
        content: "${emoji21}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label22}"] {
        background-color: ${bg_color22} !important;
        color: ${f_color22};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label22}"]:before {
        content: "${emoji22}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup[title="${label23}"] {
        background-color: ${bg_color23} !important;
        color: ${f_color23};
        text-align: center !important;
        width: auto !important;
        top: 2px !important;
    } ` );
    GM_addStyle ( `
    .indicatorGroup[title="${label23}"]:before {
        content: "${emoji23}"
    } ` );

    GM_addStyle ( `
    .indicatorGroup {
        height: 18px !important;
        width: 18px !important;
    } ` );

    GM_addStyle ( `
    .matchEntry .matchGrid .groupAreaDesktopStuff .customGroupArea .indicatorGroupCollection .indicatorGroup {
        height: 18px !important;
        width: 18px !important;
        top: 4px !important;
    } ` );

    GM_addStyle ( `
    .matchEntry .matchGrid .groupAreaDesktopStuff {
        margin-bottom: 6px !important;
    } ` );

    GM_addStyle ( `
    .searchArea {
        margin: 0 auto 0 !important;
    } ` );

    GM_addStyle ( `
    .discoveryui-matches-app.panelOpen:not(.sidebarPush) .matchListColumnWrap:not(.panelOpen) .matchEntry .matchGrid.hasAtLeastOneIcon, .discoveryui-matches-app:not(.panelOpen) .matchEntry .matchGrid.hasAtLeastOneIcon {
        padding: 10px 0 0px 10px !important;
    } ` );

    GM_addStyle ( `
    .userCardSize4 {
        font-size: 80px !important;
        line-height: 40px !important;
        min-height: 40px !important;
    } ` );

    GM_addStyle ( `
    .userCardSize4 .userCardImg {
        height: 60px !important;
        width: 60px !important;
    } ` );

     GM_addStyle ( `
    .RedwoodLight .matchEntry .mainCol .userCard .badge.dnaVerified.treeIcon {
        left: 37px !important;
        top: 37px !important;
    } ` );

    GM_addStyle ( `
    .userCardSize4 .userCardImg.icon.iconAvatarFemale, .userCardSize4 .userCardImg.icon.iconAvatarMale, .userCardSize4 .userCardImg.icon.iconAvatarPerson, .userCardSize4 .userCardImg.icon.iconFemale, .userCardSize4 .userCardImg.icon.iconMale, .userCardSize4 .userCardImg.icon.iconPerson {
        font-size: 60px !important;
    } ` );

    GM_addStyle ( `
    .matchEntry .matchGrid .mainCol {
        min-height: 40px !important;
    } ` );

    GM_addStyle ( `
    .ng-tns-c67-5 .matchGrid {
        padding: 10px 0 10px 10px !important;
    } ` );

    GM_addStyle ( `
    .matchEntry .matchGrid .gridDivider {
        margin-top: 0 !important;
    } ` );

    GM_addStyle ( `
    .secArea.secAreaContainer.noBorder {
        margin-top: 5px !important;
        margin-bottom: 5px !important;
    } ` );

    GM_addStyle ( `
    .matchEntry .matchGrid {
        margin-bottom: 5px !important;
    } ` );

    GM_addStyle ( `
    .discoveryui-matches-app header.pageHeader .familyTreeLinkWrapper {
        margin-bottom: 5px !important;
    } ` );

    GM_addStyle ( `
    .discoveryui-matches-app header.pageHeader .pageTitle {
        padding: 0 !important;
    } ` );

    GM_addStyle ( `
    .discoveryui-matches-app header.pageHeader .pageActions {
        margin-bottom: 0 !important;
    } ` );

    GM_addStyle ( `
    .page .ngTabs.matchListPageTabs {
        padding-bottom: 5px !important;
        padding-top: 0 !important;
    } ` );

    GM_addStyle ( `
        .discoveryui-matches-app .pageTabs {
        height: 24px !important;
    } ` );

    GM_addStyle ( `
    .matchListColumnWrap .matchListContainer .optionsContainer .optionsArea {
        padding: 5px !important;
    } ` );

    GM_addStyle ( `
    .matchListColumnWrap .matchListContainer .optionsContainer {
        opacity: unset !important;
    } ` );

    GM_addStyle ( `
    .groupRow.ng-star-inserted {
        padding: 3px !important;
    } ` );

})();