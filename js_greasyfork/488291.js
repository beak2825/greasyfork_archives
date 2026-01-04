// ==UserScript==
// @name         tongdian
// @namespace    http://web.yuyehk.cn/
// @version      1.8.3
// @description  雨夜工作室实用系列!
// @author       YUYE
// @match        *://s.taobao.com/search*
// @match        *://list.tmall.com/search*
// @match        *://scportal.taobao.com/*
// @match        *://search.jd.com/*
// @match        *://mobile.yangkeduo.com/*
// @match        *://mall.jd.com/showLicence*
// @match        *://yangkeduo.com/*
// @match        http*://detail.tmall.com/item.htm*
// @match        http*://tcs.jiyunhudong.com/workprocess/6983936727631020548*
// @match        http*://aidp.bytedance.com/*
// @license      BSD
// @icon         http://fk.yuyehk.cn:81/uploads/images/ffaf74f0b5ed1ffc420401645c5d6ecf.png
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488291/tongdian.user.js
// @updateURL https://update.greasyfork.org/scripts/488291/tongdian.meta.js
// ==/UserScript==

(function() {
    function jiancha(){
            // 获取需要判断的元素
            // 同店是
            const isSameShopYes = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)");
            // 同店否
            const isSameShopNo = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(2)");
            // 同店不确定
            const isSameShopUncertain = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(3)");

            // 店铺资质
            const zhizi = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(2) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 法人
            const faren = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(3) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            //P3
            const p3pin = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(4) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 店铺名称
            const 店铺名称 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(5) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 品牌是否相同
            const 品牌 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(6) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 发货地 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(7) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 品类 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(8) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 同款商品 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(9) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 资质图 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.neeko-container > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(2) > div.arco-upload-list.arco-upload-list-type-picture-card")
            const 站外图片 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.neeko-container > div:nth-child(4) > div > div > div > div > div > div > div > div:nth-child(2) > div.arco-upload-list.arco-upload-list-type-picture-card")

            // 备注
            const beizhu = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.arco-row.arco-row-align-start.arco-row-justify-start.arco-form-item.arco-form-layout-horizontal.neeko-form-item > div.arco-col.arco-col-19.arco-form-item-wrapper > div > div > div > div > div")

            // 定义判断条件
            const conditions = {
                isSameShopYes: isSameShopYes.querySelector('input[type="radio"]').checked,
                isSameShopNo: isSameShopNo.querySelector('input[type="radio"]').checked,
                isSameShopUncertain: isSameShopUncertain.querySelector('input[type="radio"]').checked,
                zhizi: zhizi.querySelector('input[type="radio"]').checked,
                faren: faren.querySelector('input[type="radio"]').checked,
                p3pin: p3pin.querySelector('input[type="radio"]').checked,
                店铺名称: 店铺名称.querySelector('input[type="radio"]').checked,
                品牌: 品牌.querySelector('input[type="radio"]').checked,
                发货地: 发货地.querySelector('input[type="radio"]').checked,
                品类: 品类.querySelector('input[type="radio"]').checked,
                同款商品: 同款商品.querySelector('input[type="radio"]').checked,
                资质图: 资质图.innerHTML.trim(),
                站外图片: 站外图片.innerHTML.trim(),
                beizhu: beizhu.title
            };
            // 判断品牌、发货地、品类、同款商品中至少有两个为 true
            const trueCount = [conditions.品牌, conditions.发货地, conditions.品类, conditions.同款商品].filter(Boolean).length;

            // 判断逻辑
            if (conditions.isSameShopYes) {
                console.log("是同店");
                // 在同店是的情况下，判断 zhizi、faren、p3pin 是否其一为 true
                if (conditions.zhizi || conditions.faren || conditions.p3pin) {
                    console.log("zhizi、faren、p3pin 其中之一为 true");
                    // 判断店铺名称是否为 true
                    if (conditions.店铺名称) {
                        console.log("店铺名称为 true");
                        if (trueCount >= 2) {
                            console.log("品牌、发货地、品类、同款商品 中至少有两个为 true");
                        } else {
                            console.log("品牌、发货地、品类、同款商品 中不足两个为 true");
                            // 弹窗提醒
                            alert("店铺名称相似但不满足下面其二为是不应该是同店，请检查！");
                            // 返回
                            return;
                        }
                    } else {
                        console.log("店铺名称为 false");
                    }
                } else {
                    console.log("zhizi、faren、p3pin 均为 false");
                    // 弹窗提醒
                    alert("资质、法人、p3均为否不应该是同店，请检查！");
                    // 返回
                    return;
                }
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                    // 弹窗提醒
                    alert("是同店的情况下备注应该为空或无，请检查！");
                    // 返回
                    return;
                }
                // 判断资质图和站外图片是否都不为空
                if (conditions.资质图 && conditions.站外图片) {
                    console.log("资质图和站外图片都不为空");
                } else {
                    console.log("资质图和站外图片中至少有一个为空");
                    // 弹窗提醒
                    alert("缺少资质图，请检查！");
                    // 返回
                    return;
                }

            }else if (conditions.isSameShopNo) {
                console.log("不是同店");
                if (!conditions.zhizi && !conditions.faren && !conditions.p3pin) {
                    console.log("zhizi、faren、p3pin 均为 false");
                } else {
                    console.log("zhizi、faren、p3pin 中至少有一个为 true");
                    // 弹窗提醒
                    alert("不是同店的情况下资质、法人、p3应该均为否，请检查！");
                    // 返回
                    return;
                }
                // 判断店铺名称是否为 true
                if (conditions.店铺名称) {
                    console.log("店铺名称为 true");

                    if (trueCount >= 2) {
                        console.log("品牌、发货地、品类、同款商品 中至少有两个为 true");
                        // 弹窗提醒
                        alert("店铺名称相似但满足下面其二为是不应该是非同店，请检查！");
                        // 返回
                        return;
                    } else {
                        console.log("品牌、发货地、品类、同款商品 中不足两个为 true");
                    }
                } else {
                    console.log("店铺名称为 false");
                }
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                    // 弹窗提醒
                    alert("非同店的情况下备注应该为空或无，请检查！");
                    // 返回
                    return;
                }
                // 判断资质图和站外图片是否都不为空
                if ( conditions.站外图片 === "") {
                    console.log("资质图和站外图片都不为空");
                    // 弹窗提醒
                    alert("非同店的情况站外资质图不可以为空，请检查！");
                    // 返回
                    return;
                } else {
                    console.log("资质图和站外图片中至少有一个为空");
                }
            }else if (conditions.isSameShopUncertain) {
                console.log("不确定是不是同店");
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                    // 弹窗提醒
                    alert("不确定的情况下备注应该不为空或无，请检查！");
                    // 返回
                    return;
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                }
            }else{
                console.log("没选中");
            }
        }
    'use strict';
    function hotkey() {
        var a = window.event.keyCode;
        console.log(a);
        // 监控↑键实现筛选
        if (a == 38) {
            // 获取需要判断的元素
            // 同店是
            const isSameShopYes = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)");
            // 同店否
            const isSameShopNo = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(2)");
            // 同店不确定
            const isSameShopUncertain = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(1) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(3)");

            // 店铺资质
            const zhizi = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(2) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 法人
            const faren = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(3) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            //P3
            const p3pin = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(4) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 店铺名称
            const 店铺名称 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(5) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            // 品牌是否相同
            const 品牌 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(6) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 发货地 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(7) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 品类 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(8) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 同款商品 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div:nth-child(9) > div.arco-form-item-wrapper > div > div > div > div > label:nth-child(1)")
            const 资质图 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.neeko-container > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(2) > div.arco-upload-list.arco-upload-list-type-picture-card")
            const 站外图片 = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.neeko-container > div:nth-child(4) > div > div > div > div > div > div > div > div:nth-child(2) > div.arco-upload-list.arco-upload-list-type-picture-card")

            // 备注
            const beizhu = document.querySelector("#conbination-wrap > div > div > div > div > div.neeko-container > div:nth-child(2) > div.arco-row.arco-row-align-start.arco-row-justify-start.arco-form-item.arco-form-layout-horizontal.neeko-form-item > div.arco-col.arco-col-19.arco-form-item-wrapper > div > div > div > div > div")

            // 定义判断条件
            const conditions = {
                isSameShopYes: isSameShopYes.querySelector('input[type="radio"]').checked,
                isSameShopNo: isSameShopNo.querySelector('input[type="radio"]').checked,
                isSameShopUncertain: isSameShopUncertain.querySelector('input[type="radio"]').checked,
                zhizi: zhizi.querySelector('input[type="radio"]').checked,
                faren: faren.querySelector('input[type="radio"]').checked,
                p3pin: p3pin.querySelector('input[type="radio"]').checked,
                店铺名称: 店铺名称.querySelector('input[type="radio"]').checked,
                品牌: 品牌.querySelector('input[type="radio"]').checked,
                发货地: 发货地.querySelector('input[type="radio"]').checked,
                品类: 品类.querySelector('input[type="radio"]').checked,
                同款商品: 同款商品.querySelector('input[type="radio"]').checked,
                资质图: 资质图.innerHTML.trim(),
                站外图片: 站外图片.innerHTML.trim(),
                beizhu: beizhu.title
            };
            // 判断品牌、发货地、品类、同款商品中至少有两个为 true
            const trueCount = [conditions.品牌, conditions.发货地, conditions.品类, conditions.同款商品].filter(Boolean).length;

            // 判断逻辑
            if (conditions.isSameShopYes) {
                console.log("是同店");
                // 在同店是的情况下，判断 zhizi、faren、p3pin 是否其一为 true
                if (conditions.zhizi || conditions.faren || conditions.p3pin) {
                    console.log("zhizi、faren、p3pin 其中之一为 true");
                    // 判断店铺名称是否为 true
                    if (conditions.店铺名称) {
                        console.log("店铺名称为 true");
                        if (trueCount >= 2) {
                            console.log("品牌、发货地、品类、同款商品 中至少有两个为 true");
                        } else {
                            console.log("品牌、发货地、品类、同款商品 中不足两个为 true");
                            // 弹窗提醒
                            alert("店铺名称相似但不满足下面其二为是不应该是同店，请检查！");
                            // 返回
                            return;
                        }
                    } else {
                        console.log("店铺名称为 false");
                    }
                } else {
                    console.log("zhizi、faren、p3pin 均为 false");
                    // 弹窗提醒
                    alert("资质、法人、p3均为否不应该是同店，请检查！");
                    // 返回
                    return;
                }
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                    // 弹窗提醒
                    alert("是同店的情况下备注应该为空或无，请检查！");
                    // 返回
                    return;
                }
                // 判断资质图和站外图片是否都不为空
                if (conditions.资质图 && conditions.站外图片) {
                    console.log("资质图和站外图片都不为空");
                } else {
                    console.log("资质图和站外图片中至少有一个为空");
                    // 弹窗提醒
                    alert("缺少资质图，请检查！");
                    // 返回
                    return;
                }

            }else if (conditions.isSameShopNo) {
                console.log("不是同店");
                if (!conditions.zhizi && !conditions.faren && !conditions.p3pin) {
                    console.log("zhizi、faren、p3pin 均为 false");
                } else {
                    console.log("zhizi、faren、p3pin 中至少有一个为 true");
                    // 弹窗提醒
                    alert("不是同店的情况下资质、法人、p3应该均为否，请检查！");
                    // 返回
                    return;
                }
                // 判断店铺名称是否为 true
                if (conditions.店铺名称) {
                    console.log("店铺名称为 true");

                    if (trueCount >= 2) {
                        console.log("品牌、发货地、品类、同款商品 中至少有两个为 true");
                        // 弹窗提醒
                        alert("店铺名称相似但满足下面其二为是不应该是非同店，请检查！");
                        // 返回
                        return;
                    } else {
                        console.log("品牌、发货地、品类、同款商品 中不足两个为 true");
                    }
                } else {
                    console.log("店铺名称为 false");
                }
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                    // 弹窗提醒
                    alert("非同店的情况下备注应该为空或无，请检查！");
                    // 返回
                    return;
                }
                // 判断资质图和站外图片是否都不为空
                if ( conditions.站外图片 === "") {
                    console.log("资质图和站外图片都不为空");
                    // 弹窗提醒
                    alert("非同店的情况站外资质图不可以为空，请检查！");
                    // 返回
                    return;
                } else {
                    console.log("资质图和站外图片中至少有一个为空");
                }
            }else if (conditions.isSameShopUncertain) {
                console.log("不确定是不是同店");
                // 判断 beizhu 是否等于 "无" 或空
                if (conditions.beizhu === "无" || conditions.beizhu.trim() === "") {
                    console.log("beizhu 为 '无' 或空");
                    // 弹窗提醒
                    alert("不确定的情况下备注应该不为空或无，请检查！");
                    // 返回
                    return;
                } else {
                    console.log("beizhu 不为 '无' 且不为空");
                }
            }else{
                console.log("没选中");
            }
        }

    }
    // Your code here...
    document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数

})();

