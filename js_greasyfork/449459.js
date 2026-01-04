// ==UserScript==
// @name         copy CSDN code
// @namespace    https://www.beihuolang.net
// @version      0.1
// @description  free copy csdn code !
// @author       superhan
// @match        https://blog.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449459/copy%20CSDN%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/449459/copy%20CSDN%20code.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let codes = document.querySelectorAll("code");
  codes.forEach((c) => {
    c.contentEditable = "true";
  });
  document.designMode = "off";
})();
