// ==UserScript==
// @name           叶散_B站自定义倍速增强版, 支持快捷键和跨页同步
// @namespace      /YBZ/bili-more-rates
// @version        1.2.0
// @description    为 b 站添加更多倍速 (可自定义快捷键)，并支持多开页面实时同步速度。
// @author         叶炳之
// @match          https://www.bilibili.com/video/*
// @match          https://www.bilibili.com/list/watchlater*
// @match          https://www.bilibili.com/bangumi/play/*
// @match          https://www.bilibili.com/list/*
// @match          https://www.bilibili.com/festival/*
// @icon           https://www.bilibili.com/favicon.ico
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_registerMenuCommand
// @grant          unsafeWindow
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/543480/%E5%8F%B6%E6%95%A3_B%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA%E7%89%88%2C%20%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%92%8C%E8%B7%A8%E9%A1%B5%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/543480/%E5%8F%B6%E6%95%A3_B%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA%E7%89%88%2C%20%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%92%8C%E8%B7%A8%E9%A1%B5%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function () {
    const waitForElement = (selector, callback) => {
        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else {
                setTimeout(check, 500);
            }
        };
        check();
    };

    // 显示速度函数
    const SPEED_INTERVAL = 1000; // 明确赋值（单位：毫秒）
    function showSpeed(speed, index = 1) {
        let speedDiv = document.querySelector(`#speed`);
        if (!speedDiv) {
            const div = document.createElement('div');
            div.setAttribute('id', 'speed');
            div.innerHTML = '<span></span>';
            document.querySelector('.bpx-player-video-area').appendChild(div);
            speedDiv = div;
        }
        let speedSpan = speedDiv.querySelector('span')
        if (index == 1) {
            speedSpan.innerHTML = `${speed} X`
        } else {
            speedSpan.innerHTML = `${speed}`
        }
        speedDiv.style.visibility = 'visible'
        clearTimeout(window.speedTimer)
        window.speedTimer = setTimeout(() => {
            speedDiv.style.visibility = 'hidden'
        }, SPEED_INTERVAL)
    }


    // 主逻辑
    const init = () => {
        // 自定义速度和快捷键
        const myRateAndShortcuts = GM_getValue('myRatesAndShortcuts', [
            { rate: 1.5, shortcut: 'U' },
            { rate: 2, shortcut: 'J' },
            { rate: 2.5, shortcut: 'I' },
            { rate: 3, shortcut: 'K' },
            { rate: 4, shortcut: 'L' },
            { rate: 5, shortcut: ';' },
        ]);

        // 存储键名
        const CUSTOM_RATE = 'custom_rate';

        // 获取当前倍速（优先从 localStorage 读取，实时性更高）
        const getRate = () => {
            const localRate = parseFloat(localStorage.getItem(CUSTOM_RATE));
            const gmRate = GM_getValue(CUSTOM_RATE, 1);
            return localRate || gmRate;
        };

        // 设置倍速并同步到所有存储
        const setRate = (rate) => {
            GM_setValue(CUSTOM_RATE, rate);
            localStorage.setItem(CUSTOM_RATE, rate);
        };

        // 自定义速度和快捷键设置
        const customRatesAndShortcuts = (defaultValue) => {
            const arr2str = (arr) => arr.map(item => `${item.rate}(${item.shortcut})`).join(',');
            const str2arr = (str) => {
                return str.split(',').map(item => {
                    const match = item.match(/^(\d+(\.\d+)?)\((\S)\)$/i);
                    return match ? { rate: parseFloat(match[1]), shortcut: match[3] } : null;
                }).filter(Boolean);
            };

            const input = prompt(
                '格式: 倍数1(快捷键),倍数2(快捷键)\n例如: 2(J),3(K),4(L)',
                arr2str(defaultValue)
            );
            if (input) {
                const newRates = str2arr(input);
                if (newRates.length > 0) {
                    GM_setValue('myRatesAndShortcuts', newRates);
                    alert('已保存，刷新页面生效！');
                }
            }
        };

        // 注册菜单命令
        GM_registerMenuCommand("自定义倍数和快捷键", () => customRatesAndShortcuts(myRateAndShortcuts));

        // 获取视频和倍速菜单元素
        const domVideo = document.querySelector('.bpx-player-video-wrap video') || document.querySelector('bwp-video');
        const domRateMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');

        if (!domVideo || !domRateMenu) return;

        // 添加自定义倍速选项（只显示≤4倍速）
        const existRates = [2, 1.5, 1.25, 1, 0.75, 0.5];
        myRateAndShortcuts.forEach(({ rate }) => {
            if (!existRates.includes(rate) && rate <= 4) {
                const item = document.createElement('li');
                item.className = 'bpx-player-ctrl-playbackrate-menu-item';
                item.textContent = `${rate % 1 === 0 ? rate + '.0' : rate}x`;
                item.dataset.value = rate;
                item.addEventListener('click', () => {
                    domVideo.playbackRate = rate;
                    setRate(rate);
                    showSpeed(rate); // 点击菜单项也显示提示
                });
                domRateMenu.prepend(item);
            }
        });

        // 监听原生倍速选项的点击
        const originalRateItems = domRateMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
        originalRateItems.forEach(item => {
            item.addEventListener('click', () => {
                const rate = parseFloat(item.dataset.value);
                setRate(rate);
                showSpeed(rate); // 点击原生菜单项也显示提示
            });
        });

        // 初始化倍速
        domVideo.playbackRate = getRate();

        // 监听其他页面的倍速修改
        GM_addValueChangeListener(CUSTOM_RATE, (key, oldVal, newVal) => {
            domVideo.playbackRate = parseFloat(newVal);
        });

        // 快捷键监听
        unsafeWindow.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            myRateAndShortcuts.forEach(({ rate, shortcut }) => {
                if (shortcut && key === shortcut.toLowerCase()) {
                    domVideo.playbackRate = rate;
                    setRate(rate);
                    showSpeed(rate); // 快捷键设置时显示提示
                    e.preventDefault();
                }
            });
        });
    };

    // 等待播放器加载完成
    waitForElement('.bpx-player-ctrl-playbackrate-menu', init);
})();