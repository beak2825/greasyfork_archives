"use strict";
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
// ==UserScript==
// @name         淘宝天猫多商品列表展示
// @version      2.3
// @author       Einskang
// @description  淘宝天猫商品页面多个商品与价格列表显示效果
// @match        http*://item.taobao.com/item.htm?*
// @match        http*://detail.tmall.com/item.htm?*
// @match        http*://chaoshi.detail.tmall.com/item.htm?*
// @grant        none
// @run-at       document-start
// @icon         data:img/jpg;base64,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
// @namespace    https://greasyfork.org/users/206059
// @downloadURL https://update.greasyfork.org/scripts/398514/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%A4%9A%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398514/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%A4%9A%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==
(function main() {
    // 设置调试模式
    const debug = false;
    // 输出调试信息
    function log(information, ...others) {
        if (debug) {
            // eslint-disable-next-line no-console
            console.log(information, ...others);
        }
    }
    // 定义站点类型
    let SiteType;
    (function (SiteType) {
        SiteType[SiteType["TaoBao"] = 0] = "TaoBao";
        SiteType[SiteType["TianMao"] = 1] = "TianMao";
    })(SiteType || (SiteType = {}));
    // 站点类型
    const siteType = window.location.host.includes('item.taobao.com') ?
        SiteType.TaoBao :
        SiteType.TianMao;
    // /**
    //  * 描述商品原价和商品详细信息ID的对象数组
    //  * 属性名的命名规则是，都以“;”开始和结尾，中间是各种分类ID组成的用来在页面上唯一标识某一个商品的ID
    //  * @type {Object.<String, Object>}
    //  * @property {Number} default.priceCent 以分作为单位的商品原价格
    //  * @property {String} default.price 用来直接显示给用户看的商品原价格
    //  * @property {Number} default.stock 当前库存
    //  * @property {String} default.skuId 商品详细信息ID
    //  */
    // type SkuMap = {
    //   [key: string]: {
    //     priceCent: number
    //     price: string
    //     stock: number
    //     skuId: string
    //   }
    // }
    /**
     * 重复执行
     * @param {() => boolean} callback 回调函数，当返回 true 时停止继续执行，否则继续执行
     * @param {number} [counter=25] 执行次数限制，默认执行 25 次
     * @param {number} [interval=200] 每次执行间隔，默认 200 毫秒
     */
    function doUntilStop(callback, counter = 100, interval = 50) {
        window.setTimeout(function F(_counter) {
            if (_counter >= 0 && !callback()) {
                window.setTimeout(F, interval, _counter - 1);
            }
        }, interval, counter - 1);
    }
    // 增加额外的样式表，使商品展示形式由块状变为列表式
    function addStyleSheet() {
        document.addEventListener('DOMContentLoaded', () => {
            const styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            if (siteType === SiteType.TaoBao) {
                // 淘宝页面插入的样式代码
                styleElement.innerHTML = `
          .J_TSaleProp > li {
            float: none !important;
            margin: 0 !important;
          }

          .J_TSaleProp > li > a {
            background-position-x: left !important;
            text-align: left !important;
            display: block !important;
          }

          .J_TSaleProp > li > a > span {
            display: inline !important;
            margin-left: 40px;
            text-align: left !important;
            font-size: 18px;
            font-weight: 800;
          }

          .J_TSaleProp > li > a > p {
            text-indent: 0 !important;
            padding: 0;
            text-align: right !important;
            position: absolute;
            top: 2px;
            right: 5px;
            z-index: 200;
            width: auto;
            height: auto;
            float: right;
            font-size: 30px;
            color: #FF0036;
            font-weight: bolder;
            font-family: Arial;
          }
        `;
            }
            else if (siteType === SiteType.TianMao) {
                // 天猫页面插入的样式代码
                // 包含 tm-relate-list 类的商品，类似于京东多种类商品，每次切换商品种类都会刷新
                // 整个页面
                styleElement.innerHTML = `
          .tm-relate-list > li {
            float: none !important;
            margin: 0 !important;
          }

          .tm-relate-list > li > a {
            padding-left: 50px !important;
            text-align: left !important;
            font-size: 18px;
            font-weight: 800;
          }

          .tm-relate-list > li > span {
            padding-left: 50px !important;
            text-align: left !important;
            font-size: 18px;
            font-weight: 800;
          }

          .J_TSaleProp > li {
            float: none !important;
            margin: 0 !important;
          }

          .J_TSaleProp > li > a[href='#'] {
            width: auto !important;
            float: none;
            display: block;
            background-position-x: left !important;
            text-align: left;
          }

          .J_TSaleProp > li > a > span {
            text-indent: 0 !important;
            padding-left: 50px;
            text-align: left;
            font-size: 18px;
            font-weight: 800;
            position: relative;
            z-index: 100;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }

          .J_TSaleProp > li > a > p {
            text-indent: 0 !important;
            padding: 0;
            text-align: right !important;
            position: absolute;
            top: 2px;
            right: 5px;
            z-index: 200;
            width: auto;
            height: auto;
            float: right;
            font-size: 30px;
            color: #FF0036;
            font-weight: bolder;
            font-family: Arial;
          }
        `;
            }
            document.head.appendChild(styleElement);
        });
    }
    // 当前商品是否是多选择项商品
    let isMultiTypeItem;
    // 当前商品种类选择区域在商品列表区域的第几个位置，一般是第一个位置，
    // 但有时候商家会将两者正好反过来，因此将判断逻辑更换为哪个选择列表
    // 的数量少，就指定为谁是商品种类选择列表，从而使商品价格尽可能地展
    // 示在列表更多的区域，方便比价
    let itemTypeIndex;
    function refreshPrice(option) {
        // 商品种类选择器中的一个关键元素，淘宝为 div.tb-skin，天猫为 div.tb-sku
        const itemTypeSelectorKey = siteType === SiteType.TaoBao ? 'div.tb-skin' : 'div.tb-sku';
        // 只有在商品有不同种类可供选择的时候才会有商品种类 ID
        let selectedItemTypeId;
        if (isMultiTypeItem) {
            log('多种类商品');
            // 商品种类
            const itemList = Array.from(document.querySelectorAll(`${itemTypeSelectorKey} > dl:nth-of-type(${itemTypeIndex}) > dd > ul > li`));
            // 已选中的商品种类，如果没有默认第一个
            const selectedItemType = itemList.find((itemType) => itemType.classList.contains('tb-selected')) || itemList.find((itemType) => itemType.innerText.includes('已选中')) || itemList[0];
            // 多种类商品未获取到商品种类 ID 就直接退出
            let _temp;
            if (!selectedItemType || !(_temp = selectedItemType.getAttribute('data-value')))
                return;
            selectedItemTypeId = _temp;
        }
        log('将商品实际销售价格对应显示到商品列表中');
        // 将商品实际销售价格对应显示到商品列表中
        document
            .querySelectorAll(`${itemTypeSelectorKey} > dl:nth-of-type(${isMultiTypeItem ? (itemTypeIndex === 1 ? 2 : 1) : 1}) > dd > ul > li`)
            .forEach((commodity) => {
            var _a;
            // 获取商品 ID，如果未获取到就直接退出
            let _temp;
            log('获取到的商品 ID：', commodity.getAttribute('data-value'));
            if (!(_temp = commodity.getAttribute('data-value')))
                return;
            const commodityId = _temp;
            // 商品价格信息，包含促销价格和正常价格
            // 如果是多种类商品，则需要同时满足商品种类 ID 和商品 ID 相同
            let itemPriceInformation;
            if (siteType === SiteType.TaoBao) {
                const promotionPriceId = Object.keys(option.promoData).find((item) => (isMultiTypeItem ?
                    item.includes(selectedItemTypeId) && item.includes(commodityId) :
                    item.includes(commodityId)));
                log('promotionPriceId', promotionPriceId);
                const originalPriceId = Object.keys(option.originalPrice).find((item) => (isMultiTypeItem ?
                    item.includes(selectedItemTypeId) && item.includes(commodityId) :
                    item.includes(commodityId)));
                log('originalPriceId: ', originalPriceId);
                itemPriceInformation = {
                    promotionList: promotionPriceId ? option.promoData[promotionPriceId] : undefined,
                    price: originalPriceId ? option.originalPrice[originalPriceId].price : undefined,
                };
            }
            else if (siteType === SiteType.TianMao) {
                const priceInfo = option.skuList.find((item) => (isMultiTypeItem ?
                    item.pvs.includes(selectedItemTypeId) &&
                        item.pvs.includes(commodityId) :
                    item.pvs.includes(commodityId)));
                if (!priceInfo)
                    return;
                itemPriceInformation = {
                    promotionList: option.priceInfo[priceInfo.skuId].promotionList,
                    price: option.priceInfo[priceInfo.skuId].price,
                };
            }
            if (!itemPriceInformation)
                return;
            // 有促销活动时，真实价格等于促销价格，没有促销活动时，真实价格等于正常价格
            const itemReallyPrice = ((itemPriceInformation.promotionList &&
                itemPriceInformation.promotionList[0]) ||
                itemPriceInformation).price;
            if (!itemReallyPrice)
                return;
            // 在商品列表的一侧显示真实价格
            const priceSpanElement = document.createElement('p');
            priceSpanElement.innerHTML = itemReallyPrice;
            priceSpanElement.classList.add('einskang-show-price-list');
            if (!(_temp = commodity.firstElementChild))
                return;
            // 删除原来添加进去的元素
            (_a = commodity.querySelector('.einskang-show-price-list')) === null || _a === void 0 ? void 0 : _a.remove();
            _temp.appendChild(priceSpanElement);
        });
    }
    // 获取商品价格信息
    function getPriceInformation() {
        // 判断是否是多选择项商品的正则表达式
        const multiTypeItemCheckRegExp = /[\d:]+(;[\d:]+)+/;
        // 淘宝商品价格截取
        if (siteType === SiteType.TaoBao) {
            let originalPrice;
            let promoData;
            // 截获数据获取函数
            doUntilStop(() => {
                if (!window.onSibRequestSuccess) {
                    return false;
                }
                const originFunction = window.onSibRequestSuccess;
                window.onSibRequestSuccess = function (argv) {
                    if (argv.code.message === 'SUCCESS') {
                        originalPrice = argv.data.originalPrice; // 商品原始价格
                        promoData = argv.data.promotion.promoData; // 商品促销价格
                        log('originalPrice: ', originalPrice);
                        log('promoData：', promoData);
                        // 判断是否是多选择项商品，淘宝的接口返回了一个比较特殊的值 def，表示的是商品的价格区间
                        isMultiTypeItem = Object.keys(originalPrice).every((key) => multiTypeItemCheckRegExp.test(key) || key === 'def');
                        log('是否是多种类商品', isMultiTypeItem);
                    }
                    // 执行原代码
                    originFunction(argv);
                };
                return true;
            });
            // 等待数据和页面结构准备好，显示商品价格
            doUntilStop(() => {
                if (!originalPrice && !promoData) {
                    log('数据没有准备好');
                    return false;
                }
                if (!document.querySelector('div.tb-skin')) {
                    log('页面结构没有准备好');
                    return false;
                }
                log('数据已经准备好');
                // 如果当前商品存在多个种类，则为种类选择增加点击事件侦听，当发生点击时
                // 更新替换了价格数据，淘宝以 div.tb-skin 为商品选择列表区域，天猫以
                // div.tb-sku 为商品选择列表区域
                if (isMultiTypeItem) {
                    itemTypeIndex =
                        document.querySelectorAll('div.tb-skin > dl:nth-of-type(1) > dd > ul > li').length <
                            document.querySelectorAll('div.tb-skin > dl:nth-of-type(2) > dd > ul > li').length ?
                            1 :
                            2;
                    // 用户选择其他种类时，刷新商品价格
                    let _temp;
                    if ((_temp = document.querySelector(`div.tb-skin > dl:nth-of-type(${itemTypeIndex}) > dd > ul`))) {
                        _temp.addEventListener('click', () => {
                            window.setTimeout(() => {
                                refreshPrice({
                                    originalPrice,
                                    promoData,
                                });
                            }, 500);
                        });
                    }
                    else {
                        return false;
                    }
                }
                // 更新商品价格
                refreshPrice({
                    originalPrice,
                    promoData,
                });
                return true;
            });
        }
        else if (siteType === SiteType.TianMao) {
            let skuList;
            let priceInfo;
            // 获取商品信息与标识 ID 之间的对应关系
            doUntilStop(() => {
                if (!window.TShop || !window.TShop.Setup) {
                    return false;
                }
                const originFunction = window.TShop.Setup;
                window.TShop.Setup = function (argv) {
                    // 有些商品（处方类药品）没有下列属性，即没有多种类可供选择，因此跳过这类商品
                    if (argv.valItemInfo) {
                        skuList = argv.valItemInfo.skuList;
                        isMultiTypeItem = skuList.every((sku) => multiTypeItemCheckRegExp.test(sku.pvs)); // 判断是否是多选择项商品
                        log('skuList', skuList);
                    }
                    // 继续执行原来的函数
                    originFunction(argv);
                };
                return true;
            });
            // 获取每个商品子类的价格
            doUntilStop(() => {
                if (!window.setMdskip) {
                    return false;
                }
                const originFunction = window.setMdskip;
                window.setMdskip = function (argv) {
                    priceInfo = argv.defaultModel.itemPriceResultDO.priceInfo;
                    log('priceInfo', priceInfo);
                    // 继续执行原来的函数
                    originFunction(argv);
                };
                return true;
            });
            // 尝试将价格信息显示在商品列表中，每隔一秒尝试一次，失败 20 次后停止
            doUntilStop(() => {
                if (!priceInfo || !skuList) {
                    log('数据没有准备好');
                    return false;
                }
                if (!document.querySelector('div.tb-sku')) {
                    log('页面结构没有准备好');
                    return false;
                }
                log('数据已经准备好');
                log('是否是多种类商品', isMultiTypeItem);
                // 如果当前商品存在多个种类，则为种类选择增加点击事件侦听，当发生点击时更新替换了价格数据
                if (isMultiTypeItem) {
                    itemTypeIndex =
                        document.querySelectorAll('div.tb-sku > dl:nth-of-type(1) > dd > ul > li').length <
                            document.querySelectorAll('div.tb-sku > dl:nth-of-type(2) > dd > ul > li').length ?
                            1 :
                            2;
                    // 用户选择其他种类时，刷新商品价格
                    let _temp;
                    if ((_temp = document.querySelector(`div.tb-sku > dl:nth-of-type(${itemTypeIndex}) > dd > ul`))) {
                        _temp.addEventListener('click', () => {
                            window.setTimeout(() => {
                                refreshPrice({
                                    priceInfo,
                                    skuList,
                                });
                            }, 500);
                        });
                    }
                }
                // 更新商品价格
                refreshPrice({
                    priceInfo,
                    skuList,
                });
                return true;
            });
        }
    }
    // 执行
    addStyleSheet();
    getPriceInformation();
}());
