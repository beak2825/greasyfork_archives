// ==UserScript==
// @name        阡陌居首页宽度异常修复
// @namespace    https://www.dbkuaizi.com
// @version      1.0.0
// @description  修复某些场景下，阡陌居首页宽度异常的问题，详情见：http://www.1000qm.vip/forum.php?mod=viewthread&tid=455789
// @author       dbkuaizi
// @license      WTFPL
// @include      http://www.1000qm.vip/*
// @icon         http://www.1000qm.vip/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525855/%E9%98%A1%E9%99%8C%E5%B1%85%E9%A6%96%E9%A1%B5%E5%AE%BD%E5%BA%A6%E5%BC%82%E5%B8%B8%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/525855/%E9%98%A1%E9%99%8C%E5%B1%85%E9%A6%96%E9%A1%B5%E5%AE%BD%E5%BA%A6%E5%BC%82%E5%B8%B8%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#ct .mn').style.overflow = 'visible'
})();