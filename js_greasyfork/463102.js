// ==UserScript==
// @name         KMERP_DETAILS
// @namespace    lezizi
// @version      0.1.7
// @description  订单信息辅助
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erpa.superboss.cc/favicon.ico
// @grant        none
// ==/UserScript==

'use strict';

// Your code here...
// 获取订单列表
function getKMDetails() {
    let details = document.querySelectorAll("div.module-trade-list-item-selected");
    if (details.length < 1) {
        showToast("未选择订单");
        return;
    }
    let detailArray = [];
    for (let detail of details) {
        let d = getDetailInfo(detail);
        if (typeof (d) === "string") {
            showToast(`订单${d}商品未加载，请先展开商品详情`);
            return;
        }
        detailArray.push(d);
    }
    return detailArray;
}

// 获取订单详情
function getDetailInfo(params) {
    let result = {};
    // 订单相关
    result.SysId = params.getAttribute("sid");
    result.OlId = params.getAttribute("tids");
    result.ExpNumber = params.getAttribute("outsid");
    result.ExpName = getExpressName(result.ExpNumber);
    // 收货地址提取
    let addr = params.querySelectorAll("span.J_Shipping_Address span.js-dcrypt-show");
    //let ssq = params.querySelector("span.detailed-address").firstChild.textContent.replace("详细地址：", "").split(" ");
    //2023.4.26 页面更新
    let ssq = params.querySelectorAll("span.J_Shipping_Address span.value")[2].innerText.split(" ");
    result.Number = addr[1].innerText;
    [result.Mobile, result.Ext] = result.Number.split("-");
    result.Name = addr[0].innerText.replaceAll(" ", "_").replaceAll(",", ".");
    result.Name = result.Ext !== void 0 && !result.Name.includes(result.Ext) ? result.Name + `[${result.Ext}]` : result.Name
    result.Name = result.Name.length < 2 ? `${result.Name}_` : result.Name;
    result.Sheng = ssq[0];
    result.Shi = ssq[1];
    result.Qu = ssq[2];
    // 特殊区特殊处理下
    const QuKV = [["集安路555号", "同安区"], ["洪梅镇", "洪梅镇"], ["金湾区", "金湾区"]];
    for (let kv of QuKV) {
        result.Qu = result.Qu.includes(kv[0]) ? kv[1] : result.Qu;
    }
    result.Other = addr[2].innerText.replaceAll(" ", "").replaceAll(",", ".");
    //商品列表提取
    result.GoodsString = "";
    result.GoodsArray = [];
    let goods = params.querySelectorAll("div.item-snapshot-itemname");
    if (goods.length < 1) {
        return result.SysId;
    }
    for (let g of goods) {
        let temp = {};
        temp.Code = g.getAttribute("data-outerid");
        let rows = g.querySelectorAll("div.prod-properties");
        for (let r of rows) {
            if (r.innerText.includes("系统规格")) {
                temp.Name = r.lastChild.textContent.replaceAll(" ", "").replaceAll("\n", "");
                if (temp.Name === "") {
                    let ng = r.querySelectorAll("span")[1].innerText
                    temp.Name = ng.substring(1, ng.length - 1);
                }
            }
        }
        if (temp.Name === undefined) {
            temp.Code = "未匹配";
            temp.Name = "未匹配商品";
        }
        temp.Count = g.querySelector("span.needNum").innerText;
        if (goods.length > 1) {
            if (!`LTX002,LTX003,LTX103`.includes(temp.Code)) {
                result.GoodsString += `[${temp.Name}]x${temp.Count};`;
                result.GoodsArray.push(temp);
            }
        } else {
            result.GoodsString += `[${temp.Name}]x${temp.Count};`;
            result.GoodsArray.push(temp);
        }
    }
    //留言提取
    let msg = params.querySelector("span.label-leavemessage").parentNode.querySelectorAll("span")[1];
    if (msg.classList.toString() === "") {
        result.Msg = msg.innerText.replaceAll("\t", "|").replaceAll("\n", "|");
    } else {
        result.Msg = "";
    }
    //备注提取
    let memo = params.querySelector("span.msg-seller-memo");
    if (memo !== null) {
        result.Memo = memo.innerText.replaceAll("\t", "|").replaceAll("\n", "|");
    } else {
        result.Memo = "";
    }
    //返回处理结果
    return result;
}

/**判断快递公司
* @param {string} number 订单快递单号
* @return {string} 快递名称
*/
function getExpressName(number) {
    number = `${number}`.replaceAll("'", "");
    let len = number.length;
    if (number.startsWith("75") && len == 12) {
        return "安能";
    }
    if (number.startsWith("DPK")) {
        return "德邦";
    }
    if ((number.startsWith("11") || number.startsWith("12")) && len == 13) {
        return "EMS";
    }
    if (number.startsWith("JDKA") || number.startsWith("KK")) {
        return "京东";
    }
    if (number.startsWith("JT")) {
        return "极兔";
    }
    if ((number.startsWith("75") || number.startsWith("78")) && len == 14) {
        return "中通";
    }
    if (number.startsWith("77") && len == 15) {
        return "申通";
    }
    if (number.startsWith("9") && len == 13) {
        return "邮政";
    }
    if (number.startsWith("YT")) {
        return "圆通";
    }
    if (number.startsWith("SF")) {
        return "顺丰";
    }
    if ((number.startsWith("32") || number.startsWith("18")) && len == 12) {
        return "顺丰";
    }
    if (number.startsWith("99") && len == 15) {
        return "顺丰";
    }
    if (number.startsWith("4") && len == 15) {
        return "韵达";
    }
    return ""
}

function showToast(msg, duration) {
    duration = isNaN(duration) ? 2000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width:60%; min-width:100px; background:#6495ED; opacity:0.6; height:auto;min-height: 50px; color:#fff; line-height:50px; text-align:center; border-radius:4px; position:fixed; top:30%; left:20%; z-index:999999; font-size:36px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}