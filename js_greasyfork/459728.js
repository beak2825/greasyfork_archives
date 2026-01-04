// ==UserScript==
// @name         消防心論壇【DSU】簽到
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  消防心論壇簽到
// @description  try to take over the world!
// @author       Killua115
// @license      MIT
// @match        http://fireman.tw/plugin.php?id=dsu_paulsign:sign*
// @match        https://fireman.tw/plugin.php?id=dsu_paulsign:sign*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fireman.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459728/%E6%B6%88%E9%98%B2%E5%BF%83%E8%AB%96%E5%A3%87%E3%80%90DSU%E3%80%91%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459728/%E6%B6%88%E9%98%B2%E5%BF%83%E8%AB%96%E5%A3%87%E3%80%90DSU%E3%80%91%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //說話版
    
    //document.getElementById("todaysay").value = '壽命因為短暫，才更顯得珍貴。';
    document.getElementById("todaysay").value = '大家都好準時簽到';
    document.getElementById("shuai_s").checked = true;
    


    //不說話版
    /*
    //alert('話 '+ document.getElementsByName("qdmode")[1].checked);
    document.getElementsByName("qdmode")[1].checked = true;
    //alert('話 '+ document.getElementsByName("qdmode")[1].checked);

    //alert('臉 '+ document.getElementById("shuai_s").checked);
    document.getElementById("shuai_s").checked = true;
    //alert('臉 '+ document.getElementById("shuai_s").checked);
    */

    showWindow('qwindow', 'qiandao', 'post', '0');
})();