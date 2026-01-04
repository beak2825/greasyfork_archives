// ==UserScript==
// @name         多站點搜尋面板
// @namespace
// @version      1.0
// @description  懸浮關鍵字面板：可自訂搜尋站點,自訂關鍵字,同時在多站點搜尋全部關鍵字,部分拍賣網站有排序功能
// @author       kater4343587
// @match        *://*/*
// @exclude      http*://mybidu.ruten.com.*/*
// @exclude      http*://*.bid.yahoo.com/myauc*
// @exclude      http*://*.bid.yahoo.com/partner/*
// @exclude      https://*.bid.yahoo.com/chat/*
// @exclude      http*://seller.shopee.*/*
// @exclude      http*://shopee.*/user/*
// @exclude      http*://*bank.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/681644
// @downloadURL https://update.greasyfork.org/scripts/539875/%E5%A4%9A%E7%AB%99%E9%BB%9E%E6%90%9C%E5%B0%8B%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/539875/%E5%A4%9A%E7%AB%99%E9%BB%9E%E6%90%9C%E5%B0%8B%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 搜尋引擎設定
  const savedEngines = GM_getValue('searchEngines');
  const searchEngines = savedEngines ? JSON.parse(savedEngines) : {
    ruten: 'https://www.ruten.com.tw/find/?q=',
    shopee: 'https://shopee.tw/search?keyword=',
    yahoo: 'https://tw.bid.yahoo.com/search/auction/product?p=',
    jd: 'https://search.jd.com/Search?keyword=',
    taobao: 'https://s.taobao.com/search?q='
  };
  GM_setValue('searchEngines', JSON.stringify(searchEngines));

  // 排序參數設定
  const sortSuffixes = {
    '': { ruten: '', shopee: '', yahoo: '', jd: '', taobao: '' },
    'price_asc': {
      ruten: '&sort=prc%2Fac',
      shopee: '&order=asc&page=0&sort=price_asc&sortBy=price',
      yahoo: '&sort=curp',
      jd: '&psort=2'
    },
    'price_desc': {
      ruten: '&sort=prc%2Fdc',
      shopee: '&order=desc&page=0&sort=price_desc&sortBy=price',
      yahoo: '&sort=-curp',
      jd: '&psort=1'
    },
    'date_new': {
      ruten: '&sort=new%2Fdc',
      shopee: '&sort=recency&sortBy=ctime',
      yahoo: '&sort=-ptime',
      jd: '&psort=5'
    }
  };

  let isCollapsed = true;

  // CSS 樣式
  const panelStyle = `
    #multiSiteSearchPanel {
      position: fixed;
      top: 10px;
      left: 0;
      background: rgba(255, 255, 255, 0.85);
      border: 2px solid #ff9e9e;
      border-radius: 8px;
      padding: 10px;
      z-index: 9999;
      width: 240px;
      font-size: 14px;
      cursor: move;
      transition: opacity 0.3s ease;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    #multiSiteSearchPanel.collapsed {
      width: auto;
      height: auto;
      padding: 5px;
    }
    #sakuraCanvas {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    }
    #multiSiteSearchPanel ul {
      padding: 0;
      list-style: none;
      max-height: 150px;
      overflow-y: auto;
      margin: 8px 0;
    }
    #multiSiteSearchPanel li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      padding: 3px;
      background: rgba(255,255,255,0.7);
      border-radius: 3px;
    }
    .delete-keyword {
      cursor: pointer;
      color: #ff6b6b;
      margin-left: 8px;
    }
    .toggle-collapse {
      position: absolute;
      top: 50%;
      right: -15px;
      transform: translateY(-50%);
      background: rgba(255,158,158,0.7);
      border: none;
      border-radius: 0 5px 5px 0;
      padding: 10px 3px;
      cursor: pointer;
      font-weight: bold;
      color: white;
    }
    .site-checkboxes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 5px;
    }
    .site-checkboxes label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.7);
      padding: 3px 6px;
      border-radius: 3px;
    }
    .site-checkboxes span {
      margin-left: 5px;
    }
    #multiSiteSearchPanel input[type="text"],
    #multiSiteSearchPanel select,
    #multiSiteSearchPanel button {
      width: 100%;
      margin: 5px 0;
      padding: 5px;
      border: 1px solid #ffbdbd;
      border-radius: 3px;
    }
    #multiSiteSearchPanel button {
      background: #ff9e9e;
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    #multiSiteSearchPanel button:hover {
      background: #ff7b7b;
    }
    #multiSiteSearchPanel hr {
      border: none;
      border-top: 1px solid #ffd3d3;
      margin: 8px 0;
    }
  `;

  // 背景動畫飄落效果
  function createSakuraBackground(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'sakuraCanvas';
    container.appendChild(canvas);

    function resizeCanvas() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    const sakuraArray = [];

    class Sakura {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * -1;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 1 + 0;
        this.angle = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.01 - 0.005;
        this.color = `rgba(255, ${Math.floor(Math.random() * 50 + 75)}, ${Math.floor(Math.random() * 50 + 75)}, ${Math.random() * 0.3 + 0.4})`;
        this.swing = Math.random() * 2 - 1;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        this.swingOffset = 0;
      }

      update() {
        this.y += this.speed;
        this.angle += this.rotationSpeed;
        this.swingOffset = Math.sin(this.swing) * 2;
        this.swing += this.swingSpeed;

        if (this.y > canvas.height) {
          this.y = Math.random() * 20 - 20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + this.swingOffset, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 繪製圖形
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(0, this.size * 0.3);
          ctx.lineTo(this.size * 0.2, this.size * 0.2);
          ctx.rotate((Math.PI * 2) / 5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 創建花瓣
    for (let i = 0; i < 25; i++) {
      sakuraArray.push(new Sakura());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sakuraArray.forEach(sakura => {
        sakura.update();
        sakura.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // 注入CSS樣式
  function injectStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 拖曳功能
  function enableDrag(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = function (e) {
      if (['SELECT', 'INPUT', 'BUTTON'].includes(e.target.tagName)) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };
    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // 創建主面板
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'multiSiteSearchPanel';

    if (isCollapsed) {
      panel.classList.add('collapsed');
      panel.innerHTML = `<div class="toggle-collapse" id="collapseBtn">&gt;&gt;</div>`;
      document.body.appendChild(panel);
      document.getElementById('collapseBtn').onclick = () => {
        isCollapsed = false;
        panel.remove();
        createPanel();
      };
      enableDrag(panel);
      return;
    }

    panel.innerHTML = `
      <div class="toggle-collapse" id="collapseBtn">&lt;&lt;</div>
      <ul id="keywordList"></ul>
      <input type="text" id="keywordInput" placeholder="新增關鍵字" />
      <button id="addKeyword">新增關鍵字</button>
      <button id="searchAll">搜尋全部</button>
      <hr>
      <div class="site-checkboxes" id="siteCheckboxes"></div>
      <label for="sortSelect">排序：(只適用露天,Y拍,蝦皮,京東)</label>
      <select id="sortSelect">
        <option value="">無排序</option>
        <option value="price_asc">價格 低→高</option>
        <option value="price_desc">價格 高→低</option>
        <option value="date_new">刊登順序 新→舊</option>
      </select>
      <button id="addSiteBtn">新增搜尋站點</button>
      <div id="addSiteSection" style="display:none">
        <input type="text" id="newSiteName" placeholder="網站簡稱">
        <input type="text" id="newSiteUrl" placeholder="搜尋網址，例: https://example.com?q=">
        <button id="confirmAddSite">新增</button>
      </div>
    `;

    document.body.appendChild(panel);
    createSakuraBackground(panel);
    enableDrag(panel);

    document.getElementById('collapseBtn').onclick = () => {
      isCollapsed = true;
      panel.remove();
      createPanel();
    };

    const list = panel.querySelector('#keywordList');
    const input = panel.querySelector('#keywordInput');
    const addButton = panel.querySelector('#addKeyword');
    const searchButton = panel.querySelector('#searchAll');
    const sortSelect = panel.querySelector('#sortSelect');
    const checkboxesContainer = panel.querySelector('#siteCheckboxes');
    const keywords = GM_getValue('keywords', []);

    function saveKeywords() {
      GM_setValue('keywords', keywords);
    }

    function refreshList() {
      list.innerHTML = '';
      keywords.forEach((kw, index) => {
        const li = document.createElement('li');
        const link = document.createElement('span');
        link.textContent = kw;
        link.style = 'color:#ff6b6b;cursor:pointer;text-decoration:underline';
        link.onclick = () => searchKeyword(kw);
        const del = document.createElement('span');
        del.textContent = '✖';
        del.className = 'delete-keyword';
        del.onclick = (e) => {
          e.stopPropagation();
          keywords.splice(index, 1);
          saveKeywords();
          refreshList();
        };
        li.appendChild(link);
        li.appendChild(del);
        list.appendChild(li);
      });
    }

    function renderCheckboxes() {
      checkboxesContainer.innerHTML = '';
      const checkedSites = GM_getValue('checkedSites', {});
      for (const key in searchEngines) {
        const label = document.createElement('label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.site = key;
        checkbox.checked = checkedSites[key] !== false;
        checkbox.onchange = () => {
          checkedSites[key] = checkbox.checked;
          GM_setValue('checkedSites', checkedSites);
        };

        const nameSpan = document.createElement('span');
        nameSpan.textContent = key;

        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '❌';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.color = '#ff6b6b';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`確定要刪除站點 "${key}" 嗎？`)) {
            delete searchEngines[key];
            delete checkedSites[key];
            for (const sortKey in sortSuffixes) {
              if (sortSuffixes[sortKey]) delete sortSuffixes[sortKey][key];
            }
            GM_setValue('searchEngines', JSON.stringify(searchEngines));
            GM_setValue('checkedSites', checkedSites);
            GM_setValue('sortSuffixes', JSON.stringify(sortSuffixes));
            renderCheckboxes();
          }
        };

        label.appendChild(checkbox);
        label.appendChild(nameSpan);
        label.appendChild(deleteBtn);
        checkboxesContainer.appendChild(label);
      }
    }

    function searchKeyword(kw) {
      const sort = sortSelect.value;
      const suffix = sortSuffixes[sort] || {};
      const checkedSites = GM_getValue('checkedSites', {});
      checkboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        const site = chk.dataset.site;
        if (chk.checked) {
          let url = searchEngines[site] + encodeURIComponent(kw);
          if (suffix[site]) url += suffix[site];
          window.open(url, '_blank');
        }
      });
    }

    addButton.onclick = () => {
      const value = input.value.trim();
      if (value && !keywords.includes(value)) {
        keywords.push(value);
        saveKeywords();
        refreshList();
        input.value = '';
      }
    };

    searchButton.onclick = () => {
      keywords.forEach(kw => searchKeyword(kw));
    };

    panel.querySelector('#addSiteBtn').onclick = () => {
      const section = panel.querySelector('#addSiteSection');
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    };

    panel.querySelector('#confirmAddSite').onclick = () => {
      const name = panel.querySelector('#newSiteName').value.trim();
      const url = panel.querySelector('#newSiteUrl').value.trim();

      if (!name || !url || !url.includes('https://')) {
        alert('請輸入有效的網站簡稱與搜尋網址。範例: https://example.com?q=');
        return;
      }

      searchEngines[name] = url;
      GM_setValue('searchEngines', JSON.stringify(searchEngines));
      renderCheckboxes();

      panel.querySelector('#newSiteName').value = '';
      panel.querySelector('#newSiteUrl').value = '';
      panel.querySelector('#addSiteSection').style.display = 'none';
    };

    refreshList();
    renderCheckboxes();
  }

  injectStyle(panelStyle);
  createPanel();
})();