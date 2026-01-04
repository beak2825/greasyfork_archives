// ==UserScript==
// @name         京东页面全部商品链接提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在京东的页面中一键复制当前页面的全部商品链接
// @author       苦苦守候
// @match        https://*.jd.com/*
// @match        https://*.jd.hk/*
// @match        https://*.yiyaojd.com/*
// @match        https://*.jkcsjd.com/*
// @match        https://*.jingxi.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @icon         https://www.google.com/s2/favicons?domain=jd.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436020/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E9%9D%A2%E5%85%A8%E9%83%A8%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436020/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E9%9D%A2%E5%85%A8%E9%83%A8%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

let lastTimeout = 0;
const JD_ITEM_RE = [
    /\.[jd|jingxi]+?\.[com|hk]+?\/.*?sku=(\d+)/,
    /\.m\.jd\.com\/.*?wareId=(\d+)/,
    /mitem\.jd\.hk\/product\/(\d+)\.html/,
    /re\.jd\.[com|hk]+?\/.*?\/(\d+)\.html/,
    /[item.]*?[m.]*?[yiyao]*?jd\.[com|hk]+?\/[product\/]*?(\d+)\.html/,
];

function matchReGroupToOneString(str, reGroup) {
    let value;
    for (let i = 0; i < reGroup.length; i += 1) {
        const re = reGroup[i];
        value = matchReToOneString(str, re);
        if (value) {
            break;
        }
    }
    return value;
}


function matchReToOneString(str, re) {
    if (re.test(str)) {
        const match = str.match(re);
        if (match) {
            if (match.length > 1) {
                return match[1]
            } else {
                return match[0]
            }
        }
    }
}


(function() {
    'use strict';
    document.body.insertAdjacentHTML('beforeend', `<button id="ks-one-copy-jd-urls" class="ks-ui">复制全部商品链接</div></button>`);
    document.body.insertAdjacentHTML('beforeend', `
<style>
    #ks-one-copy-jd-urls{
        position: fixed;
        top: 66px;
        right: 40px;
        z-index: 9999999;
        display: block;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.6;
    }
    #ks-one-copy-jd-urls:hover{
        opacity: 1;
    }
</style>`);
    new ClipboardJS('#ks-one-copy-jd-urls', {
        text: function (trigger) {
            let result = "";
            const allGoods = getAllGoodsUrl();
            if(allGoods && allGoods.length > 0){
                result = allGoods.join("\n");
                hintMsg(`已找到${allGoods.length}个商品链接!`);
            }else{
                hintMsg(`未发现可复制的商品链接`);
            }
            return result;
        },
    });

    function getAllGoodsUrl(){
        const aGroup = document.querySelectorAll("a");
        const result = {};
        for(let i = 0; i < aGroup.length; i += 1){
            const a = aGroup[i];
            const href = a.href;
            if(href && href[0] !== "#"){
                const goodsId = matchReGroupToOneString(href, JD_ITEM_RE);
                if(goodsId && !(goodsId in result)){
                    result[goodsId] = `https://item.jd.com/${goodsId}.html`;
                }
            }
        }
        return Object.values(result);
    }

    function hintMsg(msg){
        const btn = document.querySelector("#ks-one-copy-jd-urls");
        if(btn){
            if(lastTimeout){
                clearTimeout(lastTimeout);
            }
            btn.innerText = msg;
            lastTimeout = setTimeout(()=>btn.innerText = "复制全部商品链接", 2000);
        }
    }
})();