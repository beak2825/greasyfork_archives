// ==UserScript==
// @name         txt阅读器（仿pixiv，多主题）
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  访问txt时，美化阅读样式，有多个主题可供切换
// @author       Yesaye
// @match        *://*/*.txt
// @match        file:///*/*.txt
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/536343/txt%E9%98%85%E8%AF%BB%E5%99%A8%EF%BC%88%E4%BB%BFpixiv%EF%BC%8C%E5%A4%9A%E4%B8%BB%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536343/txt%E9%98%85%E8%AF%BB%E5%99%A8%EF%BC%88%E4%BB%BFpixiv%EF%BC%8C%E5%A4%9A%E4%B8%BB%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 主题定义
    const themes = {
        light: {
            name: '明亮',
            background: '#f5f5f5',
            containerBg: '#ffffff',
            textColor: '#1f1f1f',
            btnBg: '#ffffff',
            btnColor: '#23272e',
            btnBorder: '#cccccc'
        },
        classic: {
            name: '经典',
            background: '#fafafa',
            containerBg: '#f0f0f0',
            textColor: '#222',
            btnBg: '#e0e0e0',
            btnColor: '#222',
            btnBorder: '#bdbdbd'
        },
        paper: {
            name: '纸张',
            background: '#fdf6e3',
            containerBg: '#ffffff',
            textColor: '#333333',
            btnBg: '#f5f2e7',
            btnColor: '#333333',
            btnBorder: '#e0e0e0'
        },
        sepia: {
            name: '羊皮纸',
            background: '#f4ecd8',
            containerBg: '#f9f6f2',
            textColor: '#5b4636',
            btnBg: '#e9e1c8',
            btnColor: '#5b4636',
            btnBorder: '#d6cfc2'
        },
        gray: {
            name: '灰色',
            background: '#e0e0e0',
            containerBg: '#f5f5f5',
            textColor: '#424242',
            btnBg: '#bdbdbd',
            btnColor: '#212121',
            btnBorder: '#9e9e9e'
        },
        bluegray: {
            name: '蓝灰',
            background: '#eceff1',
            containerBg: '#cfd8dc',
            textColor: '#263238',
            btnBg: '#b0bec5',
            btnColor: '#263238',
            btnBorder: '#78909c'
        },

        // 暗色风格
        dark: {
            name: '暗黑',
            background: '#23272e',
            containerBg: '#181a1b',
            textColor: '#e0e0e0',
            btnBg: '#23272e',
            btnColor: '#e0e0e0',
            btnBorder: '#444'
        },
        nightblue: {
            name: '夜蓝',
            background: '#1a2233',
            containerBg: '#222c3a',
            textColor: '#b3c7e6',
            btnBg: '#2a3550',
            btnColor: '#b3c7e6',
            btnBorder: '#3b4a6b'
        },
        nord: {
            name: '北极',
            background: '#2e3440',
            containerBg: '#3b4252',
            textColor: '#d8dee9',
            btnBg: '#4c566a',
            btnColor: '#eceff4',
            btnBorder: '#81a1c1'
        },
        monokai: {
            name: '莫诺凯',
            background: '#272822',
            containerBg: '#383830',
            textColor: '#f8f8f2',
            btnBg: '#49483e',
            btnColor: '#a6e22e',
            btnBorder: '#fd971f'
        },
        dracula: {
            name: '德古拉',
            background: '#282a36',
            containerBg: '#44475a',
            textColor: '#f8f8f2',
            btnBg: '#6272a4',
            btnColor: '#f1fa8c',
            btnBorder: '#bd93f9'
        },
        solarized: {
            name: '日光',
            background: '#fdf6e3',
            containerBg: '#eee8d5',
            textColor: '#657b83',
            btnBg: '#eee8d5',
            btnColor: '#586e75',
            btnBorder: '#93a1a1'
        },

        // 彩色/特殊风格
        pink: {
            name: '粉色',
            background: '#ffe4ec',
            containerBg: '#fff0f6',
            textColor: '#ad1457',
            btnBg: '#f8bbd0',
            btnColor: '#ad1457',
            btnBorder: '#f06292'
        },
        ocean: {
            name: '海洋',
            background: '#e0f7fa',
            containerBg: '#b2ebf2',
            textColor: '#006064',
            btnBg: '#4dd0e1',
            btnColor: '#006064',
            btnBorder: '#00bcd4'
        },
        coffee: {
            name: '咖啡',
            background: '#ece0d1',
            containerBg: '#d7ccc8',
            textColor: '#4e342e',
            btnBg: '#bcaaa4',
            btnColor: '#4e342e',
            btnBorder: '#8d6e63'
        },
        green: {
            name: '绿色',
            background: '#e8f5e9',
            containerBg: '#c8e6c9',
            textColor: '#1b5e20',
            btnBg: '#a5d6a7',
            btnColor: '#1b5e20',
            btnBorder: '#81c784'
        },
        forest: {
            name: '森林',
            background: '#e8f5e9',
            containerBg: '#a5d6a7',
            textColor: '#2e7d32',
            btnBg: '#66bb6a',
            btnColor: '#1b5e20',
            btnBorder: '#388e3c'
        },
        sunset: {
            name: '落日',
            background: '#fff3e0',
            containerBg: '#ffe0b2',
            textColor: '#e65100',
            btnBg: '#ffb74d',
            btnColor: '#e65100',
            btnBorder: '#ff9800'
        },
        lavender: {
            name: '薰衣草',
            background: '#f3e8ff',
            containerBg: '#e1bee7',
            textColor: '#6a1b9a',
            btnBg: '#ce93d8',
            btnColor: '#6a1b9a',
            btnBorder: '#ab47bc'
        }
    };

    // 读取主题（优先GM_getValue，其次localStorage）
    let currentTheme = 'light';
    let canUseLocalStorage = true;
    try {
        // 测试localStorage可用性
        localStorage.getItem('txt_reader_theme');
    } catch (e) {
        console.log(e);
        canUseLocalStorage = false;
    }
    if (typeof GM_getValue === 'function') {
        try {
            currentTheme = GM_getValue('txt_reader_theme', canUseLocalStorage ? localStorage.getItem('txt_reader_theme') || 'light' : 'light');
            console.log("GM_getValue: "+currentTheme);
        } catch (e) {
            console.log(e);
            currentTheme = 'light';
        }
    } else if (canUseLocalStorage) {
        try {
            currentTheme = localStorage.getItem('txt_reader_theme') || 'light';
            console.log("localStorage: "+currentTheme);
        } catch (e) {
            console.log(e);
            currentTheme = 'light';
        }
    } else {
        currentTheme = 'light';
    }

    // 创建主题下拉框
    const themeSelect = document.createElement('select');
    themeSelect.style.position = 'fixed';
    themeSelect.style.top = '20px';
    themeSelect.style.right = '20px';
    themeSelect.style.zIndex = 9999;
    themeSelect.style.borderRadius = '6px';
    themeSelect.style.padding = '8px 16px';
    themeSelect.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
    themeSelect.style.cursor = 'pointer';
    themeSelect.style.transition = 'all 0.2s';

    // 填充下拉框选项
    const themeKeys = Object.keys(themes);
    themeKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = themes[key].name || key;
        themeSelect.appendChild(option);
    });
    themeSelect.value = currentTheme;
    document.body.appendChild(themeSelect);

    // 创建容器
    var text_containter = document.createElement("div");
    text_containter.id = "text_containter";

    var text_box = document.createElement("div");
    text_box.id = "text_box";

    text_containter.appendChild(text_box);
    document.body.appendChild(text_containter);

    // 将原始文本放入 text_box
    var pre = document.getElementsByTagName("pre")[0];
    if (pre) {
        text_box.textContent = pre.textContent;
        pre.remove();
    }

    // 注入自定义样式
    var style = document.createElement('style');
    style.type = "text/css";
    document.head.appendChild(style);

    function applyTheme(themeName) {
        const theme = themes[themeName];
        style.textContent = `
        html { background-color: ${theme.background}; }
        body {
            margin: 0;
            padding: 0;
        }
        #text_containter {
            margin: 30px auto;
            padding: 60px 0;
            width: 912px;
            background-color: ${theme.containerBg};
        }
        #text_box {
            color: ${theme.textColor};
            max-width: 620px;
            margin: auto;
            font-size: 16px;
            line-height: 2;
            background-color: ${theme.containerBg};
            font-family: "Avenir Next", Avenir, "Source Sans", "Noto Sans", Roboto, Verdana, "Pingfang SC", "Hiragino Sans GB", "Lantinghei SC", "Source Han Sans CN", "Noto Sans CJK SC", "Microsoft Yahei", DengXian, YuGothic, "Hiragino Kaku Gothic Pro", Meiryo, "Source Han Sans", "Source Han Sans JP", "Noto Sans CJK JP", "Pingfang TC", "Pingfang HK", "Hiragino Sans CNS", "Lantinghei TC", "Source Han Sans TW", "Source Han Sans HK", "Noto Sans CJK TC", "Microsoft JhengHei", "Apple SD Gothic Neo", "Source Han Sans K", "Source Han Sans KR", "Noto Sans CJK KR", "Malgun Gothic", sans-serif;
            font-feature-settings: normal;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            text-align: justify;
        }
        `;
        // 下拉框样式跟随主题
        themeSelect.style.background = theme.btnBg;
        themeSelect.style.color = theme.btnColor;
        themeSelect.style.border = `1px solid ${theme.btnBorder}`;
    }

    // 初始主题
    applyTheme(currentTheme);

    // 切换主题事件
    themeSelect.onchange = function () {
        currentTheme = themeSelect.value;
        if (canUseLocalStorage) {
            try {
                localStorage.setItem('txt_reader_theme', currentTheme);
                console.log("localStorage saved: "+currentTheme);
            } catch (e) { console.log(e); }
        } else {
            console.log("localStorage not available");
        }
        if (typeof GM_setValue === 'function') {
            try {
                GM_setValue('txt_reader_theme', currentTheme);
                console.log("GM_setValue saved: "+currentTheme);
            } catch (e) { console.log(e); }
        } else {
            console.log("GM_setValue not available");
        }
        applyTheme(currentTheme);
    };
})();