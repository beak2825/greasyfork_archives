// ==UserScript==
// @name         online.bloodontheclocktower 汉化脚本
// @namespace    http://www.pktgame.com/
// @version      0.20
// @description  这是一个关于online.bloodontheclocktower的汉化脚本
// @author       Nowpaper
// @license      MIT
// @match        https://online.bloodontheclocktower.com/*
// @icon         https://online.bloodontheclocktower.com/static/favicon-16x16.png
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455482/onlinebloodontheclocktower%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455482/onlinebloodontheclocktower%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // function stringIsEqual(a,b){        
    //     return a.replace(' ','') == b.replace(' ','');
    // }

    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position = "fixed";
    Container.style.left = "12px";
    Container.style.top = "12px";
    Container.style['z-index'] = "999999";
    Container.innerHTML = `<button id="myCustomize" style="position:absolute; left:30px; top:20px">!</button>`;

    document.body.appendChild(Container);

    function fixStr(str) {
        return str.replace(' ', '')
    }
    console.log("From Nowpaper!");
    var lang = "zh-CN";
    var isSafari =
        navigator.userAgent.includes("Safari/") &&
        !navigator.userAgent.includes("Chrome/");
    var isElectron = "undefined" != typeof global || window.__isElectron;

    const scriptList = document.querySelectorAll("script[defer]");
    const scriptSrcList = Array.from(scriptList).map((v) => v.src);
    if (isSafari) {
        scriptList.forEach((v) => v.remove());
        document.getElementById("notion-app").remove();
    }
    let translation = new Map();
    translation.set('You need a subscription in order to play!', '您需要订阅才能玩！');
    translation.set('Welcome to Blood on the Clocktower Online - Under Construction!', '欢迎来到钟楼之血在线-正在建设中！');
    translation.set('Please log in or create an account to continue:', '请登录或创建帐户以继续：');
    translation.set('Register', '注册');
    translation.set('Login', '登录');
    translation.set('Logout', '登出');
    translation.set('Current subscription level:', '当前订阅级别：');
    translation.set('Join Game', '加入游戏');
    translation.set('Setup Mic/Cam', '设置麦克/摄像');

    let translation2 = new Map();
    translation.forEach((value,key)=>{
        translation2.set(fixStr(key),value);
    });
    translation = translation2;

    function replaceText(d) {
        $(d).each(function (index, domEle) {
            // console.log(domEle);
            const text = translation.get(fixStr(domEle.innerText));
            if (text) {
                domEle.innerText = text;
            }
        });
    }

    Container.onclick = function(){ 
        console.log("尝试翻译");
        replaceText('b');
        replaceText('button');
    };

})();