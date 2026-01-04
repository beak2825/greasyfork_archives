// ==UserScript==
// @name                Greasy Fork自动勾选"对编辑器启用语法高亮"
// @description         Greasy Fork发布、更新脚本时自动勾选"对编辑器启用语法高亮"
// @namespace           https://github.com/linkwanggo
// @version             1.0.0
// @author              linkwanggo
// @copyright           2023, linkwanggo (https://github.com/linkwanggo)
// @match               *://greasyfork.org/*/*versions/new
// @icon                https://greasyfork.org/vite/assets/blacklogo16.bc64b9f7.png
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @license             MIT
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/458275/Greasy%20Fork%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%22%E5%AF%B9%E7%BC%96%E8%BE%91%E5%99%A8%E5%90%AF%E7%94%A8%E8%AF%AD%E6%B3%95%E9%AB%98%E4%BA%AE%22.user.js
// @updateURL https://update.greasyfork.org/scripts/458275/Greasy%20Fork%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%22%E5%AF%B9%E7%BC%96%E8%BE%91%E5%99%A8%E5%90%AF%E7%94%A8%E8%AF%AD%E6%B3%95%E9%AB%98%E4%BA%AE%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickEnableSourceEditorCode() {
        try {
            const aceEditor = document.querySelector('#ace-editor')
            if (!aceEditor) {
                document.querySelector('#enable-source-editor-code').click()
            }
        } catch (e) {
            console.error(e)
        }
    }
    window.setTimeout(clickEnableSourceEditorCode, 500)
})();