// ==UserScript==
// @name        Weread gamepad control
// @namespace   Violentmonkey Scripts
// @match       https://weread.qq.com/web/reader/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.2
// @author      -
// @license     GPL 3.0
// @description 使用xbox 游戏手柄控制微信读书翻页、滚动、全屏
// @update        update v1.1 增加Y切换全屏功能
// @update        update v1.2 增加LB RB 切换主题，X切换亮度功能
// @downloadURL https://update.greasyfork.org/scripts/514285/Weread%20gamepad%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/514285/Weread%20gamepad%20control.meta.js
// ==/UserScript==

var gamepadAPI = {
    job: 0,

    update: function () {
        // 清除按钮缓存
        gamepadAPI.buttonsCache = [];
        // 从上一帧中移动按钮状态到缓存中
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        // 清除按钮状态
        gamepadAPI.buttonsStatus = [];
        // 获取 gamepad 对象
        var c = navigator.getGamepads()[0];

        // 遍历按键，并将按下的按钮加到数组中
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < c.buttons.length; b++) {
                if (c.buttons[b].pressed) {
                    // console.log("buttons pressed " + gamepadAPI.buttons[b])
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        // 遍历坐标值并加到数组中
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {
                if (Math.abs(c.axes[a]) > 0.7) {
                    console.log("axes pressed " + gamepadAPI.axes[a])
                }
                axes.push(c.axes[a].toFixed(2));
            }
        }
        // 分配接收到的值
        gamepadAPI.axesStatus = axes;
        gamepadAPI.buttonsStatus = pressed;
        // 返回按钮以便调试
        return pressed;
    },

    buttonPressed: function (button, hold, released) {
        var newPress = false;
        var newRelease = false;

        // 轮询按下的按钮
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {
            // 如果我们找到我们想要的按钮
            if (gamepadAPI.buttonsStatus[i] == button) {
                // 设置布尔变量（newPress）为 true
                newPress = true;
                // 如果我们想检查按住还是单次按下
                if (!hold) {
                    // 从上一帧轮询缓存状态
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {
                        // 如果按钮（之前）已经被按下了则忽略新的按下状态
                        if (gamepadAPI.buttonsCache[j] == button) {
                            newPress = false;
                        }
                    }
                }
            }
        }

        // 检查是不是放开按钮
        if (released) {
            for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {
                if (gamepadAPI.buttonsCache[j] == button) {
                    // 检查当前帧中按钮是否未被按下
                    if (!gamepadAPI.buttonsStatus.includes(button)) {
                        newRelease = true;
                    }
                }
            }
        }

        return { pressed: newPress, released: newRelease };
    },

    buttons: [
        'A', 'B', 'X', 'Y',
        'LB', 'RB', 'LT', 'RT',
        'Option', 'Start',
        'Axis-Left', 'Axis-Right',
        'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right',
    ],
    axes: [
        'Left H', 'Left V',
        'Right H', 'Right V',
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
};


var themes = [
    { name: "白雪", value: ["#ffffff", "#000000"] },
    { name: "灰绿", value: ["#d8e7eb", "#000000"] },
    { name: "浅绿", value: ["#e9faff", "#000000"] },
    { name: "明黄", value: ["#ffffed", "#000000"] },
    { name: "淡绿", value: ["#eefaee", "#000000"] },
    { name: "草绿", value: ["#cce8cf", "#000000"] },
    { name: "红粉", value: ["#fcefff", "#000000"] },
    { name: "米黄", value: ["#f5f5dc", "#000000"] },
    { name: "茶色", value: ["#d2b48c", "#000000"] },
    { name: "银色", value: ["#c0c0c0", "#000000"] },
    { name: "浅黄", value: ["#f5f1e8", "#000000"] },
    { name: "浅灰", value: ["#d9e0e8", "#000000"] },
    { name: "午夜", value: ["#002b36", "#839496"] },
    { name: "墨水屏", value: ["#c0d3d7", "#111111"] },
    { name: "漆黑", value: ["#000000", "#555555"] },
];

/**
 * 
 * @param {string} color hex color
 * @param {number} factor 0-1
 * @returns css color
 */
function darkenColor(color, factor) {

    function hex2rgb(color) {
        hex = color.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        return [r, g, b];
    }

    function lab2rgb(lab) {
        var y = (lab[0] + 16) / 116,
            x = lab[1] / 500 + y,
            z = y - lab[2] / 200,
            r, g, b;

        x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
        y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
        z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);

        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.2040 + z * 1.0570;

        r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
        g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
        b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;

        return [Math.max(0, Math.min(1, r)) * 255,
        Math.max(0, Math.min(1, g)) * 255,
        Math.max(0, Math.min(1, b)) * 255]
    }


    function rgb2lab(rgb) {
        var r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255,
            x, y, z;

        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

        x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
        z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }

    let lab = rgb2lab(hex2rgb(color));

    console.log("lab color", lab);

    lab[0] = Math.max(0, lab[0] - lab[0] * factor);

    let rgb = lab2rgb(lab);

    console.log("rgb color", rgb);

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}


