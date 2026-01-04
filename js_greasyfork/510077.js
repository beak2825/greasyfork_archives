// ==UserScript==
// @name         EH高亮本地本子
// @namespace    http://tampermonkey.net/
// @version      2024.10.29
// @description  彩色高亮本地exhentai-manga-manager中存在的本子
// @author       Cury
// @match        *://exhentai.org/*
// @match        *://e-hentai.org/*
// @icon         https://raw.githubusercontent.com/SchneeHertz/exhentai-manga-manager/master/public/icon.png
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510077/EH%E9%AB%98%E4%BA%AE%E6%9C%AC%E5%9C%B0%E6%9C%AC%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/510077/EH%E9%AB%98%E4%BA%AE%E6%9C%AC%E5%9C%B0%E6%9C%AC%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置要使用的高亮颜色，下面出现的颜色均可选。
  const hightlightColor = '霓虹色';

  GM_addStyle(`
      :root {
        --彩虹色: linear-gradient(-90deg, #602ce5cc 0, #2ce597cc 20%, #e7bb18cc 40%, #ff7657cc 60%, #45c1eecc 80%, #2ce597cc 100%);

        --夕阳海滩: linear-gradient(-90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
        --薰衣草田: linear-gradient(-90deg, #a18cd1 0%, #fbc2eb 100%);
        --柑橘清新: linear-gradient(-90deg, #f6d365 0%, #fda085 100%);
        --深海幻想: linear-gradient(-90deg, #43e97b 0%, #38f9d7 100%);
        --樱花飞舞: linear-gradient(-90deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        --北极光: linear-gradient(-90deg, #4facfe 0%, #00f2fe 100%);
        --秋叶飘落: linear-gradient(-90deg, #fa709a 0%, #fee140 100%);
        --星空漫步: linear-gradient(-90deg, #30cfd0 0%, #330867 100%);
        --热带雨林: linear-gradient(-90deg, #43e97b 0%, #38f9d7 100%);
        --火焰燃烧: linear-gradient(-90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);

        --日落色: linear-gradient(-90deg, #ff5e62cc 0%, #ff9966cc 50%, #ffcc66cc 100%);
        --海洋色: linear-gradient(-90deg, #00c9ffcc 0%, #92fe9dcc 100%);
        --星空色: linear-gradient(-90deg, #1e3c72cc 0%, #2a5298cc 100%);
        --森林色: linear-gradient(-90deg, #005a3ccc 0%, #35c24ecc 100%);
        --糖果色: linear-gradient(-90deg, #ff6b6bcc 0%, #f8b195cc 50%, #f67280cc 100%);
        --黎明色: linear-gradient(-90deg, #f953c6cc 0%, #b91dcc 100%);
        --霓虹色: linear-gradient(-90deg, #12c2eccc 0%, #c471edcc 50%, #f64f59cc 100%);
        --地平线色: linear-gradient(-90deg, #f7971ecc 0%, #ffd200cc 100%);
        --午夜蓝: linear-gradient(-90deg, #000428cc 0%, #004e92cc 100%);
        --火焰色: linear-gradient(-90deg, #fc466bcc 0%, #3f5efbcc 100%);
      }
  `);

  if (document.getElementById('searchbox') == null) {
    return;
  }
 
  let dataHash;
  const gids = new Set();

  const checkUrl = (async function () {
    const { response } = await GM.xmlHttpRequest({ url: 'http://localhost:23786/api/search?length=1000000' });
    const result = JSON.parse(response);
    if (result.hash === dataHash) {
      gids.forEach(gid => {
          const posted = document.getElementById(`posted_${gid}`);
          if (posted) {
              posted.style.borderColor = '#fff';
              posted.style.backgroundImage = `var(--${hightlightColor})`;
          }
      });
      return;
    } else {
      dataHash = result.hash;
    }
    result.data.forEach(manga => {
      try {
        const path = new URL(manga.url).pathname;
        const gid = path.split('/')[2]
        gids.add(gid);
      } catch (ignored) { }
    });

    gids.forEach(gid => {
      const posted = document.getElementById(`posted_${gid}`);
      if (posted) {
        posted.style.borderColor = '#fff';
        posted.style.backgroundImage = `var(--${hightlightColor})`;
      }
    });
  });

  setInterval(checkUrl, 10000);
  checkUrl();
})();