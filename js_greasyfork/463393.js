// ==UserScript==
// @name         北洋园PT自动帮你玩21点
// @namespace    https://greasyfork.org
// @version      0.0.3
// @description  tjupt.blackjack
// @author       yaorelax
// @match        https://tjupt.org/blackjack.php
// @match        https://tju.pt/blackjack.php
// @icon         https://tjupt.org/cards/tp.bmp
// @license      GPL-3.0 License
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/463393/%E5%8C%97%E6%B4%8B%E5%9B%ADPT%E8%87%AA%E5%8A%A8%E5%B8%AE%E4%BD%A0%E7%8E%A921%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/463393/%E5%8C%97%E6%B4%8B%E5%9B%ADPT%E8%87%AA%E5%8A%A8%E5%B8%AE%E4%BD%A0%E7%8E%A921%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选中包含魔力值的元素
    const bonusSpan = document.querySelector('.bottom');

    // 从元素的文本中提取魔力值字符串，并去除其中的逗号
    const bonusStr = bonusSpan.innerText.match(/\d+(,\d+)?(\.\d+)?/)[0].replace(/,/g, '');

    // 将字符串转换为整数
    const bonusNum = parseInt(bonusStr);

    //设置魔力值下限，以防炸仓
    if(bonusNum > 10000){
        //检测开始状态
        if($('input').length == 2 && $('input')[1].value == '拿牌'){
            $('input')[1].click();
        }
        if($('input').length >= 3){
            if($('input')[2].value == '开牌' || $('input')[2].value == '再来一局' || $('input')[2].value == 'Continue old game'){
                $('input')[2].click();
            }

            var point = parseInt(document.querySelector("#outer > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > b").innerText.replace(/[^0-9]/ig,""));

            //小于等于16(可自行修改):再来一张
            if(point <= 16 && point > 2){
                $('input')[1].click();
            }
            //大于16(可自行修改);不再抓了，结束
            if(point > 16 && point < 40){
                $('input')[3].click();
            }
        }
        //都不满足延时1000ms刷新(可自行修改)
        setTimeout('location.reload()', 5000);
    }
})();