// ==UserScript==
// @name         Idleontoolbox Produce Check
// @namespace    http://tampermonkey.net/
// @version      13.2
// @description  Check and notify on https://idleontoolbox.com/dashboard with Telegram support
// @author       Tiande
// @match        https://idleontoolbox.com/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487669/Idleontoolbox%20Produce%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/487669/Idleontoolbox%20Produce%20Check.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var interval = 10 * 60 * 1000; // check status every 5m
    //var interval = 5000 // USE FOR TEST
    var refreshInterval = 999924.05 * 60 * 60 * 1000; // auto refresh to Dashboard every 10m

    // Telegram Bot API Token
    var tgbotToken = 'YOUR BOT TOKEN';
    // Telegram user ID to send the message to
    var tguserId = 'YOUR USER ID';

    // CHECK 1: lable text under player's name
    var whichFull = /(production is fullXXX|\s[1-5]\sminuteXXX)/i; // (worship is full|is full|being full|can equip sth|missing a trap|Crystal CD for Alchemy is  0.00%) etc.
    // CHECK 2: skill to notify
    var skill = /(Refinery000)/i; // (|printer|taste|cranium cooking|Arena|Birthday|Refinery) etc.
    // CHECK 3: bookcount to check
    var bookcount = 999;
    // CHECK 4: AFKTime notify
    var AFKHour = 999;
    var AFKMin = 30;
    // CHECK 5: banner notify. Must use img src
    var bannerRegex = /(blablabla)/i;  //img-src
    //aria-label  |plots reached the threshold|squirrel|shovel|fisheroo Reset|feather restart|library has 10[2-9]|bravery
    var bannerLabelRegex = /(worship is full|justice|Summoning familiar|Equinox bar is full|Max ball|already unlocked|kill ([1-9][0-9]?|0) more|ready to be built)/i;
    // exclude 3d printer circle check、happyhour、fishg etc.
    var excludeKeyword = /(printer|happy|building|fisheroo|feather|catch|trap|worship|fight)/i; //
    // worship overflow, pet
    var worship = 'Overflowing charge9999'; // edit as "Overflowing charge" for notify.
    var pet = 'Go claim!';

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
            location.href = 'https://idleontoolbox.com/dashboard'; // 刷新页面到 dashboard
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
        // sth is full
        var matchedText = '';
        var prepareelements = document.querySelectorAll('img[aria-label]');
        var elements = Array.from(prepareelements).filter(function(element) {
            var ariaLabel = element.getAttribute('aria-label');
            var matched = ariaLabel.match(whichFull);
            if (matched !== null) {
                // 如果匹配到了，则将匹配项拼接到 matchedText 中
                matchedText += matched[0];
                // 如果还有下一个匹配项，则添加 '&'
                if (matched.index !== whichFull.lastIndex - matched[0].length) {
                    matchedText += '&';
                }
            }
            // 返回原有的条件
            return whichFull.test(ariaLabel);
        });

        if (elements.length > 0) {
            var messages = [];
            elements.forEach(function(element) {
                var parentDiv = element.closest('.MuiCardContent-root');
                if (parentDiv) {
                    var roleNameElement = parentDiv.querySelector('.MuiTypography-root.MuiTypography-body1.css-9l3uo3');
                    if (roleNameElement) {
                        var roleName = roleNameElement.textContent.trim();
                        var matchedText = ''; // 重新初始化 matchedText
                        var matched = element.getAttribute('aria-label').match(whichFull);
                        if (matched !== null) {
                            matchedText = matched[0]; // 获取匹配文本
                        }
                        messages.push(roleName + ' : ' + matchedText);
                    }
                }
            });

            if (messages.length > 0) {
                var message = messages.join('， ');
                showNotification(message);
                audio.play();
                if (tguserId !== 'your user ID') {
                    tgsendMessage(message);
                }
            }
        }

        // skill is ready
        var matchedText = '';
        var prepareelements = document.querySelectorAll('img[aria-label]');
        var elements = Array.from(prepareelements).filter(function(element) {
            var ariaLabel = element.getAttribute('aria-label');
            var matched = ariaLabel.match(skill);
            if (matched !== null) {
                // 如果匹配到了，则将匹配项拼接到 matchedText 中
                matchedText += matched[0];
                // 如果还有下一个匹配项，则添加 '&'
                if (matched.index !== skill.lastIndex - matched[0].length) {
                    matchedText += '&';
                }
            }
            // 返回原有的条件
            return skill.test(ariaLabel);
        });

        if (elements.length > 0) {
            var messages = [];
            elements.forEach(function(element) {
                var parentDiv = element.closest('.MuiCardContent-root');
                if (parentDiv) {
                    var roleNameElement = parentDiv.querySelector('.MuiTypography-root.MuiTypography-body1.css-9l3uo3');
                    if (roleNameElement) {
                        var roleName = roleNameElement.textContent.trim();
                        var matchedText = ''; // 重新初始化 matchedText
                        var matched = element.getAttribute('aria-label').match(skill);
                        if (matched !== null) {
                            matchedText = matched[0]; // 获取匹配文本
                        }
                        messages.push(roleName + ' : ' + matchedText);
                    }
                }
            });

            if (messages.length > 0) {
                var message = messages.join('， ');
                showNotification(message);
                audio.play();
                if (tguserId !== 'your user ID') {
                    tgsendMessage(message);
                }
            }
        }

        // 追踪另一组元素 constuction trap
        var timeElements = document.querySelectorAll('.MuiTypography-root.MuiTypography-inherit');
        var trackedContents = [];
        //var excludeKeyword = /(printer|happy|building|fisheroo|feather|catch|trap|worship|fight)/i; // 定义排除关键字的正则表达式

        timeElements.forEach(function(timeElement) {
            var color = getComputedStyle(timeElement).color;
            var matchColor = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
            var textContent = timeElement.textContent || '';

            // 正则表达式匹配时间格式，要求小时和分钟均为“00”，秒为任意值
            var timePattern = /^00h:00m:\d{2}s$/;

            // 检查颜色条件或文本内容中的 '-1d' 或时间格式
            if ((matchColor && matchColor[1] === '249' && matchColor[2] === '29' && matchColor[3] === '29') ||
                textContent.includes('-1d') ||
                timePattern.test(textContent)) {

                var parentElement = timeElement.closest('.MuiStack-root');
                if (parentElement && parentElement.getAttribute('aria-label')) {
                    var ariaLabel = parentElement.getAttribute('aria-label');
                    var splitIndex = ariaLabel.indexOf(':');
                    if (splitIndex !== -1) {
                        var content = ariaLabel.substring(0, splitIndex).trim(); // Get content before ':' and trim spaces
                        // 确保内容不包括 excludeKeyword
                        if (!excludeKeyword.test(content)) { // 直接使用 excludeKeyword
                            trackedContents.push(content);
                        }
                    }
                }
            }
        });

        if (trackedContents.length > 0) {
            var message = trackedContents.join(', '); // 将数组内容连接成字符串，以逗号分隔
            showNotification(message);
            audio.play();
            if (tguserId !== 'your user ID') {
                tgsendMessage(message + ' is finished.');
            }
        }

        // 追踪另一组元素 worship pet
        var timeElements = document.querySelectorAll('.MuiTypography-root.MuiTypography-body1');
        var trackedContents = [];
        //var excludeKeyword = /(printer|happy|building|fisheroo|feather|catch|trap|worship|fight)/i; // 排除关键字


        timeElements.forEach(function(timeElement) {
            var color = getComputedStyle(timeElement).color;
            var textContent = timeElement.textContent || '';

            // 检查 textContent 中是否包含 'worship' 或 'pet'
            if (textContent.includes(worship) || textContent.includes(pet)) {
                var parentElement = timeElement.closest('.MuiStack-root');
                if (parentElement && parentElement.getAttribute('aria-label')) {
                    var ariaLabel = parentElement.getAttribute('aria-label');
                    var splitIndex = ariaLabel.indexOf(':');
                    if (splitIndex !== -1) {
                        var content = ariaLabel.substring(0, splitIndex).trim(); // Get content before ':' and trim spaces
                        // 确保内容不包括 excludeKeyword
                        if (!excludeKeyword.test(content)) { // 直接使用 excludeKeyword
                            trackedContents.push(content);
                        }
                    }
                }
            }
        });

        if (trackedContents.length > 0) {
            var message = trackedContents.join(', '); // 将数组内容连接成字符串，以逗号分隔
            showNotification(message);
            audio.play();
            if (tguserId !== 'your user ID') {
                tgsendMessage(message + ' is finished.');
            }
        }

        // Book count
        var bookCountElements = document.querySelectorAll('.MuiCardContent-root h4');
        // 遍历每个 <h4> 元素
        bookCountElements.forEach(function(element) {
            // 获取文本内容
            var text = element.textContent.trim();
            // 提取数字部分
            var count = parseInt(text.match(/\d+/)[0]);
            // 如果数字大于等于2，则发送通知
            if (count >= bookcount) {
                // 发送通知
                var message = 'The book count has exceeded the limit!';
                showNotification(message);
                audio.play();
                if (tguserId !== 'your user ID') {
                    tgsendMessage(message);
                }
            }
        });

        // 追踪另一组元素 AFKTime
        var timeElements = document.querySelectorAll('.MuiTypography-root.MuiTypography-caption.css-deomsi');
        timeElements.forEach(function(timeElement) {
            var parentElement = timeElement.closest('.MuiStack-root');
            if (parentElement) {
                var resetTextElement = parentElement.querySelector('.MuiTypography-body1');
                if (resetTextElement) {
                    var resetText = resetTextElement.textContent.trim();
                    // 排除含有 Daily Reset 和 Weekly Reset 的模块内容
                    if (resetText !== 'Daily Reset' && resetText !== 'Weekly Reset') {
                        var timeText = timeElement.textContent.trim();
                        var match = timeText.match(/^(\d+)h:(\d+)m:(\d+)s$|^(\d+)d:(\d+)h:(\d+)m$/);

                        if (match) {
                            var days = match[4] ? parseInt(match[4], 10) : 0;
                            var hours = match[1] ? parseInt(match[1], 10) : parseInt(match[2], 10);
                            var minutes = match[2] ? parseInt(match[2], 10) : parseInt(match[5], 10);
                            var seconds = match[3] ? parseInt(match[3], 10) : parseInt(match[6], 10);

                            // 转换成统一的格式
                            hours += days * 24;

                            if (hours >= AFKHour && minutes >= AFKMin) {
                                showNotification(timeText);
                                audio.play();
                                if (tguserId !== 'your user ID') {
                                    tgsendMessage(timeText + ' is finished.');
                                }
                            }
                        }
                    }
                }
            }
        });

        //check top banner
        var images = document.querySelectorAll('div.css-1eybjch > div.css-79elbk > img'); // 获取页面上所有的img元素
        var matchedImages = Array.from(images).filter(function(image) {
            return bannerRegex.test(image.src); // 测试每个图片的src属性是否匹配正则表达式
        });

        // 遍历匹配到正则的img元素并执行相应的操作
        if (matchedImages.length > 0) {
            var messages = [];
            matchedImages.forEach(function(image) {
                var src = image.src;
                var matchedText = src.match(bannerRegex)[0]; // 获取匹配文本
                messages.push(matchedText); // 将匹配的文本收集起来
            });

            // 将所有匹配的结果合并成一条消息并显示出来
            var message = messages.join(' ');
            showNotification(message);
            audio.play();
            if (tguserId !== 'your user ID') {
                tgsendMessage('Banner check: ' + message);
            }
        }

        // 追踪另一组元素 banner salt garden （aria-label）
        var timeElements = document.querySelectorAll('.MuiStack-root.css-18jqfyr');
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
                title: 'Idleontoolbox Notification',
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
                        title: 'Idleontoolbox Notification',
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