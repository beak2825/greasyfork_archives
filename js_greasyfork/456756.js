// ==UserScript==
// @name         豆瓣电影种子搜索 douban_movie_torrent_search
// @namespace    https://github.com/ned42
// @version      0.3
// @description  search torrents from multi sites and render back to the movie page
// @author       ned42
// @match        https://movie.douban.com/subject/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      bt4gprx.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456756/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%A7%8D%E5%AD%90%E6%90%9C%E7%B4%A2%20douban_movie_torrent_search.user.js
// @updateURL https://update.greasyfork.org/scripts/456756/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%A7%8D%E5%AD%90%E6%90%9C%E7%B4%A2%20douban_movie_torrent_search.meta.js
// ==/UserScript==
(async function () {
  'use strict';
  if (window.location.pathname.split('/')[3] !== '') return; // exclude subpage

  // 全局配置
  const CONFIG = {
    CACHE: {
      PREFIX: 'torrent_search_cache',
      EXPIRY_TIME: 2 * 60 * 60 * 1000, // 2 hours
    },
    UI: {
      ROOT_ID: 'torrent-list',
      TABLE: {
        MAX_VISIBLE_ROWS: 10,
      },
      DOUBAN: {
        INTEREST_SECTION: '#interest_sect_level',
      },
    },
    NETWORK: {
      TIMEOUT: 5000, // 5 seconds
    },
  };

  // 缓存模块
  const cacheModule = {
    CACHE_PREFIX: CONFIG.CACHE.PREFIX,
    CACHE_KEY: `${CONFIG.CACHE.PREFIX}-${window.location.pathname.split('/')[2]}`, // pageid
    _getCacheStore: function () {
      const cacheString = localStorage.getItem(this.CACHE_KEY);
      if (cacheString) {
        try {
          return JSON.parse(cacheString);
        } catch (e) {
          console.error(`Error parsing cache for '${this.CACHE_KEY}':`, e);
        }
      }
      this._saveCacheStore({});
      return {};
    },
    _saveCacheStore: function (cacheStore) {
      try {
        cacheStore.expiryTimeStamp = new Date().getTime() + CONFIG.CACHE.EXPIRY_TIME;
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheStore));
      } catch (e) {
        console.error(`Error saving cache for '${this.CACHE_KEY}':`, e);
      }
    },
    cleanAllCache: function (force = false) {
      const isExpired = (timeStamp) => {
        new Date().getTime() > timeStamp;
      };
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(cacheModule.CACHE_PREFIX)) {
          let cacheStore;
          try {
            cacheStore = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.error(`Error parsing cache for '${key}':`, e);
            localStorage.removeItem(key);
            continue;
          }
          if (force || isExpired(cacheStore.expiryTimeStamp)) {
            localStorage.removeItem(key);
          }
        }
      }
    },
    setCache: function (title, data) {
      const cacheStore = this._getCacheStore();
      cacheStore[title] = data;
      this._saveCacheStore(cacheStore);
    },
    getCache: function (title) {
      const cacheStore = this._getCacheStore();
      if (Object.prototype.hasOwnProperty.call(cacheStore, title)) {
        return cacheStore[title];
      }
      return null;
    },
  };
  // 通用模块
  const utils = {
    /**
     * this certain function is basically where the whole original script idea came from
     * now is only used for linking imdb to douban.com
     * and in memory of RARBG.com, a torrent site which supports imdb for searching
     */
    getIMDbId: function () {
      const IMDb_tag = Array.from(document.querySelectorAll('span.pl')).filter(
        (node) => node.textContent === 'IMDb:'
      )[0];
      let imdbId = IMDb_tag ? IMDb_tag.nextSibling.data.trim() : '';
      if (/(tt[0-9]*)/.test(imdbId)) {
        const imdbLink = `https://www.imdb.com/title/${imdbId}`;
        const imdbSpan = document.createElement('span');
        imdbSpan.innerHTML = `${IMDb_tag.outerHTML} <span><a target="_blank" href="${imdbLink}">${imdbId}</a></span>`;
        IMDb_tag.nextSibling.remove();
        IMDb_tag.replaceWith(imdbSpan);
        return imdbId;
      }
    },
    // 获取电影主标题、副标题和年份，返回对象
    getTitleInfo: function () {
      const title_text = document.querySelector('h1').innerText.trim();
      const en_regex = /(\s[A-Za-z0-9\s'.:,&-]*)(?=\s\(\d{4}\))/;
      const year_regex = /\s\((\d{4})\)/;
      const yearMatch = title_text.match(year_regex);
      const titleYear = yearMatch ? yearMatch[1] : '';
      // 主标题处理逻辑 - 优先使用英文作为主标题 "zh en (year)"
      let mainTitle = title_text.substring(0, title_text.search(' '));
      let en_match = title_text.match(en_regex);
      if (en_match) {
        en_match = en_match[1].replace(/Season \d/, '').trim();
        if (en_match.length) {
          mainTitle = en_match; // 如果有英文标题，使用英文作为主标题
        }
      }
      // 副标题仅从ExtraTitle_tag获取，仅包含英文标题
      const ExtraTitle_tag = Array.from(document.querySelectorAll('span.pl')).filter(
        (node) => node.textContent === '又名:'
      );
      let extraTitles = [];
      let aliasArr = ExtraTitle_tag[0] ? ExtraTitle_tag[0].nextSibling.data.split('/') : null;
      if (aliasArr) {
        const alias_regex = /^[A-Za-z0-9\s'.:,&-]+$/;
        extraTitles = extraTitles.concat(
          aliasArr.map((t) => t.trim().replace(/\u200e/g, '')).filter((a) => alias_regex.test(a))
        );
      }
      const uniqueTitles = [...new Set([mainTitle, ...extraTitles])];
      // 返回所有可用标题和年份
      return { allTitles: uniqueTitles, yearForSearch: titleYear };
    },
    // 封装GM.xmlHttpRequest用于异步获取URL内容，处理超时和错误
    gmFetch: async function (url) {
      return new Promise((resolve, reject) => {
        console.log('正在获取:', url);
        let settled = false;

        GM.xmlHttpRequest({
          method: 'GET',
          timeout: CONFIG.NETWORK.TIMEOUT,
          url: url,
          onload: (response) => {
            if (settled) return;
            settled = true;
            // no check cos bt4g returns 404 for no result
            if (response.status) {
              try {
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                resolve(doc);
              } catch (parseError) {
                console.error('解析HTML失败:', parseError, 'URL:', url);
                reject(new Error(`解析HTML失败: ${parseError.message}`));
              }
            } else {
              console.error('HTTP请求失败:', response.status, response.statusText, 'URL:', url);
              reject(new Error(`HTTP请求失败: ${response.status} ${response.statusText}`));
            }
          },
          onerror: (error) => {
            if (settled) return;
            settled = true;
            console.error('GM.xmlHttpRequest 错误:', error, 'URL:', url);
            reject(new Error(`GM.xmlHttpRequest 错误: ${error.statusText || '未知错误'}`));
          },
          ontimeout: () => {
            if (settled) return;
            settled = true;
            console.warn('GM.xmlHttpRequest 请求超时:', url);
            resolve(new Error(`GM.xmlHttpRequest 请求超时: ${url}`));
          },
        });
      });
    },
    // 从指定站点配置和标题获取种子数据，处理各种错误情况并返回结果或错误对象数组
    _fetchSiteData: async function (siteConfig, searchKey) {
      const fullUrl = siteConfig.host + siteConfig.url(searchKey);
      try {
        const response = await this.gmFetch(fullUrl);
        if (response instanceof Error) {
          return [
            {
              name: `[网络错误] ${siteConfig.host} - ${searchKey} (点击查看详情)`,
              link: fullUrl,
              isError: true,
              errorType: 'gmFetchResolvedError',
            },
          ];
        }

        const table = response.querySelector(siteConfig.torrent_list); // 获取种子列表的DOM元素
        const info = []; // 存储解析出的种子信息
        if (table) {
          let rows = Array.from(table.children);
          if (siteConfig.torrent_list.includes('table')) rows = rows.slice(1); // 跳过表头
          rows.forEach((row) => {
            const rowData = {
              name: row.querySelector(siteConfig.info.name)?.textContent.trim(),
              link: siteConfig.host + row.querySelector(siteConfig.info.link)?.getAttribute('href'),
              size: row.querySelector(siteConfig.info.size)?.textContent.trim(),
              seeder: row.querySelector(siteConfig.info.upload)?.textContent.trim(),
              leecher: row.querySelector(siteConfig.info.download)?.textContent.trim(),
              isError: false,
            };
            if (rowData.size && rowData.name) info.push(rowData); // 确保关键信息存在
          });
        } else {
          console.info(`站点 ${siteConfig.host} 未找到种子列表  标题: ${searchKey}, URL: ${fullUrl}`);
          throw new Error(`未找到种子`);
        }

        return info;
      } catch (error) {
        // 捕获 gmFetch reject 的错误 (如HTTP错误、HTML解析错误)
        return [
          {
            name: `[获取异常] ${siteConfig.host} - ${searchKey}: ${error.message}`,
            link: fullUrl,
            isError: true,
            errorType: 'fetchException',
          },
        ];
      }
    },
    // 准备列表用的标题数据，获取缓存或发起新检索
    _prepareTitleData: async function (title) {
      render.renderMessage(`正在搜索 ${title} 的种子...`);

      let validResults = cacheModule.getCache(title);
      if (validResults) {
        return render._renderArrayResults(title); // 直接渲染缓存结果
      } else {
        if (appState.titlePending[title] == true) return; // 防止重复请求
        validResults = []; // init on new title
        appState.titlePending[title] = true;
        // 遍历所有站点配置
        const sitePromises = SEARCH_SITES_CONFIGS.map(async (site) => {
          const siteResults = await utils._fetchSiteData(site, title + ' ' + appState.titleYear);
          validResults = validResults.concat(siteResults.slice(0, 10)); // 合并各站前10个结果
          cacheModule.setCache(title, validResults);
          render._renderArrayResults(title); // 每个站点返回后都渲染
        });
        await Promise.all(sitePromises);
        appState.titlePending[title] = false;
        validResults = validResults.filter((a) => !a.isError);
        cacheModule.setCache(title, validResults);
      }
    },
  };
  // 页面渲染模块
  const render = {
    uiElements: {
      rootContainer: null, // <div id="torrent-list"></div>
      menuContainer: null, // #torrent-list > h2
      tableContainer: null, // <div class="res_table_wrap"></div>
    },
    // 初始化界面菜单
    initializeContainer: function () {
      const existingList = document.querySelector(`#${CONFIG.UI.ROOT_ID}`);
      if (existingList) existingList.remove();

      // 创建根容器
      this.uiElements.rootContainer = document.createElement('div');
      this.uiElements.rootContainer.id = CONFIG.UI.ROOT_ID;

      // 创建菜单容器
      this.uiElements.menuContainer = document.createElement('h2');
      let titleSwitchHtml = '';
      if (appState.allTitles.length > 1) {
        titleSwitchHtml = `<span class="pl"> （ `;
        appState.allTitles.forEach((title, i) => {
          const isActive = title === appState.currentTitle ? ' active' : '';
          const separator = i > 0 ? ' / ' : '';
          titleSwitchHtml += `${separator}<a href="#" data-title-name="${title}" class="title-switch${isActive}">${title}</a>`;
        });
        titleSwitchHtml += ' ) </span>';
      }
      this.uiElements.menuContainer.innerHTML = `<i>可用资源</i> · · · · · ·${titleSwitchHtml}`;
      this._bindTitleSwitchEvents(); // 绑定标题切换事件

      // 创建表格容器
      this.uiElements.tableContainer = document.createElement('div');
      this.uiElements.tableContainer.className = 'res_table_wrap';
      this._bindTableMaskEvents(); // 绑定表格mask监听

      // 组装容器，插入页面
      this.uiElements.rootContainer.appendChild(this.uiElements.menuContainer);
      this.uiElements.rootContainer.appendChild(this.uiElements.tableContainer);
      document
        .querySelector(CONFIG.UI.DOUBAN.INTEREST_SECTION)
        .insertAdjacentElement('beforebegin', this.uiElements.rootContainer);

      utils._prepareTitleData(appState.currentTitle); // 初始化后查询第一个标题的数据
    },
    // 渲染消息
    renderMessage: function (message, isLoading = true) {
      const anchorId = isLoading ? 'loading' : '';
      const messageTypeClass = isLoading ? 'loading-message' : 'final-message';
      const anchorClass = `lnk-sharing ${messageTypeClass}`;
      this.uiElements.tableContainer.innerHTML = `<a class="${anchorClass}" ${anchorId ? `id="${anchorId}"` : ''}>${message}</a>`;
      if (!isLoading) {
        const finalmessageElement = this.uiElements.tableContainer.querySelector(
          `.${messageTypeClass.replace(' ', '.')}`
        );
        // 点击后重置缓存
        finalmessageElement.onclick = () => {
          cacheModule.setCache(appState.currentTitle, null);
          utils._prepareTitleData(appState.currentTitle);
        };
      }
    },
    // 渲染结果列表
    _renderArrayResults: function (title) {
      if (title != appState.currentTitle) return;
      this.uiElements.tableContainer.replaceChildren();
      // 错误结果后置
      const resList = cacheModule.getCache(title);
      const errorResults = resList.filter((node) => node.isError);
      const validResults = resList.filter((node) => !node.isError);
      const sortedResList = validResults.concat(errorResults);

      // 构建表格内容行，处理特殊字符
      const formatNumberWithK = (numb) => (Number(numb) >= 1000 ? (numb / 1000).toFixed(1) + 'k' : numb);
      const nodeNameFormatter = (str) => (str ? str.replace('【', '[').replace('】', ']').normalize('NFKC') : '');
      const allRowsArr = sortedResList.map((node) => {
        if (node.isError) {
          return `<td>⚠️</td><td><a class="error-item" href="${node.link}" target="_blank">${node.name}</a></td><td></td>`;
        } else {
          node.seeder = formatNumberWithK(node.seeder);
          node.leecher = formatNumberWithK(node.leecher);
          node.name = nodeNameFormatter(node.name);
          return `<td>${node.seeder || '0'}-${node.leecher || '0'}</td><td><a target="_blank" href="${node.link}" title="${node.name}">${node.name}</a></td><td>${node.size}</td>`;
        }
      });
      // 表格遮罩处理，默认只显示前10条
      const showCount = CONFIG.UI.TABLE.MAX_VISIBLE_ROWS;
      const totalRows = allRowsArr.length;

      if (totalRows > 0) {
        let tableHtml = '<table class="res_table">';
        allRowsArr.forEach((rowData, index) => {
          const isHidden = index >= showCount ? ' hidden-row' : '';
          tableHtml += `<tr class="table-row${isHidden}">${rowData}</tr>`;
        });
        tableHtml += '</table>';

        let maskHtml = '';
        if (totalRows > showCount) {
          tableHtml = tableHtml.replace('class="res_table"', 'class="res_table res_table-collapsed"');
          maskHtml = '<div class="res_table_mask"></div>';
        }
        this.uiElements.tableContainer.innerHTML = `${tableHtml}${maskHtml}`;
      } else {
        if (!appState.titlePending[title]) {
          this.renderMessage('无有效结果或错误信息可供显示', false);
        }
      }
    },
    // 菜单标题切换事件监听
    _bindTitleSwitchEvents: function () {
      this.uiElements.menuContainer.addEventListener('click', (e) => {
        const titleSwitchElement = e.target.closest('.title-switch');
        if (!titleSwitchElement) return;

        e.preventDefault();
        const titleName = titleSwitchElement.dataset.titleName;

        if (titleName === appState.currentTitle) return;

        // 更新 UI 状态
        this.uiElements.menuContainer
          .querySelectorAll('.title-switch')
          .forEach((link) => link.classList.remove('active'));
        titleSwitchElement.classList.add('active');

        // 更新当前标题及内容
        appState.setCurrentTitle(titleName);
        utils._prepareTitleData(titleName);
      });
    },
    // 表格mask事件监听
    _bindTableMaskEvents: function () {
      this.uiElements.tableContainer.addEventListener(
        'mouseenter',
        function (e) {
          const mask = e.target.closest('.res_table_mask');
          if (!mask) return;

          const table = mask.parentNode.childNodes[0];
          const hiddenRows = table.querySelectorAll('.hidden-row');
          hiddenRows.forEach((row) => (row.style.display = 'table-row'));
          table.classList.replace('res_table-collapsed', 'res_table-expanded');
          mask.style.opacity = '0';
          mask.style.pointerEvents = 'none';
        },
        true
      );
      this.uiElements.tableContainer.addEventListener(
        'mouseleave',
        function (e) {
          const wrap = e.target.closest('.res_table_wrap');
          if (!wrap) return;

          if (e.relatedTarget && wrap.contains(e.relatedTarget)) {
            return; // 鼠标仍在table内，不执行收起
          }

          const table = wrap.querySelector('.res_table');
          const mask = wrap.querySelector('.res_table_mask');
          if (table && mask && table.classList.contains('res_table-expanded')) {
            const hiddenRows = table.querySelectorAll('.hidden-row');
            hiddenRows.forEach((row) => (row.style.display = 'none'));
            table.classList.replace('res_table-expanded', 'res_table-collapsed');
            mask.style.opacity = '1';
            mask.style.pointerEvents = 'auto';
          }
        },
        true
      );
    },
  };
  // 检索站点配置
  const SEARCH_SITES_CONFIGS = [
    {
      host: 'https://byr.pt/',
      url: (title) =>
        `torrents.php?search=${encodeURIComponent(title)}&cat408=1&cat401=1&incldead=0&spstate=0&inclbookmarked=0&search_area=0&search_mode=0&sort=7&type=desc`,
      torrent_list: 'table.torrents tbody',
      info: {
        name: 'td.rowfollow > table.torrentname a[title]',
        link: 'td.rowfollow > table.torrentname a[title]',
        size: 'td:nth-child(6)',
        upload: 'td:nth-child(7)',
        download: 'td:nth-child(8)',
      },
    },
    {
      host: 'https://pt.btschool.club/',
      url: (title) =>
        `torrents.php?incldead=1&spstate=0&inclbookmarked=0&search=${encodeURIComponent(title)}&search_area=0&search_mode=0&sort=7&type=desc`,
      torrent_list: 'table.torrents tbody',
      info: {
        name: 'td.rowfollow > table.torrentname a[title]',
        link: 'td.rowfollow > table.torrentname a[title]',
        size: 'td:nth-child(5)',
        upload: 'td:nth-child(6) a',
        download: 'td:nth-child(7)',
      },
    },
    {
      host: 'https://bt4gprx.com',
      url: (title) => `/search?q=${encodeURIComponent(title)}&orderby=seeders&p=1`,
      torrent_list: '.list-group', // css tags how the original site display torrent
      info: {
        name: 'a[title]',
        link: 'a[title]',
        size: 'b.cpill',
        upload: '#seeders',
        download: '#leechers',
      },
    },
  ];
  // 页面式样
  GM_addStyle(`
    #torrent-list {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }
    #torrent-list h2 {
      margin: 12px 0 12px 0;
    }
    .title-switch.active {
      color: #111;
      background: none;
      cursor: auto;
    }
    .res_table_wrap {
      position: relative;
      width: 95%;
    }
    .res_table {
      width: 100%;
      table-layout: fixed;
    }
    .res_table tr.table-row.hidden-row {
      display: none;
    }
    .res_table td {
      padding: 3px 2px;
      text-align: left;
    }
    .res_table td:first-child,
    .res_table td:last-child {
      width: 65px;
      white-space: nowrap;
      text-align: center;
      color: #666666;
    }
    .res_table td:last-child {
      text-align: right;
    }
    .res_table td:nth-child(2) {
      /* 自动宽度 */
    }
    .res_table td a {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .res_table td a.error-item {
      color: #888888;
      text-decoration: underline;
    }
    .res_table_mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 20%;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.85) 100%
      );
      pointer-events: auto;
      opacity: 1;
      transition: opacity 0.3s;
    }
    .res_table_wrap > a.lnk-sharing {
      display: block;
      padding: 5px;
      text-align: center;
      color: #888888;
      cursor: pointer;
    }
    @keyframes hourglass {
      0% {
        transform: rotate(0deg);
      }
      40% {
        transform: rotate(180deg);
      }
      50% {
        transform: rotate(180deg);
      }
      90% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .res_table_wrap > a#loading::after {
      /* 加载状态图标 */
      content: " ⏳";
      display: inline-block;
      margin-left: 5px;
      animation: hourglass 2s ease-in-out infinite;
    }
    .res_table_wrap > a.final-message::after {
      /* 最终消息状态图标 */
      content: " 😢";
      display: inline-block;
      margin-left: 5px;
    }
  `);

  // 主逻辑
  const appState = {
    currentTitle: null,
    titleYear: null,
    allTitles: [],
    titlePending: {},

    init() {
      const { allTitles, yearForSearch } = utils.getTitleInfo();
      this.allTitles = allTitles;
      this.titleYear = yearForSearch;
      this.currentTitle = this.allTitles[0];
      this.allTitles.forEach((title) => {
        this.titlePending[title] = false;
      });
      utils.getIMDbId(); // eggs
    },
    setCurrentTitle(title) {
      this.currentTitle = title;
    },
  };

  appState.init();

  cacheModule.cleanAllCache(); // 清理所有过期缓存
  render.initializeContainer(); // 初始化菜单

  // 注册GM菜单，提供手动清除缓存功能
  GM_registerMenuCommand(
    '清理种子缓存',
    function () {
      cacheModule.cleanAllCache(true);
      render.renderMessage('缓存已清理，点击进行重试', false);
    },
    'c'
  );
})();
