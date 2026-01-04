// ==UserScript==
// @name         恋爱游戏网自动签到
// @namespace    http://tampermonkey.net/love_sign
// @version      2020.08.16.1
// @description  打开恋爱游戏网首页/会员中心/百度首页后自动签到
// @author       PY-DNG
// @icon         https://www.lianaiyx.com/skin/member/images/nopic.gif
// @include      https://www.lianaiyx.com/
// @include      https://www.lianaiyx.com/e/member/cp/
// @include      https://www.baidu.com/
// @include      https://www.baidu.com/index.php
// @connect      www.lianaiyx.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/408468/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/408468/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户参数
    const developer = false;

    // 程序常量
    const TEXT_SITE_NAME = '恋爱游戏网：';
    const TEXT_ALREADY_SIGNED = '今日已签到';
    const TEXT_IN_SIGNING = TEXT_SITE_NAME + '正在签到中...';
    const TEXT_SIGN_AGAIN = '点击再次签到';
    const TEXT_UNEXPECTED_RESPONSE = '尝试执行了签到，但是未收到服务器预期的回应。请打开浏览器控制台查看并反馈详情。';

    const COLOR_IN_SIGNING = 'rgb(100,100,255)';
    const COLOR_SIGN_SUCCEED = 'green';
    const COLOR_SIGN_ERROR = 'red';

    // 通用程序常量
    const TEXT_SCRIPT_NAME = GM_info.script.name;
    const TEXT_ERROR_TITLE = '==== Userscript Error: ' + TEXT_SCRIPT_NAME + ' ====';

    // 回显区域
    let headLine, container;
    const blank = document.createElement('code');
    blank.innerText = ' ';
    const signDisplay = document.createElement('a');
    signDisplay.href = 'javascript:void(0);';
    signDisplay.addEventListener('click', sign);
    switch (window.location.href) {
        case 'https://www.lianaiyx.com/':
            headLine = document.querySelectorAll('.menber')[0];
            headLine.appendChild(signDisplay);
            break;
        case 'https://www.lianaiyx.com/e/member/cp/':
            container = document.querySelectorAll('div table tbody tr td');
            container[0].width = '30%';
            container[1].width = '70%';
            headLine = document.querySelector('div table tbody tr td div');
            headLine.appendChild(blank);
            headLine.appendChild(signDisplay);
            break;
        case 'https://www.baidu.com/':
        case 'https://www.baidu.com/index.php':
            headLine = document.querySelector('#s-top-left');
            signDisplay.className = headLine.children[0].className;
            headLine.appendChild(signDisplay);
    }

    // 判断今日是否已经签到过了
    let d = new Date();
    let fulltime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    if(GM_getValue('lastTime', '') === fulltime) {
        signDisplay.innerText = TEXT_ALREADY_SIGNED;
        signDisplay.style.color = 'green';
        signDisplay.title = TEXT_SIGN_AGAIN;
    } else {
        sign();
    }

    // 签到函数
    function sign() {
        signDisplay.innerText = TEXT_IN_SIGNING;
        signDisplay.style.color = COLOR_IN_SIGNING;
        GM_xmlhttpRequest({
            method: 'GET',
	        synchronous: false,
            url: 'https://www.lianaiyx.com/e/member/sign/?doajax=1&ajaxarea=sign',
            onload : function (reText) {
                const msg = reText.responseText.split('|');
                if (msg[0] === '已签到') {
                    GM_setValue('lastTime', fulltime);
                    signDisplay.style.color = COLOR_SIGN_SUCCEED;
                    signDisplay.innerText = TEXT_SITE_NAME + msg[2];
                } else {
                    signDisplay.style.color = COLOR_SIGN_ERROR;
                    signDisplay.innerText = TEXT_UNEXPECTED_RESPONSE;
                    console.log(TEXT_ERROR_TITLE);
                    console.log([reText, msg]);
                    console.log(GM_info);
                }
            }
        })
    }
})();
