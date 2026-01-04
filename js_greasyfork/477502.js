// ==UserScript==
// @name         快麦助手（API）
// @namespace    lezizi
// @homepage     https://erp.superboss.cc/
// @version      0.1
// @description  快麦助手加载器
// @author       You
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/477502/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8B%EF%BC%88API%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477502/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8B%EF%BC%88API%EF%BC%89.meta.js
// ==/UserScript==

(async function () {
    GM_registerMenuCommand("复制超卖商品", query_oversold_products);
    async function query_oversold_products() {
        const eurl = document.domain;
        const resp = await fetch(`https://${eurl}/stock/queryListV2`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bx-v": "2.2.3",
                "cache-control": "no-cache",
                "companyid": "13798",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "module-path": "/stock/newstatu/",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://${eurl}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "api_name=stock_queryListV2&flag=0&queryType=skuAlias&searchType=0&stockStatuses=4&searchPercentage=skuLevelStockWarnDiffF&skuLevelStockWarnDiff=false&specialOuterIdFlag=0&tagQueryType=0&pageNo=1&pageSize=500&userId=-1&mainOuterId=&skuOuterId=&warehouseIds=",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        const query_result = await resp.json()
        // console.log(query_result)
        const products = query_result.data.list ? query_result.data.list : []
        if (products.length < 1) {
            RC.showNewWarn("获取超卖商品失败")
            return
        }
        let result = ''
        for (let p of products) {
            if (!(['0'].includes(p.skuOuterId) || p.skuOuterId.startsWith('LTX'))) {
                result = `${result}${result ? '\n' : ''}` + `${p.skuOuterId}\t${p.propertiesAlias}\t${p.picPath}\t${p.availableStock}`
            }
        }
        result = '商品编码\t商品名称\t图片链接\t缺货数量\n' + result
        console.log(result)
        await navigator.clipboard.writeText(result)
        RC.showNewSuccess("超卖商品数据已复制");
    }
})();
