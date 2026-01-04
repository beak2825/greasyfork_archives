// ==UserScript==
// @name        网易云自动刷歌
// @namespace   https://acwars.me/
// @version     0.0.12
// @description 网易云刷听歌量，随机间隔时间倒计时显示，固定拖动按钮，24小时制指定时间启动，并且可以保存两个访问链接。
// @author      acwars
// @match       https://music.163.com/
// @downloadURL https://update.greasyfork.org/scripts/507129/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/507129/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.meta.js
// ==/UserScript==

;(function () {
    var count = 1;
    var isRunning = false; // 记录脚本是否正在运行

    function getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createFloatingWindow() {
        var floatWindow = document.createElement('div');
        floatWindow.id = 'floatWindow';
        floatWindow.style.position = 'fixed';
        floatWindow.style.bottom = '50px';
        floatWindow.style.right = '10px';
        floatWindow.style.width = '300px';
        floatWindow.style.height = '450px';
        floatWindow.style.padding = '20px';
        floatWindow.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        floatWindow.style.color = 'black';
        floatWindow.style.borderRadius = '10px';
        floatWindow.style.zIndex = '9999';
        floatWindow.style.display = 'flex';
        floatWindow.style.flexDirection = 'column';
        floatWindow.style.alignItems = 'center';
        floatWindow.style.justifyContent = 'center';
        floatWindow.style.textAlign = 'center';
        floatWindow.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.6)';
        floatWindow.style.boxSizing = 'border-box';

        document.body.appendChild(floatWindow);

        // 添加拖动按钮
        var dragHandle = document.createElement('div');
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '10px';
        dragHandle.style.left = '10px';
        dragHandle.style.width = '25px';
        dragHandle.style.height = '25px';
        dragHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '50%';
        floatWindow.appendChild(dragHandle);

        // 添加定时启动输入框
        var timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.style.margin = '15px 0';
        timeInput.style.width = '80%';
        timeInput.style.padding = '10px';
        timeInput.style.borderRadius = '10px';
        timeInput.style.border = '1px solid #ccc';
        timeInput.style.background = 'rgba(255, 255, 255, 0.8)';
        floatWindow.appendChild(timeInput);

        // 添加启动按钮
        var startButton = document.createElement('button');
        startButton.textContent = '立即启动';
        startButton.style.margin = '10px 0';
        startButton.style.padding = '10px 20px';
        startButton.style.border = 'none';
        startButton.style.backgroundColor = '#000';
        startButton.style.color = 'white';
        startButton.style.borderRadius = '10px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontSize = '16px';
        startButton.style.fontWeight = 'bold';
        floatWindow.appendChild(startButton);

        var statusText = document.createElement('div');
        statusText.style.margin = '15px 0';
        statusText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        statusText.style.padding = '10px';
        statusText.style.borderRadius = '10px';
        statusText.style.width = '80%'; // 使其与浮窗大小相匹配
        statusText.style.boxSizing = 'border-box'; // 确保内边距不会影响大小
        floatWindow.appendChild(statusText);

        // 添加URL输入和保存按钮
        for (let i = 1; i <= 2; i++) {
            let urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = '输入URL';
            urlInput.style.margin = '10px 0';
            urlInput.style.width = '80%';
            urlInput.style.padding = '10px';
            urlInput.style.borderRadius = '10px';
            urlInput.style.border = '1px solid #ccc';
            urlInput.style.background = 'rgba(255, 255, 255, 0.8)';
            floatWindow.appendChild(urlInput);

            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.width = '80%';

            let saveButton = document.createElement('button');
            saveButton.textContent = `保存链接`;
            saveButton.style.margin = '10px 0';
            saveButton.style.padding = '10px 20px';
            saveButton.style.border = 'none';
            saveButton.style.backgroundColor = '#000';
            saveButton.style.color = 'white';
            saveButton.style.borderRadius = '10px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.fontSize = '14px';
            saveButton.style.fontWeight = 'bold';
            buttonContainer.appendChild(saveButton);

            let linkButton = document.createElement('button');
            linkButton.textContent = `访问链接`;
            linkButton.style.margin = '10px 0';
            linkButton.style.padding = '10px 20px';
            linkButton.style.border = 'none';
            linkButton.style.backgroundColor = '#000';
            linkButton.style.color = 'white';
            linkButton.style.borderRadius = '10px';
            linkButton.style.cursor = 'pointer';
            linkButton.style.fontSize = '14px';
            linkButton.style.fontWeight = 'bold';
            linkButton.style.display = 'none';
            buttonContainer.appendChild(linkButton);

            floatWindow.appendChild(buttonContainer);

            // 读取已保存的URL
            let savedUrl = localStorage.getItem(`savedUrl$${i}`);
            if (savedUrl) {
                urlInput.value = savedUrl;
                linkButton.style.display = 'block';
                linkButton.onclick = () => { window.location.href = savedUrl; };
            }

            saveButton.onclick = () => {
                let url = urlInput.value;
                if (url) {
                    localStorage.setItem(`savedUrl$${i}`, url);
                    linkButton.style.display = 'block';
                    linkButton.onclick = () => { window.location.href = url; };
                }
            };
        }

        // 使窗口可通过拖动按钮拖动
        dragHandle.onmousedown = function(event) {
            var shiftX = event.clientX - floatWindow.getBoundingClientRect().left;
            var shiftY = event.clientY - floatWindow.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                floatWindow.style.left = pageX - shiftX + 'px';
                floatWindow.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            dragHandle.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                dragHandle.onmouseup = null;
            };

            dragHandle.onmouseleave = function() {
                document.removeEventListener('mousemove', onMouseMove);
                dragHandle.onmouseup = null;
            };
        };

        dragHandle.ondragstart = function() {
            return false;
        };

        // 定时启动功能
        timeInput.addEventListener('change', function() {
            var startTime = this.value;
            statusText.textContent = '脚本将在 ' + startTime + ' 启动';
            var now = new Date();
            var targetTime = new Date();
            var [hours, minutes] = startTime.split(':').map(Number);
            targetTime.setHours(hours, minutes, 0, 0);

            if (targetTime <= now) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            var timeDifference = targetTime - now;
            setTimeout(function() {
                statusText.textContent = '脚本正在运行...';
                startScript();
            }, timeDifference);
        });

        // 启动脚本功能
        startButton.addEventListener('click', function() {
            if (!isRunning) {
                statusText.textContent = '脚本正在运行...';
                startScript();
            }
        });

        return floatWindow;
    }

    function updateFloatingWindow(remainingTime) {
        var floatWindow = document.getElementById('floatWindow');
        var statusText = floatWindow.getElementsByTagName('div')[1];
        statusText.textContent = '下次切歌将在 ' + (remainingTime / 1000).toFixed(1) + ' 秒后进行';
    }

    function startCountdown(interval, callback) {
        var remainingTime = interval;
        var countdownInterval = setInterval(function() {
            remainingTime -= 100;
            updateFloatingWindow(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                callback();
            }
        }, 100);
    }

    function simulatePauseAndPlay() {
        var playPauseBtn = document.querySelector('.btns .ply');
        if (playPauseBtn) {
            playPauseBtn.click();
            setTimeout(() => playPauseBtn.click(), getRandomInterval(2000, 5000));
        }
    }

    function ensurePlaying() {
        var playPauseBtn = document.querySelector('.btns .ply');
        var isPlaying = playPauseBtn.classList.contains('pas');
        if (!isPlaying) {
            playPauseBtn.click();
        }
    }

    function switchSong() {
        var btn = document.querySelector('.nxt');
        if (btn && isRunning) {
            btn.click();
            console.log('已播放:', count++);
            setTimeout(ensurePlaying, 1000);
            var interval = getRandomInterval(30000, 40000);
            startCountdown(interval, switchSong);
        } else if (!btn) {
            console.log('“下一首”按钮未找到');
        }
    }

    function startScript() {
        isRunning = true;
        simulatePauseAndPlay();
        switchSong();
    }

    var floatWindow = createFloatingWindow();
})();
