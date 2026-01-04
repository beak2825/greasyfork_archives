// ==UserScript==
// @name         千牛批量查询订单号
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  千牛批量查询
// @author       HtMz
// @match        https://healthcenter.taobao.com/home/health_home.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478146/%E5%8D%83%E7%89%9B%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/478146/%E5%8D%83%E7%89%9B%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E5%8F%B7.meta.js
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

    navigator.updatePunishId = async function (punishId) {
        let punishIdNode = document.getElementById("punishId");
        navigator.reactAutoEvent(punishIdNode, punishId);
    }

    navigator.clickSelect = async function () {
        let antFormItemChildrenNodeTags = document.getElementsByClassName("ant-form-item-children");
        let resultAntFormItemChildrenNodeTag = null;
        for (let antFormItemChildrenNodeTag of antFormItemChildrenNodeTags) {
            let content = antFormItemChildrenNodeTag.innerText;
            if (content !== "搜 索") {
                continue
            }
            resultAntFormItemChildrenNodeTag = antFormItemChildrenNodeTag;
            break
        }
        if (!resultAntFormItemChildrenNodeTag) {
            throw Error("未找到");
        }
        resultAntFormItemChildrenNodeTag.children[0].click();
    }

    navigator.matchOrderNumber = async function () {
        let tipTags = document.getElementsByClassName("col-right low-height");
        if (tipTags.length !== 1) {
            return -1;
        }

        let tipStr = tipTags[0].innerText;

        let orderReg = /订单号：([0-9]+)，根据/;

        let order = orderReg.exec(tipStr);
        if (!order) {
            throw Error("订单号匹配失败");
        }
        order = order[1].trim();
        return order
    }

    navigator.getOrderId = async function (punishId) {
        // 更新搜索框
        await navigator.updatePunishId(punishId);

        // 点击搜索按钮
        await navigator.clickSelect();

        await new Promise((resolve) => setTimeout(resolve, 2500));
        // 匹配订单号
        let orderNo = await navigator.matchOrderNumber();

        // 判断是否出现阿里验证码
        while (1) {
            let verificationCodeLi = document.getElementsByClassName("baxia-dialog auto");
            if (verificationCodeLi.length > 0 && verificationCodeLi[0].style && verificationCodeLi[0].style.display !== "none") {
                console.log("出现了阿里验证码,等待3秒后继续执行");
                await new Promise((resolve) => setTimeout(resolve, 3000));
                // 滑过阿里验证码后,重新查询
                orderNo = await navigator.getOrderId(punishId);
            } else {
                break
            }
        }
        return orderNo
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
        let orderQnHtListStrNode = document.getElementById("orderQnHtListStr");
        let orderQnHtListStr = orderQnHtListStrNode.value;
        if (!orderQnHtListStr || !orderQnHtListStr.trim()) {
            return []
        }
        return orderQnHtListStr.split("\n");
    }

    navigator.clickSelectQnHt = async function () {
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
        let key = "QN_PUNISH_ID_TO_ORDER_NO_HT_LM";
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
            if (!punishId.trim()) {
                continue
            }
            let orderNo;
            if (cacheOrderNoInfo.hasOwnProperty(punishId)) {
                orderNo = cacheOrderNoInfo[punishId];
            } else {
                orderNo = await navigator.getOrderId(punishId);
                if (orderNo === -1) {
                    if (!confirm("未查询到" + punishId + "对应的订单号, 是否跳过?")) {
                        incompletePunishIdLi.push(punishId);
                        console.log("未查询到,填入重新查询");
                    }else{
                        // save orderNo
                        result[punishId] = orderNo;
                        cacheOrderNoInfo[punishId] = orderNo;
                        // 保存到localStorage
                        localStorage.setItem(key, JSON.stringify(cacheOrderNoInfo));
                    }
                    continue
                }
                console.log(punishId, orderNo);
                // 清空输入框
                await navigator.getOrderId(1);
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
        navigator.setCookie(key, JSON.stringify(result), 300, ".taobao.com");

        // 全部完成后, 移除localStorage
        localStorage.removeItem(key);

        console.log(JSON.stringify(result));

        alert("全部查询完毕~");

        // 移除复制按钮的禁用功能
        document.getElementById("copyQnHt").removeAttribute("disabled");

        document.getElementById("content").value = navigator.getCookie("QN_PUNISH_ID_TO_ORDER_NO_HT_LM");
        contentNode.style.display = "block"
    }

    navigator.writeClipper = function () {
        // 获取需要复制的值
        let contentText = navigator.getCookie("QN_PUNISH_ID_TO_ORDER_NO_HT_LM");
        if(!contentText || contentText === ""){
            alert('无内容')
            return
        }

        let w = document.getElementById("ownCopyTextHt00912");
        if(!w){
            w = document.createElement('textarea');
            w.id = "ownCopyTextHt00912";
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

        // 将input元素隐藏，通知操作完成！
        // w.style.display = 'none';
        alert('已写入剪切板，请粘贴数据！');
    };

    $(document).ready(function () {
        if (location.href.indexOf("violationList") !== -1) {
            let divTag = document.createElement("div");
            let copyHfHt = document.getElementById("copyQnHt");
            if (!copyHfHt) {
                // divTag.innerHTML = '<div style="z-index: 99;position: fixed;top: 29%;right: 5%;font-size: 4px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="" id="orderQnHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-round" type="submit" style="" onclick="navigator.clickSelectQnHt()">点击查询</button><div><label><textarea style="max-height:100px; min-height: 100px; display: none" id="content" class="ant-input" ></textarea></label></div></div>'
                // divTag.innerHTML = '<div style="z-index: 99;position: fixed;top: 29%;right: 5%;font-size: 4px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="" id="orderQnHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-round" type="submit" style="" onclick="navigator.clickSelectQnHt()">点击查询</button><button class="ant-btn ant-btn-round" id="copyQnHt" type="submit" style="" disabled="" onclick="navigator.writeClipper()">复制结果</button></div>'

                divTag.innerHTML = '<div style="z-index: 99;position: fixed;top: 29%;right: 5%;font-size: 4px;text-align: center;padding: 3px;border-radius: 9px;border: 1px solid #e6e9ed;background: #ebf0f5;width:30%"><h3>批量查询订单号</h3><div><label><textarea style="" id="orderQnHtListStr" class="ant-input" ></textarea></label></div><button class="ant-btn ant-btn-round" type="submit" style="" onclick="navigator.clickSelectQnHt()">点击查询</button><button class="ant-btn ant-btn-round" id="copyQnHt" type="submit" style="" disabled="" onclick="navigator.writeClipper()">一键复制</button><div id="contentDiv" style="display: none"><div style=" font-size: 4px; text-align: left; padding-left: 5px;">查询结果:</div><label><textarea style="max-height:100px; min-height: 100px;" id="content" class="ant-input" ></textarea></label></div></div>'

                document.body.appendChild(divTag);
            }
        }
    })
})();