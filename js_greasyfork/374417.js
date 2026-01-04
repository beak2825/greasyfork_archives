// ==UserScript==
// @name         四川大学课程中心辅助使用插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fix some bugs on cc.scu,edu.cn
// @author       Julydate
// @match        http://cc.scu.edu.cn/G2S/ShowSystem/Index.aspx
// @match        https://cc.scu.edu.cn/G2S/ShowSystem/Index.aspx
// @include      http://cc.scu.edu.cn/G2S/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374417/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E8%BE%85%E5%8A%A9%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/374417/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E8%BE%85%E5%8A%A9%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('ctl00_divOnLogin').style.zIndex='1000';
})();