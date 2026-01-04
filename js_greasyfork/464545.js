// ==UserScript==
// @name         易仓店铺授权检查
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.4
// @description  易仓店铺授权检查自动检测
// @author       knight
// @license      No License
// @match        https://shopauth.eccang.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/464545/%E6%98%93%E4%BB%93%E5%BA%97%E9%93%BA%E6%8E%88%E6%9D%83%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/464545/%E6%98%93%E4%BB%93%E5%BA%97%E9%93%BA%E6%8E%88%E6%9D%83%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

function start()
{
    //添加DOM监听
    addListener();
}

/**
 * 创建按钮
 */
function createButton()
{
    //先检查按钮是否存在
    let buttonId = 'knight-batch-check-store-btn';
    let isButtonExist = document.getElementById(buttonId);

    if (!isButtonExist) {
        createButtonReal(buttonId);
    }

    //获取异常列表按钮
    let buttonListId = 'knight-batch-check-store-list-btn';
    let isButtonListExist = document.getElementById(buttonListId);
    if (!isButtonListExist) {
        createButtonListReal(buttonListId);
    }
}

/**
 * 查询结果列表
 * @param buttonId
 */
function createButtonListReal(buttonId)
{
    let button = document.createElement("button");
    button.className = "ec-ant-btn ec-ant-btn-primary";
    button.innerText = "获取异常列表";
    button.id = buttonId;
    button.onclick = function (){
        getAllErrorList();
        return false;
    }

    let opBar = document.body;
    if (opBar) {
        opBar.prepend(button);
    }
}

/**
 * 添加异常记录
 * @param accountCode
 */
function addExceptionAccountToRecord(accountCode)
{
    let url = "http://120.24.251.138:8090/api/eccang/auth_check_error_report";
    let timeout = 60 * 1000;
    let params = 'account_code='+accountCode;

    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        timeout: timeout,
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        },
        data: params,
        onload: function (res) {
            console.log(res);
        },
        onerror:function (e) {
            console.log(e);
        },
        ontimeout:function () {
            console.log("上报超时");
        }
    });
}

/**
 * 查询列表
 */
function getAllErrorList()
{
    let url = "http://120.24.251.138:8090/api/eccang/get_auth_check_error_list";
    let timeout = 60 * 1000;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: timeout,
        onload: function (response) {
            console.log(response);
            alert(response.responseText);
        },
        onerror:function (e) {
            console.log(e);
            alert('获取失败：' + e.message);
        },
        ontimeout:function () {
            alert("获取超时");
        }
    });
}

/**
 * 创建按钮
 */
function createButtonReal(buttonId)
{
    let button = document.createElement("button");
    button.className = "ec-ant-btn ec-ant-btn-primary";
    button.innerText = "自动全量检测";
    button.id = buttonId;
    button.onclick = function (){
        checkAllPlatform();
        return false;
    }

    let statusDiv = document.createElement("div");
    statusDiv.id = "knight-batch-check-store-status";
    statusDiv.innerText = "";

    let resultDiv = document.createElement("div");
    resultDiv.id = "knight-batch-check-store-result";
    resultDiv.innerText = "异常账号：";

    let opBar = document.body;
    if (opBar) {
        opBar.prepend(resultDiv);
        opBar.prepend(statusDiv);
        opBar.prepend(button);
    }
}

/**
 * 同步睡眠
 * @param time
 */
function syncSleep(time) {
    const start = new Date().getTime();
    while (new Date().getTime() - start < time) {}
}

/**
 * sleep
 * @param time
 * @returns {Promise<unknown>}
 */
