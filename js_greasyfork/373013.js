// ==UserScript==
// @name         快速选择京东卡
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       骑驴看唱本
// @match        *://trade.jd.com/shopping/order/getOrderInfo.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373013/%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E4%BA%AC%E4%B8%9C%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/373013/%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E4%BA%AC%E4%B8%9C%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('virtualdiv').style.display = 'inline';
    document.getElementById('virtualdiv').click();
    document.getElementById('giftitem').click();

    window.selectAllCard =function(){
        let liTags = document.getElementsByClassName('giftcard-enable')[0].getElementsByTagName('li');
        let liGroup = Array.prototype.slice.call(liTags);
        liGroup.map((v,i)=>{
            if(!v.querySelector('div.item-selected')){
                v.children[0].getElementsByClassName('g-msg')[0].click();
            }
        });
    }

    window.unSelectAllCard =function(){
        let liTags = document.getElementsByClassName('giftcard-enable')[0].getElementsByTagName('li');
        let liGroup = Array.prototype.slice.call(liTags);
        liGroup.map(function(v,i){
            if(v.querySelector('div.item-selected')){
                v.querySelector('div.item-selected').querySelector('div.g-msg').click()
            }
        });
    }

     const selectCardHtml = `<div
         style="
    display: inline;font-size: 14px;"><a style="
    margin-left: 20px;
    color: indianred;
    cursor: pointer;" onclick="selectAllCard()">全选京东E卡</a><a style="
    margin-left: 20px;margin-right: 20px;
    color: indianred;
    cursor: pointer;" onclick="unSelectAllCard()">取消全选京东E卡</a><span style="color: green;"></div>`;
    document.querySelector('#virtualdiv').outerHTML += selectCardHtml
})();