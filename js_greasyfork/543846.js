// ==UserScript==
// @name         Amazon 关键词 ASIN 广告位自然位批量统计
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  一次搜索多个ASIN（逗号分隔），区分自然位和广告位，支持备注存储与历史选择
// @author       ciaociao (modified); smile31768
// @match        https://www.amazon.com/s?k*
// @icon         https://www.amazon.com/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/lihengdao666/Modify-Tampermonkey-Libs@9441a4727d6598af3e93b7c01ee449c744dab32f/filesaver.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543846/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%B9%BF%E5%91%8A%E4%BD%8D%E8%87%AA%E7%84%B6%E4%BD%8D%E6%89%B9%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/543846/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%B9%BF%E5%91%8A%E4%BD%8D%E8%87%AA%E7%84%B6%E4%BD%8D%E6%89%B9%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============ UI ============
  const ui = `
    <div style="position:fixed; top:10px; right:10px; background:white; border:1px solid #ccc; padding:10px; z-index:10000; font-size:12px; line-height:1.6;">
      <div style="font-weight:bold; margin-bottom:6px;">ASIN 定位器（支持多ASIN）</div>
      <label for="asinSelect">1. 选择历史ASIN： </label>
      <select id="asinSelect" style="width:260px;"></select>
      <br>
      <label for="asinInput">2. 输入ASIN（逗号分隔）：</label>
      <input type="text" id="asinInput" style="width:260px;" placeholder="如：B0AAAAAA01, B0BBBBBB02, B0CCCCCC03" />
      <br>
      <label for="asinLabel">添加备注（可选）：</label>
      <input type="text" id="asinLabel" style="width:260px;" placeholder="本次批量ASIN的默认备注" />
      <br>
      <button id="startSearch">开始搜索</button>
      <button id="clearStorage" title="清空已保存的ASIN与备注">清空历史</button>
      <button id="close" title="关闭面板" style="float:right;">X</button>
    </div>`;

  const container = document.createElement('div');
  container.innerHTML = ui;
  document.body.appendChild(container);

  // ============ 状态 ============

  /** @type {string[]} 目标ASIN列表（大写、校验后） */
  let targetASINs = [];

  /** 当前页码（从1开始） */
  let currentPage = 1;

  /**
   * 结果结构：{ [asin]: { natural: {page, position} | null, sponsored: {page, position} | null } }
   */
  let results = {};

  loadSavedASINs();

  // ============ 事件绑定 ============
  document.getElementById('asinSelect').addEventListener('change', onSelectASIN);
  document.getElementById('asinInput').addEventListener('input', onInputASINs);
  document.getElementById('startSearch').addEventListener('click', startSearch);
  document.getElementById('clearStorage').addEventListener('click', clearStorage);
  document.getElementById('close').addEventListener('click', () => container.remove());

  // ============ 辅助函数 ============

  /** 解析输入为 ASIN 数组：逗号/空格分隔，转大写并校验10位字母数字 */
  function parseASINs(raw) {
    if (!raw) return [];
    return raw
      .split(/[,\s，]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => /^[A-Z0-9]{10}$/.test(s));
  }

  function onSelectASIN() {
    const sel = document.getElementById('asinSelect').value.trim();
    if (sel) {
      // 下拉只支持单个；选择后直接写入输入框（便于批量编辑）
      const input = document.getElementById('asinInput');
      input.value = input.value ? (input.value.replace(/[,\s，]+$/,'') + ', ' + sel) : sel;
      onInputASINs();
    }
  }

  function onInputASINs() {
    const raw = document.getElementById('asinInput').value;
    targetASINs = parseASINs(raw);
  }

  function initResults() {
    results = {};
    for (const asin of targetASINs) {
      results[asin] = { natural: null, sponsored: null };
    }
  }

  function allFoundBothTypes() {
    return targetASINs.every(asin => results[asin].natural && results[asin].sponsored);
  }

  // ============ 搜索主流程 ============

  function startSearch() {
    // 优先使用输入框；若输入为空且下拉有值，则只搜单个下拉ASIN
    const raw = document.getElementById('asinInput').value;
    targetASINs = parseASINs(raw);

    if (targetASINs.length === 0) {
      const sel = document.getElementById('asinSelect').value.trim().toUpperCase();
      if (sel && /^[A-Z0-9]{10}$/.test(sel)) {
        targetASINs = [sel];
      }
    }

    if (targetASINs.length === 0) {
      alert('请至少输入一个有效的 ASIN（10位字母数字），多个用逗号分隔。');
      return;
    }

    initResults();
    currentPage = 1;

    // 保存本次输入到历史（逐个保存，备注相同）
    const label = document.getElementById('asinLabel').value.trim();
    saveASINs(targetASINs, label);

    searchPage();
  }

  function searchPage() {
    const products = document.querySelectorAll('div[data-asin]');
    let naturalIndex = 0, sponsoredIndex = 0;

    for (const div of products) {
      const asin = (div.getAttribute('data-asin') || '').toUpperCase();
      if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) continue;

      // 是否是赞助（广告）位：根据Sponsored标识（可能需按主题适配）
        // 判断一个搜索结果卡片是否为广告位（Sponsored）
        function isSponsoredResult(root) {
            // 常见可选的结构/属性（不同页面布局可能略有差异）
            if (root.querySelector('[aria-label="Sponsored"]')) return true;
            if (root.querySelector('.s-sponsored-label, .s-label-popover-default, .puis-sponsored-label-text, .s-sponsored-label-text')) return true;
            if (root.querySelector('[data-component-type="sp-sponsored-result"], [data-component-type="sp-sponsored-products"]')) return true;

            // 兜底：在常见的文本节点里扫描“Sponsored”字样
            const nodes = root.querySelectorAll('span, div');
            for (const el of nodes) {
                const t = (el.textContent || '').trim().toLowerCase();
                if (t === 'sponsored' || t.startsWith('sponsored ')) {
                    return true;
                }
            }
            return false;
        }
        const isSponsored = isSponsoredResult(div);


      // 仅统计可购买卡片（和原脚本一致，避免统计到空容器）
      const addToCart = div.querySelector('span.a-button-inner button.a-button-text');
      if (!addToCart) continue;

      if (isSponsored) sponsoredIndex++;
      else naturalIndex++;

      // 只处理目标ASIN
      if (!targetASINs.includes(asin)) continue;

      // 记录第一次出现的位置
      if (isSponsored && !results[asin].sponsored) {
        results[asin].sponsored = { page: currentPage, position: sponsoredIndex };
      } else if (!isSponsored && !results[asin].natural) {
        results[asin].natural = { page: currentPage, position: naturalIndex };
      }
    }

    if (allFoundBothTypes()) {
      showResults();
      return;
    }

    if (currentPage < 5) {
      const nextPage = document.querySelector('a.s-pagination-next');
      if (nextPage) {
        currentPage++;
        nextPage.click();
        // 等待新页面内容加载后再次搜索
        setTimeout(searchPage, 10000);
        return;
      }
    }

    // 到达最大页或无下一页
    showResults();
    
  }

  function showResults() {
    let lines = [`搜索完成，按确定保存结果为文件：`];
    let csv = [`ASIN,natural,sponsored\n`];
    for (const asin of targetASINs) {
      const r = results[asin] || { natural: null, sponsored: null };
      lines.push(`\nASIN：${asin}`);
      csv.push(`${asin},`);
      if (r.natural) {
        lines.push(`  自然位：第 ${r.natural.page} 页，第 ${r.natural.position} 个位置`);
        csv.push(`page ${r.natural.page} / no.${r.natural.position},`);
      } else {
        lines.push(`  自然位：未找到（前 ${currentPage} 页）`);
        csv.push(`Not found in ${currentPage} pages,`);
      }
      if (r.sponsored) {
        lines.push(`  广告位：第 ${r.sponsored.page} 页，第 ${r.sponsored.position} 个位置`);
        csv.push(`page ${r.sponsored.page} / no.${r.sponsored.position}\n`);
      } else {
        lines.push(`  广告位：未找到（前 ${currentPage} 页）`);
        csv.push(`Not found in ${currentPage} pages\n`);
      }
    }
    let save_csv = confirm(lines.join('\n'));
    if(save_csv){
      var file = new File(csv,'ranking.csv',{type: "text/plain;charset=utf-8"});
      saveAs(file);
      alert('下载完成，路径：下载/ranking.csv');
    }
  }

  // ============ 本地存储 ============

  function saveASINs(asins, label) {
    const saved = JSON.parse(localStorage.getItem('savedASINs') || '[]'); // [{asin, label}]
    const existed = new Set(saved.map(it => it.asin.toUpperCase()));
    let updated = false;

    for (const asin of asins) {
      if (!existed.has(asin.toUpperCase())) {
        saved.push({ asin, label: label || '未命名' });
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem('savedASINs', JSON.stringify(saved));
      updateASINDropdown();
    }
  }

  function loadSavedASINs() {
    updateASINDropdown();
  }

  function updateASINDropdown() {
    const asinSelect = document.getElementById('asinSelect');
    asinSelect.innerHTML = '<option value="">-- 从历史选择（点击后会追加到输入框） --</option>';
    const saved = JSON.parse(localStorage.getItem('savedASINs') || '[]');
    saved.forEach(item => {
      const option = document.createElement('option');
      option.value = item.asin;
      option.textContent = `${item.asin} - ${item.label || '未命名'}`;
      asinSelect.appendChild(option);
    });
  }

  function clearStorage() {
    localStorage.removeItem('savedASINs');
    updateASINDropdown();
    alert('已清空保存的 ASIN 历史记录！');
  }
})();
