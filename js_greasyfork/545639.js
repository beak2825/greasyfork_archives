// ==UserScript==
// @name         必应积分自动搜索
// @namespace    http://tampermonkey.net/
// @version      v2.6.5
// @description  必应积分自动搜索是一款自动化执行必应搜索任务、获取积分的油猴脚本，支持PC和移动端，自动获取热词并模拟真实用户搜索与浏览行为。
// @author       Joker
// @match        https://cn.bing.com/*
// @license      GNU GPLv3
// @icon         https://cn.bing.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      rebang.today
// @downloadURL https://update.greasyfork.org/scripts/545639/%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/545639/%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局状态变量
    let isRunning = false;
    let isPaused = false;
    let countdownInterval = null;
    let currentSearchCount = 0;
    let totalSearches = 0;
    let hotWords = [];
    let deviceType = '';
    let sessionTotalSearches = 0;
    let isFirstSearch = true;
    let hotWordFetchTimeout = null;
    let scrollInterval = null;

    // 创建控制面板 - 优化手机端显示位置和大小
    function createControlPanel() {
        // 先移除已存在的面板
        const existingPanel = document.getElementById('autoSearchControlPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.padding = '15px';
        panel.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
        panel.style.zIndex = '999999';
        panel.id = 'autoSearchControlPanel';

        // 检测设备类型，调整面板大小和位置
        const isMobile = detectDeviceType() === 'mobile';
        if (isMobile) {
            // 手机端：占满屏幕宽度的90%，居中显示
            panel.style.width = '90%';
            panel.style.left = '5%';
            panel.style.top = '50%';
            panel.style.transform = 'translateY(-50%)';
            panel.style.maxHeight = '80vh';
            panel.style.overflowY = 'auto';
        } else {
            // PC端：固定宽度，右上角显示
            panel.style.width = '280px';
            panel.style.right = '20px';
            panel.style.top = '20px';
        }

        // 标题
        const title = document.createElement('h3');
        title.textContent = '必应自动搜索控制';
        title.style.margin = '0 0 15px 0';
        title.style.fontSize = '18px';
        title.style.textAlign = 'center';
        title.style.color = '#333';
        panel.appendChild(title);

        // 状态显示
        const statusDiv = document.createElement('div');
        statusDiv.id = 'autoSearchStatus';
        statusDiv.style.margin = '0 0 15px 0';
        statusDiv.style.padding = '12px';
        statusDiv.style.backgroundColor = '#f5f5f5';
        statusDiv.style.borderRadius = '6px';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.fontSize = '16px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.color = '#555';
        statusDiv.textContent = '未运行';
        panel.appendChild(statusDiv);

        // 进度显示
        const progressDiv = document.createElement('div');
        progressDiv.id = 'autoSearchProgress';
        progressDiv.style.margin = '0 0 15px 0';
        progressDiv.style.textAlign = 'center';
        progressDiv.style.fontSize = '15px';
        progressDiv.style.color = '#666';
        progressDiv.textContent = '进度: 0/0';
        panel.appendChild(progressDiv);

        // 按钮容器
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.justifyContent = 'center';

        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = 'startSearchBtn';
        startBtn.textContent = '开始搜索';
        startBtn.style.padding = '8px 16px';
        startBtn.style.backgroundColor = '#4CAF50';
        startBtn.style.color = 'white';
        startBtn.style.border = 'none';
        startBtn.style.borderRadius = '6px';
        startBtn.style.cursor = 'pointer';
        startBtn.style.fontSize = '14px';
        startBtn.style.fontWeight = 'bold';
        startBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        startBtn.style.transition = 'all 0.2s ease';
        startBtn.addEventListener('mouseover', () => startBtn.style.transform = 'translateY(-2px)');
        startBtn.addEventListener('mouseout', () => startBtn.style.transform = 'translateY(0)');
        startBtn.addEventListener('click', startSearch);
        buttonsDiv.appendChild(startBtn);

        // 暂停按钮
        const pauseBtn = document.createElement('button');
        pauseBtn.id = 'pauseSearchBtn';
        pauseBtn.textContent = '暂停';
        pauseBtn.style.padding = '8px 16px';
        pauseBtn.style.backgroundColor = '#ff9800';
        pauseBtn.style.color = 'white';
        pauseBtn.style.border = 'none';
        pauseBtn.style.borderRadius = '6px';
        pauseBtn.style.cursor = 'pointer';
        pauseBtn.style.fontSize = '14px';
        pauseBtn.style.fontWeight = 'bold';
        pauseBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        pauseBtn.style.transition = 'all 0.2s ease';
        pauseBtn.disabled = true;
        pauseBtn.addEventListener('mouseover', () => !pauseBtn.disabled && (pauseBtn.style.transform = 'translateY(-2px)'));
        pauseBtn.addEventListener('mouseout', () => !pauseBtn.disabled && (pauseBtn.style.transform = 'translateY(0)'));
        pauseBtn.addEventListener('click', togglePause);
        buttonsDiv.appendChild(pauseBtn);

        // 结束按钮
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stopSearchBtn';
        stopBtn.textContent = '结束';
        stopBtn.style.padding = '8px 16px';
        stopBtn.style.backgroundColor = '#f44336';
        stopBtn.style.color = 'white';
        stopBtn.style.border = 'none';
        stopBtn.style.borderRadius = '6px';
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.fontSize = '14px';
        stopBtn.style.fontWeight = 'bold';
        stopBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        stopBtn.style.transition = 'all 0.2s ease';
        stopBtn.disabled = true;
        stopBtn.addEventListener('mouseover', () => !stopBtn.disabled && (stopBtn.style.transform = 'translateY(-2px)'));
        stopBtn.addEventListener('mouseout', () => !stopBtn.disabled && (stopBtn.style.transform = 'translateY(0)'));
        stopBtn.addEventListener('click', stopSearch);
        buttonsDiv.appendChild(stopBtn);

        panel.appendChild(buttonsDiv);
        document.body.appendChild(panel);

        // 确保面板可见
        panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    // 更新状态显示
    function updateStatus(text) {
        const statusDiv = document.getElementById('autoSearchStatus');
        if (statusDiv) {
            statusDiv.textContent = text;

            // 根据状态设置不同颜色
            if (text.includes('运行中') || text.includes('搜索中') || text.includes('等待')) {
                statusDiv.style.backgroundColor = '#e8f5e9';
                statusDiv.style.color = '#2e7d32';
            } else if (text.includes('已暂停')) {
                statusDiv.style.backgroundColor = '#fff8e1';
                statusDiv.style.color = '#ff8f00';
            } else if (text.includes('已停止') || text.includes('未运行')) {
                statusDiv.style.backgroundColor = '#ffebee';
                statusDiv.style.color = '#c62828';
            } else if (text.includes('完成')) {
                statusDiv.style.backgroundColor = '#e3f2fd';
                statusDiv.style.color = '#1565c0';
            } else {
                statusDiv.style.backgroundColor = '#f5f5f5';
                statusDiv.style.color = '#555';
            }
        }
    }

    // 更新进度显示
    function updateProgress(current, total) {
        const progressDiv = document.getElementById('autoSearchProgress');
        if (progressDiv) {
            progressDiv.textContent = `进度: ${current}/${total}`;
            localStorage.setItem('bingAutoSearchProgress', JSON.stringify({
                current: current,
                total: total,
                timestamp: new Date().getTime()
            }));
        }
    }

    // 检测设备类型
    function detectDeviceType() {
        const userAgent = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(userAgent) ? 'mobile' : 'pc';
    }

    // 热词智能精简处理
    function optimizeHotWord(word) {
        let optimized = word.trim().replace(/^[【】()（）[]]+|[【】()（）[]]+$/g, '');

        const separators = /[，,。.？?！!：:;；—-]/;
        if (separators.test(optimized)) {
            const parts = optimized.split(separators);
            optimized = parts[0].trim();
        }

        const maxLength = deviceType === 'pc' ? 12 : 10;
        const minLength = deviceType === 'pc' ? 3 : 2;

        if (optimized.length > maxLength) {
            const cutPoints = [
                optimized.lastIndexOf(' ', maxLength),
                optimized.lastIndexOf('，', maxLength),
                optimized.lastIndexOf('的', maxLength)
            ].filter(pos => pos > minLength);

            const cutPos = cutPoints.length > 0 ? Math.max(...cutPoints) : maxLength;
            optimized = optimized.substring(0, cutPos).trim();
        }

        if (optimized.length < minLength) {
            optimized = word.trim().substring(0, maxLength).trim();
        }

        return optimized;
    }

    // 腾讯新闻热榜（PC）
    function getTencentHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=tencent-news&sub_tab=hot&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 3);
                }
            } catch (e) {
                hotWords = getFallbackPcWords();
            }
        } else {
            hotWords = getFallbackPcWords();
        }
        return hotWords;
    }

    // 掘金热榜（PC）
    function getJuejinHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=juejin&sub_tab=all&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 3);
                }
            } catch (e) {
                hotWords = getFallbackPcWords();
            }
        } else {
            hotWords = getFallbackPcWords();
        }
        return hotWords;
    }

    // 百度热榜（PC）
    function getBaiduHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=baidu&sub_tab=realtime&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.word && item.word.trim().length > 0)
                        .map(item => optimizeHotWord(item.word))
                        .filter(word => word.length >= 3);
                }
            } catch (e) {
                hotWords = getFallbackPcWords();
            }
        } else {
            hotWords = getFallbackPcWords();
        }
        return hotWords;
    }

    // 微博热搜（PC）
    function getWeiboHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=top&sub_tab=lasthour&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 3);
                    // if (hotWords.length < 40) {
                    //     while (hotWords.length < 40) {
                    //         hotWords.push(...hotWords.slice(0, Math.min(hotWords.length, 40 - hotWords.length)));
                    //     }
                    // } else {
                    //     hotWords = hotWords.slice(0, 40);
                    // }
                }
            } catch (e) {
            }
        }
        return hotWords;
    }


    // 今日头条热榜（移动）
    function getTopHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=toutiao&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 2);
                }
            } catch (e) {
                hotWords = getFallbackMobileWords();
            }
        } else {
            hotWords = getFallbackMobileWords();
        }
        return hotWords;
    }

    // 网易新闻热榜（移动）
    function getNeNewHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=ne-news&sub_tab=htd&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 2);
                }
            } catch (e) {
                hotWords = getFallbackMobileWords();
            }
        } else {
            hotWords = getFallbackMobileWords();
        }
        return hotWords;
    }

    // 36氪热搜（移动）
    function get36krHotWords() {
        let hotWords = [];
        const hotListUrl = 'https://api.rebang.today/v1/items?tab=36kr&sub_tab=hotlist&page=1&version=1';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', hotListUrl, false);
        xhr.send();
        if (xhr.status === 200) {
            try {
                const result = JSON.parse(xhr.responseText);
                if (result.code === 200 && result.data && result.data.list) {
                    let items = JSON.parse(result.data.list);
                    hotWords = items
                        .filter(item => item && item.title && item.title.trim().length > 0)
                        .map(item => optimizeHotWord(item.title))
                        .filter(word => word.length >= 2);
                    // if (hotWords.length < 30) {
                    //     while (hotWords.length < 30) {
                    //         hotWords.push(...hotWords.slice(0, Math.min(hotWords.length, 30 - hotWords.length)));
                    //     }
                    // } else {
                    //     hotWords = hotWords.slice(0, 30);
                    // }
                }
            } catch (e) {
            }
        }
        return hotWords;
    }

    // 随机获取PC热词（同步）
    function getRandomPcHotWordsSync() {
        const sources = [getBaiduHotWords, getWeiboHotWords, getTencentHotWords,getJuejinHotWords];
        const idx = Math.floor(Math.random() * sources.length);
        let words = sources[idx]();
        if (!words || words.length === 0) {
            // 尝试其他两个方法
            for (let i = 0; i < sources.length; i++) {
                if (i !== idx) {
                    words = sources[i]();
                    if (words && words.length > 0) break;
                }
            }
        }
        return words.length > 0 ? words : getFallbackPcWords();
    }

    // 随机获取移动热词（同步）
    function getRandomMobileHotWordsSync() {
        const sources = [getTopHotWords, get36krHotWords, getNeNewHotWords];
        const idx = Math.floor(Math.random() * sources.length);
        let words = sources[idx]();
        if (!words || words.length === 0) {
            // 尝试其他两个方法
            for (let i = 0; i < sources.length; i++) {
                if (i !== idx) {
                    words = sources[i]();
                    if (words && words.length > 0) break;
                }
            }
        }
        return words && words.length > 0 ? words : getFallbackMobileWords();
    }

    // 全局备用热词
    let fallbackPcWords = [
        "人工智能发展", "全球经济趋势", "量子计算突破", "新能源技术", "元宇宙应用",
        "区块链创新", "5G技术进展", "太空探索", "自动驾驶", "大数据分析",
        "云计算发展", "网络安全动态", "机器学习", "边缘计算", "数字货币",
        "生物科技", "虚拟现实", "增强现实", "物联网", "智能家居"
    ];

    let fallbackMobileWords = [
        "手机新品", "短视频挑战", "移动游戏排行", "手机摄影", "流量套餐",
        "手游攻略", "移动支付安全", "短视频制作", "手机评测", "充电宝选购",
        "社交软件", "网络热点", "明星动态", "电影推荐", "美食做法",
        "旅游攻略", "健康养生", "学习技巧", "职场经验", "亲子教育"
    ];

    // 随机生成延迟时间
    function getRandomDelay() {
        return Math.floor(Math.random() * 13) + 3; // 3-15秒
    }

    // 随机选择热词并从列表中移除，避免重复
    function getRandomItemAndRemove(arr) {
        if (!arr || arr.length === 0) return null;

        const index = Math.floor(Math.random() * arr.length);
        const item = arr[index];
        arr.splice(index, 1);

        if (arr.length === 0) {
            console.log("热词已用尽，重新获取热词");
            if (deviceType === 'pc') {
                getRandomPcHotWords().then(words => hotWords = words);
            } else {
                getRandomMobileHotWords().then(words => hotWords = words);
            }
        }

        return item;
    }

    // 执行搜索
    function performSearch(query) {
        if (isPaused || !isRunning) return;
        if (!query || query.trim().length === 0) {
            console.error("无效的搜索词，跳过本次搜索");
            updateStatus("搜索词无效，准备下一次");
            setTimeout(performSearchCycle, 2000);
            return;
        }
        let searchBoxAttempts = 0;
        const maxAttempts = 5;
        const searchBoxInterval = setInterval(() => {
            const searchBox = document.getElementById('sb_form_q');
            searchBoxAttempts++;
            if (searchBox) {
                clearInterval(searchBoxInterval);
                updateStatus(`搜索中: ${query}`);
                searchBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                setTimeout(() => {
                    searchBox.value = '';
                    searchBox.dispatchEvent(new Event('input', {bubbles: true}));
                    searchBox.dispatchEvent(new Event('change', {bubbles: true}));
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (!isRunning || isPaused) {
                            clearInterval(typeInterval);
                            return;
                        }
                        if (i < query.length) {
                            searchBox.value += query[i];
                            searchBox.dispatchEvent(new Event('input', {bubbles: true}));
                            searchBox.dispatchEvent(new Event('change', {bubbles: true}));
                            searchBox.dispatchEvent(new Event('keydown', {
                                bubbles: true,
                                key: query[i]
                            }));
                            i++;
                        } else {
                            clearInterval(typeInterval);
                            searchBox.focus();
                            setTimeout(() => {
                                if (!isRunning || isPaused) return;
                                const currentState = {
                                    isRunning: isRunning,
                                    currentSearchCount: currentSearchCount,
                                    totalSearches: totalSearches,
                                    isFirstSearch: false
                                };
                                localStorage.setItem('bingAutoSearchState', JSON.stringify(currentState));

                                if (detectDeviceType() === 'mobile') {
                                    const form = document.getElementById('sb_form');
                                    if (form) {
                                        form.submit();
                                    } else {
                                        const enterEvent = new KeyboardEvent('keydown', {
                                            key: 'Enter',
                                            code: 'Enter',
                                            keyCode: 13,
                                            which: 13,
                                            bubbles: true
                                        });
                                        searchBox.dispatchEvent(enterEvent);
                                    }
                                    setTimeout(performSearchCycle, 1500);
                                } else {
                                    // 方法1：模拟Enter键（主要方法）
                                    const enterEvent = new KeyboardEvent('keypress', {
                                        key: 'Enter',
                                        code: 'Enter',
                                        keyCode: 13,
                                        which: 13,
                                        bubbles: true
                                    });
                                    searchBox.dispatchEvent(enterEvent);

                                    // 方法2：点击搜索按钮（备用方法，1秒后执行以防方法1失败）
                                    setTimeout(() => {
                                        if (document.getElementById('sb_form_q') &&
                                            document.getElementById('sb_form_q').value === query) {
                                            console.log("Enter键提交失败，尝试点击搜索按钮");
                                            const searchButton = document.getElementById('sb_form_go') ||
                                                document.querySelector('input[type="submit"]') ||
                                                document.querySelector('.search-icon');

                                            if (searchButton) {
                                                searchButton.click();
                                            } else {
                                                // 方法3：直接跳转URL（终极保障）
                                                console.log("搜索按钮未找到，直接跳转URL");
                                                window.location.href = `https://cn.bing.com/search?q=${encodeURIComponent(query)}`;
                                            }
                                        }
                                    }, 1000);
                                    setTimeout(performSearchCycle, 1500);
                                }
                            }, Math.floor(Math.random() * 1500) + 500);
                        }
                    }, Math.floor(Math.random() * 150) + 50);
                }, 500);
            } else if (searchBoxAttempts >= maxAttempts) {
                clearInterval(searchBoxInterval);
                const searchUrl = `https://cn.bing.com/search?q=${encodeURIComponent(query)}`;
                const currentState = {
                    isRunning: isRunning,
                    currentSearchCount: currentSearchCount,
                    totalSearches: totalSearches,
                    isFirstSearch: false
                };
                localStorage.setItem('bingAutoSearchState', JSON.stringify(currentState));
                window.location.href = searchUrl;
                setTimeout(performSearchCycle, 2000);
            }
        }, 500);
    }

    // 搜索循环
    async function performSearchCycle() {
        if (!isOnBingHomepage()) {
            currentSearchCount++;
            // 搜索次数递增后立即刷新进度
            updateProgress(currentSearchCount, totalSearches);
        }
        const savedState = localStorage.getItem('bingAutoSearchState');
        if (savedState) {
            const {
                isRunning: savedRunning,
                currentSearchCount: savedCount,
                totalSearches: savedTotal
            } = JSON.parse(savedState);
            if (savedRunning && !isRunning) {
                isRunning = true;
                currentSearchCount = savedCount;
                totalSearches = savedTotal;
                sessionTotalSearches = savedTotal;

                document.getElementById('startSearchBtn').disabled = true;
                document.getElementById('pauseSearchBtn').disabled = false;
                document.getElementById('stopSearchBtn').disabled = false;
            }
        }

        if (!isRunning || isPaused) return;

        if (currentSearchCount >= totalSearches) {
            updateStatus(`已完成所有${totalSearches}次搜索`);
            updateProgress(totalSearches, totalSearches); // 修正完成时进度
            stopSearch();
            // alert(`已完成所有${totalSearches}次搜索任务！`);
            return;
        }

        if (!isOnBingHomepage()) {
            await simulateSearchResultsBrowsing();
            if (isPaused || !isRunning) return;
        }

        const delaySeconds = getRandomDelay();
        console.log(`第${currentSearchCount + 1}次搜索将在${delaySeconds}秒后进行`);
        updateStatus(`运行中 - 下次搜索: ${delaySeconds}秒`);

        // 倒计时显示
        let remaining = delaySeconds;
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (!isRunning || isPaused) {
                clearInterval(countdownInterval);
                return;
            }

            updateStatus(`运行中 - 下次搜索: ${remaining}秒`);
            remaining--;
            if (remaining < 0) clearInterval(countdownInterval);
        }, 1000);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        if (isPaused || !isRunning) return;
        executeNextSearchStep();
    }

    // 执行下一步搜索
    function executeNextSearchStep() {
        if (!isRunning || isPaused) return;

        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        const randomWord = getRandomItemAndRemove(hotWords);
        performSearch(randomWord);
    }

    // 检查是否在必应首页
    function isOnBingHomepage() {
        return window.location.href === 'https://cn.bing.com/' ||
            window.location.href.startsWith('https://cn.bing.com/?') &&
            !window.location.href.includes('/search');
    }

    // 开始搜索
    function startSearch() {
        if (isRunning) return;
        isRunning = true;
        isPaused = false;
        isFirstSearch = true;

        const startBtn = document.getElementById('startSearchBtn');
        const pauseBtn = document.getElementById('pauseSearchBtn');
        const stopBtn = document.getElementById('stopSearchBtn');

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        pauseBtn.style.transform = 'scale(1.05)';
        pauseBtn.style.boxShadow = '0 3px 8px rgba(255, 152, 0, 0.3)';
        updateStatus("准备中...");

        deviceType = detectDeviceType();
        console.log(`设备类型: ${deviceType}`);

        // 首次搜索需要确保在必应首页
        if (isFirstSearch && !isOnBingHomepage()) {
            updateStatus("正在切换到必应首页...");

            // 保存当前状态以便页面跳转后恢复
            localStorage.setItem('bingAutoSearchState', JSON.stringify({
                isRunning: isRunning,
                currentSearchCount: currentSearchCount,
                totalSearches: totalSearches,
                isFirstSearch: isFirstSearch,
                needInitialize: true
            }));

            // 跳转到必应首页
            window.location.href = 'https://cn.bing.com/';

            // 等待5秒以确保页面跳转完成
            setTimeout(() => {
                console.log("等待5秒后继续执行");
            }, 5000);

        }

        // 不再使用异步热词获取
        try {
            if (deviceType === 'pc') {
                totalSearches = 40;
                hotWords = getRandomPcHotWordsSync();
            } else {
                totalSearches = 30;
                hotWords = getRandomMobileHotWordsSync();
            }
            initializeSearchProcess();
        } catch (e) {
            updateStatus("热词获取失败，使用备用方案");
            hotWords = deviceType === 'pc' ? getFallbackPcWords() : getFallbackMobileHotWords();
            initializeSearchProcess();
        }

        // 初始化搜索流程（提升到全局，便于异步调用）
        function initializeSearchProcess() {
            if (!hotWords || hotWords.length === 0) {
                updateStatus("热词获取失败，请检查网络");
                isRunning = false;
                const startBtn = document.getElementById('startSearchBtn');
                const pauseBtn = document.getElementById('pauseSearchBtn');
                const stopBtn = document.getElementById('stopSearchBtn');
                if (startBtn) startBtn.disabled = false;
                if (pauseBtn) pauseBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = true;
                updateProgress(0, totalSearches); // 修正初始化时进度显示
                return;
            }

            sessionTotalSearches = totalSearches;

            const savedProgress = localStorage.getItem('bingAutoSearchProgress');
            if (savedProgress) {
                const {current, total} = JSON.parse(savedProgress);
                if (total === totalSearches) {
                    currentSearchCount = current;
                } else {
                    currentSearchCount = 0;
                }
            } else {
                currentSearchCount = 0;
            }

            if (currentSearchCount >= totalSearches) {
                currentSearchCount = 0;
            }

            updateProgress(currentSearchCount, totalSearches); // 确保进度显示正确

            localStorage.setItem('bingAutoSearchState', JSON.stringify({
                isRunning: isRunning,
                currentSearchCount: currentSearchCount,
                totalSearches: totalSearches,
                isFirstSearch: isFirstSearch,
                needInitialize: false
            }));

            updateStatus("开始搜索流程");
            setTimeout(performSearchCycle, 1000);
        }
    }

    // 暂停/继续
    function togglePause() {
        if (!isRunning) return;

        isPaused = !isPaused;
        const pauseBtn = document.getElementById('pauseSearchBtn');

        localStorage.setItem('bingAutoSearchState', JSON.stringify({
            isRunning: isRunning,
            currentSearchCount: currentSearchCount,
            totalSearches: totalSearches,
            isFirstSearch: isFirstSearch,
            needInitialize: false
        }));

        if (isPaused) {
            if (countdownInterval) clearInterval(countdownInterval);
            if (scrollInterval) clearInterval(scrollInterval);
            pauseBtn.textContent = '继续';
            pauseBtn.style.backgroundColor = '#4caf50';
            pauseBtn.style.boxShadow = '0 3px 8px rgba(76, 175, 80, 0.3)';
            updateStatus("已暂停");
        } else {
            pauseBtn.textContent = '暂停';
            pauseBtn.style.backgroundColor = '#ff9800';
            pauseBtn.style.boxShadow = '0 3px 8px rgba(255, 152, 0, 0.3)';
            updateStatus("继续搜索流程");
            performSearchCycle();
        }
    }

    // 停止搜索 - 彻底清理状态和移除面板
    function stopSearch() {
        isRunning = false;
        isPaused = false;
        if (countdownInterval) clearInterval(countdownInterval);
        if (scrollInterval) clearInterval(scrollInterval);
        clearTimeout(hotWordFetchTimeout);

        updateStatus("已停止");
        updateProgress(currentSearchCount, sessionTotalSearches || 0);

        localStorage.removeItem('bingAutoSearchState');
        localStorage.removeItem('bingAutoSearchProgress');
        localStorage.removeItem('bingAutoSearchCount');
        localStorage.removeItem('isBingAuto');

        const startBtn = document.getElementById('startSearchBtn');
        const pauseBtn = document.getElementById('pauseSearchBtn');
        const stopBtn = document.getElementById('stopSearchBtn');

        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = true;
        if (pauseBtn) {
            pauseBtn.textContent = '暂停';
            pauseBtn.style.backgroundColor = '#ff9800';
            pauseBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            pauseBtn.style.transform = 'scale(1)';
        }

        // 再次确保面板被移除
        const panel1 = document.getElementById('autoSearchPanel');
        const panel2 = document.getElementById('autoSearchControlPanel');
        if (panel1) panel1.remove();
        if (panel2) panel2.remove();
    }


    // 页面加载时只负责恢复面板和进度，不再异步获取热词和初始化
    function restoreStateOnLoad() {
        const savedProgress = localStorage.getItem('bingAutoSearchProgress');
        if (savedProgress) {
            const {current, total} = JSON.parse(savedProgress);
            if (document.getElementById('autoSearchProgress')) {
                document.getElementById('autoSearchProgress').textContent = `进度: ${current}/${total}`;
            }
        }

        const savedState = localStorage.getItem('bingAutoSearchState');
        if (savedState) {
            const {
                isRunning: savedRunning,
                currentSearchCount: savedCount,
                totalSearches: savedTotal,
                isFirstSearch: savedFirst,
                needInitialize: needInit
            } = JSON.parse(savedState);

            if (savedRunning) {
                isRunning = true;
                currentSearchCount = savedCount;
                totalSearches = savedTotal;
                isFirstSearch = savedFirst;
                sessionTotalSearches = savedTotal;

                createControlPanel();

                const startBtn = document.getElementById('startSearchBtn');
                const pauseBtn = document.getElementById('pauseSearchBtn');
                const stopBtn = document.getElementById('stopSearchBtn');

                if (startBtn && pauseBtn && stopBtn) {
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                    stopBtn.disabled = false;
                    pauseBtn.style.transform = 'scale(1.05)';
                    pauseBtn.style.boxShadow = '0 3px 8px rgba(255, 152, 0, 0.3)';
                }

                updateStatus("运行中 - 恢复搜索");

                // 如果需要初始化（刚跳转到首页），直接执行初始化流程
                if (needInit) {
                    deviceType = detectDeviceType();
                    try {
                        if (deviceType === 'pc') {
                            totalSearches = 40;
                            hotWords = getRandomPcHotWordsSync();
                        } else {
                            totalSearches = 30;
                            hotWords = getRandomMobileHotWordsSync();
                        }
                        initializeSearchProcess();
                        // 初始化后将 needInitialize 标记为 false
                        const state = JSON.parse(localStorage.getItem('bingAutoSearchState') || '{}');
                        state.needInitialize = false;
                        localStorage.setItem('bingAutoSearchState', JSON.stringify(state));
                    } catch (e) {
                        updateStatus("热词获取失败，使用备用方案");
                        hotWords = deviceType === 'pc' ? getFallbackPcWords() : getFallbackMobileHotWords();
                        initializeSearchProcess();
                        const state = JSON.parse(localStorage.getItem('bingAutoSearchState') || '{}');
                        state.needInitialize = false;
                        localStorage.setItem('bingAutoSearchState', JSON.stringify(state));
                    }
                } else {
                    setTimeout(() => {
                        deviceType = detectDeviceType();
                        if (deviceType === 'pc') {
                            hotWords = getRandomPcHotWordsSync();
                        } else {
                            hotWords = getRandomMobileHotWordsSync();
                        }
                        performSearchCycle();
                    }, 1000);
                }
            }
        }
    }

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        // 更简洁的转换方式
        const bingAuto = localStorage.getItem('isBingAuto') === 'true';
        if (!bingAuto) return;
        createControlPanel();
        restoreStateOnLoad();
        const savedState = localStorage.getItem('bingAutoSearchState');
        let needInit = false;
        let deviceTypeLocal = detectDeviceType();
        if (savedState) {
            const stateObj = JSON.parse(savedState);
            needInit = !!stateObj.needInitialize;
        }

        // 跳转到首页后，只有 needInitialize 为 true 时才获取热词并初始化
        if (needInit) {
            deviceType = deviceTypeLocal;
            updateStatus("正在获取热词...");
            let hotWordResolved = false;
            let hotWordTimeout = setTimeout(() => {
                if (!hotWordResolved) {
                    hotWords = deviceType === 'pc' ? getFallbackPcWords() : getFallbackMobileHotWords();
                    initializeSearchProcess();
                    // 清除 needInitialize 标记
                    const state = JSON.parse(localStorage.getItem('bingAutoSearchState') || '{}');
                    state.needInitialize = false;
                    localStorage.setItem('bingAutoSearchState', JSON.stringify(state));
                }
            }, 15000);

            try {
                if (deviceType === 'pc') {
                    totalSearches = 40;
                    hotWords = getRandomPcHotWordsSync();
                } else {
                    totalSearches = 30;
                    hotWords = getRandomMobileHotWordsSync();
                }
                hotWordResolved = true;
                clearTimeout(hotWordTimeout);
                initializeSearchProcess();
                // 初始化后将 needInitialize 标记为 false
                const state = JSON.parse(localStorage.getItem('bingAutoSearchState') || '{}');
                state.needInitialize = false;
                localStorage.setItem('bingAutoSearchState', JSON.stringify(state));
            } catch (e) {
                hotWordResolved = true;
                clearTimeout(hotWordTimeout);
                updateStatus("热词获取失败，使用备用方案");
                hotWords = deviceType === 'pc' ? getFallbackPcWords() : getFallbackMobileHotWords();
                initializeSearchProcess();
                // 同样修复 needInitialize 标记
                const state = JSON.parse(localStorage.getItem('bingAutoSearchState') || '{}');
                state.needInitialize = false;
                localStorage.setItem('bingAutoSearchState', JSON.stringify(state));
            }
        }
    });

    // 模拟用户上下滑动页面浏览（同时支持PC和移动端）
    function simulateSearchResultsBrowsing() {
        return new Promise(resolve => {
            if (isPaused || !isRunning) {
                resolve();
                return;
            }
            updateStatus("正在浏览搜索结果...");
            const isMobile = detectDeviceType() === 'mobile';
            // 为PC端设置不同的滑动参数
            const scrollSteps = isMobile ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 6) + 4;
            const totalBrowseTime = isMobile ? Math.floor(Math.random() * 3000) + 1000 : Math.floor(Math.random() * 3000) + 2000;
            const intervalBetweenSteps = totalBrowseTime / scrollSteps;
            let step = 0;
            let direction = 1;

            const scrollTimeout = setTimeout(() => {
                console.log("结果浏览滑动超时");
                clearInterval(scrollInterval);
                window.scrollTo({top: 0, behavior: 'smooth'});
                setTimeout(resolve, 800);
            }, 15000);

            scrollInterval = setInterval(() => {
                if (isPaused || !isRunning || step >= scrollSteps) {
                    clearInterval(scrollInterval);
                    clearTimeout(scrollTimeout);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    setTimeout(resolve, 800);
                    return;
                }
                const maxScroll = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                );
                let scrollPosition;

                if (isMobile) {
                    // 移动端滑动逻辑保持不变
                    if (step % 2 === 0) {
                        direction = direction * -1;
                    }
                    scrollPosition = direction > 0
                        ? maxScroll * (0.2 + Math.random() * 0.5)
                        : maxScroll * (0.1 + Math.random() * 0.2);
                } else {
                    // PC端滑动逻辑 - 更自然的浏览模式
                    if (step === 0) {
                        // 第一步轻微下滑
                        scrollPosition = maxScroll * (0.1 + Math.random() * 0.1);
                    } else if (step === scrollSteps - 1) {
                        // 最后一步回到顶部
                        scrollPosition = 0;
                    } else if (Math.random() < 0.2) {
                        // 偶尔向上滚动一点
                        const currentPos = window.scrollY;
                        scrollPosition = Math.max(0, currentPos - maxScroll * (0.05 + Math.random() * 0.15));
                    } else {
                        // 主要向下滚动，但有随机变化
                        const currentPos = window.scrollY;
                        scrollPosition = Math.min(
                            maxScroll * 0.9,
                            currentPos + maxScroll * (0.1 + Math.random() * 0.2)
                        );
                    }
                }

                window.scrollTo({top: scrollPosition, behavior: 'smooth'});
                step++;
            }, intervalBetweenSteps);
        });
    }

    // 添加菜单命令：修复手机端菜单点击不显示面板的问题
    if (typeof GM_registerMenuCommand === 'function') {
        // 确保菜单命令能���确触发面板显示
        GM_registerMenuCommand('显示控制面板', function () {
            // 存储布尔值（会自动转为字符串）
            localStorage.setItem('isBingAuto', true);
            // 强制创建并显示面板
            createControlPanel();
            // 确保面板在视口中可见
            const panel = document.getElementById('autoSearchControlPanel');
            if (panel) {
                panel.style.display = 'block';
                panel.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }, 's');

        GM_registerMenuCommand('关闭面板', function () {
            closeControlPanelAndScript();
        }, 'c');
    }

    // 关闭面板和脚本
    function closeControlPanelAndScript() {
        stopSearch();
        // 再次确保面板被移除
        const panel1 = document.getElementById('autoSearchPanel');
        const panel2 = document.getElementById('autoSearchControlPanel');
        if (panel1) panel1.remove();
        if (panel2) panel2.remove();
    }
})();
