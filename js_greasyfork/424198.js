// ==UserScript==
// @name         memorytvb signin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  signin memorytvb
// @author       sdfsung
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @match        https://www.memorytvb.com/plugin.php?id=wq_sign*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/424198/memorytvb%20signin.user.js
// @updateURL https://update.greasyfork.org/scripts/424198/memorytvb%20signin.meta.js
// ==/UserScript==

(function() {
  'use strict';

  waitForKeyElements('.wqpc_sign_btna a', jNode => {
    console.log('ok...');
    const btn = jNode[0];
    console.log(btn.textContent);
    const btntxt = btn.textContent;
    if(btntxt.indexOf('未签到') !== -1) {
      btn.click();
      waitForKeyElements('button.wqpc_button', jNode => {
        const sbtn = jNode[0];
        console.log(sbtn.innerText);
        setTimeout(() => {
          sbtn.click();
        }, 250);
      }, true);
    } else if(btntxt.indexOf('已签到') !== -1) {
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, true);
})();