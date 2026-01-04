// ==UserScript==
// @name         tjuptbjk
// @namespace    www.tjupt.org
// @version      0.0.3
// @description  tjupt_blackjack
// @author       WD
// @match        https://www.tjupt.org/blackjack.php
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C.sEc-eZd2gAFWUoBuzdRMiQHaHa
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461281/tjuptbjk.user.js
// @updateURL https://update.greasyfork.org/scripts/461281/tjuptbjk.meta.js
// ==/UserScript==

(function() {
   'use strict';
       //检测开始状态,获取按钮的文字判断进入新的一局
       const start_btn = $('#outer > table:nth-child(3) > tbody > tr > td > table > tbody > tr:nth-child(3) > td > form > input[type=submit]:nth-child(3)');
       const start_btn_msg = $('#outer > table:nth-child(5) > tbody > tr > td > table > tbody > tr:nth-child(3) > td > form > input[type=submit]:nth-child(3)');
       const point_text = $('#outer > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > b');
       if(start_btn.val() == '开牌'||start_btn.val() == '再来一局'){
                start_btn.click();
       }else if(start_btn_msg.val() == '开牌'||start_btn_msg.val() == '再来一局'){
        start_btn_msg.click();
       }
       //小于等于16:再来一张
       if(parseInt(point_text.text().replace(/[^0-9]/ig,"")) <= 16){
              $('#outer > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > form > input[type=submit]:nth-child(2)').click();
       }
       //大于16;不再抓了，结束
       if(parseInt(point_text.text().replace(/[^0-9]/ig,"")) > 16){
               $('#outer > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td > form > input[type=submit]:nth-child(2)').click();
       }
       //都不满足延时刷新
       setTimeout('location.reload()', 3000);
})();