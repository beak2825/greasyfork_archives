// ==UserScript==
// @name         EMO熊熊
// @namespace    http://your.namespace.com
// @version      10
// @description  四個網站亂跳 TikTok(Beta)
// @author       emo熊
// @include      *
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493244/EMO%E7%86%8A%E7%86%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/493244/EMO%E7%86%8A%E7%86%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // mod圖標
    var iconDiv = document.createElement('div');
    iconDiv.id = 'topIcon';
    document.body.appendChild(iconDiv);

    // mod照片括號中的https照片網址
    GM_addStyle('#topIcon { position: fixed; width: 60px; height: 60px; z-index: 9999; cursor: move; left: 229px; top: 114.5px; background-image: url("https://lh3.googleusercontent.com/pw/AP1GczNEYnAI1Qn-LuXMuH9TFFTai1Gs88AJbjhe-LjA7v4L5hGL5HGa2H10PX0uGrh2Iwbwu3G42E7OczKvT7q4IWef2K1P6gxCvugzsrWXP5ZfwmswvPMKn2Id_SRN53x8cQujV3PRj4_yYketzJ1pMmo=w200-h200-s-no-gm"); background-size: cover; background-repeat: no-repeat; border: 3px solid transparent; border-radius: 50%; animation: pulse 2s infinite; }');
    GM_addStyle('@keyframes pulse { 0% { border-color: #FF0000; } 25% { border-color: #FFD700; } 50% { border-color: #008000; } 75% { border-color: #0000FF; } 100% { border-color: #FF1493; } }');

    // 創建菜單
    var menuDiv = document.createElement('div');
    menuDiv.id = 'menu';
    menuDiv.style.display = 'none'; // 初始時隱藏菜單
    document.body.appendChild(menuDiv);

    // 菜單顏色
    GM_addStyle('#menu { position: fixed; width: 100px; background-color: #ffffff; border: 1px solid #cccccc; border-radius: 5px; z-index: 9998; }');
    GM_addStyle('#menu ul { list-style: none; padding: 0; margin: 0; }');
    GM_addStyle('#menu button { width: 100%; padding: 10px; cursor: pointer; user-select: none; border: none; background-color: transparent; text-align: left; }'); // 按鈕樣式
    GM_addStyle('#menu button:hover { background-color: #f0f0f0; }');
    GM_addStyle('#menu button:active { background-color: #cccccc; }'); // 點擊按鈕時的樣式
    GM_addStyle('#menu button#emo { background-color: red; color: blue; }'); // EMO按鈕的紅色背景和藍色文字
    GM_addStyle('#menu button.option { background-color: black; color: yellow; }'); // 選項按鈕的黑色背景和黃色文字

    // 菜單文字內容
    menuDiv.innerHTML = '<ul><button id="emo">EMO</button><button class="option" id="google">Google</button><button class="option" id="instagram">Instagram</button><button class="option" id="youtube">YouTube</button><button class="option" id="tiktok">TikTok</button><button class="option" id="A">支持正版<br>拒絕盜版</button><button class="option" id="B">買掛私我</button></ul>';

    // 菜單位置為圖標下方
    menuDiv.style.left = 'calc(229px + 24px - 45px)';
    menuDiv.style.top = 'calc(114.5px + 48px + 10px)';

    var isDragging = false;
    var offsetX, offsetY;
    var lastClickTime = 0;

    // 滑鼠按下跟著移動
    iconDiv.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    // 讓MOD不要一直跟著滑鼠
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

        // 滑鼠移動
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var x = e.clientX - offsetX;
            var y = e.clientY - offsetY;
            iconDiv.style.left = x + 'px';
            iconDiv.style.top = y + 'px';

            // 更新菜單位置為圖標下方
            menuDiv.style.left = 'calc(' + x + 'px + 24px - 45px)';
            menuDiv.style.top = 'calc(' + (y + 48 + 10) + 'px)';
        }
    });

    // 點兩下打開菜單
    iconDiv.addEventListener('click', function(e) {
        var currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 300) {
            // 上次點擊小於300毫秒，視為雙擊
            menuDiv.style.display = 'block';
        }
        lastClickTime = currentTime;
    });

    // 滑鼠進入圖標事
    iconDiv.addEventListener('mouseenter', function() {
        iconDiv.style.cursor = 'default';
    });

    // 滑鼠離開圖標
    iconDiv.addEventListener('mouseleave', function() {
        iconDiv.style.cursor = 'move';
    });

    // 點擊菜單外部時隱藏菜單
    document.addEventListener('click', function(e) {
        if (!menuDiv.contains(e.target) && e.target !== iconDiv) {
            menuDiv.style.display = 'none';
        }
    });

    // 跳到google網站
    document.getElementById('google').addEventListener('click', function() {
        window.location.href = 'https://www.google.com/';
    });

    //跳到FB網站[因腳本問題,點左鍵會刷心]<腳本拔掉了>測試中拔掉了,CPU也要炸了(Beta)

    // 跳到IG網站
    document.getElementById('instagram').addEventListener('click', function() {
        window.location.href = 'https://www.instagram.com/?next=%2F';
    });

    // 跳到YT網站
    document.getElementById('youtube').addEventListener('click', function() {
        window.location.href = 'https://www.youtube.com/';
    });

    // 跳到抖音網站
    document.getElementById('tiktok').addEventListener('click', function() {
        window.location.href = 'https://www.tiktok.com/';
    });
})();























//EMO








//by facebook
//https://www.facebook.com/profile.php?id=100086334167010



//by instgram
//https://www.instagram.com/emo_bear_hack/



//by Tik Tok
//https://www.tiktok.com/@emo_bear.hack