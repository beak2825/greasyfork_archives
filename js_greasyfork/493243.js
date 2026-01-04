// ==UserScript==
// @name         华信永道
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  hx相关脚本
// @author       You
// @license      MIT
// @match        http://172.29.11.150:8088/*
// @match        http://172.29.10.105:8080/jenkins/job/*/console*
// @match        http://10.127.22.12:8000/index
// @match        https://10.127.96.131:8443/*
// @match        http://10.127.96.5/yulin*
// @match        http://192.168.1.105:8890/
// @match        http://progitlab.pro.hxyd.tech/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10.105
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/493243/%E5%8D%8E%E4%BF%A1%E6%B0%B8%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/493243/%E5%8D%8E%E4%BF%A1%E6%B0%B8%E9%81%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href //网页url
    // 创建一个 URL 对象
    var urlObj = new URL(url);
    var params = new URLSearchParams(urlObj.search);
    let rebuild = params.get("rebuild")
    let autoRebuild = params.get("autoRebuild")
    // 自动重构
    if(rebuild && rebuild === "true"){
        checkElement('li.merge-request.merged a').then(function(sourceBranch) {
            let aTag = document.querySelector('li.merge-request.merged a').href.split('/');
            let id = aTag[aTag.length-1]
            // 要复制的内容
            var textToCopy = "Jenkins rebuild";
            window.location.href = "http://progitlab.pro.hxyd.tech/g09120/wish/"+url.split("/")[5]+"/merge_requests/"+id + "?autoRebuild=" + textToCopy
        })
    }
    if(autoRebuild){
        checkElement('#note-body').then(function(textarea) {
            console.log(textarea)
            textarea.value = autoRebuild
            // 创建并触发 input 事件
            var event = new Event('input', { bubbles: true, cancelable: true, });
            textarea.dispatchEvent(event);
        })
    }
    // 华信jenkins-m-bs
    if (url.includes('172.29.10.105:8080/jenkins')){
        huaxinJenkinsScript()
    }
    // 镜像同步工具
    if (url.includes("http://10.127.22.12:8000/index")){
        huaxinJenkinsScriptV2(url);
    }
    // git增加合并按钮
    if (url == "http://progitlab.pro.hxyd.tech/"){
        gitAddButton();
    }
    // git自动选择分支
    if (url.includes("progitlab.pro.hxyd.tech/g09120")){
        searchBranch();
    }
    // 工艺平台
    //if (url.includes("http://172.29.11.150:8088/")){
        //reloadSetTime();
    //}
    // 柜面
    //if (url.includes("http://10.127.96.5/yulin")){
        //reloadYulin()
    //}
})();

function reloadYulin(){
    // 刷新时间间隔，设置为30分钟（1800000毫秒）
    var refreshInterval = 600000;
    var timeoutID;

    // 重置定时器函数
    function resetTimer() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            document.querySelector('a[href="#/arrange/page/menu/M0378/"]').click();
            checkElement("div.btn-groups > button.ant-btn.ant-btn-primary").then(function(button){
                button.click()
            })
        }, refreshInterval);
    }

    // 监听用户的操作事件
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchmove', resetTimer);

    // 初始化定时器
    resetTimer();
}

function reloadSetTime(){
    // 刷新时间间隔，设置为30分钟（1800000毫秒）
    var refreshInterval = 600000;

    var timeoutID;

    // 重置定时器函数
    function resetTimer() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            // location.reload();
            let serverButton = document.querySelector('a[title="服务"]');
            if (!serverButton){
                document.querySelector('a[title="程序管理"]').click();
            }
            checkElement('a[title="服务"]').then(function(button){
                button.click()
            })
            checkElement('button#query').then(function(query){
                query.click()
            })
        }, refreshInterval);
    }

    // 监听用户的操作事件
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchmove', resetTimer);

    // 初始化定时器
    resetTimer();
}

// 定义一个检查元素存在的函数
function checkElement(selector) {
    return new Promise(function(resolve, reject) {
        var interval = setInterval(function() {
            if (document.querySelector(selector)) {
                clearInterval(interval); // 如果找到了元素，清除定时器
                GM_log("成功找到元素")
                resolve(document.querySelector(selector)); // 返回找到的元素
            }
        }, 500); // 每500ms检查一次
    });
}

