// ==UserScript==
// @name         易仓RMA管理
// @namespace    http://maxpeedingrods.cn/
// @version      0.0.1
// @description  易仓头程RMA管理-二手SKU
// @author       YANNI
// @license      No License
// @match        https://*.eccang.com/order/returns/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @require      https://www.layuicdn.com/layer-v3.1.1/layer.js
// @downloadURL https://update.greasyfork.org/scripts/519132/%E6%98%93%E4%BB%93RMA%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519132/%E6%98%93%E4%BB%93RMA%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/**
 * 常量信息
 */
class Constant {
    static domain = "https://owms.maxpeedingrods.cn";
}

/**
 * 页面位置类
 */
class Page {
    static path = "";
    addListener() {
        return null;
    }
}

/**
* 退货列表页面
*/
class ReturnOrderListPage extends Page {
    static path = '/order/returns/list';
    static baseUrl = '/warehouse_management/return_processing/nr_order';
    static baseReturnUrl = '/warehouse_management/return_processing/return_orders/rma_detail';
    static buttonName = '更多信息';
    addListener() {
        let that = this;
        setInterval(function () {
            // nr订单按钮
            if ($("#operate-received .opration_area_lft").length > 0) {
                that.addNRButton();
            }
            // 换二手sku
            if ($("#listForm table").length > 0) {
                that.addInSkuButton();
            }
        }, 3000);
    }

    addNRButton() {
        if($("#operate-received .opration_area_lft #cqgg-create-nr-button").length>0){
            return
        }
        let that = this;
        $("#operate-received .opration_area_lft");
        let button = document.createElement("span");
        button.innerText = "创建NR";
        button.id = "cqgg-create-nr-button";
        button.className = "cqgg-base-button";
        button.onclick = function () {
            that.openNRLayer();
        };
        $("#operate-received .opration_area_lft").append(button);

    }
    addInSkuButton() {
        let that = this;
        $.each($("#listForm table #table-module-list-data >.table-module-b2"), function (index, element) {
            let innerHtml = $(element).children().eq(2).html();
            // 使用正则表达式匹配退件号
            let rmaRegex = /退件号：(\w+)/;
            let match = innerHtml.match(rmaRegex);
            if (match && match[1]) {
                let rmaNumber = match[1];
                //console.log('退件号:', rmaNumber);
                // 循环兄弟元素的获取sku
                $.each($(element).next().find("tbody > tr"), function (index, skuParentEle) {
                    if(index > 0){
                        let skuEle = $(skuParentEle).children().first();
                        let sku = skuEle.html();
                        that.creatInSkuButton(skuEle, rmaNumber, sku)
                    }
                })
            } else {
                console.log('未找到退件号', innerHtml);
            }
            //that.creatButton(element, index, "append");
        });
    }

    creatInSkuButton(skuEle, rmaNumber, sku) {
        //先检查按钮是否存在
        let buttonId = 'cqgg-in-sku-info' + '_' + rmaNumber + '_'+sku;
        let isButtonExist = $(skuEle).find(".cqgg-base-button");
        if (isButtonExist.length == 0) {
            let button = document.createElement("span");
            button.innerText = "换二手SKU";
            button.id = buttonId;
            button.className = "cqgg-base-button";
            let that = this;
            button.onclick = function () {
                that.openLayer(rmaNumber, sku);
            }
            skuEle.append(button);
        }
    }
    openLayer(rmaNumber, sku) {
        let url = Constant.domain + ReturnOrderListPage.baseReturnUrl + "?ro_code=" + rmaNumber + "&sku=" + sku;
        console.log("正在打开界面：" + url);
        layer.open({
            type: 2,
            skin: 'layui-layer-rim',
            area: ['40%', '500px'],
            offset: "",
            title: "换二手SKU",
            anim: 1,
            shade: false,
            maxmin: true,
            content: url,
        });
    }
    openNRLayer() {

        let url = Constant.domain + ReturnOrderListPage.baseUrl;
        console.log("正在打开界面：" + url);

        layer.open({
            type: 2,
            skin: 'layui-layer-rim',
            area: ['40%', '500px'],
            offset: "",
            title: "创建NR订单",
            anim: 1,
            shade: false,
            maxmin: true,
            content: url,
        });
    }
}


/**
 * 页面工厂类
 */
class PageFactory {
    static make(path) {
        switch (path) {
            case ReturnOrderListPage.path:
                return new ReturnOrderListPage();
            default:
                return new Page();
        }
    }
}

function start() {
    addStyle();

    //引入layer
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);

    console.log('------in getPage-----------');

    window.addEventListener('message', function(event) {
        // 检查消息来源是否可信
        if (event.origin == Constant.domain) {
            return;
        }
        // 处理接收到的消息
        console.log('Received message:', event.data);
        if (event.data?.type === 'inSku') {
            console.log('Request in iframe completed!');
            // 这里可以执行一些操作，比如关闭弹窗
            layer.closeAll();
        }
    });

    let currentPath = window.location.pathname;
    console.log(currentPath);

    let instance = PageFactory.make(window.location.pathname);
    instance.addListener();
}


/**
 * 添加CSS样式
 */
function addStyle() {
    let css = `
    #cqgg-fee1-import-excel-a {
        width: 180px;
    height: 100%;
    text-align: center;
    display: block;
    padding: 5px;
    font-size: 13px;
    }
        .cqgg-base-button {
            display: inline-block;
            border: 1px solid #199EDB;
            background-color: #199EDB;
            color: #fff;
            cursor: pointer;
            text-align: center;
            margin: 2px;
            border-radius: 2px;
        }
        .cqgg-fee1-info-more-ul {
            text-align: left;
            font-size: 14px;
        }
        .cqgg-fee1-info-more-ul li{
            list-style-type: decimal;
            margin: 10px 20px;
            border-bottom: 1px dashed gray;
        }
        .cqgg-fee1-info-more-ul li i{
            font-weight: bold;
        }
        .cqgg-fee1-info-more-ul li p{
            text-indent: 2em;
        }
    `
    GM_addStyle(css);
}

(function () {
    'use strict';

    start();
})();
