// ==UserScript==
// @name         旅法师营地 万智牌助手 中英转换 造价分析 样式自定义
// @name:en      more info about mtg decks on iyingdi.com
// @namespace    https://greasyfork.org/zh-CN/scripts/406297-%E6%97%85%E6%B3%95%E5%B8%88%E8%90%A5%E5%9C%B0-%E4%B8%87%E6%99%BA%E7%89%8C%E5%8A%A9%E6%89%8B-%E4%B8%AD%E8%8B%B1%E8%BD%AC%E6%8D%A2-%E9%80%A0%E4%BB%B7%E5%88%86%E6%9E%90-%E6%A0%B7%E5%BC%8F%E8%87%AA%E5%AE%9A%E4%B9%89
// @version      0.5
// @description  在旅法师营地网站上，显示万智套牌的一些有用的信息。https://www.iyingdi.com/web/tools/mtg/decks
// @description:en    Show more info about decks which are on https://www.iyingdi.com/web/tools/mtg/decks
// @author       acbetter
// @run-at       document-start
// @require      https://unpkg.com/jquery@3/dist/jquery.min.js
// @require      https://unpkg.com/ajax-hook@2/dist/ajaxhook.min.js
// @match        https://www.iyingdi.com/web/tools/mtg/decks/deckdetail/*
// @match        https://www.iyingdi.com/web/tools/mtg/userdecks/deckdetail/*

// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/406297/%E6%97%85%E6%B3%95%E5%B8%88%E8%90%A5%E5%9C%B0%20%E4%B8%87%E6%99%BA%E7%89%8C%E5%8A%A9%E6%89%8B%20%E4%B8%AD%E8%8B%B1%E8%BD%AC%E6%8D%A2%20%E9%80%A0%E4%BB%B7%E5%88%86%E6%9E%90%20%E6%A0%B7%E5%BC%8F%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/406297/%E6%97%85%E6%B3%95%E5%B8%88%E8%90%A5%E5%9C%B0%20%E4%B8%87%E6%99%BA%E7%89%8C%E5%8A%A9%E6%89%8B%20%E4%B8%AD%E8%8B%B1%E8%BD%AC%E6%8D%A2%20%E9%80%A0%E4%BB%B7%E5%88%86%E6%9E%90%20%E6%A0%B7%E5%BC%8F%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

/* global $ */

// 如有 Bug 请在 NGA 论坛我的帖子进行反馈。
// by 一个爱打牌的程序员。私人脚本可联系我付费定制，QQ：610915518

var tt;
var tttime = 1000;
var jsonDeck = {};
var isEnglish = false;
var dictCname = {};
var dictEname = {};

$(window).on('load', function() {
    // tt = setTimeout(function() { loopFunction(); }, 1000);
});

function ffN(nuum){
    // formatNumber
    return (" " + nuum).slice(-2);
}

function loopFunction() {
    clearTimeout(tt);
    tttime = 1000;
    isEnglish = false;
    dictCname = {};
    dictEname = {};
    if ($('.formatName').length){
        console.log('旅法师营地助手: 套牌加载成功', jsonDeck);
        showRarityInfo();
    } else {
        tttime = tttime * 2;
        if (tttime < 20000) {
            console.log('旅法师营地助手: 套牌加载失败，在 x 秒后会重新加载...');
            tt = setTimeout(function() { loopFunction(); }, 3000);
        } else {
            console.log('旅法师营地助手: 套牌加载失败，而且已超时，不再会重新加载。');
        }
    }
}

function showRarityInfo() {
    // var rarityInfo = JSON.parse(jsonDeck.deck.rarityInfo)
    var rarityInfo = {'Land' : 0, 'Rare Land' : 0, 'Common' : 0, 'Uncommon' : 0, 'Rare' : 0, 'Mythic Rare' : 0}
    if (jsonDeck.cards.hasOwnProperty('主牌')){
        for (const [keey, valuees] of Object.entries(jsonDeck.cards['主牌'])) {
            for (const valuee of valuees){
                if (valuee[1].mainType == '地' && valuee[1].rarity == 'Rare'){
                    rarityInfo['Rare Land'] += parseInt(valuee[0]);
                } else {
                    rarityInfo[valuee[1].rarity] += parseInt(valuee[0]);
                }
                dictCname[valuee[1].ename] = valuee[1].cname;
                dictEname[valuee[1].cname] = valuee[1].ename;
            }
        }
    }

    var rarityInfoS = {'Land' : 0, 'Rare Land' : 0, 'Common' : 0, 'Uncommon' : 0, 'Rare' : 0, 'Mythic Rare' : 0} // 备牌
    if (jsonDeck.cards.hasOwnProperty('备牌')){
        for (const [keey, valuees] of Object.entries(jsonDeck.cards['备牌'])) {
            for (const valuee of valuees){
                if (valuee[1].mainType == '地' && valuee[1].rarity == 'Rare'){
                    rarityInfoS['Rare Land'] += parseInt(valuee[0]);
                } else {
                    rarityInfoS[valuee[1].rarity] += parseInt(valuee[0]);
                }
                dictCname[valuee[1].ename] = valuee[1].cname;
                dictEname[valuee[1].cname] = valuee[1].ename;
            }
        }
    }

    //  font-variant-numeric: tabular-nums;
    var rarityInfoHtml = '<div class="player" style="margin-top: 12px;">卡牌构成：' + ffN(rarityInfo.Land) + 'BL ' + ffN(rarityInfo['Rare Land']) + 'RL '+ ffN(rarityInfo.Common) + 'C '+ ffN(rarityInfo.Uncommon) + 'U ' + ffN(rarityInfo.Rare) + 'R ' + ffN(rarityInfo['Mythic Rare']) + 'MR</div>'
    var rarityInfoSHtml = '<div class="player" style="margin-top: 12px;">备牌构成：' + ffN(rarityInfoS.Land) + 'BL '+ ffN(rarityInfoS['Rare Land']) + 'RL '+ ffN(rarityInfoS.Common) + 'C '+ ffN(rarityInfoS.Uncommon) + 'U ' + ffN(rarityInfoS.Rare) + 'R ' + ffN(rarityInfoS['Mythic Rare']) + 'MR</div>'
    $('.player').after(rarityInfoHtml + rarityInfoSHtml);

    var showEnglishNameHtml = '<button id="changeNameButton" type="button" style="width:100%;height:32px;background:#4d4f73;border-radius:2px;text-align:center;cursor:pointer;margin-top:10px;font-size:14px;line-height:30px;color:#fff;overflow:hidden">文/A 卡牌名称中英替换</button>';
    $('.action-box').after(showEnglishNameHtml);
    $("#changeNameButton").on('click', function() {
        changeName();
    });
}

function changeName() {
    var dictXname = dictEname;
    if (isEnglish) {
        dictXname = dictCname;
    }
    $('div[class="name inline-block"]').each(function(){
        $(this).text(dictXname[$(this).text()]);
    });
    isEnglish = !isEnglish;
    console.log('旅法师营地助手: 卡牌名称中英替换成功');
}


ah.proxy({
    onRequest: (config, handler) => {
        handler.next(config)
    },
    onError: (err, handler) => {
        handler.next(err)
    },
    onResponse: (response, handler) => {
        if (response.config.url.toString().includes('format=json')){
            console.log('旅法师营地助手: 读取套牌数据', response)
            //             jsonDeck = response.response
            jsonDeck = JSON.parse(response.response)
            tt = setTimeout(function() { loopFunction(); }, 1500);
        }
        handler.next(response)

    }
})