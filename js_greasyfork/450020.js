// ==UserScript==
// @name         jenkins 环境展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  jenkins 添加 环境展示
// @author       呆呆魔法师
// @match        http://10.30.122.11:8080/jenkins/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=122.11
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450020/jenkins%20%E7%8E%AF%E5%A2%83%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450020/jenkins%20%E7%8E%AF%E5%A2%83%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = 'https://it.dashuf.com/announcement/getEfficientList';
    fetch(url).then(res => {
        const promise = res.json();
        const domContent = document.createElement('div');
        const styleStr = `
            position: fixed;
            right: 0.8%;
            top: 72px;
            z-index: 1000
        `;
        domContent.setAttribute('id', 'evn_tab');
        domContent.setAttribute('style', styleStr);
        promise.then(data => {
            domContent.innerHTML = data[0].annContent;
            console.log(data);
            document.body.appendChild(domContent);
        })
    }).catch(err => {
        console.log(err);
    });
    // Your code here...
})();