// ==UserScript==
// @name Discord AMOLED Dark Theme
// @version 2.1.3
// @author JustTheo
// @namespace http://tampermonkey.net/
// @run-at document-start
// @include https://discord.com/*
// @description Dark Theme
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/423585/Discord%20AMOLED%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/423585/Discord%20AMOLED%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `

MAP
    1. Imports
    2. Vars
    3. Modifiers
        3.1. Backgrounds
        3.2. Other
    4. Scrollbars
    5. DevTags
*/
/*~~ 1. Imports ~~*/
/* Currently nothing */

/*~~ 2. Vars ~~*/
:root {
    /* Infos */
    --adt-build: "333";
    --adto-build: "234";
    --adt-info: "AmoledDarkTheme " var(--adt-build);
    --adto-info: "AmoledDarkThemeOptimized " var(--adto-build);
}
.theme-dark {
    /* Default Variables Modifier */
    --background-primary: var(--bg-1) !important;
    --background-secondary: var(--bg-3) !important;
    --background-secondary-alt: var(--bg-2) !important;
    --background-tertiary: var(--bg-2) !important;
    --background-mobile-header: var(--bg-4) !important;
    --background-modifier-hover: rgba(var(--greyaccentcolor), 0.16) !important;
    --background-modifier-active: rgba(var(--greyaccentcolor), 0.24) !important;
    --background-modifier-selected: rgba(var(--greyaccentcolor), 0.32) !important;
    --background-modifier-accent: rgba(255, 255, 255, 0.06) !important;
    --background-accent: var(--bg-4) !important;
    --background-floating: var(--bg-3) !important;
    --background-mobile-primary: var(--bg-4) !important;
    --background-mobile-secondary: var(--bg-2) !important;
    --deprecated-store-bg: var(--bg-1) !important;
    --deprecated-quickswitcher-input-background: var(--bg-4) !important;
}

/*~~ 3. Modifiers ~~*/
/*-- 3.1. Backgrounds --*/
/* Adt-Bg1 | Primary */
.theme-dark .quickMessage-1yeL4E,
.theme-dark .premiumContainer-3GGa8Q,
.theme-dark .container-xm7Ad0,
.theme-dark .header-1w9Q93,
.theme-dark .messagesPopout-eVzQcI,
.theme-dark .themedPopout-1TrfdI .footer-1K57q_,
.theme-dark .searchAnswer-23w-CH,
.theme-dark .searchFilter-2UfsDk,
.theme-dark .sidebar-nqHbhN,
.theme-dark .bottomDivider-ZmTm-j,
.theme-dark .codeRedemptionRedirect-3SBiCp,
.theme-dark .selectorSelected-1_M1WV,
.theme-dark .colorPickerCustom-1swUKF,
.theme-dark .container-1ILvLB section,
.theme-dark .uploadModal-2ie9O_,
.theme-dark .regionSelectModal-12e-57,
.theme-dark .container-1S70rv .sectionTag-28mLyE,
.theme-dark .css-181m2lf-menu,
.theme-dark .section-3G9aLW,
.theme-dark .popoutList-10IFAa,
.theme-dark .expandedInfo-1W31i3,
.theme-dark .input-3r5zZY,
.theme-dark .card-2TuZPZ:not(.theme-dark .card-2TuZPZ:hover),
.theme-dark .cardPlaceholder-1E2FEs,
.theme-dark .content-1EtbQh,
.theme-dark .authBox-1HR6Ha,
.theme-dark .container-KM8BU6,
.theme-dark .reactors-1VXca7,
.theme-dark .consentCard-1MV_A4,
.theme-dark .attachPopout-1EnBVV,
.theme-dark .expandedFolderBackground-1kSAf6.collapsed-uGXEbi,
.theme-dark .expandedFolderBackground-1kSAf6.hover-3m7-WT.collapsed-uGXEbi,
.theme-dark .expandedFolderBackground-1kSAf6:hover.collapsed-uGXEbi,
.theme-dark .button-1EGGcP.buttonColor-3bP3fX,
.theme-dark .footer-1Ip3Sd,
.theme-dark .header-2w6VV8,
.theme-dark .modal-2RrUKJ,
.theme-dark .inner-1ilYF7,
.theme-dark .contentWrapperInner-15LzPz,
.theme-dark .videoBackground-3No02W,
.theme-dark .videoBackgroundTransition-Pn9nCS,
.theme-dark .video-eAcneW,
.theme-dark .message-G6O-Wv,
.theme-dark .container-2o3qEW
{
    background: var(--bg-1);
    background-color: var(--bg-1);
}
.theme-dark .searchResult-3pzFAB .searchResultMessage-2VxO12.hit-NLlWXA,
.theme-dark .searchResult-3pzFAB.expanded-v2Szsz,
.theme-dark .members-3WRCEx,
.theme-dark .members-3WRCEx>div,
.theme-dark .sidebarRegion-1VBisG,
.theme-dark .sidebarRegionScroller-FXiQOh,
.theme-dark .contentWrapper-3oy4Xo,
.theme-dark #MemberCount,
.theme-dark .root-g14mjS,
.theme-dark #dv-mount,
.theme-dark .peopleColumn-1wMU14,
.theme-dark .footer-31IekZ,
.theme-dark .theme-light .input-m1-Y7Q,
.theme-dark .wrapper-2RrXDg,
.theme-dark .noChannel-Z1DQK7,
.theme-dark .modal-2RrUKJ,
.theme-dark .pageWrapper-2PwDoS,
.theme-dark .autocomplete-3NRXG8,
.theme-dark .emojiAliasInput-1y-NBz .emojiInput-1aLNse,
.theme-dark .calendarPicker-sDhzdi .react-datepicker__day.react-datepicker__day--disabled,
.theme-dark .calendarPicker-sDhzdi .react-datepicker__day.react-datepicker__day--disabled:hover,
.theme-dark .wrapper-1gVUIN.minimum-fXpVNc,
.theme-dark .searchResult-O9NDji.expanded-w_LCGl,
.theme-dark .container-1S70rv .sectionTag-28mLyE,
.theme-dark .tooltipPrimary-3qLMbS,
.theme-dark .noChannel-1GDIAZ,
.theme-dark .reaction-2A2y9y,
.theme-dark .inset-SbsSFp,
.theme-dark .nowPlayingColumn-1eCBCN
{
    background: var(--bg-1) !important;
    background-color: var(--bg-1) !important;
}
/* Adt-Bg2 | Tertiary and Secondary-Alt */
.theme-dark .bodyInner-245q0L,
.theme-dark .footer-1fjuF6,
.theme-dark .headerNormal-T_seeN,
.theme-dark .tiles-2aXG_k,
.theme-dark .wrapperAudio-1Bzv_Z,
.theme-dark .regionSelectModal-12e-57 .regionSelectModalOption-2DSIZ3,
.theme-dark .progress-1S-TDF,
.theme-dark .toolbar-37BrJ5,
.theme-dark .container-YkUktl,
.theme-dark .container-YkUktl .avatar-1EWyVD,
.theme-dark .panels-3wFtMD,
.theme-dark .popout-3Zw0qN,
.theme-dark .infoBar-U6oBFk,
.theme-dark .diversitySelector-tmmMv0 .popout-2nUePc,
.theme-dark .emojiPicker-3m1S-j .scroller-3vODG7 .emojiItem-109bjA.selected-39BZ4S,
.theme-dark .everyonePopout-nEbJY3,
.theme-dark .keybindShortcut-3zF1P9 span,
.theme-dark .dim-2Uxgxb span,
.theme-dark .searchBox-pyIJJj,
.theme-dark .css-ncjuf0-control,
.theme-dark .css-1rckt42-menu,
.theme-dark .css-1wqqa50-container,
.theme-dark .action-1lSjCi,
.theme-dark .bd-modal-wrapper .header,
.theme-dark .bd-modal-wrapper .footer,
.theme-dark .childWrapper-1j_1ub,
.theme-dark .circleIconButton-1VxDrg,
.theme-dark .privateChannels-oVe7HL,
.theme-dark .scroller-WSmht3,
.theme-dark .button-1EGGcP.buttonColor-3bP3fX:hover,
.theme-dark .container-PNkimc,
.theme-dark #bd-pub-button,
.theme-dark .sidebar-1tnWFu,
.theme-dark .card-2ART2V:before,
.theme-dark .colorPickerCustom-1swUKF,
.theme-dark .channelTabs-noMention,
.theme-dark .channelTabs-noUnread,
.theme-dark #bd-pub-button,
.theme-dark .replyer,
.theme-dark .container-1NXEtd,
.theme-dark .calendarPicker-sDhzdi .react-datepicker,
.theme-dark .calendarPicker-sDhzdi .react-datepicker__header,
.theme-dark .bd-modal-wrapper .bd-modal-body,
.theme-dark .embedFull-1HGV2S,
.theme-dark .autocompleteArrow-jJE9TQ,
.theme-dark .header-3i_Csh,
.theme-dark .keyboardShortcutsModal-2CRmCm,
.theme-dark .perk-2WeBWW,
.theme-dark .perk-2YwViL,
.theme-dark .tierBody-16Chc9,
.theme-dark .tierBody-3gjrjH
{
    background: var(--bg-2);
    background-color: var(--bg-2);
}
.theme-dark .searchResultsWrap-2DKFzt,
.theme-dark .menu-Sp6bN1,
.theme-dark .container-ZMc96U.themed-Hp1KC_,
.theme-dark #permissions-modal-wrapper .header,
.theme-dark #permissions-modal-wrapper .modal-body
{
    background: var(--bg-2) !important;
    background-color: var(--bg-2) !important;
}
/* Adt-Bg3 | Secondary */
.theme-dark .friendsTable-133bsv,
.theme-dark .friendsTableHeader-32yE7d,
.theme-dark .quickSelectPopout-2F0PXw,
.theme-dark .userSettingsVoice-1_dzjw .previewOverlay-2reuWf,
.theme-dark .hasMoreButton-1MELpI,
.theme-dark .formNotice-2nS8ey,
.theme-dark .wrapper-29NfPK.minimum-2d6zH6 .actions-2vadYq .center-1Vp33r,
.theme-dark .footer-1Ip3Sd,
.theme-dark .cardPrimary-3qRT__,
.theme-dark .header-JHwfVI,
.theme-dark .content-1CboaJ,
.theme-dark .noSearchResultsContainer-1dVofo,
.theme-dark .userSettingsAccount-2eMFVR .userInfoEditing-1CEzdT,
.theme-dark .userSettingsAccount-2eMFVR .userInfoViewing-16kqK3,
.theme-dark .paymentPane-ut5qKZ,
.theme-dark .summaryInfo-3hcuop,
.theme-dark .autocompleteInner-y1mjDl,
.theme-dark .modal-2RrUKJ,
.theme-dark .messageGroupWrapper-1jf_7C:hover .actionButtons-2mNSAB,
.theme-dark .container-1ILvLB .header-2C89wJ,
.theme-dark .popout-2sKjHu,
.theme-dark .footer-1Ip3Sd,
.theme-dark .autocompleteArrow-jJE9TQ,
.theme-dark .autocompleteHeaderBackground-3u7TwO,
.theme-dark .sidebar-1tnWFu,
.theme-dark .everyonePopout-nEbJY3,
.theme-dark .popout-1k352f,
.theme-dark .item-2idW98,
.theme-dark .paginator-1eqD2g,
.theme-dark .notDetected-2HEmAp,
.theme-dark .payment-2bOh4k,
.theme-dark .lookFilled-yCfaCM.colorPrimary-2AuQVo:not(.theme-dark .lookFilled-yCfaCM.colorPrimary-2AuQVo:active, .theme-dark .lookFilled-yCfaCM.colorPrimary-2AuQVo:hover),
.theme-dark .separator-2OaeRP,
.theme-dark .modalTitle-2skSKy,
.theme-dark .modalSubtitle-2lx7qk,
.theme-dark .keyboardShortcutsModal-2CRmCm,
.theme-dark .footer-2VgWkh,
.theme-dark .selectorButton-21mL5E,
.theme-dark .pageWrapper-2PwDoS,
.theme-dark .searchBar-zdmu7v,
.theme-dark .emojiAliasInput-1y-NBz .emojiInput-1aLNse,
.theme-dark .bd-modal-wrapper .bd-modal-body,
.theme-dark .sidebar-1-SQro,
.theme-dark .wrapper-1gVUIN.minimum-fXpVNc,
.theme-dark .whyYouMightLikeIt-2N2Df7,
.theme-dark .bodySection-3iDdop,
.theme-dark .row-2qQ--F,
.theme-dark .scrollerWrapper-2xG8VZ,
.theme-dark .scroller-2GkvCq
{
    background: var(--bg-3);
    background-color: var(--bg-3);
}
.theme-dark .menu-Sp6bN1,
.theme-dark .container-2McqkF,
.theme-dark .searchPopout-1vUlP3,
.theme-dark .messagesPopoutWrap-3zryHW,
.theme-dark .userPopout-3XzG_A,
.theme-dark .bda-slist li,
.theme-dark .container-2McqkF,
.theme-dark .contextMenu-HLZMGh,
.theme-dark .submenu-1apzyU,
.theme-dark .styleFlexible-x0_sIC,
.theme-dark .body-3iLsc4,
.theme-dark .footer-1fjuF6,
.theme-dark .bf-toolbar::before,
.theme-dark .wrapper-1Rf91z,
.theme-dark .scroller-2TZvBN,
.theme-dark .scroller-3X7KbA,
.theme-dark .channelTabs-favContainer,
.theme-dark .wrapper-2vIMkT,
.theme-dark .bg-1QIAus,
.theme-dark .container-x8Y1ix,
.theme-dark .wrapper-2RrXDg:hover,
.theme-dark .uploadModal-2ie9O_,
.theme-dark .searchBox-31Zv9h,
.theme-dark .input-2g-os5,
.theme-dark .searchBar-zdmu7v,
.theme-dark .button-1EGGcP.buttonColor-3bP3fX,
.theme-dark .colorable-3rVGna.primaryDark-2UJt1G,
.theme-dark #permissions-modal-wrapper .role-side,
.theme-dark .calendarPicker-sDhzdi .react-datepicker__day--disabled,
.theme-dark .calendarPicker-sDhzdi .react-datepicker__day--outside-month,
.theme-dark .reaction-2A2y9y:hover
{
    background: var(--bg-3) !important;
    background-color: var(--bg-3) !important;
}
/* Adt-Bg4 | 4th */
.theme-dark .scrollableContainer-15eg7h,
.theme-dark .expandedFolderBackground-1kSAf6,
.theme-dark .expandedFolderBackground-1kSAf6.hover-3m7-WT,
.theme-dark .expandedFolderBackground-1kSAf6:hover,
.theme-dark .folder-241Joy,
.theme-dark .folder-241Joy:hover,
.theme-dark .expandedFolderBackground-1cujaW,
.theme-dark .expandedFolderBackground-1cujaW.hover-2ji_A7,
.theme-dark .expandedFolderBackground-1cujaW:hover,
.theme-dark .folder-1hbNCn,
.theme-dark .folder-1hbNCn:hover,
.theme-dark .inset-SbsSFp,
.theme-dark .footer-VCsJQY,
.theme-dark .searchPage-3tt6dh .search-25t1e9 .searchBox-31Zv9h,
.theme-dark .quickSelectPopout-2F0PXw,
.theme-dark #permissions-modal-wrapper .perm-side,
.theme-dark .tierMarkerBackground-G8FoN4
{
    background: var(--bg-4);
    background-color: var(--bg-4);
}
.theme-dark .guildsDiscover-oiBX_l,
.theme-dark .channelTextArea-1FufC0,
.theme-dark .scrollableContainer-15eg7h,
.theme-dark .theme-light .container-x8Y1ix:hover,
.theme-dark .button-1EGGcP.buttonColor-3bP3fX:hover,
.theme-dark .colorable-3rVGna.primaryDark-2UJt1G.active-3D763s,
.theme-dark .colorable-3rVGna.primaryDark-2UJt1G:hover
{
    background: var(--bg-4) !important;
    background-color: var(--bg-4) !important;
}
/* FIX FOR BOTH ADT AND ADTO THEMES */
.theme-dark .spoilerText-27bIiA.hidden-3B-Rum {
    background-color: #202225;
}
/*-- 3.2. Other --*/
.theme-dark .expandedFolderBackground-1kSAf6.collapsed-uGXEbi,
.theme-dark .expandedFolderBackground-1kSAf6.collapsed-uGXEbi.hover-3m7-WT,
.theme-dark .expandedFolderBackground-2sPsd-.collapsed-1GMuSb,
.theme-dark .expandedFolderBackground-2sPsd-.collapsed-1GMuSb.hover-2ji_A7 {
    background-color: transparent;
}
.theme-dark .xenoLib-notification-content {
    color: var(--text-normal);
}
.theme-dark .popout-2sKjHu,
.theme-dark .uploadModal-2ie9O_ {
    border-color: var(--bg-4);
}
.theme-dark .footer-VCsJQY {
    -webkit-box-shadow: inset 0 1px 0 var(--bg-4);
    box-shadow: inset 0 1px 0 var(--bg-4);
}
.uploadModal-2ie9O_ .footer-VCsJQY {
    border-radius: 0 0 10px 10px;
}
.theme-dark .css-1rckt42-menu { 
    border-color: black;
}
.theme-dark .selectorButtonSelected-1j4DmC {
    background-color: #7289da !important;
}
.theme-dark #bd-settings-sidebar .ui-tab-bar-item:hover:not(.selected) {
    background-color: var(--background-modifier-hover);
}
.theme-dark .children-3xh0VB:after {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0), var(--background-tertiary));
}
.theme-dark .focusFill-2jImF6,
.theme-dark .focusStroke-3V8pid {
    fill: var(--bg-3);
}
.theme-dark .username-h_Y3Us:hover {
    color: white !important;
    transition: 200ms !important;
    transition-delay: 300ms !important;
}
.theme-dark .messageContent-2t3eCI:hover {
    color: var(--text-normal) !important;
    transition: 250ms !important;
    transition-delay: 250ms !important;
}
.theme-dark .winButton-3UMjdg {
    color: #d2d2d2;
}
.theme-dark .winButtonClose-3Q8ZH5:hover,
.theme-dark .winButtonMinMax-3RsPUg:hover {
    color: white;
}
.theme-dark .selected-1-Z6gm .layout-1qmrhw {
    background-color: rgb(var(--greyaccentcolor));
}
.theme-dark .wrapper-1NNaWG {
    background: none;
}
.theme-dark .wrapper-1Pbe6Z {
    background: transparent;
    border: solid var(--bg-4) 1px;
}
.theme-dark .modeSelected-1zApJ_ .content-3at_AU,
.theme-dark .modeSelected-1zApJ_:hover .content-3at_AU,
.theme-dark .modeSelected-3DmyhH .content-1gYQeQ,
.theme-dark .modeSelected-3DmyhH:hover .content-1gYQeQ {
    background: rgb(var(--greyaccentcolor));
}
.theme-dark .modeSelected-3DmyhH .icon-2W8DHg,
.theme-dark .modeSelected-3DmyhH:hover .icon-2W8DHg {
    color: var(--interactive-active);
}
.theme-dark .content-3at_AU:hover {
    background: var(--background-modifier-hover);
}
.theme-dark .modeSelected-1zApJ_ .icon-1_QxNX,
.theme-dark .modeSelected-1zApJ_:hover .icon-1_QxNX,
.theme-dark .modeUnread-1zpFdA .icon-1_QxNX,
.theme-dark .modeUnread-1zpFdA:hover .icon-1_QxNX {
    color: var(--interactive-active);
}
.theme-dark .circleIconButton-1VxDrg.selected-2r1Hvo,
.theme-dark .circleIconButton-jET_ig.selected-ugP_am,
.theme-dark .circleIconButton-1QV--U.selected-1JjBPm {
    color: #fff;
    background-color: hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%);
}
.theme-dark .theme-light .titleBar-1it3bQ {
    margin-top: 0;
    padding-top: 4px;
}
.theme-dark .theme-light .colorHeaderPrimary-jN_yGr {
    color: #fff;
    font-weight: 600;
}
.theme-dark .theme-light .colorHeaderSecondary-g5teka {
    color: #b9bbbe
}
.theme-dark .theme-light .colorStandard-21JIj7 {
    color: #b9bbbe;
}
.theme-dark .theme-light .input-2g-os5 {
    color: #b9bbbe;
}
.theme-dark .theme-light .root-g14mjS {
    -webkit-box-shadow: 0 0 0 1px rgba(32, 34, 37, 0.6), 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 0 1px rgba(32, 34, 37, 0.6), 0 2px 10px 0 rgba(0, 0, 0, 0.2);
}
.theme-dark .theme-light .sampleLink-5BWNy9 {
    color: #b9bbbe;
}
.theme-dark .theme-light .footer-31IekZ {
    -webkit-box-shadow: inset 0 1px 0 rgba(47, 49, 54, 0.6);
    box-shadow: inset 0 1px 0 rgba(47, 49, 54, 0.6);
}
.theme-dark .theme-light .close-1mLglB {
    color: #b9bbbe;
}
.theme-dark .theme-light .close-1mLglB {
    color: #eee;
}
.theme-dark .option-2KkUJO:after {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), var(--bg-3));
}
.theme-dark .unread-2wipsx {
    background-color: #4f545c;
}
.theme-dark .search-25t1e9 .searchBox-31Zv9h .searchBoxInput-3h4etz {
    color: #ccc;
}
.theme-dark .search-25t1e9 .searchBox-31Zv9h .closeIcon-BMGxx0 {
    color: #b9bbbe;
}
.theme-dark .search-25t1e9 .searchBox-31Zv9h .closeIcon-BMGxx0:hover {
    color: #fff;
}
.theme-dark .selected-3H3-RC {
    background-color: #36393f80;
}
.theme-dark .regionSelectModal-12e-57 .regionSelectModalOption-2DSIZ3 {
    border-color: var(--bg-4);
}
.theme-dark .regionSelectName-2-2FWh {
    color: var(--text-muted);
}
.theme-dark .xenoLib-notification-content {
    background: var(--xl-bg, #474747) !important;
}
.theme-dark .card-2ART2V:before {
    border-color: var(--bg-1);
}
.theme-dark .channelTabs-noFavs {
    background-color: transparent;
}
.theme-dark .colorPickerCustom-1swUKF {
    border-color: var(--bg-3);
}
.theme-dark .channelTabs-noMention,
.theme-dark .channelTabs-noUnread {
    color: var(--text-muted);
}
.theme-dark .calendarPicker-sDhzdi .react-datepicker__day {
    border-top-color: var(--bg-4);
    border-left-color: var(--bg-4);
}
.theme-dark .wrapper-1gVUIN.minimum-fXpVNc {
    border-bottom: solid 1px var(--bg-3);
}
.theme-dark .mulitplePlaceholderUsername-2T3DCI,
.theme-dark .placeholderAvatar-1qAcRZ,
.theme-dark .placeholderUsername-3iQi_D {
    background-color: rgb(var(--greyaccentcolor));
}
.theme-dark .perksModal-fSYqOq,
.theme-dark .perksModal-1pSu7w {
    background-color: var(--bg-1);
}
.theme-dark .searchResult-O9NDji.expanded-w_LCGl,
.theme-dark .searchResultMessage-1fxgXh.hit-1fVM9e {
    border-color: var(--bg-3);
}
.theme-dark .repliedMessage-3Z6XBG:before {
    border-color: rgb(var(--greyaccentcolor));
}
.theme-dark .embedFull-1HGV2S {
    border-left-color: var(--bg-4);
}
.theme-dark .tooltipPrimary-3qLMbS .tooltipPointer-3L49xb {
    border-top-color: var(--bg-1);
}
.theme-dark .reaction-2A2y9y {
    border-color: #131417;
}
.theme-dark .reaction-2A2y9y:hover {
    border-color: #202225;
}
.theme-dark .reaction-2A2y9y.reactionMe-3I9gFK,
.theme-dark .reaction-2A2y9y.reactionMe-3I9gFK:hover {
    background-color: var(--brand-experiment-15a) !important;
}
.theme-dark .reaction-2A2y9y.reactionMe-3I9gFK {
    border-color: var(--brand-experiment);
}
.theme-dark .spine-29OFwR {
    color: rgb(var(--greyaccentcolor));
}
.theme-dark .cozy-VmLDNB.hasThread-3h-KJV:after {
    border-color: rgb(var(--greyaccentcolor));
}
.theme-dark .holidayPromotionSelectedBackground-irywjz .layout-1qmrhw {
    background-color: transparent !important;
}

/*~~ 4. Scrollbars ~~*/
.theme-dark ::-webkit-scrollbar-track {
    background: transparent !important;
    border: none !important;
}

/*~~ 5. DevTags ~~*/
div[class*="message"] img[src*="703638166162112516"] ~ h2[class^="header"] span[class*="name"]:nth-child(1):after {
    background-color: rgb(var(--betterdiscord-v3-blue-rgb)) !important;
    color: #fff !important;
    font-size: 0.625rem !important; /* 0.625rem or 10px */
    font-weight: 500 !important;
    text-transform: uppercase !important;
    vertical-align: top !important;
    display: -webkit-inline-box !important;
    display: -ms-inline-flexbox !important;
    display: inline-flex !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
    text-indent: 0 !important;
    height: 0.9375rem !important;
    padding: 0 0.275rem !important;
    margin-top: 0.075em !important;
    margin-left: 0.25rem !important;
    position: relative !important;
    top: 0.15rem !important;
    border-radius: 0.1875rem !important;
    white-space: nowrap !important;
}
div[class*="message"] img[src*="703638166162112516"] ~ h2[class^="header"] span[class*="name"]:nth-child(1):after {
    content: "Theme Dev" !important;
}
#app-mount .username-added .author-username:after {
    display: none !important;
}
div[class*="message"] img[src*="703638166162112516"] ~ h2[class^="header"] span[class*="name"]:nth-child(1),
div[class*="message"] img[src*="703638166162112516"] ~ h2[class^="header"] span[class*="name"]:nth-child(1):hover {
    font-weight: bold !important;
    color: rgb(var(--betterdiscord-v3-blue-rgb)) !important;
}
/* AMOLED Dark Theme Optimized */

:root {
    --theme-name: "The theme name is Unknown, please report. - Something"; /* Default value if the theme name is not set. */
}
#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div > div.base-2jDfDU:before {
    content: var(--theme-name)" is broken/outdated! Please redownload the theme from \"discord-addons.github.io/themes\"." !important;
    display: block; /* Default value if the theme does not have this display property. */
    background-color: #3e82e5;
    color: #fff;
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 500;
    height: auto;
    line-height: 16px;
    opacity: 1;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    text-align: center;
    visibility: unset;
    white-space: pre-wrap;
    top: 0;
    left: 0;
    bottom: unset;
    right: unset;
    max-width: unset;
    min-width: unset;
    max-height: unset;
    min-height: unset;
    transform: unset;
    animation: unset;
    z-index: 101;
    pointer-events: none;
}
.platform-win #app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div > div:before {
    border-top-left-radius: 6px;
}
.info-1sUqUG:after {
    content: var(--adto-info) !important;
    font-size: 12px !important;
    color: var(--text-muted) !important;
    display: inline !important;
    opacity: 1 !important;
    padding: 0 !important;
    cursor: text !important;
    visibility: visible !important;
    position: relative !important;
    top: unset !important;
    left: unset !important;
    bottom: 1px !important;
    right: unset !important;
    transform: unset !important;
    animation: unset !important;
    text-transform: none !important;
}
.theme-dark {
    --background-dark-primary: black;
    --background-dark-secondary: black;
    --background-dark-tertiary: black;
    --background-dark-4th: black;

    --greyaccentcolor: 51, 51, 51;
    --bg-1: var(--background-dark-primary); /* Black */
    --bg-2: var(--background-dark-tertiary); /* Darker */
    --bg-3: var(--background-dark-secondary) ; /* Dark */
    --bg-4: var(--background-dark-4th); /* Dark-Grey */
    --xl-bg: var(--xenolib-background-color, #000);
    
    --theme-name: "AMOLED Dark Theme Optimized";
}
:root {
    --betterdiscord-v3-blue-rgb: var(--accentcolor, 62, 130, 229) !important;
}
#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div > div.base-2jDfDU:before {
    display: var(--version006_adto, block) !important;
}
[id*="AmoledDarkThemeOptimized-"] .bd-addon-header .bd-meta:before {
    content:"build " var(--adto-build) " ";
}

:root { /* Settings */
    /* Compatibility Settings */

    /* Update Settings */
    --version006_adto: none; /* Do not touch to this, or you'll see a notice that says your theme is broken. */
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();