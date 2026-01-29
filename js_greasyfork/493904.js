// ==UserScript==
// @name         Add 1.75x, 3x and 4x Speed Options for bilibili
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add 1.75x, 3x and 4x speed options to Bilibili video player
// @author       AidenLu
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/493904/Add%20175x%2C%203x%20and%204x%20Speed%20Options%20for%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/493904/Add%20175x%2C%203x%20and%204x%20Speed%20Options%20for%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let optionAdded = false;
    let intervalId;

    function addSpeedOption() {
        let menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        // console.log('Finding playback menu:', menu); // 调试日志可以注释掉，保持控制台通过

        if (menu && !optionAdded) {
            // 1. 创建 1.75x 选项
            let newItem1_75x = document.createElement('li');
            newItem1_75x.className = 'bpx-player-ctrl-playbackrate-menu-item';
            newItem1_75x.setAttribute('data-value', '1.75');
            newItem1_75x.textContent = '1.75x';

            // 2. 创建 3x 选项 (新增)
            let newItem3x = document.createElement('li');
            newItem3x.className = 'bpx-player-ctrl-playbackrate-menu-item';
            newItem3x.setAttribute('data-value', '3');
            newItem3x.textContent = '3x';

            // 3. 创建 4x 选项
            let newItem4x = document.createElement('li');
            newItem4x.className = 'bpx-player-ctrl-playbackrate-menu-item';
            newItem4x.setAttribute('data-value', '4');
            newItem4x.textContent = '4x';

            // 获取定位用的锚点元素 (2.0x 和 1.5x)
            let item2x = menu.querySelector('[data-value="2"]');
            let item1_5x = menu.querySelector('[data-value="1.5"]');

            if (item2x && item1_5x) {
                // 插入逻辑：insertBefore 是插在参考节点的前面

                // 4x 插在 2x 前面 -> [4x, 2x...]
                menu.insertBefore(newItem4x, item2x);

                // 3x 也插在 2x 前面 (因为 4x 已经在最上面了，所以 3x 会位于 4x 和 2x 之间)
                // 现在的顺序 -> [4x, 3x, 2x...]
                menu.insertBefore(newItem3x, item2x);

                // 1.75x 插在 1.5x 前面 -> [..., 2x, 1.75x, 1.5x]
                menu.insertBefore(newItem1_75x, item1_5x);

                console.log('Custom speed options (4x, 3x, 1.75x) added.');

                optionAdded = true;
                clearInterval(intervalId);
            }
        }
    }

    window.addEventListener('load', () => {
        addSpeedOption();
        // B站有时候是动态加载，为了保险起见，保持轮询直到添加成功
        intervalId = setInterval(addSpeedOption, 1000);
    });
})();