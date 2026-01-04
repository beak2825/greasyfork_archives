// ==UserScript==
// @name         波哥测试
// @namespace    https://www.erp321.com/
// @version      1.3
// @description  JST ERP订单快递号更新xxxxxxxxxxxxxxxxx
// @author       TC 技术部
// @include      /^https://w{2,3}.erp321.com/app/wms/express/expresssetter.aspx
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.8.1.min.js
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @resource layercss https://www.layuicdn.com/layer/theme/default/layer.css
// @connect      222.20.20.20
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448477/%E6%B3%A2%E5%93%A5%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/448477/%E6%B3%A2%E5%93%A5%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Hello Tampermonkey");
})();

window.onload = function () {
    addButtonByCheckResult();
    OrderData = [];
}

//网络连接检测
function chekNetOk() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://222.20.20.20",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            timeout: 5000,
            onload: function (xhr) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve("ok");
                } else {
                    resolve("proxy");
                }
            },
            onerror: function () {
                resolve("error");
            },
            ontimeout: function () {
                resolve("timeout");
            }
        });
    })
}

//添加按钮
async function addButtonByCheckResult() {
    var isClickLink = false;
    var result = await chekNetOk();
    if (result == "ok") {
        GM_notification({
            timeout: 5000,
            text: '请等待页面加载完成后，再获取订单号和快递号！'
        });
        //页面加载完成后 再页面上添加 按钮元素【获取订单号和快递号】
        var mainNode = document.querySelector('#form2>div.full.padding_left_bar>table>tbody>tr>td:nth-child(2)>div>div.top_toolbar>ul');
        var lvdanButtonHtml3 = "<button id='GetOrderAndExpressButton' class='btn_2' type='button' style='order:-1; outline:none;margin:2px 0px 0px 2px'>获取订单号和快递号</button>";
        $(mainNode).append(lvdanButtonHtml3);
        $(mainNode).on("click", "#GetOrderAndExpressButton", function () {
            var index = layer.load(1, {shade: [0.5, '#FFF']});
            GetOrderAndExpressNumMethod();
            layer.close(index);
        })
    }
    else if (result == "proxy") {
        layer.open({
            type: 1,
            area: ['370px', '180px'],
            shade: 0.5,
            id: 'check',
            content: '<div><span style="margin-left: 30px; margin-top: 20px; font-size:14px">代理服务器未连接，请选择代理服务后重新连接！</span></div><div id="linkdiv" class="link-div" style="margin-left: 30px; margin-top: 16px;"><span>请点击：</span><a id="link" href="http://222.20.20.20/" target="_blank">代理服务器登录</a></div>',
            btn: ['确定', '取消'],
            success: function (index, layero) {
                $("#linkdiv").on("click", 'a', function () {
                    isClickLink = true;
                });
            },
            yes: function (index, layero) {
                if (isClickLink) {
                    location.reload();
                }
            }
        });
    }
    else {
        layer.open({
            content: '内部服务器未响应，请使用代理服务器重新连接！'
        });
    }
}

//获取订单号快递号
function GetOrderAndExpressNumMethod() {
    var dataHtml;
    if (OrderData.length > 0) {
        dataHtml = '<div id="buttonDiv"><button id="btnOpOrder" type="button" class="btn_2" style="outline:none;margin:2px 0px 2px 0px">点击更新单号到内部系统</button></div><div class="layui-form"><table id="datatable" class="pure-table"><thead><tr><th width="100px">序号</th><th width="200px">订单号</th><th width="200px">快递号</th></tr></thead><tbody>';
        for (var i = 0; i < OrderData.length; i++) {
            dataHtml += '<tr><td class="one">' + (i + 1) + '</td><td class="two">' + OrderData[i].orderNum + '</td><td class="three">' + OrderData[i].expressNum + '</td></tr>';
        }
        dataHtml += '</tbody></table></div><div style="padding:8px;font-size:12px">共计 ' + OrderData.length + ' 条订单</div>';
    } else {
        dataHtml = initTableData();
    }
    if (dataHtml == undefined) {
        layer.open({shade: [0.5, '#FFF'], content: '订单数据获取失败！'
        });
    } else {
        layer.open({
            type: 1
            , title: '订单快递号处理'
            , area: ['700px', '410px']
            , id: 'OpOrders'
            , shade: [0.5, '#FFF']
            , content: dataHtml
            , success: function (index, layero) {
                $("#buttonDiv").on("click", '#btnOpOrder', function () {
                    var index = layer.load(1, {shade: [0.6, '#FFF']});
                    //制作一个 加载等待
                    OpOrderDataResult().then((res) => {
                        layer.close(index);
                        layer.open({
                            type: 1
                            , area: ['500px', '300px']
                            , id: 'OpResult'
                            , shade: [0.1, '#FFF']
                            , content: res
                            , btn: ['确定']
                            , yes: function (index, layero) {
                                layer.close(index);
                            }
                        });
                    })

                });
            }
        });
    }
}

