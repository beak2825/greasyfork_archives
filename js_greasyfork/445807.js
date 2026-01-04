// ==UserScript==
// @name         长安大学教务系统自动评教
// @namespace    https://github.com/zys-chd/CHD__Auto_Evaluate
// @version      0.21
// @description  简单的长安大学教务系统自动评教脚本
// @author       zys
// @match        http://bkjw.chd.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chd.edu.cn
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445807/%E9%95%BF%E5%AE%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445807/%E9%95%BF%E5%AE%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    // 替换原有confirm函数
    unsafeWindow.confirm = (a) => function (a) { console.log(a); return 0 };

    'use strict';

    // 添加按钮设置样式并设置回调函数
    var TampermonkeyButton = document.createElement("button")
    TampermonkeyButton.id = "TampermonkeyButton"
    TampermonkeyButton.textContent = "一键评教"
    TampermonkeyButton.style.width = "120px"
    TampermonkeyButton.style.height = "auto"
    TampermonkeyButton.style.position = "absolute"
    TampermonkeyButton.style.right = "20px"

    TampermonkeyButton.onclick = ThisMain

    document.getElementsByClassName("banner")[0].appendChild(TampermonkeyButton)

})();


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


function ThisMain() {
    check()

    //TODO: 一步到位
    // try {
    //     let hrefList = document.getElementsByClassName("eval"); // 获取每个需要评教的对象如教师名称
    //         if (hrefList.length==0) {
    //             throw TypeError
    //         }
    //         console.log(hrefList.length)
    //         for (let index = 0; index < hrefList.length; index++) {
    //             // console.log("2")
    //             hrefList[index].click()// 点击评教
    //             sleep(1500).then(()=>{
    //                 check()
    //             });
    //             sleep(1500).then(()=>{
                    
    //             })
    //         }
    // } catch (error) {
    //     alert(error)
    // }

    return 0
}


function check() {
    try {
        let judgeOptions = document.getElementsByClassName("option-radio") // 获取所有可以选择的对象如选择框，输入框
        let temp = 0
        for (let i = 0; i < 10; i++) { // 一共十个选择题，每个有5个选项，将他们相应勾选上
            judgeOptions[temp].click()
            temp = temp + 5
        }
        let inputText = document.getElementsByClassName("answer") // 获取所有的填空题的input
        for (let j = 0; j < inputText.length; j++) { // 将填空题的输入区填充为“无”
            inputText[j].value = "无"
        }
        sleep(200).then(() => {
            document.getElementById("sub").click() // 点击提交
        });
    } catch (TypeError) {
        // 若界面未加载或者未进入对应界面则弹出提示
        alert("请进入评教填写界面以进行一键评教！")
    }

    return 0
}
