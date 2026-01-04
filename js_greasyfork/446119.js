// ==UserScript==
// @name         ss-shopline店铺自动处理密码保护
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ss-shopline店铺自动处理密码保护，不想测试经常换店铺还得输入密码！
// @author       CShWen
// @match        *://*/password?redirect_url=*
// @match        *://*/password
// @match        *://*/password?
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js

// @downloadURL https://update.greasyfork.org/scripts/446119/ss-shopline%E5%BA%97%E9%93%BA%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E5%AF%86%E7%A0%81%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/446119/ss-shopline%E5%BA%97%E9%93%BA%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E5%AF%86%E7%A0%81%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_xmlhttpRequest({
        method: "GET",
        url: "/leproxy/api/merchant/store/front/pwd",
        onload: function (response) {
            if (response.status == 200) {
                let pwd = JSON.parse(response.response).data.password;

                $(".form-control").val(pwd);
                $(".btn-primary").trigger("click");
            }
        }
    });
})();