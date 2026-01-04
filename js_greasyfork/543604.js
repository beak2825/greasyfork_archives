// ==UserScript==
// @name         Vjudge Better!
// @namespace    https://github.com/1000ttank/vjudge-better
// @version      1.2.2
// @description  一个让vjudge更美观更便捷的脚本
// @author       1000ttank
// @match        https://vjudge.net/*
// @icon         https://vjudge.net/favicon.ico
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543604/Vjudge%20Better%21.user.js
// @updateURL https://update.greasyfork.org/scripts/543604/Vjudge%20Better%21.meta.js
// ==/UserScript==

(function () {
    const PAGE_TYPES = [
        /\/problem$/, /\/problem\/[^\/]+$/, /\/problem\/[^\/]+\/origin$/, /\/problem\/description\/[^\/]+$/,
        /\/status$/, /\/solution\/[^\/]+\/origin$/, /\/solution\/[^\/]+\/[^\/]+$/,
        /\/contest$/, /\/contest\/[^\/]+$/, /\/contest\/statistic$/,
        /\/workbook$/, /\/article\/create$/, /\/article\/[^\/]+$/,
        /\/user$/, /\/user\/[^\/]+$/,
        /\/group$/, /\/group\/[^\/]+$/,
        /\/comment$/, /\/message$/
    ];

    function detectPageType(path) {
        const cleanPath = path.replace(/\/$/, "");
        return PAGE_TYPES.findIndex(re => re.test(cleanPath));
    }

    const pageId = detectPageType(location.pathname);

    if (pageId === -1 && location.pathname !== "/") {
        console.warn("Unknown VJudge page – possibly 404.");
    }

    const pagesNeedingBg = new Set([0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    const frostedBackground = `body {
        background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed !important;
        background-size: cover !important;
    }`;

    if (pagesNeedingBg.has(pageId) || pageId === -1) {
        GM_addStyle(frostedBackground);
        $("body").prepend("<nav style='height: 60px'></nav>");
    }

    if (pageId === 3) {
        GM_addStyle("dd {background-color: rgba(255,255,255,0.7) !important; border-radius: 4px !important;}");
    }

    // Global UI Theme
    GM_addStyle(`
        .navbar {
        background-color: rgba(255, 255, 255, 0.75) !important;
        backdrop-filter: blur(10px);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .navbar a,
    .navbar .nav-link,
    .navbar-brand {
        color: #000 !important;
        font-weight: 500;
    }
    .navbar a:hover,
    .navbar .nav-link:hover {
        background-color: rgba(255, 255, 255, 1.0);
        color: #000 !important;
    }
    .navbar .nav-item.active > .nav-link {
        font-weight: bold !important;
    }
    ::-webkit-scrollbar {
        display: none;
    }
    #prob-ads, #img-support {
        display: none !important;
    }
    .card,
    .list-group-item,
    .btn-secondary,
    .page-link,
    .dropdown-menu,
    .modal-content,
    .form-control,
    .tab-content {
        background-color: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(6px);
        border-radius: 0.5rem;
    }
    .card:hover,
    .dropdown-menu:hover {
        background-color: rgba(255, 255, 255, 0.85) !important;
    }
    .form-control {
        border: 1px solid #ccc;
    }
    .body-footer {
        color: #333;
        background: rgba(255, 255, 255, 0.85);
        padding: 1em;
        border-top: 1px solid #ddd;
    }
    .list-group-item.active,
    .page-item.active .page-link,
    .navbar .nav-link.active,
    .btn.active,
    .dropdown-item.active,
    .tag.active {
        background-color: #007bff !important;
        color: #fff !important;
    }
    @media (max-width: 768px) {
        .navbar {
            font-size: 14px;
        }
    }

    /* 新增内容区域高度设置 */
    main, .container, .content, .body-content, .container-fluid {
        min-height: 100vh !important;
    }
    `);

    // Footer credit
    $("body > div.body-footer").append(
        '<p style="text-align:center">Theme enhanced by <a href="https://github.com/1000ttank/vjudge-better" target="_blank">vjudge-better</a></p>'
    );
})();

(function () {
  'use strict';

  const defaultSettings = {
    lang: 'zh',
    bgColor: '#f0f8ff',
    bgImg: '',
    foldBlock: false,
    prettyDropdown: false,
  };

  function getSetting(key) {
    return GM_getValue(key, defaultSettings[key]);
  }

  function setSetting(key, value) {
    GM_setValue(key, value);
  }

  window.addEventListener('load', function () {
    const logoutBtn = document.querySelector('#header .logout');
    if (!logoutBtn || document.querySelector('#vjudge-better-btn')) return;

    const settingBtn = document.createElement('button');
    settingBtn.id = 'vjudge-better-btn';
    settingBtn.textContent = 'Vjudge Better! 设置';
    settingBtn.style.cssText = `
      background-color: #003366;
      color: white;
      margin-left: 12px;
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;
    logoutBtn.parentNode.insertBefore(settingBtn, logoutBtn.nextSibling);

    settingBtn.addEventListener('click', () => {
      showSettingsPanel();
    });

    applyCustomBackground();
  });

  function applyCustomBackground() {
    const color = getSetting('bgColor');
    const imgUrl = getSetting('bgImg') || '';
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = imgUrl ? `url(${imgUrl})` : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center top';
  }

  function showSettingsPanel() {
    const mask = document.createElement('div');
    mask.id = 'vjudge-better-mask';
    mask.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      z-index: 9998;
    `;
    mask.addEventListener('click', closeSettingsPanel);

    const panel = document.createElement('div');
    panel.id = 'vjudge-better-panel';
    panel.style.cssText = `
      width: 650px;
      height: 800px;
      background: #f9fbff;
      border-radius: 12px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      display: flex;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      font-family: sans-serif;
    `;
    panel.addEventListener('click', e => e.stopPropagation());

    const closeBtn = document.createElement('div');
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 14px;
      height: 14px;
      background: #e74c3c;
      border-radius: 50%;
      cursor: pointer;
    `;
    closeBtn.title = '关闭';
    closeBtn.addEventListener('click', closeSettingsPanel);

    const menu = document.createElement('div');
    menu.style.cssText = `
      width: 120px;
      background: #e6f0ff;
      border-right: 1px solid #ccc;
      padding-top: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    `;
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    `;

    const sections = ['基本', '个性化', '翻译', '关于'];
    const menuButtons = [];

    sections.forEach((label, idx) => {
      const btn = document.createElement('div');
      btn.textContent = label;
      btn.style.cssText = `
        padding: 10px 16px;
        cursor: pointer;
        color: #003366;
        transition: background 0.2s;
      `;
      btn.addEventListener('click', () => {
        menuButtons.forEach(b => b.style.background = '');
        btn.style.background = '#d6eaff';
        renderSection(label);
      });
      if (idx === 0) {
        btn.style.background = '#d6eaff';
        renderSection(label);
      }
      menu.appendChild(btn);
      menuButtons.push(btn);
    });

    function renderSection(section) {
      contentArea.innerHTML = '';

      if (section === '基本') {
        contentArea.innerHTML = `
          <h2>基本设置</h2>
          <label>脚本语言：</label>
          <select id="langSelect">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        `;
        contentArea.querySelector('#langSelect').value = getSetting('lang');
        contentArea.querySelector('#langSelect').addEventListener('change', e => {
          setSetting('lang', e.target.value);
          alert('语言设置已保存');
        });
      } else if (section === '个性化') {
        contentArea.innerHTML = `
          <h2>个性化设置</h2>
          <label>背景颜色：</label>
          <input type="color" id="bgColorPicker"><br><br>
          <label>背景图片链接：</label>
          <input type="text" id="bgImgUrl" placeholder="可为空，不填则无背景图" style="width: 100%;"><br><br>
          <label><input type="checkbox" id="foldBlock"> 启用折叠块优化</label><br>
          <label><input type="checkbox" id="prettyDropdown"> 渲染下拉框美化</label>
        `;
        const bgPicker = contentArea.querySelector('#bgColorPicker');
        bgPicker.value = getSetting('bgColor');
        bgPicker.addEventListener('input', e => {
          setSetting('bgColor', e.target.value);
          applyCustomBackground();
        });

        const bgImg = contentArea.querySelector('#bgImgUrl');
        bgImg.value = getSetting('bgImg') || '';
        bgImg.addEventListener('change', e => {
          setSetting('bgImg', e.target.value.trim());
          applyCustomBackground();
        });

        contentArea.querySelector('#foldBlock').checked = getSetting('foldBlock');
        contentArea.querySelector('#foldBlock').addEventListener('change', e => {
          setSetting('foldBlock', e.target.checked);
        });

        contentArea.querySelector('#prettyDropdown').checked = getSetting('prettyDropdown');
        contentArea.querySelector('#prettyDropdown').addEventListener('change', e => {
          setSetting('prettyDropdown', e.target.checked);
        });
      } else if (section === '翻译') {
        contentArea.innerHTML = `
          <h2>翻译设置</h2>
          <label>翻译引擎：</label>
          <select id="engineSelect">
            <option value="deepl">DeepL（免费试用）</option>
            <option value="youdao">有道翻译</option>
          </select><br><br>
          <label>目标语言：</label>
          <select id="targetLang">
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="ja">日文</option>
          </select>
        `;
      } else if (section === '关于') {
        contentArea.innerHTML = `
          <h2>关于</h2>
          <p>这是一个用于增强 VJudge 页面体验的油猴脚本。</p>
          <ul>
            <li>支持自定义样式</li>
            <li>优化界面布局</li>
            <li>新增翻译与渲染增强功能</li>
          </ul>
        `;
      }
    }

    function closeSettingsPanel() {
      document.getElementById('vjudge-better-panel')?.remove();
      document.getElementById('vjudge-better-mask')?.remove();
    }

    panel.appendChild(closeBtn);
    panel.appendChild(menu);
    panel.appendChild(contentArea);
    document.body.appendChild(mask);
    document.body.appendChild(panel);
  }
})();