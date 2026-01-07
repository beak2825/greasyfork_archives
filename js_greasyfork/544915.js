// ==UserScript==
// @name         Bing Zen & Clean - 深度去广与极简美化 (修复版 v18.9)
// @namespace    http://tampermonkey.net/
// @version      18.9
// @description  移除广告/垃圾内容；修复背景不显示；修复搜索框文字无法居中；新增“链接级”精确置顶。
// @author       You
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @match        https://www4.bing.com/search*
// @icon         https://www.bing.com/sa/simg/favicon-2x.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544915/Bing%20Zen%20%20Clean%20-%20%E6%B7%B1%E5%BA%A6%E5%8E%BB%E5%B9%BF%E4%B8%8E%E6%9E%81%E7%AE%80%E7%BE%8E%E5%8C%96%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%20v189%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544915/Bing%20Zen%20%20Clean%20-%20%E6%B7%B1%E5%BA%A6%E5%8E%BB%E5%B9%BF%E4%B8%8E%E6%9E%81%E7%AE%80%E7%BE%8E%E5%8C%96%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%20v189%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // --- 配置常量 ---
  const CONFIG = {
    KEY_BG: 'bing_zen_bg_merged_v5',
    KEY_BLOCK: 'bing_zen_block_merged_v5',      // 屏蔽列表（存域名）
    KEY_FAV_URL: 'bing_zen_fav_url_v1',         // 置顶列表（存具体URL）
    DEFAULT_BG: 'https://raw.githubusercontent.com/WJH-makers/markdown_photos/main/images/sea.png',
    CONTAINER_WIDTH: '820px',
    STYLE_ID: 'bing-zen-merged-style',
  };

  // --- 黑名单图片特征 ---
  const BLACKLIST_IMAGE_SRC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAALACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAABAYBAgUH/8QAJBAAAgEDBAICAwAAAAAAAAAAAQIDBBESAAUhMSJhExUyUZH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEh/9oADAMBAAIRAxEAPwDsU1F9puO5RVEkzxR/EscYndFBxyP4n92Op32jEO2rGkkrwtMnyLLUSEtzZVBAYjyt1bWxDBFC0jRLiZXzc3vk1gL/AMA1WspIK2Aw1KZxlg1rkcg3HXsaBe2GOej3FYJQwadpZgHqJj43ufFlsSMhyedMysrEhSDibH0dAUG2UcEq1MUOMyh0DZE2BPI79DR7KGUg9HQmv//Z";

  // --- 强力垃圾选择器 ---
  const TRASH_SELECTORS = [
    // 1. 顶部聚合容器与杂志卡片
    '#b_topw', '.b_wpt_container',

    // 2. 底部占位符与干扰
    'div[elementtiming="frp.BottomOfPage"]',
    'li:has(div[elementtiming="frp.BottomOfPage"])',
    '#b_results > .b_ans:last-child',

    // 3. 常规垃圾
    '.b_promtxt', '.sp_requery', '.sp_recourse', 'li:has(.b_promtxt)',
    '.b_msg', '.b_canvas', 'li.b_ans.b_top', 'div[elementtiming="frp.TopOfPage"]',
    '#b_genserp_container', '.b_genserp_container', '#gs_main',
    '.qna_tlgacont', '.gsqnanrt', '.qna-mf', '.gs_caphead', '.gs_cit_cont',
    '.b_ad', '.b_adTop', '.b_adBottom', '.sb_adsWv2', '#b_pole', '.ad_sc',
    '.sb_adTA', '.b_adSlug', '.b_adLabel',
    'li:has(.sb_adTA)', 'li:has(.b_adSlug)', 'li:has(a[h*="Ads"])',
    '#sb_fdb', '#id_h', '#rh_rwm', '.kumo_rewards', '#est_switch',
    '#b_skip_to_content', '#id_l', '#b_tween', '.b_ph_placehold',
    '#aRmsDefer', '#b_TriviaOverlay', '.sb_hbop', '#qs_searchBoxOuter',
    '#b_dynRail', 'aside[aria-label="浏览更多"]', '#b_context', '#b_footer', '.b_footer', '.b_slidebar',
    '#brsv3', '.rsExplr', 'li:has(#brsv3)', '.b_ans.b_mop', '.b_entityTP', '.b_ans_vList',
    '#adstop_gradiant_separator', '.b_algo.b_ad',
    '.b_imgcap_altitle .b_imgcap_img', '.b_vidAns', '#serpvidans', '.vsathm',
    '.b_imgansacf', '.acfImgAns', '.rqnaacfacc', '#relatedQnAListDisplay',
    '.b_inline_ajax_rs', '#inline_rs',
    '#zen-wpt'
  ].join(', ');

  // --- 辅助函数 ---
  function normalizeDomain(input) {
    let s = (input || '').trim();
    if (!s) return '';
    s = s.replace(/^\*\./, '').replace(/^https?:\/\//, '').split('/')[0];
    return s.toLowerCase();
  }

  function normalizeUrl(input) {
      let s = (input || '').trim();
      if (!s) return '';
      try {
          // 移除末尾的斜杠，确保匹配准确
          return s.replace(/\/$/, '');
      } catch { return s; }
  }

  function safeText(el) {
    return (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // --- CSS 构建 ---
  function buildCSS(bgImage) {
    return `
      :root{
        --zen-bg: url('${bgImage}');
        --zen-width: ${CONFIG.CONTAINER_WIDTH};
      }
      html { overflow-y: auto !important; overflow-x: hidden !important; height: 100% !important; }
      body {
        background: var(--zen-bg) center/cover fixed no-repeat !important;
        min-height: 100vh !important; margin: 0 !important;
        overflow-x: hidden !important;
      }

      /* --- 1. 强力隐藏垃圾 --- */
      ${TRASH_SELECTORS} {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* --- 2. 头部与搜索框 --- */
      #b_header {
        position: fixed !important; top: 0; left: 0;
        width: 100% !important; height: 80px !important;
        display: flex !important; justify-content: center !important; align-items: center !important;
        background: transparent !important; z-index: 100000;
        box-shadow: none !important; border: none !important; pointer-events: none;
      }
      #b_header > *:not(#sb_form) { display: none !important; }

      form#sb_form {
        pointer-events: auto; position: relative !important;
        margin: 0 !important; float: none !important;
        width: var(--zen-width) !important; max-width: 85vw !important; height: 50px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        border-radius: 25px !important;
        border: 1px solid rgba(0,0,0,0.1) !important;
        display: flex !important; align-items: center !important;
        padding: 0 10px 0 20px !important; z-index: 100001 !important;
        backdrop-filter: blur(5px);
      }
      #sb_form .b_searchboxForm { flex: 1 !important; display: flex !important; align-items: center !important; height: 100% !important; border: none !important; margin: 0 !important; box-shadow: none !important;}

      /* --- 修复搜索框居中问题：移除height 100%，让flex自动居中 --- */
      #sb_form_q {
          width: 100% !important;
          height: auto !important; /* 关键修改 */
          line-height: normal !important;
          border: none !important;
          background: transparent !important;
          outline: none !important;
          font-size: 16px !important;
          color: #333 !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          align-self: center !important; /* 辅助居中 */
      }

      #sb_form .b_logoArea { display: none !important; }
      #sb_form .mic_cont, #sb_form #sb_clt, #sb_form #sb_search { display: flex !important; align-items: center; justify-content: center; height: 100% !important; position: static !important; margin: 0 4px !important; }
      #sb_form_go { display: block !important; position: static !important; }

      /* --- 3. 搜索结果布局修正 --- */
      #b_content, #b_content > main {
        padding-top: 110px !important;
        padding-left: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: 100% !important;
        min-width: 0 !important;
        background: none !important; /* 关键修改：移除 content 层的白色背景 */
      }

      /* 统一容器 */
      #b_results,
      #b_mcw {
        width: var(--zen-width) !important;
        max-width: 94vw !important;
        min-width: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #b_results > li {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* 结果卡片 */
      li.b_algo, li.b_ans {
        width: 100% !important;
        background: rgba(255,255,255,0.94) !important;
        border-radius: 12px !important;
        padding: 24px !important;
        margin-bottom: 16px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        border: 1px solid rgba(255,255,255,0.7) !important;
        transition: transform 0.2s, box-shadow 0.2s;
        position: relative;
        box-sizing: border-box !important;
      }
      li.b_algo:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important; }

      .b_algo h2 a { font-size: 20px !important; color: #1a0dab !important; text-decoration: none !important; font-weight: 500 !important; }
      .b_caption p, .b_algo .b_factrow { color: #333 !important; font-size: 15px !important; line-height: 1.6 !important; }
      .b_algo cite { color: #006621 !important; font-style: normal; font-size: 14px !important; }

      /* 按钮组 */
      .zen-btn-group { float: right; opacity: 0; transition: all 0.2s; display: flex; gap: 6px; }
      li.b_algo:hover .zen-btn-group { opacity: 1; }

      .zen-action-btn { font-size: 12px; cursor: pointer; border: 1px solid #eee; padding: 2px 8px; border-radius: 4px; background: #fff; }
      .zen-block-btn { color: #999; }
      .zen-block-btn:hover { color: white; border-color: #ff4d4f; background: #ff4d4f; }
      .zen-fav-btn { color: #52c41a; border-color: #b7eb8f; background: #f6ffed; }
      .zen-fav-btn:hover { color: white; border-color: #52c41a; background: #52c41a; }
      .zen-fav-active { background: #52c41a; color: white; border-color: #52c41a; }

      /* 置顶卡片高亮 */
      li.b_algo.zen-pinned-card {
        border-left: 5px solid #f1c40f !important;
        background: #fffcf0 !important;
      }
      .b_pag { width: 100%; text-align: center; margin-top: 20px; }
      .b_pag nav { background: rgba(255,255,255,0.8); display: inline-block; padding: 10px 20px; border-radius: 30px; }

      /* 设置面板 */
      #zen-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999998; backdrop-filter: blur(3px); }
      #zen-settings { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 450px; background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); z-index: 999999; }
      .zen-input { width: 100%; padding: 8px; margin: 8px 0 15px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
      .zen-label { font-weight: bold; display: block; margin-top: 10px; font-size: 13px; color: #555; }
      .zen-btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; float: right; margin-left: 10px; }
      .zen-save { background: #0078d4; color: white; }
      .zen-cancel { background: #f3f3f3; color: #333; }
    `;
  }

  // --- 主逻辑 ---
  class BingZenEngine {
    constructor() {
      this.blockSet = new Set();
      this.favUrlSet = new Set();
      this.timeoutId = null;
      this.init();
    }

    async init() {
      const savedBg = await GM_getValue(CONFIG.KEY_BG, CONFIG.DEFAULT_BG);
      const blockArr = JSON.parse(await GM_getValue(CONFIG.KEY_BLOCK, '[]') || '[]').map(normalizeDomain).filter(Boolean);
      this.blockSet = new Set(blockArr);
      const favArr = JSON.parse(await GM_getValue(CONFIG.KEY_FAV_URL, '[]') || '[]').map(normalizeUrl).filter(Boolean);
      this.favUrlSet = new Set(favArr);

      this.addOrReplaceStyle(buildCSS(savedBg));

      GM_registerMenuCommand('⚙️ Zen 设置', () => this.toggleSettings(true));

      this.buildSettingsUI();

      const observer = new MutationObserver((mutations) => {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.processPage(), 100);
      });

      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener('DOMContentLoaded', () => setTimeout(() => this.processPage(), 200));
    }

    addOrReplaceStyle(css) {
        let style = document.getElementById(CONFIG.STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = CONFIG.STYLE_ID;
            style.type = 'text/css';
            (document.head || document.documentElement).appendChild(style);
        }
        style.textContent = css;
    }

    processPage() {
      // 1. CSS 清理
      document.querySelectorAll(TRASH_SELECTORS).forEach(el => el.remove());

      // 2. 图片特征屏蔽
      document.querySelectorAll('img').forEach(img => {
          if (img.src && img.src === BLACKLIST_IMAGE_SRC) {
              const card = img.closest('.b_algo') || img.closest('.b_ans') || img.closest('li');
              if (card) card.remove();
          }
      });

      // 3. 深度清洗与按钮注入
      const resultsContainer = document.getElementById('b_results');
      const results = document.querySelectorAll('li.b_algo, li.b_ans, li.b_msg');
      let itemsToPromote = [];

      results.forEach(li => {
          let isAd = false;
          // 广告检测
          if (li.querySelector('a[h*="Ads"]')) isAd = true;
          if (li.querySelector('.sb_adTA') || li.querySelector('.b_adSlug') || li.querySelector('.sb_adTA_title_link_cn')) isAd = true;
          const attribution = safeText(li.querySelector('.b_attribution, .b_adLabel, .b_adSlug'));
          if (attribution.includes('广告') || attribution.includes('Ad')) isAd = true;
          if (li.querySelector('.b_promtxt') || li.querySelector('.sp_requery') || li.querySelector('.sp_recourse')) isAd = true;
          if (li.classList.contains('b_msg') || li.querySelector('.b_msg')) isAd = true;
          if (li.classList.contains('b_top')) isAd = true;
          if (li.querySelector('#brsv3') || li.querySelector('.rsExplr') || li.querySelector('.gsqnanrt')) isAd = true;
          if (li.id === 'b_topw' || li.querySelector('#b_wpt_container')) isAd = true;

          if (isAd) { li.remove(); return; }

          // 处理正常结果
          if (li.matches('.b_algo:not([data-zen="1"])')) {
              const link = li.querySelector('h2 a');
              if (!link) return;

              const rawUrl = link.href;
              const domain = this.extractDomain(rawUrl);
              const exactUrl = normalizeUrl(rawUrl);

              // 1. 检查域名屏蔽
              if (this.isBlocked(domain)) {
                  li.remove();
                  return;
              }

              const titleArea = li.querySelector('h2');
              if (titleArea && !titleArea.querySelector('.zen-btn-group')) {
                  const group = document.createElement('span');
                  group.className = 'zen-btn-group';

                  // 精确置顶按钮 (针对 URL)
                  const isFav = this.isFavUrl(exactUrl);
                  const favBtn = document.createElement('span');
                  favBtn.className = `zen-action-btn zen-fav-btn ${isFav ? 'zen-fav-active' : ''}`;
                  favBtn.textContent = isFav ? '已置顶' : '置顶';
                  favBtn.title = isFav ? '取消此链接置顶' : `将此具体链接排在第一位`;
                  favBtn.onclick = (e) => {
                      e.preventDefault(); e.stopPropagation();
                      this.toggleFavUrl(exactUrl, favBtn, li);
                  };

                  // 屏蔽按钮 (针对 域名)
                  const blockBtn = document.createElement('span');
                  blockBtn.className = 'zen-action-btn zen-block-btn';
                  blockBtn.textContent = '屏蔽';
                  blockBtn.title = `永久屏蔽网站 ${domain}`;
                  blockBtn.onclick = (e) => {
                      e.preventDefault(); e.stopPropagation();
                      if (confirm(`永久屏蔽 ${domain} 的所有内容?`)) {
                          this.addToBlocklist(domain);
                          li.remove();
                      }
                  };

                  group.appendChild(favBtn);
                  group.appendChild(blockBtn);
                  titleArea.prepend(group);

                  // 如果是置顶项，添加标记并准备移动
                  if (isFav) {
                      li.classList.add('zen-pinned-card');
                      itemsToPromote.push(li);
                  }
              }
              li.setAttribute('data-zen', '1');
          } else {
              // 已经处理过的元素，如果是收藏的，也加入重排队列
              if (li.classList.contains('zen-pinned-card')) {
                  itemsToPromote.push(li);
              }
          }
      });

      // 4. 执行置顶重排
      if (itemsToPromote.length > 0 && resultsContainer) {
          for (let i = itemsToPromote.length - 1; i >= 0; i--) {
             if (resultsContainer.firstElementChild !== itemsToPromote[i]) {
                 resultsContainer.prepend(itemsToPromote[i]);
             }
          }
      }
    }

    extractDomain(url) {
      try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
    }

    isBlocked(domain) {
      if (!domain) return false;
      return [...this.blockSet].some(b => domain === b || domain.endsWith('.' + b));
    }

    // 检查具体 URL 是否收藏
    isFavUrl(url) {
      if (!url) return false;
      return this.favUrlSet.has(url);
    }

    async addToBlocklist(domain) {
      this.blockSet.add(domain);
      await GM_setValue(CONFIG.KEY_BLOCK, JSON.stringify([...this.blockSet]));
    }

    // 切换 URL 置顶状态
    async toggleFavUrl(url, btn, li) {
        if (this.favUrlSet.has(url)) {
            // 取消
            this.favUrlSet.delete(url);
            btn.textContent = '置顶';
            btn.classList.remove('zen-fav-active');
            li.classList.remove('zen-pinned-card');
        } else {
            // 添加
            this.favUrlSet.add(url);
            btn.textContent = '已置顶';
            btn.classList.add('zen-fav-active');
            li.classList.add('zen-pinned-card');
        }
        await GM_setValue(CONFIG.KEY_FAV_URL, JSON.stringify([...this.favUrlSet]));
    }

    buildSettingsUI() {
        const div = document.createElement('div');
        div.innerHTML = `
          <div id="zen-overlay" style="display:none"></div>
          <div id="zen-settings" style="display:none">
            <h3 style="margin-top:0">Bing Zen 设置</h3>

            <label class="zen-label">背景图片 URL:</label>
            <input class="zen-input" id="zen-bg-val" placeholder="输入图片直链...">

            <label class="zen-label">👑 置顶链接列表 (精确匹配 URL):</label>
            <textarea class="zen-input" id="zen-fav-val" style="height:80px; border-color:#b7eb8f; background:#f6ffed" placeholder="例如: https://www.zhihu.com/question/123..."></textarea>

            <label class="zen-label">🚫 屏蔽域名列表 (屏蔽整个网站):</label>
            <textarea class="zen-input" id="zen-block-val" style="height:80px"></textarea>

            <div style="overflow:hidden; margin-top:10px;">
                <button class="zen-btn zen-save" id="zen-save-btn">保存并生效</button>
                <button class="zen-btn zen-cancel" id="zen-close-btn">关闭</button>
            </div>
          </div>
        `;
        document.body.appendChild(div);

        document.getElementById('zen-close-btn').onclick = () => this.toggleSettings(false);
        document.getElementById('zen-overlay').onclick = () => this.toggleSettings(false);
        document.getElementById('zen-save-btn').onclick = async () => {
            const bg = document.getElementById('zen-bg-val').value.trim();

            const blockStr = document.getElementById('zen-block-val').value;
            const blockList = blockStr.split(/[\n,]/).map(normalizeDomain).filter(Boolean);

            const favStr = document.getElementById('zen-fav-val').value;
            const favList = favStr.split(/[\n,]/).map(normalizeUrl).filter(Boolean);

            await GM_setValue(CONFIG.KEY_BG, bg);
            await GM_setValue(CONFIG.KEY_BLOCK, JSON.stringify(blockList));
            await GM_setValue(CONFIG.KEY_FAV_URL, JSON.stringify(favList));

            this.toggleSettings(false);
            location.reload();
        };
    }

    async toggleSettings(show) {
        const overlay = document.getElementById('zen-overlay');
        const modal = document.getElementById('zen-settings');
        if (show) {
            document.getElementById('zen-bg-val').value = await GM_getValue(CONFIG.KEY_BG, '');

            const blocks = JSON.parse(await GM_getValue(CONFIG.KEY_BLOCK, '[]'));
            document.getElementById('zen-block-val').value = blocks.join('\n');

            const favs = JSON.parse(await GM_getValue(CONFIG.KEY_FAV_URL, '[]'));
            document.getElementById('zen-fav-val').value = favs.join('\n');

            overlay.style.display = 'block';
            modal.style.display = 'block';
        } else {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        }
    }
  }

  new BingZenEngine();
})();