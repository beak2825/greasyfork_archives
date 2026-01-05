// ==UserScript==
// @name         京东会员签到
// @namespace    https://greasyfork.org/zh-CN/users/75882-qq50941544
// @version      20161026
// @description  try to take over the world!
// @author       QQ50941544
// @match        http://tampermonkey.net/scripts.php
// @grant        none
// @include      *//vip.jd.com/*
// @downloadURL https://update.greasyfork.org/scripts/24357/%E4%BA%AC%E4%B8%9C%E4%BC%9A%E5%91%98%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/24357/%E4%BA%AC%E4%B8%9C%E4%BC%9A%E5%91%98%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

var list = document.getElementsByClassName("btns")[0];
list.getElementsByClassName("signup-btn")[0].click();
