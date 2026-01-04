// ==UserScript==
// @name         Google Translate Dark
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dark theme for Google Translate
// @author       @karakoyunselcuk
// @match        https://translate.google.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391378/Google%20Translate%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/391378/Google%20Translate%20Dark.meta.js
// ==/UserScript==

GM_addStyle("body { background-color: #212121 }");
GM_addStyle(".result { background-color: #212121 }");
GM_addStyle(".orig { color: #C3C3C3 }");
GM_addStyle(".ita-kd-dropdown-menu { background-color: #212121 }");
GM_addStyle(".tlid-translation.translation { color: #C3C3C3 }");
GM_addStyle(".trans-verified-button { background-image: url('https://ssl.gstatic.com/images/icons/material/system_gm/1x/verified_user_white_24dp.png') }");
GM_addStyle(".jfk-button-img { filter: brightness(0) invert(1) }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-cd { background-color: #282828; border-color: #000 }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-cc-r-i { background: none !important } ");
GM_addStyle(".gt-card-ttl-txt, .gt-def-row { color: #F1F1F1 }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-def-example, .gt-lc.gt-lc-mobile .cd-expand-label, .gt-cd-pos-pop { color: #777 }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-def-num { color: #777; border-color: #777 }");
GM_addStyle(".gt-baf-word-clickable { color: #F1F1F1 }");
GM_addStyle(".gt-lc-mobile div.gt-baf-translations { color: #C3C3C3 }");
GM_addStyle(".gt-lc-mobile .gt-baf-word-clickable:hover, .gt-baf-word-clickable:hover, .gt-baf-back:hover { background-color: #434343, color: #F1F1F1}");
GM_addStyle(".ft-icon-oval { background-color: #171717 }");
GM_addStyle(".language-list, .language-list-search-box, #sl_list-search-box, #tl_list-search-box, .language_list_sl_list, .language_list_tl_list, .language_list_item_wrapper { background-color: #212121; color: #FFF }");
GM_addStyle(".language_list_item_language_name { color: #F1F1F1 }");
GM_addStyle(".language_list_item_wrapper:hover, .language_list_item_wrapper:focus { background-color: #282828 }");
GM_addStyle(".language_list_item_wrapper.item-selected { background-color: #242424 }");
GM_addStyle(".language_list_section { background: none }");
GM_addStyle(".homepage.translate-text .input-button.text-icon, .homepage.translate-docs .input-button.documents-icon { background-color: rgba(129, 139, 157, 0.12); border-color: #666 }");
GM_addStyle(".header-button { border-color: #666 }");
GM_addStyle(".input-button.text-icon::before, .input-button.documents-icon::before { filter: brightness(0) invert(1) }");
GM_addStyle(".language_list_item_wrapper.item-emphasized:not(.item-selected) .language_list_item_icon { background-image: url('https://ssl.gstatic.com/images/icons/material/system_gm/1x/history_white_20dp.png') }");
GM_addStyle(".ita-kd-dropdown-menu { background-color: #0E0E0E !important }");
GM_addStyle(".ita-kd-dropdown-menu .ita-kd-menuitem-hover { background-color: #212121 !important; color: #FFF !important }");
GM_addStyle(".ita-kd-menuitem { color: #F1F1F1 !important; padding-bottom: 13px !important }");
GM_addStyle(".language-list-toolbar { border-color: rgb(56, 56, 56) }");
GM_addStyle(".trans-edit, .trans-target-highlight { background-color: #333 !important }");
GM_addStyle(".gt-cc-t { background-color: #282828 }");
GM_addStyle(".gt-lc.gt-lc-mobile.show-as-one-card { background-color: #282828, border: none }");
GM_addStyle(".gt-cc-t .gt-ct-text { color: #FFF }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-def-synonym-title { color: rgba(255, 255, 255, 0.54) }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-ex-text { color: rgba(255, 255, 255, 0.87) }");
GM_addStyle(".gt-lc.gt-lc-mobile .gt-cd-cl, .gt-lc.gt-lc-mobile .gt-cd-ncl { background: #191919; border-color: #1F1F1F; color: rgba(255, 255, 255, 0.7); }");
GM_addStyle(".gt-lc.show-as-one-card .gt-cc-r, .gt-lc.show-as-one-card .gt-cc-l { border: none }");
GM_addStyle(".gt-lc.gt-lc-mobile.show-as-one-card { background-color: #282828; border: none }");
GM_addStyle(".gt-lc-mobile .gt-baf-word-clickable:hover { background-color: #474747 }");
GM_addStyle(".gt-is-mobile { background-color: #272727; border-color: #343434 }");
GM_addStyle(".gt-is-mobile .gt-is-sg { color: rgba(255, 255, 255, 0.87) }");
GM_addStyle(".gt-is-tr { color: rgba(255, 255, 255, 0.54) }");
GM_addStyle(".gt-is-itm.gt-is-itm-hover { background-color: rgb(20, 20, 20, 0.50) }");
GM_addStyle(".gt-is-mobile .gt-is-ld { border-color: #121212 }");
GM_addStyle(".ft-icon-txt { color: #F1F1F1 }");
GM_addStyle("#gb { background-color: rgb(23, 23, 23) !important }");
GM_addStyle(".header-button { color: #F1F1F1 }");
GM_addStyle(".ls-wrap .sugg-fade { background: linear-gradient(to right,rgba(0, 0, 0, 0),rgb(34, 34, 34)) }");
GM_addStyle(".ls-wrap { background-color: #272727 }");
GM_addStyle(".sl-sugg .goog-inline-block.jfk-button, .tl-sugg .goog-inline-block.jfk-button { color: rgb(165, 165, 165) }");
GM_addStyle(".sl-sugg .goog-inline-block.jfk-button-checked, .tl-sugg .goog-inline-block.jfk-button-checked { color: #4285F4 }");
GM_addStyle(".swap-wrap, .swap.jfk-button { background-color: #646464 }");
GM_addStyle(".swap-wrap:hover, .swap.jfk-button:hover { background-color: #474747 }");
GM_addStyle(".source-wrap, .source-input, .orig, .orig:disabled { background-color: #212121 }");
GM_addStyle("#spelling-correction { background-color: #212121; color: #868686 }");
GM_addStyle(".ttsbutton .jfk-button-img { background-position: 0 -360px }");
GM_addStyle(".results-container:not(.empty) .placeholder, .result-dict-wrapper .translation, .contribute-target, #st-buttons .jfk-button { color: #F1F1F1 }");
GM_addStyle(".frame:before { background-color: #212121 }");
GM_addStyle(".results-container, .result, .gt-edit, .contribute-target, body:not(.with-lang-list) .results-container.empty { background-color: #2B2B2B }");
GM_addStyle(".ls-wrap .sl-sugg .goog-inline-block.jfk-button:focus, .ls-wrap .tl-sugg .goog-inline-block.jfk-button:focus, .ls-wrap .sl-more:focus, .ls-wrap .tl-more:focus, .ls-wrap .lang-btn:focus-within, .ls-wrap .swap:focus { background-color: #323232 }");
GM_addStyle(".select-file-page { background-color: #272727 }");
GM_addStyle(".select-file-section .choose-document-prompt { color: #F1F1F1 }");
GM_addStyle(".select-file-section .upload-filetypes-prompt { color: rgba(255, 255, 255, 0.54) }");
GM_addStyle(".gt-lc.gt-lc-mobile.show-as-one-card .gt-cc { border-color: #4D4D4D }");
GM_addStyle(".st-stp1-epu-text { background-color: #212121 }");
GM_addStyle(".sl-sugg .goog-inline-block.jfk-button-checked, .tl-sugg .goog-inline-block.jfk-button-checked, .gt-lc.gt-lc-mobile .gt-cd-pos, .gt-lc.gt-lc-mobile .gt-rw-div .gt-cd-cl { color: #FF8C00 }");
GM_addStyle(".goog-inline-block.jfk-button-checked:after { border-color: #FF8C00 }");
GM_addStyle(".filled.gt-score-dot { background-color: #FF8C00 }");
GM_addStyle(".language_list_item_wrapper.item-selected .language_list_item { color: #FF8C00 }");
GM_addStyle(".language_list_item_wrapper.item-selected .language_list_item_icon { filter: brightness(0) invert(1) }");
GM_addStyle(".gt-baf-word-selected { background-color: #BEBEBE; padding: 0px 4px 1px 4px; border-radius: 3px; }");
GM_addStyle(".gt-spell-icon { filter: brightness(1) invert(1) }");
GM_addStyle(".gt-spell-correct-message i, .gt-spell-correct-message a { color: #FF8C00 !important }");
GM_addStyle(".gt-is-mobile .gt-is-ca { filter: invert(1) }");
GM_addStyle("#spelling-correction a, #spelling-correction b, #spelling-correction i { color: #FF8C00 }");
GM_addStyle(".moremenu { background-color: #282828 }");
GM_addStyle(".moremenu .goog-menuitem-content { color: #C3C3C3 }");
GM_addStyle(".moremenu .goog-menuitem:hover { background-color: #474747 }");
GM_addStyle(".moremenu .goog-menuitem:hover .goog-menuitem-content { color: #F1F1F1 }");