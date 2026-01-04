// ==UserScript==
// @name         Bangumi 组件分类 (API版)
// @namespace    https://bgm.tv/
// @version      1.0.7
// @description  在 /settings/gadgets 页面提供分页、筛选、标签、搜索、AI摘要切换。
// @author       wataame
// @match        https://bgm.tv/settings/gadgets*
// @match        http://bgm.tv/settings/gadgets*
// @match        https://bangumi.tv/settings/gadgets*
// @match        http://bangumi.tv/settings/gadgets*
// @match        http://chii.in/settings/gadgets*
// @match        https://chii.in/settings/gadgets*
// @connect      gadgets.ry.mk
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544752/Bangumi%20%E7%BB%84%E4%BB%B6%E5%88%86%E7%B1%BB%20%28API%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544752/Bangumi%20%E7%BB%84%E4%BB%B6%E5%88%86%E7%B1%BB%20%28API%E7%89%88%29.meta.js
// ==/UserScript==

(() => {
  'use strict';
  /* ---------- 样式 (已更新) ---------- */
  GM_addStyle(`
    /* —— 亮色模式 (原始样式) —— */
    #gadgets-filter-app .subtitle { font-size: 1.2em; font-weight: bold; color: #f09199; border-bottom: 1px solid #f09199; padding-bottom: 3px; margin-bottom: 10px; }
    #gadgets-filter-app .grouped { list-style: none; padding: 0; margin: 0 0 1em; }
    #gadgets-filter-app .grouped li { margin-bottom: 10px; }
    #gadgets-filter-app .inputtext, #gadgets-filter-app .select { border: 1px solid #AAA; padding: 5px; width: 100%; box-sizing: border-box; border-radius: 5px; background: #FFF; color: #000; }
    #gadgets-filter-app .btn { display: block; width: 100%; padding: 8px 0; text-align: center; border-radius: 5px; cursor: pointer; border: 1px solid; font-weight: bold; }
    #gadgets-filter-app .btn_search { background: #f09199; border-color: #e38aa1; color: #fff; }
    #gadgets-filter-app .btn_search:disabled { background: #CCC; border-color: #BBB; cursor: not-allowed; }
    #gadgets-filter-app .btn_reset { background: #f2f2f2; border-color: #ccc; color: #555; margin-top: 10px; }
    #gadgets-filter-app .filter-info { color: #999; margin-bottom: 10px; text-align: center; }
    /* 【新增】为 AI 摘要切换按钮添加专属样式 */
    #gadgets-filter-app #gadget-toggle-summary { padding: 4px 0; font-size: 0.9em; font-weight: normal; margin-top: 0; }
    .gadget-tag-list-container { background: #F9F9F9; border: 1px solid #E0E0E0; padding: 8px; border-radius: 5px; max-height: 160px; overflow-y: auto; line-height: 1.8; }
    .sidebar-tag { display: inline-block; cursor: pointer; text-decoration: none; color: #555; margin: 0 5px 2px 0; padding: 1px 6px; border-radius: 4px; border: 1px solid transparent; }
    .sidebar-tag:hover { background: #EFEFEF; color: #111; }
    .sidebar-tag.active { background: #f09199; color: #fff; font-weight: bold; border-color: #e38aa1; }
    .gadget-tags-container { display: inline-block; margin-left: 8px; vertical-align: middle; }
    .gadget-tag { display: inline-block; margin: 0 4px 4px 0; background: #f2f2f2; color: #777; font-size: 10px; padding: 1px 6px; border-radius: 4px; line-height: 1.5; cursor: pointer; }
    .gadget-tag.active { background: #f09199; color: #fff; }
    h2.subtitle.collapsible { cursor: pointer; position: relative; padding-left: 20px; user-select: none; }
    h2.subtitle.collapsible::before { content: '▶'; position: absolute; left: 0; top: 50%; transform: translateY(-50%); font-size: .8em; transition: transform .2s; }
    h2.subtitle.collapsible.expanded::before { transform: translateY(-50%) rotate(90deg); }
    .gadgets-pagination { text-align: center; margin: 10px 0; }
    .gadgets-pagination .page_inner input.inputtext { width: 30px; padding: 3px 5px; }
    #gadgets-list-container { position: relative; }
    .gadgets-loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.7); z-index: 10; display: flex; align-items: center; justify-content: center; color: #f09199; font-weight: bold; }
    /* --- 黑暗模式适配 --- */
    html[data-theme='dark'] #gadgets-filter-app .inputtext, html[data-theme='dark'] #gadgets-filter-app .select { background-color: #303132; color: #e0e0e1; border-color: #5c5c5c; }
    html[data-theme='dark'] #gadgets-filter-app .btn_reset { background-color: #6e6e6e; border-color: #7c7c7c; color: #fdfdfd; }
    html[data-theme='dark'] #gadgets-filter-app .btn_reset:hover { background-color: #7d7d7d; }
    html[data-theme='dark'] #gadgets-filter-app .filter-info { color: #dcdcdc; }
    html[data-theme='dark'] .gadget-tag-list-container { background-color: #353535; border-color: #444; }
    html[data-theme='dark'] .sidebar-tag { color: #dcdcdc; }
    html[data-theme='dark'] .sidebar-tag:hover { background-color: #444; color: #fff; }
    html[data-theme='dark'] .sidebar-tag.active, html[data-theme='dark'] .gadget-tag.active { background: #f09199; color: #fff; }
    html[data-theme='dark'] .gadget-tag { background-color: #3d3d3f; color: #d8d8d8; }
    html[data-theme='dark'] .gadgets-loading-overlay { background: rgba(45, 46, 47, 0.8); color: #f09199; }
    html[data-theme='dark'] #gadgets-list li { border-bottom-color: #444; }
    html[data-theme='dark'] #gadgets-list li:hover { background-color: #353535; }
    html[data-theme='dark'] #gadgets-list li a.l { color: #2ea6ff; }
    html[data-theme='dark'] #gadgets-list li small.grey { color: #d8d8d8; }
  `);

  class GadgetBrowser {
    apiUrl = 'https://gadgets.ry.mk/api/v1';
    state = {
      page: 1,
      limit: 25,
      currentDOM: [],
      totalPages: 1,
      isAISummaryActive: false, // 【新增】
    };
    ui = {};
    origDOM = [];
    metadataCache = new Map(); // 【改动】从 tagDataCache 重命名为 metadataCache
    tagFilterSet = new Set();
    origSummaries = new Map(); // 【新增】

    async init() {
      const colB = document.getElementById('columnB');
      const header = [...document.querySelectorAll('#columnA h2.subtitle')].find(h => h.textContent.trim() === '全部组件');
      this.ul = header?.nextElementSibling?.nextElementSibling;
      if (!colB || !this.ul || this.ul.tagName !== 'UL') return;

      this.origDOM = [...this.ul.children];
      this.ul.id = 'gadgets-list';
      const container = document.createElement('div');
      container.id = 'gadgets-list-container';
      this.ul.parentNode.insertBefore(container, this.ul);
      container.appendChild(this.ul);

      this.injectUI();
      this.cacheUIElements();
      this.setLoading(true, '正在加载组件数据...');
      
      await this.prefetchAllMetadata(); // 【改动】预取所有需要的元数据
      
      document.querySelectorAll('#columnA li.tml_item[id^="item_"]').forEach(li => {
        const summaryP = li.querySelector('.info p:not(.alarm)');
        if (summaryP) this.origSummaries.set(li.id, summaryP.innerHTML);
        this.enhanceListItem(li);
      });
      
      this.loadAndApplySummaryState(); // 【新增】
      
      await this.populateFilters();
      
      this.setLoading(false);
      this.setupCollapse();
      this.bindEvents();
      
      if (!await this.applyFromURL()) {
        this.reset(false);
      }
    }

    injectUI() {
      const sidePanelH2 = document.querySelector('#columnB .SidePanel h2');
      if (!sidePanelH2) return;
      const filterAppHTML = `
        <div id="gadgets-filter-app">
          <h2 class="subtitle">组件浏览器</h2>
          <p class="filter-info"></p>
          <ul class="grouped">
            <li><input type="search" id="gadget-key" class="inputtext" placeholder="关键词搜索…"></li>
            <li><select id="gadget-cat" class="select"><option value="">所有分类</option></select></li>
            <li><div id="gadget-tag-list" class="gadget-tag-list-container">加载标签中...</div></li>
            <li><select id="gadget-year" class="select"><option value="">所有年份</option></select></li>
            <li><button id="gadget-go" class="btn btn_search">筛选</button></li>
            <li><button id="gadget-clear" class="btn btn_reset">重置筛选</button></li>
          </ul>
        </div>
      `;
      sidePanelH2.insertAdjacentHTML('afterend', filterAppHTML);
      const filterButtonLI = document.querySelector('#gadget-go').parentElement;
      if (filterButtonLI) {
          const summaryToggleLI = document.createElement('li');
          summaryToggleLI.innerHTML = `<button id="gadget-toggle-summary" class="btn btn_reset">显示 AI 摘要</button>`;
          filterButtonLI.parentElement.insertBefore(summaryToggleLI, filterButtonLI);
      }
      const filterAppDiv = document.getElementById('gadgets-filter-app');
      if (filterAppDiv) {
        const hr = document.createElement('hr');
        hr.className = 'board';
        filterAppDiv.after(hr);
      }
      this.ul.insertAdjacentHTML('afterend', '<div id="gadgets-page" class="gadgets-pagination"></div>');
    }

    cacheUIElements() {
       Object.assign(this.ui, {
        key: document.getElementById('gadget-key'), cat: document.getElementById('gadget-cat'),
        tagList: document.getElementById('gadget-tag-list'), year: document.getElementById('gadget-year'),
        go: document.getElementById('gadget-go'), clear: document.getElementById('gadget-clear'),
        info: document.querySelector('.filter-info'), pager: document.getElementById('gadgets-page'),
        listContainer: document.getElementById('gadgets-list-container'),
        toggleSummaryBtn: document.getElementById('gadget-toggle-summary'), // 【新增】
      });
    }

    // 【改动】重命名并扩展功能，获取所有需要的元数据
    async prefetchAllMetadata() {
        try {
            const fields = 'gadget_id,ai_tags,ai_category,ai_summary';
            const res = await this.fetchJson(`${this.apiUrl}/search?limit=9999&fields=${fields}`);
            if (res.status === 'success') {
                res.data.forEach(g => this.metadataCache.set('item_' + g.gadget_id, g));
            }
        } catch (e) {
            console.error('预取组件元数据失败', e);
        }
    }
    
    async populateFilters() {
      this.ui.go.disabled = true;
      try {
        const [catRes, tagRes, yearRes] = await Promise.all([
          this.fetchJson(`${this.apiUrl}/categories`),
          this.fetchJson(`${this.apiUrl}/tags`),
          this.fetchJson(`${this.apiUrl}/years`),
        ]);
        if (catRes.status !== 'success' || tagRes.status !== 'success' || yearRes.status !== 'success') {
            throw new Error('一个或多个API请求失败');
        }
        const categories = catRes.data;
        for (const main of Object.keys(categories).sort()) {
          const og = document.createElement('optgroup');
          og.label = main;
          categories[main].forEach(sub => og.appendChild(new Option(' ' + sub, `${main}:${sub}`)));
          this.ui.cat.appendChild(og);
        }
        this.ui.tagList.innerHTML = '';
        const tagFrag = document.createDocumentFragment();
        tagRes.data.forEach(t => {
            const tagEl = document.createElement('a'); tagEl.href = '#';
            tagEl.className = 'sidebar-tag'; tagEl.textContent = t;
            tagEl.dataset.tag = t;
            tagFrag.appendChild(tagEl); tagFrag.appendChild(document.createTextNode(' '));
        });
        this.ui.tagList.appendChild(tagFrag);
        yearRes.data.forEach(y => this.ui.year.appendChild(new Option(`${y}年`, y)));
      } catch (e) {
        console.error('筛选器数据加载失败', e);
        this.ui.info.textContent = '筛选器加载失败，请刷新。';
      } finally {
        this.ui.go.disabled = false;
      }
    }

    async filter() {
        this.setLoading(true);
        this.updateURL();
        const params = new URLSearchParams();
        if(this.ui.key.value.trim()) params.append('q', this.ui.key.value.trim());
        if(this.ui.cat.value) params.append('category', this.ui.cat.value);
        if(this.ui.year.value) params.append('year', this.ui.year.value);
        this.tagFilterSet.forEach(t => params.append('tag', t));

        if (!params.toString()) {
            this.state.currentDOM = [...this.origDOM];
            this.state.page = 1;
            this.render();
            this.setLoading(false);
            return;
        }
        try {
            const result = await this.fetchJson(`${this.apiUrl}/search?${params.toString()}&limit=9999&fields=gadget_id`);
            if (result.status === 'success') {
                const matchedIds = new Set(result.data.map(g => 'item_' + g.gadget_id));
                this.state.currentDOM = this.origDOM.filter(node => matchedIds.has(node.id));
            } else { throw new Error(result.message || 'API返回错误'); }
        } catch (e) {
            console.error('筛选失败', e);
            this.ui.info.textContent = '筛选请求失败，请稍后重试。';
            this.state.currentDOM = [];
        }
        this.state.page = 1;
        this.render();
        this.setLoading(false);
    }

    render() {
      const { page, limit, currentDOM } = this.state;
      const totalItems = currentDOM.length;
      this.state.totalPages = Math.max(1, Math.ceil(totalItems / limit));
      if (this.state.page > this.state.totalPages) this.state.page = this.state.totalPages;
      const start = (this.state.page - 1) * limit;
      
      this.ul.innerHTML = '';
      this.ui.info.textContent = `共 ${totalItems} 个组件`; // 【改动】始终更新计数

      if (!totalItems) {
        this.ul.innerHTML = '<li>没有找到符合条件的组件。</li>';
        this.ui.pager.innerHTML = '';
        return;
      }
      const frag = document.createDocumentFragment();
      for (const li of currentDOM.slice(start, start + limit)) {
        const clone = li.cloneNode(true);
        this.enhanceListItem(clone);
        // 【新增】根据状态切换摘要
        if (this.state.isAISummaryActive) {
            const summaryP = clone.querySelector('.info p:not(.alarm)');
            if (summaryP) {
                const itemData = this.metadataCache.get(clone.id);
                summaryP.innerHTML = itemData?.ai_summary || '<small class="grey"><i>(无 AI 摘要)</i></small>';
            }
        }
        frag.appendChild(clone);
      }
      this.ul.appendChild(frag);
      this.renderPager();
      this.syncTagUIs();
    }

    // 【改动】重命名并扩展功能
    enhanceListItem(li) {
      const itemData = this.metadataCache.get(li.id);
      if (!itemData) return;
      
      // 1. 注入子分类
      const badge = li.querySelector('h3 .badge_job');
      if (badge && itemData.ai_category?.sub) {
        badge.textContent = itemData.ai_category.sub;
      }
      
      // 2. 注入标签
      if (!itemData.ai_tags?.length) return;
      const link = li.querySelector('h3 a.l');
      if (link && !li.querySelector('.gadget-tags-container')) {
        const span = document.createElement('span');
        span.className = 'gadget-tags-container';
        span.innerHTML = itemData.ai_tags.map(t => `<span class="gadget-tag" data-t="${t}">${t}</span>`).join('');
        link.after(span);
      }
    }

    renderPager() {
      const { page, totalPages } = this.state;
      if (totalPages <= 1) { this.ui.pager.innerHTML = ''; return; }
      let html = '<div class="page_inner">';
      html += page > 1 ? `<a href="#" data-p="${page - 1}" class="p">&lsaquo;&lsaquo;</a>` : '<span class="p_edge">&lsaquo;&lsaquo;</span>';
      let last = 0;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
          if (i > last + 1) html += '<span class="p_gap">...</span>';
          html += i === page ? `<strong class="p_cur">${i}</strong>` : `<a href="#" data-p="${i}" class="p">${i}</a>`;
          last = i;
        }
      }
      html += page < totalPages ? `<a href="#" data-p="${page + 1}" class="p">&rsaquo;&rsaquo;</a>` : '<span class="p_edge">&rsaquo;&rsaquo;</span>';
      html += `<a class="p_pages"><input class="inputtext" type="text" name="page" value="${page}"></a>`;
      html += `<span class="p_edge">(&nbsp;${page}&nbsp;/&nbsp;${totalPages}&nbsp;)</span></div>`;
      this.ui.pager.innerHTML = html;
    }

    reset(doFilter = true, updateURL = true) {
      this.ui.key.value = ''; this.ui.cat.value = ''; this.ui.year.value = '';
      this.tagFilterSet.clear();
      if (updateURL) {
          const url = new URL(location.href);
          const params = url.searchParams, orderby = params.get('orderby');
          params.forEach((_, key) => params.delete(key));
          if(orderby) params.set('orderby', orderby);
          history.pushState({}, '', url.toString());
      }
      this.state.page = 1;
      if (doFilter) this.filter();
      else {
          this.state.currentDOM = [...this.origDOM];
          this.render();
      }
    }

    updateURL() {
        const url = new URL(location.href);
        const params = url.searchParams, orderby = params.get('orderby');
        params.forEach((_, key) => params.delete(key));
        if(orderby) params.set('orderby', orderby);
        if (this.ui.key.value.trim()) params.set('q', this.ui.key.value.trim());
        if (this.ui.cat.value) params.set('category', this.ui.cat.value);
        if (this.ui.year.value) params.set('year', this.ui.year.value);
        this.tagFilterSet.forEach(t => params.append('tag', t));
        if (this.state.page > 1) params.set('page', this.state.page);
        history.pushState({}, '', url.toString());
    }

    // 【改动】重构以适应 async filter
    async applyFromURL() {
      const q = new URLSearchParams(location.search);
      if (!q.has('q') && !q.has('category') && !q.has('tag') && !q.has('year')) {
          return false;
      }
      this.ui.key.value = q.get('q') || '';
      this.ui.cat.value = q.get('category') || '';
      this.ui.year.value = q.get('year') || '';
      this.tagFilterSet = new Set(q.getAll('tag'));
      
      this.syncTagUIs();
      
      await this.filter(); // 等待筛选完成

      // 处理分页
      const pageFromURL = parseInt(q.get('page') || '1', 10) || 1;
      if (pageFromURL > 1 && pageFromURL <= this.state.totalPages) {
        this.state.page = pageFromURL;
        this.updateURL();
        this.render();
      }
      return true;
    }

    syncTagUIs() {
        this.ui.tagList.querySelectorAll('.sidebar-tag').forEach(el => {
            el.classList.toggle('active', this.tagFilterSet.has(el.dataset.tag));
        });
        document.querySelectorAll('#gadgets-list .gadget-tag').forEach(el => {
            el.classList.toggle('active', this.tagFilterSet.has(el.dataset.t));
        });
    }

    // 【新增】加载并应用持久化的摘要状态
    loadAndApplySummaryState() {
        const isActive = GM_getValue('bgm_gadgets_ai_summary_state', false);
        this.state.isAISummaryActive = isActive;
        this.ui.toggleSummaryBtn.textContent = isActive ? '显示原始简介' : '显示 AI 摘要';
        if (isActive) {
            document.querySelectorAll('#columnA li.tml_item[id^="item_"]').forEach(li => {
                const summaryP = li.querySelector('.info p:not(.alarm)');
                if (!summaryP) return;
                const itemData = this.metadataCache.get(li.id);
                summaryP.innerHTML = itemData?.ai_summary || '<small class="grey"><i>(无 AI 摘要)</i></small>';
            });
        }
    }

    // 【新增】切换摘要的函数
    toggleSummaries() {
        this.state.isAISummaryActive = !this.state.isAISummaryActive;
        const isActive = this.state.isAISummaryActive;
        GM_setValue('bgm_gadgets_ai_summary_state', isActive); // 保存状态
        this.ui.toggleSummaryBtn.textContent = isActive ? '显示原始简介' : '显示 AI 摘要';
        document.querySelectorAll('#columnA li.tml_item[id^="item_"]').forEach(li => {
            const summaryP = li.querySelector('.info p:not(.alarm)');
            if (!summaryP) return;
            if (isActive) {
                const itemData = this.metadataCache.get(li.id);
                summaryP.innerHTML = itemData?.ai_summary || '<small class="grey"><i>(无 AI 摘要)</i></small>';
            } else {
                summaryP.innerHTML = this.origSummaries.get(li.id) || '';
            }
        });
    }

    bindEvents() {
      this.ui.go.addEventListener('click', () => this.filter());
      this.ui.clear.addEventListener('click', () => this.reset());
      ['key', 'cat', 'year'].forEach(k =>
        this.ui[k].addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); this.filter(); }})
      );
      // 【改动】修复交互式多选标签高亮 bug
      const handleTagClick = (tag) => {
          this.tagFilterSet.has(tag) ? this.tagFilterSet.delete(tag) : this.tagFilterSet.add(tag);
          this.syncTagUIs();
          this.filter();
      };
      this.ui.tagList.addEventListener('click', e => {
          e.preventDefault();
          const tagEl = e.target.closest('.sidebar-tag');
          if (tagEl) handleTagClick(tagEl.dataset.tag);
      });
      this.ul.addEventListener('click', e => {
        const tagEl = e.target.closest('.gadget-tag');
        if (tagEl) { e.preventDefault(); handleTagClick(tagEl.dataset.t); }
      });
      this.ui.pager.addEventListener('click', e => {
        const a = e.target.closest('a[data-p]');
        if (a) {
            e.preventDefault();
            this.state.page = parseInt(a.dataset.p, 10);
            this.updateURL();
            this.render();
        }
      });
      this.ui.pager.addEventListener('keydown', e => {
        if (e.target.name === 'page' && e.key === 'Enter') {
          e.preventDefault();
          const p = parseInt(e.target.value, 10);
          if (p > 0 && p <= this.state.totalPages) {
            this.state.page = p;
            this.updateURL();
            this.render();
          }
        }
      });
      this.ui.toggleSummaryBtn.addEventListener('click', () => this.toggleSummaries()); // 【新增】
      window.addEventListener('popstate', async () => {
        if (!await this.applyFromURL()) this.reset(false, false);
      });
    }

    setupCollapse() {
      document.querySelectorAll('#columnA h2.subtitle').forEach(h => {
        if (['我的组件', '启用的组件'].includes(h.textContent.trim())) {
          const ul = h.nextElementSibling;
          if (ul?.tagName === 'UL') {
            ul.style.display = 'none';
            h.classList.add('collapsible');
            h.addEventListener('click', () => {
              ul.style.display = ul.style.display === 'none' ? '' : 'none';
              h.classList.toggle('expanded', ul.style.display !== 'none');
            });
          }
        }
      });
    }

    // 【改动】修复 filter-info 消失的问题
    setLoading(isLoading, text = '正在筛选...') {
        this.ui.go.disabled = isLoading;
        let overlay = this.ui.listContainer.querySelector('.gadgets-loading-overlay');
        if (isLoading) {
            this.ui.info.textContent = text;
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'gadgets-loading-overlay';
                this.ui.listContainer.appendChild(overlay);
            }
            overlay.textContent = text;
            overlay.style.display = 'flex';
        } else {
            // 不再清空 info 文本
            if (overlay) overlay.style.display = 'none';
        }
    }

    fetchJson(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET', url: String(url), responseType: 'json',
          onload: r => (r.status >= 200 && r.status < 400) ? resolve(r.response) : reject(new Error(`HTTP error! status: ${r.status}`)),
          onerror: err => reject(err), ontimeout: () => reject(new Error('Request timed out')),
        });
      });
    }
  }

  /* ---------- 启动 ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GadgetBrowser().init());
  } else {
    new GadgetBrowser().init();
  }
})();