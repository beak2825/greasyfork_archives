// ==UserScript==
// @name        madescurc.eu
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.4
// @author      -
// @description 12/07/2021, 00:04:36
// @match       https://*.madescurc.eu/*
// @match       https://*.check24.de*/*
// @downloadURL https://update.greasyfork.org/scripts/430158/madescurceu.user.js
// @updateURL https://update.greasyfork.org/scripts/430158/madescurceu.meta.js
// ==/UserScript==

const googleTranslateElementInitCode = function () {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'de',
      layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      includedLanguages: 'ro,en,pl'
    },
    'google_translate_element');
}

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.innerHTML = css;
  head.appendChild(style);
}


function injectGoogleTranslateWidget() {


  var gtdiv = document.createElement("div");
  gtdiv.setAttribute("id", "google_translate_element");
  document.body.prepend(gtdiv);

  var globalFunctionScript = document.createElement('script');
  globalFunctionScript.text = "googleTranslateElementInit = " + googleTranslateElementInitCode.toString();
  globalFunctionScript.type = "text/javascript";
  document.getElementsByTagName('head')[0].appendChild(globalFunctionScript);

  var bg_script = document.createElement('script');
  bg_script.type = "text/javascript";
  bg_script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.getElementsByTagName('head')[0].appendChild(bg_script);

  addGlobalStyle(
    '.goog-te-banner-frame.skiptranslate {\
      display: none !important; \
    } \
    body {\
      top: 0px !important; \
    }');

}

if ((window.self !== window.top)) {
  // Only in frames
  injectGoogleTranslateWidget();
}