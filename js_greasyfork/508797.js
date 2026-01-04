// ==UserScript==
// @name         Zodgame 自动签到
// @icon         https://zodgame.xyz/favicon.ico
// @namespace    https://github.com/NPC2000
// @version      1.0.2
// @description  Zodgame 无感知自动签到
// @author       NPC
// @match        https://zodgame.xyz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508797/Zodgame%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/508797/Zodgame%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const today = new Date().toISOString().split('T')[0]; // 获取今天的日期 (格式: YYYY-MM-DD)

    //获取用户名
    const links = document.querySelectorAll('a[title="访问我的空间"][href*="uid="]');
    let text =null;
    links.forEach(link => {
        const url = new URL(link.href);
        text = link.textContent; // 获取链接的文本内容
        if (text) {
            console.log(`用户名: ${text}`);
        }
    });

    if (text == null) {
        console.error('无法获取用户名，停止签到');
        return;
    }

    const lastSignInDateKey = `lastSignInDate_${text}`; // 为每个用户使用独立的签到日期key
    const lastSignInDate = localStorage.getItem(lastSignInDateKey); // 获取该用户的上次签到日期

    // 检查今天是否已经签到过
    if (lastSignInDate === today) {
        console.log(`用户 ${text} 今天已经签到过了，跳过签到操作`);
        return; // 今天已经签到过，退出脚本
    }

    // 如果没有签到过，则继续执行签到操作
    console.log(`用户 ${text} 尚未签到，开始签到操作`);

    // 自动获取formhash
    const formhashElement = document.querySelector('input[name="formhash"]');
    let formhash = '';

    if (formhashElement) {
        formhash = formhashElement.value;
        console.log('Formhash:', formhash); // 打印formhash以检查获取是否成功
    } else {
        console.error('未能找到formhash元素');
        return;
    }

    // 定义签到所需的数据
    let formData = new URLSearchParams();
    formData.append('formhash', formhash); // 使用自动获取的formhash
    formData.append('qdxq', 'ng'); // 'ng' 是签到的参数

    // 发送POST请求
    fetch('https://zodgame.xyz/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1', {
        method: 'POST',
        body: formData // 浏览器自动处理所有头部信息
    })
    .then(response => response.text()) // 解析为文本形式
    .then(data => {
        console.log("签到请求已发送");
        console.log(data); // 打印返回的响应，以便检查是否成功

        // 如果签到成功，将签到日期存储到localStorage
        if (data.includes('已经签到')) {
            localStorage.setItem(lastSignInDateKey, today); // 存储该账号今天的签到日期
            console.log(`用户 ${text} 签到成功，今天的签到状态已更新`);
        }
    })
    .catch((error) => {
        console.error('签到请求失败:', error);
    });

})();
