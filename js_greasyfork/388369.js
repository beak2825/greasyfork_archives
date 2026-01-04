// ==UserScript==
// @name         什么值得买（过滤器）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       BruceLian
// @match        http*://*.smzdm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388369/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%EF%BC%88%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/388369/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%EF%BC%88%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var uid = setInterval(function (){
        var lis = $('.price-btn-hover');
        if(!lis.length){
            lis = $('.feed-btn-group ');
        }

        for(var i=0; i<lis.length; i++){
            var up = $(lis[i]).find('.price-btn-up .unvoted-wrap span')[0].innerText;
            var down = $(lis[i]).find('.price-btn-down .unvoted-wrap span')[0].innerText;

            if(parseInt(up) > parseInt(down)+1){
            } else {
                $(lis[i]).parent().parent().parent().parent().parent().remove()
            }
        }

        var words = new Array(
            // 临时屏蔽
            '主板','螺丝','显示器','硬盘','苹果','笔记本','路由器','键盘','电视','鼠标','手机','音箱','处理器','散热器','耳机','xxx',
            '油烟机','电饭煲','微波炉','马桶','洗衣机','花洒','龙头','空调','烤箱','冰箱','xxx','xxx','xxx',
            '行李箱','机票','指纹锁','咖啡','婴','钱包','航线','机票','月饼','茶','伞','xxx','xxx','xxx','xxx','xxx','xxx','xxx',
            '夹克','背包','手提包','肩包','腕表','手套','xxx','xxx','xxx','xxx','xxx','xxx',
            '酒','水果','甘栗','巴旦木','牛腱','冰激凌','冰淇淋','xxx','xxx',
            '牙刷','剃须','衣架','牙线','凉被','xxx','xxx','xxx',
            // 永久屏蔽
            '眼霜','妆','唇','防晒','吸奶','避孕','女款','文胸','裙','靴','泳','奶粉','蚊','保湿','睫毛','项链','耳环','xxx','xxx','xxx','xxx','xxx',
            '高达','乐高','机油','电钻','吉他','玩具','xxx','xxx','xxx');
        var lis2 = $('.feed-row-wide');
        for(var k = lis2.length-1; k > -1; k--){
            for(var j = 0; j < words.length; j++){
                if(lis2[k].innerText.indexOf(words[j])>0){
                    lis2[k].remove()
                }
            }
        }
    },1000);
})();