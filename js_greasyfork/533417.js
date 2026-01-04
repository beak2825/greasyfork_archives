// ==UserScript==
// @name            Pixiv Show bookmark count (kmikrt_Custom)
// @name:ja        Pixiv ブックマーク数表示
// @version         0.63(ノベルページスキップ追加)
// @match           https://www.pixiv.net/*
// @namespace       https://greasyfork.org/users/7945
// @description     検索ページ、作者作品一覧ページ、ランキングページ、トップページにて各イラストのブックマーク数を表示します。
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/533417/Pixiv%20Show%20bookmark%20count%20%28kmikrt_Custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533417/Pixiv%20Show%20bookmark%20count%20%28kmikrt_Custom%29.meta.js
// ==/UserScript==

// ▼ すでにブクマ数が表示されている要素（再度追加しないように除外するためのセレクタ）
const done = '.bmcount, .bookmark-count, a[href*="/bookmark_detail.php?illust_id="]';

// ▼ 各ページごとの作品カード要素セレクタ群
const selectors = [
'li.p-0.list-none.overflow-hidden.col-span-2:not([data-dummybmc])', // indexページおすすめ作品（小説含む）
'li.sc-65a6134-1:not([data-dummybmc])', // indexページ下部公式特集などのリスト
'.ranking-item:not([data-dummybmc])', // ランキングページ
'li.sc-1864c03c-0:not([data-dummybmc])', // マンガページのフォローユーザー・マイピクの投稿作品一覧／おすすめ作品
'div.sc-fab8f26d-5:not([data-dummybmc])', // イラストページのフォローユーザー投稿・ランキング部分など
'div.sc-20901cd2-3:not([data-dummybmc])', // マンガページの編集部おすすめ
'#__next div.sc-1e6e6d57-0.gQkIQm.__top_side_menu_body ul > li:not([data-dummybmc])',
'li.sc-bf8cea3f-2:not([data-dummybmc])', // ブックマークページ
'li.sc-98699d11-2:not([data-dummybmc])', // 検索ページ
'div.sc-1453b7f5-2:not([data-dummybmc])', // 各ページのリクエスト欄
'li.w-col-span-3.list-none.p-16.h-fit:not([data-dummybmc])', // 新ランキングページ
];

// ▼ ノベルページ判定関数
function isNovelPage() {
  const path = location.pathname.toLowerCase();
  // /artworks を含まなければノベル専用ページと判定
  if (path.includes("/novel") && !path.includes("/artworks")) return true;
  return false;
}

// ▼ ブックマーク数表示用のCSSスタイルを追加
function addStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .bmcount, .topbmcount {
      text-align: center !important;
      padding-bottom: 20px !important;
    }
    .bmcount a, .topbmcount {
      display: inline-block !important;
      height: initial !important;
      width: initial !important;
      border-radius: 3px !important;
      padding: 3px 6px 3px 18px !important;
      font-size: 12px !important;
      font-weight: bold !important;
      text-decoration: none !important;
      color: #0069b1 !important;
      background-color: #cef !important;
      background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'><path fill='%230069B1' d='M9,1 C10.6568542,1 12,2.34314575 12,4 C12,6.70659075 10.1749287,9.18504759 6.52478604,11.4353705 L6.52478518,11.4353691 C6.20304221,11.6337245 5.79695454,11.6337245 5.4752116,11.4353691 C1.82507053,9.18504652 0,6.70659017 0,4 C1.1324993e-16,2.34314575 1.34314575,1 3,1 C4.12649824,1 5.33911281,1.85202454 6,2.91822994 C6.66088719,1.85202454 7.87350176,1 9,1 Z'/></svg>") !important;
      background-position: center left 6px !important;
      background-repeat: no-repeat !important;
    }
    button[data-ga4-label="bookmark_button"] {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
    }
  `;
  document.head.appendChild(style);
}
addStyle();

// ▼ 対象要素にブックマーク数を追加する共通関数（修正済み）
async function addBookmarkCount(target, buttonMode = false) {
  // ノベルページの場合は処理スキップ
  if (isNovelPage()) return;

  // すでに処理済み → スキップ
  if (!target || target.hasAttribute("data-dummybmc")) return;

  // 親が data-dummybmc の場合（clone でコピーされたパターン）もスキップ
  if (target.parentElement?.hasAttribute("data-dummybmc")) return;

  // 処理済みフラグ付与（最上位ターゲットのみ）
  target.setAttribute("data-dummybmc", "1");

  const link = target.querySelector('a[href*="/artworks/"], a[href*="/novel/"]');
  const id = /\d+/.exec(link?.href)?.[0];
  const isNovel = link?.href.includes('/novel/');

  if (!id || target.querySelector(done)) return;

  try {
    const apiUrl = isNovel
      ? `https://www.pixiv.net/ajax/novel/${id}`
      : `https://www.pixiv.net/ajax/illust/${id}`;

    const res = await fetch(apiUrl, { credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const bmcount = json.body?.bookmarkCount;

    if (!bmcount) return;

    if (buttonMode) {
      const button = target.querySelector('button[data-ga4-label="bookmark_button"]');
      if (button && !button.querySelector('.topbmcount')) {
        const span = document.createElement('span');
        span.className = 'topbmcount';
        span.textContent = bmcount;
        button.appendChild(span);
      }
    } else {
      if (!target.querySelector('.bmcount')) {
        target.insertAdjacentHTML("beforeend",
          `<div class="bmcount">
            <a href="/bookmark_detail.php?illust_id=${id}">${bmcount}</a>
          </div>`
        );
      }
    }

    target.setAttribute("data-bmcount", bmcount);
  } catch (e) {
    console.error("Bookmark fetch error:", e);
  }
}

// ▼ トップページ用の監視・処理（修正済み）
function observeTopPage() {
  new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;

        const targets = [];

        if (node.matches?.('div[data-ga4-label="work_content"]:not([data-topbmcount])') &&
            !node.hasAttribute("data-dummybmc")) {
          targets.push(node);
        }

        node.querySelectorAll?.('div[data-ga4-label="work_content"]:not([data-topbmcount])')
            .forEach(el => {
              if (!el.hasAttribute("data-dummybmc")) targets.push(el);
            });

        targets.forEach(target => {
          target.dataset.topbmcount = "";
          addBookmarkCount(target, true);
        });
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('div[data-ga4-label="work_content"]:not([data-topbmcount])')
    .forEach(target => {
      target.dataset.topbmcount = "";
      addBookmarkCount(target, true);
    });
}

// ▼ 通常ページ用の監視・処理（修正済み）
function observeNormalPage() {
  const selector = selectors.join(',');

  new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;

        const targets = [];

        if (node.matches?.(selector) && !node.hasAttribute("data-dummybmc")) {
          targets.push(node);
        }

        node.querySelectorAll?.(selector).forEach(el => {
          if (!el.hasAttribute("data-dummybmc")) targets.push(el);
        });

        targets.forEach(target => addBookmarkCount(target, false));
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll(selector)
    .forEach(target => addBookmarkCount(target, false));
}

// ▼ ページパス監視
function monitorPageChange() {
  let currentPath = location.pathname;

  setInterval(() => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      if (currentPath === "/") {
        observeTopPage();
      }
    }
  }, 500);
}

// ▼ 初期処理
observeNormalPage();
if (location.pathname === "/") {
  observeTopPage();
}
monitorPageChange();
