// ==UserScript==
// @name         Taobao - Hide register modal by Luhari
// @namespace    https://www.fiverr.com/users/luhari
// @version      0.1
// @description  Hides the register modal in any subdomain of taobao.com
// @author       Luhari | @luhari98 commission
// @match        *.taobao.com/*
// @grant        none
// @create       2021-04-09
// @supportURL   https://bit.ly/322lDpO
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424785/Taobao%20-%20Hide%20register%20modal%20by%20Luhari.user.js
// @updateURL https://update.greasyfork.org/scripts/424785/Taobao%20-%20Hide%20register%20modal%20by%20Luhari.meta.js
// ==/UserScript==


(function() {
  'use strict';
  setTimeout(tryToHideModal, 1000);
})();

function tryToHideModal() {
  let modal = document.getElementsByClassName('baxia-dialog auto')[0];

  if (modal) {
    modal.style.display = 'none';
  }

 
  if (!modal || modal.style.display !== 'none') setTimeout(tryToHideModal, 500);
}

