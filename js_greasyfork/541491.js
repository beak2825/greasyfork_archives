// ==UserScript==
// @name         VIP视频解析支持爱奇艺/腾讯视频/优酷/搜狐视频/乐视/芒果TV/哔哩哔哩/PPTV/youtube等
// @name:zh      VIP视频解析、多个解析节点 
// @name:zh-TW	 VIP视频解析、多个解析节点 
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description       支持手动选择、UI增强、多个解析节点
// @description:zh    支持手动选择、UI增强、多个解析节点
// @description:zh-TW 支持手动选择、UI增强、多个解析节点
// @author       Marken
// @match        *://*.iqiyi.com/*
// @match        *://v.qq.com/*
// @match        *://*.youku.com/*
// @match        *://*.mgtv.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.le.com/*
// @match        *://*.pptv.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      z1.im1907.top
// @connect      svip.bljiex.cc
// @connect      jx.m3u8.tv
// @connect      www.8090g.cn
// @connect      jx.xyflv.cc
// @connect      jx.2s0.cn
// @connect      jx.qqwtt.com
// @connect      jx.jsonplayer.com
// @connect      www.ckplayer.vip
// @connect      www.pangujiexi.com
// @connect      dmjx.m3u8.tv
// @connect      svip.bljiex.com
// @connect      www.playm3u8.cn
// @connect      www.yemu.xyz
// @connect      www.administratorw.com
// @connect      api.qianqi.net
// @connect      yparse.ik9.cc
// @connect      jx.yangtu.top
// @connect      jx.we-vip.com
// @connect      vip.mpos.ren
// @connect      www.ckmov.com
// @connect      jx.playerjy.com
// @connect      jx.xmflv.com
// @connect      jx.yparse.com
// @connect      jx.iztyy.com
// @connect      www.8090.la
// @connect      www.mtosz.com
// @connect      movie.heheda.top
// @connect      vip.wandhi.com
// @connect      videolucky.xyz
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/541491/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%94%AF%E6%8C%81%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%BC%98%E9%85%B7%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%E4%B9%90%E8%A7%86%E8%8A%92%E6%9E%9CTV%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9PPTVyoutube%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541491/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%94%AF%E6%8C%81%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%BC%98%E9%85%B7%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%E4%B9%90%E8%A7%86%E8%8A%92%E6%9E%9CTV%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9PPTVyoutube%E7%AD%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 🧠 初始化变量
  const DETECT_TIMEOUT = 3000;
  let apiAvailable = [];
  let detectionDone = false;

  // 🎯 定义 30 个解析
  const parseInterfaceList = [
    { name: " M1907", url: "https://z1.im1907.top/?jx=" },
    { name: " BL智能解析", url: "https://svip.bljiex.cc/?v=" },
    { name: " M3U8解析", url: "https://jx.m3u8.tv/jiexi/?url=" },
    { name: "8090解析", url: "https://www.8090g.cn/jiexi/?url=" },
    { name: "咸鱼解析", url: "https://jx.xyflv.cc/?url=" },
    { name: "极速解析", url: "https://jx.2s0.cn/player/?url=" },
    { name: "剖云解析", url: "https://jx.qqwtt.com/?url=" },
    { name: "综合/B站", url: "https://jx.jsonplayer.com/player/?url=" },
    { name: "ckplayer", url: "https://www.ckplayer.vip/jiexi/?url=" },
    { name: "盘古", url: "https://www.pangujiexi.com/jiexi/?url=" },
    { name: "eptept", url: "https://dmjx.m3u8.tv/?url=" },
    { name: "BL原", url: "https://svip.bljiex.com/?v=" },
    { name: "PlayM3U8", url: "https://www.playm3u8.cn/jiexi.php?url=" },
    { name: "1夜幕", url: "https://www.yemu.xyz/?url=" },
    { name: "管理者", url: "https://www.administratorw.com/video.php?url=" },
    { name: "冰豆", url: "https://api.qianqi.net/vip/?url=" },
    { name: "云解析", url: "https://yparse.ik9.cc/index.php?url=" },
    { name: "YT解析", url: "https://jx.yangtu.top/?url=" },
    { name: "JY解析", url: "https://jx.we-vip.com/?url=" },
    { name: "人人解析", url: "https://vip.mpos.ren/v/?url=" },
    { name: "ckmov", url: "https://www.ckmov.com/?url=" },
    { name: "Player-JY", url: "https://jx.playerjy.com/?url=" },
    { name: "虾米", url: "https://jx.xmflv.com/?url=" },
    { name: "yparse", url: "https://jx.yparse.com/index.php?url=" },
    { name: "猪蹄", url: "https://jx.iztyy.com/Bei/?url=" },
    { name: "全能8090", url: "https://www.8090.la/8090/?url=" },
    { name: "Mao解析", url: "https://www.mtosz.com/m3u8.php?url=" },
    { name: "风影阁", url: "https://movie.heheda.top/?v=" },
    { name: "万地解析", url: "http://vip.wandhi.com/?v=" },
    { name: "VideoLucky", url: "https://videolucky.xyz/jiexi?url=" }
  ];

  // 初始化可用性数组
  apiAvailable = new Array(parseInterfaceList.length).fill(false);

  // 🎯 检测某个解析是否可用
  function detectInterface(api, idx) {
    return new Promise(resolve => {
      const testUrl = api.url + encodeURIComponent(location.href); // 拼接当前视频页面地址
      const timer = setTimeout(() => resolve(false), DETECT_TIMEOUT); // 超时处理

      GM_xmlhttpRequest({
        method: 'HEAD',
        url: testUrl,
        onload: res => {
          clearTimeout(timer);
          resolve(res.status >= 200 && res.status < 400); // HTTP 2xx~3xx 判定为可用
        },
        onerror: () => {
          clearTimeout(timer);
          resolve(false); // 请求失败即不可用
        }
      });
    }).then(success => {
      apiAvailable[idx] = success;
    });
  }

  // 📦 检测全部的可用性
  async function detectAllInterfaces() {
    if (detectionDone) return;
    detectionDone = true;

    const tasks = parseInterfaceList.map((api, idx) => detectInterface(api, idx));
    await Promise.all(tasks);

    console.log('✅ 所有检测完成:', apiAvailable);
  }

  // ✅ 选择最优可用
  function pickBestInterface() {
    return apiAvailable.findIndex(avail => avail === true);
  }

  // 🔗 打开指定索引的页面
  function openParser(index) {
    const api = parseInterfaceList[index];
    if (!api) {
      alert('❌ 无效的索引！');
      return;
    }

    const fullUrl = api.url + encodeURIComponent(location.href);
    GM_openInTab(fullUrl, false); // false 表示后台打开标签页
  }

  // 🧭 创建页面右上角主按钮（用于切换显示面板）
  function createToggleButton() {
    if (document.getElementById('vip-parser-toggle-btn')) return; // 避免重复创建

    const btn = document.createElement('button');
    btn.id = 'vip-parser-toggle-btn';
    btn.textContent = '解析';
    btn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 999999;
      padding: 8px 14px;
      background: #FF4500;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      user-select: none;
    `;

    btn.onclick = () => {
      const panel = document.getElementById('vip-parser-panel');
      if (!panel) return;
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    };

    document.body.appendChild(btn);
  }

  // 🪟 创建主解析面板（包含标题 + 关闭按钮）
  function createPanel() {
    if (document.getElementById('vip-parser-panel')) return; // 避免重复添加

    const panel = document.createElement('div');
    panel.id = 'vip-parser-panel';
    panel.style.cssText = `
      position: fixed;
      top: 60px;
      right: 10px;
      width: 400px;
      background: #222;
      color: #eee;
      border-radius: 6px;
      box-shadow: 0 0 10px #000;
      padding: 10px;
      z-index: 999999;
      display: none;
      font-family: sans-serif;
      user-select: none;
    `;

    // 📌 标题栏区域
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    `;

    const title = document.createElement('div');
    title.textContent = '选择解析';
    title.style.cssText = 'font-weight: bold; font-size: 16px;';
    titleBar.appendChild(title);

    // ❌ 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: #444;
      color: #eee;
      border: none;
      font-size: 20px;
      cursor: pointer;
      border-radius: 3px;
      padding: 0 6px;
    `;
    closeBtn.onclick = () => {
      panel.style.display = 'none';
    };
    titleBar.appendChild(closeBtn);

    panel.appendChild(titleBar);

    // 🧱 按钮网格区域
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 6px;
      max-height: 280px;
      overflow-y: auto;
    `;

    parseInterfaceList.forEach((api, idx) => {
      const btn = document.createElement('button');
      btn.textContent = api.name;
      btn.name = api.url;
      btn.style.cssText = `
        background: #444;
        color: #eee;
        border: none;
        padding: 6px 4px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      btn.onclick = () => openParser(idx);
      grid.appendChild(btn);
    });

    panel.appendChild(grid);
    document.body.appendChild(panel);
  }

  // 初始加载检测并生成UI
  detectAllInterfaces().then(() => {
    createToggleButton();
    createPanel();
  });

})();
