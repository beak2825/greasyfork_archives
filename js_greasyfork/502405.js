// ==UserScript==
// @name        Inject to fix ReactFresh
// @namespace   
// @match       https://console.cloud.tencent.com/*
// @grant       none
// @version     1.0.1
// @author      Wyatttguo
// @description 2024/8/2 10:22:51
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502405/Inject%20to%20fix%20ReactFresh.user.js
// @updateURL https://update.greasyfork.org/scripts/502405/Inject%20to%20fix%20ReactFresh.meta.js
// ==/UserScript==
(function () {
  'use strict';

  try {
    var flag = localStorage.getItem('consoleDevMode');
    if (flag !== 'on') {
      localStorage.setItem('consoleDevMode', 'on');
      console.log('[autoEnterDevMode] 设置开发模式标志位成功');
    }
  } catch (error) {
    console.warn('[autoEnterDevMode] 设置开发模式标志位失败', error);
  }

  try {
    const injectedMap = new Map();
    var nextID = 0;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: injectedMap,
      supportsFiber: true,
      inject: function (injected) {
        injectedMap.set(nextID, injected);
        return nextID++;
      },
      onScheduleFiberRoot: function (id, root, children) {},
      onCommitFiberRoot: function (id, root, maybePriorityLevel, didError) {},
      onCommitFiberUnmount: function () {},
    };
  } catch {}
})();