// ==UserScript==
// @name         userstyles.org - Auto Enable Source Editor
// @namespace    https://greasyfork.org/users/649
// @version      1.1.0
// @description  auto enables the source editor on userstyles.org
// @author       Adrien Pyke
// @match        *://userstyles.org/d/styles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22361/userstylesorg%20-%20Auto%20Enable%20Source%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/22361/userstylesorg%20-%20Auto%20Enable%20Source%20Editor.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.querySelector('#enable-source-editor-code').click();
})();
