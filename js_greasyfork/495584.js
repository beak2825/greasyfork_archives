// ==UserScript==
// @name         suizhikuo-load-jquery
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  加载jquery脚本
// @author       随智阔
// @match	     *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495584/suizhikuo-load-jquery.user.js
// @updateURL https://update.greasyfork.org/scripts/495584/suizhikuo-load-jquery.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // debugger;
    console.log("篡改猴(Tampermonkey)脚本 ---> 加载query-3.7.1.js ---> 完成");

    // 加载一个弹框
    if (confirm("jquery已经加载")) {
        window.alert("jquery已经加载");
    } else {
        window.alert("jquery已经加载");
    }
})();