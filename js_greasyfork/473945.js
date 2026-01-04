// ==UserScript==
// @name         douyin-live-tweak
// @namespace    slime7
// @version      0.1.1
// @description  调整抖音直播样式
// @note         打开控制台输入以下内容可以调整参数：
// @note         设置弹幕大小：dlt.setSize(28); // [10-64]
// @note         设置弹幕不透明度：dlt.setOpacity(0.6); // (0-1]
// @author       slime7
// @match        https://live.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473945/douyin-live-tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/473945/douyin-live-tweak.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const options = {
    danmuSize: 28,
    danmuOpacity: 0.518,
  };
  window.dlt = {
    setSize(size) {
      if (isNaN(+size) || size > 64 || size < 10) {
        console.log('参数有误');
        return;
      }
      options.danmuSize = +size;
    },
    setOpacity(opacity) {
      if (isNaN(+opacity) || opacity > 1 || opacity <= 0) {
        console.log('参数有误');
        return;
      }
      options.danmuOpacity = +opacity;
    },
  };

  const q = (query, ind = 0, undefined) => {
    if (query.startsWith('#')) {
      return document.getElementById(query.substring(1));
    } else if (!!query) {
      return document.querySelectorAll(query)[ind];
    }

    return undefined;
  };

  const domObserve = (el, cb) => {
    if (!el) {
      return;
    }

    const ob = new MutationObserver((mutationList) => cb(mutationList));
    ob.observe(el, { childList: true, attributes: false });
    return ob;
  };

  const danmuListOb = () => {
    const danmuDom = q('.xgplayer-danmu');
    if (!danmuDom) {
      setTimeout(danmuListOb, 1500);
      return;
    }
    console.log('弹幕节点', danmuDom);
    const danmuListCb = (mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((danmu) => {
            domObserve(danmu, (ml) => {
              ml.forEach((m) => {
                m.addedNodes.forEach((danmuText) => {
                  console.log('新弹幕:', danmuText);
                  danmuText.style.fontSize = `${options.danmuSize}px`;
                  danmuText.style.opacity = options.danmuOpacity;
                });
              });
            });
          });
        }
      });
    };
    domObserve(danmuDom, danmuListCb);
  };

  console.log('开始插入代码');
  danmuListOb();
})();
