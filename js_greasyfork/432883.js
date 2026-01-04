// ==UserScript==
// @name         ddphonenum
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  下载抖店订单
// @author       hk
// @match        https://fxg.jinritemai.com/ffa/morder/order/list
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432883/ddphonenum.user.js
// @updateURL https://update.greasyfork.org/scripts/432883/ddphonenum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dataList = [],
        headers = ['order','date','title','receive','phone'],
        curPage = 0, pageCount = 0, pageConDom, pretime, lastState='-1';


    async function renderDownloadBtn(){
        await WaitUntil(() => {
            return !!_q('div.index_tableRow__tpbkM')
        });
         let app = _q('#app');
        app.insertAdjacentHTML('beforeend', '<div style="position: fixed; user-select: none; z-index: 101; right: 10px; top: 137px;"><button id="__customdownloadbtn" class="auxo-btn auxo-btn-primary auxo-btn-lg" style="will-change: transform;">导出订单手机号</button><div id="__customprogress"></div></div>');
        setTimeout(function(){
            _q('#__customdownloadbtn').addEventListener('click', handleDownloadBtnClick);
            pageConDom = _q('#__customprogress');
            calcLastState();
        },150);
        let pages = _qa('.auxo-pagination-item');
        pageCount = Number(pages[pages.length -1].innerText);
    }

    function handleDownloadBtnClick (){
        let viewableCount = _qa('[data-kora_order_status]:not([data-kora_order_status="4"])').length;
        curPage = Number(_q('.auxo-pagination-item.auxo-pagination-item-active').innerText);
        getReceiveinfo();
        let timer = setInterval(function(){
            let notreturnCnt = _qa('[data-kora_order_status]:not([data-kora_order_status="4"]) [data-kora="查看敏感信息"]').length;
            renderProgress(viewableCount - notreturnCnt);

            if(notreturnCnt === 0){
                clearInterval(timer);

                insertCurPageData();
                if(_qa('.auxo-pagination-next[aria-disabled="true"]').length === 0){
                    _q('.auxo-pagination-next').click();

                    setTimeout(function(){
                        handleDownloadBtnClick();
                    }, 10000);
                } else {
                    downloadCsv();
                }
            }
        }, 100);
    }

    function getReceiveinfo() {
        let nodelist = _qa('[data-kora_order_status]:not([data-kora_order_status="4"]) .auxo-sp-icon.sp-icon-parcel');
        nodelist.forEach(function(node, index){
            node.click();
        });
    }

    function insertCurPageData() {
        let rows = _qa('[data-kora_order_status]:not([data-kora_order_status="4"])');
        rows.forEach(function(item){
            let tmpData = {};
            tmpData.order = item.querySelector('.index_content__3R2D9').innerText;
            tmpData.date = item.querySelector('.index_text__3y09K').innerText;
            tmpData.title = item.querySelector('.style_name__3ChB9').innerText;
            tmpData.receive = item.querySelector('.index_locationDetail__2IqFq').innerText;
            tmpData.phone = tmpData.receive.split('，')[1];
            dataList.push(tmpData);
        });
    }

    function downloadCsv() {
        const csvString = toCsvString(headers, dataList);

        let shopName = getShopName();

        let link = document.createElement('a');
        link.setAttribute('href', csvString);
        let filename = `${shopName}-订单`;
        link.setAttribute('download', filename + '.csv');
        link.click();
        dataList = [];
    }

    function renderProgress(cur){
        let count = dataList.length + cur;
        pageConDom.innerHTML = '已获取：'+ count + '条，正在获取：' + curPage + '/' + pageCount + '页';
    }

    function calcLastState(){
        if(pageConDom.innerHTML){
            lastState = pageConDom.innerHTML;
        }
        setTimeout(function(){
            if(lastState === pageConDom.innerHTML){
                downloadCsv();
            } else {
                calcLastState();
            }
        }, 15000);
    }

    function toCsvString(headers, dataList) {
        let rows = []
        rows.push(headers)
        for (let d of dataList) {
            let row = []
            for (let h of headers) {
                row.push(d[h])
            }
            rows.push(row)
        }
        rows = rows.map(row => {
            return row.map(s => `"${s}"`).join(',')
        }).join('\n')
        return 'data:text/csv;charset=utf-8,\ufeff' + rows
    }

    function getShopName() {
        return _q('div.headerShopName').innerText
    }

    async function Sleep(sleepSecs) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, sleepSecs * 1000)
        })
    }

    async function WaitUntil(conditionFunc, sleepSecs) {
        sleepSecs = sleepSecs || 1
        return new Promise((resolve, reject) => {
            if (conditionFunc()) resolve()
            let interval = setInterval(() => {
                if (conditionFunc()) {
                    clearInterval(interval)
                    resolve()
                }
            }, sleepSecs * 1000)
            })
    }

    function _q(s) {
        return document.querySelector(s);
    }

    function _qa(s){
        return document.querySelectorAll(s);
    }


    renderDownloadBtn();


})();