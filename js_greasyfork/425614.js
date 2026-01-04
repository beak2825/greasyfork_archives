// ==UserScript==
// @name         bilibili-导出舰长列表
// @namespace    https://vrp.live/
// @version      0.3
// @description  导出舰长和礼物的便利工具
// @author       TokimoriSeisa
// @match        https://link.bilibili.com/p/center/index
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/json2csv/5.0.7/json2csv.umd.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425614/bilibili-%E5%AF%BC%E5%87%BA%E8%88%B0%E9%95%BF%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/425614/bilibili-%E5%AF%BC%E5%87%BA%E8%88%B0%E9%95%BF%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var $ = window.jQuery;
    var URL = 'https://api.live.bilibili.com/xlive/revenue/v1/giftStream/getReceivedGiftStreamList'
    var TEMPLATE = `
<div class="item f-right mixin-userscript">
  <button class="bl-button live-btn default bl-button--primary bl-button--size" id="mixin-action-export-guard"><span class="txt">导出所选月舰长列表</span></button>
  <button class="bl-button live-btn default bl-button--primary bl-button--size" id="mixin-action-export-guard-gift"><span class="txt">导出最近180天所有舰长</span></button>
  <button class="bl-button live-btn default bl-button--primary bl-button--size" id="mixin-action-export-all"><span class="txt">导出最近180天所有礼物</span></button>
</div>`;

    function downloadGiftCsv(data){
        let parser = new json2csv.Parser({
            fields: [
                {
                    label: '礼物ID',
                    value: 'gift_id',
                    default: 'NULL'
                },
                {
                    label: '礼物名称',
                    value: 'gift_name',
                    default: 'NULL'
                },
                {
                    label: '数量',
                    value: 'gift_num',
                    default: '0'
                },
                {
                    value: 'gold',
                    default: '0'
                },
                {
                    value: 'hamster',
                    default: '0'
                },
                {
                    value: 'ios_gold',
                    default: '0'
                },
                {
                    value: 'ios_hamster',
                    default: '0'
                },
                {
                    value: 'is_hybrid',
                    default: 'NULL'
                },
                {
                    value: 'normal_gold',
                    default: '0'
                },
                {
                    value: 'normal_hamster',
                    default: '0'
                },
                {
                    value: 'silver',
                    default: '0'
                },
                {
                    label: '送礼用户昵称',
                    value: 'uname',
                    default: 'NULL'
                },
                {
                    label: '送礼用户UID',
                    value: 'uid',
                    default: 'NULL'
                },
                {
                    label: '收礼时间',
                    value: 'time',
                    default: 'NULL'
                },
            ]
        });
        let csv = parser.parse(data);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob,'export.csv');
    }

    function getAllGift(){
        var targetDate = new Date();
        var times = 180;
        var result = [];
        for(var i=0; i < times; i++){
            result = result.concat(
                getGift(targetDate)
            );
            targetDate.setDate(targetDate.getDate() - 1);
        }
        return result;
    }

    function getAllGuard(){

        var cache = localStorage.getItem('us_getAllGuard');

        if(cache != null && confirm('获取的数据有缓存，使用缓存数据吗？')){
            return JSON.parse(cache)
        }

        var giftIDs = [10003, 10002, 10001];
        var times = 179;
        var result = [];
        for(var id in giftIDs){
            var targetDate = new Date();
            let giftID = giftIDs[id];
            for(var i=0; i < times; i++){
                result = result.concat(
                    getGift(targetDate, giftID)
                );
                targetDate.setDate(targetDate.getDate() - 1);
            }
        }
        localStorage.setItem('us_getAllGuard', JSON.stringify(result));
        return result;
    }

    function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    function getGuard(){
        var dateText = $('#live-center-app .my-room-gift-list .select-bar .time .current').text();
        var date = new Date(`${dateText.slice(0, 4)}-${dateText.slice(4, 6)}-${dateText.slice(6, 8)}`);
        var guardDateStartAt = new Date(`${dateText.slice(0, 4)}-${dateText.slice(4, 6)}-01 00:00:00`);
        var guardDateEndAt = guardDateStartAt.setMonth(guardDateStartAt.getMonth()+1)
        var guards = groupBy(getAllGuard(), 'uid');
        var result = [];
        for(var i in guards){
            var guard = guards[i];
            var sortedGuard = guard.slice().sort((a, b) => -(new Date(b.time) - new Date(a.time)));
            var validUntil = null;
            var abort = false;
            for(var j = 0; j < sortedGuard.length && !abort; j++){
                let addDays = sortedGuard[j].gift_num * 30;
                let buyDate = new Date(sortedGuard[j].time);
                if(validUntil == null || validUntil < buyDate){
                    let startDate = buyDate;
                    if(buyDate >= guardDateEndAt){
                        abort = true;
                    } else {
                        validUntil = startDate.setDate(startDate.getDate() + addDays);
                    }

                } else if (validUntil >= buyDate){
                    validUntil = new Date(validUntil)
                    validUntil = validUntil.setDate(validUntil.getDate() + addDays);
                }

                if(validUntil >= guardDateStartAt ){
                    result.push(sortedGuard[j]);
                    abort = true;
                }
            }
        }
        return result;
    }

    function getGift(targetDate, giftID){
        var dateText = `${targetDate.getFullYear()}-${String(targetDate.getMonth()+1).length == 1 ? '0'+ (targetDate.getMonth()+1) : (targetDate.getMonth()+1) }-${String(targetDate.getDate()).length == 1 ? '0' + targetDate.getDate() : targetDate.getDate()}`;
        var page = 1;
        var nextPage = true;
        var result = [];
        var totalNum = -1;
        do {
            $.ajax({
                async: false,
                method: 'GET',
                url: URL,
                data: {
                    page_num: page,
                    page_size: 2000,
                    coin_type: 0,
                    gift_id: giftID || '',
                    begin_time: dateText,
                    uname: ''
                },
                xhrFields: {
                    withCredentials: true
                }
            })
                .done(function(data){
                if(data && data.code === 0){
                    result = result.concat(data.data.list);
                    totalNum = data.data.total;
                    page++;
                } else if(data && data.code === 200001){
                    nextPage = false;
                }
            })
            if(totalNum != -1 && result.length >= totalNum){
                nextPage = false;
            }
        } while(nextPage);
        return result;
    }

    function loopInject(){
        setInterval(function(){
            if($('#live-center-app .my-room-gift-list').length > 0){
                if($('#live-center-app .my-room-gift-list .mixin-userscript').length <= 0){
                    insertElement();
                }
            }
        }, 300)
    };

    function insertElement(){
        $('#live-center-app .my-room-gift-list .select-bar').append(TEMPLATE);
        $('#mixin-action-export-all').on('click', actionExportAllGift);
        $('#mixin-action-export-guard-gift').on('click', actionExportAllGuardGift);
        $('#mixin-action-export-guard').on('click', actionExportGuardByMonth);
    }


    // Your code here...
    function actionExportAllGift(){
        downloadGiftCsv(getAllGift());
    }

    function actionExportAllGuardGift(){
        downloadGiftCsv(getAllGuard());
    }

    function actionExportGuardByMonth(){
        downloadGiftCsv(getGuard());
    }

    $(document).ready(loopInject);
})();