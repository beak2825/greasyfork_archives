// ==UserScript==
// @name         jd.com HDD per TB price
// @namespace    http://exz.me/
// @version      0.2
// @description  show per TB price on jd.com!
// @author       Epix
// @match        https://item.jd.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/399104/jdcom%20HDD%20per%20TB%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/399104/jdcom%20HDD%20per%20TB%20price.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('div.itemInfo-wrap > div.sku-name').innerText.indexOf('硬盘')!==-1 || document.querySelector('#crumb-wrap > div > div.crumb.fl.clearfix > div:nth-child(5) > a').innerText.indexOf('硬盘')!==-1){
        var capRegex=/(\d+)T/;
        var priceBaseUrl='https://p.3.cn/prices/mgets?type=1&skuIds=J_';
        var itemEls1=Array.from(document.querySelectorAll('#choose-attr-2 > div.dd > div.item'));
        var itemEls2=Array.from(document.querySelectorAll('#choose-attr-3 > div.dd > div.item'));
        var itemEls=[].concat(itemEls1,itemEls2);
        var skus=itemEls.map(itemEl=>'J_'+itemEl.getAttribute('data-sku'));
        console.log(skus);
        var priceUrl=priceBaseUrl+skus.join(',');
        GM_xmlhttpRequest({
            method:'GET',
            url:priceUrl,
            fetch:true,
            onload:response=>{
                var pricesList=JSON.parse(response.responseText);
                var prices=new Map();
                for (var price of pricesList) {
                    prices.set(price.id,price.p);
                }
                itemEls.forEach(itemEl=>{
                    var itemEla=itemEl.querySelector('a');
                    var itemSku=itemEl.getAttribute('data-sku');
                    var match=capRegex.exec(itemEla.innerText);
                    if (match){
                        var cap=match[1];
                        var perT=prices.get('J_'+itemSku)/parseInt(cap);
                        itemEla.text+=`(￥${perT.toFixed(2)}/TB)`;
                    }
                });
            }
        });
    }
})();