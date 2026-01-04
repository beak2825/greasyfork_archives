// ==UserScript==
// @name         qqsg查询自动登录
// @namespace    https://github.com/wanglz111/qqsg-tampermonkey
// @version      1.1
// @description  自动登录qqsg查询，用本人提供的token
// @author       Lucas
// @license      MIT
// @match        https://*.pc9527.vip/*
// @match        https://qqsg.pc9527.vip/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pc9527.vip
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458643/qqsg%E6%9F%A5%E8%AF%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/458643/qqsg%E6%9F%A5%E8%AF%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!unsafeWindow.localStorage || !unsafeWindow.localStorage.saveData || JSON.parse(unsafeWindow.localStorage.saveData).isLogin == false){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://jsonbase.com/lucascool/saveData",
            onload: function(response) {
                unsafeWindow.localStorage.saveData = response.responseText;
                unsafeWindow.location.reload();
            }
        });
    } else {
        console.log("已经登陆")
    }

})();