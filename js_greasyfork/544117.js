// ==UserScript==
// @name         動画ページに飛ばずにワンクリックでマイリス登録
// @namespace    https://chat.openai.com/
// @license      MIT
// @version      1.2
// @description  ニコニコ動画の検索結果ページやランキングページにマイリストボタンを追加
// @match        https://www.nicovideo.jp/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544117/%E5%8B%95%E7%94%BB%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E9%A3%9B%E3%81%B0%E3%81%9A%E3%81%AB%E3%83%AF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E7%99%BB%E9%8C%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/544117/%E5%8B%95%E7%94%BB%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E9%A3%9B%E3%81%B0%E3%81%9A%E3%81%AB%E3%83%AF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E7%99%BB%E9%8C%B2.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const headers = {
    "x-frontend-id": "6",
    "x-request-with": "https://www.nicovideo.jp"
  };
  const postHeaders = {
    "x-frontend-id": "23",
    "x-request-with": "N-garage"
  };

  async function getMylists() {
    try {
      const res = await fetch("https://nvapi.nicovideo.jp/v1/users/me/mylists", {
        headers,
        credentials: "include"
      });
      const json = await res.json();
      return json.data.mylists || [];
    } catch (e) {
      alert("マイリスト一覧の取得に失敗しました。ログイン状態を確認してください。");
      return [];
    }
  }

  async function showSelectionDialog() {
    const lists = await getMylists();
    if (!lists.length) {
      alert("マイリストがありません。");
      return;
    }

    const currentId = GM_getValue("MYLIST_ID", null);
    lists.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = isDark ? '#1e1e1e' : '#ffffff';
    const textColor = isDark ? '#f0f0f0' : '#000000';
    const borderColor = isDark ? '#444' : '#ccc';
    const buttonBg = isDark ? '#333' : '#eee';
    const buttonText = isDark ? '#fff' : '#000';

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const modal = document.createElement("div");
    modal.style.cssText = `
      background: ${bgColor};
      color: ${textColor};
      padding: 30px;
      border-radius: 10px;
      max-height: 85vh;
      overflow-y: auto;
      width: 515px;
      font-size: 18px;
      box-shadow: 0 0 15px rgba(0,0,0,0.4);
      border: 1px solid ${borderColor};
    `;
    modal.innerHTML = `<h3 style="margin-bottom: 20px; font-size: 24px;">登録先マイリストを選択</h3>`;

    const form = document.createElement("form");
    lists.forEach((list, i) => {
      const checked = (String(list.id) === String(currentId)) ? "checked" : "";
      const label = document.createElement("label");
      label.style.cssText = `display: block; margin: 10px 0; cursor: pointer;`;
      label.innerHTML = `
        <input type="radio" name="mylist" value="${i}" ${checked} style="transform: scale(1.3); margin-right: 10px;">
        ${list.name}
      `;
      form.appendChild(label);
    });

    const unsetLabel = document.createElement("label");
    unsetLabel.style.cssText = `display: block; margin: 20px 0 0; cursor: pointer;`;
    unsetLabel.innerHTML = `
      <input type="radio" name="mylist" value="-1" ${currentId === null ? "checked" : ""} style="transform: scale(1.3); margin-right: 10px;">
      未設定
    `;
    form.appendChild(unsetLabel);

    const buttonArea = document.createElement("div");
    buttonArea.style.cssText = `margin-top: 30px; text-align: right;`;
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "submit";
    confirmBtn.textContent = "保存";
    confirmBtn.style.cssText = `background: ${buttonBg}; color: ${buttonText}; border: 1px solid ${borderColor}; padding: 8px 16px; font-size: 16px; border-radius: 6px; cursor: pointer;`;
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "キャンセル";
    cancelBtn.style.cssText = `margin-left: 15px; background: ${buttonBg}; color: ${buttonText}; border: 1px solid ${borderColor}; padding: 8px 16px; font-size: 16px; border-radius: 6px; cursor: pointer;`;
    buttonArea.appendChild(confirmBtn);
    buttonArea.appendChild(cancelBtn);
    form.appendChild(buttonArea);
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    form.onsubmit = (e) => {
      e.preventDefault();
      const sel = form.mylist.value;
      if (sel === undefined || sel === "") return;
      if (sel === "-1") {
        GM_setValue("MYLIST_ID", null);
        GM_setValue("MYLIST_NAME", null);
      } else {
        const idx = parseInt(sel, 10);
        GM_setValue("MYLIST_ID", lists[idx].id);
        GM_setValue("MYLIST_NAME", lists[idx].name);
      }
      modal.innerHTML = `<p id="reload-message" style="font-size: 18px; color: white;">設定を保存しました。ページを再読み込みします</p>`;
      const msg = document.getElementById("reload-message");
      const dots = ["", "…", "……", "………"];
      let step = 0;
      const interval = setInterval(() => {
        msg.textContent = "設定を保存しました。ページを再読み込みします" + dots[step];
        step++;
        if (step > 3) {
          clearInterval(interval);
          location.reload();
        }
      }, 200);
    };
    cancelBtn.onclick = () => document.body.removeChild(overlay);
  }

  let MYLIST_ID = GM_getValue("MYLIST_ID", null);
  let mylistVideoIds = new Set();
  let videoIdCounts = new Map();

  async function fetchAllMylistItems() {
    if (!MYLIST_ID) return;
    const maxPages = 250, pageSize = 100, concurrency = 20;
    const results = [];
    const pages = Array.from({ length: maxPages }, (_, i) => i + 1);
    for (let i = 0; i < pages.length; i += concurrency) {
      const batch = pages.slice(i, i + concurrency);
      const out = await Promise.all(batch.map(async p => {
        try {
          const res = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${MYLIST_ID}?page=${p}&pageSize=${pageSize}`, { headers, credentials: "include" });
          const json = await res.json();
          const items = json.data.mylist?.items || [];
          results.push(...items.map(item => item.watchId));
          if (!json.data.mylist?.hasNext) return "end";
        } catch (e) {}
        return false;
      }));
      if (out.includes("end")) break;
    }
    mylistVideoIds = new Set(results);
  }

  async function addToMylist(videoId) {
    if (!MYLIST_ID) return false;
    try {
      const res = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${MYLIST_ID}/items?itemId=${videoId}&description=`, {
        method: "POST", headers: postHeaders, credentials: "include"
      });
      return res.status === 201 || res.status === 200 || res.status === 409;
    } catch (e) {
      return false;
    }
  }

  async function removeFromMylist(videoId) {
    if (!MYLIST_ID) return false;
    try {
      const res = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/mylists/${MYLIST_ID}/items/${videoId}`, {
        method: "DELETE", headers: postHeaders, credentials: "include"
      });
      return res.status === 200 || res.status === 204;
    } catch (e) {
      return false;
    }
  }

  function markAsUnregistered(btn, videoId) {
    btn.textContent = "⭐マイリス";
    btn.disabled = false;
    btn.style.backgroundColor = "gold";
    btn.style.color = "#000000";
    btn.style.border = "1px solid #000000";
    btn.style.cursor = "pointer";
    btn.onclick = null;
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.disabled = true;
      btn.textContent = "送信中…";
      const success = await addToMylist(videoId);
      if (success) {
        markAsRegistered(btn, videoId);
        mylistVideoIds.add(videoId);
      } else {
        btn.textContent = "❌失敗";
        btn.disabled = false;
        btn.style.backgroundColor = "#f66";
        setTimeout(() => {
          markAsUnregistered(btn, videoId);
        }, 3000);
      }
    }, { once: true });
  }

  function markAsRegistered(btn, videoId) {
    btn.textContent = "✔登録済み";
    btn.disabled = false;
    btn.style.backgroundColor = "#aaa";
    btn.style.color = "#666666";
    btn.style.cursor = "pointer";
    btn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.disabled = true;
      btn.textContent = "解除中…";
      const success = await removeFromMylist(videoId);
      if (success) {
        mylistVideoIds.delete(videoId);
        markAsUnregistered(btn, videoId);
      } else {
        btn.textContent = "❌失敗";
        btn.style.backgroundColor = "#f66";
        setTimeout(() => {
          markAsRegistered(btn, videoId);
        }, 3000);
      }
    };
  }

  function injectButtons() {
    if (!MYLIST_ID) return;
    if (document.querySelector('.TopPage')) return;

    const allowed = (
      location.href.startsWith("https://www.nicovideo.jp/user") ||
      location.href.startsWith("https://www.nicovideo.jp/tag") ||
      location.href.startsWith("https://www.nicovideo.jp/search") ||
      location.href.startsWith("https://www.nicovideo.jp/ranking")
    );
    if (!allowed) return;

    if (!document.querySelector('[data-mylist-checked]')) {
      videoIdCounts.clear();
    }

    const selectors = [
      'a[href^="/watch/"]:not([data-mylist-checked])',
      'a[href*="/watch/"]:not([data-mylist-checked])'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(a => {
        if (a.href.includes("https://news.nicovideo.jp/watch/")) return;
        if (a.closest(".d_flex.flex-d_column.p_x2.bdr_m.bg-c_layer.surfaceHighEm.gap_x2")) {
          return;
        }

        const match = a.href.match(/\/watch\/([a-z]{2}\d+)/);
        if (!match) return;

        const videoId = match[1];
        a.dataset.mylistChecked = "1";

        const currentCount = videoIdCounts.get(videoId) || 0;
        videoIdCounts.set(videoId, currentCount + 1);

        const btn = document.createElement("button");
        btn.dataset.mylistBtn = "1";
        btn.textContent = "確認中…";
        btn.style.cssText = `
          display: block;
          margin-top: 8px;
          padding: 2px 6px;
          font-size: 12px;
          background-color: #ccc;
          border: 1px solid #000000;
          border-radius: 3px;
          cursor: default;
          width: fit-content;
          z-index: 1000;
        `;
        btn.disabled = true;

        const container = a.closest("article, li, div, tr, .item, .video-item, .VideoItem, .MylistItem, .SeriesItem");

        if (location.pathname.startsWith('/ranking')) {
          // ランキングは動画の下にボタン追加
          if (container) {
            container.appendChild(btn);
          } else {
            a.parentNode.appendChild(btn);
          }
        } else {
          // それ以外は従来の位置に追加
          let insertLocation = null;
          const possibleTargets = [
            container?.querySelector(".VideoItem-description, .Description, .CardDescription"),
            container?.querySelector(".video-description, .item-description"),
            container?.querySelector(".title, .video-title"),
            container?.querySelector(".meta, .metadata, .info"),
            container?.querySelector(".thumbnail-container"),
            a.parentNode
          ];
          for (const target of possibleTargets) {
            if (target && target.parentNode) {
              insertLocation = target;
              break;
            }
          }

          if (insertLocation) {
            if (insertLocation.tagName === 'DIV' || insertLocation.tagName === 'P') {
              insertLocation.insertAdjacentElement("afterend", btn);
            } else {
              insertLocation.parentNode.appendChild(btn);
            }
          } else {
            a.parentNode.appendChild(btn);
          }
        }

        if (mylistVideoIds.has(videoId)) {
          markAsRegistered(btn, videoId);
        } else {
          markAsUnregistered(btn, videoId);
        }
      });
    });

    // 不要なマイリスボタン削除
    document.querySelectorAll(
      '.SeriesDetailContainer-header button[data-mylist-btn], .VideoContainer-header button[data-mylist-btn]'
    ).forEach(btn => btn.remove());

    if (/^\/user\/\d+\/mylist\/\d+/.test(location.pathname)) {
      document.querySelectorAll('button[data-mylist-btn]').forEach(btn => {
        if (!btn.closest('.VideoMediaObjectList')) {
          btn.remove();
        }
      });
    }

    document.querySelectorAll('.common-header-b0fi24 button[data-mylist-btn]').forEach(btn => btn.remove());
  }

  async function init() {
    GM_registerMenuCommand("登録先マイリスト設定", showSelectionDialog);
    if (!MYLIST_ID) return;
    await fetchAllMylistItems();
    injectButtons();

    new MutationObserver(() => {
      setTimeout(injectButtons, 100);
    }).observe(document.body, { childList: true, subtree: true });
  }

  init();

})();