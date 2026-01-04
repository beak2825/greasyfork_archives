// ==UserScript==
// @name         bilibili一键打开有红包的直播间
// @description  bilibili一键打开有红包的直播间, 按住ctrl/command键后台打开有红包的直播间, 配合[B站直播自动抢红包]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447220/bilibili%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%9C%89%E7%BA%A2%E5%8C%85%E7%9A%84%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/447220/bilibili%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%9C%89%E7%BA%A2%E5%8C%85%E7%9A%84%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const player = document.querySelector('#live-player');
  let list = [];

  function generatorLink() {
    const btn = document.querySelector('#auto-btn-xxxxxxxx');
    if (!btn) {
      const btn = document.createElement('button');
      btn.id = 'auto-btn-xxxxxxxx';
      btn.innerHTML = '按住Ctrl/Command后台打开';
      btn.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        background: #008ac5;
        color: #fff;
      `;
      player.appendChild(btn);
      console.log(`已生成按钮`);
      btn.addEventListener('click', async function () {
        openPage();
        player.removeChild(btn);
      });
    }
  }

  // 获取有红包的房间列表
  async function getRedPocketList() {
    const {
      _ts_rpc_return_: {
        data: { list },
      },
    } = await fetch(
      'https://api.live.bilibili.com/xlive/fuxi-interface/JuneRedPacket2022Controller/redPocketPlaying'
    ).then((res) => res.json());
    return list;
  }

  // 后台打开页面需要按住 `ctrl / command`
  function openPage() {
    list.forEach(({ roomId, countDown }) => {
      console.log(`已打开${roomId}, ${countDown}s后关闭`);
      const page = window.open('https://live.bilibili.com/' + roomId);
      setTimeout(() => {
        page.close();
      }, countDown * 1000);
    });
  }

  // 运行
  async function run() {
    console.log('获取红包房间开始');
    list = await getRedPocketList();
    if (list.length > 0) {
      console.log(`获取到${list.length}个房间有红包`);
      generatorLink();
    }
    // 红包房间3分钟一波
    setTimeout(run, 1000 * 60 * 3);
  }

  run();
})();



