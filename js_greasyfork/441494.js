// ==UserScript==
// @name         ss-shopline交易订单辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  ss-shopline交易订单辅助脚本，方便测试校验订单数据
// @author       CShWen
// @match        *://fishbone-test.inshopline.com/*
// @match        *://fishbone.inshopline.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/441494/ss-shopline%E4%BA%A4%E6%98%93%E8%AE%A2%E5%8D%95%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441494/ss-shopline%E4%BA%A4%E6%98%93%E8%AE%A2%E5%8D%95%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict'

    function log(value) {
        console.log(value);
    }

    log('sstest start loading script.');

    let oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        let req = args[0]
        if (req != null) {
            let reqJson = JSON.parse(req);
            if (reqJson.business == "TRADE" && reqJson.methodName == "OrderQuery") {
                this.reqBusinessMethodName = "TRADE-OrderQuery"
            }
        }
        return oldSend.apply(this, args);
    };

    var accessor = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        "response"
    );

    Object.defineProperty(XMLHttpRequest.prototype, "response", {
        get: function () {
            let response = accessor.get.call(this);
            // 在__on_response里修改你的response
            // 直接返回
            if (this.reqBusinessMethodName == undefined) { return response; }
            if (this.reqBusinessMethodName == "TRADE-OrderQuery") {
                refreshLabel(response);
                refreshTableContent(response);
            }
            return response;
        },
        set: function (str) {
            return accessor.set.call(this, str);
        },
        configurable: true,
    });

    $("body").append(' <button id="ss_trade_order_aid_btn" style="right: 140px;top: 10px;background: #FF6600;color:#ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 98px;height: 30px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;">交易订单辅助</button>  <div id="ss_aid_view" style="right: 10px;top: 50px;background: #F0F8FF;opacity: 0.9;overflow: hidden;z-index: 999;position: fixed;padding:5px;display:none;"> <p id="aid_trans_currency"></p>  <p id="aid_trans_payChannelSplitSum"></p> <table border="1"><tr><th>商品名</th><th>单价</th><th>数量</th><th>商品总价(+)</th><th>合计</th><th>营销(-)</th><th>商品税(+)</th><th>运费(+)</th><th>运费税(+)</th><th>商家自定义折扣(-)</th><th>小费(+)</th><th>积分抵扣金额(-)</th><th>可获得积分</th><th>支付渠道分计</th></tr></table></div>');

    $(function () {
        $("#ss_trade_order_aid_btn").click(function () {
            if ($("#ss_aid_view").css("display") == "none") {
                $("#ss_aid_view").show();
            } else {
                $("#ss_aid_view").hide();
            }
        });
    });

    // 重新渲染 table 内容
    function refreshTableContent(bodyJsonOjb) {
        $("#ss_aid_view table tr:not(:first)").empty("");

        let ordersItemArray = bodyJsonOjb.data.orderDetailList[0].ordersItemList;
        if (ordersItemArray.length == 0) {
            return;
        }

        let auditProductNum = 0, auditProductAmount = 0, auditTotalAmount = 0, auditDiscountAmount = 0, auditTaxAmount = 0, auditExpressAmount = 0, auditExpressSurchargeAmount = 0, auditDiscountAmountExt = 0, auditTipAmount = 0, auditDeductMemberPointAmount = 0, auditAddMemberPointNum = 0;
        for (let i in ordersItemArray) {
            let piJson = JSON.parse(ordersItemArray[i].paymentInfo);

            auditProductAmount += piJson.productAmount;
            auditTotalAmount += piJson.totalAmount;
            auditDiscountAmount += piJson.discountAmount;
            auditTaxAmount += piJson.taxAmount;
            auditExpressAmount += piJson.expressAmount;
            auditExpressSurchargeAmount += piJson.expressSurchargeAmount;
            auditDiscountAmountExt += piJson.discountAmountExt;
            auditTipAmount += piJson.tipAmount;
            auditDeductMemberPointAmount += piJson.deductMemberPointAmount;
            auditAddMemberPointNum += piJson.addMemberPointNum;
        }

        for (let i in ordersItemArray) {
            let piJson = JSON.parse(ordersItemArray[i].paymentInfo);
            let trStr = concatOrderItemTrHtml(ordersItemArray[i].title, ordersItemArray[i].productPrice, ordersItemArray[i].productNum,
                {
                    "productAmount": buildNumberAndPercentStr(piJson.productAmount, auditProductAmount),
                    "totalAmount": buildNumberAndPercentStr(piJson.totalAmount, auditTotalAmount),
                    "discountAmount": buildNumberAndPercentStr(piJson.discountAmount, auditDiscountAmount),
                    "taxAmount": buildNumberAndPercentStr(piJson.taxAmount, auditTaxAmount),
                    "expressAmount": buildNumberAndPercentStr(piJson.expressAmount, auditExpressAmount),
                    "expressSurchargeAmount": buildNumberAndPercentStr(piJson.expressSurchargeAmount, auditExpressSurchargeAmount),
                    "discountAmountExt": buildNumberAndPercentStr(piJson.discountAmountExt, auditDiscountAmountExt),
                    "tipAmount": buildNumberAndPercentStr(piJson.tipAmount, auditTipAmount),
                    "deductMemberPointAmount": buildNumberAndPercentStr(piJson.deductMemberPointAmount, auditDeductMemberPointAmount),
                    "addMemberPointNum": buildNumberAndPercentStr(piJson.addMemberPointNum, auditAddMemberPointNum),
                    "payChannelSplitSum": buildNumberAndPercentStr(piJson.productAmount + piJson.taxAmount - piJson.discountAmountExt + piJson.tipAmount - piJson.deductMemberPointAmount),
                });
            $("#ss_aid_view table tbody").append(trStr);
        }
        // 追加审计汇总
        let auditStr = concatOrderItemTrHtml("☆汇总☆", "-", auditProductNum, {
            "productAmount": auditProductAmount,
            "totalAmount": auditTotalAmount,
            "discountAmount": auditDiscountAmount,
            "taxAmount": auditTaxAmount,
            "expressAmount": auditExpressAmount,
            "expressSurchargeAmount": auditExpressSurchargeAmount,
            "discountAmountExt": auditDiscountAmountExt,
            "tipAmount": auditTipAmount,
            "deductMemberPointAmount": auditDeductMemberPointAmount,
            "addMemberPointNum": auditAddMemberPointNum
        });
        $("#ss_aid_view table tbody").append(auditStr);
    }

    // 拼接 table tr 行内容
    function concatOrderItemTrHtml(title, productPrice, productNum, piJson) {
        let trStr = '<tr>';
        trStr += ('<td>' + title + '</td>');
        trStr += ('<td>' + productPrice + '</td>');
        trStr += ('<td>' + productNum + '</td>');
        trStr += ('<td>' + piJson.productAmount + '</td>');
        trStr += ('<td>' + piJson.totalAmount + '</td>');
        trStr += ('<td>' + piJson.discountAmount + '</td>');
        trStr += ('<td>' + piJson.taxAmount + '</td>');
        trStr += ('<td>' + piJson.expressAmount + '</td>');
        trStr += ('<td>' + piJson.expressSurchargeAmount + '</td>');
        trStr += ('<td>' + piJson.discountAmountExt + '</td>');
        trStr += ('<td>' + piJson.tipAmount + '</td>');
        trStr += ('<td>' + piJson.deductMemberPointAmount + '</td>');
        trStr += ('<td>' + piJson.addMemberPointNum + '</td>');
        trStr += ('<td>' + piJson.payChannelSplitSum + '</td>');
        trStr += '</tr>';
        return trStr;
    }

    // 求算百分比并输出为html
    function buildNumberAndPercentStr(ori, total) {
        if (Number.isFinite(ori) && Number.isFinite(total) && ori != 0 && total != 0) {
            return ori + '(' + Math.round(ori / total * 10000) / 100 + '%)';
        } else {
            return ori;
        }
    }

    function refreshLabel(bodyJsonOjb) {
        $("#ss_aid_view p").empty("");
        $("#aid_trans_currency").text("交易币种：" + bodyJsonOjb.data.transCurrency);
        $("#aid_trans_payChannelSplitSum").text("支付渠道分计=商品总价+商品税-商家自定义折扣+小费-积分抵扣金额");
    }

    log('sstest load script completed.');
})();