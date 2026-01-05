// ==UserScript==
// @name         userstyles.org - auto select keep me logged in
// @namespace    https://greasyfork.org/users/649
// @version      1.1
// @description  Auto checks keep me logged in on userstyles.org
// @author       Adrien Pyke
// @match        *://userstyles.org/d/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22419/userstylesorg%20-%20auto%20select%20keep%20me%20logged%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/22419/userstylesorg%20-%20auto%20select%20keep%20me%20logged%20in.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.querySelector('#remember-openid').checked = true;
  document.querySelector('#remember-normal').checked = true;
})();
