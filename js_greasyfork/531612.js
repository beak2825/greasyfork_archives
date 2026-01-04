// ==UserScript==
// @name         蓝奏云新域名重定向至lanzoui.com
// @version      2025040301
// @author       狐狸小宮
// @description  自动将新域名跳转至lanzoui.com
// @include      *.lanosso.com/*
// @include      *.lanzn.com/*
// @include      *.lanzog.com/*
// @include      *.lanpw.com/*
// @include      *.lanpv.com/*
// @include      *.lanzv.com/*
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @namespace https://greasyfork.org/users/1235823
// @downloadURL https://update.greasyfork.org/scripts/531612/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%96%B0%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3lanzouicom.user.js
// @updateURL https://update.greasyfork.org/scripts/531612/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%96%B0%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3lanzouicom.meta.js
// ==/UserScript==
     
"use strict";
     
    window.location.replace(location.href.replace(location.hostname, "www.lanzoui.com"));

