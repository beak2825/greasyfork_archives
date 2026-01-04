// ==UserScript==
// @name         国家法律法规数据库下载时自动复制法规名称
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  下载时自动复制法规名称
// @author       AN drew
// @match        https://flk.npc.gov.cn/detail2.html?*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486575/%E5%9B%BD%E5%AE%B6%E6%B3%95%E5%BE%8B%E6%B3%95%E8%A7%84%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B8%8B%E8%BD%BD%E6%97%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%B3%95%E8%A7%84%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/486575/%E5%9B%BD%E5%AE%B6%E6%B3%95%E5%BE%8B%E6%B3%95%E8%A7%84%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B8%8B%E8%BD%BD%E6%97%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%B3%95%E8%A7%84%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#downLoadFile').click(function(){
        GM_setClipboard($('#flName').text(), 'text')
    })
})();