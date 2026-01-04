// ==UserScript==
// @name         Linux.do 浏览助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  都是一些简简单单的功能
// @author       LiNFERS
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519117/Linuxdo%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519117/Linuxdo%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 工具函数：设置样式
    function setElementStyle(element, styles) {
        for (const [key, value] of Object.entries(styles)) {
            element.style[key] = value;
        }
    }

    // 标记已浏览帖子的函数
    function markVisitedPosts() {
        const history = GM_getValue('postHistory', []);
        const visitedIds = history.map(item => item.id);

        // 查找所有帖子链接
        const topicLinks = document.querySelectorAll('a[href*="/t/topic/"], a[href*="/topic/"]');

        topicLinks.forEach(link => {
            const postId = link.href.match(/\/t\/topic\/(\d+)|\/topic\/(\d+)/)?.[1] || link.href.match(/\/t\/topic\/(\d+)|\/topic\/(\d+)/)?.[2];
            if (postId && visitedIds.includes(postId)) {
                // 找到包含帖子标题的父元素并标记
                let postElement = link;
                while (postElement && !postElement.classList.contains('topic-list-item') && !postElement.classList.contains('topic-body')) {
                    postElement = postElement.parentElement;
                }
                if (postElement) {
                    postElement.style.backgroundColor = 'rgba(144, 238, 144, 0.2)';
                    postElement.style.transition = 'background-color 0.3s ease';
                }
            }
        });
    }

    // 创建随机看帖按钮
    const randomBtn = document.createElement('button');
    randomBtn.innerHTML = '<span style="display:inline-block;animation:pulse 2s infinite">R</span>';
    setElementStyle(randomBtn, {
        position: 'fixed',
        bottom: '80px',
        right: '0',
        zIndex: '10000',
        width: '25px', // 减小宽度
        height: '40px', // 减小高度
        background: 'rgba(255, 255, 255, 0.8)',
        color: '#333',
        border: 'none',
        borderRadius: '25px 0 0 25px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        fontSize: '14px', // 减小字体大小
        fontWeight: 'bold',
        userSelect: 'none'
    });
    document.body.appendChild(randomBtn);

    // 创建主控制按钮
    const mainBtn = document.createElement('button');
    mainBtn.innerHTML = '<span style="display:inline-block;animation:pulse 2s infinite">L</span>';
    setElementStyle(mainBtn, {
        position: 'fixed',
        bottom: '130px', // 调整位置以适应新的大小
        right: '0',
        zIndex: '10000',
        width: '25px', // 减小宽度
        height: '40px', // 减小高度
        background: 'rgba(255, 255, 255, 0.8)',
        color: '#333',
        border: 'none',
        borderRadius: '25px 0 0 25px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        fontSize: '14px', // 减小字体大小
        fontWeight: 'bold',
        userSelect: 'none'
    });
    document.body.appendChild(mainBtn);

    // 创建已阅按钮
    const readBtn = document.createElement('button');
    readBtn.innerHTML = '<span style="display:inline-block;animation:pulse 2s infinite">✓</span>';
    setElementStyle(readBtn, {
        position: 'fixed',
        bottom: '180px',
        right: '0',
        zIndex: '10000',
        width: '25px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.8)',
        color: '#333',
        border: 'none',
        borderRadius: '25px 0 0 25px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: 'bold',
        userSelect: 'none'
    });
    document.body.appendChild(readBtn);

    // 添加主控制按钮的动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        @keyframes textGlow {
            0% { text-shadow: 0 0 5px rgba(255,255,255,0.8); }
            50% { text-shadow: 0 0 15px rgba(255,255,255,1); }
            100% { text-shadow: 0 0 5px rgba(255,255,255,0.8); }
        }
    `;
    document.head.appendChild(style);

    // 创建浮动按钮容器
    const buttonContainer = document.createElement('div');
    setElementStyle(buttonContainer, {
        position: 'fixed',
        bottom: '80px',
        right: '50px', // 增加与主按钮的距离
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.3s ease',
        transform: 'translateX(100%)', // 初始位置在屏幕右侧
        opacity: '0',
        pointerEvents: 'none'
    });
    document.body.appendChild(buttonContainer);

    // 创建浏览记录按钮
    const btn = document.createElement('button');
    btn.innerHTML = '最近浏览';
    setElementStyle(btn, {
        padding: '8px 15px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#333',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '115px',
        animation: 'textGlow 2s infinite',
        fontWeight: 'bold'
    });
    buttonContainer.appendChild(btn);

    // 创建插眼按钮
    const markBtn = document.createElement('button');
    markBtn.innerHTML = '插眼';
    setElementStyle(markBtn, {
        padding: '8px 15px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#333',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '115px',
        animation: 'textGlow 2s infinite',
        fontWeight: 'bold'
    });
    buttonContainer.appendChild(markBtn);

    // 创建导航按钮容器
    const navBtnContainer = document.createElement('div');
    setElementStyle(navBtnContainer, {
        display: 'flex',
        gap: '5px',
        justifyContent: 'center'
    });
    buttonContainer.appendChild(navBtnContainer);

    // 创建返回按钮
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '←';
    setElementStyle(backBtn, {
        width: '35px',
        height: '35px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#333',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '16px',
        animation: 'textGlow 2s infinite',
        fontWeight: 'bold'
    });
    navBtnContainer.appendChild(backBtn);

    // 创建回到顶部按钮
    const topBtn = document.createElement('button');
    topBtn.innerHTML = '↑';
    setElementStyle(topBtn, {
        width: '35px',
        height: '35px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#333',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '16px',
        animation: 'textGlow 2s infinite',
        fontWeight: 'bold'
    });
    navBtnContainer.appendChild(topBtn);

    // 创建到达底部按钮
    const bottomBtn = document.createElement('button');
    bottomBtn.innerHTML = '↓';
    setElementStyle(bottomBtn, {
        width: '35px',
        height: '35px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#333',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '16px',
        animation: 'textGlow 2s infinite',
        fontWeight: 'bold'
    });
    navBtnContainer.appendChild(bottomBtn);

    // 按钮控制
    let isExpanded = false;
    let lastClickTime = 0;

    function showButtons() {
        buttonContainer.style.opacity = '1';
        buttonContainer.style.transform = 'translateX(0)'; // 向左滑动显示
        buttonContainer.style.pointerEvents = 'auto';
    }

    function hideButtons() {
        buttonContainer.style.opacity = '0';
        buttonContainer.style.transform = 'translateX(100%)'; // 向右滑动隐藏
        buttonContainer.style.pointerEvents = 'none';
    }

    // 设置透明度函数
    function setButtonsOpacity(opacity) {
        mainBtn.style.opacity = opacity;
        randomBtn.style.opacity = opacity;
        readBtn.style.opacity = opacity;
        buttonContainer.style.opacity = isExpanded ? opacity : '0';
    }

    // 透明度控制
    let fadeTimeout;
    function resetFadeTimeout() {
        clearTimeout(fadeTimeout);
        setButtonsOpacity('1');
        fadeTimeout = setTimeout(() => {
            if (!isNearButton) {
                setButtonsOpacity('0.2');
            }
        }, 20000);
    }

    // 监听鼠标移动
    let isNearButton = false;
    document.addEventListener('mousemove', (e) => {
        const btnRect = mainBtn.getBoundingClientRect();
        const randomBtnRect = randomBtn.getBoundingClientRect();
        const readBtnRect = readBtn.getBoundingClientRect();
        const containerRect = buttonContainer.getBoundingClientRect();

        // 检查鼠标是否在主按钮或按钮容器附近
        const isNearMainBtn = Math.sqrt(
            Math.pow(e.clientX - (btnRect.left + btnRect.width/2), 2) +
            Math.pow(e.clientY - (btnRect.top + btnRect.height/2), 2)
        ) < 100;

        const isNearRandomBtn = Math.sqrt(
            Math.pow(e.clientX - (randomBtnRect.left + randomBtnRect.width/2), 2) +
            Math.pow(e.clientY - (randomBtnRect.top + randomBtnRect.height/2), 2)
        ) < 100;

        const isNearReadBtn = Math.sqrt(
            Math.pow(e.clientX - (readBtnRect.left + readBtnRect.width/2), 2) +
            Math.pow(e.clientY - (readBtnRect.top + readBtnRect.height/2), 2)
        ) < 100;

        const isNearContainer = isExpanded && (
            e.clientX >= containerRect.left - 50 &&
            e.clientX <= containerRect.right + 50 &&
            e.clientY >= containerRect.top - 50 &&
            e.clientY <= containerRect.bottom + 50
        );

        if (isNearMainBtn || isNearRandomBtn || isNearReadBtn || isNearContainer) {
            isNearButton = true;
            resetFadeTimeout();
        } else {
            isNearButton = false;
        }
    });

    mainBtn.onclick = (e) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 200) {
            return;
        }
        lastClickTime = currentTime;

        isExpanded = !isExpanded;
        if (isExpanded) {
            showButtons();
        } else {
            hideButtons();
        }
    };

    // 初始化透明度
    resetFadeTimeout();

    // 插眼功能
    markBtn.onclick = async () => {
        const path = window.location.pathname;
        const postId = path.match(/\/t\/topic\/(\d+)/)?.[1] || path.match(/\/topic\/(\d+)/)?.[1];
        if (!postId) {
            alert('请在帖子页面使用此功能');
            return;
        }

        try {
            // 获取 CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('无法获取 CSRF token');
            }

            // 发送回复请求
            const response = await fetch('https://linux.do/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({
                    raw: 'LiNFERSmark～～～',
                    topic_id: postId,
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('回复失败');
            }

            alert('插眼成功！');
            // 刷新页面以显示新回复
            window.location.reload();
        } catch (error) {
            alert('插眼失败：' + error.message);
        }
    };

    // 已阅功能
    readBtn.onclick = () => {
        const path = window.location.pathname;
        const postId = path.match(/\/t\/topic\/(\d+)/)?.[1] || path.match(/\/topic\/(\d+)/)?.[1];
        if (!postId) {
            alert('请在帖子页面使用此功能');
            return;
        }

        let readPosts = GM_getValue('readPosts', []);
        if (!readPosts.includes(postId)) {
            readPosts.push(postId);
            GM_setValue('readPosts', readPosts);
            readBtn.style.background = 'rgba(144, 238, 144, 0.8)'; // 标记为已读后变成浅绿色
        } else {
            readPosts = readPosts.filter(id => id !== postId);
            GM_setValue('readPosts', readPosts);
            readBtn.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    };

    // 随机看帖功能
    randomBtn.onclick = async () => {
        // 获取最新帖子列表
        const response = await fetch('https://linux.do/latest.json');
        const data = await response.json();

        if (data.topic_list && data.topic_list.topics.length > 0) {
            const readPosts = GM_getValue('readPosts', []);
            // 过滤掉已阅的帖子
            const unreadTopics = data.topic_list.topics.filter(topic => !readPosts.includes(topic.id.toString()));

            if (unreadTopics.length === 0) {
                alert('所有帖子都已阅读过了！');
                return;
            }

            // 从未读帖子列表中随机选择一个
            const randomIndex = Math.floor(Math.random() * unreadTopics.length);
            const randomTopic = unreadTopics[randomIndex];

            // 导航到随机选择的帖子
            window.location.href = `https://linux.do/t/topic/${randomTopic.id}`;
        }
    };

    // 回到顶部功能
    topBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 到达底部功能
    bottomBtn.onclick = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    // 返回功能
    backBtn.onclick = () => {
        history.back();
    };

    // 创建弹窗
    const popup = document.createElement('div');
    setElementStyle(popup, {
        display: 'none',
        position: 'fixed',
        bottom: '80px',
        right: '220px',
        width: '300px',
        maxHeight: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: '9999',
        overflowY: 'auto',
        padding: '10px',
        backdropFilter: 'blur(10px)',
        opacity: '0',
        transform: 'translateX(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
    });
    document.body.appendChild(popup);

    let lastRecordedId = ''; // 记录最后一次记录的帖子 ID

    function recordVisit() {
        setTimeout(() => {
            const path = window.location.pathname;
            const postId = path.match(/\/t\/topic\/(\d+)/)?.[1] || path.match(/\/topic\/(\d+)/)?.[1];
            if (!postId) return;

            const title = document.querySelector('h1')?.textContent || document.title;
            const url = window.location.href;

            if (postId === lastRecordedId) return; // 避免重复记录
            lastRecordedId = postId;

            let history = GM_getValue('postHistory', []);

            // 检查是否存在相同帖子 ID
            const existingIndex = history.findIndex(item => item.id === postId);
            if (existingIndex !== -1) {
                history.splice(existingIndex, 1); // 删除重复记录
            }

            history.unshift({
                id: postId,
                title: title,
                url: url,
                time: new Date().toISOString(),
            });

            const maxRecords = Math.min(GM_getValue('maxRecords', 10), 20);
            if (history.length > maxRecords) {
                history = history.slice(0, maxRecords);
            }

            GM_setValue('postHistory', history);

            // 检查当前帖子是否已阅，更新按钮颜色
            const readPosts = GM_getValue('readPosts', []);
            if (readPosts.includes(postId)) {
                readBtn.style.background = 'rgba(144, 238, 144, 0.8)';
            } else {
                readBtn.style.background = 'rgba(255, 255, 255, 0.8)';
            }

            // 标记已浏览的帖子
            markVisitedPosts();
        }, 1000);
    }

    function showHistory() {
        const history = GM_getValue('postHistory', []);
        popup.innerHTML = '';

        // 设置区域
        const settingsDiv = document.createElement('div');
        setElementStyle(settingsDiv, {
            marginBottom: '10px',
            padding: '5px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        });

        const settingsLabel = document.createElement('label');
        settingsLabel.textContent = '记录条数: ';
        const settingsInput = document.createElement('input');
        settingsInput.type = 'number';
        settingsInput.min = 1;
        settingsInput.max = 20;
        settingsInput.value = GM_getValue('maxRecords', 10);
        setElementStyle(settingsInput, {
            width: '60px',
            margin: '0 5px',
            padding: '3px',
            borderRadius: '4px',
            border: '1px solid #ddd',
        });
        settingsInput.onchange = (e) => {
            let value = parseInt(e.target.value, 10);
            value = Math.min(20, Math.max(1, value));
            e.target.value = value;
            GM_setValue('maxRecords', value);
        };

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空记录';
        setElementStyle(clearBtn, {
            padding: '5px 10px',
            background: 'rgba(255, 68, 68, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        });
        clearBtn.onclick = () => {
            if (confirm('确定要清空所有浏览记录吗？')) {
                GM_setValue('postHistory', []);
                showHistory();
                // 清空记录后重新加载页面以更新标记
                window.location.reload();
            }
        };

        settingsDiv.appendChild(settingsLabel);
        settingsDiv.appendChild(settingsInput);
        settingsDiv.appendChild(clearBtn);
        popup.appendChild(settingsDiv);

        if (history.length === 0) {
            popup.innerHTML += '<p style="text-align:center;color:#666;">暂无浏览记录</p>';
            return;
        }

        // 展示记录
        const ul = document.createElement('ul');
        setElementStyle(ul, {
            listStyle: 'none',
            margin: '0',
            padding: '0',
        });

        history.forEach((item, index) => {
            const li = document.createElement('li');
            setElementStyle(li, {
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            });

            const time = new Date(item.time).toLocaleString();
            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = `
                <div style="font-size:14px;margin-bottom:5px;">${item.title}</div>
                <div style="font-size:12px;color:#666;">${time}</div>
            `;
            titleDiv.style.flex = '1';
            titleDiv.onclick = () => {
                window.location.href = item.url;
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            setElementStyle(deleteBtn, {
                padding: '5px 10px',
                background: 'rgba(255, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginLeft: '10px',
            });
            deleteBtn.onclick = (e) => {
                e.stopPropagation(); // 防止触发跳转
                if (confirm(`确定删除记录 "${item.title}" 吗？`)) {
                    history.splice(index, 1);
                    GM_setValue('postHistory', history);
                    showHistory();
                    // 删除记录后重新加载页面以更新标记
                    window.location.reload();
                }
            };

            li.appendChild(titleDiv);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });

        popup.appendChild(ul);
    }

    // 弹窗显示控制
    let isPopupVisible = false;
    btn.onclick = () => {
        isPopupVisible = !isPopupVisible;
        popup.style.display = isPopupVisible ? 'block' : 'none';
        if (isPopupVisible) {
            showHistory();
            // 添加一个小延迟以确保过渡动画生效
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.transform = 'translateX(0)';
            }, 10);
        } else {
            popup.style.opacity = '0';
            popup.style.transform = 'translateX(20px)';
            // 等待过渡动画完成后隐藏弹窗
            setTimeout(() => {
                if (!isPopupVisible) {
                    popup.style.display = 'none';
                }
            }, 300);
        }
    };

    // 点击外部关闭弹窗
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== btn) {
            if (isPopupVisible) {
                isPopupVisible = false;
                popup.style.opacity = '0';
                popup.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    if (!isPopupVisible) {
                        popup.style.display = 'none';
                    }
                }, 300);
            }
        }
    });

    // 初始记录
    recordVisit();

    // 监听 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            recordVisit();
        }
    }).observe(document.body, { childList: true, subtree: true });

    // 初始化时标记已浏览的帖子
    markVisitedPosts();

    // 监听 DOM 变化以处理动态加载的内容
    new MutationObserver(() => {
        markVisitedPosts();
    }).observe(document.body, { childList: true, subtree: true });
})();
