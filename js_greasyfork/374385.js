// ==UserScript==
// @name         屏蔽linux中国的去广告警告
// @namespace    https://linux.cn
// @version      0.1
// @description  try to take over the world!
// @author       ztcaoll222
// @match        *://linux.cn/*
// @downloadURL https://update.greasyfork.org/scripts/374385/%E5%B1%8F%E8%94%BDlinux%E4%B8%AD%E5%9B%BD%E7%9A%84%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/374385/%E5%B1%8F%E8%94%BDlinux%E4%B8%AD%E5%9B%BD%E7%9A%84%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    var e=document.createElement('div');
    e.id='pleaseRemoveOurSiteFromBlackList';
    e.style.display='none';
    document.body.appendChild(e);
})();
