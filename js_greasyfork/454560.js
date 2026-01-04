// ==UserScript==
// @name         ASEauto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  my ASEauto
// @author       You
// @match		     https://servicedesk.yydg.com.cn/esp/iamRealm
// @match        https://iam.pouchen.com/auth/realms/pcg/login-actions/authenticate?*
// @match        https://iam.pouchen.com/auth/realms/pcg/protocol/openid-connect/auth*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pouchen.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454560/ASEauto.user.js
// @updateURL https://update.greasyfork.org/scripts/454560/ASEauto.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getclick(spath) {
    const p = spath;
    const b = document.querySelector(p);
    console.log(b);
    if (b) {
      b.click();
    }
  }

  if (/iamRealm/.test(location.href)) {
    //点击
    const btn = "#root > div > div > div.login-content > button:nth-child(1)";
    getclick(btn);
  } else if (/execution/.test(location.href)) {
    //密码
    const passp = "#password";
    const pass = document.querySelector(passp);
    console.log(pass);
    if (pass) {
      pass.value = "User0354*";
    }
    const nextbtnp2 = "#kc-login";
    getclick(nextbtnp2);
  } else if (
    /client_id/.test(location.href) ||
    /response_type=code/.test(location.href)
  ) {
    //账号
    const nextbtnp = "#kc-login";
    getclick(nextbtnp);
  }
})();
