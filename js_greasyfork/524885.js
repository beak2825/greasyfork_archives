// ==UserScript==
// @name         改字体
// @namespace    http://tampermonkey.net/
// @version      2025-02-10
// @description  修改全局全局字体
// @author       share121
// @match        *://*/*
// @exclude      https://github.com/*/blob/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524885/%E6%94%B9%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/524885/%E6%94%B9%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

GM_addStyle(`
div,h1,h2,h3,h4,h5,h6,p,button,input,textarea {
    font-family: "HarmonyOS Sans SC", "Punctuation SC", "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}
code,kbd,pre,samp,code *,kbd *,pre *,samp *,.react-code-lines,.react-code-lines *,.diff-table,.diff-table *,#ace-editor,#ace-editor *,#script_version_code,#script_version_code * {
    font-family: "FiraCode Nerd Font", ui-monospace, "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "HarmonyOS Sans SC", "Punctuation SC", "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}
`)