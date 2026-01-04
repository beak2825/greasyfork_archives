// ==UserScript==
// @name         楽天市場の商品タイトルを全文表示【Ajax対応】
// @name:ja      楽天市場の商品タイトルを全文表示【Ajax対応】
// @name:en      Show Full Product Titles on Rakuten Ichiba
// @name:zh-CN   显示完整的乐天商品标题（修复省略问题）
// @name:zh-TW   顯示完整的樂天商品標題（解決省略問題）
// @name:ko      라쿠텐 상품 전체 제목 표시 (잘림 문제 해결)
// @name:es      Mostrar títulos completos en Rakuten (Solución al truncamiento)
// @name:fr      Afficher le titre complet des produits Rakuten (Correction du troncage)
// @name:de      Vollständige Produkttitel auf Rakuten anzeigen (Trunkierung beheben)
// @namespace    https://github.com/koyasi777/rakuten-full-title
// @version      2.3
// @description 楽天市場の商品タイトルが「…」で省略される問題を修正し、すべて表示します。Ajax動的ページにも対応し、視認性アップ！
// @description:en Fixes truncated Rakuten product titles ("..."). Displays full names, AJAX-compatible, improves readability.
// @description:zh-CN 解决乐天商品标题被“...”省略的问题，支持AJAX页面加载，提升可读性。
// @description:zh-TW 解決樂天商品標題被“...”省略的問題，支援AJAX載入，提升可讀性。
// @description:ko 라쿠텐 상품 제목이 '...'으로 생략되는 문제를 해결하고 AJAX 페이지에서도 작동. 가독성 향상.
// @description:es Corrige el problema de truncamiento de títulos en Rakuten. Compatible con AJAX y mejora la legibilidad.
// @description:fr Corrige les titres tronqués sur Rakuten. Prise en charge d’AJAX et amélioration de la lisibilité.
// @description:de Behebt das Problem mit abgeschnittenen Produkttiteln auf Rakuten. AJAX-kompatibel und bessere Lesbarkeit.
// @author       koyasi777
// @match        https://search.rakuten.co.jp/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/rakuten-full-title
// @supportURL   https://github.com/koyasi777/rakuten-full-title/issues
// @icon         https://corp.rakuten.co.jp/about/assets/img/brand_story/circle_logo.svg
// @downloadURL https://update.greasyfork.org/scripts/533004/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%E3%81%AE%E5%95%86%E5%93%81%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E5%85%A8%E6%96%87%E8%A1%A8%E7%A4%BA%E3%80%90Ajax%E5%AF%BE%E5%BF%9C%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533004/%E6%A5%BD%E5%A4%A9%E5%B8%82%E5%A0%B4%E3%81%AE%E5%95%86%E5%93%81%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E5%85%A8%E6%96%87%E8%A1%A8%E7%A4%BA%E3%80%90Ajax%E5%AF%BE%E5%BF%9C%E3%80%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
/* 商品タイトルリンクの省略解除 */
a[class*="title-link"] {
  display: block !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  max-height: none !important;
  height: auto !important;
  line-height: 1.5 !important;
}

/* タイトル全体を囲むh2やdivの制限を解除 */
[class*="title-link-wrapper"],
[class*="title--"],
[class*="title-link-wrapper-grid"] {
  display: block !important;
  white-space: normal !important;
  max-height: none !important;
  height: auto !important;
  overflow: visible !important;
}

/* Flexbox の幅制限を解除 */
.searchresultitem, .searchresultitem * {
  min-width: 0 !important;
}
`;

  // スタイル挿入
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 再描画にも対応（変更されていない要素だけ処理）
  const applyFix = () => {
    const links = document.querySelectorAll('a[class*="title-link"]:not([data-fulltitle])');
    links.forEach(link => {
      link.style.whiteSpace = 'normal';
      link.style.overflow = 'visible';
      link.style.textOverflow = 'unset';
      link.style.maxHeight = 'none';
      link.style.height = 'auto';
      link.setAttribute('data-fulltitle', 'true');
    });
  };

  const observer = new MutationObserver(applyFix);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 初回実行
  applyFix();
})();
