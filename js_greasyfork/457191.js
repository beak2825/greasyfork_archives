// ==UserScript==
// @name         自动识别填充网页验证码
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  自动识别填写大部分网站的数英验证码
// @author       lcymzzZ
// @license      GPL Licence
// @connect      *
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/459260/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/459260/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    if (window.self !== window.top) {
        return;
    }

    var element, input, imgIndex, canvasIndex, inputIndex, captchaType;
    var localRules = [];
    var queryUrl = "http://ca.zwhyzzz.top:8092/"
    var exist = false;
    var iscors = false;
    var inBlack = false;
    var firstin = true;
    var mode = GM_getValue("mode", "blacklist");
 
    var fisrtUse = GM_getValue("fisrtUse", true);
    if (fisrtUse) {
        var mzsm = prompt("自动识别填充网页验证码\n首次使用，请阅读并同意以下免责条款。\n\n \
1. 此脚本仅用于学习研究，您必须在下载后24小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。\n \
2. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。\n \
3. 本人对此脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。\n \
4. 任何以任何方式查看此脚本的人或直接或间接使用此脚本的使用者都应仔细阅读此条款。\n \
5. 本人保留随时更改或补充此条款的权利，一旦您使用或复制了此脚本，即视为您已接受此免责条款。\n\n \
若您同意以上内容，请输入“我已阅读并同意以上内容” 然后开始使用。", "");
        if (mzsm == "我已阅读并同意以上内容") {
            GM_setValue("fisrtUse", false);
        }
        else {
            alert("免责条款未同意，脚本停止运行。\n若不想使用，请自行禁用脚本，以免每个页面都弹出该提示。");
            return;
        }
    }
 
    GM_registerMenuCommand('添加页面规则', addRule);
    GM_registerMenuCommand('管理所有规则', manageRules);
    GM_registerMenuCommand('模式切换（当前：' + (mode === 'blacklist' ? '黑名单' : '白名单') + '模式）', toggleMode);
    GM_registerMenuCommand('管理黑/白名单', manageLists);
    GM_registerMenuCommand('识别接口配置', recognitionConfig);
    GM_registerMenuCommand('云码相关配置', ymConfig);
    GM_registerMenuCommand('其他设置', otherSettings);
 
    GM_setValue("preCode", "");
    GM_getValue("ymConfig", null) == null ? GM_setValue("ymConfig", "50106") : null;
 
    function getQQGroup() {
        GM_xmlhttpRequest({
            method: "GET",
            url: queryUrl + "getQQGroup",
            onload: function(response) {
                try {
                    var qqGroup = response.responseText;
                    alert(qqGroup);
                }
                catch(err){
                    return "群号获取失败";
                }
            }
        });
    }
 
    function recognitionConfig() {
        // 获取当前配置
        const generalApi = GM_getValue("generalApi", "free");
        const mathApi = GM_getValue("mathApi", "ym");
        
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 500px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: none !important; z-index: 9999999999 !important; text-align: left !important; padding: 30px !important; box-shadow: 0px 10px 30px rgba(0,0,0,0.15) !important; border-radius: 16px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        // 添加CSS Reset，确保弹窗样式完全不受外部影响
        var style = document.createElement('style');
        style.textContent = `
            .captcha-popup * {
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                font-size: 100% !important;
                font: inherit !important;
                vertical-align: baseline !important;
                box-sizing: border-box !important;
            }
            
            .captcha-popup h3, .captcha-popup h4, .captcha-popup b {
                font-weight: bold !important;
            }
            
            .captcha-popup h3 {
                font-size: 18px !important;
                margin-bottom: 25px !important;
            }
            
            .captcha-popup h4 {
                font-size: 14px !important;
                margin-bottom: 15px !important;
            }
            
            .captcha-popup p {
                margin-bottom: 10px !important;
                font-size: 14px !important;
            }
            
            .captcha-popup span {
                font-size: 14px !important;
            }
            
            .captcha-popup div {
                font-size: 14px !important;
            }
            
            .captcha-popup ul, .captcha-popup ol {
                list-style: none !important;
                padding: 0 !important;
            }
            
            .captcha-popup li {
                list-style: none !important;
                margin: 0 !important;
            }
            
            .captcha-popup button {
                padding: 10px 25px !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: inline-block !important;
                margin-right: 10px !important;
            }
        `;
        div.appendChild(style);
        
        div.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center !important;">识别接口配置</h3>           
            </div> 
            
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">数英验证码识别接口</h4>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                            <input type="radio" name="generalApi" value="free" ${generalApi === "free" ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
                            <span style="font-size: 14px; color: #333; cursor: pointer;">免费接口</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                            <input type="radio" name="generalApi" value="ym" ${generalApi === "ym" ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
                            <span style="font-size: 14px; color: #333; cursor: pointer;">云码接口</span>
                        </label>
                    </div>
                </div>
                
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">算术验证码识别接口</h4>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                            <input type="radio" name="mathApi" value="ym" ${mathApi === "ym" || mathApi === "free" ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
                            <span style="font-size: 14px; color: #333; cursor: pointer;">云码接口（免费接口效果太差，暂不提供）</span>
                        </label>
                    </div>
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <ul style="margin: 0; font-size: 13px; color: #F56C6C !important; line-height: 2; padding: 0">
                        <b>使用云码接口请注意：</b><br>&emsp;&emsp;部分页面可能存在兼容性问题，导致无限识别，请务必自行测试，确保当前页面能正常使用，以免消耗积分！
                    </ul>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
                    <button style="padding: 10px 25px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" id="saveConfig">保存</button>
                    <button style="padding: 10px 25px; background-color: #f5f5f5; color: #666; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" id="cancelConfig">取消</button>
                </div>
            </div>
        `;
        
        document.body.insertBefore(div, document.body.firstChild);
        
        // 关闭按钮
        var close = document.getElementById("cancelConfig");
        close.onclick = function () {
            div.remove();
        };
        
        // 保存
        var saveConfig = document.getElementById("saveConfig");
        saveConfig.onclick = function () {
            var generalApi = div.querySelector("input[name='generalApi']:checked").value;
            var mathApi = div.querySelector("input[name='mathApi']:checked").value;
            
            GM_setValue("generalApi", generalApi);
            GM_setValue("mathApi", mathApi);
            
            topNotice("识别配置保存成功");
            div.remove();
        };
        
        // 取消配置
        var cancelConfig = document.getElementById("cancelConfig");
        cancelConfig.onclick = function () {
            div.remove();
        };
    }
    
    function ymConfig() {
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 600px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: center !important; padding: 20px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        // 添加CSS Reset，确保弹窗样式完全不受外部影响
        var style = document.createElement('style');
        style.textContent = `
            .captcha-popup * {
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                font-size: 100% !important;
                font: inherit !important;
                vertical-align: baseline !important;
                box-sizing: border-box !important;
            }
            
            .captcha-popup h3, .captcha-popup h4, .captcha-popup b {
                font-weight: bold !important;
            }
            
            .captcha-popup h3 {
                font-size: 18px !important;
                margin-bottom: 25px !important;
            }
            
            .captcha-popup h4 {
                font-size: 14px !important;
                margin-bottom: 15px !important;
            }
            
            .captcha-popup p {
                margin-bottom: 10px !important;
                font-size: 14px !important;
            }
            
            .captcha-popup span {
                font-size: 14px !important;
            }
            
            .captcha-popup div {
                font-size: 14px !important;
            }
            
            .captcha-popup ul, .captcha-popup ol {
                list-style: none !important;
                padding: 0 !important;
            }
            
            .captcha-popup li {
                list-style: none !important;
                margin: 0 !important;
            }
            
            .captcha-popup button {
                padding: 10px 25px !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: inline-block !important;
                margin-right: 10px !important;
            }
        `;
        div.appendChild(style);
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center; flex-grow: 1;">云码配置</h3>
                <button style="width: 30px; height: 30px; text-align: center; font-weight: bold; color: #999; background-color: transparent; border: 1px solid #e0e0e0; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; margin-left: 10px;" id="close">×</button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-start; width: 100%;">
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">配置算术码类型</h4>
                    <table style='width:100%; border-collapse:collapse; font-size: 14px; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;'>
                        <thead style='background-color: #f8f9fa;'>
                            <tr>
                                <th style='width: 15%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>选择</th>
                                <th style='width: 20%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>类型</th>
                                <th style='width: 65%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>描述</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style='border-bottom: 1px solid #f0f0f0;'>
                                <td style='text-align: center; padding: 12px;'><input type="radio" name="calcType" /></td>
                                <td style='text-align: center; padding: 12px; color: #333;'>50100</td>
                                <td style='text-align: center; padding: 12px; color: #666; font-size: 13px;'>通用数字计算题（人工通道，速度较慢）</td>
                            </tr>
                            <tr style='border-bottom: 1px solid #f0f0f0;'>
                                <td style='text-align: center; padding: 12px;'><input type="radio" name="calcType" /></td>
                                <td style='text-align: center; padding: 12px; color: #333;'>50101</td>
                                <td style='text-align: center; padding: 12px; color: #666; font-size: 13px;'>中文计算题</td>
                            </tr>
                            <tr>
                                <td style='text-align: center; padding: 12px;'><input type="radio" name="calcType" /></td>
                                <td style='text-align: center; padding: 12px; color: #333;'>50106</td>
                                <td style='text-align: center; padding: 12px; color: #666; font-size: 13px;'>calculate_ry（机器识别通道，速度较快）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
                
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">填写Token</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="text" id="tokenInput" value="${GM_getValue('token', '')}" style="flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; outline: none; transition: all 0.3s ease;" placeholder="请输入云码Token">
                        <button style="padding: 10px 20px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" id="saveToken">保存</button>
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #999; text-align: left;">帮助文档：<a href="https://docs.qq.com/doc/DWkhma0dsb1BxdEtU" target="_blank" style="color: #2196F3; text-decoration: none;">https://docs.qq.com/doc/DWkhma0dsb1BxdEtU</a></p>
                </div>
            </div>
        `;
        
        document.body.insertBefore(div, document.body.firstChild);

        // 关闭按钮
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        };

        // 算术码类型选择
        var radios = div.querySelectorAll("input[name='calcType']");
        radios.forEach(cb => {
            cb.addEventListener("click", function () {
                var row = this.closest("tr");
                var selectedType = row.children[1].innerText;
                GM_setValue("ymConfig", selectedType);
            });
        });

        // 设置默认选中
        const selectedValue = GM_getValue("ymConfig", "50106");
        radios.forEach(cb => {
            const row = cb.closest("tr");
            const typeText = row.children[1].innerText;
            if (typeText === selectedValue) {
                cb.checked = true;
            }
        });
        
        // 保存Token按钮事件监听器
        var saveTokenBtn = document.getElementById("saveToken");
        saveTokenBtn.onclick = function () {
            var tokenInput = document.getElementById("tokenInput");
            var token = tokenInput.value;
            if (token) {
                GM_setValue("token", token);
                topNotice("Token保存成功");
            } else {
                topNotice("请输入有效的Token");
            }
        };
    }

    //手动添加规则（操作）
    function addRule(){
        var ruleData = {"url": window.location.href, "img": "", "input": "", "inputType": "", "type": "", "captchaType": ""};
        //检测鼠标右键点击事件
        topNotice("请在验证码图片上点击鼠标 “右”👉 键");
        document.oncontextmenu = function(e){
            e = e || window.event;
            e.preventDefault();
 
            if (e.target.tagName == "IMG" || e.target.tagName == "GIF") {
                var imgList = document.getElementsByTagName('img');
                for (var i = 0; i < imgList.length; i++) {
                    if (imgList[i] == e.target) {
                        var k = i;
                        ruleData.type = "img";
                    }
                }
            }
            else if (e.target.tagName == "CANVAS") {
                var imgList = document.getElementsByTagName('canvas');
                for (var i = 0; i < imgList.length; i++) {
                    if (imgList[i] == e.target) {
                        var k = i;
                        ruleData.type = "canvas";
                    }
                }
            }
            if (k == null) {
                topNotice("选择有误，请重新点击验证码图片");
                return;
            }
            ruleData.img = k;
            topNotice("请在验证码输入框上点击鼠标 “左”👈 键");
            document.onclick = function(e){
                e = e || window.event;
                e.preventDefault();
                var inputList = document.getElementsByTagName('input');
                var textareaList = document.getElementsByTagName('textarea');
                // console.log(inputList);
                if (e.target.tagName == "INPUT") {
                    ruleData.inputType = "input";
                    for (var i = 0; i < inputList.length; i++) {
                        if (inputList[i] == e.target) {
                            if (inputList[0] && (inputList[0].id == "_w_simile" || inputList[0].id == "black_node")) {
                                var k = i - 1;
                            }
                            else {
                                var k = i;
                            }
                        }
                    }
                }
                else if (e.target.tagName == "TEXTAREA") {
                    ruleData.inputType = "textarea";
                    for (var i = 0; i < textareaList.length; i++) {
                        if (textareaList[i] == e.target) {
                            var k = i;
                        }
                    }
                }
                if (k == null) {
                    topNotice("选择有误，请重新点击验证码输入框");
                    return;
                }
                ruleData.input = k;
                
                // 创建自定义弹出框
                var div = document.createElement("div");
                div.className = "captcha-popup";
                div.style.cssText = 'width: 500px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: center !important; padding: 25px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
                // 添加CSS Reset，确保弹窗样式完全不受外部影响
                var style = document.createElement('style');
                style.textContent = `
                    .captcha-popup * {
                        margin: 0 !important;
                        padding: 0 !important;
                        border: 0 !important;
                        font-size: 100% !important;
                        font: inherit !important;
                        vertical-align: baseline !important;
                        box-sizing: border-box !important;
                    }
                    
                    .captcha-popup h3, .captcha-popup h4, .captcha-popup b {
                        font-weight: bold !important;
                    }
                    
                    .captcha-popup h3 {
                        font-size: 18px !important;
                        margin-bottom: 25px !important;
                    }
                    
                    .captcha-popup h4 {
                        font-size: 14px !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .captcha-popup p {
                        margin-bottom: 10px !important;
                        font-size: 14px !important;
                    }
                    
                    .captcha-popup span {
                        font-size: 14px !important;
                    }
                    
                    .captcha-popup div {
                        font-size: 14px !important;
                    }
                    
                    .captcha-popup ul, .captcha-popup ol {
                        list-style: none !important;
                        padding: 0 !important;
                    }
                    
                    .captcha-popup li {
                        list-style: none !important;
                        margin: 0 !important;
                    }
                    
                    .captcha-popup button {
                        padding: 10px 25px !important;
                        border-radius: 6px !important;
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        cursor: pointer !important;
                        transition: all 0.3s ease !important;
                        display: inline-block !important;
                        margin-right: 10px !important;
                    }
                `;
                div.appendChild(style);
                
                div.innerHTML = `
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #333;">添加规则</h3>
                    
                    <div style="margin-bottom: 20px; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">URL</h4>
                        <textarea id="ruleUrl" style="width: 100%; height: 80px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; outline: none; transition: all 0.3s ease; text-align: left; margin-left: 0px; margin-bottom: 10px; resize: vertical; font-family: inherit;" placeholder="请输入URL">${ruleData.url}</textarea>
                        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">支持*号通配符，如：https://www.xxx.com/*</label>
                    </div>
                    
                    <div style="margin-bottom: 25px; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">选择验证码类型</h4>
                        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; cursor: pointer; user-select: none;">
                            <input type="radio" name="captchaType" value="general" style="width: 16px; height: 16px; cursor: pointer;" checked>
                            <span style="font-size: 14px; color: #333; cursor: pointer;">数/英验证码</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
                            <input type="radio" name="captchaType" value="math" style="width: 16px; height: 16px; cursor: pointer;">
                            <span style="font-size: 14px; color: #333; cursor: pointer;">算术验证码</span>
                        </label>
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button style="flex: 1; padding: 12px; background-color: #409EFF; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" id="confirmBtn">确认</button>
                        <button style="flex: 1; padding: 12px; background-color: #f5f5f5; color: #666; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" id="cancelBtn">取消</button>
                    </div>
                `;
                
                document.body.appendChild(div);
                
                // 确认按钮点击事件
                var confirmBtn = div.querySelector("#confirmBtn");
                confirmBtn.onclick = function(event) {
                    event.stopPropagation(); // 阻止事件冒泡
                    // 获取用户输入的URL
                    var urlInput = div.querySelector("#ruleUrl");
                    var url = urlInput.value.trim();
                    if (!url) {
                        topNotice("请输入有效的URL");
                        return;
                    }
                    // 获取选中的单选框值
                    var selectedType = div.querySelector("input[name='captchaType']:checked").value;
                    
                    ruleData.url = url;
                    ruleData.captchaType = selectedType;
                    div.remove();
                    submitRule();
                };
                
                // 取消按钮点击事件
                var cancelBtn = div.querySelector("#cancelBtn");
                cancelBtn.onclick = function(event) {
                    event.stopPropagation(); // 阻止事件冒泡
                    div.remove();
                    // 重置事件监听
                    document.oncontextmenu = null;
                    document.onclick = null;
                };
                
                // 阻止弹出框内部点击事件冒泡
                div.onclick = function(event) {
                    event.stopPropagation();
                };
                
                // 提交规则的函数
                function submitRule() {
                    addR(ruleData).then((res)=>{
                        if (res.status == 200){
                            topNotice("添加规则成功");
                            document.oncontextmenu = null;
                            document.onclick = null;
                            start();
                        }
                        else {
                            topNotice("Error，添加规则失败");
                            document.oncontextmenu = null;
                            document.onclick = null;
                        }
                    });
                };
            }
        }
    }
 
    //手动添加规则
    function addR(ruleData){
        return new Promise((resolve, reject) => {
            // 更新本地存储的规则列表
            var localRules = GM_getValue("localRules", []);
            // 检查是否已存在相同URL的规则
            var existingIndex = localRules.findIndex(r => r.url === ruleData.url);
            if (existingIndex !== -1) {
                // 更新现有规则
                localRules[existingIndex] = ruleData;
            } else {
                // 添加新规则
                localRules.push(ruleData);
            }
            GM_setValue("localRules", localRules);
            
            // 返回模拟成功响应
            var mockResponse = { status: 200 };
            return resolve(mockResponse);
        });
    }
 
    function isCode() {
        if (element.height >= 100 || element.height == element.width)
            return false;
        var attrList = ["id", "title", "alt", "name", "className", "src"];
        var strList = ["code", "Code", "CODE", "captcha", "Captcha", "CAPTCHA", "yzm", "Yzm", "YZM", "check", "Check", "CHECK", "random", "Random", "RANDOM", "veri", "Veri", "VERI", "验证码", "看不清", "换一张"];
        for (var i = 0; i < attrList.length; i++) {
            for (var j = 0; j < strList.length; j++) {
                var attr = element[attrList[i]];
                if (attr.indexOf(strList[j]) != -1) {
                    return true;
                }
            }
        }
        return false;
    }
 
    function isInput() {
        var attrList = ["placeholder", "alt", "title", "id", "className", "name"];
        var strList = ["code", "Code", "CODE", "captcha", "Captcha", "CAPTCHA", "yzm", "Yzm", "YZM", "check", "Check", "CHECK", "random", "Random", "RANDOM", "veri", "Veri", "VERI", "验证码", "看不清", "换一张"];
        for (var i = 0; i < attrList.length; i++) {
            for (var j = 0; j < strList.length; j++) {
                var attr = input[attrList[i]];
                if (attr.indexOf(strList[j]) != -1) {
                    return true;
                }
            }
        }
        return false;
    }
 
    function codeByRule() {
        var code = "";
        var src = element.src;
        if (firstin) {
            firstin = false;
            if (src.indexOf('data:image') != -1) {
                code = src.split("base64,")[1];
                GM_setValue("tempCode", code);
                if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                    GM_setValue("preCode", GM_getValue("tempCode"));
                    p1(code).then((ans) => {
                        if (ans != "")
                            writeIn1(ans);
                        else
                            codeByRule();
                    });
                }
            }
            else if (src.indexOf('blob') != -1) {
                const image = new Image()
                image.src = src;
                image.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = image.width
                    canvas.height = image.height
                    const context = canvas.getContext('2d')
                    context.drawImage(image, 0, 0, image.width, image.height);
                    code = canvas.toDataURL().split("base64,")[1];
                    GM_setValue("tempCode", code);
                    if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                        GM_setValue("preCode", GM_getValue("tempCode"));
                        p1(code).then((ans) => {
                            if (ans != "")
                                writeIn1(ans);
                            else
                                codeByRule();
                        });
                    }
                }
            }
            else {
                try {
                    var img = element;
                    if (img.src && img.width != 0 && img.height != 0) {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        code = canvas.toDataURL("image/png").split("base64,")[1];
                        GM_setValue("tempCode", code);
                        if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                            GM_setValue("preCode", GM_getValue("tempCode"));
                            p1(code).then((ans) => {
                                if (ans != "")
                                    writeIn1(ans);
                                else
                                    codeByRule();
                            });
                        }
                    }
                    else {
                        codeByRule();
                    }
                }
                catch (err) {
                    return;
                }
            }
        }
        else {
            if (src.indexOf('data:image') != -1) {
                code = src.split("base64,")[1];
                GM_setValue("tempCode", code);
                if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                    GM_setValue("preCode", GM_getValue("tempCode"));
                    p1(code).then((ans) => {
                        writeIn1(ans);
                    });
                }
            }
            else if (src.indexOf('blob') != -1) {
                const image = new Image()
                image.src = src;
                image.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = image.width
                    canvas.height = image.height
                    const context = canvas.getContext('2d')
                    context.drawImage(image, 0, 0, image.width, image.height);
                    code = canvas.toDataURL().split("base64,")[1];
                    GM_setValue("tempCode", code);
                    if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                        GM_setValue("preCode", GM_getValue("tempCode"));
                        p1(code).then((ans) => {
                            writeIn1(ans);
                        })
                    }
                }
            }
            else {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                element.onload = function () {
                    canvas.width = element.width;
                    canvas.height = element.height;
                    ctx.drawImage(element, 0, 0, element.width, element.height);
                    code = canvas.toDataURL("image/png").split("base64,")[1];
                    GM_setValue("tempCode", code);
                    if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                        GM_setValue("preCode", GM_getValue("tempCode"));
                        p1(code).then((ans) => {
                            writeIn1(ans);
                        });
                    }
                }
            }
        }
    }
 
    function canvasRule() {
        setTimeout(function () {
            try {
                var code = element.toDataURL("image/png").split("base64,")[1];
                GM_setValue("tempCode", code);
                if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                    GM_setValue("preCode", GM_getValue("tempCode"));
                    p1(code).then((ans) => {
                        writeIn1(ans);
                    });
                }
            }
            catch (err) {
                canvasRule();
            }
        }, 100);
    }
 
    function findCode(k) {
        var code = '';
        var codeList = document.getElementsByTagName('img');
        // console.log(codeList);
        for (var i = k; i < codeList.length; i++) {
            var src = codeList[i].src;
            element = codeList[i];
            if (src.indexOf('data:image') != -1) {
                if (isCode()) {
                    firstin = false;
                    code = src.split("base64,")[1];
                    GM_setValue("tempCode", code);
                    if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                        GM_setValue("preCode", GM_getValue("tempCode"));
                        p(code, i).then((ans) => {
                            writeIn(ans);
                        });
                    }
                    break;
                }
            }
            else {
                if (isCode()) {
                    if (firstin) {
                        firstin = false;
                        var img = element;
                        if (img.src && img.width != 0 && img.height != 0) {
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0, img.width, img.height);
                            code = canvas.toDataURL("image/png").split("base64,")[1];
                            try {
                                code = canvas.toDataURL("image/png").split("base64,")[1];
                            }
                            catch (err) {
                                findCode(i + 1);
                                return;
                            }
                            GM_setValue("tempCode", code);
                            if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                                iscors = isCORS();
                                GM_setValue("preCode", GM_getValue("tempCode"));
                                p(code, i).then((ans) => {
                                    if (ans != "")
                                        writeIn(ans);
                                    else
                                        findCode(i);
                                });
                                return;
                            }
                        }
                        else {
                            findCode(i);
                            return;
                        }
                    }
                    else {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        element.onload = function () {
                            canvas.width = element.width;
                            canvas.height = element.height;
                            ctx.drawImage(element, 0, 0, element.width, element.height);
                            try {
                                code = canvas.toDataURL("image/png").split("base64,")[1];
                            }
                            catch (err) {
                                findCode(i + 1);
                                return;
                            }
                            GM_setValue("tempCode", code);
                            if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                                iscors = isCORS();
                                GM_setValue("preCode", GM_getValue("tempCode"));
                                p(code, i).then((ans) => {
                                    writeIn(ans);
                                });
                                return;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
 
    function findInput() {
        var inputList = document.getElementsByTagName('input');
        // console.log(inputList);
        for (var i = 0; i < inputList.length; i++) {
            input = inputList[i];
            if (isInput()) {
                return true;
            }
        }
    }
 
    function writeIn(ans) {
        if (findInput()) {
            ans = ans.replace(/\s+/g, "");
            input.value = ans;
            if (typeof (InputEvent) !== "undefined") {
                input.value = ans;
                input.dispatchEvent(new InputEvent('input'));
                var eventList = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
                for (var i = 0; i < eventList.length; i++) {
                    fire(input, eventList[i]);
                }
                input.value = ans;
            }
            else if (KeyboardEvent) {
                input.dispatchEvent(new KeyboardEvent("input"));
            }
        }
    }
 
    function p(code, i) {
        // 获取识别配置
        const generalApi = GM_getValue("generalApi", "free");
        
        if (generalApi === "free") {
            // 使用免费接口
            return new Promise((resolve, reject) => {
                const datas = {
                    "ImageBase64": String(code),
                }
                GM_xmlhttpRequest({
                    method: "POST",
                    url: queryUrl + "identify_GeneralCAPTCHA",
                    data: JSON.stringify(datas),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    responseType: "json",
                    onload: function (response) {
                        if (response.status == 200) {
                            if (response.responseText.indexOf("触发限流策略") != -1)
                                topNotice(response.response["msg"]);
                            try {
                                var result = response.response["result"];
                                console.log("[Free]识别结果：" + result);
                                return resolve(result);
                            }
                            catch (e) {
                                if (response.responseText.indexOf("接口请求频率过高") != -1)
                                    topNotice(response.responseText);
                            }
                        }
                        else {
                            try {
                                if (response.response["result"] == null)
                                    findCode(i + 1);
                                else
                                    console.log("识别失败");
                            }
                            catch (err) {
                                console.log("识别失败");
                            }
                        }
                    }
                });
            });
        } else {
            // 使用云码接口
            if (GM_getValue("token") == undefined) {
                topNotice("请在 [云码相关配置] 菜单中配置云码Token");
                return;
            }
            var token = GM_getValue("token").replace(/\+/g, '%2B');
            var type = "10110"
            const datas = {
                "image": String(code),
                "type": type,
                "token": token,
                "developer_tag": "41acabfb0d980a24e6022e89f9c1bfa4"
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.jfbym.com/api/YmServer/customApi",
                    data: JSON.stringify(datas),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    responseType: "json",
                    onload: function (response) {
                        if (response.response["code"] == "10000") {
                            try {
                                var result = response.response["data"]["data"];
                                console.log("[YM]识别结果：" + result);
                                return resolve(result);
                            }
                            catch (e) {
                                topNotice(response.response["msg"]);
                            }
                        }
                        else if (response.response["code"] == "10002") {
                            topNotice("云码积分不足，请自行充值");
                        }
                        else if (response.response["code"] == "10003") {
                            topNotice("请检查Token是否正确");
                        }
                        else {
                            findCode(i + 1);
                        }
                    }
                });
            });
        }
    }
 
    function p1(code) {
        // 获取识别配置
        const generalApi = GM_getValue("generalApi", "free");
        
        if (captchaType == "general" || captchaType == null) {
            // 数英验证码
            if (generalApi === "free") {
                // 使用免费接口
                return new Promise((resolve, reject) => {
                    const datas = {
                        "ImageBase64": String(code),
                    }
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: queryUrl + "identify_GeneralCAPTCHA",
                        data: JSON.stringify(datas),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        responseType: "json",
                        onload: function (response) {
                            if (response.status == 200) {
                                if (response.responseText.indexOf("触发限流策略") != -1)
                                    topNotice(response.response["msg"]);
                                try {
                                    var result = response.response["result"];
                                    console.log("[Free]识别结果：" + result);
                                    return resolve(result);
                                }
                                catch (e) {
                                    if (response.responseText.indexOf("接口请求频率过高") != -1)
                                        topNotice(response.responseText);
                                }
                            }
                            else {
                                console.log("识别失败");
                            }
                        }
                    });
                });
            } else {
                // 使用云码接口
                if (GM_getValue("token") == undefined) {
                    topNotice("请在 [云码配置] 菜单中配置云码Token");
                    return;
                }
                var token = GM_getValue("token").replace(/\+/g, '%2B');
                var type = "10110"
                const datas = {
                    "image": String(code),
                    "type": type,
                    "token": token,
                    "developer_tag": "41acabfb0d980a24e6022e89f9c1bfa4"
                }
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://www.jfbym.com/api/YmServer/customApi",
                        data: JSON.stringify(datas),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        responseType: "json",
                        onload: function (response) {
                            if (response.response["code"] == "10000") {
                                try {
                                    var result = response.response["data"]["data"];
                                    console.log("[YM]识别结果：" + result);
                                    return resolve(result);
                                }
                                catch (e) {
                                    topNotice(response.response["msg"]);
                                }
                            }
                            else if (response.response["code"] == "10002") {
                                topNotice("云码积分不足，请自行充值");
                            }
                            else if (response.response["code"] == "10003") {
                                topNotice("请检查Token是否正确");
                            }
                        }
                    });
                });
            }
        }
        else if (captchaType == "math") {
            // 算术验证码使用云码接口
            if (GM_getValue("token") == undefined) {
                topNotice("请在 [云码配置] 菜单中配置云码Token");
                return;
            }
            var token = GM_getValue("token").replace(/\+/g, '%2B');
            var type = GM_getValue("ymConfig", "50106");
            const datas = {
                "image": String(code),
                "type": type,
                "token": token,
                "developer_tag": "41acabfb0d980a24e6022e89f9c1bfa4"
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.jfbym.com/api/YmServer/customApi",
                    data: JSON.stringify(datas),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    responseType: "json",
                    onload: function (response) {
                        if (response.response["code"] == "10000") {
                            try {
                                var result = response.response["data"]["data"];
                                console.log("[YM]识别结果：" + result);
                                return resolve(result);
                            }
                            catch (e) {
                                topNotice(response.response["msg"]);
                            }
                        }
                        else if (response.response["code"] == "10002") {
                            topNotice("云码积分不足，请自行充值");
                        }
                        else if (response.response["code"] == "10003") {
                            topNotice("请检查Token是否正确");
                        }
                    }
                });
            });
        }
    }
 
    function isCORS() {
        try {
            if (element.src.indexOf('http') != -1 || element.src.indexOf('https') != -1) {
                if (element.src.indexOf(window.location.host) == -1) {
                    console.log("检测到当前页面存在跨域问题");
                    return true;
                }
                return false;
            }
        }
        catch (err) {
            return;
        }
    }
 
    function p2() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: element.src,
                method: "GET",
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'path': window.location.href },
                responseType: "blob",
                onload: function (response) {
                    let blob = response.response;
                    let reader = new FileReader();
                    reader.onloadend = (e) => {
                        let data = e.target.result;
                        element.src = data;
                        return resolve(data);
                    }
                    reader.readAsDataURL(blob);
                }
            });
        });
    }
 
    function fire(element, eventName) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    }
    function FireForReact(element, eventName) {
        try {
            let env = new Event(eventName);
            element.dispatchEvent(env);
            var funName = Object.keys(element).find(p => Object.keys(element[p]).find(f => f.toLowerCase().endsWith(eventName)));
            if (funName != undefined) {
                element[funName].onChange(env)
            }
        }
        catch (e) { }
    }
 
    function writeIn1(ans) {
        ans = ans.replace(/\s+/g, "");
        if (input.tagName == "TEXTAREA") {
            input.innerHTML = ans;
        }
        else {
            input.value = ans;
            if (typeof (InputEvent) !== "undefined") {
                input.value = ans;
                input.dispatchEvent(new InputEvent('input'));
                var eventList = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
                for (var i = 0; i < eventList.length; i++) {
                    fire(input, eventList[i]);
                }
                FireForReact(input, 'change');
                input.value = ans;
            }
            else if (KeyboardEvent) {
                input.dispatchEvent(new KeyboardEvent("input"));
            }
        }
    }
 
    function matchUrl(pattern, url) {
        // 正确处理 URL 匹配，只对除了*号以外的正则特殊字符进行转义
        var regexPattern = '^' + pattern.replace(/([.*+?^${}()|[\]\\])/g, function(match) {
            if (match === '*') {
                return '.*'; // 保留*号作为通配符
            }
            return '\\' + match; // 转义其他特殊字符
        }) + '$';
        
        var regex = new RegExp(regexPattern);
        return regex.test(url);
    }
    
    function compareUrl(){
        return new Promise((resolve, reject) => {
            var currentUrl = window.location.href;
            
            // 只从本地存储获取规则
            var localStoredRules = GM_getValue("localRules", []);
            
            // 确保规则是数组格式
            var rulesList = Array.isArray(localStoredRules) ? localStoredRules : [localStoredRules];
            
            for (var i = 0; i < rulesList.length; i++) {
                var rule = rulesList[i];
                if (rule && rule.url && matchUrl(rule.url, currentUrl)) {
                    localRules = rule;
                    return resolve(true);
                }
            }
            
            // 没有找到匹配的规则
            localRules = [];
            return resolve(false);
        });
    }
 
    function start() {
        compareUrl().then((isExist) => {
            if (isExist) {
                exist = true;
                console.log("【自动识别填充验证码】已存在该网站规则");
                if (localRules["type"] == "img") {
                    captchaType = localRules["captchaType"];
                    imgIndex = localRules["img"];
                    inputIndex = localRules["input"];
                    element = document.getElementsByTagName('img')[imgIndex];
                    if (localRules["inputType"] == "textarea") {
                        input = document.getElementsByTagName('textarea')[inputIndex];
                    }
                    else {
                        input = document.getElementsByTagName('input')[inputIndex];
                        var inputList = document.getElementsByTagName('input');
                        if (inputList[0] && (inputList[0].id == "_w_simile" || inputList[0].id == "black_node")) {
                            inputIndex = parseInt(inputIndex) + 1;
                            input = inputList[inputIndex];
                        }
                    }
                    if (element && input) {
                        iscors = isCORS();
                        if (iscors) {
                            p2().then(() => {
                                codeByRule();
                            });
                        }
                        else {
                            codeByRule();
                        }
                    }
                    else
                        pageChange();
                }
                else if (localRules["type"] == "canvas") {
                    captchaType = localRules["captchaType"];
                    canvasIndex = localRules["img"];
                    inputIndex = localRules["input"];
                    element = document.getElementsByTagName('canvas')[canvasIndex];
                    if (localRules["inputType"] == "textarea") {
                        input = document.getElementsByTagName('textarea')[inputIndex];
                    }
                    else {
                        input = document.getElementsByTagName('input')[inputIndex];
                        var inputList = document.getElementsByTagName('input');
                        if (inputList[0] && (inputList[0].id == "_w_simile" || inputList[0].id == "black_node")) {
                            inputIndex = parseInt(inputIndex) + 1;
                            input = inputList[inputIndex];
                        }
                    }
                    iscors = isCORS();
                    if (iscors) {
                        p2().then(() => {
                            canvasRule();
                        });
                    }
                    else {
                        canvasRule();
                    }
                }
            }
            else {
                console.log("【自动识别填充验证码】不存在该网站规则，正在根据预设规则自动识别...");
                findCode(0);
            }
        });
    }
 
    function pageChange() {
        if (exist) {
            if (localRules["type"] == "img" || localRules["type"] == null) {
                element = document.getElementsByTagName('img')[imgIndex];
                if (localRules["inputType"] == "textarea") {
                    input = document.getElementsByTagName('textarea')[inputIndex];
                }
                else {
                    input = document.getElementsByTagName('input')[inputIndex];
                    var inputList = document.getElementsByTagName('input');
                    if (inputList[0] && (inputList[0].id == "_w_simile" || inputList[0].id == "black_node")) {
                        input = inputList[inputIndex];
                    }
                }
                iscors = isCORS();
                if (iscors) {
                    p2().then(() => {
                        // console.log(data);
                        codeByRule();
                    });
                }
                else {
                    codeByRule();
                }
            }
            else if (localRules["type"] == "canvas") {
                element = document.getElementsByTagName('canvas')[canvasIndex];
                if (localRules["inputType"] == "textarea") {
                    input = document.getElementsByTagName('textarea')[inputIndex];
                }
                else {
                    input = document.getElementsByTagName('input')[inputIndex];
                    var inputList = document.getElementsByTagName('input');
                    if (inputList[0] && (inputList[0].id == "_w_simile" || inputList[0].id == "black_node")) {
                        input = inputList[inputIndex];
                    }
                }
                iscors = isCORS();
                if (iscors) {
                    p2().then(() => {
                        canvasRule();
                    });
                }
                else {
                    canvasRule();
                }
            }
        }
        else {
            findCode(0);
        }
    }
 
    function topNotice(msg) {
        // 先移除已存在的提示
        var existingNotice = document.getElementById('topNotice');
        if (existingNotice) {
            existingNotice.remove();
        }
        
        var div = document.createElement('div');
        div.id = 'topNotice';
        div.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; background: #409EFF; color: white; font-family: "Microsoft YaHei", Arial, sans-serif; font-size: 16px; font-weight: 500; border-radius: 8px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); z-index: 9999999999; opacity: 0; transform: translateX(-50%) translateY(-20px); transition: all 0.3s ease-out;';
        div.innerHTML = msg;
        document.body.appendChild(div);
        
        // 触发弹出动画
        setTimeout(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // 触发收回动画并移除元素
        setTimeout(function () {
            div.style.opacity = '0';
            div.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(function() {
                if (document.getElementById('topNotice') === div) {
                    document.body.removeChild(div);
                }
            }, 300);
        }, 3500);
    }
    
    function toggleMode() {
        // 计算将要切换到的模式
        const newMode = mode === 'blacklist' ? 'whitelist' : 'blacklist';
        
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 500px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: left !important; padding: 25px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        
        // 添加精确的样式控制，确保列表符号不显示
        var style = document.createElement('style');
        style.textContent = '.captcha-popup * { box-sizing: border-box !important; } .captcha-popup ul { list-style-type: none !important; padding-left: 0 !important; } .captcha-popup li { list-style-type: none !important; margin-left: 0 !important; }';
        div.appendChild(style);
        
        div.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center !important;">模式切换</h3>           
            </div>            
            
            <div style="margin-bottom: 25px !important;">
                <p style="margin: 0 0 10px 0 !important; font-size: 14px !important; color: #333 !important;">当前模式：<span style="color: #409EFF !important; font-weight: 500 !important;">${mode === 'blacklist' ? '黑名单模式' : '白名单模式'}</span></p>
                <p style="margin: 0 0 15px 0 !important; font-size: 14px !important; color: #333 !important;">将要切换到：<span style="color: #409EFF !important; font-weight: 500 !important;">${newMode === 'blacklist' ? '黑名单模式' : '白名单模式'}</span></p>
                
                <div style="background-color: #f8f9fa !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 20px !important;">
                    <div style="margin: 0 0 10px 0 !important; font-size: 13px !important; color: #666 !important; line-height: 2 !important;"><b style="font-weight: bold !important;">黑名单模式：</b>黑名单中的网站不执行识别，其他所有网站均执行</div>
                    <div style="margin: 0 !important; font-size: 13px !important; color: #666 !important; line-height: 2 !important;"><b style="font-weight: bold !important;">白名单模式：</b>白名单中的网站执行识别，其他所有网站均不执行</div>
                </div>
            </div>
            
            <div style="text-align: center !important; margin-top: 15px !important; margin-bottom: 10px !important;">
                <button style="display: inline-block !important; padding: 12px 25px !important; background-color: #409EFF !important; color: white !important; border: none !important; border-radius: 8px !important; font-size: 14px !important; font-weight: 500 !important; cursor: pointer !important; transition: all 0.3s ease !important; margin-right: 15px !important;" id="confirmToggle">确认切换</button>
                <button style="display: inline-block !important; padding: 12px 25px !important; background-color: #f5f5f5 !important; color: #666 !important; border: 1px solid #e0e0e0 !important; border-radius: 8px !important; font-size: 14px !important; font-weight: 500 !important; cursor: pointer !important; transition: all 0.3s ease !important;" id="cancelToggle">取消</button>
            </div>
        `;
        
        document.body.appendChild(div);
        
        // 确认切换
        var confirmToggle = div.querySelector("#confirmToggle");
        confirmToggle.onclick = function(event) {
            event.stopPropagation();
            div.remove();
            
            // 执行模式切换
            mode = newMode;
            GM_setValue("mode", mode);
            topNotice("已切换到" + (mode === 'blacklist' ? '黑名单' : '白名单') + "模式，刷新页面生效");
        };
        
        // 取消切换
        var cancelToggle = div.querySelector("#cancelToggle");
        cancelToggle.onclick = function(event) {
            event.stopPropagation();
            div.remove();
        };
        
        // 阻止弹出框内部点击事件冒泡
        div.onclick = function(event) {
            event.stopPropagation();
        };
    }
 
    function manageLists() {
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 700px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: center !important; padding: 20px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        // 添加精确的样式控制，确保列表符号不显示
        var style = document.createElement('style');
        style.textContent = '.captcha-popup * { box-sizing: border-box !important; } .captcha-popup ul { list-style-type: none !important; padding-left: 0 !important; } .captcha-popup li { list-style-type: none !important; margin-left: 0 !important; }';
        div.appendChild(style);
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center; flex-grow: 1;">管理黑/白名单</h3>
                <button style="width: 30px; height: 30px; text-align: center; font-weight: bold; color: #999; background-color: transparent; border: 1px solid #e0e0e0; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; margin-left: 10px;" id="close">×</button>
            </div>
            
            <div style="display: flex; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px;">
                <button style="flex: 1; padding: 10px; background-color: #f5f5f5; border: none; border-bottom: 2px solid #409EFF; color: #409EFF; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-align: center;" id="blackTab" class="active-tab">黑名单</button>
                <button style="flex: 1; padding: 10px; background-color: #f5f5f5; border: none; border-bottom: 2px solid transparent; color: #666; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-align: center;" id="whiteTab" class="active-tab">白名单</button>
            </div>
            
            <div id="blackListContent" style="height: 300px; overflow: auto;">
                <div style="display: flex; gap: 10px; justify-content: flex-start; margin-bottom: 15px;">
                    <button style="padding: 8px 16px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;" id="addBlackCustom">自定义添加</button>
                    <button style="padding: 8px 16px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;" id="addBlackCurrent">添加当前页面</button>
                </div>
                <table id="blackListTable" style="width:100%; border-collapse:collapse; font-size: 14px;">
                    <thead style='background-color: #f8f9fa;'>
                        <tr>
                            <th style='width: 80%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>字符串</th>
                            <th style='width: 20%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>操作</th>
                        </tr>
                    </thead>
                    <tbody id="blackListBody"></tbody>
                </table>
            </div>
            
            <div id="whiteListContent" style="height: 300px; overflow: auto; display: none;">
                <div style="display: flex; gap: 10px; justify-content: flex-start; margin-bottom: 15px;">
                    <button style="padding: 8px 16px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;" id="addWhiteCustom">自定义添加</button>
                    <button style="padding: 8px 16px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;" id="addWhiteCurrent">添加当前页面</button>
                </div>
                <table id="whiteListTable" style="width:100%; border-collapse:collapse; font-size: 14px;">
                    <thead style='background-color: #f8f9fa;'>
                        <tr>
                            <th style='width: 80%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>字符串</th>
                            <th style='width: 20%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>操作</th>
                        </tr>
                    </thead>
                    <tbody id="whiteListBody"></tbody>
                </table>
            </div>
        `;
        
        document.body.insertBefore(div, document.body.firstChild);
        
        // 关闭按钮
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        };
        
        // 标签切换功能
        var blackTab = document.getElementById("blackTab");
        var whiteTab = document.getElementById("whiteTab");
        var blackListContent = document.getElementById("blackListContent");
        var whiteListContent = document.getElementById("whiteListContent");
        
        blackTab.onclick = function () {
            blackTab.className = "active-tab";
            blackTab.style.backgroundColor = "#f5f5f5";
            blackTab.style.borderBottom = "2px solid #409EFF";
            blackTab.style.color = "#409EFF";
            
            whiteTab.className = "";
            whiteTab.style.backgroundColor = "#f5f5f5";
            whiteTab.style.borderBottom = "2px solid transparent";
            whiteTab.style.color = "#666";
            
            blackListContent.style.display = "block";
            whiteListContent.style.display = "none";
        };
        
        whiteTab.onclick = function () {
            whiteTab.className = "active-tab";
            whiteTab.style.backgroundColor = "#f5f5f5";
            whiteTab.style.borderBottom = "2px solid #409EFF";
            whiteTab.style.color = "#409EFF";
            
            blackTab.className = "";
            blackTab.style.backgroundColor = "#f5f5f5";
            blackTab.style.borderBottom = "2px solid transparent";
            blackTab.style.color = "#666";
            
            whiteListContent.style.display = "block";
            blackListContent.style.display = "none";
        };
        
        // 渲染黑名单
        var blackList = GM_getValue("blackList", []);
        var blackListBody = document.getElementById("blackListBody");
        renderList(blackList, blackListBody, "black");
        
        // 黑名单自定义添加按钮
        var addBlackCustom = document.getElementById("addBlackCustom");
        addBlackCustom.onclick = function () {
            var zz = prompt("请输入一个字符串，任何URL中包含该字符串的网页都不会执行识别");
            if (zz == null) return;
            var blackList = GM_getValue("blackList", []);
            if (blackList.indexOf(zz) == -1) {
                blackList.push(zz);
                GM_setValue("blackList", blackList);
                renderList(blackList, blackListBody, "black");
                topNotice("添加黑名单成功，刷新页面生效");
            } else {
                topNotice("该网页已在黑名单中");
            }
        };
        
        // 黑名单添加当前页面按钮
        var addBlackCurrent = document.getElementById("addBlackCurrent");
        addBlackCurrent.onclick = function () {
            var currentUrl = window.location.href.split("?")[0];
            var blackList = GM_getValue("blackList", []);
            if (blackList.indexOf(currentUrl) == -1) {
                blackList.push(currentUrl);
                GM_setValue("blackList", blackList);
                renderList(blackList, blackListBody, "black");
                topNotice("添加当前页面到黑名单成功，刷新页面生效");
            } else {
                topNotice("当前页面已在黑名单中");
            }
        };
        
        // 渲染白名单
        var whiteList = GM_getValue("whiteList", []);
        var whiteListBody = document.getElementById("whiteListBody");
        renderList(whiteList, whiteListBody, "white");
        
        // 白名单自定义添加按钮
        var addWhiteCustom = document.getElementById("addWhiteCustom");
        addWhiteCustom.onclick = function () {
            var zz = prompt("请输入一个字符串，仅URL中包含该字符串的网页才会执行识别");
            if (zz == null) return;
            var whiteList = GM_getValue("whiteList", []);
            if (whiteList.indexOf(zz) == -1) {
                whiteList.push(zz);
                GM_setValue("whiteList", whiteList);
                renderList(whiteList, whiteListBody, "white");
                topNotice("添加白名单成功，刷新页面生效");
            } else {
                topNotice("该网页已在白名单中");
            }
        };
        
        // 白名单添加当前页面按钮
        var addWhiteCurrent = document.getElementById("addWhiteCurrent");
        addWhiteCurrent.onclick = function () {
            var currentUrl = window.location.href.split("?")[0];
            var whiteList = GM_getValue("whiteList", []);
            if (whiteList.indexOf(currentUrl) == -1) {
                whiteList.push(currentUrl);
                GM_setValue("whiteList", whiteList);
                renderList(whiteList, whiteListBody, "white");
                topNotice("添加当前页面到白名单成功，刷新页面生效");
            } else {
                topNotice("当前页面已在白名单中");
            }
        };
        
        // 渲染列表的通用函数
        function renderList(list, container, type) {
            container.innerHTML = "";
            for (var i = 0; i < list.length; i++) {
                var row = container.insertRow(i);
                row.insertCell(0).innerHTML = `<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 10px; color: #333;'>${list[i]}</div>`;
                var cell = row.insertCell(1);
                cell.style.textAlign = "center";
                cell.style.padding = "10px";
                
                // 编辑按钮
                var editBtn = document.createElement("button");
                editBtn.className = `edit-${type}`;
                editBtn.style.cssText = 'background-color: transparent; color: #409EFF; border: none; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease; margin-right: 5px;';
                editBtn.innerText = "编辑";
                editBtn.dataset.index = i;
                cell.appendChild(editBtn);
                
                // 移除按钮
                var removeBtn = document.createElement("button");
                removeBtn.className = `remove-${type}`;
                removeBtn.style.cssText = 'background-color: transparent; color: #f44336; border: none; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;';
                removeBtn.innerText = "移除";
                removeBtn.dataset.index = i;
                cell.appendChild(removeBtn);
                
                // 编辑按钮点击事件
                editBtn.onclick = function () {
                    var index = parseInt(this.dataset.index);
                    var list = GM_getValue(`${type}List`, []);
                    var currentValue = list[index];
                    var newVal = prompt(`编辑字符串`, currentValue);
                    if (newVal == null) return;
                    if (newVal.trim() === "") {
                        topNotice("字符串不能为空");
                        return;
                    }
                    if (list.indexOf(newVal) != -1 && newVal !== currentValue) {
                        topNotice("该字符串已存在");
                        return;
                    }
                    list[index] = newVal;
                    GM_setValue(`${type}List`, list);
                    renderList(list, container, type);
                    topNotice(`编辑${type === "black" ? "黑名单" : "白名单"}成功，刷新页面生效`);
                };
                
                // 移除按钮点击事件
                removeBtn.onclick = function () {
                    var index = parseInt(this.dataset.index);
                    var list = GM_getValue(`${type}List`, []);
                    list.splice(index, 1);
                    GM_setValue(`${type}List`, list);
                    renderList(list, container, type);
                    topNotice(`移除${type === "black" ? "黑名单" : "白名单"}成功，刷新页面生效`);
                };
            }
        }
    }

    function manageRules() {
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 75% !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: center !important; padding: 20px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        
        // 添加精确的样式控制，确保列表符号不显示
        var style = document.createElement('style');
        style.textContent = '.captcha-popup * { box-sizing: border-box !important; } .captcha-popup ul { list-style-type: none !important; padding-left: 0 !important; } .captcha-popup li { list-style-type: none !important; margin-left: 0 !important; }';
        div.appendChild(style);
        
        div.innerHTML = `
             <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center; flex-grow: 1;">规则列表</h3>
                <button style="width: 30px; height: 30px; text-align: center; font-weight: bold; color: #999; background-color: transparent; border: 1px solid #e0e0e0; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; margin-left: 10px;" id="close">×</button>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 10px;">
                    <button id="importBtn" style="padding: 8px 16px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;">导入</button>
                    <button id="exportBtn" style="padding: 8px 16px; background-color: #E6A23C; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease;">导出</button>
                </div>
                <div style="width: 300px;">
                    <input type="text" id="searchInput" placeholder="输入关键字搜索规则" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; outline: none; transition: all 0.3s ease; text-align: left; box-sizing: border-box !important">
                </div>
            </div>
            
            <div style="height: 350px; overflow: auto;">
                <table id="rulesTable" style="width:100%; border-collapse:collapse; font-size: 14px;">
                    <thead style='background-color: #f8f9fa;'>
                        <tr>
                            <th style='width: 35%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>URL</th>
                            <th style='width: 10%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>图片类型</th>
                            <th style='width: 15%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>验证码类型</th>
                            <th style='width: 10%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>图片索引</th>
                            <th style='width: 10%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>输入框索引</th>
                            <th style='width: 10%; text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #333;'>操作</th>
                        </tr>
                    </thead>
                    <tbody id="rulesBody"></tbody>
                </table>
            </div>
            
            <!-- 隐藏的文件输入框，用于导入功能 -->
            <input type="file" id="importFile" accept=".json" style="display: none;">
        `;
        
        document.body.insertBefore(div, document.body.firstChild);
        
        // 关闭按钮
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        };
        
        // 渲染规则列表，支持搜索关键字
        function renderRules(searchKeyword = "") {
            var allRules = GM_getValue("localRules", []);
            var rulesBody = document.getElementById("rulesBody");
            rulesBody.innerHTML = "";
            
            // 过滤规则
            var filteredRules = allRules;
            if (searchKeyword) {
                filteredRules = allRules.filter(rule => {
                    // 在URL中搜索关键字
                    return rule.url.toLowerCase().includes(searchKeyword.toLowerCase());
                });
            }
            
            for (var i = 0; i < filteredRules.length; i++) {
                var rule = filteredRules[i];
                var row = rulesBody.insertRow(i);
                
                // URL列
                row.insertCell(0).innerHTML = `<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 10px; color: #333;'>${rule.url}</div>`;
                // 类型列
                row.insertCell(1).innerHTML = `<div style='text-align: center; padding: 10px; color: #333;'>${rule.type}</div>`;
                // 验证码类型列
                row.insertCell(2).innerHTML = `<div style='text-align: center; padding: 10px; color: #333;'>${rule.captchaType === 'general' ? '数英' : '算术'}</div>`;
                // 图片索引列
                row.insertCell(3).innerHTML = `<div style='text-align: center; padding: 10px; color: #333;'>${rule.img}</div>`;
                // 输入索引列
                row.insertCell(4).innerHTML = `<div style='text-align: center; padding: 10px; color: #333;'>${rule.input}</div>`;
                
                // 操作列
                var cell = row.insertCell(5);
                cell.style.textAlign = "center";
                cell.style.padding = "10px";
                
                // 编辑按钮
                var editBtn = document.createElement("button");
                editBtn.style.cssText = 'background-color: transparent; color: #409EFF; border: none; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease; margin-right: 5px;';
                editBtn.innerText = "编辑";
                editBtn.dataset.index = i;
                editBtn.dataset.url = rule.url;
                cell.appendChild(editBtn);
                
                // 删除按钮
                var removeBtn = document.createElement("button");
                removeBtn.style.cssText = 'background-color: transparent; color: #f44336; border: none; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;';
                removeBtn.innerText = "删除";
                removeBtn.dataset.index = i;
                removeBtn.dataset.url = rule.url;
                cell.appendChild(removeBtn);
                
                // 编辑按钮点击事件
                editBtn.onclick = function () {
                    var url = this.dataset.url;
                    var rules = GM_getValue("localRules", []);
                    var ruleIndex = rules.findIndex(r => r.url === url);
                    if (ruleIndex !== -1) {
                        var currentRule = rules[ruleIndex];
                        var newUrl = prompt("请输入URL（支持*号泛匹配）", currentRule.url);
                        if (newUrl != null && newUrl.trim() !== "") {
                            // 检查新URL是否已存在
                            var isExist = rules.some(r => r.url === newUrl && r.url !== url);
                            if (!isExist) {
                                currentRule.url = newUrl;
                                rules[ruleIndex] = currentRule;
                                GM_setValue("localRules", rules);
                                renderRules(searchInput.value);
                                topNotice("规则编辑成功");
                            } else {
                                topNotice("该URL已存在");
                            }
                        }
                    }
                };
                
                removeBtn.onclick = function () {
                    var url = this.dataset.url;
                    var rules = GM_getValue("localRules", []);
                    rules = rules.filter(r => r.url !== url);
                    GM_setValue("localRules", rules);
                    renderRules(searchInput.value);
                    topNotice("规则删除成功");
                };
            }
        }
        
        // 搜索功能
        var searchInput = div.querySelector("#searchInput");
        
        // 实时搜索功能
        searchInput.addEventListener("input", function () {
            var keyword = searchInput.value;
            renderRules(keyword);
        });
        
        // 导入功能
        var importBtn = div.querySelector("#importBtn");
        var importFile = div.querySelector("#importFile");
        
        importBtn.onclick = function () {
            importFile.click();
        };
        
        importFile.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;
            
            var reader = new FileReader();
            reader.onload = function (event) {
                try {
                    var importedRules = JSON.parse(event.target.result);
                    if (!Array.isArray(importedRules)) {
                        importedRules = [importedRules];
                    }
                    
                    // 获取现有规则
                    var existingRules = GM_getValue("localRules", []);
                    
                    // 合并规则，去重
                    var allRules = [...existingRules];
                    importedRules.forEach(importedRule => {
                        var isExist = allRules.some(rule => rule.url === importedRule.url);
                        if (!isExist) {
                            allRules.push(importedRule);
                        }
                    });
                    
                    GM_setValue("localRules", allRules);
                    renderRules(searchInput.value);
                    topNotice(`成功导入 ${importedRules.length} 条规则`);
                } catch (err) {
                    topNotice("导入失败：文件格式错误");
                }
            };
            reader.readAsText(file);
            
            // 重置文件输入框
            importFile.value = "";
        };
        
        // 导出功能
        var exportBtn = div.querySelector("#exportBtn");
        exportBtn.onclick = function () {
            var rules = GM_getValue("localRules", []);
            var jsonStr = JSON.stringify(rules, null, 2);
            var blob = new Blob([jsonStr], { type: "application/json" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "captcha_rules.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            topNotice("规则导出成功，等待浏览器下载");
        };
        
        // 初始渲染规则列表
        renderRules();
    }
    
    function otherSettings() {
        var div = document.createElement("div");
        div.className = "captcha-popup";
        div.style.cssText = 'width: 500px !important; position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: white !important; border: 1px solid #e0e0e0 !important; z-index: 9999999999 !important; text-align: center !important; padding: 20px !important; box-shadow: 0px 4px 20px rgba(0,0,0,0.15) !important; border-radius: 12px !important; overflow: hidden !important; font-family: "Microsoft YaHei", Arial, sans-serif !important; box-sizing: border-box !important;';
        // 添加精确的样式控制，确保列表符号不显示
        var style = document.createElement('style');
        style.textContent = '.captcha-popup * { box-sizing: border-box !important; } .captcha-popup ul { list-style-type: none !important; padding-left: 0 !important; } .captcha-popup li { list-style-type: none !important; margin-left: 0 !important; }';
        div.appendChild(style);
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333; text-align: center; flex-grow: 1;">其他设置</h3>
                <button style="width: 30px; height: 30px;text-align: center; font-weight: bold; color: #999; background-color: transparent; border: 1px solid #e0e0e0; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; margin-left: 10px;" id="close">×</button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">延迟识别时间</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="number" id="delayInput" value="${GM_getValue("startDelay", 500)}" min="0" step="10" style="flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; outline: none; transition: all 0.3s ease;" placeholder="请输入延迟时间（毫秒）">
                        <button style="padding: 10px 20px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" id="saveDelay">保存</button>
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #999; text-align: left;">如遇到进入页面首个验证码无法自动填充的情况，请尝试上调延迟时间<br>单位：毫秒，默认 500ms</p>
                </div>
                
                <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
                
                <div style="width: 100%; text-align: left;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">加入交流/反馈群</h4>
                    <button style="width: auto; padding: 10px 20px; background-color: #409EFF; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; display: inline-block;" id="joinGroup">获取群号</button>
                </div>
            </div>
        `;
        
        document.body.insertBefore(div, document.body.firstChild);
        
        // 关闭按钮
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        };
        
        // 保存延迟时间
        var saveDelay = document.getElementById("saveDelay");
        saveDelay.onclick = function () {
            var delayInput = document.getElementById("delayInput");
            var delay = delayInput.value;
            if (delay !== "") {
                var delayValue = parseInt(delay);
                if (!isNaN(delayValue) && delayValue >= 0) {
                    GM_setValue("startDelay", delayValue);
                    topNotice("延迟识别时间已设置为 " + delayValue + " 毫秒，刷新页面生效");
                } else {
                    topNotice("请输入有效的非负整数");
                }
            }
        };
        
        // 获取交流群信息
        var joinGroup = document.getElementById("joinGroup");
        joinGroup.onclick = function () {
            getQQGroup();
        };
    }

    console.log("【自动识别填充验证码】正在运行...");

    var url = window.location.href;
    var blackList = GM_getValue("blackList", []);
    var whiteList = GM_getValue("whiteList", []);
    var shouldRun = true;
    
    if (mode === "blacklist") {
        // 黑名单模式：URL在黑名单中则停止运行
        inBlack = blackList.some(function (blackItem) {
            return url.includes(blackItem);
        });
        shouldRun = !inBlack;
        if (inBlack) {
            console.log("【自动识别填充验证码】当前页面在黑名单中");
        }
    } else {
        // 白名单模式：仅URL在白名单中才运行
        var inWhite = whiteList.some(function (whiteItem) {
            return url.includes(whiteItem);
        });
        shouldRun = inWhite;
        if (!inWhite) {
            console.log("【自动识别填充验证码】当前页面不在白名单中");
        }
    }
    
    if (shouldRun) {
        let delay = GM_getValue("startDelay", 500);
        console.log(delay + "毫秒后开始识别");
        setTimeout(() => {
            start();
        }, delay);
    }
 
    var imgSrc = "";
    setTimeout(function () {
        const targetNode = document.body;
        const config = { attributes: true, childList: true, subtree: true };
        const callback = function () {
            // 检查是否应该运行脚本
            if (!shouldRun) return;
            try {
                if (iscors) {
                    if (element == undefined) {
                        pageChange();
                    }
                    if (element.src != imgSrc) {
                        console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                        imgSrc = element.src;
                        pageChange();
                    }
                }
                else {
                    console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                    pageChange();
                }
            }
            catch (err) {
                return;
            }
        }
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }, 1000);

    setTimeout(function () {
        // 检查是否应该运行脚本
        if (!shouldRun) return;
        try {
            if (element.tagName != "CANVAS") return;
        }
        catch (err) {
            return;
        }
        var canvasData1 = element.toDataURL();
        setInterval(function () {
            // 检查是否应该运行脚本
            if (!shouldRun) return;
            var canvasData2 = element.toDataURL();
            if (canvasData1 != canvasData2) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                canvasData1 = canvasData2;
                pageChange();
            }
        }, 0);
    }, 1000);

    setTimeout(function () {
        // 检查是否应该运行脚本
        if (!shouldRun) return;
        var tempUrl = window.location.href;
        setInterval(function () {
            // 检查是否应该运行脚本
            if (!shouldRun) return;
            if (tempUrl != window.location.href) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                tempUrl = window.location.href;
                start();
            }
        });
    }, 500)
})();