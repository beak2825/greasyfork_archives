// ==UserScript==
// @name         统计b站合集已观看时长及占比，统计章节时长，延长视频目录
// @version      1.11
// @license      MIT
// @description  查看b站合集已观看时长及占比,会自动更新,集合章节时长统计，以及延长视频合集目录，去除广告功能
// @author       白夜
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @namespace https://greasyfork.org/users/1486583
// @downloadURL https://update.greasyfork.org/scripts/540304/%E7%BB%9F%E8%AE%A1b%E7%AB%99%E5%90%88%E9%9B%86%E5%B7%B2%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF%E5%8F%8A%E5%8D%A0%E6%AF%94%EF%BC%8C%E7%BB%9F%E8%AE%A1%E7%AB%A0%E8%8A%82%E6%97%B6%E9%95%BF%EF%BC%8C%E5%BB%B6%E9%95%BF%E8%A7%86%E9%A2%91%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/540304/%E7%BB%9F%E8%AE%A1b%E7%AB%99%E5%90%88%E9%9B%86%E5%B7%B2%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF%E5%8F%8A%E5%8D%A0%E6%AF%94%EF%BC%8C%E7%BB%9F%E8%AE%A1%E7%AB%A0%E8%8A%82%E6%97%B6%E9%95%BF%EF%BC%8C%E5%BB%B6%E9%95%BF%E8%A7%86%E9%A2%91%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let haveShowFirst = false;
    let pageHaveShow=false;
    let chapterTimerHaveShow=false;
    let titleEl = document.querySelector('.view-text');
    let titleElinner = document.querySelector('.view-text').innerText;
    let videoList;
    let activeVideo;
    let statItems;
    let chapterMap = new Map();
    let isOverButtonOrPanel = false;
    let features;

    const states = {};
    function parseTime(text) {
        const parts = text.split(':').map(Number);
        if (parts.length === 3) {
            // hh:mm:ss
            const [h, m, s] = parts;
            return h * 3600 + m * 60 + s;
        } else if (parts.length === 2) {
            // mm:ss
            const [m, s] = parts;
            return m * 60 + s;
        } else if (parts.length === 1) {
            // ss
            return parts[0];
        } else {
            return 0; // 无法识别的格式
        }
    }
    function getCurrentVideoPlayedSeconds() {
        const timeEl = document.querySelector('.bpx-player-ctrl-time-current');
        if (!timeEl) return 0;

        const text = timeEl.innerText.trim();
        if (!text) return 0;

        return parseTime(text);
    }
    function getAllVideo(){
        videoList=document.querySelector('.video-pod__list');
        if (!videoList)return false;
        return true;
    }
    function getActiveVideo(){
        activeVideo = videoList.querySelectorAll('.active');
        if (!activeVideo)return false;
        activeVideo=activeVideo[activeVideo.length-1]
        if (!activeVideo)return false;
        console.log(activeVideo)
        return true;
    }
    function getStatItems(){
        let classMenu = activeVideo.parentNode;
        if (!classMenu) return false;
        let allItems = classMenu.querySelectorAll('.stats .stat-item');
        if (!allItems || allItems.length === 0) return false;
        statItems = Array.from(allItems);
        try {
            const rules = JSON.parse(localStorage.getItem('bilibili_stat_rules') || '[]');
            for (const rule of rules) {
                if (window.location.href.includes(rule.url)) {
                    const startIndex = Math.max(rule.start - 1, 0);
                    const endIndex = Math.min(rule.end, allItems.length);
                    statItems = statItems.slice(startIndex, endIndex);
                    console.log(`匹配规则 ${rule.url}，截取 P${rule.start} ~ P${rule.end}`);
                    break;
                }
            }
        } catch (e) {
            console.warn('规则解析失败', e);
        }
        return true;
    }
    function getAllTimer(){
        let totalSeconds = 0;
        let toActiveSeconds = 0;
        let reachedActive = false;

        for (const stat of statItems) {
            const timeText = stat.textContent.trim();
            const seconds = parseTime(timeText);
            totalSeconds += seconds;

            const parent = stat.parentNode.parentNode;
            const isHaveActive = parent.classList.contains('active');
            if (isHaveActive) {
                reachedActive = true;
            }

            if (!reachedActive) {
                toActiveSeconds += seconds;
            }
        }

        // ⭐ 加上当前视频已观看时间
        const currentPlayed = getCurrentVideoPlayedSeconds();
        toActiveSeconds += currentPlayed;

        const format = sec => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return [h, m, s].map(unit => String(unit).padStart(2, '0')).join(':');
        };

        const timerShow = `  ${format(toActiveSeconds)} / ${format(totalSeconds)}`;
        if (titleEl) {
            titleEl.innerText = titleElinner + timerShow;
        }
    }
    function optimizePageLayout() {
        // 限制合集列表高度
        const list = document.querySelector(
            "#mirror-vdcon > div.right-container > div > div.rcmd-tab > div > div.video-pod__body"
        );
        if (list) {
            list.style.maxHeight = '50vh';
            list.style.overflowY = 'auto';
        }
        // 隐藏广告
        const ad = document.querySelector("#slide_ad");
        if (ad) {
            ad.style.display = 'none';
        }
    }
    function getChapterTime() {
        const reportDiv = document.querySelector('.video-toolbar-container');
        if (!reportDiv) {
            console.warn('未找到 video-toolbar-container');
            return;
        }

        // 避免重复创建
        let wrapper = document.querySelector('.ChapterTimeWrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'ChapterTimeWrapper';

            wrapper.style.marginTop = '10px';
            wrapper.style.padding = '8px';
            wrapper.style.border = '1px solid #ddd';
            wrapper.style.borderRadius = '6px';
            wrapper.style.background = '#fafafa';
            wrapper.style.fontSize = '13px';
            wrapper.style.lineHeight = '1.5';

            // 标题
            const header = document.createElement('div');
            header.innerText = '章节统计';
            header.style.fontWeight = 'bold';
            header.style.marginBottom = '6px';

            // 内容区（重点）
            const content = document.createElement('div');
            content.className = 'ChapterTimeContent';
            content.style.maxHeight = '100px';
            content.style.overflowY = 'auto';
            content.style.whiteSpace = 'pre-wrap';

            wrapper.appendChild(header);
            wrapper.appendChild(content);

            reportDiv.parentNode.insertBefore(wrapper, reportDiv.nextSibling);
        }

        const contentDiv = wrapper.querySelector('.ChapterTimeContent');

        // ===== 原来的统计逻辑 =====
        chapterMap.clear();

        for (const stat of statItems) {
            const parent = stat.parentNode.parentNode;
            const titleEl = parent.firstElementChild;
            if (!titleEl) continue;

            const titleText = titleEl.innerText.trim();
            const match = titleText.match(/^P?(\d+)/);
            if (!match) continue;

            const chapterNumber = match[1];
            const seconds = parseTime(stat.textContent.trim());

            if (!chapterMap.has(chapterNumber)) {
                chapterMap.set(chapterNumber, {
                    title: "第" + chapterNumber + "章",
                    total: 0
                });
            }
            chapterMap.get(chapterNumber).total += seconds;
        }

        const format = sec => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
        };

        let text = '';
        [...chapterMap.entries()]
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .forEach(([_, data]) => {
            text += `${data.title}：${format(data.total)}\n`;
        });

        contentDiv.innerText = text;
    }
    function setP(){
        let count = 1;
        for (const stat of statItems) {
            const parent = stat.parentNode.parentNode;
            const firstChild = parent.firstElementChild;

            // 如果已经有我们加过的标记 div，就跳过（避免重复插入）
            if (firstChild && firstChild.classList.contains('p-label')) continue;

            const label = document.createElement('div');
            label.innerText = "P" + count;
            label.className = 'p-label';
            label.style.color = '#888';
            label.style.fontSize = '15px';
            label.style.marginRight = '5px';

            parent.insertBefore(label, firstChild);
            count++;
        }
    }
    function createControlPanel() {
        const toggleButton = document.createElement('div');
        toggleButton.className="setPanel";
        toggleButton.innerText = '⚙️';
        toggleButton.style.position = 'fixed';
        toggleButton.style.left = '0';
        toggleButton.style.top = '50%';
        toggleButton.style.transform = 'translateY(-50%)';
        toggleButton.style.width = '30px';
        toggleButton.style.height = '30px';
        toggleButton.style.background = '#333';
        toggleButton.style.color = '#fff';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.borderRadius = '0 5px 5px 0';
        document.body.appendChild(toggleButton);
        const panel = document.createElement('div');
        panel.className="setPanel";
        panel.style.position = 'fixed';
        panel.style.left = '35px';
        panel.style.top = '50%';
        panel.style.transform = 'translateY(-50%)';
        panel.style.width = '20vw';
        panel.style.padding = '10px';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        panel.style.zIndex = '9999';
        panel.style.display = 'none';
        const defaultFeatures = [
            { key: 'showChapterTime', label: '显示章节时间', default: true },
            { key: 'showTotalTimer', label: '显示总时长', default: true },
            { key: 'showPageP', label: '显示页面编号', default: true },
            { key: 'optimizePageLayout', label: '视频目录加长', default: true },
        ];
        features = defaultFeatures;
        features.forEach(feature => {
            const stored = localStorage.getItem(`feature_${feature.key}`);
            if (stored === null) {
                localStorage.setItem(`feature_${feature.key}`, feature.default);
                states[feature.key] = feature.default;
            } else {
                states[feature.key] = stored === 'true';
            }
        });
        features.forEach(feature => {
            const saved = localStorage.getItem(`feature_${feature.key}`);
            states[feature.key] = saved === null ? true : saved === 'true';
            const button = document.createElement('button');
            button.innerText = `${feature.label}: ${states[feature.key] ? '✅开启' : '❌关闭'}`;
            button.style.marginBottom = '5px';
            button.style.width = '100%';
            button.style.padding = '5px';
            button.style.cursor = 'pointer';
            button.style.border = '1px solid #ccc';
            button.style.borderRadius = '4px';
            button.style.background = states[feature.key] ? '#d4edda' : '#f8d7da';
            button.className = 'setPanel';
            button.addEventListener('click', () => {
                states[feature.key] = !states[feature.key];
                localStorage.setItem(`feature_${feature.key}`, states[feature.key]);
                button.innerText = `${feature.label}: ${states[feature.key] ? '✅开启' : '❌关闭'}`;
                button.style.background = states[feature.key] ? '#d4edda' : '#f8d7da';
                console.log(`功能[${feature.label}] 状态: ${states[feature.key]}`);
            });
            panel.appendChild(button);
        });
        document.body.appendChild(panel);
        toggleButton.addEventListener('mouseenter', () => {
            isOverButtonOrPanel = true;
            panel.style.display = 'block';
        });
        toggleButton.addEventListener('mouseleave', () => {
            isOverButtonOrPanel = false;
            setTimeout(() => {
                if (!isOverButtonOrPanel) panel.style.display = 'none';
            }, 200);
        });
        panel.addEventListener('mouseenter', () => {
            isOverButtonOrPanel = true;
            panel.style.display = 'block';
        });
        panel.addEventListener('mouseleave', () => {
            isOverButtonOrPanel = false;
            setTimeout(() => {
                if (!isOverButtonOrPanel) panel.style.display = 'none';
            }, 200);
        });
        window.featureFlags = states;

        // 分割线
        panel.appendChild(document.createElement('hr'));

        // 规则编辑区域
        const ruleTitle = document.createElement('div');
        ruleTitle.innerText = 'statItems 规则设置：';
        ruleTitle.style.margin = '8px 0';
        ruleTitle.style.fontWeight = 'bold';
        panel.appendChild(ruleTitle);

        // 规则容器
        const ruleContainer = document.createElement('div');
        ruleContainer.style.display = 'flex';
        ruleContainer.style.flexDirection = 'column';
        ruleContainer.style.gap = '4px';
        ruleContainer.style.width='100%'
        panel.appendChild(ruleContainer);

        // 加载现有规则
        let rules = JSON.parse(localStorage.getItem('bilibili_stat_rules') || '[]');
        function renderRules() {
            ruleContainer.innerHTML = '';
            rules.forEach((rule, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.gap = '4px';
                row.style.alignItems = 'center';
                row.style.width='100%'

                const inputUrl = document.createElement('input');
                inputUrl.type = 'text';
                inputUrl.value = rule.url;
                inputUrl.placeholder = '链接匹配';
                inputUrl.style.flex = '2';
                inputUrl.style.width='70%';

                const inputStart = document.createElement('input');
                inputStart.type = 'number';
                inputStart.value = rule.start;
                inputStart.placeholder = '起始P';
                inputStart.style.width = '10%';

                const inputEnd = document.createElement('input');
                inputEnd.type = 'number';
                inputEnd.value = rule.end;
                inputEnd.placeholder = '结束P';
                inputEnd.style.width = '10%';

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = '❌';
                deleteBtn.style.width = '30px';
                deleteBtn.addEventListener('click', () => {
                    rules.splice(idx, 1);
                    localStorage.setItem('bilibili_stat_rules', JSON.stringify(rules));
                    renderRules();
                });

                [inputUrl, inputStart, inputEnd].forEach((input, fieldIndex) => {
                    input.addEventListener('change', () => {
                        rules[idx] = {
                            url: inputUrl.value.trim(),
                            start: parseInt(inputStart.value),
                            end: parseInt(inputEnd.value)
                        };
                        localStorage.setItem('bilibili_stat_rules', JSON.stringify(rules));
                    });
                });

                row.appendChild(inputUrl);
                row.appendChild(inputStart);
                row.appendChild(inputEnd);
                row.appendChild(deleteBtn);
                ruleContainer.appendChild(row);
            });
        }
        renderRules();

        // 添加规则按钮
        const addRuleBtn = document.createElement('button');
        addRuleBtn.innerText = '➕ 添加规则';
        addRuleBtn.style.marginTop = '6px';
        addRuleBtn.style.padding = '5px';
        addRuleBtn.style.width = '100%';
        addRuleBtn.addEventListener('click', () => {
            rules.push({ url: '', start: 1, end: 1 });
            localStorage.setItem('bilibili_stat_rules', JSON.stringify(rules));
            renderRules();
        });
        // 添加注意事项标题
        const noteTitle = document.createElement('div');
        noteTitle.innerText = '注意事项';
        noteTitle.style.marginTop = '12px';
        noteTitle.style.fontWeight = 'bold';
        panel.appendChild(noteTitle);

        // 添加注意事项内容
        const noteContent = document.createElement('div');
        noteContent.innerText = '• 规则匹配时会根据链接包含关系截取显示章节。\n• 修改规则后请刷新页面以确保生效。\n• 关闭功能后相应统计不会显示。\n•课程链接/开始p/结束p(课程链接仅需到：https://www.bilibili.com/video/...xx.../)\n';
        noteContent.style.whiteSpace = 'pre-wrap'; // 保持换行
        noteContent.style.fontSize = '12px';
        noteContent.style.color = '#666';
        panel.appendChild(noteContent);
        panel.appendChild(addRuleBtn);
    }
    function waitForVideoAndRun(retry = 0) {
        if (retry > 30) {
            console.warn("超过最大等待次数，未能获取视频列表。");
            return;
        }
        if (!getAllVideo() || !getActiveVideo() || !getStatItems()) {
            setTimeout(() => waitForVideoAndRun(retry + 1), 500);
            return;
        }
        haveShowFirst = true;
        if (states.showChapterTime && !chapterTimerHaveShow) {
            getChapterTime();
            chapterTimerHaveShow = true;
        }
        if (states.showPageP && !pageHaveShow) {
            setP();
            pageHaveShow = true;
        }
        if (states.showTotalTimer) {
            getAllTimer();
        }
    }
    createControlPanel();
    setTimeout(() => {
        waitForVideoAndRun();
        setInterval(() => {
            if (states.optimizePageLayout) {
                optimizePageLayout();
            }
            if (states.showTotalTimer) {
                getAllTimer();
            }
            if (states.showChapterTime) {
                getChapterTime();
            }
        }, 500);
    },2000);
})();