let wechatControl = {
    next: () => document.querySelector(".renderTarget_pager_button_right").click(),
    prev: () => document.querySelector(".renderTarget_pager_button:not(.renderTarget_pager_button_right)").click(),

    readerView: () => document.querySelector(".readerChapterContent"),
    readerWrap: () => document.querySelector(".readerChapterContent_container"),

    readerContent: () => document.querySelector(".wr_whiteTheme .readerChapterContent"),
    topBar: () => document.querySelector(".readerTopBar"),

    controls: () => document.querySelectorAll(".readerControls_item"),

    /** @type {number} */
    currentTheme: -1,
    /** @type {Node | null} */
    currentCss: null,

    updateStyle: (direction) => {
        let prevTheme = null
        if (wechatControl.currentTheme != -1) {
            prevTheme = themes[wechatControl.currentTheme]
        }
        wechatControl.currentTheme += direction
        if (wechatControl.currentTheme >= themes.length) wechatControl.currentTheme = 0

        let theme = themes[wechatControl.currentTheme].value
        wechatControl.setTheme(theme)
        wechatControl.saveTheme()
        const renderFontColor = () => {
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }

        if (!prevTheme || prevTheme.value[1] != theme[1]) {
            renderFontColor();
        }
    },

    dim: 0,
    darkMode: () => {
        if (wechatControl.currentTheme == -1) {
            wechatControl.currentTheme = 0
            wechatControl.saveTheme()
        }
        if (wechatControl.dim == 0) {
            wechatControl.dim = 0.3
        } else {
            wechatControl.dim = 0
        }
        wechatControl.updateStyle(0)
    },

    /**
     * 设置主题
     * @param {Array<string>} theme - 主题数组，包含背景色和字体颜色
     */
    setTheme: (theme) => {
        console.log("update theme")
        console.log(theme[0], theme[1])
        let color = theme[0]
        const dim = wechatControl.dim
        const backgroundColor = darkenColor(color, 0.1 + dim);

        if (dim != 0) {
            color = darkenColor(color, dim)
        }
        wechatControl.readerView().style.backgroundColor = color;


        let control_items = wechatControl.controls()
        for (let i = 0; i < control_items.length; i++) {
            control_items[i].style.backgroundColor = color;
        }

        wechatControl.readerWrap().style.backgroundColor = backgroundColor;
        wechatControl.topBar().style.backgroundColor = `#00000000`;

        if (wechatControl.currentCss) {
            wechatControl.currentCss.remove();
        }

        wechatControl.currentCss = GM_addStyle(`
            .wr_whiteTheme .readerChapterContent {
                color: ${theme[1]} !important;
            }
        ` );
    },

    saveTheme: () => {
        let theme = themes[wechatControl.currentTheme]
        GM_setValue("theme", theme.name)
    },

    loadTheme: () => {
        let themeName = GM_getValue("theme")
        if (themeName) {
            let theme
            let index = 0
            for (; index < themes.length; index++) {
                if (themes[index].name == themeName) {
                    theme = themes[index]
                    break
                }
            }
            wechatControl.currentTheme = index
            wechatControl.setTheme(theme.value)
        }
    },

    toggleFullScreen: () => {
        if (!document.fullscreenElement &&    // 标准方法
            !document.mozFullScreenElement && // Firefox
            !document.webkitFullscreenElement && // Chrome, Safari and Opera
            !document.msFullscreenElement) {  // IE/Edge

            // 请求全屏
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    },
    scroll: (direction) => {
        const hasVerticalScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
        if (hasVerticalScrollbar) {
            window.scrollTo({
                //60 fps
                top: window.scrollY + ((300 / 60) * direction),
                behavior: 'instant'
            });
        }
    }
};

(function () {
    'use strict';

    wechatControl.loadTheme()

    window.addEventListener("gamepadconnected", (evt) => {
        console.log('控制器已连接。');



        gamepadAPI.job = setInterval(() => {
            gamepadAPI.update()
            // 明确调用 buttonPressed 并传递按钮名称
            if (gamepadAPI.buttonPressed('A').pressed) {
                wechatControl.next()
            }
            // if (gamepadAPI.buttonPressed('A', true).pressed) {
            //     console.log('A 按钮被持续按下');
            // }
            // if (gamepadAPI.buttonPressed('A', false, true).released) {
            //     console.log('A 按钮被放开');
            // }

            if (gamepadAPI.buttonPressed('B').pressed) {
                wechatControl.prev();
            }

            if (gamepadAPI.buttonPressed('Y').pressed) {
                wechatControl.toggleFullScreen();
            }

            if (gamepadAPI.buttonPressed('X').pressed) {
                wechatControl.darkMode()
            }

            if (gamepadAPI.buttonPressed('LB').pressed) {
                wechatControl.updateStyle(-1)
            }
            if (gamepadAPI.buttonPressed('RB').pressed) {
                wechatControl.updateStyle(1)
            }

            if (gamepadAPI.buttonPressed('DPad-Up').pressed) {
                wechatControl.prev();
            }
            if (gamepadAPI.buttonPressed('DPad-Up', true).pressed) {
                wechatControl.scroll(-1)
            }
            if (gamepadAPI.buttonPressed('DPad-Down').pressed) {
                wechatControl.next();
            }
            if (gamepadAPI.buttonPressed('DPad-Down', true).pressed) {
                wechatControl.scroll(1)
            }
            if (gamepadAPI.buttonPressed('DPad-Left').pressed) {
                wechatControl.prev();
            }
            if (gamepadAPI.buttonPressed('DPad-Right').pressed) {
                wechatControl.next();
            }
        }, 16)
    });

    window.addEventListener("gamepaddisconnected", (evt) => {
        console.log('控制器已断开。');
        clearInterval(gamepadAPI.job)
    });

})();