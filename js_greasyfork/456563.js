// ==UserScript==
// @name         跳过CRM人脸验证
// @version      0.2
// @author       酷企鹅Link
// @grant        none
// @match        http://134.64.105.90:28003/*
// @description 2022/12/14 17:44:20
// @namespace https://greasyfork.org/users/8620
// @downloadURL https://update.greasyfork.org/scripts/456563/%E8%B7%B3%E8%BF%87CRM%E4%BA%BA%E8%84%B8%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456563/%E8%B7%B3%E8%BF%87CRM%E4%BA%BA%E8%84%B8%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    similarity=Math.floor(900+Math.random()*100)/1000;identifySubmit();
})();