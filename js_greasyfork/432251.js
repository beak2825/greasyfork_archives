// ==UserScript==
// @name        Block Clipboard Writing
// @name:zh-CN  禁止写入剪贴板
// @description Disable clipboard writing function to prevent moss.
// @description:zh-CN 禁用写入剪贴板功能，防治牛皮藓。
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/432251/Block%20Clipboard%20Writing.user.js
// @updateURL https://update.greasyfork.org/scripts/432251/Block%20Clipboard%20Writing.meta.js
// ==/UserScript==
"use strict";

// Pay attention to the order! Based on compatibility.
document.execCommand = () => {};
navigator.clipboard.writeText = () => {};
navigator.clipboard.write = () => {};
