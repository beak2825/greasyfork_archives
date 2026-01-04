// ==UserScript==
// @name Apple Music 歌词增强
// @namespace https://github.com/akashiwest/AML-Enhancer
// @version 1.200
// @description 为网页版 Apple Music 提供翻译歌词，数据来源为网易云音乐
// @author Akashi
// @license GNU GPL 3.0
// @match https://*.music.apple.com/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/493948/Apple%20Music%20%E6%AD%8C%E8%AF%8D%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493948/Apple%20Music%20%E6%AD%8C%E8%AF%8D%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义扩展和缩小时容器的高度
    const expandedHeight = '240px';
    const minimizedHeight = '130px';

    // 全局变量保存主歌词与翻译歌词数据
    let currentLyrics = [];
    let currentTLyrics = [];

    // 歌词时间偏移量（秒）
    let lyricsOffset = 0;

    // 当前歌曲信息
    let currentSongTitle = '';

    // 偏移存储对象 - 在实际环境中可以改为localStorage
    // 格式: { "歌名": 偏移值(秒) }
    let offsetStorage = {};

    // 存储/读取偏移值的函数
    function saveOffset(songTitle, offset) {
        if (!songTitle) return;

       try {
             let storedOffsets = JSON.parse(localStorage.getItem('lyricsOffsets') || '{}');
             storedOffsets[songTitle] = offset;
             localStorage.setItem('lyricsOffsets', JSON.stringify(storedOffsets));
         } catch (e) {
             console.error('保存歌词偏移失败:', e);
         }
    }

    function loadOffset(songTitle) {
        if (!songTitle) return 0;


         try {
             let storedOffsets = JSON.parse(localStorage.getItem('lyricsOffsets') || '{}');
             return storedOffsets[songTitle] || 0;
         } catch (e) {
             console.error('读取歌词偏移失败:', e);
             return 0;
         }
    }

    // 清除指定歌曲的偏移
    function clearOffset(songTitle) {
        if (!songTitle) return;

         try {
             let storedOffsets = JSON.parse(localStorage.getItem('lyricsOffsets') || '{}');
             delete storedOffsets[songTitle];
             localStorage.setItem('lyricsOffsets', JSON.stringify(storedOffsets));
         } catch (e) {
             console.error('清除歌词偏移失败:', e);
         }
    }

    // 创建固定容器（含内部内容容器）用于显示歌词
    function createLyricsDisplay() {
        const lyricsDiv = document.createElement('div');
        lyricsDiv.id = 'lyrics-display';
        // 默认缩小
        lyricsDiv.dataset.isMinimized = 'true';

        Object.assign(lyricsDiv.style, {
            position: 'fixed',
            right: '20px',
            top: '60px',
            width: '850px',
            height: minimizedHeight,
            overflow: 'hidden',
            borderRadius: '20px',
            backdropFilter: 'saturate(200%) blur(25px)',
            background: 'rgba(250,250,250,0.72)',
            zIndex: '9999',
            padding: '20px 30px',
            fontSize: '28px',
            color: '#565656',
            textAlign: 'center',
            boxShadow: '0 5px 30px rgba(0, 0, 0, 0.4)',
            fontWeight: 'bold',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            // 高度切换的动画效果，仅对 height 生效
            transition: 'height 0.3s ease'
        });

        // 内部容器，滚动时带平滑动画
        const lyricsContent = document.createElement('div');
        lyricsContent.id = 'lyrics-content';
        lyricsContent.style.transition = 'transform 0.3s ease-out';
        lyricsContent.style.transform = 'translateY(0)';
        lyricsDiv.appendChild(lyricsContent);

        const defaultGroup = document.createElement('div');
        defaultGroup.className = 'lyric-group';
        defaultGroup.style.height = '70px';
        defaultGroup.style.marginBottom = '10px';

        const defaultText = document.createElement('div');
        defaultText.className = 'main-lyric';
        defaultText.innerText = 'Apple Music 歌词翻译 v1.2';
        defaultText.style.fontSize = '32px';
        defaultText.style.color = '#252525';
        defaultText.style.fontWeight = 'bold';
        defaultText.style.marginTop = '25px';

        defaultGroup.appendChild(defaultText);
        lyricsContent.appendChild(defaultGroup);
        lyricsDiv.appendChild(lyricsContent);

        // 创建右下角按钮容器
        const rightButtonContainer = document.createElement('div');
        Object.assign(rightButtonContainer.style, {
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '5px',
            alignItems: 'center'
        });

        // 创建左下角按钮容器
        const leftButtonContainer = document.createElement('div');
        Object.assign(leftButtonContainer.style, {
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            gap: '5px',
            alignItems: 'center'
        });

        // 减号按钮
        const minusButton = document.createElement('button');
        minusButton.id = 'minus-button';
        minusButton.innerText = '−';
        Object.assign(minusButton.style, {
            padding: '5px 8px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            background: '#ddd',
            cursor: 'pointer',
            zIndex: '10000',
            opacity: '0.8',
            minWidth: '30px'
        });

        // 偏移显示按钮
        const offsetButton = document.createElement('button');
        offsetButton.id = 'offset-button';
        offsetButton.innerText = '+0.0s';
        Object.assign(offsetButton.style, {
            padding: '5px 10px',
            fontSize: '12px',
            border: 'none',
            borderRadius: '15px',
            background: '#ddd',
            cursor: 'pointer',
            zIndex: '10000',
            opacity: '0.8',
            minWidth: '50px'
        });

        // 加号按钮
        const plusButton = document.createElement('button');
        plusButton.id = 'plus-button';
        plusButton.innerText = '+';
        Object.assign(plusButton.style, {
            padding: '5px 8px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            background: '#ddd',
            cursor: 'pointer',
            zIndex: '10000',
            opacity: '0.8',
            minWidth: '30px'
        });

        // 切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-size-button';
        toggleButton.innerText = '放大';
        Object.assign(toggleButton.style, {
            padding: '5px 10px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '15px',
            background: '#ddd',
            cursor: 'pointer',
            zIndex: '10000',
            opacity: '0.8'
        });

        // 信息按钮
        const infoButton = document.createElement('button');
        infoButton.id = 'info-button';
        infoButton.innerText = 'O';
        Object.assign(infoButton.style, {
            padding: '5px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '15px',
            background: '#ddd',
            cursor: 'pointer',
            zIndex: '10000',
            opacity: '0.3'
        });

        // 更新偏移显示
        function updateOffsetDisplay() {
            const offsetValue = lyricsOffset >= 0 ? `+${lyricsOffset.toFixed(1)}s` : `${lyricsOffset.toFixed(1)}s`;
            offsetButton.innerText = offsetValue;

            // 自动保存当前歌曲的偏移值
            if (currentSongTitle) {
                saveOffset(currentSongTitle, lyricsOffset);
            }
        }

        // 减号按钮事件
        minusButton.addEventListener('click', function(e) {
            e.stopPropagation();
            lyricsOffset -= 0.2;
            updateOffsetDisplay();
        });

        // 偏移按钮事件（点击归零并清除存储）
        offsetButton.addEventListener('click', function(e) {
            e.stopPropagation();
            lyricsOffset = 0;
            updateOffsetDisplay();

            // 清除当前歌曲的存储偏移
            if (currentSongTitle) {
                clearOffset(currentSongTitle);
            }
        });

        // 加号按钮事件
        plusButton.addEventListener('click', function(e) {
            e.stopPropagation();
            lyricsOffset += 0.2;
            updateOffsetDisplay();
        });

        // 切换按钮事件
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (lyricsDiv.dataset.isMinimized === 'true') {
                // 扩展
                lyricsDiv.style.height = expandedHeight;
                lyricsDiv.dataset.isMinimized = 'false';
                toggleButton.innerText = '缩小';
            } else {
                // 缩小
                lyricsDiv.style.height = minimizedHeight;
                lyricsDiv.dataset.isMinimized = 'true';
                toggleButton.innerText = '放大';
            }
        });

        // 信息按钮事件
        infoButton.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open('https://imakashi.com/blog/archives/AML_Enhancer.html', '_blank');
        });

        // 将按钮添加到对应的容器
        rightButtonContainer.appendChild(minusButton);
        rightButtonContainer.appendChild(offsetButton);
        rightButtonContainer.appendChild(plusButton);
        rightButtonContainer.appendChild(toggleButton);

        leftButtonContainer.appendChild(infoButton);

        lyricsDiv.appendChild(rightButtonContainer);
        lyricsDiv.appendChild(leftButtonContainer);

        // 拖拽功能
        lyricsDiv.onmousedown = dragMouseDown;

        let pos3 = 0, pos4 = 0;

        function dragMouseDown(e) {
            // 点击按钮不触发拖拽
            if (e.target === toggleButton || e.target === infoButton ||
                e.target === minusButton || e.target === offsetButton || e.target === plusButton) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            const pos1 = pos3 - e.clientX;
            const pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            lyricsDiv.style.top = `${lyricsDiv.offsetTop - pos2}px`;
            lyricsDiv.style.left = `${lyricsDiv.offsetLeft - pos1}px`;
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        document.body.appendChild(lyricsDiv);
        return lyricsDiv;
    }

    // 根据播放器 title 获取歌曲ID，并调用歌词接口
    function getSongId() {
        const audioPlayer = document.getElementById('apple-music-player');
        if (!audioPlayer) {
            console.log('当前页面未找到音频播放器');
            return;
        }

        let title = audioPlayer.title;
        // 取标题中第一个"-"前面的部分（可根据实际情况调整）
        const secondDashIndex = title.indexOf('-', title.indexOf('-') + 1);
        if (secondDashIndex !== -1) {
            title = title.substring(0, secondDashIndex).trim();
        }

        // 更新当前歌曲标题并加载对应的偏移值
        currentSongTitle = title;
        lyricsOffset = loadOffset(currentSongTitle);

        // 更新显示
        const offsetButton = document.getElementById('offset-button');
        if (offsetButton) {
            const offsetValue = lyricsOffset >= 0 ? `+${lyricsOffset.toFixed(1)}s` : `${lyricsOffset.toFixed(1)}s`;
            offsetButton.innerText = offsetValue;
        }

        showMessage(title);

        const apiUrl = `https://music.163.com/api/search/pc?s=${encodeURIComponent(title)}&offset=0&limit=1&type=1`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            responseType: "json",
            onload: function(response) {
                if (response.status === 200) {
                    const data = response.response;
                    if (data.result && data.result.songs && data.result.songs.length > 0) {
                        const firstSongId = data.result.songs[0].id;
                        getLyrics(firstSongId);
                        console.log(apiUrl, 'ID - ' + firstSongId);
                    } else {
                        showMessage("未找到歌曲");
                    }
                } else {
                    showMessage("请求失败");
                }
            },
            onerror: function() {
                console.error("未知错误");
            }
        });
    }

    // 提示信息
    function showMessage(msg) {
        const lyricsContent = document.getElementById('lyrics-content');
        if (lyricsContent) {
            const messageGroup = document.createElement('div');
            messageGroup.className = 'lyric-group';
            messageGroup.style.height = '70px';
            messageGroup.style.marginBottom = '10px';

            const messageText = document.createElement('div');
            messageText.className = 'main-lyric';
            messageText.innerText = msg;
            messageText.style.fontSize = '32px';
            messageText.style.color = '#252525';
            messageText.style.fontWeight = 'bold';
            messageText.style.filter = 'blur(0) !important';

            // 添加容器样式以确保垂直居中
            messageGroup.style.display = 'flex';
            messageGroup.style.alignItems = 'center';
            messageGroup.style.justifyContent = 'center';
            messageGroup.style.height = '100%';
            messageGroup.style.marginTop = '25px';

            messageGroup.appendChild(messageText);
            lyricsContent.innerHTML = '';
            lyricsContent.appendChild(messageGroup);
        }
    }

    // 获取歌词（同时获取主歌词和翻译歌词）并解析后渲染
    function getLyrics(songId) {
        const apiUrl = `https://music.163.com/api/song/lyric?lv=1&kv=1&tv=-1&id=${songId}`;
        showMessage('歌词正在加载中 ...');

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            responseType: "json",
            onload: function(response) {
                if (response.status === 200) {
                    const data = response.response;
                    if (!data || (!data.lrc && !data.tlyric)) {
                        showMessage('未找到匹配歌词');
                        currentLyrics = [];
                        currentTLyrics = [];
                        return;
                    }

                    const lyricsLines = data.lrc ? data.lrc.lyric : "";
                    const tlyricsLines = data.tlyric ? data.tlyric.lyric : "";

                    currentLyrics = parseLyrics(lyricsLines);
                    currentTLyrics = parseLyrics(tlyricsLines);

                    if (currentLyrics.length === 0) {
                        showMessage('暂无歌词');
                        return;
                    }

                    renderLyrics();

                    const audioPlayer = document.getElementById('apple-music-player');
                    if (audioPlayer) {
                        audioPlayer.dataset.songId = songId;
                    }
                } else {
                    showMessage('歌词获取失败');
                    currentLyrics = [];
                    currentTLyrics = [];
                }
            },
            onerror: function(err) {
                console.error(err);
                showMessage('歌词获取失败');
                currentLyrics = [];
                currentTLyrics = [];
            }
        });
    }

    // 解析歌词文本（格式：[mm:ss.xxx]歌词内容）
    function parseLyrics(lyricsText) {
        return lyricsText.split('\n').filter(line => line.trim() !== '').map(line => {
            const matches = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/);
            if (matches) {
                const minutes = parseInt(matches[1], 10);
                const seconds = parseInt(matches[2], 10);
                let milliseconds = matches[3] ? parseInt(matches[3], 10) : 0;

                if (milliseconds < 100 && milliseconds >= 10) {
                    milliseconds *= 10;
                }

                const text = matches[4].trim();
                const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;

                return { startTime: totalSeconds, text: text };
            }
        }).filter(Boolean);
    }

    // 渲染歌词：每组歌词显示为两行（主歌词及对应翻译），每组之间有间隙
    function renderLyrics() {
        const lyricsContent = document.getElementById('lyrics-content');
        if (!lyricsContent) return;

        lyricsContent.innerHTML = '';
        const groupHeight = 70; // 每组固定高度（包括两行与间隙）

        currentLyrics.forEach((lyric, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'lyric-group';
            groupDiv.dataset.index = index;
            groupDiv.style.height = groupHeight + 'px';
            groupDiv.style.marginBottom = '10px';

            // 主歌词行
            const mainDiv = document.createElement('div');
            mainDiv.className = 'main-lyric';
            mainDiv.innerText = lyric.text;
            mainDiv.style.fontSize = '28px';
            mainDiv.style.color = '#565656';

            // 匹配翻译歌词
            let translationText = "";
            if (currentTLyrics && currentTLyrics.length > 0) {
                const tLine = currentTLyrics.find(t => Math.abs(t.startTime - lyric.startTime) < 0.5);
                if (tLine) {
                    translationText = tLine.text;
                }
            }

            const transDiv = document.createElement('div');
            transDiv.className = 'translation-lyric';
            transDiv.innerText = translationText;
            transDiv.style.fontSize = '20px';
            transDiv.style.color = '#888';
            transDiv.style.marginTop = '5px';

            groupDiv.appendChild(mainDiv);
            groupDiv.appendChild(transDiv);
            lyricsContent.appendChild(groupDiv);
        });
    }

    // 当前歌词高亮
    function updateLyricScroll(currentTime) {
        if (currentLyrics.length === 0) return;

        // 应用时间偏移
        const adjustedTime = currentTime + lyricsOffset;

        let currentIndex = 0;
        for (let i = 0; i < currentLyrics.length; i++) {
            if (adjustedTime >= currentLyrics[i].startTime) {
                currentIndex = i;
            } else {
                break;
            }
        }

        const lyricsContent = document.getElementById('lyrics-content');
        if (lyricsContent === null) return;

        const groups = lyricsContent.getElementsByClassName('lyric-group');
        for (let i = 0; i < groups.length; i++) {
            const mainDiv = groups[i].querySelector('.main-lyric');
            const transDiv = groups[i].querySelector('.translation-lyric');
            if (!mainDiv || !transDiv) continue;

            if (i === currentIndex) {
                mainDiv.style.color = '#252525';
                mainDiv.style.fontWeight = 'bold';
                mainDiv.style.fontSize = '32px';
                mainDiv.style.filter = 'blur(0)';
                transDiv.style.filter = 'blur(0)';
                transDiv.style.color = '#353535';
                transDiv.style.fontWeight = 'bold';
                transDiv.style.fontSize = '24px';
            } else {
                mainDiv.style.color = '#565656';
                mainDiv.style.filter = 'blur(3px)';
                mainDiv.style.marginTop = '20px';
                mainDiv.style.fontWeight = 'normal';
                mainDiv.style.fontSize = '28px';
                transDiv.style.filter = 'blur(3px)';
                transDiv.style.color = '#888';
                transDiv.style.fontWeight = 'normal';
                transDiv.style.fontSize = '20px';
            }
        }

        // 计算滚动偏移（groupHeight + 下边距），不知道怎么调的，反正按照现在这样数值设置了看着还可以
        const groupHeight = 90;
        const container = document.getElementById('lyrics-display');
        const containerHeight = container.clientHeight;
        const offset = (currentIndex * groupHeight) - (containerHeight / 2 - groupHeight / 2) + 30;

        const lyricsContentDiv = document.getElementById('lyrics-content');
        lyricsContentDiv.style.transform = `translateY(-${offset}px)`;
    }

    const lyricsDisplay = createLyricsDisplay();

    // 更新滚动
    document.addEventListener('timeupdate', function(event) {
        const audioPlayer = event.target;
        if (audioPlayer.id === 'apple-music-player') {
            const startOffset = parseFloat(audioPlayer.dataset.startOffset) || 0;
            const effectiveTime = audioPlayer.currentTime - startOffset;
            updateLyricScroll(effectiveTime);
        }
    }, true);

    // 每秒检测歌曲标题变化（切歌）
    setInterval(function() {
        const audioPlayer = document.getElementById('apple-music-player');
        if (audioPlayer) {
            let title = audioPlayer.title;
            if (title) {
                const secondDashIndex = title.indexOf('-', title.indexOf('-') + 1);
                if (secondDashIndex !== -1) {
                    title = title.substring(0, secondDashIndex).trim();
                }

                if (title !== audioPlayer.dataset.lastTitle) {
                    audioPlayer.dataset.lastTitle = title;
                    audioPlayer.dataset.startOffset = audioPlayer.currentTime;

                    const lyricsContent = document.getElementById('lyrics-content');
                    if (lyricsContent) {
                        lyricsContent.innerHTML = '';
                    }
                    getSongId();
                }
            }
        }
    }, 1000);

    // 当前曲播放结束时也尝试重新获取歌词（适用于自动切换下一曲）
    const audioPlayer = document.getElementById('apple-music-player');
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', function() {
            setTimeout(() => {
                audioPlayer.dataset.startOffset = audioPlayer.currentTime;
                getSongId();
            }, 500);
        });
    }
})();