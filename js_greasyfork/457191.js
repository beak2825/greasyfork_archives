// ==UserScript==
// @name         自动识别填充网页验证码
// @namespace    http://tampermonkey.net/
// @version      1.0.0
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

    var element, input, imgIndex, canvasIndex, inputIndex, captchaType;
    var localRules = [];
    var queryUrl = "http://ca.zwhyzzz.top:8092/"
    var exist = false;
    var iscors = false;
    var inBlack = false;
    var firstin = true;

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

    GM_registerMenuCommand('添加当前页面规则', addRule);
    GM_registerMenuCommand('删除当前页面规则', delRule);
    GM_registerMenuCommand('管理所有规则', manageRules);
    GM_registerMenuCommand('管理黑名单', manageBlackList);
    GM_registerMenuCommand('云码相关配置(算术码)', ymConfig);
    GM_registerMenuCommand('延迟识别时间', setStartDelay);
    GM_registerMenuCommand('加入交流/反馈群', getQQGroup);

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

    function ymConfig() {
        var div = document.createElement("div");
        div.style.cssText = 'width: 700px; height: 250px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; z-index: 9999999999; text-align: center; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); border-radius: 10px; overflow: auto; **color: #000;**';
        div.innerHTML = `
        <h3 style='margin-bottom: 12px; font-weight: bold; font-size: 18px; color: #000;'>计算类型</h3>
        <button style='position: absolute; top: 10px; left: 10px; width: 100px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px;color: #000;' id='gettoken'>填写Token</button>
        <table style='width:100%; border-collapse:collapse; border: 1px solid black; color: #000;'>
        <thead style='background-color: #e0e0e0; color: #000; font-weight: bold;'>
            <tr>
            <th style='text-align: center; padding: 5px; color: #000;'>选择</th>
            <th style='text-align: center; padding: 5px; color: #000;'>类型</th>
            <th style='text-align: center; padding: 5px; color: #000;'>描述</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td style='text-align: center;'><input type="checkbox" /></td>
            <td style='text-align: center; padding: 5px; color: #000;'>50100</td>
            <td style='text-align: center; padding: 5px; color: #000;'>通用数字计算题（人工通道，速度较慢）</td>
            </tr>
            <tr>
            <td style='text-align: center;'><input type="checkbox" /></td>
            <td style='text-align: center; padding: 5px; color: #000;'>50101</td>
            <td style='text-align: center; padding: 5px; color: #000;'>中文计算题</td>
            </tr>
            <tr>
            <td style='text-align: center;'><input type="checkbox" /></td>
            <td style='text-align: center; padding: 5px; color: #000;'>50106</td>
            <td style='text-align: center; padding: 5px; color: #000;'>calculate_ry（机器识别通道，速度较快）</td>
            </tr>
        </tbody>
        </table>
        <button style='position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 18px; font-weight: bold; color: #333; background-color: transparent; border: none; outline: none; cursor: pointer;' id='close'>×</button>
        `;
        document.body.insertBefore(div, document.body.firstChild);

        var gettoken = document.getElementById("gettoken");
        gettoken.onclick = function () {
            saveToken();
            div.remove();
        }
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        }
        var checkboxes = div.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => {
            cb.addEventListener("click", function () {
                checkboxes.forEach(other => {
                    other.checked = false;
                });
                this.checked = true;
                var row = this.closest("tr");
                var selectedType = row.children[1].innerText;
                GM_setValue("ymConfig", selectedType);
            });

        });

        const selectedValue = GM_getValue("ymConfig", null);
        if (selectedValue) {
            checkboxes.forEach(cb => {
                const row = cb.closest("tr");
                const typeText = row.children[1].innerText;
                if (typeText === selectedValue) {
                    cb.checked = true;
                }
            });
        }
    }
    function setStartDelay() {
        var delay = prompt("如遇到【进入页面首个验证码无法自动填充，手动刷新验证码正常填充】的情况，请尝试上调延迟识别时间（单位：毫秒，默认 500ms）", GM_getValue("startDelay", 500));
        if (delay !== null) {
            var delayValue = parseInt(delay);
            if (!isNaN(delayValue) && delayValue >= 0) {
                GM_setValue("startDelay", delayValue);
                topNotice("延迟识别时间已设置为 " + delayValue + " 毫秒，刷新页面生效");
            } else {
                topNotice("请输入有效的非负整数");
            }
        }
    }
    function manageRules() {
        var rules = GM_getValue("captchaRules", []);
        var div = document.createElement("div");
        div.style.cssText = 'width: 700px; height: 350px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; z-index: 9999999999; text-align: center; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); border-radius: 10px; overflow: auto; **color: #000;**';
        div.innerHTML = `
        <h3 style='margin-bottom: 12px; font-weight: bold; font-size: 18px;color: #000;'>规则列表</h3>
        <button style='position: absolute; top: 10px; left: 10px; width: 50px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px;color: #000;' id='import'>导入</button>
        <button style='position: absolute; top: 10px; left: 70px; width: 50px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px;color: #000;' id='export'>导出</button>
        <button style='position: absolute; top: 10px; left: 130px; width: 120px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px;color: #000;' id='deleteall'>删除所有规则</button>
        <table id='ruleList' style='width:100%; border-collapse:collapse; border: 1px solid black;color: #000;'>
          <thead style='background-color: #e0e0e0; color: #000; font-weight: bold;'>
            <tr>
              <th style='text-align: center; padding: 5px;color: #000;'>URL</th>
              <th style='text-align: center; padding: 5px;color: #000;'>p_index</th>
              <th style='text-align: center; padding: 5px;color: #000;'>i_index</th>
              <th style='text-align: center; padding: 5px;color: #000;'>c_type</th>
              <th style='text-align: center; padding: 5px;color: #000;'>操作</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <button style='position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 18px; font-weight: bold; color: #333; background-color: transparent; border: none; outline: none; cursor: pointer;' id='close'>×</button>
        `;
        document.body.insertBefore(div, document.body.firstChild);
        var table = document.getElementById("ruleList").getElementsByTagName('tbody')[0];
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var row = table.insertRow(i);
            row.insertCell(0).innerHTML = "<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>" + rule.url + "</div>";
            row.insertCell(1).innerHTML = rule.img;
            row.insertCell(2).innerHTML = rule.input;
            row.insertCell(3).innerHTML = rule.captchaType;
            var removeBtn = document.createElement("button");
            removeBtn.className = "remove";
            removeBtn.style.cssText = 'background-color: transparent; color: blue; border: none; padding: 5px; font-size: 14px; border-radius: 5px;';
            removeBtn.innerText = "删除";
            row.insertCell(4).appendChild(removeBtn);
        }
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        }

        var remove = document.getElementsByClassName("remove");
        for (var i = 0; i < remove.length; i++) {
            remove[i].onclick = function () {
                var index = this.parentNode.parentNode.rowIndex - 1;
                rules.splice(index, 1);
                GM_setValue("captchaRules", rules);
                this.parentNode.parentNode.remove();
                topNotice("删除规则成功，刷新页面生效");
            }
        }
        var importBtn = document.getElementById("import");
        importBtn.onclick = function () {
            importRules();
            div.remove();
        }
        var exportBtn = document.getElementById("export");
        exportBtn.onclick = function () {
            exportRules();
        }
        var deleteallBtn = document.getElementById("deleteall");
        deleteallBtn.onclick = function () {
            var r = confirm("是否删除所有规则？");
            if (r == true) {
                GM_setValue("captchaRules", []);
                var table = document.getElementById("ruleList").getElementsByTagName('tbody')[0];
                table.innerHTML = "";
                topNotice("删除所有规则成功，刷新页面生效");
            }
        }
    }

    function saveToken() {
        var token = prompt(`帮助文档：https://docs.qq.com/doc/DWkhma0dsb1BxdEtU`, "输入Token");
        if (token == null) {
            return;
        }
        alert("Token保存成功");
        GM_setValue("token", token);
    }

    //手动添加规则（操作）
    function addRule(){
        var ruleData = {"url": window.location.href.split("?")[0], "img": "", "input": "", "inputType": "", "type": "", "captchaType": ""};
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
                var r = confirm("选择验证码类型\n\n数/英验证码请点击“确定”，算术验证码请点击“取消”");
                if (r == true) {
                    ruleData.captchaType = "general";
                }
                else {
                    ruleData.captchaType = "math";
                }
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
            }
        }
    }

    //手动添加规则（请求）
    function addR(ruleData){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: queryUrl+"updateRule",
                data: JSON.stringify(ruleData),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    return resolve(response);
                }
            });
        });
    }

    //删除当前页面规则
    function delRule(){
        var ruleData = {"url": window.location.href.split("?")[0]}
        delR(ruleData).then((res)=>{
            if (res.status == 200)
                topNotice("删除规则成功");
            else
                topNotice("Error，删除规则失败");
        });
    }

    //删除规则（请求）
    function delR(ruleData){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: queryUrl+"deleteRule",
                data: JSON.stringify(ruleData),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    return resolve(response);
                }
            });
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
                            console.log("识别结果：" + result);
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
    }

    function p1(code) {
        if (captchaType == "general" || captchaType == null) {
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
                                console.log("识别结果：" + result);
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
        }
        else if (captchaType == "math") {
            if (GM_getValue("token") == undefined) {
                topNotice("识别算术验证码请先填写云码Token");
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
                        if (response.response["msg"] == "识别成功") {
                            try {
                                var result = response.response["data"]["data"];
                                console.log("识别结果：" + result);
                                return resolve(result);
                            }
                            catch (e) {
                                topNotice(response.response["msg"]);
                            }
                        }
                        else if (response.response["msg"] == "余额不足") {
                            topNotice("云码积分不足，请自行充值");
                        }
                        else {
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

    function compareUrl(){
        return new Promise((resolve, reject) => {
            var datas = {"url": window.location.href};
            GM_xmlhttpRequest({
                method: "POST",
                url: queryUrl+"queryRule",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(datas),
                onload: function(response) {
                    // console.log(response);
                    try {
                        localRules = JSON.parse(response.responseText);
                    }
                    catch(err){
                        localRules = [];
                    }
                    if (localRules.length == 0)
                        return resolve(false);
                    return resolve(true);
                }
            });
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
        var div = document.createElement('div');
        div.id = 'topNotice';
        div.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 5%; z-index: 9999999999; background: rgba(117,140,148,1); display: flex; justify-content: center; align-items: center; color: #fff; font-family: "Microsoft YaHei"; text-align: center;';
        div.innerHTML = msg;
        div.style.fontSize = 'medium';
        document.body.appendChild(div);
        setTimeout(function () {
            document.body.removeChild(document.getElementById('topNotice'));
        }, 3500);
    }

    function manageBlackList() {
        var blackList = GM_getValue("blackList", []);
        var div = document.createElement("div");
        div.style.cssText = 'width: 700px; height: 350px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; z-index: 9999999999; text-align: center; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); border-radius: 10px; overflow: auto;';
        div.innerHTML = "<h3 style='margin-bottom: 12px; font-weight: bold; font-size: 18px;'>黑名单</h3><button style='position: absolute; top: 10px; left: 10px; width: 50px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px' id='add'>添加</button><table id='blackList' style='width:100%; border-collapse:collapse; border: 1px solid black;'><thead style='background-color: #f5f5f5;'><tr><th style='width: 80%; text-align: center; padding: 5px;'>字符串</th><th style='width: 20%; text-align: center; padding: 5px;'>操作</th></tr></thead><tbody></tbody></table><button style='position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 18px; font-weight: bold; color: #333; background-color: transparent; border: none; outline: none; cursor: pointer;' id='close'>×</button>";
        document.body.insertBefore(div, document.body.firstChild);
        var table = document.getElementById("blackList").getElementsByTagName('tbody')[0];
        for (var i = 0; i < blackList.length; i++) {
            var row = table.insertRow(i);
            row.insertCell(0).innerHTML = "<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>" + blackList[i] + "</div>";
            var removeBtn = document.createElement("button");
            removeBtn.className = "remove";
            removeBtn.style.cssText = 'background-color: transparent; color: blue; border: none; padding: 5px; font-size: 14px; border-radius: 5px;';
            removeBtn.innerText = "移除";
            row.insertCell(1).appendChild(removeBtn);
        }
        var close = document.getElementById("close");
        close.onclick = function () {
            div.remove();
        }
        var add = document.getElementById("add");
        add.onclick = function () {
            var zz = prompt("请输入一个字符串，任何URL中包含该字符串的网页都将被加入黑名单");
            if (zz == null) return;
            var blackList = GM_getValue("blackList", []);
            if (blackList.indexOf(zz) == -1) {
                blackList.push(zz);
                GM_setValue("blackList", blackList);
                var row = table.insertRow(table.rows.length);
                row.insertCell(0).innerHTML = "<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>" + zz + "</div>";
                var removeBtn = document.createElement("button");
                removeBtn.className = "remove";
                removeBtn.style.cssText = "background-color: transparent; color: blue; border: none; padding: 5px; font-size: 14px; border-radius: 5px; cursor: pointer; ";
                removeBtn.innerText = "移除";
                row.insertCell(1).appendChild(removeBtn);
                removeBtn.onclick = function () {
                    var index = this.parentNode.parentNode.rowIndex - 1;
                    blackList.splice(index, 1);
                    GM_setValue("blackList", blackList);
                    this.parentNode.parentNode.remove();
                }
                topNotice("添加黑名单成功，刷新页面生效")
            }
            else {
                topNotice("该网页已在黑名单中");
            }
        }
        var remove = document.getElementsByClassName("remove");
        for (var i = 0; i < remove.length; i++) {
            remove[i].onclick = function () {
                var index = this.parentNode.parentNode.rowIndex - 1;
                blackList.splice(index, 1);
                GM_setValue("blackList", blackList);
                this.parentNode.parentNode.remove();
                topNotice("移除黑名单成功，刷新页面生效");
            }
        }
    }

    console.log("【自动识别填充验证码】正在运行...");

    var url = window.location.href;
    var blackList = GM_getValue("blackList", []);
    var inBlack = blackList.some(function (blackItem) {
        return url.includes(blackItem);
    });
    if (inBlack) {
        console.log("【自动识别填充验证码】当前页面在黑名单中");
        return;
    } else {
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
            if (inBlack) return;
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
        if (inBlack) return;
        try {
            if (element.tagName != "CANVAS") return;
        }
        catch (err) {
            return;
        }
        var canvasData1 = element.toDataURL();
        setInterval(function () {
            var canvasData2 = element.toDataURL();
            if (canvasData1 != canvasData2) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                canvasData1 = canvasData2;
                pageChange();
            }
        }, 0);
    }, 1000);

    setTimeout(function () {
        if (inBlack) return;
        var tempUrl = window.location.href;
        setInterval(function () {
            if (tempUrl != window.location.href) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                tempUrl = window.location.href;
                start();
            }
        });
    }, 500)
})();