// git自动选择分支
function searchBranch(){
    checkElement(".dropdown-menu-toggle.js-compare-dropdown.js-source-branch.monospace").then(function(sourceBranch) {
        // 源分支
        sourceBranch.click();
        return checkElement("#new_merge_request > div.js-merge-request-new-compare.row > div:nth-child(1) > div > div.card-body.clearfix > div.merge-request-select.dropdown.show > div > div.dropdown-content");
    }).then(function(e){
        let liList = document.querySelectorAll("#new_merge_request > div.js-merge-request-new-compare.row > div:nth-child(1) > div > div.card-body.clearfix > div.merge-request-select.dropdown.show > div > div.dropdown-content > ul > li")
        for(var i = 0; i < liList.length; i++){
            let item = liList[i]
            if (item.innerText == "develop"){
                item.getElementsByTagName("a")[0].click();
                break;
            }
        }
        return checkElement(".dropdown-menu-toggle.js-compare-dropdown.js-target-branch.monospace");
    }).then(function(targetBranch){
        // 目标分支
        targetBranch.click();
        return checkElement("#new_merge_request > div.js-merge-request-new-compare.row > div:nth-child(2) > div > div.card-body.clearfix > div.merge-request-select.dropdown.show > div > div.dropdown-content");
    }).then(function(e){
        let liList = document.querySelectorAll("#new_merge_request > div.js-merge-request-new-compare.row > div:nth-child(2) > div > div.card-body.clearfix > div.merge-request-select.dropdown.show > div > div.dropdown-content > ul > li")
        for(var i = 0; i < liList.length; i++){
            let item = liList[i]
            if (item.innerText == "release"){
                item.getElementsByTagName("a")[0].click();
                break;
            }
        }
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

// git增加合并按钮
function gitAddButton(){
    checkElement(".d-flex.project-row").then(function(e){
        var list = document.getElementsByClassName("d-flex project-row")
        for(var i = 0; i < list.length; i++){
            let item = list[i]
            let projectName = item.getElementsByClassName("project-name")[0].innerText
            var myButton = document.createElement("button");
            myButton.style.cssText = "background-color: #E0F2F1; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;margin-left: 20px;";
            myButton.innerHTML ="合并";
            myButton.disabled = false;
            myButton.addEventListener("click", function(){
                window.location.href = "http://progitlab.pro.hxyd.tech/g09120/wish/" + projectName + "/merge_requests/new"
            });
            item.appendChild(myButton);

            var myButton1 = document.createElement("button");
            myButton1.style.cssText = "background-color: #E0F2F1; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;margin-left: 20px;";
            myButton1.innerHTML ="重构";
            myButton1.disabled = false;
            myButton1.addEventListener("click", function(){
                window.location.href = "http://progitlab.pro.hxyd.tech/g09120/wish/" + projectName + "/merge_requests?scope=all&utf8=✓&state=merged&rebuild=true"
            });
            item.appendChild(myButton1);
        }
    });
}

// 镜像同步工具
function huaxinJenkinsScriptV2(url){
    var intervalId = setInterval(() => {
        var syncBtn = document.getElementById('syn')
        var urlArr = url.split('#')
        if (syncBtn){
            clearInterval(intervalId);
            GM_log(urlArr)
            if (urlArr.length > 1){
                var sourceInput = document.getElementById('OldImage')
                var targetInput = document.getElementById('NewImage')
                sourceInput.value = urlArr[1]
                targetInput.value = urlArr[1].replace('reg.yondervision.com.cn:8081','10.127.22.12:8081')
            }
            // 增加k8s按钮
            var btnDiv = document.getElementsByClassName("col-md-2")[2]

            var testButton = syncBtn.cloneNode(true);
            testButton.innerHTML ="测试k8s ";
            testButton.addEventListener("click",function(){
                var suffixStr = extractAndModifyString(urlArr[1])
                GM_log(suffixStr)
                window.open('https://10.127.96.131:8443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/search?namespace=uat&q=' + suffixStr);
            });
            btnDiv.appendChild(testButton);

            // 复制一个生产按钮
            var prodButton = syncBtn.cloneNode(true);
            prodButton.innerHTML = "生产k8s";
            // 给复制按钮添加新的事件处理器
            prodButton.addEventListener('click', function() {
                var suffixStr = extractAndModifyString(urlArr[1])
                GM_log(suffixStr)
                window.open('https://10.127.96.5:8443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/search?namespace=yulin-pro&q=' + suffixStr);
            });
            btnDiv.appendChild(prodButton);
        }
    }, 1000);
}

// 华信jenkins脚本
function huaxinJenkinsScript(){
    var delFlag = false
    var intervalId = setInterval(() => {
        let content = document.querySelector('#out').innerText
        console.log(content)
        let succFlag = content.endsWith("Finished: SUCCESS\n")
        console.log(succFlag)
        // 分割字符串为行数组
        var lines = content.split('\n');
        // 查找以 "asdf" 开头的行
        var matchingLines = lines.filter(function(line) {
            return line.startsWith('+ docker push reg.yondervision.com.cn:8081') || line.startsWith('Successfully tagged reg.yondervision.com.cn:8081');
        });
        console.log(matchingLines)
        let targetStr = matchingLines[0].replaceAll('+ docker push ', '').replaceAll("Successfully tagged ","");
        // 输出匹配的行
        console.log(targetStr);
        window.location.href = 'http://10.127.22.12:8000/index#' + targetStr;
        if (succFlag){
            clearInterval(intervalId);
        }
    }, 1000);
}

function extractAndModifyString(inputString) {
    GM_log(inputString)
    const regex = /\/([^/]+)-[^:/]+/;
    const match = inputString.match(regex);
    GM_log('res=== ' + match)
    if (match) {
        return match[1]
    } else {
        return null; // 如果没有匹配到，返回null或其他默认值
    }
}
