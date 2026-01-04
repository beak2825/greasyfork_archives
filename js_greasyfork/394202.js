// ==UserScript==
// @name         Docker正确描述页修正
// @namespace    https://github.com/nygula
// @version      1.0
// @description  打开docker镜像描述页时自动跳转到正确的页
// @author       nygula
// @match        https://registry.hub.docker.com/u/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/394202/Docker%E6%AD%A3%E7%A1%AE%E6%8F%8F%E8%BF%B0%E9%A1%B5%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/394202/Docker%E6%AD%A3%E7%A1%AE%E6%8F%8F%E8%BF%B0%E9%A1%B5%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let link = location.href;
    link = link.replace('registry.hub.docker.com/u/','hub.docker.com/r/');
    GM_openInTab(link, { active: true });
})();
