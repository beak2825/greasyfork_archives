// ==UserScript==
// @name         Twitch auto enter chat-page
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  自動進入 Twitch 聊天室頁面，防止被揪團帶離目標實況主，並可自動導回原實況主頁面
// @author       BeckerSpace
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506034/Twitch%20auto%20enter%20chat-page.user.js
// @updateURL https://update.greasyfork.org/scripts/506034/Twitch%20auto%20enter%20chat-page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定變數
    let redirectEnabled = true; // 是否開啟防揪團功能
    const targetStreamer = "Streamer ID"; // 替換為你的目標實況主帳號
    const checkTimer = 5000 // 自動檢查的秒數

    // 自訂CSS
    const customCSS = {
        toggleButton: {
            color: 'white',
            cursor: 'pointer', // 指标变为手形
            display: 'flex',
            alignItems: 'center', // 水平居中
            justifyContent: 'center', // 垂直居中
            fontWeight: 'bold', // 字体加粗
            marginLeft: '5px', // 与 Twitch 标志之间的间距
            whiteSpace: 'nowrap' // 防止文字折行
        },
        label: {
            fontSize: '12px'
        },
        status: {
            fontSize: '20px',
            backgroundColor: 'green', // 初始背景颜色为绿色
            width: '25px', // 设置宽度
            height: '25px', // 设置高度
            display: 'flex', // 使用 flex 使内容居中
            alignItems: 'center', // 垂直居中
            justifyContent: 'center', // 水平居中
            borderRadius: '5px' // 增加圆角
        }
    }

    // 防揪團開關
    function redirectEnabledToggleBtn(){
        // 檢查按鈕是否已存在，避免重複創建
        if (document.querySelector('#redirect-toggle-button')) return;

        // 創建一個新的 div 元素作為按鈕容器
        const toggleButton = document.createElement('div');

        // 設置按鈕的 ID 以便識別
        toggleButton.id = 'redirect-toggle-button';

        // 应用样式
        Object.assign(toggleButton.style, customCSS.toggleButton);

        // 創建文本行，顯示 "防揪團功能:"
        const label = document.createElement('span');
        label.textContent = '防揪團：';
        Object.assign(label.style, customCSS.label);

        // 創建狀態行，顯示 "O" 或 "X"
        const status = document.createElement('span');
        status.textContent = 'O'; // 初始顯示 O 表示啟用
        Object.assign(status.style, customCSS.status);

        // 點擊事件切換狀態
        toggleButton.addEventListener('click', () => {
            redirectEnabled = !redirectEnabled;
            status.textContent = redirectEnabled ? 'O' : 'X';
            status.style.backgroundColor = redirectEnabled ? 'green' : 'red'; // 使用条件运算符设置背景颜色
            console.log(`防揪團 ${redirectEnabled ? '啟用' : '禁用'}`);
        });

        // 將文本行和狀態行添加到 div
        toggleButton.appendChild(label);
        toggleButton.appendChild(status);

        // 找到指定的LOGO a元素
        const homeLogo = document.querySelector('a[data-a-target="home-link"]');
        // 將新創建的 div 添加到 a 標籤的後面
        if (homeLogo) {
            homeLogo.parentElement.appendChild(toggleButton);
        }
    }

    // 防揪團功能
    function redirectToTargetUrl() {
        // 檢查 防揪團開關
        if(!redirectEnabled) return
        // 檢查網址，若非原實況主則防揪團
        if (window.location.href !== `https://www.twitch.tv/${targetStreamer}`) {
            console.log(`非目標實況主網址，將導回: ${targetStreamer}`)
            window.location.href = `https://www.twitch.tv/${targetStreamer}`;
        }
    }

    // 判斷進入頁面
    function enterChat(){
        // 找尋section，以此判斷目前頁面狀態
        // const streamInfoSection = document.querySelector('section.Layout-sc-1xcs6mc-0.skip-to-target#live-channel-stream-information'); // 待確認實況開啟時的tag id
        const streamInfoSection = document.querySelector('section.Layout-sc-1xcs6mc-0.skip-to-target');
        if(!streamInfoSection) return console.log(`streamInfoSection沒找到`)// 防呆
        // 葉面狀態由 section 的 ariaLabel 提供
        const ariaLabel = streamInfoSection.getAttribute('aria-label');

        // 在實況主首頁
        if(ariaLabel === "主要內容"){
            // 進入聊天室
            const chatTab = document.querySelector('a[tabname="chat"]');
            if (!chatTab) return console.log(`chatTab沒找到`); // 防呆
            chatTab.click();
        }

        // 已經在聊天室內
        if(ariaLabel === "實況資訊"){
            // 目前無內容
        }
    }

    // 主程式
    function main(){
        redirectEnabledToggleBtn(); // 創建並顯示切換按鈕
        enterChat() // 檢查並進入聊天室
        redirectToTargetUrl()
    }
    // 重複執行 主程式
    setInterval(()=>{
        main()
    },checkTimer)

    // 第一次嘗試執行
    window.addEventListener('load', ()=>{
        main()
    });

})();