// ==UserScript==
// @name         無視設定管理機能
// @namespace    無視設定管理機能
// @version      2.0
// @description  おんjで無視設定を管理。
// @author       Wai
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528641/%E7%84%A1%E8%A6%96%E8%A8%AD%E5%AE%9A%E7%AE%A1%E7%90%86%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528641/%E7%84%A1%E8%A6%96%E8%A8%AD%E5%AE%9A%E7%AE%A1%E7%90%86%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

(function(){
  "use strict";

  // Local Storageから無視IDを取得（例："AAAA<D>BBBB<D>CCCC"）
  function getIgnoredIDs() {
    const data = localStorage.getItem("ignv4livejupiter");
    if(data){
      const ids = data.split("<D>");
      return ids.filter(id => /^[A-Za-z0-9]{4}$/.test(id));
    }
    return [];
  }

  // 指定のIDをLocal Storageから削除して更新する
  function removeIgnoredID(id) {
    let ids = getIgnoredIDs();
    ids = ids.filter(item => item !== id);
    localStorage.setItem("ignv4livejupiter", ids.join("<D>"));
    // DOM上で該当レスが再表示されるようにフィルターを再適用
    applyIgnoreFilter();
  }

  // すべての無視設定をクリアする
  function clearAllIgnoredIDs() {
    localStorage.removeItem("ignv4livejupiter");
    // フィルターを再適用して、すべてのレスが表示されるように
    applyIgnoreFilter();
  }

  // 無視設定に基づいて各投稿の表示状態を更新する関数
  function applyIgnoreFilter() {
    const ignored = getIgnoredIDs();
    // 対象投稿は<li>要素（属性uidがある場合）または従来の<div class="res">の場合も考慮
    const posts = document.querySelectorAll("li[uid], div.res");
    posts.forEach(post => {
      let uid = null;
      if(post.hasAttribute("uid")){
        uid = post.getAttribute("uid").trim();
      } else {
        const uidElem = post.querySelector(".uid");
        if(uidElem){
          uid = uidElem.textContent.trim();
        }
      }
      if(uid){
        if(ignored.includes(uid)){
          post.style.display = "none";
        } else {
          post.style.display = "";
          // 子要素に直接設定された display:none を解除
          post.querySelectorAll("*").forEach(el => {
            if(el.style.display === "none"){
              el.style.display = "";
            }
          });
        }
      }
    });
  }

  // MutationObserverで新規レスを監視し、applyIgnoreFilter()を呼ぶ
  function setupMutationObserver() {
    let container = document.querySelector("#thread");
    if(!container){
      container = document.body;
    }
    const observer = new MutationObserver((mutations) => {
      applyIgnoreFilter();
    });
    observer.observe(container, {childList: true, subtree: true});
  }

  // 無視設定管理モーダル作成（コンパクト版）
  function createModal() {
    // オーバーレイ作成
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.3)";
    overlay.style.zIndex = "1000";

    // モーダル本体（サイズ縮小）
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "10px";
    modal.style.border = "1px solid #ccc";
    modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    modal.style.minWidth = "240px";
    modal.style.maxWidth = "320px";
    modal.style.zIndex = "1001";
    modal.style.position = "relative";

    // タイトル
    const title = document.createElement("h3");
    title.textContent = "無視設定管理";
    title.style.fontSize = "16px";
    title.style.margin = "0 0 10px";
    modal.appendChild(title);

    // 右上のcloseOption風クローズアイコン
    const closeIcon = document.createElement("a");
    closeIcon.className = "closeOption";
    closeIcon.href = "#";
    closeIcon.style.position = "absolute";
    closeIcon.style.right = "2px";
    closeIcon.style.top = "2px";
    closeIcon.style.color = "white";
    closeIcon.style.fontSize = "11pt";
    closeIcon.innerHTML = '<i class="fas fa-window-close"></i>';
    closeIcon.addEventListener("click", function(e){
      e.preventDefault();
      if(overlay.parentNode){
        overlay.parentNode.removeChild(overlay);
      }
    });
    modal.appendChild(closeIcon);

    // 無視ID一覧表示用コンテナ（フレックスボックスで4列レイアウト）
    const listContainer = document.createElement("div");
    listContainer.style.marginTop = "10px";
    listContainer.style.display = "flex";
    listContainer.style.flexWrap = "wrap";
    listContainer.style.gap = "5px";
    listContainer.style.justifyContent = "flex-start";  // 左揃え
    modal.appendChild(listContainer);

    function refreshList() {
      listContainer.innerHTML = "";
      const ids = getIgnoredIDs();
      if(ids.length === 0){
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "設定されたIDはありません。";
        listContainer.appendChild(emptyMsg);
      } else {
        // 各IDブロック（横幅25%で4列）
        ids.forEach(id => {
          const idBlock = document.createElement("div");
          idBlock.style.width = "22%";  // 横幅を少し調整して収める
          idBlock.style.boxSizing = "border-box";
          idBlock.style.display = "flex";
          idBlock.style.alignItems = "center";
          idBlock.style.justifyContent = "center";
          idBlock.style.border = "1px solid #ccc";
          idBlock.style.padding = "2px";
          idBlock.style.fontSize = "12px";  // フォントサイズを少し小さく
          idBlock.textContent = id + " ";
          // 削除ボタン（×）
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "×";
          removeBtn.style.cursor = "pointer";
          removeBtn.style.fontSize = "10px";
          removeBtn.addEventListener("click", function(){
            removeIgnoredID(id);
            refreshList();
          });
          idBlock.appendChild(removeBtn);
          listContainer.appendChild(idBlock);
        });
      }
      // フィルター再適用して解除済みIDの投稿が表示されるよう更新
      applyIgnoreFilter();
    }
    refreshList();

    // 「全クリア」ボタン
    const clearButton = document.createElement("button");
    clearButton.textContent = "全クリア";
    clearButton.style.position = "absolute";
    clearButton.style.bottom = "10px";
    clearButton.style.right = "10px";
    clearButton.style.fontSize = "12px";
    clearButton.addEventListener("click", function(){
      if(confirm("すべての無視設定を解除しますか？")){
        clearAllIgnoredIDs();
        refreshList();
      }
    });
    modal.appendChild(clearButton);

    // 下部の「閉じる」ボタン
    const closeButton = document.createElement("button");
    closeButton.textContent = "閉じる";
    closeButton.style.marginTop = "10px";
    closeButton.style.fontSize = "12px";
    closeButton.addEventListener("click", function(){
      if(overlay.parentNode){
        overlay.parentNode.removeChild(overlay);
      }
    });
    modal.appendChild(closeButton);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // 「無視設定」ボタン押下時の処理
  function handleIgnoreSettingClick(e) {
    e.preventDefault();
    // 既存のオプション画面があれば閉じる（既存のcloseOptionがあればクリック）
    const pageCloseOption = document.querySelector('.closeOption');
    if(pageCloseOption){
      pageCloseOption.click();
    }
    createModal();
  }

  // 「追尾」ボタンの横に「無視設定」ボタンを追加（重複防止）
  function addIgnoreSettingButton(){
    // 既に追加済みなら何もしない
    if(document.querySelector(".ignoreSettingButton")) return;

    const fontTags = document.getElementsByTagName("font");
    let targetElem = null;
    for(let font of fontTags){
      if(font.textContent.trim() === "追尾"){
        targetElem = font;
        break;
      }
    }
    if(!targetElem){
      console.error("『追尾』の要素が見つかりませんでした。");
      return;
    }
    const parentLabel = targetElem.closest("label");
    if(!parentLabel){
      console.error("追尾要素の親labelが見つかりません。");
      return;
    }
    const ignoreBtn = document.createElement("button");
    ignoreBtn.textContent = "無視設定";
    ignoreBtn.className = "ignoreSettingButton";
    ignoreBtn.style.marginLeft = "10px";
    ignoreBtn.addEventListener("click", handleIgnoreSettingClick);
    parentLabel.parentNode.insertBefore(ignoreBtn, parentLabel.nextSibling);
  }

  // 初期化処理
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", () => {
      addIgnoreSettingButton();
      setupMutationObserver();
      applyIgnoreFilter();
    });
  } else {
    addIgnoreSettingButton();
    setupMutationObserver();
    applyIgnoreFilter();
  }
})();