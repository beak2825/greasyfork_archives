// ==UserScript==
// @name         最新免费节点，科学上网，魔法上网，免费梯子，免费机场，翻墙节点
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  最新免费节点，科学上网，魔法上网，免费梯子，免费机场，翻墙节点，ss/trojan/clash免费节点订阅地址分享，直连facebook、Youtube、Twitter、Tiktok、ChatGPT尽情看视频网站，流量用不玩。
// @author       esxu
// @match        https://baidu.com
// @match        https://www.baidu.com
// @match        https://bing.com
// @match        https://www.bing.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515819/%E6%9C%80%E6%96%B0%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%EF%BC%8C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%EF%BC%8C%E9%AD%94%E6%B3%95%E4%B8%8A%E7%BD%91%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%A2%AF%E5%AD%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%9C%BA%E5%9C%BA%EF%BC%8C%E7%BF%BB%E5%A2%99%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/515819/%E6%9C%80%E6%96%B0%E5%85%8D%E8%B4%B9%E8%8A%82%E7%82%B9%EF%BC%8C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%EF%BC%8C%E9%AD%94%E6%B3%95%E4%B8%8A%E7%BD%91%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%A2%AF%E5%AD%90%EF%BC%8C%E5%85%8D%E8%B4%B9%E6%9C%BA%E5%9C%BA%EF%BC%8C%E7%BF%BB%E5%A2%99%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建打开按钮
    const openButton = document.createElement('button');
    openButton.textContent = '获取免费节点';
    openButton.style.position = 'fixed';
    openButton.style.top = '80px';
    openButton.style.right = '10px';
    openButton.style.zIndex = '1000000000000';
    openButton.style.padding = '10px 16px';
    openButton.style.fontSize = '14px';
    openButton.style.cursor = 'pointer';
    openButton.style.backgroundColor = '#4CAF50';
    openButton.style.color = '#fff';
    openButton.style.border = 'none';
    openButton.style.borderRadius = '5px';
    openButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.3)';
    openButton.style.transition = 'all 0.3s';

    // 添加悬停效果
    openButton.onmouseover = function() {
        openButton.style.backgroundColor = '#45a049';
    };
    openButton.onmouseout = function() {
        openButton.style.backgroundColor = '#4CAF50';
    };

    // 将按钮添加到页面中
    document.body.appendChild(openButton);

    // 创建弹出层 (div)
    const modalDiv = document.createElement('div');
    modalDiv.style.display = 'none'; // 初始隐藏
    modalDiv.style.position = 'fixed';
    modalDiv.style.top = '80px';
    modalDiv.style.right = 'calc(10px + 120px)';
    modalDiv.style.zIndex = '10000000000001';
    modalDiv.style.backgroundColor = 'white';
    modalDiv.style.padding = '20px';
    modalDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    modalDiv.style.borderRadius = '8px';
    modalDiv.style.width = '250px';
    modalDiv.style.textAlign = 'center';

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '16px';
    closeButton.style.color = '#333';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0';
    closeButton.style.width = '24px';
    closeButton.style.height = '24px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.transition = 'background-color 0.3s';

    // 添加关闭按钮的悬停效果
    closeButton.onmouseover = function() {
        closeButton.style.backgroundColor = '#f0f0f0';
    };
    closeButton.onmouseout = function() {
        closeButton.style.backgroundColor = 'transparent';
    };

    // 将关闭按钮添加到弹出层
    modalDiv.appendChild(closeButton);

    // 添加内容到弹出层
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
            <h1><b>免费节点分享</b></h1>
            <br/>
            <p>性价比机场推荐:<br/>
            星链云：「<a href="https://1234501.xyz?code=wkHpzsw6" target="_blank" >(点击注册)」</a>
            </p><br/>
            <p><button class="cp_btn">点击复制免费节点</button><br/>
			<textarea rows="2" style="margin-top:10px" id="freenode"></textarea>
            </p>
    `;
    modalDiv.appendChild(modalContent);

    // 将弹出层添加到页面中
    document.body.appendChild(modalDiv);

    // 打开弹出层
    openButton.addEventListener('click', () => {
        if(!document.getElementById('freenode').value.trim()){
          fetch('https://free-node.202408.xyz')
              .then(response => response.text())
              .then(data => {
                  document.getElementById("freenode").innerText = data;
              })
              .catch(error => alert('获取失败，请重试'));
        }
        modalDiv.style.display = 'block';
    });

    // 关闭弹出层
    closeButton.addEventListener('click', () => {
        modalDiv.style.display = 'none';
    });

    document.querySelector('.cp_btn').addEventListener('click', () => {
        navigator.clipboard
            .writeText(document.getElementById('freenode').value.trim())
            .then(() => {
            console.log('复制成功')
        })
            .catch(() => {
            console.log('复制失败')
        })
    })

})();