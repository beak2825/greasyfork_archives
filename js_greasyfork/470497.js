// ==UserScript==
// @name         山传内网一键达（山传代理打开）
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  !!登录山传代理后!!点击按钮将使用山西传媒学院代理打开当前网页
// @match        *://*/*
// @grant        none
// @author       Doubt-Fact
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470497/%E5%B1%B1%E4%BC%A0%E5%86%85%E7%BD%91%E4%B8%80%E9%94%AE%E8%BE%BE%EF%BC%88%E5%B1%B1%E4%BC%A0%E4%BB%A3%E7%90%86%E6%89%93%E5%BC%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470497/%E5%B1%B1%E4%BC%A0%E5%86%85%E7%BD%91%E4%B8%80%E9%94%AE%E8%BE%BE%EF%BC%88%E5%B1%B1%E4%BC%A0%E4%BB%A3%E7%90%86%E6%89%93%E5%BC%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // mainButton
    const mainButton = document.createElement('button');
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '20px';
    mainButton.style.right = '20px';
    mainButton.style.padding = '10px';
    mainButton.style.backgroundColor = '#004EA2';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '5px';
    mainButton.style.cursor = 'pointer';
    mainButton.style.zIndex = '9999';
    mainButton.innerText = 'CUSXgo';

    // 选项容器
    const optionsContainer = document.createElement('div');
    optionsContainer.style.position = 'fixed';
    optionsContainer.style.bottom = '60px';
    optionsContainer.style.right = '20px';
    optionsContainer.style.display = 'none';
    optionsContainer.style.backgroundColor = 'lightgray';
    optionsContainer.style.padding = '10px';
    optionsContainer.style.borderRadius = '5px';
    optionsContainer.style.zIndex = '9998';

    // 创建选项按钮
    const optionButton1 = document.createElement('button');
    optionButton1.innerText = '登录';
    optionButton1.addEventListener('click', () => {
        window.open('http://authserver-cusx-edu-cn-s.vpn.cusx.edu.cn:8118/authserver/login?service=https%3A%2F%2Fvpnehall.cusx.edu.cn%3A8000%2Fauth%2Fcas_validate%3Fentry_id%3D2', '_blank');
    });
    optionsContainer.appendChild(optionButton1);

    const optionButton2 = document.createElement('button');
    optionButton2.innerText = '内网打开';
    optionButton2.addEventListener('click', changeURL);
    optionsContainer.appendChild(optionButton2);

    const optionButton3 = document.createElement('button');
    optionButton3.innerText = '知网';
    optionButton3.addEventListener('click', () => {
        window.open('http://www-cnki-net-s.vpn.cusx.edu.cn:8118/', '_blank');
    });
    optionsContainer.appendChild(optionButton3);

    // 可见性切换
    mainButton.addEventListener('click', () => {
        optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
    });

    function changeURL() {
        let url = window.location.href;
        let hostname = window.location.hostname;
        let path = window.location.pathname;
        let search = window.location.search;

        if (hostname.includes('.')) {
            hostname = hostname.replace(/\./g, '-');
        }

        hostname += '-s.vpn.cusx.edu.cn:8118';
        url = 'http://' + hostname + path + search;
        window.open(url);
    };

    // 添加按钮到body
    document.body.appendChild(mainButton);
    document.body.appendChild(optionsContainer);
})();