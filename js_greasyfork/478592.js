// ==UserScript==
// @name         💯🥇🥇学起PLUS/弘成-批量看课助手💯🥇🥇
// @version      1.0
// @description  Create a draggable floating box on sccchina.net
// @author       Your Name
// @match        *.sccchina.net/*
// @grant        none
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @antifeature				payment
// @downloadURL https://update.greasyfork.org/scripts/478592/%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87%E5%AD%A6%E8%B5%B7PLUS%E5%BC%98%E6%88%90-%E6%89%B9%E9%87%8F%E7%9C%8B%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478592/%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87%E5%AD%A6%E8%B5%B7PLUS%E5%BC%98%E6%88%90-%E6%89%B9%E9%87%8F%E7%9C%8B%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating box
    var floatBox = document.createElement('div');
    floatBox.style.position = 'fixed';
    floatBox.style.top = '20px';
    floatBox.style.right = '20px';
    floatBox.style.width = '250px';
    floatBox.style.padding = '10px';
    floatBox.style.background = 'rgba(0, 0, 255, 0.3)';
    floatBox.style.border = '2px solid blue';
    floatBox.style.borderRadius = '10px';
    floatBox.style.color = 'white';
    floatBox.style.fontWeight = 'bold';
    floatBox.style.fontSize = '16px';
    floatBox.style.zIndex = '9999';
    floatBox.draggable = true;
    floatBox.innerHTML = `
        <div>Float Box for 学起PLUS</div>
        <div>当前学生： <span id="user-name">Your Name</span></div>
        <div>
            <label><input type="checkbox" id="courseware"> 课件</label>
            <label><input type="checkbox" id="homework"> 作业</label>
        </div>
        <div><button id="start-button">启动挂机</button></div>
        <div>当前题库共：888868道</div>
        <div><a href="https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235" style="color: blue;">查看批量教程</a></div>
    `;

    document.body.appendChild(floatBox);

    // Make the box draggable
    floatBox.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', 'anything');
    });

    // Handle the start button click event
    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        alert('启动失败需要更新');
    });

    // Update user name (you can modify this part to get the actual user name)
    var userName = document.getElementById('user-name');
    userName.textContent = 'John Doe';
})();