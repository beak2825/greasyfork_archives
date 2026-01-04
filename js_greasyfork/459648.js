// ==UserScript==
// @name         via 中文化
// @namespace    cc.kayanouriko.via.syringe
// @version      1.0.0
// @author       kayanouriko
// @description  中文化 via 界面部分菜单和按键注释
// @license      MIT
// @icon         https://www.caniusevia.com/favicon-32x32.png
// @match        https://usevia.app/*
// @downloadURL https://update.greasyfork.org/scripts/459648/via%20%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459648/via%20%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const configure = {
    "Authorize device": "授权设备",
    "Searching for devices...": "正在搜索设置...",
    Keymap: "键映射",
    Macros: "宏设置",
    "Save + Load": "保存 / 加载",
    Lighting: "灯效修改",
    Layer: "层",
    "Authorize New": "授权新设备",
    Basic: "基础按键",
    Media: "多媒体按键",
    Macro: "宏相关",
    Layers: "层相关",
    Special: "特殊按键",
    "QMK Lighting": "QMK 灯效",
    Custom: "自定义按键",
    // 宏
    "Enter text directly, or wrap": "请输入文本, 或者使用",
    "in ": "",
    "{}": "",
    "Basic Keycodes": "基本键码",
    "Single tap: ": "单击按键: ",
    "Chord: ": "连续输入: ",
    "Delay (ms): ": "延时 (单位毫秒): ",
    "Tap 'Enter' at end of macro": "执行完宏后自动回车",
    "Type ? to search for keycodes": "按键格式? 请搜索 qmk basic keycodes.",
    // 加载保存
    "Save Current Layout": "保存当前布局的配置文件到本地",
    Save: "保存",
    "Load Saved Layout": "导入本地的布局配置文件",
    // 灯效
    Backlight: "背景灯效",
    Brightness: "亮度",
    Effect: "灯效类型",
    "Effect Speed": "灯效速度",
    Color: "灯光颜色"
  };
  const design = {
    "Load Draft Definition": "导入原定设计的布局配置",
    Load: "导入",
    "Use V2 definitions (deprecated)": "使用 V2 版本的布局配置 (已弃用)",
    "Draft Definitions": "已有的布局配置"
  };
  const global = {
    "Loading...": "加载中..."
  };
  const keycodes = {
    // 基础键码中的特殊按键
    "KC_NO: Nothing": "KC_NO: 忽略这个按键",
    "KC_TRNS: Pass-through": "KC_TRNS: 响应低一层不是 KC_TRNS 状态的按键",
    // 数字键盘
    "KC_P1: Numpad 1": "KC_P1: 数字键盘 1",
    "KC_P2: Numpad 2": "KC_P2: 数字键盘 2",
    "KC_P3: Numpad 3": "KC_P3: 数字键盘 3",
    "KC_P4: Numpad 4": "KC_P4: 数字键盘 4",
    "KC_P5: Numpad 5": "KC_P5: 数字键盘 5",
    "KC_P6: Numpad 6": "KC_P6: 数字键盘 6",
    "KC_P7: Numpad 7": "KC_P7: 数字键盘 7",
    "KC_P8: Numpad 8": "KC_P8: 数字键盘 8",
    "KC_P9: Numpad 9": "KC_P9: 数字键盘 9",
    "KC_P0: Numpad 0": "KC_P0: 数字键盘 0",
    "KC_PSLS: Numpad /": "KC_PSLS: 数字键盘 /",
    "KC_PAST: Numpad *": "KC_PAST: 数字键盘 *",
    "KC_PMNS: Numpad -": "KC_PMNS: 数字键盘 -",
    "KC_PPLS: Numpad +": "KC_PPLS: 数字键盘 +",
    "KC_PDOT: Numpad .": "KC_PDOT: 数字键盘 .",
    "KC_PENT: Numpad Enter": "KC_PENT: 数字键盘 Enter",
    // 多媒体
    "KC_VOLD: Volume Down": "KC_VOLD: 音量减小",
    "KC_VOLU: Volume Up": "KC_VOLU: 音量增大",
    "KC_MUTE: Mute Audio": "KC_MUTE: 全局静音 / 取消",
    "KC_MPLY: Play/Pause": "KC_MPLY: 播放 / 暂停",
    "KC_MSTP: Media Stop": "KC_MSTP: 停止播放",
    "KC_MPRV: Media Previous": "KC_MPRV: 播放上一曲目",
    "KC_MNXT: Media Next": "KC_MNXT: 播放下一曲目",
    "KC_MFFD: Fast Forward": "KC_MFFD: 播放快进",
    "KC_MRWD: Rewind": "KC_MRWD: 播放倒退",
    "KC_MSEL: Media Select": "KC_MSEL: 启动播放器",
    "KC_EJCT: Media Eject": "KC_EJCT: 退出播放器",
    // layer
    "FN_MO13: Hold = Layer 1, Hold with Fn2 = Layer 3": "FN_MO13: 长按切换至层1, 和 fn2 一起长按切换至层3.",
    "FN_MO23: Hold = Layer 2, Hold with Fn1 = Layer 3": "FN_MO23: 长按切换至层2, 和 fn1 一起长按切换至层3.",
    "SPC_FN1: Hold = Layer 1, Tap = Space": 'SPC_FN1: 长按切换至层1, 单击为 "空格".',
    "SPC_FN2: Hold = Layer 2, Tap = Space": 'SPC_FN2: 长按切换至层2, 单击为 "空格".',
    "SPC_FN3: Hold = Layer 3, Tap = Space": 'SPC_FN3: 长按切换至层3, 单击为 "空格".',
    "MO(0): Momentary turn layer 0 on": "MO(0): 按下时将层0设置为开启状态, 松开按键后则层0回到关闭状态.",
    "MO(1): Momentary turn layer 1 on": "MO(1): 按下时将层1设置为开启状态, 松开按键后则层1回到关闭状态.",
    "MO(2): Momentary turn layer 2 on": "MO(2): 按下时将层2设置为开启状态, 松开按键后则层2回到关闭状态.",
    "MO(3): Momentary turn layer 3 on": "MO(3): 按下时将层3设置为开启状态, 松开按键后则层3回到关闭状态.",
    "MO(4): Momentary turn layer 4 on": "MO(4): 按下时将层4设置为开启状态, 松开按键后则层4回到关闭状态.",
    "MO(5): Momentary turn layer 5 on": "MO(5): 按下时将层5设置为开启状态, 松开按键后则层5回到关闭状态.",
    "MO(6): Momentary turn layer 6 on": "MO(6): 按下时将层6设置为开启状态, 松开按键后则层6回到关闭状态.",
    "MO(7): Momentary turn layer 7 on": "MO(7): 按下时将层7设置为开启状态, 松开按键后则层7回到关闭状态.",
    "MO(8): Momentary turn layer 8 on": "MO(8): 按下时将层8设置为开启状态, 松开按键后则层8回到关闭状态.",
    "MO(9): Momentary turn layer 9 on": "MO(9): 按下时将层9设置为开启状态, 松开按键后则层9回到关闭状态.",
    "TG(0): Toggle layer 0 on/off": "TG(0): 如果层0时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(1): Toggle layer 1 on/off": "TG(1): 如果层1时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(2): Toggle layer 2 on/off": "TG(2): 如果层2时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(3): Toggle layer 3 on/off": "TG(3): 如果层3时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(4): Toggle layer 4 on/off": "TG(4): 如果层4时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(5): Toggle layer 5 on/off": "TG(5): 如果层5时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(6): Toggle layer 6 on/off": "TG(6): 如果层6时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(7): Toggle layer 7 on/off": "TG(7): 如果层7时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(8): Toggle layer 8 on/off": "TG(8): 如果层8时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TG(9): Toggle layer 9 on/off": "TG(9): 如果层9时关闭状态, 按下后则变成开启状态, 反之亦然.",
    "TT(0): Normally acts like MO unless it's tapped multple times which toggles layer 0 on": "TT(0): 功能与 MO(0) 类似, 不同的是多次点击后, 则将层0设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(1): Normally acts like MO unless it's tapped multple times which toggles layer 1 on": "TT(1): 功能与 MO(1) 类似, 不同的是多次点击后, 则将层1设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(2): Normally acts like MO unless it's tapped multple times which toggles layer 2 on": "TT(2): 功能与 MO(2) 类似, 不同的是多次点击后, 则将层2设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(3): Normally acts like MO unless it's tapped multple times which toggles layer 3 on": "TT(3): 功能与 MO(3) 类似, 不同的是多次点击后, 则将层3设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(4): Normally acts like MO unless it's tapped multple times which toggles layer 4 on": "TT(4): 功能与 MO(4) 类似, 不同的是多次点击后, 则将层4设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(5): Normally acts like MO unless it's tapped multple times which toggles layer 5 on": "TT(5): 功能与 MO(5) 类似, 不同的是多次点击后, 则将层5设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(6): Normally acts like MO unless it's tapped multple times which toggles layer 6 on": "TT(6): 功能与 MO(6) 类似, 不同的是多次点击后, 则将层6设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(7): Normally acts like MO unless it's tapped multple times which toggles layer 7 on": "TT(7): 功能与 MO(7) 类似, 不同的是多次点击后, 则将层7设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(8): Normally acts like MO unless it's tapped multple times which toggles layer 8 on": "TT(8): 功能与 MO(8) 类似, 不同的但是多次点击后, 则将层8设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "TT(9): Normally acts like MO unless it's tapped multple times which toggles layer 9 on": "TT(9): 功能与 MO(9) 类似, 不同的是多次点击后, 则将层9设置为开启状态, 松开后并不会恢复关闭状态, 默认需要连续按5次.",
    "OSL(0): Switch to layer 0 for one keypress": "OSL(0): 暂时切换至层0, 直到按下下一个键.",
    "OSL(1): Switch to layer 1 for one keypress": "OSL(1): 暂时切换至层1, 直到按下下一个键.",
    "OSL(2): Switch to layer 2 for one keypress": "OSL(2): 暂时切换至层2, 直到按下下一个键.",
    "OSL(3): Switch to layer 3 for one keypress": "OSL(3): 暂时切换至层3, 直到按下下一个键.",
    "OSL(4): Switch to layer 4 for one keypress": "OSL(4): 暂时切换至层4, 直到按下下一个键.",
    "OSL(5): Switch to layer 5 for one keypress": "OSL(5): 暂时切换至层5, 直到按下下一个键.",
    "OSL(6): Switch to layer 6 for one keypress": "OSL(6): 暂时切换至层6, 直到按下下一个键.",
    "OSL(7): Switch to layer 7 for one keypress": "OSL(7): 暂时切换至层7, 直到按下下一个键.",
    "OSL(8): Switch to layer 8 for one keypress": "OSL(8): 暂时切换至层8, 直到按下下一个键.",
    "OSL(9): Switch to layer 9 for one keypress": "OSL(9): 暂时切换至层9, 直到按下下一个键.",
    "TO(0): Turn on layer 0 when pressed": "TO(0): 切换到层0, 并且停用其余所有层数(除了默认层)",
    "TO(1): Turn on layer 1 when pressed": "TO(1): 切换到层1, 并且停用其余所有层数(除了默认层)",
    "TO(2): Turn on layer 2 when pressed": "TO(2): 切换到层2, 并且停用其余所有层数(除了默认层)",
    "TO(3): Turn on layer 3 when pressed": "TO(3): 切换到层3, 并且停用其余所有层数(除了默认层)",
    "TO(4): Turn on layer 4 when pressed": "TO(4): 切换到层4, 并且停用其余所有层数(除了默认层)",
    "TO(5): Turn on layer 5 when pressed": "TO(5): 切换到层5, 并且停用其余所有层数(除了默认层)",
    "TO(6): Turn on layer 6 when pressed": "TO(6): 切换到层6, 并且停用其余所有层数(除了默认层)",
    "TO(7): Turn on layer 7 when pressed": "TO(7): 切换到层7, 并且停用其余所有层数(除了默认层)",
    "TO(8): Turn on layer 8 when pressed": "TO(8): 切换到层8, 并且停用其余所有层数(除了默认层)",
    "TO(9): Turn on layer 9 when pressed": "TO(9): 切换到层9, 并且停用其余所有层数(除了默认层)",
    "DF(0): Sets the default layer 0": "DF(0): 切换至层0并设置成默认层",
    "DF(1): Sets the default layer 1": "DF(1): 切换至层1并设置成默认层",
    "DF(2): Sets the default layer 2": "DF(2): 切换至层2并设置成默认层",
    "DF(3): Sets the default layer 3": "DF(3): 切换至层3并设置成默认层",
    "DF(4): Sets the default layer 4": "DF(4): 切换至层4并设置成默认层",
    "DF(5): Sets the default layer 5": "DF(5): 切换至层5并设置成默认层",
    "DF(6): Sets the default layer 6": "DF(6): 切换至层6并设置成默认层",
    "DF(7): Sets the default layer 7": "DF(7): 切换至层7并设置成默认层",
    "DF(8): Sets the default layer 8": "DF(8): 切换至层8并设置成默认层",
    "DF(9): Sets the default layer 9": "DF(9): 切换至层9并设置成默认层",
    // 特殊按键
    "KC_GESC: Esc normally, but ` when Shift or Win is pressed": 'KC_GESC: 通常为 Esc, 和 Shift 或者 Win 长按时为 "`"',
    "KC_LSPO: Left Shift when held, ( when tapped": 'KC_LSPO: 长按为 "左Shift", 单击为 "("',
    "KC_RSPC: Right Shift when held, ) when tapped": 'KC_RSPC: 长按为 "右Shift", 单击为 ")"',
    "KC_LCPO: Left Control when held, ( when tapped": 'KC_LCPO: 长按为 "左Control", 单击为 "("',
    "KC_RCPC: Right Control when held, ) when tapped": 'KC_RCPC: 长按为 "右Control", 单击为 ")"',
    "KC_LAPO: Left Alt when held, ( when tapped": 'KC_LAPO: 长按为 "左Alt", 单击为 "("',
    "KC_RAPC: Right Alt when held, ) when tapped": 'KC_RAPC: 长按为 "右Alt", 单击为 ")"',
    "KC_SFTENT: Right Shift when held, Enter when tapped": 'KC_SFTENT: 长按为 "右Shift", 单击为 "Enter"',
    "Enter any QMK Keycode": "输入任意 QMK 键码",
    "RESET: Reset the keyboard": "RESET: 重置键盘",
    "MAGIC_TOGGLE_NKRO: Toggle NKRO": "MAGIC_TOGGLE_NKRO: 全键无冲 开启 / 关闭",
    KC_PWR: "KC_PWR: Windows 关机",
    KC_POWER: "KC_POWER: macOS 关机",
    KC_SLEP: "KC_SLEP: 睡眠",
    KC_WAKE: "KC_WAKE: 唤醒",
    KC_CALC: "KC_CALC: 打开应用 计算器",
    KC_MAIL: "KC_MAIL: 打开应用 邮件",
    KC_HELP: "KC_HELP: 打开应用 帮助",
    KC_MS_BTN1: "KC_MS_BTN1: 鼠标左键",
    KC_MS_BTN2: "KC_MS_BTN2: 鼠标右键",
    KC_MS_WH_UP: "KC_MS_WH_UP: 鼠标滚轮向上滚动",
    KC_MS_WH_DOWN: "KC_MS_WH_DOWN: 鼠标滚轮向下滚动",
    KC_MS_WH_LEFT: "KC_MS_WH_LEFT: 鼠标滚轮向左滚动",
    KC_MS_WH_RIGHT: "KC_MS_WH_RIGHT: 鼠标滚动向右滚动",
    "Please enter your desired QMK keycode or hex code:": "请输入您想要的 QMK 键码或十六进制代码：",
    Confirm: "确定",
    Cancel: "取消",
    // qmk 灯效
    BL_TOGG: "BL_TOGG: 背光 打开 / 关闭",
    BL_STEP: "BL_STEP: 循环切换背光等级",
    BL_ON: "BL_ON: 将背光设置为最大等级",
    BL_OFF: "BL_OFF: 关闭背光",
    BL_UP: "BL_UP: 增加背光级别",
    BL_DOWN: "BL_DOWN: 降低背光级别",
    BL_BRTG: "BL_BRTG: 切换背光级别",
    RGB_TOG: "RGB_TOG: RGB灯效 打开 / 关闭",
    RGB_MOD: "RGB_MOD: 正向循环切换RGB灯效模式, 按住 Shift 时反向循环",
    RGB_RMOD: "RGB_RMOD: 反向循环切换RGB灯效模式, 按住 Shift 时正向循环",
    RGB_HUI: "RGB_HUI: 增加色相(改变颜色), 按住 Shift 时降低色相(改变颜色)",
    RGB_HUD: "RGB_HUD: 降低色相(改变颜色), 按住 Shift 时增加色相(改变颜色)",
    RGB_SAI: "RGB_SAI: 增加饱和度, 按住 Shift 时降低饱和度",
    RGB_SAD: "RGB_SAD: 降低饱和度, 按住 Shift 时增加饱和度",
    RGB_VAI: "RGB_VAI: 增加亮度, 按住 Shift 时降低亮度",
    RGB_VAD: "RGB_VAD: 降低亮度, 按住 Shift 时增加亮度",
    RGB_SPI: "RGB_SPI: 提高灯效速度, 按住 Shift 时降低灯效速度",
    RGB_SPD: "RGB_SPD: 降低灯效速度, 按住 Shift 时提高灯效速度",
    "RGB_M_P: Plain": "RGB_M_P: 静态(无动画)模式",
    "RGB_M_B: Breathe": "RGB_M_B: 呼吸动画模式",
    "RGB_M_R: Rainbow": "RGB_M_R: 彩虹动画模式",
    "RGB_M_SW: Swirl": "RGB_M_SW: 漩涡动画模式",
    "RGB_M_SN: Snake": "RGB_M_SN: 蛇形动画模式",
    "RGB_M_K: Knight": "RGB_M_K: 霹雳游侠动画模式",
    "RGB_M_X: Xmas": "RGB_M_X: 圣诞动画模式",
    "RGB_M_G: Gradient": "RGB_M_G: 渐变动画模式"
  };
  const keytester = {
    "Reset Keyboard": "重置按键测试状态",
    "Test Matrix": "使用键盘实际布局"
  };
  const settings = {
    "Show Design tab": "显示设计标签"
  };
  const tab = {
    Configure: "配置布局",
    "Key Tester": "按键测试",
    Design: "设计",
    Settings: "设置"
  };
  const datas = {
    ...configure,
    ...design,
    ...global,
    ...keycodes,
    ...keytester,
    ...settings,
    ...tab
  };
  function getTranslateText(key) {
    return datas[key];
  }
  function start() {
    const nodeIterator = document.createNodeIterator(document.body);
    translate(nodeIterator);
    addObserver();
  }
  function addObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          translateNode(node);
          if (node.childNodes) {
            const nodeIterator = document.createNodeIterator(node);
            translate(nodeIterator);
          }
        });
      });
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
  function translate(nodeIterator) {
    let node = nodeIterator.nextNode();
    while (node) {
      translateNode(node);
      node = nodeIterator.nextNode();
    }
  }
  function translateNode(node) {
    if (!node.nodeName) {
      return;
    }
    if (isText(node)) {
      const text = node.textContent;
      if (!text) {
        return;
      }
      const translateText = getTranslateText(text);
      if (translateText === void 0) {
        return;
      }
      node.textContent = translateText;
    }
  }
  function isText(node) {
    return node != null && node.nodeType === Node.TEXT_NODE;
  }
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { passive: true, once: true });
    } else {
      callback();
    }
  }
  const version = "1.0.0";
  function startLog() {
    const usName = "via 中文化";
    console.log(
      `%c ${usName} %c v${version} `,
      "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;",
      "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;",
      `脚本已注入网页!`
    );
  }
  ready(() => {
    startLog();
    start();
  });
})();
