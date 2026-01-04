// ==UserScript==
// @name               星月号_网盘自动验证
// @name:zh-CN         星月号_网盘自动验证
// @name:en-US         xmoon_Auto veri
// @description        自动填充星月号附属网盘提取码并提交。
// @version            1.0.1
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @include            /(box|pan)\.1024\.(wtf|rip|ski|vet|fyi)\/\?dl=*/
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/458618/%E6%98%9F%E6%9C%88%E5%8F%B7_%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/458618/%E6%98%9F%E6%9C%88%E5%8F%B7_%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

'use strict';

// 定义元素存在函数($$(元素定位符))
let $ = ele => document.querySelector(ele);

// 填充密码并提交
$('input[type="password"]').value = 'xmoon';
$('button[type="submit"]').click();