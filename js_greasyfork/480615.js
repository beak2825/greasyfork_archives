// ==UserScript==
// @name         dirigir a 1024
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跳过菜单直接进入
// @author       delfino
// @match        htt*://www.t66y.com
// @match        https://cl.5625y.xyz
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480615/dirigir%20a%201024.user.js
// @updateURL https://update.greasyfork.org/scripts/480615/dirigir%20a%201024.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let prex=window.location.protocol+"//"+window.location.host+'/thread0806.php?fid=7';
    alert(prex);
    setTimeout(async ()=>{
        document.body.remove();
        window.location.href=prex;
    },50)
})();