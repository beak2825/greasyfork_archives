// ==UserScript==
// @name         语雀快捷键修改
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修改语雀的快捷键
// @author       AIJake
// @match        https://*.yuque.com/*
// @icon         https://www.google.com/s2/favicons?domain=yuque.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436902/%E8%AF%AD%E9%9B%80%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436902/%E8%AF%AD%E9%9B%80%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

const keyboardList = [
    [8, 'Backspace', 'Backspace'],
    [9, 'Tab', 'Tab'],
    [13, 'Enter', 'Enter'],
    [16, 'Shift', 'ShiftLeft'],
    [17, 'Control', 'ControlLeft'],
    [18, 'Alt', 'AltLeft'],
    [19, 'Pause', 'Pause'],
    [20, 'CapsLock', 'CapsLock'],
    [27, 'Escape', 'Escape'],
    [32, ' ', 'Space'],
    [33, 'PageUp', 'PageUp'],
    [34, 'PageDown', 'PageDown'],
    [35, 'End', 'End'],
    [36, 'Home', 'Home'],
    [37, 'ArrowLeft', 'ArrowLeft'],
    [38, 'ArrowUp', 'ArrowUp'],
    [39, 'ArrowRight', 'ArrowRight'],
    [40, 'ArrowDown', 'ArrowDown'],
    [44, 'PrintScreen', 'PrintScreen'],
    [45, 'Insert', 'Insert'],
    [46, 'Delete', 'Delete'],
    [48, '0', 'Digit0'],
    [49, '1', 'Digit1'],
    [50, '2', 'Digit2'],
    [51, '3', 'Digit3'],
    [52, '4', 'Digit4'],
    [53, '5', 'Digit5'],
    [54, '6', 'Digit6'],
    [55, '7', 'Digit7'],
    [56, '8', 'Digit8'],
    [57, '9', 'Digit9'],
    [65, 'a', 'KeyA'],
    [66, 'b', 'KeyB'],
    [67, 'c', 'KeyC'],
    [68, 'd', 'KeyD'],
    [69, 'e', 'KeyE'],
    [70, 'f', 'KeyF'],
    [71, 'g', 'KeyG'],
    [72, 'h', 'KeyH'],
    [73, 'i', 'KeyI'],
    [74, 'j', 'KeyJ'],
    [75, 'k', 'KeyK'],
    [76, 'l', 'KeyL'],
    [77, 'm', 'KeyM'],
    [78, 'n', 'KeyN'],
    [79, 'o', 'KeyO'],
    [80, 'p', 'KeyP'],
    [81, 'q', 'KeyQ'],
    [82, 'r', 'KeyR'],
    [83, 's', 'KeyS'],
    [84, 't', 'KeyT'],
    [85, 'u', 'KeyU'],
    [86, 'v', 'KeyV'],
    [87, 'w', 'KeyW'],
    [88, 'x', 'KeyX'],
    [89, 'y', 'KeyY'],
    [90, 'z', 'KeyZ'],
    [91, 'Meta', 'MetaLeft'],
    [93, 'ContextMenu', 'ContextMenu'],
    [112, 'F1', 'F1'],
    [113, 'F2', 'F2'],
    [114, 'F3', 'F3'],
    [115, 'F4', 'F4'],
    [116, 'F5', 'F5'],
    [117, 'F6', 'F6'],
    [118, 'F7', 'F7'],
    [119, 'F8', 'F8'],
    [120, 'F9', 'F9'],
    [121, 'F10', 'F10'],
    [122, 'F11', 'F11'],
    [123, 'F12', 'F12'],
    [144, 'NumLock', 'NumLock'],
    [145, 'ScrollLock', 'ScrollLock'],
    [186, ';', 'Semicolon'],
    [187, '=', 'Equal'],
    [188, ',', 'Comma'],
    [189, '-', 'Minus'],
    [190, '.', 'Period'],
    [191, '/', 'Slash'],
    [192, '`', 'Backquote'],
    [219, '[', 'BracketLeft'],
    [220, '\\', 'Backslash'],
    [221, ']', 'BracketRight'],
    [222, '\'', 'Quote'],
    [106, '*', 'NumpadMultiply'],
    [107, '+', 'NumpadAdd'],
    [111, '/', 'NumpadDivide'],
]

const numpadKeyboard = [
    [48, '0', 'Numpad0'],
    [49, '1', 'Numpad1'],
    [50, '2', 'Numpad2'],
    [51, '3', 'Numpad3'],
    [52, '4', 'Numpad4'],
    [53, '5', 'Numpad5'],
    [54, '6', 'Numpad6'],
    [55, '7', 'Numpad7'],
    [56, '8', 'Numpad8'],
    [57, '9', 'Numpad9'],
    [189, '-', 'NumpadSubtract'],
];

