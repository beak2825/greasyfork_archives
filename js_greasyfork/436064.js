// ==UserScript==
// @name         npupt.blackjack.sandcleaner
// @namespace    https://greasyfork.org/zh-CN/scripts/436064-npupt-blackjack-sandcleaner
// @version      0.0.2
// @description  blackjack never 21
// @author       ydddd
// @match        https://npupt.com/blackjack.php
// @icon         https://z3.ax1x.com/2021/11/16/IfzQoR.png
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/436064/npuptblackjacksandcleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/436064/npuptblackjacksandcleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //设置沙粒下限，以防炸仓(可自行修改)
    if(parseInt($('a#seedbonus').text()) > 200){
        //检测开始状态
        if($('button.btn.btn-primary').text() == '开始游戏！' || $('button.btn.btn-primary').text() == '再来一局'){
            $('button.btn.btn-primary').click();
        }
        //小于等于14(可自行修改):再来一张
        if(parseInt($('#details').text().replace(/[^0-9]/ig,"")) <= 14 && parseInt($('#details').text().replace(/[^0-9]/ig,"")) > 2){
            $('button.btn.btn-primary').click();
        }
        //大于14(可自行修改);不再抓了，结束
        if(parseInt($('#details').text().replace(/[^0-9]/ig,"")) > 14 && parseInt($('#details').text().replace(/[^0-9]/ig,"")) < 40){
            $('button.btn.btn-danger').click();
        }
        //都不满足延时1000ms刷新(可自行修改)
        setTimeout('location.reload()', 1000);
    }
})();