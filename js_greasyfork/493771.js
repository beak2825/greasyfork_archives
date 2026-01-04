// ==UserScript==
// @name         全自动揣手手
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  mumu
// @author       哪里有甜品哪里就有
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493771/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8F%A3%E6%89%8B%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493771/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8F%A3%E6%89%8B%E6%89%8B.meta.js
// ==/UserScript==

var mscststs = new class {
  sleep(miliseconds) {
    return new Promise(resolve => {
      setTimeout(() => { resolve(); }, miliseconds);
    });
  }
  async _Step(selector, callback, need_content, timeout) {
    while (timeout--) {
      if (document.querySelector(selector) === null) {
        await this.sleep(100);
        continue;
      } else {
        if (need_content) {
          if (document.querySelector(selector).innerText.length == 0) {
            await this.sleep(100);
            continue;
          }
        }
      }
      break;
    }

    callback(selector);
  }
  wait(selector, need_content = false, timeout = Infinity) {
    return new Promise(resolve => {
      this._Step(selector, function (selector) { resolve(document.querySelector(selector)); }, need_content, timeout);
    });
  }
}();

(async function() {
    'use strict';

    const chatControlPanel = (await mscststs.wait("#control-panel-ctnr-box")).__vue__;
    const fullscreenControlPanel = (await mscststs.wait(".fullscreen-danmaku")).__vue__;

    while(!chatControlPanel.isLogin){
        await mscststs.sleep(1000);
    }

    await mscststs.sleep(1000);

    hackDanmakuControl(chatControlPanel);
    hackDanmakuControl(fullscreenControlPanel);

    function hackDanmakuControl(inputControlPanel){
        const rawSendFunc = inputControlPanel.sendDanmaku.bind(inputControlPanel);
        inputControlPanel.sendDanmaku = function(a, b, c, d, e) {
            this.chatInput += "(揣手手)";
            rawSendFunc(a, b, c, d, e);
        };
    }

})();