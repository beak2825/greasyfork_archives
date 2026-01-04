// ==UserScript==
// @name           测试视频倍速
// @namespace      /DBI/bili-more-rates
// @version        1.0.3
// @description    测试视频倍速: 1.7X; 2.5X; 3X; 4X; 5X; 10x.
// @author         DuckBurnIncense
// @match          https://www.bilibili.com/video/*
// @match          https://www.bilibili.com/list/watchlater/*
// @match          https://www.bilibili.com/bangumi/play/*
// @match          https://www.bilibili.com/list/*
// @match          https://www.bilibili.com/festival/*
// @icon           https://www.bilibili.com/favicon.ico  
// @supportURL     https://greasyfork.org/zh-CN/scripts/462473/  
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          unsafeWindow
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/528852/%E6%B5%8B%E8%AF%95%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/528852/%E6%B5%8B%E8%AF%95%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==


// 等待直到播放器被加载出来
(function (callback) {
  const wait = () => setTimeout(() => {
    if (document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu').length != 0) {
      callback();
      console.log('[为b站 (bilibili) 添加更多倍速] 已添加更多倍速');
    } else {
      wait();
    }
  }, 1000);
  wait();
})( () => {
    /**
     * 自定义的速度和快捷键
     */
    const myRateAndShortcuts = GM_getValue('myRatesAndShortcuts', [
        // 默认值
        { rate: 1.75, shortcut: '' },
        { rate: 2.2, shortcut: '' },
        { rate: 2.5,   shortcut: '' },
    ]);
    console.log('[为b站 (bilibili) 添加更多倍速] 倍数及快捷键', myRateAndShortcuts);
    /**
     * 自定义速度和快捷键
     * @param {{ rate: number, shortcut: string }[]} defaultValue 默认提示给用户的数据
     * @returns void
     */
    function customRatesAndShortcuts(defaultValue) {
        /**
         * 将用于存储和运行的自定义速度和快捷键数组转换成用户能看懂并编辑的字符串
         * @param {{ rate: number, shortcut: string }[]} arr 
         * @returns 可读的字符串. 格式: 倍数1(该倍数的快捷键),倍数2,倍数3(该倍数的快捷键),倍数n...
         */
        const arr2str = (arr) => {
            let str = '';
            arr.forEach(({ rate, shortcut }) => {
                str += rate + ((shortcut !== '') ? `(${shortcut})` : '') + ',';
            });
            // 删除最后一个逗号
            return str.slice(0, -1);
        }
        /**
         * 将用户能看懂并编辑的字符串转换成用于存储和运行的自定义速度和快捷键数组
         * @param {string} str 可读的字符串. 格式: 倍数1(该倍数的快捷键),倍数2,倍数3(该倍数的快捷键),倍数n...
         * @returns {{ rate: number, shortcut: string }[] | string} 存储和运行的自定义速度和快捷键数组 或 字符串 (代表输入有误, 内容为格式错误的前后)
         */
        const str2arr = (str) => {
            // 用于校验用户输入的正则表达式. 校验格式为单个的 "倍数n(该倍数的快捷键)"
            let regexp = /^(\d+(\.\d+)?) *(\((shift|ctrl|alt)\+(\S)\))? *$/i;
            // 输出数组
            let arr = [];
            // 将多个倍数值通过逗号分割为数组
            let items = str.split(',');
            for (let item of items) {
                let results = regexp.exec(item.trim(' '));
                if (results === null) return item;
                arr.push({
                  rate: results[1],
                  shortcut: results[4] ? (results[4].toLowerCase() + '+' + results[5].toLowerCase()) : '',
                });
            }
            return arr;
        }
        let newRatesAndShortcutsText = prompt(
          '编辑自定义倍数.\n格式为 "倍数1(该倍数的快捷键),倍数2,倍数3(该倍数的快捷键),倍数n", 例如: "0.1(shift+0),3(shift+3),5,7"\n"倍数" 与括号和逗号间允许有空格; 不设置快捷键的倍数后面可以不写括号; 倍数只用写数字, 不用在后面加 "x"; 整数倍数不用加 ".0".\n"快捷键" 的格式为 "控制键+符号键", 如 "shift+3" "ctrl+5". 若快捷键不生效可能和其他脚本或浏览器自带或 b 站原有的冲突了 (如 shift+1 和 shift+2 是 b 站官方的一二倍数快捷键)).',
          (typeof defaultValue === 'string' ? defaultValue : arr2str(defaultValue)));
        // 用户点击了取消
        if (newRatesAndShortcutsText === null) return;
        let newRatesAndShortcuts = str2arr(newRatesAndShortcutsText);
        if (typeof newRatesAndShortcuts === 'string') {
            // 格式有误
            alert('你输入的自定义倍数不符合格式, 请仔细检查.\n错误位置:\n' + newRatesAndShortcuts);
            // 再来一次
            return customRatesAndShortcuts(newRatesAndShortcutsText);
        }
        // 保存设置
        GM_setValue('myRatesAndShortcuts', newRatesAndShortcuts);
        alert('已保存. 刷新页面后生效.');
    }
    // 添加设置项
    GM_registerMenuCommand("自定义倍数和快捷键", () => customRatesAndShortcuts(myRateAndShortcuts));
    /**
     * 是否分两栏显示
     */
    const twoCols = GM_getValue('twoCols', 0);
    GM_registerMenuCommand((twoCols ? '[✔️已启用]' : '[❌已禁用]') + " 将倍数列表分为两栏显示", function() {
        GM_setValue('twoCols', !twoCols);
        alert((!twoCols ? '已启用' : '已禁用') + ', 刷新页面后生效!');
    });
    /**
     * dom 上的速度目录元素
     */
    const domRateMenu = document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0];
    /**
     * video 元素
     */
    const domVideoElement = document.querySelector('.bpx-player-video-wrap>video') || document.querySelector('.bpx-player-video-wrap>bwp-video');
    // debug
    console.log('[为b站 (bilibili) 添加更多倍速] Debug: 速度菜单元素 = ', domRateMenu, ', 视频元素 = ', domVideoElement);
    // 要是这俩就是加载不出来就退出程序
    if (!domRateMenu || !domVideoElement) return;
    /**
     * 已存在的速度
     */
    let existRates = [2, 1.5, 1.25, 1, 0.75, 0.5];
    // 添加自定义速度到 dom 上的速度目录
    myRateAndShortcuts.forEach(({ rate }) => {
        // 和 existRates 比较大小, 确定插入的位置
        let existRatesLength = existRates.length;
        // 插入的位置
        let i = 0;
        for (i = 0; i < existRatesLength; i++) {
            // 如果 已添加的速度 比 要添加的速度 小 则就应该在这个下标处增加
            // 变量要转换为数字类型再比较
            if (existRates[i] * 1 < rate * 1) break;
        }
        // 插入
        existRates.splice(i, 0, rate);
        // 创建一个 li
        let newRateNode = document.createElement('li');
        // 添加文字, 整数倍手动添加 ".0"
        newRateNode.innerText = (rate % 1 == 0 ? (rate + '.0') : rate) + 'x';
        // 添加 class
        newRateNode.classList.add('bpx-player-ctrl-playbackrate-menu-item');
        // 按照 b 站格式添加 data-value 属性
        newRateNode.dataset.value = rate;
        // 绑定点击事件
        newRateNode.addEventListener('click', () => {
            // 修改倍数
            domVideoElement.playbackRate = rate;
            // 剩下的添加 "bpx-state-active" class, 改变 "倍数" 处的文本b站好像已经帮我做了, 我就懒得重新写了
        });
        // 添加到 dom 速度列表
        domRateMenu.insertBefore(newRateNode, domRateMenu.children[i]);
    });
    // 是否分两栏显示
    if (twoCols) {
        // 根据倍数选项的个数确定分栏高度
        // 倍数选项的个数
        let existRatesLength = existRates.length;
        // 分栏高度
        // 如果倍数选项的个数是奇数则加一把它变成偶数
        // 36 为每个倍数选项的高度 (px)
        let height = ((existRatesLength % 2 == 0) ? existRatesLength : existRatesLength + 1) * 36 / 2;
        // 添加 css
        GM_addStyle(`
            .bpx-player-ctrl-playbackrate.bpx-state-show .bpx-player-ctrl-playbackrate-menu {
                display: flex!important;
            }
            .bpx-player-ctrl-playbackrate-menu {
                display: none;
                flex-direction: column;
                flex-wrap: wrap;
                width: 140px;
                height: ${height}px;
            }
            .bpx-player-ctrl-playbackrate-menu-item {
                width: 70px;
                height: 36px;
            }
        `);
    }
    // 监听按键 (快捷键)
    unsafeWindow.addEventListener('keydown', (event) => {
        // 不是组合键
        if (!event.altKey && !event.ctrlKey && !event.shiftKey) return;
        // 当前按的非 alt, ctrl, shift 键
        let pressedKey = event.key.toLowerCase();
        // 含 shift 的组合键会把一些字符变成其他字符
        if (event.shiftKey) {
          let map = {
            '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
            '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
            '~': '`',
          }
          pressedKey = map[pressedKey];
        }
        myRateAndShortcuts.forEach(({ rate, shortcut }) => {
            if (shortcut === '') return;
            let [controlKey, letterKey] = shortcut.split('+');
            if (
                (
                    (controlKey === 'shift' && event.shiftKey) ||
                    (controlKey === 'ctrl' && event.ctrlKey) ||
                    (controlKey === 'alt' && event.altKey)
                ) && letterKey === pressedKey
            ) {
              domVideoElement.playbackRate = rate;
              console.log('[为b站 (bilibili) 添加更多倍速] 已通过快捷键切换到 ' + rate + ' 倍数');
            }
        });
    })
});


/*
b 站倍数列表处 dom 结构:

<div class="bpx-player-ctrl-btn bpx-player-ctrl-playbackrate" role="button" aria-label="倍速" tabindex="0">
  <div class="bpx-player-ctrl-playbackrate-result">倍速</div>
  <ul class="bpx-player-ctrl-playbackrate-menu">
    <li class="bpx-player-ctrl-playbackrate-menu-item " data-value="2">2.0x</li>
    <li class="bpx-player-ctrl-playbackrate-menu-item " data-value="1.5">1.5x</li>
    <li class="bpx-player-ctrl-playbackrate-menu-item " data-value="1.25">1.25x</li>
    <li class="bpx-player-ctrl-playbackrate-menu-item bpx-state-active" data-value="1">1.0x</li>
    <li class="bpx-player-ctrl-playbackrate-menu-item " data-value="0.75">0.75x</li>
    <li class="bpx-player-ctrl-playbackrate-menu-item " data-value="0.5">0.5x</li>
  </ul>
</div>
*/