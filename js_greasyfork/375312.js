// ==UserScript==
// @name         巴哈姆特檢舉提示
// @namespace    Bee10301
// @version      1.3
// @description  有檢舉時跳出提醒，點確定進入後台。
// @author       Bee10301
// @match        https://forum.gamer.com.tw/B.php?*
// @homepage    https://home.gamer.com.tw/home.php?owner=bee10301
// @downloadURL https://update.greasyfork.org/scripts/375312/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%AA%A2%E8%88%89%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/375312/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%AA%A2%E8%88%89%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        if(document.body.outerHTML.match(/檢舉待處理/g).length>3){
            Dialogify.confirm('有檢舉，進入後台?',{
                ok: function(){
                    window.open('gemadmin/accuse_B_2k14.php?bsn='+window.location.href.match(/bsn=(\d*)/)[1],'','');
                }
            });
        }
    }
})();