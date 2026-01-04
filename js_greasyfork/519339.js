// ==UserScript==
// @name         【答案显示|自动答题】成都东软学院(大连东软应该也可以)||4S平台试卷答案显示||一键答题
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  进入题目后，右上角会显示题目的答案，照着选就行了
// @author       You
// @match        *://sep.study.neuedu.com/#/paper/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519339/%E3%80%90%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E3%80%91%E6%88%90%E9%83%BD%E4%B8%9C%E8%BD%AF%E5%AD%A6%E9%99%A2%28%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E5%BA%94%E8%AF%A5%E4%B9%9F%E5%8F%AF%E4%BB%A5%29%7C%7C4S%E5%B9%B3%E5%8F%B0%E8%AF%95%E5%8D%B7%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%7C%7C%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/519339/%E3%80%90%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E3%80%91%E6%88%90%E9%83%BD%E4%B8%9C%E8%BD%AF%E5%AD%A6%E9%99%A2%28%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E5%BA%94%E8%AF%A5%E4%B9%9F%E5%8F%AF%E4%BB%A5%29%7C%7C4S%E5%B9%B3%E5%8F%B0%E8%AF%95%E5%8D%B7%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%7C%7C%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义全局变量
    var getData = null;

    // 创建悬浮窗的函数
    function createFloatingWindow() {
        var window = document.createElement('div');
        window.id = 'floatingWindow';
        window.style.position = 'fixed';
        window.style.top = '10px';
        window.style.right = '10px';
        window.style.width = '300px';
        window.style.height = '400px';
        window.style.backgroundColor = 'white';
        window.style.border = '1px solid black';
        window.style.zIndex = '9999';
        window.style.overflow = 'auto';
        document.body.appendChild(window);
        // 添加列表项
        var title = document.createElement('h2');
        title.textContent = '试卷信息';
        window.appendChild(title);
        // 添加提示信息
        var info = document.createElement('p');
        info.textContent = '试卷信息加载中...';
        window.appendChild(info);
        // 题目信息列表
        var list = document.createElement('ul');
        window.appendChild(list);
        // 创建按钮
        var button = document.createElement('button');
        button.textContent = '一键答题';
        button.style.marginTop = '10px';
        button.addEventListener('click', clickAnswerButton);
        window.appendChild(button);
        // 点击关闭按钮的事件
        var closeButton = document.createElement('button');
        closeButton.textContent = '关闭悬浮窗';
        closeButton.style.marginTop = '10px';
        closeButton.style.float = 'right';
        closeButton.addEventListener('click', closeFloatingWindow);
        window.appendChild(closeButton);
        return window;
    }
    
    // 关闭悬浮窗的函数
    function closeFloatingWindow() {
        var floatingWindow = document.getElementById('floatingWindow');
        floatingWindow.parentNode.removeChild(floatingWindow);
    }

    function ansButtonClick(ansPath) {
        setTimeout(() => {
          document.querySelector(ansPath).click();
          callback(">>>"+ansPath);
        }, Math.ceil(Math.random() * 3000));
    }

    // 点击按钮的函数
    function clickAnswerButton() {
        var data = getData;
        //setTimeout(function(){
        for (var type in data['data']){
            for(var question in data['data'][type]['studentPartQuestionList']){
                var questionJson = data['data'][type]['studentPartQuestionList'][question];
                for(var ans in questionJson['selectReferenceAnswerList']){
                    for(var choose in questionJson['questionOptionList']){
                        if(questionJson['selectReferenceAnswerList'][ans] == questionJson['questionOptionList'][choose]['id']){
                            var ansPath = "#questionId"+ questionJson['markId']  +" > div > div:nth-child(2) > div:nth-child(3) > div > label:nth-child("+ String(choose-(-1)) +")";
                            // const startTime = performance.now();
                            // while (performance.now() - startTime < 100) {}                            console.log(ansPath);
                            // document.querySelector(ansPath).click();
                            ansButtonClick(ansPath,(result)=>{
                                console.log(result);
                            })
                        }
                    }
                }
            }
        }
        //},0);
    }

    // 题目列表删除函数
    function removeListInfo() {
        var floatingWindow = document.getElementById('floatingWindow');
        // 将提示更改为'试卷信息已经完成加载'
        var info = floatingWindow.getElementsByTagName('p')[0];
        info.textContent = '试卷信息已经完成加载';
        // 删除列表
        var list = floatingWindow.getElementsByTagName('ul')[0];
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    // 题目列表添加函数
    function addListInfo(data) {
        var floatingWindow = document.getElementById('floatingWindow');
        // 添加一项data到ul末尾 
        var list = floatingWindow.getElementsByTagName('ul')[0];
        var li = document.createElement('li');
        li.textContent = data;
        list.appendChild(li);
        
    }

    // 发起GET请求并处理响应的函数
    function fetchPaperInfo() {
        // 获取当前URL的哈希部分
        var hash = window.location.hash;
        // 去除哈希前的'#'符号
        var hashContent = hash.replace(/^#/, '');
        // 以'/'分割字符串
        var parts = hashContent.split('/');
        // 获取第一项和第二项，注意检查数组长度以避免越界
        var firstPart = parts[2] || ''; // 第一项
        var secondPart = parts[3] || ''; // 第二项
        //console.log('第一项:', firstPart);
        //console.log('第二项:', secondPart);
        var params = 'candidateId='+firstPart+'&arrangementId='+secondPart;
        var token = localStorage.getItem('token'); // 从本地存储中获取Token
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://sep.study.neuedu.com/se-tool-gateway/biz/test/student/test/paper/info?' + params, true);
        xhr.setRequestHeader('Token', token); // 设置请求头中的Token
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                getData = response;
                displayPaperInfo(getData);
            } else if (xhr.readyState == 4) {
                document.getElementById('floatingWindow').innerHTML = 'Failed to fetch data: ' + xhr.status;
            }
        };
        xhr.send();
    }

    // 显示试卷信息的函数
    function displayPaperInfo(data) {
        var testNum = 0;
        removeListInfo();
        for (var type in data['data']){
            addListInfo(data['data'][type]['partName']);
            for(var question in data['data'][type]['studentPartQuestionList']){
                testNum++;
                var questionJson = data['data'][type]['studentPartQuestionList'][question];
                //var result = "题目："+questionJson['stem']+" 答案：";
                var testTitle = questionJson['stem'];
                if(testTitle.length>15){
                    testTitle = testTitle.substring(0,14)+"...";
                }
                addListInfo(testNum+"、题目："+testTitle);
                for(var ans in questionJson['selectReferenceAnswerList']){
                    for(var choose in questionJson['questionOptionList']){
                        if(questionJson['selectReferenceAnswerList'][ans] == questionJson['questionOptionList'][choose]['id']){
                            //result += choose['questionOption']+"</br>";
                            var _listShow = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                            addListInfo(_listShow[choose]+"."+questionJson['questionOptionList'][choose]['questionOption']);
                        }
                    }
                    //console.log(ans);
                }
            }
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        var floatingWindow = createFloatingWindow();
        fetchPaperInfo();
    });
})();