const keyMap = { 'Space': 32, 32: 'Space', 'Ctrl': 17, '⌘': 91 };
const keyCodeMap = {};
keyboardList.forEach(([keyCode, key, code]) => {
    keyMap[key] = keyCode;
    keyMap[keyCode] = key;
    keyCodeMap[key] = code;
    keyCodeMap[keyCode] = code;
    keyCodeMap[code] = keyCode;
});

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

if (isMac) {
    keyMap['Option'] = keyMap['Alt'];
    keyMap[keyMap['Alt']] = 'Option';
}

const CtrlCmd = (1 << 11) >>> 0;
const Shift = (1 << 10) >>> 0;
const Alt = (1 << 9) >>> 0;
const WinCtrl = (1 << 8) >>> 0;

function upcaseHead(str) {
    return str.toUpperCase().slice(0, 1) + str.slice(1);
}

function hash2keys(hash) {
    let keys = [];
    if (hash & CtrlCmd) {
        keys.push('Ctrl');
    }
    if (hash & WinCtrl) {
        keys.push('⌘');
    }
    if (hash & Shift) {
        keys.push('Shift');
    }
    if (hash & Alt) {
        if (isMac) {
            keys.push('Option');
        } else {
            keys.push('Alt');
        }
    }
    const code = hash & 0xff;
    if (code === 91) {
        keys.push('⌘');
    } else {
        keys.push(code === 32 ? 'Space' : upcaseHead(keyMap[code]));
    }
    return keys;
}

function keys2hash(keys) {
    return keys.reduce((hash, key, index) => {
        const lowKey = key.toLowerCase();
        if (!keyMap[key] && !keyMap[lowKey]) {
            throw new Error(`not valid key ${key}`);
        }
        if (index === keys.length - 1) {
            if (key === 'Space') {
                return hash | 32;
            } else if (key === '⌘') {
                return hash | 91;
            }
            return hash | (keyMap[key] || keyMap[lowKey]);
        } else {
            if (key === '⌘') {
                return hash |= WinCtrl;
            }
            switch (keyMap[key]) {
                case keyMap['Control']: return hash |= CtrlCmd;
                case keyMap['Meta']: return hash |= WinCtrl;
                case keyMap['Shift']: return hash |= Shift;
                case keyMap['Alt']: return hash |= Alt;
                default: throw new Error(`key "${key}" is not last key`);
            }
        }
    }, 0);
}


function keyboardEvent2hash(e) {
    let hash = 0;
    const code = keyMap[e.key] || e.keyCode || e.charCode;
    if (e.ctrlKey || code === keyMap['Ctrl']) {
        hash |= CtrlCmd;
    }
    if (e.metaKey || code === keyMap['Meta']) {
        hash |= WinCtrl;
    };
    if (e.shiftKey || code === keyMap['Shift']) {
        hash |= Shift;
    }
    if (e.altKey || code === keyMap['Alt']) {
        hash |= Alt;
    }
    hash |= code;
    return hash;
}

function str2hash(keyCode) {
    const keys = keyCode.split(/\s*\+\s*/g);
    return keys2hash(keys);
}

function hash2event(hash) {
    const keyCode = (hash & 0xff);
    return {
        keyCode: keyCode,
        which: keyCode,
        key: keyMap[keyCode],
        code: keyCodeMap[keyCode],
        altKey: !!(hash & Alt),
        shiftKey: !!(hash & Shift),
        ctrlKey: !!(hash & CtrlCmd),
        metaKey: !!(hash & WinCtrl),
    };
}

function replaceKeyBoardEventByHash(e, hash) {
    return {
        stopPropagation: () => e.stopPropagation(),
        preventDefault: () => e.preventDefault(),
        stopImmediatePropagation: () => e.stopImmediatePropagation(),
        isTrusted: true,
        srcElement: e.srcElement,
        target: e.target,
        type: e.type,
        view: e.view,
        sourceCapabilities: e.sourceCapabilities,
        bubbles: e.bubbles,
        cancelBubble: e.cancelBubble,
        cancelable: e.cancelable,
        composed: e.composed,
        currentTarget: e.currentTarget,
        defaultPrevented: e.defaultPrevented,
        detail: e.detail,
        eventPhase: e.eventPhase,
        isComposing: e.isComposing,
        timeStamp: e.timeStamp,
        location: e.location,
        path: e.path,
        repeat: e.repeat,
        returnValue: e.returnValue,
        ...hash2event(hash),
    }
}

let hasShowShotkey = false;
// 用来记录data-testid记录的值和新的快捷键hash绑定关系
let RecordChange = {};
let HashReplaceMap = {};
const LOCAL_KEY = 'hotkey-replace';

function save2Store() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({
        RecordChange,
        HashReplaceMap,
    }));
}

function loadStore() {
    const data = localStorage.getItem(LOCAL_KEY);
    console.info('store data', data);
    if (data) {
        try {
            const store = JSON.parse(data);
            RecordChange = store.RecordChange;
            HashReplaceMap = store.HashReplaceMap;
        } catch (e) {
            console.error(e);
        }
    }
}

