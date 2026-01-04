// ==UserScript==
// @name         Naver Smartstore 5项检索打印
// @namespace    http://puresimple.cn
// @version      0.3.5
// @description  DumpUrl AND Imgs
// @author       IceGhost
// @match        https://smartstore.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505847/Naver%20Smartstore%205%E9%A1%B9%E6%A3%80%E7%B4%A2%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/505847/Naver%20Smartstore%205%E9%A1%B9%E6%A3%80%E7%B4%A2%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('smartstore.naver.com')) {
        if (window.location.href.includes('products')){
            return;
        }
        else if (window.location.href.includes('profile')) {
            return;
        }
        else if (!window.location.href.includes('category')) {
            window.location.href += '/category/ALL?st=TOTALSALE&dt=LIST&page=1&size=80';
        }
    }
    function getTime() {
        var time = new Date();
        var h = time.getHours();
        h = h < 10 ? '0' + h : h;
        var f = time.getMinutes();
        f = f < 10 ? '0' + f : f;
        var s = time.getSeconds();
        s = s < 10 ? '0' + s : s;
        return h + ':' + f + ':' + s;
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var day = date.getDay();

    window.onload = function() {
        let divElementinfo = [];
        let hrefLinks = [];
        let imgLinks = [];
        let tittle = [];
        let priceValues = [];
        let priceValuesless = [];
        let infooutput = [];
        let infooutputless = [];
        const ulElements = document.querySelectorAll('ul');
        ulElements.forEach(ul => {
            const liElements = ul.querySelectorAll('li._3S7Ho5J2Ql');
            liElements.forEach(li => {
                const divElement = li.querySelector('div._3BMdVouLXe');
                if (divElement) {
                    const divElementText = "断货"
                    divElementinfo.push(divElementText);
                    return;
                }
                const aTag = li.querySelector('a[href]');
                if (aTag && aTag.href) {
                    hrefLinks.push(aTag.href);
                }
                const aimgTag = li.querySelector('[src]');
                if (aimgTag && aimgTag.src) {
                    imgLinks.push(aimgTag.src);
                }
                const tittleTag = li.querySelector('[alt]');
                if (tittleTag && tittleTag.alt) {
                    tittle.push(tittleTag.alt);
                }
                const priceElement = li.querySelector('strong._22XUYkkUGJ span._3_9J443eIx');
                if (priceElement) {
                    const priceText = priceElement.textContent.replace(/,/g, '');
                    priceValues.push(priceText);
                }
                else{
                    const priceText = "No Price";
                    priceValues.push(priceText);
                    priceValuesless.push(priceText);
                }
                const info = li.querySelector('p._1jGpq7xfIB');
                if (info) {
                    const infoText = info.textContent.trim();
                    infooutput.push(infoText);
                }
                else{
                    const infoText = "No Info"
                    infooutput.push(infoText);
                    infooutputless.push(infoText);
                }
            });
        });
        console.log('生成时间' + year + '年' + month + '月' + dates + '号 ' + arr[day] + ' ' + getTime());
        console.log('已收集断货数量',divElementinfo.length);
        console.log('已收集商品链接数量', hrefLinks.length,'-','商品链接:',hrefLinks);
        console.log('已收集商品图片数量', imgLinks.length,'-','商品图片:', imgLinks);
        console.log('已收集商品标题数量', tittle.length,'-','商品标题:', tittle);
        console.log('已收集商品金额数量', priceValues.length,'无效商品金额数量',priceValuesless.length ,'-', '商品金额:' , priceValues) ;
        console.log('已收集商品信息数量', infooutput.length, '无效商品信息数量',infooutputless.length ,'-' , '商品信息:' , infooutput);
    };
})();