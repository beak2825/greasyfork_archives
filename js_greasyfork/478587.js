// ==UserScript==
// @name         🥇🥇💯睿学在线-批量刷课助手💯🥇🥇
// @namespace    http://www.example.com
// @version      1.0
// @description  🥇🥇💯睿学在线-批量刷课助手1💯🥇🥇
// @match        *://*.webtrn.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/478587/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E7%9D%BF%E5%AD%A6%E5%9C%A8%E7%BA%BF-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478587/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E7%9D%BF%E5%AD%A6%E5%9C%A8%E7%BA%BF-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script has already been loaded in the top frame
    if (window.top === window) {
        // Create the floating box container
        var container = document.createElement('div');
        container.id = 'float-box-container';
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.left = '50px';
        container.style.zIndex = '9999';
        container.style.background = 'linear-gradient(180deg, #87CEFA 0%, #ADD8E6 100%)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        container.style.fontWeight = 'bold';
        container.style.fontSize = '18px';

        // Add the title
        var title = document.createElement('div');
        title.textContent = 'Float Box for 睿学';
        title.style.marginBottom = '10px';
        container.appendChild(title);

        // Add the element count text with select box
        var cardWrapElements = document.querySelectorAll('.card-wrap');
        var elementCountText = document.createElement('div');
        elementCountText.textContent = '当前题库共：' + cardWrapElements.length + '道';
        container.appendChild(elementCountText);

        // Add the "课件" and "作业" switches
        var coursewareSwitch = document.createElement('input');
        coursewareSwitch.type = 'checkbox';
        var coursewareLabel = document.createElement('label');
        coursewareLabel.textContent = '课件';
        coursewareLabel.style.marginRight = '10px';
        container.appendChild(coursewareSwitch);
        container.appendChild(coursewareLabel);

        var homeworkSwitch = document.createElement('input');
        homeworkSwitch.type = 'checkbox';
        var homeworkLabel = document.createElement('label');
        homeworkLabel.textContent = '作业';
        container.appendChild(homeworkSwitch);
        container.appendChild(homeworkLabel);

        // Add the "启动" button
        var startButton = document.createElement('button');
        startButton.textContent = '启动';
        startButton.style.display = 'block';
        startButton.style.margin = '10px auto';
        startButton.style.padding = '10px 20px';
        startButton.style.borderRadius = '50%';
        startButton.style.backgroundColor = 'blue';
        startButton.style.color = 'white';
        startButton.addEventListener('click', function() {
            alert('启动失败需要更新');
        });
        container.appendChild(startButton);

        // Add the "查看批量教程" link
        var tutorialLink = document.createElement('a');
        tutorialLink.href = 'https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235';
        tutorialLink.textContent = '查看批量教程';
        tutorialLink.style.color = 'blue';
        container.appendChild(tutorialLink);

        // Append the container to the body
        document.body.appendChild(container);

        // Make the box draggable
        var isDragging = false;
        var offset = { x: 0, y: 0 };

        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offset.x = e.clientX - container.offsetLeft;
            offset.y = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                var x = e.clientX - offset.x;
                var y = e.clientY - offset.y;
                container.style.left = x + 'px';
                container.style.top = y + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }

})();
