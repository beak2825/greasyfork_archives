// ==UserScript==
// @name        Compact Google Translate
// @description A bunch of styles to display a more compact Google Translate page.
// @namespace   herom
// @include     https://translate.google.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/386949/Compact%20Google%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/386949/Compact%20Google%20Translate.meta.js
// ==/UserScript==
function addGMStyles(styleStr) {
  var head = document.getElementsByTagName('head')[0];
  
  var newTag = document.createElement('style');
  newTag.type = "text/css";
  newTag.innerHTML = styleStr;
  head.appendChild(newTag);
}

addGMStyles (
  '#gb, #gba, #gt-appbar, #gt-ft, #gt-ft-res { display: none; }' +
  '#src-translit { display: none; }' +
  '#gt-src-c { padding-bottom: 0; }' + 
  /**/
  'body > .frame { height: 100%; }' +
  '.page > .input-button-container { display: none; }' +
  '.gp-footer { display: none; }' +
  '.feedback-link { display: none; }' +
  '.gt-lc.gt-lc-mobile .gt-cd-mmd .gt-cd-t, .gt-lc.gt-lc-mobile .gt-cd-mbd .gt-cd-t { display: none; }' +
  '.result-shield-container { padding-right: 0; }' +
  '.starbutton { display: none; }' +
  '.sl-wrap, .tl-wrap, .sl-more, .tl-more { height: 36px; }' +
  '.ls-wrap .sugg-fade { height: 34px; }' +
  '.ls-wrap { top: -36px; height: 36px; }' +
  '.swap.jfk-button { height: 34px; line-height: 36px; }' +
  '.main-header { padding-top: 36px; }' +
  '.sl-sugg .goog-inline-block.jfk-button, .tl-sugg .goog-inline-block.jfk-button { font-size: 12px; height: 34px; line-height: 36px; padding: 0 16px; }' +
  '.sl-sugg { height: 60px; max-width: calc(100% - 36px - 25px); }' +
  '.result-rtl { font-family: IranSans, Iranian Sans; }' +
  '[style="direction: rtl;"] { font-family: Tahoma; font-size: 10pt; }' +
  '.gt-lc-mobile div.gt-baf-translations { margin: 6px; }' +
  '.epu-dt .frame { overflow-y: auto; }' +
  '.epu-dt .gt-lc-mobile .gt-baf-entry-clickable > td,' +
  '.epu-dt .gt-lc-mobile .gt-baf-entry > td { padding-left: 8px; }'
  /******** More Compact **********/
  + '.gt-lc.gt-lc-mobile .gt-def-list { margin-left: 24px; margin-right: 5px; }' +
  '.gt-lc.gt-lc-mobile .gt-def-num { left: 6px; width: 15px; height: 15px; font-size: 11px; line-height: 15px; margin-top: 2px; }' +
  '.epu-dt .gt-lc.gt-lc-mobile .gt-cd-cl, .epu-dt .gt-lc.gt-lc-mobile .gt-rw-div .gt-cd-cl { font-size: 12px; }' +
  '.gt-lc.gt-lc-mobile .gt-cd { padding-top: 8px; }' +
  '.gt-lc-mobile div.gt-baf-translations { font-size: 12px; line-height: 20px; }' +
  '.gt-baf-term-text-parent { line-height: 20px; }' +
  '.epu-dt .gt-lc-mobile .gt-baf-entry-clickable > td, .epu-dt .gt-lc-mobile .gt-baf-entry > td { vertical-align: baseline; }' +
  '.source-input-tools, .epu-dt .character-count { display: none; }' +
  '.go-wrap { display: none; }' +
  '.source-wrap { padding-bottom: 44px; }' +
  '.source-or-target-footer { height: 36px; }'
  
);
