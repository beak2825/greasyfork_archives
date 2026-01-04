// ==UserScript==
// @name         VivifyGmail
// @namespace    https://github.com/jonas0616/vivifygmail
// @version      0.1.3
// @description  Keep your POP3 account in Gmail up to date
// @author       jonas0616
// @grant        none
// @include      https://mail.google.com/*
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/33433/VivifyGmail.user.js
// @updateURL https://update.greasyfork.org/scripts/33433/VivifyGmail.meta.js
// ==/UserScript==

(function () { // eslint-disable-line func-names
  'use strict'; // eslint-disable-line

  function refresh(refreshUrl) {
    // console.log(`VivifyGamil: refresh ${refreshUrl}`);
    const fetchInit = {
      method: 'POST',
      headers: new Headers(),
      credentials: 'include',
    };
    fetch(refreshUrl, fetchInit).then(data => {
      // console.log(data);
    }).catch(e => {
      console.log(e);
    });
  }

  Promise.resolve()
    .then(() => new Promise((resolve) => {
      const id = setInterval(() => {
        if (window.GM_ACTION_TOKEN !== undefined &&
            window.GLOBALS !== undefined) {
          clearInterval(id);
          resolve();
        }
      }, 5000);
    }))

    .then(() => {
      const l = window.location;
      const url = `${l.origin}${l.pathname}`;
      const at = window.GM_ACTION_TOKEN;
      const ik = window.GLOBALS[9];
      const refreshUrl = `${url}?ik=${ik}&&at=${at}&view=up&act=par&rt=j`;

      refresh(refreshUrl);
      // repeat by one minute
      window.setInterval(refresh, 60000, refreshUrl);
    });
}());
