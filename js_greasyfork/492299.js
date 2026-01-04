// ==UserScript==
// @name         LeetCode自动修正null和None
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  自动根据选择的编程语言修正测试用例的null文本，python自动修改为None，go和swift自动修改为nil，可自行修改代码自定义
// @author       Ozymandias
// @license      MIT
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492299/LeetCode%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%AD%A3null%E5%92%8CNone.user.js
// @updateURL https://update.greasyfork.org/scripts/492299/LeetCode%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%AD%A3null%E5%92%8CNone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function waitForElement(id, callback) {
        const intervalId = setInterval(() => {
            const targetElements = document.querySelectorAll(id)
            if (targetElements.length >0) {
                 targetElements.forEach((targetElement)=>{
                     const targetButton=targetElement.querySelectorAll('button.rounded');
                     if (targetButton!=null){
                         if(targetButton[0]!=null){
                             const textContent = targetButton[0].textContent
                             if(textContent!=null){
                                 const buttonText = textContent.trim().toLowerCase(); // 获取并转换为小写，去除前后空格
                                 if (buttonText!=null &&buttonText!=""){
                                     clearInterval(intervalId);
                                     //console.info("当前使用语言："+buttonText)
                                     callback(buttonText);
                                 }
                             }
                         }
                     }
                 })
            } else {
                console.log("等待按钮组件加载完成中");
            }
        }, 2000); // 延迟时间，以毫秒为单位
    }
    function replaceNullStringsInElfjSElements() {
        waitForElement('[id^="headlessui-popover-button-:r"]', element => {
            const buttonText =element.trim().toLowerCase(); // 获取并转换为小写，去除前后空格
            const targetElements = document.querySelectorAll('.elfjS pre'); // 选择目标元素
            targetElements.forEach((element) => {
                const currentText = element.textContent || element.innerText; // 获取元素文本内容，兼容不同属性
                if (currentText) {
                    //console.log("currentText:"+currentText)
                    var replacedText=null
                    switch (buttonText){
                        case "python":
                        case "python3":
                            replacedText = currentText.replace(/null/g, 'None'); // 使用正则表达式替换null字符串
                            break
                        case "ruby":
                        case "swift":
                        case "go":
                        case "elixir":
                            replacedText = currentText.replace(/null/g, 'nil'); // 使用正则表达式替换null字符串
                            break
                            //case "erlang":
                            //replacedText = currentText.replace(/null/g, 'undefined'); // 使用正则表达式替换null字符串
                            //break
                        case "racket":
                            replacedText = currentText.replace(/null/g, '#false'); // 使用正则表达式替换null字符串
                            break
                        default:
                            replacedText = currentText
                            break

                    }
                    //console.log("replacedText:"+replacedText)

                    if (element.textContent !== undefined) {
                        element.textContent = replacedText;
                    } else if (element.innerText !== undefined) {
                        element.innerText = replacedText;
                    }
                }

            });
        });


    }


    const targetNode = document.querySelectorAll('html')[0]; // 替换为您的组件容器节点
    const observerOptions = {
        childList: true, // 监听子节点的添加或删除
        subtree: true, // 递归监听目标节点及其所有后代节点
        //attributes: true, //目标节点的属性变化
    };
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // console.log('组件重新渲染');
                // 在这里执行您希望在组件重新渲染时运行的函数
                replaceNullStringsInElfjSElements()
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

    // 当不再需要观察时，记得停止观察并释放资源
    // observer.disconnect();


})();