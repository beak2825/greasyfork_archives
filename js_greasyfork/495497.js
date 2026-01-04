// ==UserScript==
// @name         显示密码框中的原密码
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  点击密码框后，被符号所替代密码就会显示为原密码
// @author       forward
// @match        file:///D:/VsCodeProjects/test/auto_display_password.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @match        *://*/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.slim.min.js
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @nocompat     Chrome
// @downloadURL https://update.greasyfork.org/scripts/495497/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E6%A1%86%E4%B8%AD%E7%9A%84%E5%8E%9F%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/495497/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E6%A1%86%E4%B8%AD%E7%9A%84%E5%8E%9F%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function () {
        var passwordInputs = $('input[type=password]');
        passwordInputs.on('click', function (event) {
            passwordInputs.attr('type','text')
        });
    })
    // Your code here...
})();