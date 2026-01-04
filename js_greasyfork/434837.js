// ==UserScript==
// @name         Neu auto forward
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto forward to identity auth page from ipgw pages
// @author       You
// @match        *://202.118.1.87/srun_portal_pc*
// @match        *://ipgw.neu.edu.cn/srun_portal_pc*
// @match        *://202.118.1.87/srun_portal_phone*
// @match        *://ipgw.neu.edu.cn/srun_portal_phone*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434837/Neu%20auto%20forward.user.js
// @updateURL https://update.greasyfork.org/scripts/434837/Neu%20auto%20forward.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // var button = document.querySelector("a[class='btn btn-outline-dark btn-block']");
    // var button = document.getElementById('login-sso');
    // button.focus();
    // button.click();
    Portal.redirect('/srun_portal_sso');
    // window.location.href = 'https://pass.neu.edu.cn/tpass/login?service=https%3A%2F%2Fipgw.neu.edu.cn%2Fsrun_cas.php%3Fac_id%3D15'
})();