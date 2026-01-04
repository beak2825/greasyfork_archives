// ==UserScript==
// @name         ECNU autoLogin(need Chrome or FireFox)
// @namespace    https://github.com/Chains-Z
// @version      0.3.0
// @description  华东师范大学统一身份认证自动识别填写验证码并登陆脚本
// @require      https://cdn.bootcdn.net/ajax/libs/tesseract.js/2.1.2/tesseract.min.js
// @author       Chains-Z
// @license      MIT
// @include      https://portal1.ecnu.edu.cn/cas/login*
// @exclude      http://portal.ecnu.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/428868/ECNU%20autoLogin%28need%20Chrome%20or%20FireFox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428868/ECNU%20autoLogin%28need%20Chrome%20or%20FireFox%29.meta.js
// ==/UserScript==

(function() {
    'use strict'
    if (self == top) {
        let img = document.getElementById("codeImage")
        Tesseract.recognize(
            img.src,
            'eng', {}
        ).then(({
            data: {
                text
            }
        }) => {
           // GM_log(text);
            let title = document.getElementById("code")
            title.value = text
            let btn = document.getElementById("index_login_btn")
            //let un = document.getElementById("un")
            GM_log(btn)
            //GM_log(un.value)
            btn.click()
        })
}
})();