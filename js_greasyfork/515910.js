// ==UserScript==
// @name        网易云自动刷歌
// @namespace   https://diyworld.me/
// @version     0.1.9
// @description 网易云刷听歌量，输入运行时间和停止时间，循环执行，并且可以暂停任务，界面改为底部长条形布局，并且可以保存两个访问链接。
// @author      diyworld
// @match       https://music.163.com/
// @match       https://music.163.com/#/discover/recommend/taste
// @match       https://music.163.com/store/product
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515910/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/515910/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.meta.js
// ==/UserScript==


;(function () {
    var count = 1;
    var intervals = [];
    var isRunning = localStorage.getItem('isRunning') === 'true';
    var currentState = localStorage.getItem('currentState') || '';
    var stateStartTime = parseInt(localStorage.getItem('stateStartTime')) || 0;
    var runTime = parseInt(localStorage.getItem('runTime')) || 120 * 60;
    var stopTime = parseInt(localStorage.getItem('stopTime')) || 30 * 60;
    var songSwitchMinTime = parseInt(localStorage.getItem('songSwitchMinTime')) || 100;
    var songSwitchMaxTime = parseInt(localStorage.getItem('songSwitchMaxTime')) || 120;
    var artistList = [52139261];

    function getRandomInterval(min, max) {
        min = parseInt(min);
        max = parseInt(max);
        if (isNaN(min) || isNaN(max) || min > max) {
            return 30 * 100; // 默认值
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createFloatingWindow() {
        var floatWindow = document.createElement('div');
        floatWindow.id = 'floatWindow';
        floatWindow.style.position = 'fixed';
        floatWindow.style.top = '0px';
        floatWindow.style.left = '0px';
        floatWindow.style.width = '100%';
        floatWindow.style.height = 'auto';
        floatWindow.style.padding = '10px';
        floatWindow.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        floatWindow.style.color = 'black';
        floatWindow.style.borderTop = '1px solid #ccc';
        floatWindow.style.zIndex = '9999';
        floatWindow.style.display = 'flex';
        floatWindow.style.flexDirection = 'row';
        floatWindow.style.alignItems = 'center';
        floatWindow.style.justifyContent = 'flex-start';
        floatWindow.style.boxSizing = 'border-box';
        floatWindow.style.overflowX = 'auto';
        floatWindow.style.whiteSpace = 'nowrap';

        document.body.appendChild(floatWindow);

        // 添加运行时间输入框
        var runTimeInput = document.createElement('input');
        runTimeInput.type = 'number';
        runTimeInput.min = '1';
        runTimeInput.placeholder = '运行时间(秒)';
        runTimeInput.style.width = '80px';
        runTimeInput.style.margin = '0 5px';
        runTimeInput.style.padding = '5px';
        runTimeInput.style.borderRadius = '5px';
        runTimeInput.style.border = '1px solid #ccc';
        runTimeInput.style.background = 'rgba(255, 255, 255, 0.8)';

        floatWindow.appendChild(runTimeInput);

        // 添加停止时间输入框
        var stopTimeInput = document.createElement('input');
        stopTimeInput.type = 'number';
        stopTimeInput.min = '1';
        stopTimeInput.placeholder = '停止时间(秒)';
        stopTimeInput.style.width = '80px';
        stopTimeInput.style.margin = '0 5px';
        stopTimeInput.style.padding = '5px';
        stopTimeInput.style.borderRadius = '5px';
        stopTimeInput.style.border = '1px solid #ccc';
        stopTimeInput.style.background = 'rgba(255, 255, 255, 0.8)';

        floatWindow.appendChild(stopTimeInput);

        // 添加页面刷新时间输入框
        var refreshTimeInput = document.createElement('input');
        refreshTimeInput.type = 'number';
        refreshTimeInput.min = '10'; // 最小刷新时间设为10秒，避免过于频繁的刷新
        refreshTimeInput.placeholder = '页面刷新时间(秒)';
        refreshTimeInput.style.width = '120px';
        refreshTimeInput.style.margin = '0 5px';
        refreshTimeInput.style.padding = '5px';
        refreshTimeInput.style.borderRadius = '5px';
        refreshTimeInput.style.border = '1px solid #ccc';
        refreshTimeInput.style.background = 'rgba(255, 255, 255, 0.8)';
        floatWindow.appendChild(refreshTimeInput);

        // 读取已保存的页面刷新时间
        var savedRefreshTime = parseInt(localStorage.getItem('refreshTime')) || 1800; // 默认600秒
        refreshTimeInput.value = savedRefreshTime;

        // 保存输入的页面刷新时间
        refreshTimeInput.addEventListener('input', function() {
            var refreshTime = parseInt(this.value) || 600;
            localStorage.setItem('refreshTime', refreshTime);
        });


        // 读取已保存的运行和停止时间
        if (runTime) {
            runTimeInput.value = runTime;
        }
        if (stopTime) {
            stopTimeInput.value = stopTime;
        }

        // 保存输入的运行和停止时间
        runTimeInput.addEventListener('input', function() {
            localStorage.setItem('runTime', this.value);
            runTime = parseInt(this.value) || 0;
        });

        stopTimeInput.addEventListener('input', function() {
            localStorage.setItem('stopTime', this.value);
            stopTime = parseInt(this.value) || 0;
        });

        // 添加切歌最小时间输入框
        var songSwitchMinTimeInput = document.createElement('input');
        songSwitchMinTimeInput.type = 'number';
        songSwitchMinTimeInput.min = '1';
        songSwitchMinTimeInput.placeholder = '切歌最小时间(秒)';
        songSwitchMinTimeInput.style.width = '120px';
        songSwitchMinTimeInput.style.margin = '0 5px';
        songSwitchMinTimeInput.style.padding = '5px';
        songSwitchMinTimeInput.style.borderRadius = '5px';
        songSwitchMinTimeInput.style.border = '1px solid #ccc';
        songSwitchMinTimeInput.style.background = 'rgba(255, 255, 255, 0.8)';

        floatWindow.appendChild(songSwitchMinTimeInput);

        // 添加切歌最大时间输入框
        var songSwitchMaxTimeInput = document.createElement('input');
        songSwitchMaxTimeInput.type = 'number';
        songSwitchMaxTimeInput.min = '1';
        songSwitchMaxTimeInput.placeholder = '切歌最大时间(秒)';
        songSwitchMaxTimeInput.style.width = '120px';
        songSwitchMaxTimeInput.style.margin = '0 5px';
        songSwitchMaxTimeInput.style.padding = '5px';
        songSwitchMaxTimeInput.style.borderRadius = '5px';
        songSwitchMaxTimeInput.style.border = '1px solid #ccc';
        songSwitchMaxTimeInput.style.background = 'rgba(255, 255, 255, 0.8)';

        floatWindow.appendChild(songSwitchMaxTimeInput);

        // 读取已保存的切歌最小和最大时间
        if (songSwitchMinTime) {
            songSwitchMinTimeInput.value = songSwitchMinTime;
        }
        if (songSwitchMaxTime) {
            songSwitchMaxTimeInput.value = songSwitchMaxTime;
        }

        // 保存输入的切歌最小和最大时间
        songSwitchMinTimeInput.addEventListener('input', function() {
            localStorage.setItem('songSwitchMinTime', this.value);
            songSwitchMinTime = parseInt(this.value) || 1;
        });

        songSwitchMaxTimeInput.addEventListener('input', function() {
            localStorage.setItem('songSwitchMaxTime', this.value);
            songSwitchMaxTime = parseInt(this.value) || 1;
        });

        // 添加启动和暂停按钮
        var startButton = document.createElement('button');
        startButton.textContent = '立即启动';
        startButton.style.margin = '0 5px';
        startButton.style.padding = '5px 10px';
        startButton.style.border = 'none';
        startButton.style.backgroundColor = '#000';
        startButton.style.color = 'white';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontSize = '14px';
        startButton.style.fontWeight = 'bold';

        var pauseButton = document.createElement('button');
        pauseButton.textContent = '暂停任务';
        pauseButton.style.margin = '0 5px';
        pauseButton.style.padding = '5px 10px';
        pauseButton.style.border = 'none';
        pauseButton.style.backgroundColor = '#000';
        pauseButton.style.color = 'white';
        pauseButton.style.borderRadius = '5px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.style.fontSize = '14px';
        pauseButton.style.fontWeight = 'bold';
        pauseButton.style.display = 'none';

        floatWindow.appendChild(startButton);
        floatWindow.appendChild(pauseButton);

        var statusText = document.createElement('div');
        statusText.style.margin = '0 10px';
        statusText.style.padding = '5px';
        statusText.style.borderRadius = '5px';
        statusText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        statusText.style.color = 'white';
        statusText.style.fontSize = '14px';

        floatWindow.appendChild(statusText);

        // 添加更新歌单操作按钮
        var updatePlaylistButton = document.createElement('button');
        updatePlaylistButton.textContent = '更新歌单';
        updatePlaylistButton.style.margin = '0 5px';
        updatePlaylistButton.style.padding = '5px 10px';
        updatePlaylistButton.style.border = 'none';
        updatePlaylistButton.style.backgroundColor = '#4CAF50'; // 绿色按钮
        updatePlaylistButton.style.color = 'white';
        updatePlaylistButton.style.borderRadius = '5px';
        updatePlaylistButton.style.cursor = 'pointer';
        updatePlaylistButton.style.fontSize = '14px';
        updatePlaylistButton.style.fontWeight = 'bold';
        floatWindow.appendChild(updatePlaylistButton);

        // 添加URL输入和保存按钮
        for (let i = 1; i <= 2; i++) {
            let urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = '输入URL' + i;
            urlInput.style.margin = '0 5px';
            urlInput.style.width = '200px';
            urlInput.style.padding = '5px';
            urlInput.style.borderRadius = '5px';
            urlInput.style.border = '1px solid #ccc';
            urlInput.style.background = 'rgba(255, 255, 255, 0.8)';
            floatWindow.appendChild(urlInput);

            let saveButton = document.createElement('button');
            saveButton.textContent = '保存链接';
            saveButton.style.margin = '0 5px';
            saveButton.style.padding = '5px 10px';
            saveButton.style.border = 'none';
            saveButton.style.backgroundColor = '#000';
            saveButton.style.color = 'white';
            saveButton.style.borderRadius = '5px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.fontSize = '14px';
            saveButton.style.fontWeight = 'bold';

            floatWindow.appendChild(saveButton);

            let linkButton = document.createElement('button');
            linkButton.textContent = '访问链接';
            linkButton.style.margin = '0 5px';
            linkButton.style.padding = '5px 10px';
            linkButton.style.border = 'none';
            linkButton.style.backgroundColor = '#000';
            linkButton.style.color = 'white';
            linkButton.style.borderRadius = '5px';
            linkButton.style.cursor = 'pointer';
            linkButton.style.fontSize = '14px';
            linkButton.style.fontWeight = 'bold';
            linkButton.style.display = 'none';

            floatWindow.appendChild(linkButton);

            // 读取已保存的URL
            let savedUrl = localStorage.getItem(`savedUrl${i}`);
            if (savedUrl) {
                urlInput.value = savedUrl;
                linkButton.style.display = 'inline-block';
                linkButton.onclick = () => { window.location.href = savedUrl; };
            }

            saveButton.onclick = () => {
                let url = urlInput.value;
                if (url) {
                    localStorage.setItem(`savedUrl${i}`, url);
                    linkButton.style.display = 'inline-block';
                    linkButton.onclick = () => { window.location.href = url; };
                }
            };
        }

        // 启动脚本功能
        startButton.addEventListener('click', function() {
            if (!isRunning) {
                isRunning = true;
                localStorage.setItem('isRunning', 'true');
                startButton.style.display = 'none';
                pauseButton.style.display = 'inline-block';
                statusText.textContent = '脚本正在运行...';
                startRunState();
            }
        });

        // 暂停脚本功能
        pauseButton.addEventListener('click', function() {
            isRunning = false;
            localStorage.setItem('isRunning', 'false');
            statusText.textContent = '任务已暂停';
            pauseButton.style.display = 'none';
            startButton.style.display = 'inline-block';
            clearAllIntervals();
        });

        // 根据运行状态设置按钮显示
        if (isRunning) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'inline-block';
        } else {
            startButton.style.display = 'inline-block';
            pauseButton.style.display = 'none';
        }

        // 更新歌单点击事件
        updatePlaylistButton.addEventListener('click', function() {
            var panelButton = document.querySelector('[data-action="panel"]');
            if (panelButton) {
                panelButton.click();
                var clearButton = document.querySelector('[data-action="clear"]');
                if (clearButton) {
                    clearButton.click();
                }
            }

            var savedUrl1 = localStorage.getItem('savedUrl1');
            var savedUrl2 = localStorage.getItem('savedUrl2');

            if (savedUrl1) {
                window.location.href = savedUrl1;
                setTimeout(function() {
                    var iframe = document.getElementById('g_iframe');
                    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    var addButton1 = iframeDocument.querySelector('#recommend-ctn > div.g-mn4 > div > div > div.n-daily > div.btnwrap.f-cb.j-flag > div > a.u-btni.u-btni-add');
                    if (addButton1) {
                        addButton1.click();
                    }

                    if (savedUrl2) {
                        setTimeout(function() {
                            window.location.href = savedUrl2;
                            setTimeout(function() {
                                var iframe = document.getElementById('g_iframe');
                                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                                var addButton2 = iframeDocument.querySelector('#content-operation > a.u-btni.u-btni-add');
                                if (addButton2) {
                                    addButton2.click();
                                }

                                // 最后跳转回 savedUrl1
                                setTimeout(function() {
                                    window.location.href = savedUrl1;
                                }, 4000); // 延迟2秒，确保第二个操作已完成
                            }, 4000); // 延迟1秒等待页面加载和脚本执行
                        }, 8000); // 5秒后跳转到 savedUrl2
                    }
                }, 4000); // 延迟1秒等待页面加载和脚本执行
            }
        });


        return {
            statusText: statusText,
            runTimeInput: runTimeInput,
            stopTimeInput: stopTimeInput,
            songSwitchMinTimeInput: songSwitchMinTimeInput,
            songSwitchMaxTimeInput: songSwitchMaxTimeInput,
            startButton: startButton,
            pauseButton: pauseButton
        };
    }

    function clearAllIntervals() {
        intervals.forEach(function(id) {
            clearInterval(id);
        });
        intervals = [];
    }

    function simulatePauseAndPlay() {
        var playPauseBtn = document.querySelector('.btns .ply');
        if (playPauseBtn) {
            // 获取 data-action 属性
            var action = playPauseBtn.dataset.action;
            if (action === 'play') {
                // 如果 data-action 属性是 'play'，则点击按钮
                playPauseBtn.click();
            } else {
                // 如果 data-action 不是 'play'，则不执行任何操作
                console.log('正在播放，未执行点击。');
            }
        }
    }

    // function ensurePlaying() {
    //     var playPauseBtn = document.querySelector('.btns .ply');
    //     var isPlaying = playPauseBtn.classList.contains('pas');
    //     if (!isPlaying) {
    //         playPauseBtn.click();
    //     }
    // }

    function switchSong() {
        if (!isRunning) return;
        simulatePauseAndPlay()

        // 获取当前播放的歌曲的作者ID
        var artistLink = document.querySelector('#g_player > div:nth-child(3) > div:nth-child(1) > span > span > a');
        if (artistLink && artistLink.getAttribute('href')) {
            var href = artistLink.getAttribute('href');
            var currentSongIdMatch = href.match(/id=(\d+)/);
            if (currentSongIdMatch && currentSongIdMatch[1]) {
                var currentSongId = parseInt(currentSongIdMatch[1]);
                if (artistList.includes(currentSongId)) {
                    console.log('当前歌曲在 artistList 中，跳过切歌');
                    return; // 跳过切歌
                }
            }
        }

        var btn = document.querySelector('.nxt');
        if (btn) {
            btn.click();
            console.log('已播放:', count++);
            setTimeout(simulatePauseAndPlay, 1000);
        } else {
            console.log('“下一首”按钮未找到');
        }
    }

    function startRunState() {
        if (!isRunning) return;
        localStorage.setItem('currentState', 'run');
        localStorage.setItem('stateStartTime', Date.now());
        if (window.location.href !== 'https://music.163.com/#/discover/recommend/taste') {
            window.location.href = 'https://music.163.com/#/discover/recommend/taste';
        } else {
            statusText.textContent = '脚本正在运行...';
            // simulatePauseAndPlay();
            switchSong(); // 立即切歌
            var songSwitchInterval = setInterval(function() {
                if (!isRunning) {
                    clearInterval(songSwitchInterval);
                    intervals.splice(intervals.indexOf(songSwitchInterval), 1);
                    return;
                }
                switchSong();
            }, getRandomInterval(songSwitchMinTime * 1000, songSwitchMaxTime * 1000));
            intervals.push(songSwitchInterval);

            var runDuration = runTime * 1000;
            var runStateInterval = setInterval(function() {
                var elapsed = Date.now() - stateStartTime;
                if (elapsed >= runDuration) {
                    clearInterval(runStateInterval);
                    intervals.splice(intervals.indexOf(runStateInterval), 1);
                    clearInterval(songSwitchInterval);
                    intervals.splice(intervals.indexOf(songSwitchInterval), 1);
                    if (isRunning) {
                        startStopState();
                    }
                }
            }, 1000);
            intervals.push(runStateInterval);
        }
    }

    function startStopState() {
        if (!isRunning) return;
        localStorage.setItem('currentState', 'stop');
        localStorage.setItem('stateStartTime', Date.now());
        if (window.location.href !== 'https://music.163.com/store/product') {
            window.location.href = 'https://music.163.com/store/product';
        } else {
            statusText.textContent = '进入停止状态';
            var stopDuration = stopTime * 1000;
            var stopStateInterval = setInterval(function() {
                var elapsed = Date.now() - stateStartTime;
                if (elapsed >= stopDuration) {
                    clearInterval(stopStateInterval);
                    intervals.splice(intervals.indexOf(stopStateInterval), 1);
                    if (isRunning) {
                        startRunState();
                    }
                }
            }, 1000);
            intervals.push(stopStateInterval);
        }
    }

    function initializeScript() {
        if (!isRunning) {
            statusText.textContent = '脚本已暂停';
            return;
        }

        var refreshTime = parseInt(localStorage.getItem('refreshTime')) || 600;
        setInterval(function() {
            window.location.reload();
        }, refreshTime * 1000); // 将时间转换为毫秒

        if (currentState === 'run') {
            if (window.location.href !== 'https://music.163.com/#/discover/recommend/taste') {
                window.location.href = 'https://music.163.com/#/discover/recommend/taste';
                return;
            }
            statusText.textContent = '脚本正在运行...';
            // simulatePauseAndPlay();
            switchSong();

            var songSwitchInterval = setInterval(function() {
                if (!isRunning) {
                    clearInterval(songSwitchInterval);
                    intervals.splice(intervals.indexOf(songSwitchInterval), 1);
                    return;
                }
                switchSong();
            }, getRandomInterval(songSwitchMinTime * 1000, songSwitchMaxTime * 1000));
            intervals.push(songSwitchInterval);

            var runDuration = runTime * 1000;
            var runStateInterval = setInterval(function() {
                var elapsed = Date.now() - stateStartTime;
                if (elapsed >= runDuration) {
                    clearInterval(runStateInterval);
                    intervals.splice(intervals.indexOf(runStateInterval), 1);
                    clearInterval(songSwitchInterval);
                    intervals.splice(intervals.indexOf(songSwitchInterval), 1);
                    if (isRunning) {
                        startStopState();
                    }
                }
            }, 1000);
            intervals.push(runStateInterval);
        } else if (currentState === 'stop') {
            if (window.location.href !== 'https://music.163.com/store/product') {
                window.location.href = 'https://music.163.com/store/product';
                return;
            }
            statusText.textContent = '进入停止状态';
            var stopDuration = stopTime * 1000;
            var stopStateInterval = setInterval(function() {
                var elapsed = Date.now() - stateStartTime;
                if (elapsed >= stopDuration) {
                    clearInterval(stopStateInterval);
                    intervals.splice(intervals.indexOf(stopStateInterval), 1);
                    if (isRunning) {
                        startRunState();
                    }
                }
            }, 1000);
            intervals.push(stopStateInterval);
        } else {
            // 无状态，重新开始
            startRunState();
        }
    }

    var floatWindowElements = createFloatingWindow();
    var statusText = floatWindowElements.statusText;
    var runTimeInput = floatWindowElements.runTimeInput;
    var stopTimeInput = floatWindowElements.stopTimeInput;
    var startButton = floatWindowElements.startButton;
    var pauseButton = floatWindowElements.pauseButton;

    // 初始化脚本
    initializeScript();

})();
