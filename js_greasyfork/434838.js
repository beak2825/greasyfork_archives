// ==UserScript==
// @name         Neu auto login
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto login Neu identity auth
// @author       You
// @match        *://pass.neu.edu.cn/tpass/login*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434838/Neu%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/434838/Neu%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.getElementById('un').value=''; // 填写自己的学号
    document.getElementById('pd').value=''; // 填写自己的统一身份认证密码
    login();
})();