function sleep(time){
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 设置执行进度
 * @param message
 */
function setProcess(message) {
    document.getElementById("knight-batch-check-store-status").innerText = message;
}

/**
 * 检测所有平台
 */
async function checkAllPlatform()
{
    setProcess('running....');
    //所有平台
    let platformList = document.querySelectorAll('body > section > aside > div > div > div.platform-div > div > div > div > ul > div > div > div > div > div > div.platform-list-item__item.platform-list-item__account');
    //循环处理所有平台
    for (let index =0; index < platformList.length; index++) {
        platformElement = platformList[index];
        //获取平台文本
        platformText = $(platformElement).text();
        //有账号的，才点击处理
        if (platformText.indexOf("账号") >= 0) {

            console.log('-----click-platform-----'+index+'--------------');

            //点击当前平台
            $(platformElement)[0].click();
            //等待5秒
            await sleep(5000);

            //默认点击去检测间隔时间为10秒
            let clickCheckDelayTime = 10000;
            if (index == 2) {
                //amazon间隔时间为120秒
                clickCheckDelayTime = 120000;
            }

            let hasNextPage = true;
            let page = 0;
            let platformNumber = index + 1;
            while (hasNextPage) {
                page = page + 1;
                //处理当前页
                await dealCurrentPage(platformNumber, page, clickCheckDelayTime);

                //检测是否有下一页
                hasNextPage = checkHasNextPage();
                //如果有下一页
                if (hasNextPage) {
                    //点击下一页
                    $("ul.ec-ant-pagination li.ec-ant-pagination-next")[0].click();
                    //等待5秒
                    await sleep(5000);
                }
            }

        }
    }

    setProcess('检查完成');

}

/**
 * 处理当前页
 */
async function dealCurrentPage(platformNumber, page, clickCheckDelayTime)
{
    let trList = document.querySelectorAll('tbody.ec-ant-table-tbody tr.ec-ant-table-row');
    for (let index =0; index < trList.length; index++) {
        let trElement = trList[index];

        //获取当前处理账号
        let accountText = $(trElement).find("td:nth-child(2)").text();
        let accountCode = accountText.match(/([a-zA-Z0-9]+)/g)[0];

        setProcess('当前处理第'+platformNumber+'个平台,第'+page+'页,第'+(index+1)+'行,账号:'+accountCode);

        //亚马逊平台
        if (platformNumber == 3) {
            //是否是卖家编号的这一行
            let trText = $(trElement).text();
            let codePos = trText.indexOf("卖家编号");
            if (codePos > 0) {
                //点击检测
                $(trElement).find("td:nth-child(2) span i.anticon")[0].click();
                // 点击之后，等待结果
                await sleep(clickCheckDelayTime);
                //看是否有弹窗，如果有则点击弹窗的取消
                buttonElement = document.querySelector("body > div > div > div.ec-ant-modal-wrap.ec-ant-modal-centered.ec-ant-modal-confirm-centered > div > div.ec-ant-modal-content > div > div > div.ec-ant-modal-confirm-btns > button:nth-child(1)");

                if (buttonElement) {
                    $(buttonElement)[0].click();
                }

                //每一行点击之后，检查是否有异常字样
                let lineText = $(trElement).text();
                let lineReg = new RegExp("异常", 'g');
                if (lineReg.test(lineText)) {
                    //添加异常账号
                    addExceptionAccount(accountCode);
                }

            }

        } else {
            let tdLines = trElement.querySelector('td:nth-child(4)').childNodes;
            for (let lineIndex = 0; lineIndex < tdLines.length; lineIndex++) {
                //检查文本是否有去检测
                let lineElement = tdLines[lineIndex];
                let lineText = lineElement.innerText;
                let reg = new RegExp("去检测", 'g');
                //如果有去检测，则点击
                if (reg.test(lineText)) {
                    $(lineElement).find("button").click();

                    //点击之后，等待结果
                    await sleep(clickCheckDelayTime);

                    //看是否有弹窗，如果有则点击弹窗的取消
                    buttonElement = document.querySelector("body > div > div > div.ec-ant-modal-wrap.ec-ant-modal-centered.ec-ant-modal-confirm-centered > div > div.ec-ant-modal-content > div > div > div.ec-ant-modal-confirm-btns > button:nth-child(1)");

                    if (buttonElement) {
                        $(buttonElement)[0].click();
                        await sleep(clickCheckDelayTime);
                    }
                }
            }

            //每一行点击之后，检查是否有异常字样
            let lineText = $(trElement).text();
            let lineReg = new RegExp("异常", 'g');
            if (lineReg.test(lineText)) {
                //添加异常账号
                addExceptionAccount(accountCode);
            }
        }
    }

    return new Promise((resolve)=>{
        resolve();
    });
}

/**
 * 添加异常账号
 */
function addExceptionAccount(accountCode)
{
    addExceptionAccountToRecord(accountCode);
    document.getElementById("knight-batch-check-store-result").append(','+accountCode);
}

/**
 * 是否有下一页
 */
function checkHasNextPage()
{
    let classText = $("ul.ec-ant-pagination li.ec-ant-pagination-next").attr("class");

    if (classText) {
        if (classText.indexOf("ec-ant-pagination-disabled") >= 0) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}


/**
 * 监听DOM节点变化
 */
function addListener()
{
    let targetNode = document.body;
    let config = { childList: true, subtree: true };
    let callback = function (mutationsList) {
        createButton();
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}


(function() {
    'use strict';

    start();
})();
