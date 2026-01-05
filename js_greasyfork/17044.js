//
// Written by Glenn Wiking
// Script Version: 1.1.0
// Date of issue: 01/09/15
// Date of resolution: 01/09/15
//
// ==UserScript==
// @name        ShadeRoot Hotmail
// @namespace   SRHM
// @description Eye-friendly magic in your browser for Hotmail
// @version     1.1.0
// @icon        https://i.imgur.com/AooOglK.png

// @include        http://*.hotmail.*
// @include        https://*.hotmail.*
// @include        http://*login.live.*
// @include        https://*login.live.*
// @include        http://*mail.live.com*
// @include        https://*mail.live.com*
// @include        http://*.live.*
// @include        https://*.live.*
// @include        http://outlook.*
// @include        https://outlook.*

// @downloadURL https://update.greasyfork.org/scripts/17044/ShadeRoot%20Hotmail.user.js
// @updateURL https://update.greasyfork.org/scripts/17044/ShadeRoot%20Hotmail.meta.js
// ==/UserScript==

function ShadeRootHotmail(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootHotmail(
  'html, body, .signInHeader iframe, .t_body .t_sbgc {background: rgba(19, 27, 38, 1) !important; color: #CCD !important;}'
  +
  'div.footer {background-color: rgba(6, 17, 30, 1) !important;}'
  +
  'div.row.label, div.section > div.label, label, .SignUp span, .signUpFloat span {color: #778 !important;}'
  +
  '.outlook, .Outlook, div#offer div#text {background-color: rgba(6, 46, 92, 1) !important;}'
  +
  ':root input {border: 1px solid rgba(11, 72, 150, 1) !important; background: rgba(18, 55, 102, 1) !important;}'
  +
  '.outlook a, .outlook a:hover, .outlook a:visited {border: 1px none rgba(20, 63, 138, 1); background-color: #123766 !important;}'
  +
  '*::-moz-selection {background-color: #004FC6 !important; color: #B9CBE6 !important;}'
  +
  '.c_search_mc {border: 1px solid #0B4896 !important; background-color: #123766 !important;}'
  +
  '.ContentRightInner, .t_mbgc, .t_qtc, .t_urtc {background-color: rgba(4, 19, 35, 1) !important;}'
  +
  '.mlRule, .mgRule, .SkypeOutHeader {border-bottom: 1px solid rgba(9, 62, 131, 1) !important;}'
  +
  '.c-ContainerList .selectable.selected, .c-ContainerList .selectable:hover, .t_mbgc .t_sel, .t_mbgc .t_sel:hover, .t_sel {background-color: rgba(13, 69, 123, 1) !important; color: rgba(109, 186, 243, 1) !important;}'
  +
  '.leftnavitem:focus {background-color: rgba(22, 105, 176, 1) !important;}'
  +
  '.editableLabel, .readonly, .c_search_mc input.c_search_box, .c_search_mc input.c_search_box[disabled] {color: rgba(109, 186, 243, 1) !important;}'
  +
  '.SearchBox input {border: 0px solid black !important;}'
  +
  '.BorderTop {border-top: 1px solid #093E83 !important;}'
  +
  '.c-PageFooter .uxp_ftr_control td {background-color: #0D457B !important;}'
  +
  '.c-PageFooter .uxp_ftr_control {background-color: #0D457B !important; border-top: 1px solid rgba(17, 79, 173, 1) !important;}'
  +
  '.c-PageFooter .uxp_ftr_control ul li span, .t_lnksi a {color: rgba(112, 166, 200, 1) !important;}'
  +
  '#CurtainTableCell {background-color: #0F1C35 !important;}'
  +
  '#CurtainSpinner {opacity: .7 !important;}'
  +
  '#CurtainText {color: #507BBA !important;}'
  +
  '.t_sbgc .t_s_hov:hover, .t_s_hov:hover, .t_s_hov:hover .t_s_hovh, .t_s_sel, .t_s_h {background-color: rgba(20, 67, 138, 0.65) !important;}'
  +
  '.t_qtc, .t_qtc:hover, .t_qtc:visited, .mlRd .t_estc, .count {color: #1C63DE !important;}'
  +
  '.FmSender {background-color: rgba(0,0,0,0) !important;}'
  +
  '.t_sbgc div.t_sr_bordc, input.t_sr_bordc, #search_filter.t_sr_bordc, .o365cs-nav-contextMenu, ._oc_t1, .__Microsoft_Owa_Lightning_templates_cs_d {border-color: #0B4896 !important;}'
  +
  '.t_sbgc div.t_srbgc, .t_sbgc div.t_srbgc input, .t_sbgc input.t_srbgc {background-color: #123766 !important;}'
  +
  '.cp_inputArea:hover, .ms-border-color-neutralTertiaryAlt, .ms-bcl-nta, .ms-border-color-neutralTertiaryAlt-hover:hover, .ms-border-color-neutralTertiaryAlt-focus:focus, .ms-border-color-neutralTertiaryAlt-before::before, .ms-bcl-nta-h:hover, .ms-bcl-nta-f:focus, .ms-bcl-nta-b::before {border-color: #1D5DBC !important;}'
  +
  '.RteToolbar .ButtonList > UL > LI > A, .ButtonList {background: #004B8B !important;}'
  +
  '.RteToolbar .ButtonList > UL > LI > A:hover {background: #1669BA !important;}'
  +
  '.NotificationBase.NotificationBar .InnerContainer .Content .UserArea, #c_memenu.c_m .c_ld {color: #92C5F0 !important;}'
  +
  '.c_mli a, .c_m li a, .c_m li span.link, .c_m li span.c_ld {border: 1px solid #0A427A !important;}'
  +
  'ul.c_m a, ul.c_m a:visited {color: #5BA2F2 !important;}'
  +
  'ul.c_m a:hover, ul.c_m a:focus, .c_c ul.c_m a:hover {background-color: #1674CF !important; color: #AECEEA !important;}'
  +
  'ul.c_m, .c_hb .c_c.t_hdbg .c_cc .c_mf li {background: #0A427A !important;}'
  +
  '.c_hb .c_c.t_hdbg .c_cc .c_mf li a:hover {background-color: #3161D4 !important;}'
  +
  '.c-ReadMessage .rmRule, .HMLV .Border {border-bottom: 1px solid #1F3E60 !important;}'
  +
  '.HMLV .Header {border-top: 1px solid #1F3E60 !important;}'
  +
  'input[type="email"], input[type="password"], .SafetyBarPadding {color: #A8A8B8 !important;}'
  +
  '.c-ReadMessagePartBody .readMsgBody {opacity: .82 !important;}'
  +
  '#uxp_ftr_left, .t_lnksi {background-color: #0D457B !important;}'
  +
  '#uxp_ftr_control.t_fbgc, .t_fbgc {background-color: #0D457B !important; border-top: 1px solid #0D559C !important;}'
  +
  '.MainOptionsList li a, .SubsectionPadding, #sdx_mb, .ManageRulesDescriptionColumn .ruleDescription {color: #6DBAF3 !important;}'
  +
  '.MainOptionsTitle {color: #8FC1E1 !important;}'
  +
  '.PrimaryTextColor, .TextSizeSmall, .cOptionsBody H3 {color: rgb(45, 134, 221) !important;}'
  +
  'input[type="button"], input.default[type="button"] {color: #71A3E3 !important;}'
  +
  '.cpv2 .cp_clist {border: 1px solid #173557 !important; background: rgba(255, 255, 255, 0) !important;}'
  +
  '.cp_anyInput, .cpv2, .cp_primaryInput, .cp_awe textarea, .cp_input textarea {background-color: rgb(18, 55, 102) !important;}'
  +
  '.carousel.carouselVisible {border-bottom: 1px solid #124374 !important;}'
  +
  '.carouselItemWrapper, .carouselSmooth {background-color: rgb(19, 27, 38) ! important;}'
  +
  '.carouselItemBorder:hover {border: 3px solid #004B8B !important;}'
  +
  '#infoBoxTitle, .c_rchev, .TextSizeSmall, .iaPrimaryTextColor, .c-ManageRules .iaPrimaryTextColor {color: #3D8CC6 !important;}'
  +
  '.ManageRulesTable {border-top: 1px solid #11427A !important;}'
  +
  '.NewRuleButton {background-color: #0B3E78 !important; color: #4393BF !important;}'
  +
  '.ManageRulesTableBody TR:hover {background-color: #0D3466 !important;}'
  +
  '.OuterContainer {background-color: rgba(0, 0, 0, 0) !important;}'
  +
  '.InnerContainer .UserTitle {color: #63BAD7 !important;}'
  +
  '.editRule_Panel .conditionListTitle, .editRule_Panel .actionListTitle, .c_mcp.boxStyle .c_ml span, .editRule_Panel .addActionDiv .addConditionText, .editRule_Panel .addConditionDiv .addConditionText, .editRule_Panel .addActionDiv .addActionText, .editRule_Panel .addConditionDiv .addActionText {color: #67ABEF !important;}'
  +
  '.c_mcp.boxStyle .c_ml {border: 1px solid #529DD4 !important;}'
  +
  ':root button.default {background-color: #06599F !important; color: #7DB7E1 !important;}'
  +
  ':root button.default:hover {background-color: #3D94D4 !important;}'
  +
  '.RPBottom .v-ReadMessageContainer {border-top: 1px solid #093E83 !important;}'
  // // // // // FLYOUTS
  +
  '.NotificationBase.Flyout .OuterContainer, .NotificationBase.DropDown .OuterContainer {background-color: rgba(14, 47, 84, 1) !important;}'
  +
  '.c_headerBar .UserContent a {border: 3px solid rgba(13, 74, 119, 1) !important;}'
  +
  '.c_headerBar .UserContent a, .c_headerBar .UserContent li, ul.c_m, #c_h_theme_m {background-color: rgba(10, 66, 122, 1) !important}'
  +
  '.NotificationBase.Flyout .Beak4:after, .NotificationBase.Flyout .Beak5:after {border-bottom-color: rgba(10, 66, 122, 1) !important;}'
  +
  '.InnerContainer {background: #004B8B !important;}'
  +
  '.ContentRightInner, .t_mbgc, .t_qtc, .t_urtc {color: #1C5D8D !important;}'
  +
  '.Subject {border-bottom: 1px solid #053974 !important;}'
  +
  '.fSubject, .t_subj, .TextLightI, .WatermarkedInput, .Unread, .cp_Contact a, .t_urtc, .t_urtc .mlUnrd .Fm a, .t_urtc .Unread, .t_srbgc input.t_urtc, .t_atc:hover, .t_atc:visited, .t_atc:focus, .t_srbgc a.t_urtc, #search_filter.t_urtc, #search_filter.t_urtc:focus, .t_atc {color: #97C3F5 !important;}'
  +
  '.mainWindown, .flexcolumn {background: #0b284d !important;}'
  +
  '.ms-font-xl {color: #d3dce7 !important;}'
  +
  '.listItemDefaultBackground {background: #0d2435 !important;}'
  +
  '._lvv_71:hover {background: #0d141a !important;}'
  +
  '.ms-font-color-neutralPrimary, .ms-fontColor-neutralPrimary, .ms-fcl-np, .ms-font-color-neutralPrimary-hover:hover, .ms-font-color-neutralPrimary-focus:focus, .ms-font-color-neutralPrimary-before::before, .ms-fcl-np-h:hover, .ms-fcl-np-f:focus, .ms-fcl-np-b::before {color: #88a8c0 !important;}'
  +
  '.ms-bg-color-themeLight, .ms-bgc-tl, .ms-bg-color-themeLight-hover:hover, .ms-bg-color-themeLight-focus:focus, .ms-bg-color-themeLight-before::before, .ms-bgc-tl-h:hover, .ms-bgc-tl-f:focus, .ms-bgc-tl-b::before {background-color: #0F4481 !important;}'
  +
  '.ms-font-color-themePrimary, .ms-fontColor-themePrimary, .ms-fontColor-themePrimary, .ms-fcl-tp, .ms-font-color-themePrimary-hover:hover, .ms-font-color-themePrimary-focus:focus, .ms-font-color-themePrimary-before::before, .ms-fcl-tp-h:hover, .ms-fcl-tp-f:focus, .ms-fcl-tp-b::before {color: #2471C8 !important;}'
  +
  '.ms-bg-color-white, .ms-bgc-w, .ms-bg-color-white-hover:hover, .ms-bg-color-white-focus:focus, .ms-bg-color-white-before::before, .ms-bgc-w-h:hover, .ms-bgc-w-b::before {background-color: #122744 !important;}'
  +
  '.contextMenuPopup {background-color: #18355a !important;}'
  +
  '.contextMenuDropShadow {border: 1px solid #134483 !important;}'
  +
  '.ms-border-color-neutralLight, .ms-bcl-nl, .ms-border-color-neutralLight-hover:hover, .ms-border-color-neutralLight-focus:focus, .ms-border-color-neutralLight-before::before, .ms-bcl-nl-h:hover, .ms-bcl-nl-f:focus, .ms-bcl-nl-b::before {border-color: #0e4184 !important;}'
  +
  '.ms-font-s, ._sug_u, ._sug_t {color: #92a7b9 !important;}'
  +
  '.popupShadow {border: 1px solid #1361ad !important;}'
  +
  '.modalBackground {background-color: #090f1a !important;}'
  +
  '.ms-border-color-neutralLighter, .ms-bcl-nlr, .ms-border-color-neutralLighter-hover:hover, .ms-border-color-neutralLighter-focus:focus, .ms-border-color-neutralLighter-before::before, .ms-bcl-nlr-h:hover, .ms-bcl-nlr-f:focus, .ms-bcl-nlr-b::before {border-color: #135e9e !important;}'
  +
  '.ms-bg-color-neutralLighter, .ms-bgc-nlr, .ms-bg-color-neutralLighter-hover:hover, .ms-bg-color-neutralLighter-focus:focus, .ms-bg-color-neutralLighter-before::before, .ms-bgc-nlr-h:hover, .ms-bgc-nlr-f:focus, .ms-bgc-nlr-b::before {background-color: #0c2036 !important;}'
  +
  '.subfolders div:hover {background: #0d1b2c !important;}'
  +
  '.ms-bg-color-neutralLight, .ms-bgc-nl, .ms-bg-color-neutralLight-hover:hover, .ms-bg-color-neutralLight-focus:focus, .ms-bg-color-neutralLight-before::before, .ms-bgc-nl-h:hover, .ms-bgc-nl-f:focus, .ms-bgc-nl-b::before {background-color: #104178 !important; color: #A4C0DB !important;}'
  +
  '.ms-font-color-neutralDark, .ms-fontColor-neutralDark, .ms-fcl-nd, .ms-font-color-neutralDark-hover:hover, .ms-font-color-neutralDark-focus:focus, .ms-font-color-neutralDark-before::before, .ms-fcl-nd-h:hover, .ms-fcl-nd-f:focus, .ms-fcl-nd-b::before {color: #c6d6de !important;}'
  +
  '.ms-border-color-themeLighter, .ms-bcl-tlr, .ms-border-color-themeLighter-hover:hover, .ms-border-color-themeLighter-focus:focus, .ms-border-color-themeLighter-before::before, .ms-bcl-tlr-h:hover, .ms-bcl-tlr-f:focus, .ms-bcl-tlr-b::before, ._sug_i, ._sug_k {border-color: #0F4475 !important;}'
  +
  '._sug_H {border-left: solid 1px #185ba7 !important;}'
  +
  '.ms-bg-color-themeLighterAlt, .ms-bgc-tlra, .ms-bg-color-themeLighterAlt-hover:hover, .ms-bg-color-themeLighterAlt-focus:focus, .ms-bg-color-themeLighterAlt-before::before, .ms-bgc-tlra-h:hover, .ms-bgc-tlra-f:focus, .ms-bgc-tlra-b::before {background-color: #081F33 !important;}'
  +
  '._n_15 {border-top: 1px solid #2a5ead !important;}'
  +
  '._n_d1, ._n_e1, ._n_r1 {border-left: #1462ba !important;}'
  +
  '._n_h {background-color: #0d2138 !important;}'
  +
  '._sug_i {border-bottom: 1px solid #1a4672 !important; color: #c5d4de !important;}'
  +
  '.__Microsoft_Owa_TriageShared_templates_cs_7:hover:not(.__Microsoft_Owa_TriageShared_templates_cs_a) {background-color: #10243f !important;}'
  +
  '._n_Z4, .ms-bg-color-neutralLighter, .ms-bgc-nlr, .ms-bg-color-neutralLighter-hover:hover, .ms-bg-color-neutralLighter-focus:focus, .ms-bg-color-neutralLighter-before::before, .ms-bgc-nlr-h:hover, .ms-bgc-nlr-f:focus, .ms-bgc-nlr-b::before {background-color: #09121d !important;}'
  +
  '.ms-font-color-neutralSecondary, .ms-fontColor-neutralSecondary, .ms-fcl-ns, .ms-font-color-neutralSecondary-hover:hover, .ms-font-color-neutralSecondary-focus:focus, .ms-font-color-neutralSecondary-before::before, .ms-fcl-ns-h:hover, .ms-fcl-ns-f:focus, .ms-fcl-ns-b::before {color: #82959e !important;}'
  +
  '.o365-search-box {border: 1px solid #146cb6 !important;}'
  +
  '.ms-bg-color-themeLighter, .ms-bgc-tlr, .ms-bg-color-themeLighter-hover:hover, .ms-bg-color-themeLighter-focus:focus, .ms-bg-color-themeLighter-before::before, .ms-bgc-tlr-h:hover, .ms-bgc-tlr-f:focus, .ms-bgc-tlr-b::before {background-color: #072041 !important;}'
  +
  '.ms-font-color-themeDarkAlt, .ms-fontColor-themeDarkAlt, .ms-fontColor-themeDarkAlt, .ms-fcl-tda, .ms-font-color-themeDarkAlt-hover:hover, .ms-font-color-themeDarkAlt-focus:focus, .ms-font-color-themeDarkAlt-before::before, .ms-fcl-tda-h:hover, .ms-fcl-tda-f:focus, .ms-fcl-tda-b::before {color: #116cd1 !important;}'
  +
  '.o365cs-nfd-fitem span, ._rp_r5 span, .rpHighlightAllClass span, .rpHighlightBodyClass span, .allowTextSelection span, ._rp_r5 td, .rpHighlightAllClass td, .rpHighlightBodyClass td, .allowTextSelection td {color: #C1D4EA !important;}'
  +
  'iframe#manifestLoaderFrame {opacity: .5 !important; background-color: #0d2138 !important;}'
  +
  '.headerMenuDropShadow {border: 1px solid #1463a7 !important; box-shadow: 3px 3px 6px -4px #0952a4,-3px 3px 6px -4px #146293 !important;}'
  +
  '.ms-font-color-black, .ms-fontColor-black, .ms-fcl-b, .ms-font-color-black-hover:hover, .ms-font-color-black-focus:focus, .ms-font-color-black-before::before, .ms-fcl-b-h:hover, .ms-fcl-b-f:focus, .ms-fcl-b-b::before {color: #bad8e9 !important;}'
  +
  '.modalPanelBackground {background-color: #09141e !important;}'
  +
  '.panelPopupShadow {border-left: 1px solid #0c4689 !important;}'
  +
  '.popupPanel, .activityIndicatorOverlay {background-color: #07254b !important;}'
  +
  '.owaimg, .csimg, .image-readingpane_off-png, #x_email_table {opacity: .9 !important; filter: brightness(.92) !important;}'
  +
  '#x_email_table {background: #0d243e !important;}'
  +
  ':root .swx.themeWhiteCompliant, :root .swx .themeWhiteCompliant {background-color: #051627 !important; fill: #051627 !important; color: #B3C7DA !important;}'
  +
  '._fp_Y:hover {background-color: #184987 !important;}'
  +
  '.ms-bg-color-neutralTertiaryAlt, .ms-bgc-nta, .ms-bg-color-neutralTertiaryAlt-hover:hover, .ms-bg-color-neutralTertiaryAlt-focus:focus, .ms-bg-color-neutralTertiaryAlt-before::before, .ms-bgc-nta-h:hover, .ms-bgc-nta-f:focus, .ms-bgc-nta-b::before {background-color: #0f1c30 !important;}'
  +
  '._mcp_j2, ._mcp_l2, ._mcp_m2 {background-color: #0d1824 !important;}'
  +
  '._av_61 {border-left: 1px solid #0f4c89 !important;}'
  +
  '.ms-font-l {color: #5da6ed !important;}'
  +
  '._av_Y1 {border: 2px solid #0e71c6 !important;}'
  +
  '._av_w {color: #B7D5E1 !important;}'
  +
  '.ms-bgc-nl, #_ariaId_250 {border-color: 1px solid #1662c5 !important;}'
  +
  '.ms-font-color-white, .ms-fontColor-white, .ms-fcl-w, .ms-font-color-white-hover:hover, .ms-font-color-white-focus:focus, .ms-font-color-white-before::before, .ms-fcl-w-h:hover, .ms-fcl-w-f:focus, .ms-fcl-w-b::before, .strong {color: #bacedd !important;}'
  +
  '.o365cs-nav-navMenu {background-color: rgb(13, 47, 77) !important;}'
  +
  ':root .swx.themeWhite, :root .swx .themeWhite, :root .swx .chat .conversationHeader .headerMain .roster .grid, :root .swx.short .chat .conversationHeader.active.editMode .contactPickerWrapper, :root .swx.narrow .chat .conversationHeader.active.editMode .contactPickerWrapper, :root .swx.medium .chat .conversationHeader.active.editMode .contactPickerWrapper {background-color: #112b4d !important; fill: #112b4d !important;}'
  +
  '.ContactsPage-heading {color: #C8D4DB !important;}'
  +
  ':root .swx.short .side, :root .swx.narrow .side {border-left: 1px solid #0A5584 !important;}'
  +
  ':root .swx .themeWhite.side::before {border-right: 1px solid #0b2644 !important;}'
  +
  ':root .swx .themeWhite.side .navigation .navItem:focus, :root .swx .themeWhite.side .navigation .navItem.focus, :root .swx .themeWhite.side .navigation .navItem:active, :root .swx .themeWhite.side .navigation .navItem.active {background-color: #0E548F !important;}'
  +
  '.swxContentOverlay {background-color: #081927 !important;}'
  +
  '.search .splitter {background-color: #1A627D !important;}'
  +
  ':root .swx .chat .conversationHeader::after, :root .swx .chat .conversationHeader.newConversationV2.editMode::after, .contactPickerInput {border-bottom: 1px solid #105772 !important;}'
  +
  'input {color: #D1E3EF !important;}'
  +
  ':root .swx.short .chat .conversationHeader .contactPickerWrapper, :root .swx.narrow .chat .conversationHeader .contactPickerWrapper, :root .swx.medium .chat .conversationHeader .contactPickerWrapper {border-top: 1px solid #1C6AAD !important;}'
  +
  '.contactPickerInput, .DialPad {border-bottom: 1px solid #123E71 !important; border-left: 1px solid #0A4F75 !important;}'
  +
  '.DialPad-key {background-color: #0a141b !important; border-top: 1px solid #1C67B1 !important; border-right: 1px solid #185F8C !important;}'
  +
  '.icon, ._pe_61 span, .allowTextSelection p, .ms-font-m {color: #C8D5E3 !important;}'
  +
  ':root .swx input, :root .swx button, :root .swx textarea, :root .swx select, .shareControlWrapper .title, :root .swx {color: #C8D4E0 !important;}'
  +
  '.contactPickerInput {border-top: 1px solid #0E5499 !important;}'
  +
  '.SelectBox-options {background-color: #0c3b6f !important; border: #0C5D99 1px solid !important; color: #C8D2DB !important;}'
  +
  ':root .swx .themeWhite.peoplePicker .recent:hover, :root .swx .themeWhite.peoplePicker .recent.hover, :root .swx .themeWhite.peoplePicker .recent:focus, :root .swx .themeWhite.peoplePicker .recent.focus, :root .swx .themeWhite.peoplePicker .searchItem:hover, :root .swx .themeWhite.peoplePicker .searchItem.hover, :root .swx .themeWhite.peoplePicker .searchItem:focus, :root .swx .themeWhite.peoplePicker .searchItem.focus {background-color: #0D4677 !important;}'
  +
  '.swx .chat, :root .swx .conversationHeader.showCover::after, :root .swx .conversationHistory.showCover::after, :root .swx .input.showCover::after {background-color: #0C1A23 !important;}'
  +
  ':root .swx .conversationHeader.showCover::after, :root .swx .conversationHistory.showCover::after, :root .swx .input.showCover::after {background-color: #0B1F27 !important;}'
  +
  '.border {border-top: 1px solid #105D96 !important;}'
  +
  '.swx .chat .input::before {border-top: 1px solid #0F5671 !important;}'
  +
  '.swx .shareControlWrapper {background: #091224 !important; border: 1px solid #0A395C !important;}'
  +
  '.swx .ContactsPage-hint {background-color: #0E5590 !important; color: #DDE9EE !important;}'
  +
  '._fce_51 {border: 1px solid #1566b4 !important;}'
  +
  '.ms-border-color-neutralTertiary, .ms-bcl-nt, .ms-border-color-neutralTertiary-hover:hover, .ms-border-color-neutralTertiary-focus:focus, .ms-border-color-neutralTertiary-before::before, .ms-bcl-nt-h:hover, .ms-bcl-nt-f:focus, .ms-bcl-nt-b::before {border-color: #145da4 !important;}'
  +
  '._mp_g {border-top: 1px solid #1d5f89 !important;}'
  +
  '._mp_E, .o365cs-mfp-skypePickerButton button {background: linear-gradient(to bottom, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 100%) !important; opacity: 1 !important;}'
  +
  '._mp_i {border-top: 1px solid #19619e !important; border-left: 1px solid #103a69 !important;}'
  +
  '.main_5a2b2aae {background-color: #0b1f30 !important;}'
  +
  '.ms-Fabric, .ms-font-m, .ms-font-xxl {color: #86b3e0 !important;}'
  +
  '.qjbZdNS-BeDNFcx5IWgt a:hover {background-color: #0d4a77 !important;}'
  +
  '._s_h {border-right: 1px solid #0c4c6f !important; border-left: 1px solid #214d78 !important;}'
  +
  '.root_5a2b2aae {border: 1px solid #0a4486 !important;}'
  +
  'hr, label.active {background-color: #154c8a !important; border-color: #0d468f !important;}'
  +
  '.chat .input::before {border-top: 1px solid #0C3B69 !important;}'
  +
  '._cp_o {background: #0e2a4a !important; color: #B7CEE3 !important;}'
  +
  '.ms-bg-color-neutralLighterAlt, .ms-bgc-nlra, .ms-bg-color-neutralLighterAlt-hover:hover, .ms-bg-color-neutralLighterAlt-focus:focus, .ms-bg-color-neutralLighterAlt-before::before, .ms-bgc-nlra-h:hover, .ms-bgc-nlra-f:focus, .ms-bgc-nlra-b::before {background-color: #134a78 !important;}'
  +
  '._wx_N1 {background: #0f2d6b !important;}'
  +
  '.peekPopup {background-color: #0b1e30 !important;}'
  +
  '._ni2_e {background-color: rgb(14, 27, 42) !important;color: rgb(203, 214, 222) !important;}'
  +
  '._lw_9:hover {background-color: #0e264b !important;}'
  +
  '._lw_g {border-bottom-color: #0b3462 !important;}'
  +
  '._ni2_2, ._ni2_3, .ms-bg-color-white, ._ic_p, ._n_f3, ._n_g3 {border-color: rgb(39, 107, 164) !important;}'
  +
  '._wx_51 div div {background-color: rgba(11, 22, 38, 0.6) !important;}'
  +
  '._co_n {border-right: 1px solid #0b416f !important;}'
  +
  '._cb_o1 {background-color: rgb(12, 75, 116) !important; color: rgb(180, 195, 209) !important; background-color: rgb(13, 101, 91) !important; color: rgb(193, 216, 221) !important;}'
  +
  '._cb_l1 {opacity: 1; background-color: rgb(17, 86, 144) !important;}'
  +
  '.calendarBusy {background-color: rgb(28, 108, 174) !important;}'
  +
  '._cb_z1 {color: rgb(184, 197, 206) !important; background-color: rgb(7, 55, 90) !important;}'
  +
  '._ph_W1, ._ph_X1 {border-left: 1px solid #143f63 !important;}'
  +
  '._pe_d2, ._f_m5 {background: #123665 !important;}'
  +
  '.ms-font-weight-regular, ._rpc_C1, ._rpc_N, ._rpc_B1, ._rpc_P, ._rpc_B1, .sn_profedit_sc_column, .sn_dt_name, .sn_profedit_sc_title,, .sn_dt_tellus, .TextLight,  {color: #B6C7DD !important;}'
  +
  '._ph_d._ph_f:hover, ._ph_f:hover, ._ph_f:hover ._ph_2 {background-color: #183b69 !important;}'
  +
  ':root input[type="text"], :root input[type="password"], :root input[type="email"], :root input[type="number"], :root input[type="tel"], :root input[type="search"], :root select, :root textarea {border-color: #0e3a89 !important; background: #0f2138 !important; color: #DDE !important;}'
  +
  '.sn_dt_section_header, .sn_dt_name {color: #CCD !important;}'
  +
  '._rp_s5 {opacity: .78 !important;}'
);