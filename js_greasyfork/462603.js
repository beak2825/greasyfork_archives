// ==UserScript==
// @name         批量获取关注列表
// @namespace    http://tampermonkey.net/
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      0.1
// @description  微博批量关注
// @author       You
// @match        https://m.weibo.cn/profile/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462603/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/462603/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("请稍等，正在获取关注列表ID...");
    getFollows("https://m.weibo.cn/api/container/getIndex?containerid=231093_-_selffollowed", 0).then(function(list) {
        const follows = list.filter(user=>{return user.card_type===10}).map(user=>{return user.user.id});
        console.log(follows);
    });
})();

function getFollows(url, page) {
    if(page>0){
        url = `https://m.weibo.cn/api/container/getIndex?containerid=231093_-_selffollowed&page=${page}`;
    }
    return $.get(url)
        .then(function(rsp) {
        if(rsp.ok===0) {//递归结束条件
            return [];
        }
        const followList = rsp.data.cards.filter(card=>{
            return card.itemid !== ''
        });
        return getFollows(url, rsp.data.cardlistInfo.page)//递归调用
            .then(function(nextList) {
            return [].concat(followList[0].card_group, nextList);//合并递归内容
        });
    });
}