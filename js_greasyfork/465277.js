// ==UserScript==
// @name         OurXes-唯
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  部分破解唯C
// @author       林林@lyl_123
// @license      GPL-3.0
// @match        https://code.xueersi.com/*
// @icon         https://static0.xesimg.com/talcode/assets/logo.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465277/OurXes-%E5%94%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/465277/OurXes-%E5%94%AF.meta.js
// ==/UserScript==
//不得不说，凌是真的6，我查了不少资料又看了看他的代码才写出来这个
(function () {
    const originOpen = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (e, t, n) {
      if (t == '/api/index/shequ/permission_level') {
        originOpen.call(
          this,
          e,
          'data:application/json,{"stat":1,"status":1,"msg":"","data":{"permission_level":"8"}}',
          n
        )
      }else{
        originOpen.call(this, e, t, n)
      }
    }
})();