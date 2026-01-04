// ==UserScript==
// @name         易仓自动客服模板批量操作
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.0
// @description  易仓-自动客服模板-批量启用停用
// @author       knight
// @license      No License
// @match        https://*.eccang.com/message/automatic-letter-template/list*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463856/%E6%98%93%E4%BB%93%E8%87%AA%E5%8A%A8%E5%AE%A2%E6%9C%8D%E6%A8%A1%E6%9D%BF%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/463856/%E6%98%93%E4%BB%93%E8%87%AA%E5%8A%A8%E5%AE%A2%E6%9C%8D%E6%A8%A1%E6%9D%BF%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==


function start()
{
    //创建批量操作按钮
    createBatchOpButton();

    //创建标题行
    createTitleCheckbox();

    //添加DOM监听
    addListener();

}

/**
 * 创建批量操作按钮
 */
function createBatchOpButton()
{
    //创建批量启用按钮
    createBatchEnableButton();

    //创建批量停用按钮
    createBatchDisableButton();
}

/**
 * 创建批量启用按钮
 */
function createBatchEnableButton()
{
    let button = document.createElement("button");
    button.className = "baseBtn";
    button.innerText = "批量启用";
    button.id = "knight-batch-enable";
    button.style.width = "100px";
    button.style.float = "right";
    button.style.margin = "8px 10px 0 0";

    button.onclick = function (){
        let selectedNum = $("[id^='knight-defined-cbx_']").length;

        if (selectedNum <= 0) {
            alert("请先选择需要启用的模板！");
            return false;
        }

        if (confirm("确认要批量启用模板？")) {
            waitOperationIds = getAllCheckedIds();
            batchEnableExec(waitOperationIds);
        }

        return false;
    }

    document.querySelector("#module-table div.opration_area").prepend(button);
}

/**
 * 创建批量停用按钮
 */
function createBatchDisableButton()
{
    let button = document.createElement("button");
    button.className = "baseBtn";
    button.innerText = "批量停用";
    button.id = "knight-batch-disable";
    button.style.width = "100px";
    button.style.float = "right";
    button.style.margin = "8px 10px 0 0";

    button.onclick = function (){
        let selectedNum = $("[id^='knight-defined-cbx_']").length;

        if (selectedNum <= 0) {
            alert("请先选择需要停用的模板！");
            return false;
        }

        if (confirm("确认要批量停用模板？")) {
            waitOperationIds = getAllCheckedIds();
            batchDisableExec(waitOperationIds);
        }

        return false;

    }

    document.querySelector("#module-table div.opration_area").prepend(button);
}

/**
 * 执行批量启用
 */
function batchEnableExec(waitOperationIds)
{
    for (let i=0; i<waitOperationIds.length; i++)
    {
        window.updateStatus(waitOperationIds[i], 1);
    }
}

/**
 * 执行批量停用
 */
function batchDisableExec(waitOperationIds)
{
    for (let i=0; i<waitOperationIds.length; i++)
    {
        window.updateStatus(waitOperationIds[i], 2);
    }
}

/**
 * 获取所有选中checkbox对应行的记录ID
 */
function getAllCheckedIds()
{
    let waitOperationIds = [];
    $("[id^='knight-defined-cbx_']").each(function (index, element) {
        isElementChecked = $(element).prop("checked");
        if (isElementChecked) {
            //找到编辑按钮的href
            let hrefInfo = $(element).siblings("td").find("a:nth-child(1)").prop("href");
            //匹配出ID
            waitId = hrefInfo.replace(/^javascript\:editTemplate\((\d+)\)$/g, "$1");
            waitOperationIds.push(waitId);
        }
    });

    return waitOperationIds;
}

/**
 * 标题行checkbox
 */
function createTitleCheckbox()
{
    let checkboxId = "knight-defined-cbx-title";
    let isCheckboxExist = document.getElementById(checkboxId);

    if (!isCheckboxExist) {
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("id",checkboxId);

        checkbox.onclick = function (){
            $("[id^='knight-defined-cbx_']").prop("checked", this.checked);
        };

        document.querySelector("table tr.table-module-title").prepend(checkbox);
    }
}

/**
 * 为每一行创建复选框
 */
function createCheckbox()
{
    $("#table-module-list-data tr").each(function (index, element){
        let checkboxId = "knight-defined-cbx_"+index;
        let isCheckboxExist = document.getElementById(checkboxId);

        if (!isCheckboxExist) {
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("id",checkboxId);

            element.prepend(checkbox);
        }

    });
}

/**
 * 监听DOM节点变化
 */
function addListener()
{
    let targetNode = document.querySelector('#table-module-list-data');
    let config = { childList: true, subtree: true };
    let callback = function (mutationsList) {
        createCheckbox();
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

(function() {
    'use strict';

    start();
})();
