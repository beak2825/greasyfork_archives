// ==UserScript==
// @name         netdisk.baidu
// @namespace    https://greasyfork.org/users/367986
// @version      0.1
// @description  百度网盘批量离线脚本
// @author       Orzm
// @match        http*://pan.baidu.com/disk/home*
// @match        http*://yun.baidu.com/disk/home*
// @run-at       document-start
// @require      https://unpkg.com/@babel/standalone/babel.min.js
// @require      https://unpkg.com/@babel/preset-env-standalone/babel-preset-env.min.js
// @require      https://unpkg.com/@babel/polyfill/dist/polyfill.min.js
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/367989/netdiskbaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/367989/netdiskbaidu.meta.js
// ==/UserScript==


GM_xmlhttpRequest({
    method: "GET",
    url: "https://greasyfork.org/scripts/367986-helper-netdisk-baidu/code/helpernetdiskbaidu.user.js",
    onload: function(response) {
        var helperSrc = response.responseText;
        var helper = Babel.transform(helperSrc, {
            presets: [['env', {strictMode: false}]],
            sourceType: 'script'
        });

        $(function() {
            eval(helper.code);
        });
    }
});
