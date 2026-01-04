// ==UserScript==
// @name         ITSR_AutoOps
// @namespace    http://huaqin.com/
// @version      0.6
// @description  加快ITSR的审批
// @author       AustinYoung
// @match        https://itservice.huaqin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457717/ITSR_AutoOps.user.js
// @updateURL https://update.greasyfork.org/scripts/457717/ITSR_AutoOps.meta.js
// ==/UserScript==
const maxCount = 3; // 进入页面后多久自动点击
const maxRefresh = 10;  // 列表为空时，多久自动刷新
const arrJudgeTxt = ['申请类型\n续期'] // 基本信息中的判断条件，只要满足其中任意一个即可通过
const maxTimeout = 10000; // 查找对象10秒超时，单位毫秒
var autoHandle = 999;  // 全局定时句柄
var autoCount = maxCount; // 当前计数器
var startDetect = false;  // 标记表示是否已经开始检测
(function () {
    'use strict';
    if (location.pathname.indexOf('order/ops_permission_apply/profile/') > -1) {
        autoOps();
    }
    setInterval(function () {
        //console.log(startDetect)
        if (location.pathname.indexOf('order_center/my_todo') > -1) {
            if (!startDetect) {
                // 对象未创建
                if (window.lastSec == null) {
                    addHint()
                }
                autoCount = maxCount;
                openOrder()
                startDetect = true
            }
        } else {
            startDetect = false
        }
    }, 500)

    // 如果页面是审批页面，增加按钮可以实现自动点击
})();

// 判断内容
//document.querySelector("div.ant-descriptions span.ant-descriptions-item-content")
//document.querySelector("div.ant-descriptions").innerText.indexOf('申请类型\n续期')
//document.querySelectorAll("div.ant-modal-content div.ant-form-item span.ant-radio input")[0].click()
//document.querySelector("div.ant-modal-content div.ant-modal-footer button.ant-btn-primary")
function addHint() {
    console.log('addHint')
    var strControlHTML = `
    <div style="padding:2px;position:fixed;top:20px;left:220px;z-index:99999" id="myselfFloat">
    <div  style="background-color:rgb(208, 227, 245);">
            <span>当代办时，将在 <span id="lastSec" style="color:red"></span> 秒后自动点击第一个审核，当申请类型"续期"时将自动通过<button id="stopAuto">停止</button></span>
        </span>
    </div>
  </div>
  `;
    var oNode = document.createElement('div');
    oNode.innerHTML = strControlHTML;
    document.body.append(oNode);
}
function openOrder() {
    // 具体点击审批，次序为第二行，第八列
    //console.log(autoHandle)
    autoHandle = setInterval(function () {
        lastSec.innerText = autoCount
        if (autoCount-- <= 0) {
            if (location.pathname.indexOf('/order_center/my_todo') > -1) {
                console.log('auto click')
                let firstOps = document.querySelector("div.ant-table-content table tr:nth-child(2) td:last-child");
                let OpsTxt = firstOps?.innerText;
                if (OpsTxt == '查看详情') {
                    firstOps.querySelector('a')?.click()
                    autoCount = maxCount
                } else {
                    document.querySelector('span.anticon-reload')?.click();  // 自动点击刷新
                    autoCount = maxRefresh
                }
            }
        }
    }, 1000)
    stopAuto.onclick = function () {
        console.log('stop', autoHandle)
        clearInterval(autoHandle)
    }
}
// 判断 dom 存在后才会执行 job 的代码,  flag = true时候需要判断job的返回值必须为true，否则重试直到超时
function detectDo(domName, job, flag) {
    return new Promise((resolve, reject) => {
        let startT = new Date().getTime();
        let handle = setInterval(function () {
            // 超时判断
            let t = new Date().getTime() - startT
            if (t > maxTimeout) {
                clearInterval(handle)
                resolve({ code: 1, ret: 'timeout' })
            }
            // 具体内容判断
            let dom = document.querySelector(domName)
            if (dom != null) {
                let res = job(dom);
                if (flag && res !== true) {
                    return; // 重新开始
                } else {
                    clearInterval(handle)
                    resolve({ code: 0, ret: res })
                }
            }
        }, 10)
    })

}

async function autoOps() {
    // 审核页面执行
    console.log('autoOps')
    if (location.pathname.indexOf('/order/ops_permission_apply/profile/') == -1) {
        return;
    }
    // 查看对应的内容
    let d1 = "div.ant-descriptions";
    let res = await detectDo(d1, function (dom) {
        // 查找
        return arrJudgeTxt.findIndex(x => {
            return dom.innerText.indexOf(x) > -1;
        }) > -1;
    }, true)
    console.log(res)
    if (res.code == 0 && res.ret) {
        // 点击审批
        document.querySelector("main div.ant-pro-page-container span.ant-page-header-heading-extra button")?.click();
        // 选中同意
        let d2 = "div.ant-modal-content div.ant-form-item span.ant-radio input";
        let res2 = await detectDo(d2, function (dom) { dom.click() })
        if (res2.code == 0) {
            // 直接点击审批
            document.querySelector("div.ant-modal-content div.ant-modal-footer button.ant-btn-primary")?.click();
            // 1秒后关闭窗口
            console.log('autoOps succ', res2)
            //setTimeout(function () { window.close() }, 1000)
        }
    } else {
        // 异常后直接关闭窗口
        console.log('autoOps fail', res)
        // window.close()
    }
}