var OrderData;
//数据集合
//var list;
//表格数据初始化
function initTableData() {
    OrderData = [];
    //var nodes=document.querySelector('#_jt_body_list').childNodes;
    //#_jt_body_list > div > div.rowsSite > div.rowList
    var nodes = document.querySelector('#_jt_body_list > div > div.rowsSite > div.rowList').childNodes;
    console.log(nodes);
    var list = [];
    for (var n = 0; n < nodes.length; n++) {
        var id = nodes[n].querySelector("div:nth-child(1)").innerText;
        //console.log(id);
        //var expressNum=nodes[n].querySelector("div:nth-child(9)").innerText;
        var expressNum = nodes[n].querySelector("div:nth-child(8)").innerText;
        if (expressNum != '') {
            // var onlineOrder=nodes[n].querySelector("div:nth-child(5)").innerText;
            var onlineOrder = nodes[n].querySelector("div:nth-child(4)").innerText;
            var order = new Object();
            order.id = id;
            order.orderNum = onlineOrder;
            order.expressNum = expressNum;
            list.push(order);
            //console.log("编号："+id+'，订单号：'+onlineOrder+"，快递号："+expressNum);
        }
    }
    var html;
    if (list.length > 0) {
        OrderData = list;
        html = '<div id="buttonDiv"><button id="btnOpOrder" type="button" class="btn_2" style="outline:none;margin:2px 0px 2px 0px">点击更新单号到内部系统</button></div><div class="layui-form"><table id="datatable" class="pure-table"><thead><tr><th width="100px">序号</th><th width="200px">订单号</th><th width="200px">快递号</th></tr></thead><tbody>';
        for (var i = 0; i < OrderData.length; i++) {
            html += '<tr><td class="one">' + (i + 1) + '</td><td class="two">' + list[i].orderNum + '</td><td class="three">' + list[i].expressNum + '</td></tr>';
        }
        html += '</tbody></table></div><div style="padding:8px;font-size:12px">共计 ' + list.length + ' 条订单</div>';
    }
    return html;
}

async function OpOrderDataResult() {
    var result_Html;
    var url;
    var success = 0;
    var errorOrder = '';
    for (var o = 0; o < OrderData.length; o++) {
        //测试测试 url
        //url = 'http://222.20.20.20/openapi/?m=order&a=up&dingdan='+OrderData[o].orderNum+'&kuaidihao='+OrderData[o].expressNum+'&ajax=1&debug=1';
        //正式使用 url
        url = 'http://222.20.20.20/openapi/api.php?m=order&a=upexpress&dingdan=' + OrderData[o].orderNum + '&kuaidihao=' + OrderData[o].expressNum + '&ajax=1';
        var result = await OpOrderData(url);
        if (result == "ok") {
            success++;
        } else {
            errorOrder += '<span class="span_result">订单号：' + OrderData[o].orderNum + ' 更新失败</span><br />';
        }
    }
    if (OrderData.length == success) {
        result_Html = '<span class="span_result">订单共计：' + OrderData.length + ' 条，更新成功：' + success + ' 条</span>'
    } else {
        result_Html = '<span class="span_result">订单共计：' + OrderData.length + ' 条，更新成功：' + success + ' 条，更新失败：' + (OrderData.length - success) + ' 条</span><br />' + errorOrder;
    }
    return result_Html;
}

//订单数据处理
function OpOrderData(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            timeout: 5000,
            onload: function (xhr) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //console.log(JSON.parse(xhr.responseText));
                    resolve("ok");
                } else {
                    //console.log(JSON.parse(xhr.responseText));
                    resolve("error");
                }
            },
            onerror: function (xhr) {
                //console.log(JSON.parse(xhr.responseText).message);
                resolve("error");
            },
            ontimeout: function (xhr) {
                //console.log(JSON.parse(xhr.responseText).message);
                resolve("error");
            }
        });
    })
}

document.getElementById('_jt_body').addEventListener("scroll", function () {
    var nodes = document.querySelector('#_jt_body_list > div > div.rowsSite > div.rowList').childNodes;
    //nsole.log(nodes);
    var list = [];
    for (var n = 0; n < nodes.length; n++) {
        var id = nodes[n].querySelector("div:nth-child(1)").innerText;
        var isExist = false;
        for (var o = 0; o < OrderData.length; o++) {
            if (OrderData[o].id == id) {
                isExist = true;
            }
        }
        if (!isExist) {
            var expressNum = nodes[n].querySelector("div:nth-child(8)").innerText;
            if (expressNum != '') {
                // var onlineOrder=nodes[n].querySelector("div:nth-child(5)").innerText;
                var onlineOrder = nodes[n].querySelector("div:nth-child(4)").innerText;
                var order = new Object();
                order.id = id;
                order.orderNum = onlineOrder;
                order.expressNum = expressNum;
                OrderData.push(order);
            }
        }
    }
    var html;
    if (OrderData.length > 0) {
        //OrderData.push(list);
        html = '<div id="buttonDiv"><button id="btnOpOrder" type="button" class="btn_2" style="outline:none;margin:2px 0px 2px 0px">点击更新单号到内部系统</button></div><div class="layui-form"><table id="datatable" class="pure-table"><thead><tr><th width="100px">序号</th><th width="200px">订单号</th><th width="200px">快递号</th></tr></thead><tbody>';
        for (var i = 0; i < OrderData.length; i++) {
            html += '<tr><td class="one">' + (i + 1) + '</td><td class="two">' + OrderData[i].orderNum + '</td><td class="three">' + OrderData[i].expressNum + '</td></tr>';
        }
        html += '</tbody></table></div><div style="padding:8px;font-size:12px">共计 ' + OrderData.length + ' 条订单</div>';
    }
    return html;
});
