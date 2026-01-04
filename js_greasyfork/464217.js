// ==UserScript==
// @name         易仓自动做单机器人日志
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.3
// @description  易仓自动做单备注日志查询
// @author       knight
// @license      No License
// @match        https://*.eccang.com/order/order-list/list/p_mode/fast*
// @match        https://*.eccang.com/order/order-list/list/platform/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/464217/%E6%98%93%E4%BB%93%E8%87%AA%E5%8A%A8%E5%81%9A%E5%8D%95%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/464217/%E6%98%93%E4%BB%93%E8%87%AA%E5%8A%A8%E5%81%9A%E5%8D%95%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

/**
 * 常量信息
 */
class Constant
{
    static buttonName = '自动做单机器人';
    static baseUrl = 'https://crmworkflow-api.maxpeedingrods.cn/crm-workflow/eccang/order/getNotes';
}

function start()
{
    addStyle();

    //引入layer
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);

    //添加DOM监听
    addListener();
}

/**
 * 创建按钮
 */
function addButton()
{
    $.each($("#table-module-list-data tr td:nth-child(3)"), function (index, element) {
        let orderId = $(element).siblings(".order_line").find("p.refrence_no_platform input").attr("value");
        creatButton(element, index, orderId, 'append');
    });
}

//创建按钮
function creatButton(node, buttonNum, orderId, insertLocation)
{
    //先检查按钮是否存在
    let buttonId = 'cqgg-auto-order-remark' + '_' + buttonNum;
    let isButtonExist = document.getElementById(buttonId);

    if (!isButtonExist) {
        createButtonReal(node, buttonId, orderId, insertLocation);
    } else {
        changeButtonClickEvent(buttonId, orderId);
    }
}

/**
 * 改变按钮click事件
 * @param buttonId
 * @param orderId
 */
function changeButtonClickEvent(buttonId, orderId)
{
    let button = document.getElementById(buttonId);
    button.onclick = function (){
        openLayer(orderId);
    };
}

/**
 * 展示做单日志
 * @param orderId
 */
function openLayer(orderId)
{
    layer.msg("正在查询自动做单机器人日志...");

    let url = Constant.baseUrl + "?orderCode=" + orderId;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: 10000,
        headers: {"Authorization":"Basic eXVxaWFubG9uZzpYRHhkeXRNMEdIc3V0VE5P"},
        onload: function (response) {
            console.log(response);
            if (response.status != 200) {
                layer.msg(response.message);
                return false;
            }

            try {
                let obj = JSON.parse(response.responseText);
                let logList = obj.result;
                let html = '';

                //执行失败
                if (obj.code != 200 || !obj.result) {
                    layer.msg(obj.message);
                    return false;
                }

                if (logList.length <= 0) {
                    layer.msg("无自动做单机器人操作日志");
                    return false;
                }

                html += '<ul class="cqgg-auto-order-remark-ul">';
                for (let i=0; i< logList.length; i++) {
                    html += '<li><i>' +  logList[i].createdTime + '</i><p>' + logList[i].note + '</p></li>';
                }
                html += '</ul>';

                layer.open({
                    type: 1,
                    skin: 'layui-layer-rim',
                    area: ['40%', '500px'],
                    offset: "",
                    title: Constant.buttonName,
                    anim: 1,
                    shade: false,
                    maxmin: true,
                    content: html,
                });

            }catch (e) {
                console.log(e);
                layer.msg('查询自动做单机器人操作日志异常：' + e.message);
            }

        },
        onerror:function (e) {
            console.log(e);
            layer.msg('获取自动做单机器人操作日志失败：' + e.message);
        },
        ontimeout:function () {
            layer.msg("获取自动做单机器人操作日志超时");
        }
    });
}

/**
 * 真正创建按钮
 * @param buttonId
 * @param orderId
 */
function createButtonReal(node, buttonId, orderId, insertLocation)
{
    let button = document.createElement("span");
    button.innerText = Constant.buttonName;
    button.id = buttonId;
    button.className = "cqgg-auto-order-remark-button";
    button.onclick = function (){
        openLayer(orderId);
    };
    node[insertLocation](button);
}

/**
 * 监听DOM节点变化
 */
function addListener()
{
    let targetNode = document.querySelector('#table-module-list-data');
    let config = { childList: true, subtree: true };
    let callback = function (mutationsList) {
        addButton();
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

/**
 * 添加CSS样式
 */
function addStyle()
{
    let css = `
        .cqgg-auto-order-remark-button {
            display: inline-block;
            border: 1px solid #199EDB;
            background-color: #199EDB;
            color: #fff;
            cursor: pointer;
            text-align: center;
            margin: 2px;
            border-radius: 2px;
        }
        .cqgg-auto-order-remark-ul {
            text-align: left;
            font-size: 14px;
        }
        .cqgg-auto-order-remark-ul li{
            list-style-type: decimal;
            margin: 10px 20px;
            border-bottom: 1px dashed gray;
        }
        .cqgg-auto-order-remark-ul li i{
            font-weight: bold;
        }
        .cqgg-auto-order-remark-ul li p{
            text-indent: 2em;
        }
    `
    GM_addStyle(css);
}

(function() {
    'use strict';

    start();
})();
