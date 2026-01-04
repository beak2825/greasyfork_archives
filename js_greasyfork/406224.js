// ==UserScript==
// @name        设置platform为安卓
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  设置platform为安卓,主要应对某些通过navigator.platform检测是否手机的站点
// @author       You
// @match        http://sp.mbga.tv/*
// @grant        none
//@run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/406224/%E8%AE%BE%E7%BD%AEplatform%E4%B8%BA%E5%AE%89%E5%8D%93.user.js
// @updateURL https://update.greasyfork.org/scripts/406224/%E8%AE%BE%E7%BD%AEplatform%E4%B8%BA%E5%AE%89%E5%8D%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
})();