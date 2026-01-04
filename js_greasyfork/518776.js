// ==UserScript==
// @name         xx
// @namespace    http://tampermonkey.net/game96897
// @version      2024-11-25
// @description  星宝农场挂机
// @author       wdzz
// @match        https://gamer.qq.com/v2/game/96897*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518776/xx.user.js
// @updateURL https://update.greasyfork.org/scripts/518776/xx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const userReset = () =>{
    const keyDownEvent = new KeyboardEvent('keydown', {
    key: 'r',
    code: 'KeyR',
    keyCode: 82,
    which: 82,
    bubbles: true,
    cancelable: true
  });
  const keyUpEvent = new KeyboardEvent('keyup', {
    key: 'r',
    code: 'KeyR',
    keyCode: 82,
    which: 82,
    bubbles: true,
    cancelable: true
  });
  // 触发 keydown 事件
  document.dispatchEvent(keyDownEvent);
  console.log('模拟按下 R 键');

  // 触发 keyup 事件
  setTimeout(() => {
    document.dispatchEvent(keyUpEvent);
    console.log('模拟松开 R 键');
  }, 100); // 延迟 100 毫秒后触发 keyup 事件
}

const gotoDrone = () =>{
    const keyDownEvent = new KeyboardEvent('keydown', {
    key: 'a',
    code: 'KeyA',
    keyCode: 65,
    which: 65,
    bubbles: true,
    cancelable: true
  });
  const keyUpEvent = new KeyboardEvent('keyup', {
    key: 'a',
    code: 'KeyA',
    keyCode: 65,
    which: 65,
    bubbles: true,
    cancelable: true
  });
  // 触发 keydown 事件
  document.dispatchEvent(keyDownEvent);
  console.log('模拟按下 A 键');

  // 触发 keyup 事件
  setTimeout(() => {
    document.dispatchEvent(keyUpEvent);
    console.log('模拟松开 A 键');
  }, 900); // 延迟 100 毫秒后触发 keyup 事件
}

const simulateKeyPress = () => {
  // 创建 keydown 事件
  const keyDownEvent = new KeyboardEvent('keydown', {
    key: 'q',
    code: 'KeyQ',
    keyCode: 81,
    which: 81,
    bubbles: true,
    cancelable: true
  });

  // 创建 keyup 事件
  const keyUpEvent = new KeyboardEvent('keyup', {
    key: 'q',
    code: 'KeyQ',
    keyCode: 81,
    which: 81,
    bubbles: true,
    cancelable: true
  });

  // 触发 keydown 事件
  document.dispatchEvent(keyDownEvent);
  console.log('模拟按下 Q 键');

  // 触发 keyup 事件
  setTimeout(() => {
    document.dispatchEvent(keyUpEvent);
    console.log('模拟松开 Q 键');
  }, 100); // 延迟 100 毫秒后触发 keyup 事件
};

const run = () => {
    userReset();
    setTimeout(() => {
        gotoDrone();
    }, 1100);
    setTimeout(() => {
        simulateKeyPress();
    }, 2100);
}

// 调用模拟按键函数
setInterval(run, 1000*60*5);

})();