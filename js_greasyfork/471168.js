// ==UserScript==
// @name         图寻我的插件
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  我的插件
// @author       yukejun
// @match        https://tuxun.fun/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471168/%E5%9B%BE%E5%AF%BB%E6%88%91%E7%9A%84%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/471168/%E5%9B%BE%E5%AF%BB%E6%88%91%E7%9A%84%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    //功能一
    'use strict';
    setTimeout(function() {
    if (/https:\/\/tuxun\.fun\/solo_game\?gameId=.*/.test(window.location.href)) {
    var waitGameStartDetected = false; // 标志，用于跟踪是否检测到div.wait_game_start

    // 创建第一个音频元素
        /*
        新游戏：https://www.geoguessr.com/_next/static/audio/new-game-b8432e127868ff7d44394955e53fffa8.mp3
        多人游戏：https://www.geoguessr.com/_next/static/audio/music-multipledamage-8c7ed8841afad13ad9f059d86334a593.mp3
        第一回合：https://www.geoguessr.com/_next/static/audio/music-round1-fc2d21b3f08324700ff96b74a5352e12.mp3
        第二回合：https://www.geoguessr.com/_next/static/audio/music-round2-1e24f0ebdb1c798535311e0b50ed7d6e.mp3
        分数：https://www.geoguessr.com/_next/static/audio/round-score-slide-in-8bf77a31b13ce4ffaf6bff612198a55c.mp3
        分数：https://www.geoguessr.com/_next/static/audio/round-score-slide-in-rows-402b592443b8b41f2fc68af3c8d2104e.mp3
        https://www.geoguessr.com/_next/static/audio/round-score-count-damage-670bae30eaabba0ccffa80cee88b92e9.mp3
        倒计时：https://www.geoguessr.com/_next/static/audio/churchbell-73c6308cbccee4a93df439e3fb978308.mp3
        加载：https://www.geoguessr.com/_next/static/audio/loading-round-damage-d632503980956f3efd136adbba5b8c9c.mp3
        失败：https://www.geoguessr.com/_next/static/audio/game-lost-99961d9254c1ed52c726d2d798735993.mp3
        胜利：https://www.geoguessr.com/_next/static/audio/game-won-26da6a9f06b6e826982a87c780ad61fa.mp3
        */
    var audio1 = new Audio('https://www.geoguessr.com/_next/static/audio/loading-round-1011350fcf18c9b9759ec112eedd41eb.mp3');

    audio1.volume = 0.3;

    // 创建第二个音频元素，并设置为循环播放
    var audio2 = new Audio('https://www.geoguessr.com/_next/static/audio/music-round1-fc2d21b3f08324700ff96b74a5352e12.mp3', 0.3, true);
    audio2.volume = 0.3;
    audio2.loop = true;
    // 创建第三个音频元素
    var audio3 = new Audio('https://cdn2.ear0.com:3321/preview?soundid=41146&type=mp3');
    // 当第一首歌结束时，如果没有检测到div.wait_game_start，播放第二首歌
    audio1.onended = function() {
        if (!waitGameStartDetected) {
            audio2.play();
            audio2.volume = 0.3;
        }
    };
    // 渐增音量的函数
    function increaseVolume() {
        var volume = 0;
        audio2.volume = volume;
        var fade = setInterval(function() {
            if (volume < 0.3) {
                volume += 0.01;

                audio2.volume = volume;
            } else {
                clearInterval(fade);
            }
        }, 200);
    }
    // 使用MutationObserver监听DOM变化
var targetElement = document.querySelector('.top-info');
// 修改 MutationObserver 的回调函数
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                // 在这里添加其他检测逻辑
            });
        } else if (mutation.type === 'characterData') {
            var node = mutation.target;
            // 检测含有“倒计时: 10”文字的 div 元素
            if (node.nodeType === Node.TEXT_NODE && node.parentNode.matches("div.count-down") && node.nodeValue.includes("倒计时: 10")) {
                audio3.play(); // 播放第三个音频
                console.log("检测到倒计时为10秒的元素");
            }
        }
        mutation.addedNodes.forEach(function(node) {
            // 检测 div.wait_game_start
            if (node.matches && node.matches("div.wait_game_start")) {
                waitGameStartDetected = true;
                setTimeout(function() {
                    audio2.play();
                }, 7000);
            }
            // 检测 .round_result
            if (node.matches && node.matches("div.round_result")) {
                audio2.pause();
            }
        });
        mutation.removedNodes.forEach(function(node) {
            if (node.matches && node.matches(".round_result")) {
                increaseVolume();
                audio2.play();
            }
        });
    });
});

