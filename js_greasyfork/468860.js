// ==UserScript==
// @name         自动识别填充网页验证码并提交
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动填充网页中出现的图形验证码
// @author       wupx
// @license      GPL Licence
// @connect      *
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/468860/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81%E5%B9%B6%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/468860/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81%E5%B9%B6%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element, input, imgIndex, canvasIndex, inputIndex, captchaType;
    var localRules = [];
    var queryUrl = "http://captcha.zwhyzzz.top:8092/"
    var exist = false;
    var iscors = false;
    var inBlack = false;
    var firstin = true;

    //添加菜单
    //GM_registerMenuCommand('管理网页黑名单', manageBlackList);

    GM_setValue("preCode", "");

    //判断是否为验证码（预设规则）
    function isCode(){
        if (element.height >= 100 || element.height == element.width){
            return false;
        }
        var attrList = ["id", "title", "alt", "name", "className", "src"];
        var strList = ["code", "Code", "CODE", "captcha", "Captcha", "CAPTCHA", "yzm", "Yzm", "YZM", "check", "Check", "CHECK", "random", "Random", "RANDOM", "veri", "Veri", "VERI", "验证码", "看不清", "换一张"];
        for (var i = 0; i < attrList.length; i++) {
            for (var j = 0; j < strList.length; j++) {
                // var str = "element." + attrList[i];
                var attr = element[attrList[i]];
                if (attr.indexOf(strList[j]) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    //判断是否为验证码输入框（预设规则）
    function isInput(){
        var attrList = ["placeholder", "alt", "title", "id", "className", "name"];
        var strList = ["code", "Code", "CODE", "captcha", "Captcha", "CAPTCHA", "yzm", "Yzm", "YZM", "check", "Check", "CHECK", "random", "Random", "RANDOM", "veri", "Veri", "VERI", "验证码", "看不清", "换一张"];
        for (var i = 0; i < attrList.length; i++) {
            for (var j = 0; j < strList.length; j++) {
                // var str = "input." + attrList[i];
                var attr = input[attrList[i]];
                if (attr.indexOf(strList[j]) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    function canvasRule(){
        setTimeout(function(){
            // console.log(element.toDataURL("image/png"));
            try {
                var code = element.toDataURL("image/png").split("base64,")[1];
                GM_setValue("tempCode", code);
                if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                    // console.log("preCode:" + GM_getValue("preCode"))
                    // console.log("tempCode:" + GM_getValue("tempCode"))
                    GM_setValue("preCode", GM_getValue("tempCode"));
                    p(code).then((ans) => {
                        writeIn1(ans);
                    });
                }
            }
            catch(err){
                canvasRule();
            }
        }, 100);
    }

    //寻找网页中的验证码
    function findCode(k){
        var code = '';
        var codeList = document.getElementsByTagName('img');
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
                    if (firstin){
                        firstin = false;
                        var img = element;
                        if (img.src && img.width != 0 && img.height != 0) {
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0, img.width, img.height);
                            code = canvas.toDataURL("image/png").split("base64,")[1];
                            try{
                                code = canvas.toDataURL("image/png").split("base64,")[1];
                            }
                            catch(err){
                                findCode(i + 1);
                                return;
                            }
                            GM_setValue("tempCode", code);
                            if (GM_getValue("tempCode") != GM_getValue("preCode")) {
                                iscors = isCORS();
                                GM_setValue("preCode", GM_getValue("tempCode"));
                                p(code, i).then((ans) => {
                                    if (ans != ""){
                                        writeIn(ans);
                                    }
                                    else{
                                        findCode(i);
                                    }
                                });
                                return;
                            }
                        }
                        else{
                            findCode(i);
                            return;
                        }
                    }
                    else {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        element.onload = function(){
                            canvas.width = element.width;
                            canvas.height = element.height;
                            ctx.drawImage(element, 0, 0, element.width, element.height);
                            try{
                                code = canvas.toDataURL("image/png").split("base64,")[1];
                            }
                            catch(err){
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

    //寻找网页中的验证码输入框
    function findInput(){
        var inputList = document.getElementsByTagName('input');
        // console.log(inputList);
        for (var i = 0; i < inputList.length; i++) {
            input = inputList[i];
            if (isInput()) {
                return true;
            }
        }
    }

    //寻找网页中的验证码提交框并提交
    function findButton(){
        var button = document.getElementById('verify-captcha-code-submit');
        console.log(button);
        button.click();
    }

    //将识别结果写入验证码输入框（预设规则）
    function writeIn(ans){
        if (findInput()) {
            ans = ans.replace(/\s+/g,"");
            input.value = ans;
            if (typeof(InputEvent)!=="undefined"){
                input.value = ans;
                input.dispatchEvent(new InputEvent('input'));
                var eventList = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
                for (var i = 0; i < eventList.length; i++) {
                    fire(input, eventList[i]);
                }
                input.value = ans;
            }
            else if(KeyboardEvent) {
                input.dispatchEvent(new KeyboardEvent("input"));
            }
            findButton();
        }
    }

    //识别验证码（预设规则）
    function p(code, i){
        return new Promise((resolve, reject) =>{
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
                onload: function(response) {
                    if (response.status == 200) {
                        if (response.responseText.indexOf("触发限流策略") != -1){
                            topNotice(response.response["msg"]);
                        }
                        try{
                            var result = response.response["result"];
                            console.log("识别结果：" + result);
                            return resolve(result);
                        }
                        catch(e){
                            if (response.responseText.indexOf("接口请求频率过高") != -1){
                                topNotice(response.responseText);
                            }
                        }
                    }
                    else {
                        try {
                            if (response.response["result"] == null){
                                findCode(i + 1);
                            }
                            else{
                                console.log("识别失败");
                            }
                        }
                        catch(err){
                            console.log("识别失败");
                        }
                    }
                }
            });
        });
    }

    //判断是否跨域
    function isCORS(){
        try {
            if (element.src.indexOf('http') != -1 || element.src.indexOf('https') != -1) {
                if (element.src.indexOf(window.location.host) == -1) {
                    console.log("检测到当前页面存在跨域问题");
                    return true;
                }
                //console.log("当前页面不存在跨域问题");
                return false;
            }
        }
        catch(err){
            return;
        }
    }

    //将url转换为base64（解决跨域问题）
    function p2(){
        return new Promise((resolve, reject) =>{
            GM_xmlhttpRequest({
                url: element.src,
                method: "GET",
                headers: {'Content-Type': 'application/json; charset=utf-8','path' : window.location.href},
                responseType: "blob",
                onload: function(response) {
                    // console.log(response);
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

    //此段逻辑借鉴Crab大佬的代码，十分感谢
    function fire(element,eventName){
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
        catch (e) {}
    }

    //将识别结果写入验证码输入框（自定义规则）
    function writeIn1(ans){
        ans = ans.replace(/\s+/g,"");
        input.value = ans;
        if (typeof(InputEvent)!=="undefined"){
            input.value = ans;
            input.dispatchEvent(new InputEvent('input'));
            var eventList = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
            for (var i = 0; i < eventList.length; i++) {
                fire(input, eventList[i]);
            }
            FireForReact(input, 'change');
            input.value = ans;
        }
        else if(KeyboardEvent) {
            input.dispatchEvent(new KeyboardEvent("input"));
        }
    }

    //判断当前页面是否存在规则，返回布尔值
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
                    if (localRules.length == 0){
                        return resolve(false);
                    }
                    return resolve(true);
                }
            });
        });
    }

    //开始识别
    function start(){
        compareUrl().then((isExist) => {
            if (isExist) {
                exist = true;
                console.log("【自动识别填充验证码】已存在该网站规则");
                if (localRules["type"] == "img") {
                    captchaType = localRules["captchaType"];
                    imgIndex = localRules["img"];
                    inputIndex = localRules["input"];
                    element = document.getElementsByTagName('img')[imgIndex];
                    input = document.getElementsByTagName('input')[inputIndex];
                    var inputList = document.getElementsByTagName('input');
                    if (inputList[0] && inputList[0].id == "_w_simile") {
                        inputIndex = parseInt(inputIndex) + 1;
                        input = inputList[inputIndex];
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
                    input = document.getElementsByTagName('input')[inputIndex];
                    var inputList = document.getElementsByTagName('input');
                    if (inputList[0] && inputList[0].id == "_w_simile") {
                        inputIndex = parseInt(inputIndex) + 1;
                        input = inputList[inputIndex];
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

    //页面变化执行函数
    function pageChange(){
        if (exist) {
            if (localRules["type"] == "img" || localRules["type"] == null) {
                element = document.getElementsByTagName('img')[imgIndex];
                input = document.getElementsByTagName('input')[inputIndex];
                var inputList = document.getElementsByTagName('input');
                // console.log(inputList);
                if (inputList[0] && inputList[0].id == "_w_simile") {
                    inputIndex = parseInt(inputIndex) + 1;
                    input = inputList[inputIndex];
                }
                // console.log(element);
                // console.log(input);
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
                input = document.getElementsByTagName('input')[inputIndex];
                var inputList = document.getElementsByTagName('input');
                // console.log(inputList);
                if (inputList[0] && inputList[0].id == "_w_simile") {
                    inputIndex = parseInt(inputIndex) + 1;
                    input = inputList[inputIndex];
                }
                // console.log(element);
                // console.log(input);
                iscors = isCORS();
                if (iscors) {
                    p2().then(() => {
                        // console.log(data);
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

    function topNotice(msg){
        var div = document.createElement('div');
        div.id = 'topNotice';
        div.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 5%; z-index: 9999999999; background: rgba(117,140,148,1); display: flex; justify-content: center; align-items: center; color: #fff; font-family: "Microsoft YaHei"; text-align: center;';
        div.innerHTML = msg;
        div.style.fontSize = 'medium';
        document.body.appendChild(div);
        setTimeout(function(){
            document.body.removeChild(document.getElementById('topNotice'));
        }, 3500);
    }

    function manageBlackList(){
        var blackList = GM_getValue("blackList", []);
        var div = document.createElement("div");
        div.style.cssText = 'width: 700px; height: 350px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; z-index: 9999999999; text-align: center; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); border-radius: 10px; overflow: auto;';
        div.innerHTML = "<h3 style='margin-bottom: 12px; font-weight: bold; font-size: 18px;'>网页黑名单</h3><button style='position: absolute; top: 10px; left: 10px; width: 100px; height: 30px; line-height: 30px; text-align: center; font-size: 13px; margin: 10px' id='add'>添加当前页面</button><table id='blackList' style='width:100%; border-collapse:collapse; border: 1px solid black;'><thead style='background-color: #f5f5f5;'><tr><th style='width: 80%; text-align: center; padding: 5px;'>网址</th><th style='width: 20%; text-align: center; padding: 5px;'>操作</th></tr></thead><tbody></tbody></table><button style='position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 18px; font-weight: bold; color: #333; background-color: transparent; border: none; outline: none; cursor: pointer;' id='close'>×</button>";
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
        close.onclick = function(){
            div.remove();
        }
        var add = document.getElementById("add");
        add.onclick = function(){
            var cf = confirm("黑名单中的网页将不会自动识别验证码\n确定要将当前页面加入黑名单吗？");
            if (cf == true) {
                var blackList = GM_getValue("blackList", []);
                var url = window.location.href.split("?")[0];
                if (blackList.indexOf(url) == -1) {
                    blackList.push(url);
                    GM_setValue("blackList", blackList);
                    var row = table.insertRow(table.rows.length);
                    row.insertCell(0).innerHTML = "<div style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>" + url + "</div>";
                    var removeBtn = document.createElement("button");
                    removeBtn.className = "remove";
                    removeBtn.style.cssText = "background-color: transparent; color: blue; border: none; padding: 5px; font-size: 14px; border-radius: 5px; cursor: pointer; ";
                    removeBtn.innerText = "移除";
                    row.insertCell(1).appendChild(removeBtn);
                    removeBtn.onclick = function(){
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
            else {
                return;
            }
        }
        var remove = document.getElementsByClassName("remove");
        for (var i = 0; i < remove.length; i++) {
            remove[i].onclick = function(){
                var index = this.parentNode.parentNode.rowIndex - 1;
                blackList.splice(index, 1);
                GM_setValue("blackList", blackList);
                this.parentNode.parentNode.remove();
                topNotice("移除黑名单成功，刷新页面生效");
            }
        }
    }

    console.log("【自动识别填充验证码】正在运行...");

    //检查黑名单
    var blackList = GM_getValue("blackList", []);
    var url = window.location.href.split("?")[0];
    if (blackList.indexOf(url) != -1) {
        console.log("【自动识别填充验证码】当前页面在黑名单中");
        inBlack = true;
        return;
    }
    else start();

    var imgSrc = "";
    //监听页面变化
    setTimeout(function(){
        const targetNode = document.body;
        const config = { attributes:true, childList: true, subtree: true};
        const callback = function() {
            if (inBlack) return;
            try {
                if (iscors){
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
            catch(err) {
                return;
                // pageChange();
            }
        }
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }, 1000);

    //监听canvas变化
    setTimeout(function(){
        if (inBlack) return;
        try {
            if (element.tagName != "CANVAS") return;
        }
        catch(err) {
            return;
        }
        var canvasData1 = element.toDataURL();
        setInterval(function(){
            var canvasData2 = element.toDataURL();
            if (canvasData1 != canvasData2) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                canvasData1 = canvasData2;
                pageChange();
            }
        }, 0);
    }, 1000);

    //监听url变化
    setTimeout(function(){
        if (inBlack) return;
        var tempUrl = window.location.href;
        setInterval(function(){
            if (tempUrl != window.location.href) {
                console.log("【自动识别填充验证码】页面/验证码已更新，正在识别...");
                tempUrl = window.location.href;
                start();
            }
        });
    }, 500)
})();