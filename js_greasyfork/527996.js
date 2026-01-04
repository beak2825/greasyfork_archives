// ==UserScript==
// @name         选课刷新
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  自动刷新
// @author       You
// @match        http://yjsxk.fudan.sh.cn/*
// @match        http://yjsxk.fudan.sh.cn/yjsxkapp/sys/xsxkappfudan/xsxkHome/gotoChooseCourse.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527996/%E9%80%89%E8%AF%BE%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527996/%E9%80%89%E8%AF%BE%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    let CLASSTYPE = 4;//1 英语 2 低功耗 0 测试 3 可测试 4低功耗
    let choice1;
    let choice2;
    let grid;
    let position;
    let code;
    if(CLASSTYPE==1){
        choice1 = 'a#xkkctab_7';
        choice2 = 'li[tabwid="3"]';
        grid = '#grid_ggkc_3';
        position = 0;
        code = 'MAST612156';
    }else if(CLASSTYPE==2){
        choice1 = 'a#xkkctab_8';
        choice2 = 'li[tabwid="5"]';
        grid = '#grid_xwzyk_5';
        position = 1;
        code = 'SME620002';
    }else if(CLASSTYPE==0){
        choice1 = 'a#xkkctab_8';
        choice2 = 'li[tabwid="6"]';
        grid = '#grid_xwzyk_6';
        position = 1;
        code = 'AIT531028';
    }else if(CLASSTYPE==3){
        choice1 = 'a#xkkctab_8';
        choice2 = 'li[tabwid="5"]';
        grid = '#grid_xwzyk_5';
        position = 1;
        code = 'INFO630030';
    }else if(CLASSTYPE==3){
        choice1 = 'a#xkkctab_8';
        choice2 = 'li[tabwid="5"]';
        grid = '#grid_xwzyk_5';
        position = 1;
        code = 'SME620002';
    }
    console.log(window.location.href);
    if (currentUrl.includes('yjsxk.fudan.sh.cn/yjsxkapp/sys/xsxkappfudan/xsxkHome/gotoChooseCourse.do')) {

    // 定义变量来跟踪点击状态和加载状态
    let firstElementClicked = false; // 是否点击了第一个元素
    let secondElementClicked = false;

    // 定义函数点击第一个元素
    function clickFirstElement() {
        const firstElement = document.querySelector(choice1); // 7：公选 8：专业
        if (firstElement) {
            firstElement.click();
            firstElementClicked = true; // 标记第一个元素已点击
            console.log('First element clicked');
        } else {
            console.log('First element not found');
        }
    }

    // 定义函数点击第二个元素
    function clickSecondElement() {
        const secondElement = document.querySelector(choice2); // 3：外语 5：专业
        if (secondElement) {
            secondElement.click();
            //secondElementClicked = true;
            console.log('Second element clicked');
        } else {
            console.log('Second element not found');
        }
    }

    // 定时检查页面加载状态并点击第一个元素
    let click1=setInterval(function() {
        if ( !firstElementClicked) {
            // 如果页面尚未加载或第一个元素尚未点击，点击第一个元素
            clickFirstElement();
        }
    }, 100); // 每秒检查一次

    // 使用 MutationObserver 来确保页面加载完成后再执行第二次点击
    let click2=setInterval(function() {
        // 如果第一个元素已点击且页面加载完成，点击第二个元素
        if (firstElementClicked && !secondElementClicked) {
            clickSecondElement();
        }
    }, 90); // 每秒检查一次

    let refresh=setInterval(function() {
        location.reload(); // 自动刷新页面
    }, 500); // 每5秒刷新一次页面
    // 目标课程代码
    const targetCourseCode = code; // MAST612156 英语

    // 检查并点击选课按钮
    function checkAndClick() {
        const container = document.querySelector(grid); // 找到包裹表格的容器 grid_xwzyk_6选修
        const table = container.querySelector('table'); // 找到表格
        let rows = table.querySelectorAll('tbody tr'); // 获取所有行
        console.log(rows.length);
        // 获取表格主体中的所有<tr>行
       //const rows = document.querySelectorAll('tbody#tbody_a6d8d8132ae946b0b4dc47521a95ef5e tr');
        rows.forEach(row => {
            // 查找课程代码所在的第二列<td>
            const courseCodeCell = row.children[position]; // 英语：0 专业：1 假设课程代码在第2列
            const courseCode = courseCodeCell ? courseCodeCell.innerText.trim() : '';

            // 判断是否为目标课程代码
            if (courseCode === targetCourseCode) {
                 console.log('find');
                // 查找该行中的状态 <span> 元素
                const statusSpan = row.querySelector('td span');
                if (statusSpan) {
                    const status = statusSpan.innerText.trim();
                    // 如果状态是“未满”，则找到并点击选课按钮
                    if (status === '未满') {
                        const button = row.querySelector('a.xkbtn');
                        if (button) {
                            // 点击选课按钮
                            button.click();

                            // 播放铃声提示
                            let audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                            audio.autoplay = true;
                            audio.loop = true;
                            audio.play().catch(err => {
                                console.log("播放失败：", err);
                            });
                            clearInterval(click1);
                            clearInterval(click2);
                            clearInterval(refresh);
                            clearInterval(check);
                            setTimeout(function() {
                                const confirmButton = document.querySelector('.zeromodal-btn-primary');
                                if (confirmButton) {
                                    const mouseEvent = new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    });
                                    confirmButton.dispatchEvent(mouseEvent);
                                    console.log('已模拟点击确定按钮');
                                }
                            }, 1500);

                        }
                    }
                }
            }
        });
    }

    // 每隔5秒检查一次
    let check=setInterval(checkAndClick, 50);}
    else{
        let audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                            audio.autoplay = true;
                            audio.loop = true;
                            audio.play().catch(err => {
                                console.log("播放失败：", err);
                            });
    }
})();