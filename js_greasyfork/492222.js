// ==UserScript==
// @name         IdleonEfficiency Produce Check
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Check and notify on https://www.idleonefficiency.com/ with Telegram support
// @author       Tiande
// @match        https://www.idleonefficiency.com/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492222/IdleonEfficiency%20Produce%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/492222/IdleonEfficiency%20Produce%20Check.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var interval = 10 * 60 * 1000; // check status every 5m
    //var interval = 5000 // USE FOR TEST
    var refreshInterval = 1.01 * 60 * 60 * 1000; // auto refresh to Dashboard every 10m

    // Telegram Bot API Token
    var tgbotToken = 'YOUR BOT TOKEN';
    // Telegram user ID to send the message to
    var tguserId = 'YOUR USER ID';

    // CHECK 1: lable text under player's name
    //var whichFull = /(worship is full|production is full|\s[1-5]\sminute)/i; // (is full|being full|can equip sth|missing a trap|maxed) etc.
    // CHECK 2: skill to notify
    //var skill = /(Refinery|Birthday|taste|printer|cranium cooking)/i; // (Refinery|Arena|Printer Go Brr) etc.
    // CHECK 3: bookcount to check
    //var bookcount = 20;
    // CHECK 4: AFKTime Check
    //var AFKHour = 9;
    //var AFKMin = 30;
    // CHECK 5: banner notify. Must use img src
    var bannerRegex = /(ClassIcons57)/i;  //img-src
    var bannerLabelRegex = /(ready to rank up|plots are fully grown|maximum capacity of chests|Max sprouts capacity|Sprinkler drops has reached it's capacity|Equinox bar is full)/i;  //aria-label  |squirrel|shovel
    // exclude 3d printer circle check
    //var excludeKeyword = /(printer|happy)/i;

    var notificationPermission = GM_getValue('notificationPermission');
    var isFunctionEnabled = true;
    var intervalId; // Store interval ID for pausing and resuming

    // tg send
    function tgsendMessage(message) {
        var tgurl = 'https://api.telegram.org/bot' + tgbotToken + '/sendMessage';
        var tgparams = 'chat_id=' + tguserId + '&text=' + encodeURIComponent(message);

        var tgxhr = new XMLHttpRequest();
        tgxhr.open('POST', tgurl, true);
        tgxhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        tgxhr.onreadystatechange = function() {
            if (tgxhr.readyState == 4 && tgxhr.status == 200) {
                console.log('Message sent successfully!');
            }
        };
        tgxhr.onerror = function(error) {
            console.error('Error sending message:', error);
        };
        tgxhr.send(tgparams);
    }

    // autorefresh time
    var refreshId;
    // refreshPage
    function refreshPage() {
        if (isFunctionEnabled) {
            location.href = 'https://www.idleonefficiency.com/'; // 刷新页面到 dashboard
        } else {
            // 如果不是，则等待下一个刷新时间间隔
            refreshId = setInterval(refreshPage, refreshInterval);
        }
    }

    function toggleRefresh() {
        if (isFunctionEnabled) {
            intervalId = setInterval(startInterval, interval); // 启动定时器
            refreshId = setInterval(refreshPage, refreshInterval);
        } else {
            clearInterval(intervalId); // 清除定时器
            clearInterval(refreshId);
        }
    }
    toggleRefresh(); // 在脚本启动时调用一次，以确保定时器已启动
    // Preload audio
    var audio = new Audio();
    audio.src = 'https://github.com/Tiande/IdelonCheck/raw/main/iphonewake.wav';

    // Add CSS styles
    var style = document.createElement('style');
    style.innerHTML = `
        #toggleButtonContainer {
            position: fixed;
            top: 50%;
            left: calc(50% + 100px);
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            padding: 5px;
            background: green; /* Green color for default enabled state */
            color: white;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            user-select: none;
            cursor: move;
        }
        #toggleButtonContainer.off {
            background: red; /* Red color for disabled state */
        }
        #toggleButton {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background: transparent;
            cursor: pointer;
            outline: none;
        }
        .drag-handle {
            cursor: move;
        }
        #produceCheck {
            background-color: black;
            color: white;
            padding: 5px;
            border-radius: 5px;
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);

    createToggleButton(); // Create toggle button on script execution
    startInterval(); // Start interval on script execution
    function createToggleButton() {
        var toggleButtonContainer = document.createElement('div');
        toggleButtonContainer.id = 'toggleButtonContainer';
        toggleButtonContainer.classList.add('drag-handle');
        var produceCheck = document.createElement('span');
        produceCheck.id = 'produceCheck';
        produceCheck.textContent = 'Produce Check: ';
        toggleButtonContainer.appendChild(produceCheck);
        var toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.addEventListener('click', toggleFunction);
        toggleButtonContainer.appendChild(toggleButton);
        document.body.appendChild(toggleButtonContainer);
        updateButtonStyle();
        makeDraggable(toggleButtonContainer);
    }

    function updateButtonStyle() {
        var toggleButtonContainer = document.getElementById('toggleButtonContainer');
        toggleButtonContainer.classList.toggle('off', !isFunctionEnabled);
        var toggleButton = document.getElementById('toggleButton');
        toggleButton.innerHTML = isFunctionEnabled ? 'ON': 'OFF';
    }

    function toggleFunction() {
        isFunctionEnabled = !isFunctionEnabled;
        updateButtonStyle();
        toggleRefresh(); // 根据isFunctionEnabled的值启用或暂停定时器
    }

    function startInterval() {

        //fully
        var images = document.querySelectorAll('div.StyledBox-sc-13pk1d4-0.fHlfiB > img'); // 获取页面上所有的img元素
        var matchedImages = Array.from(images).filter(function(image) {
            return bannerRegex.test(image.src); // 测试每个图片的src属性是否匹配正则表达式
        });

        // 遍历匹配到正则的img元素并执行相应的操作
        if (matchedImages.length > 0) {
            var messages = [];
            matchedImages.forEach(function(image) {
                var src = image.src;
                var matchedText = src.match(bannerRegex)[0]; // 获取匹配文本
                if (matchedText == 'ClassIcons57'){
                  matchedText = 'Farming plots is full!'
                }
                messages.push(matchedText); // 将匹配的文本收集起来
            });

            // 将所有匹配的结果合并成一条消息并显示出来
            var message = messages.join(' ');
            showNotification(message);
            audio.play();
            if (tguserId !== 'your user ID') {
                tgsendMessage(message);
            }
        }

        // 追踪另一组元素 banner salt garden （aria-label）
        var timeElements = document.querySelectorAll('.MuiBox-root.css-79elbk');
        var trackedContents = [];

        timeElements.forEach(function(timeElement) {
          var ariaLabel = timeElement.getAttribute('aria-label');
          var matchResult = bannerLabelRegex.exec(ariaLabel);
          if (ariaLabel && matchResult) {
            var matchedText = matchResult[0]; // 获取匹配到的具体内容
            trackedContents.push(matchedText);
          }
        });

        if (trackedContents.length > 0) {
            var message = trackedContents.join(', '); // 将数组内容连接成字符串，以逗号分隔
            showNotification(message);
            audio.play();
            if (tguserId !== 'your user ID') {
                tgsendMessage(message);
            }
        }

    }//All func end

    function showNotification(message) {
        if (notificationPermission === 'granted') {
            GM_notification({
                text: message,
                title: 'Idleonefficiency Notification',
                timeout: 5000,
                onclick: function() {
                    window.focus();
                }
            });
        } else {
            window.Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    GM_notification({
                        text: message,
                        title: 'Idleonefficiency Notification',
                        timeout: 5000,
                        onclick: function() {
                            window.focus();
                        }
                    });
                }
            });
        }
    }

    function makeDraggable(element) {
        let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

})();