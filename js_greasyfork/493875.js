// ==UserScript==
// @name         京东部分触屏活动页商品用电脑端打开
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  目前仅可为百亿补贴页，京东秒杀页提供触屏商品通过新标签页打开商品的功能，临时通过油猴提供该功能，后续若找到通用的方法后将通过守候购物小助手插件为所有触屏活动页带来该功能
// @author       苦苦守候
// @match        https://*.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html*
// @match        https://*.jd.com/mall/active/DvFPmKRas9GYjDPZjT9NT14BAv6/index.html*
// @icon         https://www.google.com/s2/favicons?domain=jd.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493875/%E4%BA%AC%E4%B8%9C%E9%83%A8%E5%88%86%E8%A7%A6%E5%B1%8F%E6%B4%BB%E5%8A%A8%E9%A1%B5%E5%95%86%E5%93%81%E7%94%A8%E7%94%B5%E8%84%91%E7%AB%AF%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/493875/%E4%BA%AC%E4%B8%9C%E9%83%A8%E5%88%86%E8%A7%A6%E5%B1%8F%E6%B4%BB%E5%8A%A8%E9%A1%B5%E5%95%86%E5%93%81%E7%94%A8%E7%94%B5%E8%84%91%E7%AB%AF%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

// 百亿补贴页网址：https://pro.m.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html
// 京东秒杀页网址：https://pro.m.jd.com/mall/active/DvFPmKRas9GYjDPZjT9NT14BAv6/index.html

(function() {
    'use strict';
    if(location.href.includes("Md9FMi1pJXg2q7qc8CmE9FNYDS4")){
        if(jmfe){
            jmfe.toSku = (goodsId) => {
                window.open(`https://item.jd.com/${goodsId}.html`);
            };
            console.log("[守候购物小助手]触屏商品电脑访问功能现已生效");
            return;
        }
    }else if(location.href.includes("DvFPmKRas9GYjDPZjT9NT14BAv6")){
        const divEle = document.querySelector(".top-block");
        if (divEle) {
            for (const prop of Object.keys(divEle)) {
                if (prop.startsWith("__reactEventHandlers")) {
                    const { children } = divEle[prop];
                    if (children && children.length > 0) {
                        for (const child of children) {
                            if (child.props && "floorStore" in child.props) {
                                const { floorStore } = child.props;
                                if ("onClickProduct" in floorStore) {
                                    floorStore.onClickProduct = (goodsId) => {
                                        window.open(`https://item.jd.com/${goodsId}.html`);
                                    };
                                    console.log("[守候购物小助手]触屏商品电脑访问功能现已生效");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})();