// 在原来的handle外面包裹一层
// 可以在需要触发的时候替换掉event
function warpHandle(handle) {
    return e => {
        const hash = keyboardEvent2hash(e);
        if (HashReplaceMap[hash]) {
            // 替换成原来的事件
            return handle(replaceKeyBoardEventByHash(e, HashReplaceMap[hash]));
        }
        return handle(e);
    }
}


(function () {
    'use strict';
    const oldAddEventListener = HTMLElement.prototype.addEventListener
    HTMLElement.prototype.addEventListener = function (name, handle, ...args) {
        if (name === 'keydown') {
            oldAddEventListener.apply(this, [name, warpHandle(handle), ...args]);
        } else {
            oldAddEventListener.apply(this, [name, handle, ...args]);
        }
    }
    loadStore();
    const style = document.createElement('style');
    style.innerText = `
.hotkey-item div[data-testid] {
   cursor: pointer;
   position: relative;
}

input.keyboard-record {
  position: absolute;
  padding: 0 4px;
  z-index: 1;
  right: 0;
  top: 0;
  width: 160px;
  height: 100%;
  border: 1px solid #f0f0f0;
  outline: none;
}
    `;
    document.head.appendChild(style);

    // 创建input 让用户输入新的快捷键
    const input = document.createElement('input');
    input.placeholder = "请按快捷键，按enter结束";
    input.className = "keyboard-record";

    let recordKeys; // 用户输入的快捷键 字符串
    let recordHash; // 用户输入的hash值
    let originHash; // 原始绑定的hash值
    let originTestId; // 当前元素的testid

    // 提交新的快捷键
    const replaceCommit = () => {
        if (recordHash && originHash !== recordHash) {
            // 记录hash替换
            HashReplaceMap[recordHash] = originHash;
            // 记录应该testid和新的hash
            RecordChange[originTestId] = recordHash;
            input.parentNode.innerHTML = recordKeys.map(v => `<kbd>${v}</kbd>`).join('<span>+</span>');
        } else {
            if (RecordChange[originTestId]) {
                delete HashReplaceMap[RecordChange[originTestId]];
                delete RecordChange[originTestId];
            }
            input.parentNode.innerHTML = hash2keys(originHash).map(v => `<kbd>${v}</kbd>`).join('<span>+</span>');
        }
        // 存储当前的记录值
        save2Store();
        recordKeys = undefined;
        recordHash = undefined;
        originTestId = undefined;
        input.value = '';
        return;
    };
    // blur之后提交
    input.onblur = replaceCommit;
    // 监听用户输入的新的快捷键
    input.onkeydown = e => {
        e.stopPropagation();
        e.preventDefault();
        if (e.key === 'Enter') {
            return replaceCommit();
        }
        recordHash = keyboardEvent2hash(e);
        recordKeys = hash2keys(recordHash);
        input.value = hash2keys(recordHash).join('+');
    };

    document.body.addEventListener('click', e => {
        try {
            // 没有点击过 则点击之后修改ui
            if (!hasShowShotkey && e.target.closest('#siteTipGuide')) {
                hasShowShotkey = true;
                setTimeout(() => {
                    Object.keys(RecordChange).forEach(key => {
                        const dom = document.querySelector(`.hotkey-item div[data-testid="${key}"]`);
                        if (dom) {
                            // 生成原来的hash值
                            const keys = [];
                            // 将快捷键记录的内容转成key数组
                            dom.querySelectorAll('kbd').forEach(e => keys.push(e.textContent));
                            // 将原来的快捷键hash绑定上
                            dom.dataset.hash = keys2hash(keys);
                            dom.innerHTML = hash2keys(RecordChange[key]).map(v => `<kbd>${v}</kbd>`).join('<span>+</span>');
                        }
                    });
                }, 100);
                return;
            }
            // 判断是否点击在快捷键设置上
            const hotKeyBindDOM = e.target.closest('div[data-testid]');
            if (hotKeyBindDOM && hotKeyBindDOM.closest('.hotkey-item')) {
                // 记录哪些ui需要修改
                originTestId = hotKeyBindDOM.dataset['testid'];
                // 如果已经记录了原始hash值则直接使用, 未记录则重新生成
                if (hotKeyBindDOM.dataset.hash) {
                    originHash = Number(hotKeyBindDOM.dataset.hash);
                } else {
                    // 生成原来的hash值
                    const keys = [];
                    // 将快捷键记录的内容转成key数组
                    hotKeyBindDOM.querySelectorAll('kbd').forEach(e => keys.push(e.textContent));
                    originHash = keys2hash(keys);
                    hotKeyBindDOM.dataset.hash = originHash;
                }
                // 插入input 让用户输入新的快捷键
                hotKeyBindDOM.appendChild(input);
                input.focus();
            }
        } catch (e) {

        }
    });
})();