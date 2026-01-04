// ==UserScript==
// @name         【zPortal】扩展CRM功能
// @namespace    http://hndx.fcsys.eu.org/
// @version      2025.1125
// @description  为 ZTE zPortal 启用 CRM 隐藏的扩展功能
// @author       xRetia
// @license      MIT
// @match        *://crm.hnx.ctc.com:*/portal-web/*
// @match        *://web.portal.crm.bss.it.hnx.ctc.com:*/portal-web/*
// @icon         http://hn.189.cn/favicon.ico
// @grant        GM_cookie
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/472523/%E3%80%90zPortal%E3%80%91%E6%89%A9%E5%B1%95CRM%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472523/%E3%80%90zPortal%E3%80%91%E6%89%A9%E5%B1%95CRM%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    const $ = unsafeWindow.$;
    const navigator = unsafeWindow.navigator;
    const fish = unsafeWindow.fish;
    const portal = unsafeWindow.portal;

    /** 复制到剪切板 **/
    var copyToClipboard = function(textToCopy) {
        // navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            return navigator.clipboard.writeText(textToCopy);
        } else {
            // text area method
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    /** 创建对话框 **/
    var xrDialog = function(title, message, btn, modal, cb) {
        var content = `<div class="ui-dialog modal-info">
            <div class="modal-header ui-draggable-handle">
                <span class="glyphicon glyphicon-info-sign pull-left"></span>
                <h4 class="modal-title">${title}</h4>
            </div>
            <div class="modal-body">
                <div class="modal-message">${message}</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info btn-min-width" autofocus="" data-close="">${btn}</button>
            </div>
        </div>`;
        var $popup = $(content);
        var options = {
            //height: 300,
            modal: modal,
            draggable: true,
            content: $popup,
            autoResizable: true
        };
        var popup = fish.popup(options);
        popup.result.then(function (message) {
            cb.call(popup, message);
        });
    }

    /**
     * 一证五号助手启用人工输入
     * @param {string} modClassName (省内、集团)模块元素的 Class 名称
    **/
    var yzwhEnableManuallyInput = function(modClassName) {
        // 检测是否存在[证件类型]，且是否未被修改
        var xrModifiedDetect = document.querySelector(modClassName + ' .js-certiType');
        if (xrModifiedDetect && !xrModifiedDetect.classList.contains("xr-modified")){
            // 移除原始证件类型下拉列表
            var parentElemt = document.querySelector(modClassName + ' .js-certiType').parentElement;
            parentElemt.querySelector('div.form-control').remove();
            parentElemt.querySelector('input').remove();
            // 创建证件类型下拉列表
            var input = document.createElement("input");
            input.type = "text";
            input.className = "form-control js-certiType xr-modified";
            parentElemt.appendChild(input);
            // 初始化证件类型数据源
            $(modClassName + ' .js-certiType').combobox({
                value: 1,
                dataSource: [
                    {name: '中国居民身份证', value: 1},
                    {name: '台湾居民来往内地通行证', value: 42}
                ]
            });
            // 启用证件号码输入框
            document.querySelector(modClassName + ' .js-certiNumber').disabled = false;
        }
    }


    

    /** 切换本地网 **/
    var zteChangeLocalAreaNetwork = function() {
        var html = `<a href="#" title="切换本地网"><i class="iconfont icon-gene-language"></i></a>`;
        var clickEvent = function() {
            var message = `请选择本地网：<br/>
                <select style="width:100%;margin:10px 0;padding:5px 0;" onclick="window.xrLanIdInput = this.value">
                    <option value="730">岳阳本地网</option>
                    <option value="731" selected>长沙本地网</option>
                    <option value="732">湘潭本地网</option>
                    <option value="733">株洲本地网</option>
                    <option value="734">衡阳本地网</option>
                    <option value="735">郴州本地网</option>
                    <option value="736">常德本地网</option>
                    <option value="737">益阳本地网</option>
                    <option value="738">娄底本地网</option>
                    <option value="739">邵阳本地网</option>
                    <option value="743">湘西本地网</option>
                    <option value="744">张家界本地网</option>
                    <option value="745">怀化本地网</option>
                    <option value="746">永州本地网</option>
                </select>`;
            unsafeWindow.xrLanIdInput = "731";
            xrDialog("切换本地网", message, "切换" , true,() => {
                var xrLanId = unsafeWindow.xrLanIdInput;
                unsafeWindow.LoginInfo.getLoginInfo().userInfo.postLanId = xrLanId;
                xrDialog("提示", "本地网已切换至 ["+xrLanId+"]，请关闭 [360客户视图] 后重新打开生效！", "确定" , true,() => {});
            });
        }
        if (typeof unsafeWindow.loginInfoViewModel == "object" && unsafeWindow.xrLanIdInputBtnEl !== "created" ) {
            var createDiv = document.createElement("div");
            createDiv.id = "xrLanIdInputBtn";
            createDiv.className = "topbar-info-item pull-left js-change-lan-id";
            createDiv.innerHTML = html;
            createDiv.onclick = clickEvent;
            unsafeWindow.loginInfoViewModel.appendChild(createDiv);
            unsafeWindow.xrLanIdInputBtnEl = "created";
        }
    }
    
    /** 启用灰色按钮 **/
    function enableGreyButtons() {
        const disabledButtons = document.querySelectorAll('button[disabled]');
        disabledButtons.forEach(button => {
            button.removeAttribute('disabled');
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
        const hiddenElements = document.querySelectorAll('.js-btnorg_id');
        hiddenElements.forEach(element => {
            element.style.display = '';
        });
    }

    /** 防止登录超时：更新上次操作时间 **/
    var updateLastOpDate = function() {
        if (typeof fish === "undefined" || typeof portal === "undefined") return;
        var lastOpDate = fish.dateutil.format(new Date(), "yyyy-mm-dd hh:ii:ss");
        portal.appGlobal.set("lastOpDate", lastOpDate);
    }

    // Your code here...
    setInterval(() => {

        // 一证五号助手
        var yzwhMainFrame = 'div[menuurl="cust/modules/local/queryYzwhProdInst/views/QueryYzwhProdInsSummaryView"]';
        var yzwhDetet = document.querySelector(yzwhMainFrame);
        if (yzwhDetet !== null) {
            yzwhEnableManuallyInput(`${yzwhMainFrame} .js-provinceWithin`);
            yzwhEnableManuallyInput(`${yzwhMainFrame} .js-bloc`);
        }

        // 防止登录超时
        updateLastOpDate();

        // 切换本地网();
        zteChangeLocalAreaNetwork();
        
        // 启用灰色按钮
        enableGreyButtons();

    }, 1000);
}, 5000);