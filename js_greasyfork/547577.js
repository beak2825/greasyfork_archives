// ==UserScript==
// @name         Meta Appinn Browser Fix
// @namespace    https://shugen002.github.io/userscript
// @version      2025-08-28
// @description  让不支持的浏览器也能打开小众软件的论坛。（无视警告，继续执行！）
// @author       shugen
// @match        *://meta.appinn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appinn.com
// @grant        unsafeWindow
// @license      WTFPL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547577/Meta%20Appinn%20Browser%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547577/Meta%20Appinn%20Browser%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(
        unsafeWindow,"unsupportedBrowser",{
            get(){
                return false
            },
            set(){}
        }
    )
})();