// 配置观察器选项，监视子节点的变化和文本内容的变化
var config1 = { childList: true, subtree: true, characterData: true };

    // 开始观察body元素，以检测DOM变化
    observer.observe(document.body, config1);

    // 开始播放第一首歌
    audio1.play();
    }
}, 1000); // 延迟2秒执行



    // 定义一个全局变量来存储当前的点击事件监听器函数
var currentClickListener = null;
    // 函数：检测并输出游戏轮次信息
    function checkAndLogRoundInfo() {
        // 使用querySelector检测页面中是否存在特定元素
        var roundInfoElement = document.querySelector('.round_result_round_info');
        // 如果元素存在
        if (roundInfoElement) {
            // 获取游戏轮次信息并输出到控制台
            console.log('游戏轮次:', roundInfoElement.textContent.trim());
        }
    }

    // 函数：为匹配的图片元素添加事件监听器
    function addListenerToImage(imgElement) {
        // 检查图片源 URL 是否符合特定模式
        if (imgElement && /https:\/\/i\.chao-fan\.com\/biz\/\d+_[\w-]+_0\.png/.test(imgElement.src)) {
            // 添加事件监听器
            imgElement.addEventListener('click', function() {
                console.log('图片被点击:', imgElement.src);
            }
                                       );
            console.log('事件监听器已添加到图片:', imgElement.src);
        }
    }
    // 创建一个observer实例，传入回调函数
    var roundObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 初始化计数器
                let count = 0;
                // 对于每个被添加的节点，检查是否为我们感兴趣的节点
                for (var i = 0; i < mutation.addedNodes.length && count < 3; i++) {
                    var newNode = mutation.addedNodes[i];
                    // 确保 newNode 是一个元素节点
                    if (newNode.nodeType === Node.ELEMENT_NODE && newNode.matches('.round_result')) {
                        count++; // 更新计数器
                        // 直接从 newNode 获取游戏轮次信息
                        var roundInfoElement = newNode.querySelector('.round_result_round_info');
                        if (roundInfoElement) {
                            var roundInfo = roundInfoElement.textContent.trim();
                            var roundNumberMatch = roundInfo.match(/\d+/); // 匹配数字来获取轮次
                            if (roundNumberMatch) {
                                var roundNumber = roundNumberMatch[0];
                                console.log('游戏轮次:', roundNumber);
                                // 获取当前页面的URL
                                var currentUrl = window.location.href;
                                // 使用正则表达式匹配infinityId的值
                                var infinityIdMatch = currentUrl.match(/infinityId=([a-f\d\-]+)/);
                                if (infinityIdMatch) {
                                    var infinityId = infinityIdMatch[1];
                                    // 使用infinityId构建包含gameId参数的新URL
                                    var newUrl = `https://tuxun.fun/replay_pano?gameId=${infinityId}&round=${roundNumber}`;
                                    console.log('包含gameId的新URL:', newUrl);
                                } else {
                                    console.log('无法找到infinityId');
                                }
        // 移除旧的点击事件监听器
        if (currentClickListener) {
            document.removeEventListener('click', currentClickListener);
        }
        // 定义新的点击事件监听器函数
        currentClickListener = function(event) {
            const imgElement = event.target.closest('img');
            if (imgElement && /https:\/\/i\.chao-fan\.com\/biz\/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0\.png/.test(imgElement.src)) {
                console.log("点击的图片地址：", imgElement.src);
        // 如果点击的是包含特定URL模式的图片
        console.log("点击的图片地址：", imgElement.src); // 在控制台输出点击的图片地址
        const newUrl = `https://tuxun.fun/replay_pano?gameId=${infinityId}&round=${roundNumber}`; // 定义目标网址
        window.open(newUrl, '_blank'); // 在新标签页中打开目标网址
        console.log("打开的新窗口URL：", newUrl); // 在控制台输出新窗口的网址
            }
        };
                                        // 添加新的点击事件监听器
        document.addEventListener('click', currentClickListener);
                            }

                        }

                        // 如果计数器已经达到3，就退出循环
                        if (count >= 3) {
                            break;
                        }

                    }
                }
            }
        });
    });


    // 配置observer实例：监听子元素的变动
    var config = { childList: true, subtree: true };

    // 选择需要观察变动的节点
    var targetNode = document.body;

    // 调用observer的observe()方法，开始监听目标节点
    roundObserver.observe(targetNode, config);

    // 功能4：拖拽指南针功能
    function setInitialPositionFromStorage(element, selector) {
        const storedPos = localStorage.getItem(selector);
        if (storedPos) {
            const { left, top } = JSON.parse(storedPos);
            element.style.left = left;
            element.style.top = top;
        }
    }

    function makeDraggable(element, selector) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        if (!element) return;
        if (window.getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        setInitialPositionFromStorage(element, selector);
        element.addEventListener('mousedown', function(event) {
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            initialX = parseInt(element.style.left || 0);
            initialY = parseInt(element.style.top || 0);
            const map = window.map || document.querySelector('#map').__gm;
            if (map && map.setOptions) {
                map.setOptions({draggable: false});
            }
            event.stopPropagation();
            event.preventDefault();
        });

        document.addEventListener('mousemove', function(event) {
            if (!isDragging) return;
            let dx = event.clientX - startX;
            let dy = event.clientY - startY;
            element.style.left = (initialX + dx) + 'px';
            element.style.top = (initialY + dy) + 'px';
            event.stopPropagation();
            event.preventDefault();
        });

        document.addEventListener('mouseup', function(event) {
            if (isDragging) {
                const map = window.map || document.querySelector('#map').__gm;
                if (map && map.setOptions) {
                    map.setOptions({draggable: true});
                }
                localStorage.setItem(selector, JSON.stringify({
                    left: element.style.left,
                    top: element.style.top
                }));
            }
            isDragging = false;
            event.stopPropagation();
        });
    }

    document.addEventListener('dblclick', function(event) {
        if (event.target.closest('#tuxun')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    const selectors = [
        '#viewer > div > div:nth-child(14) > div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div'
    ];
    const dragObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                selectors.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        makeDraggable(element, selector);
                    }
                });
            }
        }
    });
