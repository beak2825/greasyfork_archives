// ==UserScript==
// @name        Minimal UI for Otter.ai
// @namespace   Violentmonkey Scripts
// @match       https://otter.ai/*
// @description Minimize the UI for Otter.ai recordings to make it easier to use for real-time captions on video calls and other tools. Fragile, as it depends on the Otter CSS.
// @grant       none
// @version     1.0
// @author      Quinn Keast @quinnkeast
// @downloadURL https://update.greasyfork.org/scripts/401807/Minimal%20UI%20for%20Otterai.user.js
// @updateURL https://update.greasyfork.org/scripts/401807/Minimal%20UI%20for%20Otterai.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(`
  .otter-nav-bar,
  .otter-head-bar,
  .otter-recording-container__head,
  .maximized-content-container__add-photo,
  .maximized-content-container__comment,
  .maximized-content-container__highlighting,
  .head-bar__share-button,
  .otter-recording-bar__shadow,
  .otter-recording-container__head,
  .otter-recording-container__comments { 
    display: none!important;
  }
  
  .otter-main-content {
    margin-top: 1rem!important;
    margin-right: 1rem!important;
    margin-left: 1rem!important;
  }

  .otter-recording-bar {
    bottom: 0!important;
  }

  .foot__maximized-recording-button.--pause-action {
    display: none!important;
  }

  .foot__maximized-recording-button.--stop-action {
    width: 48px!important;
    height: 24px!important;
  }

  .foot__maximized-recording-button .mat-icon {
    width: 12px!important;
    height: 12px!important;
    font-size: 12px!important;
    line-height: 12px!important;
  } 

  .transcript-snippet__content__body__sentance {
    padding: 0!important;
  }

  .maximized-content-container__foot {
    justify-content: center!important;
  }

  .conversation-transcript-snippet-container {
    padding: 0 2rem!important;
  }

  .transcript-snippet__content__head {
    display: none!important;
  }

  .transcript-snippet__content-container {
    padding-top: 0!important;
  }

  .recording-visualization-container {
    position: relative!important;
    width: 120px!important;
  }
`);