// ==UserScript==
// @name         KU 관리프로그램 외부접속
// @namespace    http://tampermonkey.net/
// @version      1.0.0.0
// @description  yeah you know
// @author       You
// @match        https://infodepot.korea.ac.kr/csr/CsrSoftware_intro.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539903/KU%20%EA%B4%80%EB%A6%AC%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8%20%EC%99%B8%EB%B6%80%EC%A0%91%EC%86%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/539903/KU%20%EA%B4%80%EB%A6%AC%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8%20%EC%99%B8%EB%B6%80%EC%A0%91%EC%86%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.frm1.user_type.value = "AIP_AUSR";
        document.frm1.action="CsrSoftware_pre.jsp"
        document.frm1.submit();
    // Your code here...
})();