// 功能3：按空格键触发特定的按钮
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        // 使用类名选择器
        let button = document.querySelector('.el-button.el-button--primary.el-button--medium.is-round');
        if (button && button.textContent.includes('开始(经典5轮)')) {
            button.click();
        }

        // ...可以在这里添加其他选择器逻辑...
    }
});
    /*// 功能3：按空格键触发另一个选择器
document.addEventListener('keydown', function(e) {
    // 输出到控制台，确保事件被触发
    console.log('Key pressed:', e.keyCode);

    if (e.keyCode === 32) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(function(button) {
            if (button.textContent.includes('开始(经典5轮)') || button.textContent.includes('再来一局') || button.textContent.includes('保留')) {
                button.click();
            }
        });
    }
});
*/

// 功能4：隐藏包含 "比赛已经开始或者这一轮游戏还未结束" 和 "你已经被淘汰" 文本的提示
var toastObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.van-toast.van-toast--middle.van-toast--text')) {
                    const innerDiv = node.querySelector('.van-toast__text');
                    const textContent = innerDiv && innerDiv.textContent.trim();
                    if (textContent === "比赛已经开始或者这一轮游戏还未结束" || textContent === "你已经被淘汰") {
                        node.style.display = 'none';
                    }
                }
            });
        }
    });
});
    // 各自开始监听
roundObserver.observe(document.body, { childList: true, subtree: true });
toastObserver.observe(document.body, { childList: true, subtree: true });
    dragObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


})();
