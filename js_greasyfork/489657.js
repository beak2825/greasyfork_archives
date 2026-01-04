// ==UserScript==
// @name         前程无忧(51job)批量投简历
// @namespace    http://tampermonkey.net/
// @version      5.3.5
// @description  前程无忧(51job)批量投简历。在页面左下角点击按钮进行复选/批量投递/附加信息
// @author       临终关怀
// @match        https://we.51job.com/*
// @match        https://jobs.51job.com/applysuccess*
// @run-at       document-idle
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489657/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%2851job%29%E6%89%B9%E9%87%8F%E6%8A%95%E7%AE%80%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/489657/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%2851job%29%E6%89%B9%E9%87%8F%E6%8A%95%E7%AE%80%E5%8E%86.meta.js
// ==/UserScript==

//2025/02/04测试正常

(function() {
    'use strict';

    // console.log(window.location.search)
    let currentpath = window.location.pathname // /pc/search  /applysuccess.php

    // 创建附加信息按钮元素
//     var sensorsbutton = document.createElement('button');
//     sensorsbutton.innerHTML = '附加信息'; // 按钮文本
//     sensorsbutton.style.position = 'fixed';
//     sensorsbutton.style.bottom = '24%'; // 距离底部的距离
//     sensorsbutton.style.left = '10px'; // 距离左侧的距离
//     sensorsbutton.style.zIndex = '9999';
//     sensorsbutton.style.backgroundColor = '#0DBB4A';
//     sensorsbutton.style.borderRadius = '4px'
//     sensorsbutton.style.color = 'white'
//     sensorsbutton.style.padding = '4px 8px';//上下4px 左右8px

    // 创建全选按钮元素
    var checkbutton = document.createElement('button');
    checkbutton.innerHTML = '全选/反选'; // 按钮文本
    checkbutton.style.position = 'fixed';
    checkbutton.style.bottom = '15%'; // 距离底部的距离
    checkbutton.style.left = '10px'; // 距离左侧的距离
    checkbutton.style.zIndex = '9999';
    checkbutton.style.backgroundColor = '#ff6000';
    checkbutton.style.borderRadius = '4px'
    checkbutton.style.color = 'white'
    checkbutton.style.padding = '4px 8px';//上下4px 左右8px

    // 创建投递按钮元素
    var submitbutton = document.createElement('button');
    submitbutton.innerHTML = '投递所选的'; // 按钮文本
    submitbutton.style.position = 'fixed';
    submitbutton.style.bottom = '10%'; // 距离底部的距离
    submitbutton.style.left = '10px'; // 距离左侧的距离
    submitbutton.style.zIndex = '9999';
    submitbutton.style.backgroundColor = '#ff6000';
    submitbutton.style.borderRadius = '4px'
    submitbutton.style.color = 'white'
    submitbutton.style.padding = '4px 8px';//上下4px 左右8px

    // 创建按钮元素
    var button = document.createElement('button');
    button.innerHTML = '一键本页全投'; // 按钮文本
    button.style.position = 'fixed';
    button.style.bottom = '2%'; // 距离底部的距离
    button.style.left = '10px'; // 距离左侧的距离
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'red';
    button.style.borderRadius = '4px'
    button.style.color = 'white'
    button.style.padding = '4px 8px';//上下4px 左右8px


    // 将按钮添加到页面中
//     document.body.appendChild(sensorsbutton);
    document.body.appendChild(checkbutton);
    document.body.appendChild(submitbutton);
    document.body.appendChild(button);

    // 全选/取消全选
    checkbutton.addEventListener('click', function() {
        var element = null;
        for (let i = 1; i <= 20; i++) {
            // 多选框
            if(currentpath=="/pc/search"){
                element = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.joblist > div:nth-child(${i}) > div > div > div.ick`);
            }else if(currentpath=="/applysuccess.php"){
                element = document.querySelector(`#similar > div.j_joblist > div:nth-child(${2*i-1}) > div.e_icons.ick`);
            }else{

            }
            if(element == null){
                console.log("element节点有误，没找到复选框");
                continue;
            }
            // 创建一个鼠标点击事件
            var innerEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            // 触发点击事件
            element.dispatchEvent(innerEvent);
        }
    });


    // 投递所选的
    submitbutton.addEventListener('click', function() {
        var btn = null;
        if(currentpath=="/pc/search"){
            btn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.j_tabs.ftop > div > div > button:nth-child(2)`);
        }else if(currentpath=="/applysuccess.php"){
            btn = document.querySelector(`#similar > div.j_tabs.ftop > div > div > button:nth-child(2)`);
        }else{

        }

        if(btn != null) {
            console.log("找到提交按钮")
            var btnEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            btn.dispatchEvent(btnEvent);
            // 关闭弹窗
            setTimeout(function() {
                var closeElement = null;
                if(currentpath=="/pc/search"){
                    closeElement = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.van-popup.van-popup--center > i`);
                }else if(currentpath=="/applysuccess.php"){
                    closeElement = document.querySelector(`#window_close_apply > i`);
                }else{

                }
                if(closeElement != null) {
                    console.log("找到关闭按钮")
                    var innerEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    closeElement.dispatchEvent(innerEvent);
                }
            },3000);
        }
        //下一页
        setTimeout(function() {
            var nextBtn = null;
            if(currentpath=="/pc/search"){
                nextBtn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.bottom-page > div > div > div > button.btn-next`);
            }else if(currentpath=="/applysuccess.php"){
                nextBtn = document.querySelector(`#similar > div.j_page > div > div > div > ul > li.next > a`);
            }else{

            }
            var nextEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            nextBtn.dispatchEvent(nextEvent);
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        },4000);
    });


    // 绑定按钮点击事件
    button.addEventListener('click', function() {
        var element = null;
        for (let i = 1; i <= 20; i++) {
            // 多选框
            if(currentpath=="/pc/search"){
                element = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.joblist > div:nth-child(${i}) > div > div > div.ick`);
            }else if(currentpath=="/applysuccess.php"){
                element = document.querySelector(`#similar > div.j_joblist > div:nth-child(${2*i-1}) > div.e_icons.ick`);
            }else{

            }
            if(element == null){
                console.log("element节点有误，没找到复选框");
                continue;
            }
            // 创建一个鼠标点击事件
            var innerEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            // 触发点击事件
            element.dispatchEvent(innerEvent);
        }

        // 延迟3秒后执行按钮点击
        setTimeout(function() {
            // 按钮点击
            var btn = null;
            if(currentpath=="/pc/search"){
                btn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.j_tabs.ftop > div > div > button:nth-child(2)`);
            }else if(currentpath=="/applysuccess.php"){
                btn = document.querySelector(`#similar > div.j_tabs.ftop > div > div > button:nth-child(2)`);
            }else{

            }
            if(btn != null) {
                console.log("找到提交按钮")
                var btnEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                btn.dispatchEvent(btnEvent);
                // 关闭弹窗
                setTimeout(function() {
                    var closeElement = null;
                    if(currentpath=="/pc/search"){
                        closeElement = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.van-popup.van-popup--center > i`);
                    }else if(currentpath=="/applysuccess.php"){
                        closeElement = document.querySelector(`#window_close_apply > i`);
                    }else{

                    }
                    if(closeElement != null) {
                        console.log("找到关闭按钮")
                        var innerEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        closeElement.dispatchEvent(innerEvent);
                    }
                },3000);
            }
            //下一页
            setTimeout(function() {
                var nextBtn = null;
                if(currentpath=="/pc/search"){
                    nextBtn = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.bottom-page > div > div > div > button.btn-next`);
                }else if(currentpath=="/applysuccess.php"){
                    nextBtn = document.querySelector(`#similar > div.j_page > div > div > div > ul > li.next > a`);
                }else{

                }
                var nextEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                nextBtn.dispatchEvent(nextEvent);
                document.documentElement.scrollTop = document.documentElement.scrollHeight;
            },4000);
        }, 1000);
    });


    function displayAttachInfo() {
        for (let i = 1; i <= 20; i++) {
            let sensorsElement = null;
            if(currentpath=="/pc/search"){
                sensorsElement = document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div:nth-child(2) > div.joblist > div:nth-child(${i}) > div > div[sensorsname]`);
            }else if(currentpath=="/applysuccess.php"){
                sensorsElement = document.querySelector(`#similar > div.j_joblist > div:nth-child(${2*i-1}) > a > div[sensorsname]`);
            }else{

            }
            if (!sensorsElement) {
                continue; // 如果找不到对应的元素则跳过
                console.log("没有找到带数据的节点")
            }
            let jsonObject = JSON.parse(sensorsElement.getAttribute("sensorsdata"));
            let jobListItemTopElements = null;//挂载的父节点
            if(currentpath=="/pc/search"){
                jobListItemTopElements = sensorsElement.querySelector('.joblist-item-top');
            }else if(currentpath=="/applysuccess.php"){
                jobListItemTopElements = document.querySelector(` #similar > div.j_joblist > div:nth-child(${2*i-1}) > a > p`);
            }else{

            }
            let attachInfoSpan = jobListItemTopElements.querySelector('.custom-attach-span'); // 新增: 查询是否已存在attach span

            // 如果时间span不存在，则创建并追加
            if (!attachInfoSpan) {
                let attachInfoSpan = document.createElement('span');
                attachInfoSpan.classList.add('custom-attach-span'); // 新增: 添加特定类名
                let displayContent = "";
                if(currentpath=="/pc/search" && Boolean(jsonObject.jobDegree)){
                    displayContent = displayContent + jsonObject.jobDegree+" | ";
                }
                if(currentpath=="/pc/search" && Boolean(jsonObject.jobYear)){
                    displayContent = displayContent + jsonObject.jobYear+" | ";
                }
                if(Boolean(jsonObject.jobTime)){
                    displayContent = displayContent + jsonObject.jobTime+"发布更新";
                }
                attachInfoSpan.textContent = displayContent;
                attachInfoSpan.style.color = '#2AC08E';// 0DBB4A
                attachInfoSpan.style.fontSize = '13px';
                attachInfoSpan.style.fontWeight = 600;
                attachInfoSpan.style.marginLeft = '16px';
                jobListItemTopElements.appendChild(attachInfoSpan);
            }
        }
    }

//     sensorsbutton.addEventListener('click', displayAttachInfo);


    // MutationObserver 来监听DOM的变化。这在页面资源加载后，但内容仍在动态更新时特别有用
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                console.log('DOM has been modified');
                // Your code here
                displayAttachInfo();
            }
        });
    });

    // Configuration of the observer:
    const config = { attributes: true, childList: true, subtree: true };

    // Pass in the target node, as well as the observer options
    observer.observe(document.body, config);

    // Later, you can stop observing
    // observer.disconnect();
})();