// ==UserScript==
// @name         ptAFK
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  a simple afk script.
// @author       You
// @match        https://*.pony.town
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456432/ptAFK.user.js
// @updateURL https://update.greasyfork.org/scripts/456432/ptAFK.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // auto login
  setInterval(function () {
    let version_update_btn = document.getElementsByClassName("btn-sm");
    if (version_update_btn) {
        version_update_btn[0].click();
        version_update_btn = null;
    }
    let update_btn = document.getElementsByClassName("btn btn-wide btn-outline-secondary");
    if (update_btn) {
        update_btn[0].click();
        update_btn = null;
    }
    let login_btn = document.getElementsByClassName("btn btn-lg btn-success text-ellipsis flex-grow-1");
    if(login_btn) {
      login_btn[0].click();
      login_btn = null;
    }
  }, 60000);
})();

(function() {
  'use strict';
  // AFK
  setInterval(function () {
    let click_btn = document.getElementsByClassName("btn btn-lg btn-success text-ellipsis flex-grow-1");
    if(!click_btn.length) {
      click_btn = document.getElementsByClassName("link-plain chat-log-tab");
    }
    if(!click_btn.length) {
      click_btn = document.getElementsByClassName("btn btn-sm btn-outline-default");
    }
    click_btn[0].click();
  }, 60000 + Math.ceil(Math.random() * 100000));
})();