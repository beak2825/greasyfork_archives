// ==UserScript==
// @name         Nico Mylist Rate (2025 New Design)
// @namespace    https://example.com/
// @version      0.4.1
// @description  ニコニコ動画検索結果にマイリスト率を表示（新デザイン対応・HTTPS対応・自動再計算）
// @match        *://www.nicovideo.jp/*
// @match        *://nico.ms/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536073/Nico%20Mylist%20Rate%20%282025%20New%20Design%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536073/Nico%20Mylist%20Rate%20%282025%20New%20Design%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 共通ユーティリティ ---------- */
  function parseNumJP(raw) {
    // カンマ除去 & 単位（万・億）対応
    raw = raw || '';
    const s = raw.replace(/,/g, '').trim();
    if (s.endsWith('億')) return parseFloat(s) * 1e8;
    if (s.endsWith('万')) return parseFloat(s) * 1e4;
    return parseFloat(s) || 0;
  }

  function colorByRate(rate) {
    if (rate >= 6) return '#FF0000';// 赤
    if (rate >= 4) return '#0000FF'; // 青
    if (rate > 2) return '#87CEFA'; // 薄い青
    return '#393F3F'; // グレー
  }

  function createBadge(rate) {
    const badge = document.createElement('span');
    badge.textContent = ' Mylist率 ' + rate.toFixed(1) + '%';
    badge.style.cssText =
      'margin-left:6px;font-size:12px;font-weight:bold;color:' +
      colorByRate(rate) + ';';
    return badge;
  }

  /* ---------- 1) 検索／タグ結果 (.item) ---------- */
  function handleSearchItems(root) {
    root.querySelectorAll('li.item:not([data-mylist-checked])').forEach(function (item) {

      var viewEl = item.querySelector('li.count.view   .value');
      var mylistEl = item.querySelector('li.count.mylist .value');
      var view = parseNumJP(viewEl ? viewEl.textContent : '');
      var mylis = parseNumJP(mylistEl ? mylistEl.textContent : '');

      if (view) {
        var badge = createBadge((mylis / view) * 100);

        var listEl = item.querySelector('.itemData ul.list');
        if (listEl) {
          listEl.appendChild(badge);
        }
      }
      item.dataset.mylistChecked = '1';
    });
  }

  /* ---------- 2) マイリスト一覧 (.NC-系カード) ---------- */
  function handleMylistCards(root) {
    root.querySelectorAll('.NC-MediaObject-bodySecondary:not([data-mylist-rate])')
      .forEach(function (card) {

        var viewEl = card.querySelector('.NC-VideoMetaCount_view');
        var mylistEl = card.querySelector('.NC-VideoMetaCount_mylist');
        var view = parseNumJP(viewEl ? viewEl.textContent : '');
        var mylis = parseNumJP(mylistEl ? mylistEl.textContent : '');

        if (view) {
          var badge = createBadge((mylis / view) * 100);

          var metaCount = card.querySelector('.NC-VideoMediaObject-metaCount');
          if (metaCount) {
            metaCount.appendChild(badge);
          }
        }
        card.dataset.mylistRate = '1';
      });
  }

  /* ---------- 3) 初回 & MutationObserver ---------- */
  function injectAll(target) {
    target = target || document;
    handleSearchItems(target);
    handleMylistCards(target);
  }

  var obs = new MutationObserver(function (muts) {
    muts.forEach(function (m) { injectAll(m.target); });
  });
  obs.observe(document.body, { childList: true, subtree: true });

  injectAll(); // 初回実行
})();

