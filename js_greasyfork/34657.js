// ==UserScript==
// @name         AOJLanguageSetting
// @namespace    https://Luzhiled.github.io
// @version      1.1
// @author       Luzhiled
// @description  ja
// @include      *judge.u-aizu.ac.jp/onlinejudge/status.jsp*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/34657/AOJLanguageSetting.user.js
// @updateURL https://update.greasyfork.org/scripts/34657/AOJLanguageSetting.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let submit_language = document.getElementById('submit_language').childNodes;
  function check() {
    for (let i = 0; i < submit_language.length; ++i) {
      if (submit_language[i].selected) {
        if (GM_getValue("submit_language", 4) != i) {
          console.log(`change language\n${submit_language[GM_getValue("submit_language", 4)].value} -> ${submit_language[i].value}`);
        }
        GM_setValue("submit_language", i);
      }
    }

    setTimeout(function(){check();}, 100);
  }

  submit_language[GM_getValue("submit_language", 4)].selected = true;
  check();
})();
