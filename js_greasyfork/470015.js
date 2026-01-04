// ==UserScript==
// @name         OurXes-复
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  保护安全
// @author       林林@lyl_123
// @license      GPL-3.0
// @match        https://code.xueersi.com/ide/codenoheader/*
// @icon         https://static0.xesimg.com/talcode/assets/logo.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470015/OurXes-%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/470015/OurXes-%E5%A4%8D.meta.js
// ==/UserScript==

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
      }else if(t == '/api/compilers/save' || t == 'https://code.xueersi.com/api/compilers/save'){
        originOpen.call(
          this,
          e,
          'data:application/json,{"message": "被OurXes-复拦截","status_code": 400}',
          n
        )
    }else{
        originOpen.call(this, e, t, n)
      }
    }
})();