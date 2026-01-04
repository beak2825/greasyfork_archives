// ==UserScript==
// @name         动态的每日一言
// @namespace    http://tampermonkey
// @version      1.0
// @description  Pop up notifications from the bottom right corner of the page every second, and keep popping up until you stop the script. The notifications will keep moving up, and then disappear after 3 seconds. The content of each notification is a random sentence obtained from an API.
// @include      https://cn.bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/465907/%E5%8A%A8%E6%80%81%E7%9A%84%E6%AF%8F%E6%97%A5%E4%B8%80%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/465907/%E5%8A%A8%E6%80%81%E7%9A%84%E6%AF%8F%E6%97%A5%E4%B8%80%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var enabled = true; // 初始状态为启用
    var more=10000;
    var speed=3000;
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'o') { // 当按下p键时
            enabled = !enabled; // 切换启用状态
            console.log('脚本已' + (enabled ? '启用' : '禁用')); // 打印状态
        }
        if (event.key === '+') { // 当按下p键时
            speed = speed +1000;
            console.log('speed:' + speed); // 打印状态

        }
                if (event.key === 'M') { // 当按下p键时
            more = more +5000;
            console.log('more:' + more); // 打印状态

        }
                if (event.key === 'L') { // 当按下p键时
            more = more -5000;
            console.log('more:' + more); // 打印状态
            if(more<10000){more=10000;}
            console.log('speed:' + more); // 打印状态
        }
        if (event.key === '_') { // 当按下p键时
            speed = speed -1000;
            if(speed<0){speed=100;}
            console.log('speed:' + speed); // 打印状态
        }

    });

    // Create a function to generate a random color in hexadecimal format.
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Create a function to show notifications.
    function showNotification(message, duration = 3000, color = '#FF9494', opacity = 0.5) {
        // Create a notification element.
        const textLength = message.length;
        if(textLength>20) return 0;
        const notification = document.createElement('div');
        console.log(message,textLength);
        notification.innerHTML = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '-50px';
        notification.style.right = '10px';
        notification.style.width = `${textLength * 15}px`;;
        notification.style.backgroundColor = color;
        notification.style.color = '#ffffff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.textAlign = 'center';
        notification.style.boxShadow = '0px 2px 2px rgba(0, 0, 0, 0.3)';
        notification.style.fontWeight = 'bold';
        notification.style.opacity = opacity;

        // Append the notification element to the document.
        document.body.appendChild(notification);

        // Create an animation to move the notification element up.
        const animation = notification.animate([
            { bottom: '-50px' },
            { bottom: `${window.innerHeight}px` }
        ], {
            duration: 80000 - speed *1.5,
            easing: 'linear',
            fill: 'both'
        });

        // Set a timer to remove the notification element after it disappears.
        setTimeout(() => {
            // Cancel the animation if the notification is still visible.
            if (notification.offsetParent !== null) {
                animation.cancel();
            }

            // Remove the notification element from the document.
            notification.remove();
        }, duration);
    }

    // Create a function to obtain a random sentence from the API and show it as a notification every second.
    function showNotifications() {
        if (enabled) {
            fetch('https://v1.hitokoto.cn/')
                .then(response => response.json())
                .then(data => {
                showNotification(data.hitokoto, more, getRandomColor());
            })
                .catch(error => {
                console.error(error);
            });

            // Set a timer to repeat the function every second.
            setTimeout(showNotifications, speed);
        }
    }

    // Call the showNotifications function to start showing notifications.
    showNotifications();
})();
