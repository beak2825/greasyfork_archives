// ==UserScript==
// @name         惠飞批量查询订单号
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  惠飞批量查询
// @author       HtMz
// @match        https://saas.flight.fliggy.com/common/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fliggy.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478147/%E6%83%A0%E9%A3%9E%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/478147/%E6%83%A0%E9%A3%9E%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    navigator.reactAutoEvent = function (doc, value, eventName = "input") {
        let doc1 = doc;
        let lastValue;
        if (eventName === "input") {
            lastValue = doc1.value;
            doc1.value = value;
        }
        let event = new Event(eventName, {bubbles: true});
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = doc1._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        doc1.dispatchEvent(event);
    };

    navigator.updatePunishId = function (punishId) {
        let punishIdNode = document.getElementById("orderId");
        navigator.reactAutoEvent(punishIdNode, punishId);
    }

    navigator.clickSelect = async function (contentText) {
        let antFormItemChildrenNodeTags = document.getElementsByClassName("ant-btn ant-btn-primary");
        let resultAntFormItemChildrenNodeTag = null;
        for (let antFormItemChildrenNodeTag of antFormItemChildrenNodeTags) {
            let content = antFormItemChildrenNodeTag.innerText;
            if (content !== contentText) {
                continue
            }
            resultAntFormItemChildrenNodeTag = antFormItemChildrenNodeTag;
            break
        }
        if (!resultAntFormItemChildrenNodeTag) {
            throw Error("未找到查询按钮");
        }
        resultAntFormItemChildrenNodeTag.click();
    }

    navigator.matchOrderNumber = async function (price) {
        let antTableTbody = document.getElementsByClassName("ant-table-tbody")[0];

        let antTrTbodyLi = antTableTbody.children;

        let orderNo = -1;

        for (let antTrTbody of antTrTbodyLi) {

            let antTdTbodyList = antTrTbody.children;

            if (antTdTbodyList.length !== 9) {
                continue
            }

            let nameLi = ["赔付单号", "关联订单号", "创建时间", "赔付状态", "金额", "币种", "工单类型", "赔付原因", "备注"]
            let result = {}
            for (let antTdTbodyIndex in antTdTbodyList) {
                if (!antTdTbodyList.hasOwnProperty(antTdTbodyIndex)) {
                    continue
                }
                result[nameLi[antTdTbodyIndex]] = antTdTbodyList[antTdTbodyIndex].innerText.trim();
            }

            if (result["金额"] === price) {
                orderNo = {
                    "orderNumber": result["关联订单号"],
                    "remark": result["备注"],
                };
                break
            }
        }
        return orderNo;
    }

    navigator.getOrderId = async function (punishIdAndPrice) {

        let punishIdAndPriceLi = punishIdAndPrice.split(",");
        let punishId = punishIdAndPriceLi[0];
        let price = punishIdAndPriceLi[1];

        // 更新搜索框
        navigator.updatePunishId(punishId);

        // 点击搜索按钮
        await navigator.clickSelect("查询");

        await new Promise((resolve) => setTimeout(resolve, 1000));
        // 匹配订单号
        return navigator.matchOrderNumber(price);
    }

    navigator.setCookie = function (cname, cvalue, exseconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exseconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }

    navigator.getCookie = function (cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    navigator.getIncompletePunishIdLi = function () {
        let orderQnHtListStrNode = document.getElementById("orderHfHtListStr");
        let orderQnHtListStr = orderQnHtListStrNode.value;
        if (!orderQnHtListStr || !orderQnHtListStr.trim()) {
            return []
        }
        return orderQnHtListStr.split("\n");
    }

    navigator.clickSelectHfHt = async function () {
        let contentNode = document.getElementById("contentDiv");
        if(contentNode){
            contentNode.style.display = "none"
        }
        let incompletePunishIdLi = navigator.getIncompletePunishIdLi();
        if (incompletePunishIdLi.length === 0) {
            alert("填写内容有误,无法解析");
            return
        }
        let result = {};
        let lastOrderNo = null;

        // 历史缓存
        let key = "HF_PUNISH_ID_TO_ORDER_NO_HT_LM";
        let cacheOrderNoInfo = localStorage.getItem(key);
        cacheOrderNoInfo = cacheOrderNoInfo ? JSON.parse(cacheOrderNoInfo) : {};

        // 缓存的cookie
        let cacheOrderNoInfoCookie = navigator.getCookie(key);
        cacheOrderNoInfoCookie = cacheOrderNoInfoCookie ? JSON.parse(cacheOrderNoInfoCookie) : {};
        for (let key in cacheOrderNoInfoCookie) {
            if (!cacheOrderNoInfoCookie.hasOwnProperty(key)) {
                continue
            }
            cacheOrderNoInfo[key] = cacheOrderNoInfoCookie[key]
        }

        while (incompletePunishIdLi.length) {
            let punishId = incompletePunishIdLi.shift();
            if(!punishId || !punishId.trim()){
                continue
            }
            let orderNo;
            if (cacheOrderNoInfo.hasOwnProperty(punishId)) {
                orderNo = cacheOrderNoInfo[punishId];
            } else {
                orderNo = await navigator.getOrderId(punishId);
                console.log(punishId, orderNo);
                if (document.getElementsByClassName("ant-modal-close").length) {
                    if (!confirm("未查询到" + punishId + "对应的订单号, 是否忽略?(不忽略则会继续查询)")) {
                        incompletePunishIdLi.push(punishId);
                        console.log("未查询到,填入重新查询");
                    }else{
                        result[punishId] = orderNo;
                        cacheOrderNoInfo[punishId] = orderNo;
                        localStorage.setItem(key, JSON.stringify(cacheOrderNoInfo));
                    }
                    await navigator.clickSelect("知道了");
                    continue
                }
            }

            if (orderNo === lastOrderNo && orderNo !== -1) {
                // 如果出现的punishId保存过,则继续跳过,否则添入重新执行
                if (!result.hasOwnProperty(punishId)) {
                    incompletePunishIdLi.push(punishId);
                    console.log(punishId + "未完成搜索,重新执行");
                }
                continue
            }
            lastOrderNo = orderNo;
            // save orderNo
            result[punishId] = orderNo;
            cacheOrderNoInfo[punishId] = orderNo;
            // 保存到localStorage
            localStorage.setItem(key, JSON.stringify(cacheOrderNoInfo));
        }

        // 保存到cookie中
        navigator.setCookie(key, JSON.stringify(result), 300, ".fliggy.com");

        // 全部完成后, 移除localStorage
        localStorage.removeItem(key);

        console.log(JSON.stringify(result));

        alert("全部查询完毕, 请手工复制结果~");

        // // 移除复制按钮的禁用功能
        document.getElementById("copyHfHt").removeAttribute("disabled");

        document.getElementById("content").value = navigator.getCookie("HF_PUNISH_ID_TO_ORDER_NO_HT_LM");

        contentNode.style.display = "block"
    }

    navigator.writeClipper = function () {
        // 获取需要复制的值
        let contentText = navigator.getCookie("HF_PUNISH_ID_TO_ORDER_NO_HT_LM");
        if(!contentText || contentText === ""){
            alert('无内容')
            return
        }

        let w = document.getElementById("ownCopyTextHt00952");
        if(!w){
            w = document.createElement('textarea');
            w.id = "ownCopyTextHt00952";
            document.body.appendChild(w);
        }else{
            if(w.type !== 'textarea'){
                alert("复制失败");
                return;
            }
        }
        w.value = contentText;
        w.select();

        // 调用浏览器的复制命令
        document.execCommand("Copy");

        alert('已写入剪切板，请粘贴数据！');
    };

    $(document).ready(function () {
        if (location.href === "https://saas.flight.fliggy.com/common/index#/web/support/capital/list?action=page") {
            let divTag = document.createElement("div");
            let copyHfHt = document.getElementById("copyHfHt");
            if (!copyHfHt) {
                // divTag.innerHTML = '<div style="z-index: 99;position: fixed;bottom: 20%;right: 5%;font-size: 20px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="min-height: 100px;" id="orderHfHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-primary" type="submit" style="" onclick="navigator.clickSelectHfHt()">点击查询</button><div><label><textarea style="max-height:100px; min-height: 100px; display: none" id="content" class="ant-input" ></textarea></label></div></div>'
                // divTag.innerHTML = '<div style="z-index: 99;position: fixed;bottom: 20%;right: 5%;font-size: 20px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="min-height: 100px;" id="orderHfHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-primary" type="submit" style="" onclick="navigator.clickSelectHfHt()">点击查询</button><button class="ant-btn" id="copyHfHt" type="submit" style="margin-left: 8px;" disabled="" onclick="navigator.writeClipper()">复制结果</button></div>'

                divTag.innerHTML = '<div style="z-index: 99;position: fixed;bottom: 20%;right: 5%;font-size: 20px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="min-height: 100px;" id="orderHfHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-primary" type="submit" style="" onclick="navigator.clickSelectHfHt()">点击查询</button><button class="ant-btn" id="copyHfHt" type="submit" style="margin-left: 8px;" disabled="" onclick="navigator.writeClipper()">一键复制</button><div id="contentDiv" style="display: none"><div style=" font-size: 14px; text-align: left; padding-left: 5px;">查询结果:</div><label><textarea style="max-height:100px; min-height: 100px;" id="content" class="ant-input" ></textarea></label></div></div>'
                document.body.appendChild(divTag);
            }
        }
    })
})();