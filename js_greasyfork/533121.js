// ==UserScript==
// @name         サクラチェッカーをAmazon内に直接表示 🔍️
// @namespace    https://github.com/koyasi777/amazon-sakura-checker-enhancer
// @version      7.7
// @description  Amazon.co.jpの商品ページにサクラチェッカーのスコアと判定を高速表示！
// @author       koyasi777
// @match        https://www.amazon.co.jp/*
// @grant        GM_xmlhttpRequest
// @connect      sakura-checker.jp
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-sakura-checker-enhancer
// @supportURL   https://github.com/koyasi777/amazon-sakura-checker-enhancer/issues
// @icon         https://sakura-checker.jp/images/apple-touch-icon-600.png
// @downloadURL https://update.greasyfork.org/scripts/533121/%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E3%82%92Amazon%E5%86%85%E3%81%AB%E7%9B%B4%E6%8E%A5%E8%A1%A8%E7%A4%BA%20%F0%9F%94%8D%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533121/%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E3%82%92Amazon%E5%86%85%E3%81%AB%E7%9B%B4%E6%8E%A5%E8%A1%A8%E7%A4%BA%20%F0%9F%94%8D%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CHECK_INTERVAL = 500;
  const MAX_RETRIES = 20;
  const DEBOUNCE_TIME = 200;
  let currentASIN = null;
  let debounceTimer = null;

  function getASIN() {
    const urlMatch = location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
    if (urlMatch) return urlMatch[1];
    const meta = document.querySelector('[data-asin]')?.getAttribute('data-asin');
    if (meta && /^[A-Z0-9]{10}$/.test(meta)) return meta;
    const input = document.querySelector('input[name="ASIN"]')?.value;
    if (input && /^[A-Z0-9]{10}$/.test(input)) return input;
    return null;
  }

  function injectStyles() {
    if (document.getElementById('sakuraCheckerStyle')) return;
    const style = document.createElement('style');
    style.id = 'sakuraCheckerStyle';
    style.textContent = `
      .sakuraCheckerEmbed {
        margin-top: 12px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        font-size: 14px;
        color: #333;
        line-height: 1.6;
      }
      .sakuraCheckerEmbed table {
        width: 100%;
        margin-top: 10px;
        border-collapse: collapse;
      }
      .sakuraCheckerEmbed th,
      .sakuraCheckerEmbed td {
        padding: 4px 8px;
      }
      .sakuraCheckerEmbed thead {
        background: #efefef;
      }
      .sakuraCheckerEmbed .loading {
        font-style: italic;
        color: #888;
      }
    `;
    document.head.appendChild(style);
  }

  function getJudgmentColor(judgment) {
    if (/危険/.test(judgment)) return '#e74c3c';
    if (/警告/.test(judgment)) return '#f39c12';
    if (/確認/.test(judgment)) return '#2980b9';
    if (/安全/.test(judgment)) return '#2ecc71';
    return '#999';
  }

  function getScoreColor(scoreStr) {
    const score = parseInt(scoreStr);
    if (isNaN(score)) return '#999';
    if (score >= 80) return '#c0392b';
    if (score >= 60) return '#f39c12';
    if (score >= 20) return '#2980b9';
    return '#27ae60';
  }

  function decodeEmbeddedScript(scriptText) {
    try {
      const match = scriptText.match(/['"]([A-Za-z0-9+/=]+)['"]/);
      if (!match) return null;
      const base64 = match[1];
      const decodedHTML = decodeURIComponent(atob(base64));
      const container = document.createElement('div');
      container.innerHTML = decodedHTML;
      return container.querySelector('.c100')?.parentElement || null;
    } catch (_) {
      return null;
    }
  }

  function extractTotalScoreFromLv(doc) {
    const img = doc.querySelector('.image.sakura-rating img[src*="lv"]');
    const m = img?.src.match(/lv(\d{2,3})\.png/);
    if (!m) return null;
    const n = m[1] === '100' ? '99' : String(parseInt(m[1], 10));
    return `${n}%`;
  }

  function decodeSummaryScoreFromScript(doc) {
    const scripts = Array.from(doc.querySelectorAll('.sakuraBlock script'));
    for (const script of scripts) {
      const m = script.textContent.match(/['"]([A-Za-z0-9+/=]+)['"]/);
      if (!m) continue;
      try {
        const decoded = decodeURIComponent(atob(m[1]));
        const tmp = document.createElement('div');
        tmp.innerHTML = decoded;
        const img = tmp.querySelector('.image.sakura-rating img[src*="lv"]');
        const mm = img?.getAttribute('src')?.match(/lv(\d{1,3})\.png/);
        if (mm) {
          const n = mm[1] === '100' ? 99 : parseInt(mm[1], 10);
          return `${n}%`;
        }
      } catch (_) {}
    }
    return null;
  }

  function extractAnalysisDate(doc) {
    const p = doc.querySelector('.has-text-centered p');
    if (!p) return null;
    const m = p.textContent.match(/この製品情報は(\d{4}年\d+月\d+日)/);
    return m ? m[1] : null;
  }

  function createLoadingCard(asin, message) {
    injectStyles();
    const div = document.createElement('div');
    div.className = 'sakuraCheckerEmbed a-box a-spacing-base loading';
    div.setAttribute('data-asin', asin);
    div.innerHTML = `<div class="loading">🔄 ${message}</div>`;
    return div;
  }

  function createErrorCard(asin, message) {
    injectStyles();
    const div = document.createElement('div');
    div.className = 'sakuraCheckerEmbed a-box a-spacing-base';
    div.setAttribute('data-asin', asin);
    div.innerHTML = `<div style="color:red;">❌ ${message}</div>`;
    return div;
  }

  function createCard(data, asin) {
    injectStyles();
    const wrapper = document.createElement('div');
    wrapper.className = 'sakuraCheckerEmbed a-box a-spacing-base';
    wrapper.setAttribute('data-asin', asin);

    const chartRows = data.chartData.map(row => `
      <tr>
        <td>${row.category}</td>
        <td style="font-weight: bold; color: ${getScoreColor(row.score)};">${row.score}</td>
        <td style="color: ${getJudgmentColor(row.label)};">${row.label}</td>
      </tr>
    `).join('');

    const footer = `
      <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
        <a href="${data.link}" target="_blank" style="color: #0073e6; text-decoration: underline;">▶ サクラチェッカーで詳細を見る</a>
        ${data.analysisDate ? `<div style="color: #666; margin-right: 3px;">（${data.analysisDate} 時点の情報）</div>` : ''}
      </div>
    `;

    wrapper.innerHTML = `
      <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px;">🔍 サクラチェッカー簡易分析</div>
      <div><strong>全体サクラ度：</strong><span style="font-weight: bold; color: ${parseInt(data.summaryScore) >= 60 ? '#e74c3c' : '#2ecc71'}; font-size: 16px;">${data.summaryScore}</span></div>
      <table>
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>スコア</th>
            <th>判定</th>
          </tr>
        </thead>
        <tbody>${chartRows}</tbody>
      </table>
      ${footer}
    `;
    return wrapper;
  }

  async function fetchSakuraData(asin, container) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://sakura-checker.jp/search/${asin}`,
      onload: (res) => {
        try {
          const doc = new DOMParser().parseFromString(res.responseText, 'text/html');

          let summaryScore = doc.querySelector('.item-rating span')?.textContent.match(/(\d{1,3})%/)?.[1];
          if (!summaryScore) {
            summaryScore = extractTotalScoreFromLv(doc) || decodeSummaryScoreFromScript(doc) || '？';
          }

          const chartData = Array.from(doc.querySelectorAll('.chartBlock script')).map(script => {
            const container = decodeEmbeddedScript(script.textContent);
            const circle = script.parentElement;
            if (!container) return null;
            return {
              score: container.querySelector('span')?.textContent?.trim() || '？',
              label: container.querySelector('.label img')?.getAttribute('alt') || '？',
              category: circle.querySelector('.caption a')?.textContent?.trim() || '？'
            };
          }).filter(Boolean);

          const analysisDate = extractAnalysisDate(doc);

          const data = { summaryScore, chartData, analysisDate, link: `https://sakura-checker.jp/search/${asin}` };
          container.replaceWith(createCard(data, asin));
        } catch (e) {
          console.error('[fetchSakuraData] パース失敗:', e);
          container.replaceWith(createErrorCard(asin, '情報の解析に失敗しました'));
        }
      },
      onerror: () => {
        container.replaceWith(createErrorCard(asin, '情報の取得に失敗しました'));
      }
    });
  }

  function hasAlreadyInserted(asin) {
    return document.querySelector(`.sakuraCheckerEmbed[data-asin="${asin}"]`);
  }

  function getInsertTarget() {
    return document.getElementById('averageCustomerReviews_feature_div')
        || document.querySelector('#reviewsMedley')
        || document.querySelector('#centerCol')
        || document.querySelector('#dp')
        || null;
  }

  async function tryInsert(asin, attempt = 0) {
    if (hasAlreadyInserted(asin)) return;

    const target = getInsertTarget();
    if (!target) {
      if (attempt < MAX_RETRIES) {
        setTimeout(() => tryInsert(asin, attempt + 1), CHECK_INTERVAL);
      }
      return;
    }

    const loading = createLoadingCard(asin, 'サクラチェッカー情報を取得中...');
    target.insertAdjacentElement('afterend', loading);
    await fetchSakuraData(asin, loading);
  }

  function onPageChangeDebounced() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const asin = getASIN();
      if (!asin || asin === currentASIN) return;
      currentASIN = asin;
      tryInsert(asin);
    }, DEBOUNCE_TIME);
  }

  const observerTarget = document.getElementById('dp-container') || document.body;
  const observer = new MutationObserver(onPageChangeDebounced);
  observer.observe(observerTarget, { childList: true, subtree: true });
  window.addEventListener('load', onPageChangeDebounced);
})();
