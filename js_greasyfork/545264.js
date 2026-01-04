// ==UserScript==
// @name         steam创意工坊Mod下载工具: 一键复制(单个/合集)SteamCmd下载命令
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  一个用于下载steam创意工坊MOD的脚本(需使用Steamcmd) - 修复图片加载问题
// @author       Dost51552 (Fixed by User)
// @match        https://steamcommunity.com/workshop/browse/*
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545264/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8AMod%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%3A%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%28%E5%8D%95%E4%B8%AA%E5%90%88%E9%9B%86%29SteamCmd%E4%B8%8B%E8%BD%BD%E5%91%BD%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/545264/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8AMod%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%3A%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%28%E5%8D%95%E4%B8%AA%E5%90%88%E9%9B%86%29SteamCmd%E4%B8%8B%E8%BD%BD%E5%91%BD%E4%BB%A4.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // === 关键修复开始 ===
  // 释放全局 $ 变量，避免与 Steam 原生脚本冲突
  // 并将脚本引入的 jQuery 赋值给局部变量 $
  const $ = window.jQuery.noConflict(true);
  // === 关键修复结束 ===

  const SELECTED_COLOR = "#FF0000"; // 选择框选中颜色
  const COMMON_BTN_STYLE = `
    position: relative;
    height: 30px;
    padding-left: 28px;
    padding-right: 12px;
    background-repeat: no-repeat;
    display: inline-block;
    line-height: 30px;
    color: #939393;
    cursor: pointer;
    user-select: none;
    margin-left: 6px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.4);
    transition: background-color 0.2s ease;
    border: none;
  `;

  const ICON_COMMON_STYLE = {
    background:
      "url('https://community.fastly.steamstatic.com/public/images/sharedfiles/ico_subscribe_tiled.png')",
    backgroundPosition: "0px 0px",
    backgroundRepeat: "no-repeat",
    height: "30px",
    width: "16px",
    position: "absolute",
    top: "0px",
    left: "8px",
    pointerEvents: "none",
  };

  // 加载Material Symbols字体（file_export图标）
  function loadMaterialSymbolsFont() {
    if (!document.getElementById("material-symbols-style")) {
      const linkEl = document.createElement("link");
      linkEl.id = "material-symbols-style";
      linkEl.rel = "stylesheet";
      linkEl.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=file_export";
      document.head.appendChild(linkEl);
    }
  }

  // 获取游戏ID
  function getGameId() {
    return $("div.apphub_OtherSiteInfo.responsive_hidden > a").data("appid");
  }

  // 获取页面mod id数组（合集中所有mod）
  function getModIds() {
    const ids = [...$(".collectionItemDetails > a")]
      .map(
        (el) =>
          $(el)
            .attr("href")
            ?.match(/id=(\d+)/)?.[1]
      )
      .filter(Boolean);
    if (!ids.length) {
      // 单个mod详情页也取id
      const singleId = window.location.search.match(/id=(\d+)/)?.[1];
      if (singleId) ids.push(singleId);
    }
    return ids;
  }

  // 生成下载命令文本
  function generateDownloadText(gameId, modIds) {
    return modIds.map((id) => `workshop_download_item ${gameId} ${id}`).join("\n");
  }

  // 显示按钮下方提示浮层，2秒自动消失
  function showToastBelowButton(btn, msg, isCollection = false) {
    $(".tm_custom_toast").remove();
    const rect = btn.getBoundingClientRect();
    const toast = document.createElement("div");
    toast.className = "tm_custom_toast";
    toast.innerText = msg;
    Object.assign(toast.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.bottom + 6}px`,
      backgroundColor: isCollection ? "#97C0E3" : "#91b007",
      color: isCollection ? "#3C3D3E" : "#fff",
      padding: "6px 14px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      zIndex: 10000,
      userSelect: "none",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      opacity: "0",
      transition: "opacity 0.3s ease",
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = "1"));

    const hide = () => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("click", hide);
    };

    const timeoutId = setTimeout(hide, 2000);
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(timeoutId);
        hide();
      },
      { once: true }
    );
    window.addEventListener(
      "click",
      () => {
        clearTimeout(timeoutId);
        hide();
      },
      { once: true }
    );
  }

  // 复制文本到剪贴板，失败时fallback提示或跳转第三方
  function copyToClipboard(text, btn, isCollection = false) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToastBelowButton(btn, "下载命令已复制", isCollection))
      .catch(() => {
        const modIds = getModIds();
        if (!modIds.length) {
          prompt("复制失败，请手动复制：", text);
          return;
        }
        const fullUrl = `http://steamcommunity.com/sharedfiles/filedetails/?id=${modIds[0]}`;
        const newWin = window.open("https://steamworkshopdownloader.io/");
        if (!newWin) {
          prompt("复制失败，且弹窗被阻止，请手动复制：", text);
          return;
        }
        const intervalId = setInterval(() => {
          try {
            if (newWin.document && newWin.document.readyState === "complete") {
              clearInterval(intervalId);
              const input = newWin.document.getElementById("downloadUrlLabel");
              if (input) {
                input.value = fullUrl;
                let enterEvent;
                if (typeof KeyboardEvent === "function") {
                  enterEvent = new KeyboardEvent("keydown", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                  });
                } else {
                  enterEvent = new Event("keydown", {
                    bubbles: true,
                    cancelable: true,
                  });
                }
                input.dispatchEvent(enterEvent);
              }
            }
          } catch {
            // 跨域异常忽略
          }
        }, 300);
      });
  }

  // 鼠标悬停按钮样式切换
  function addHoverEffect(el) {
    el.addEventListener("mouseenter", () => {
      el.style.backgroundColor = "#97C0E3";
      el.style.color = "#3C3D3E";
      el.style.textDecoration = "none";
    });
    el.addEventListener("mouseleave", () => {
      el.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      el.style.color = "#939393";
    });
  }

  // --- 创建单mod详情页复制按钮 ---
  function createButtonForSingle() {
    const refBtn = document.getElementById("SubscribeItemBtn");
    if (!refBtn) return null;

    const btn = document.createElement("a");
    btn.className = refBtn.className;
    btn.style.cssText = `${refBtn.style.cssText}; display: inline-block; margin-top: 6px; user-select:none; cursor:pointer; position: relative;`;

    const iconDiv = document.createElement("div");
    iconDiv.className = "subscribeIcon";
    Object.assign(iconDiv.style, {
      position: "absolute",
      top: "0",
      left: "8px",
      height: "30px",
      width: "16px",
      filter:
        "brightness(0%) saturate(100%) invert(85%) sepia(20%) hue-rotate(180deg)",
      backgroundImage:
        "url('https://community.fastly.steamstatic.com/public/images/sharedfiles/rate_ico_up_tiled.png?v=1')",
      backgroundPosition: "0 0",
      backgroundRepeat: "no-repeat",
    });

    const spanText = document.createElement("span");
    spanText.className = "subscribeText";

    const optAdd = document.createElement("div");
    optAdd.className = "subscribeOption subscribe selected";
    optAdd.textContent = "复制";

    const optSubscribed = document.createElement("div");
    optSubscribed.className = "subscribeOption subscribed";
    optSubscribed.textContent = "已订阅";

    const optRemove = document.createElement("div");
    optRemove.className = "subscribeOption remove";
    optRemove.textContent = "取消订阅";

    spanText.append(optAdd, optSubscribed, optRemove);
    btn.append(iconDiv, spanText);

    btn.onclick = () => {
      const gameId = getGameId();
      const modIds = getModIds();
      if (!gameId || !modIds.length) {
        showToastBelowButton(btn, "未获取到游戏ID或Mod ID");
        return;
      }
      copyToClipboard(generateDownloadText(gameId, modIds), btn);
    };

    refBtn.parentNode.insertBefore(btn, refBtn.nextSibling);
    return btn;
  }

  // --- 创建合集复制按钮 ---
  function createButtonForCollection() {
    const container = document.querySelector(".subscribeCollection");
    const itemControls = document.getElementById("ItemControls");

    if (!container) {
      if (!itemControls) return null;
      const btn = document.createElement("span");
      btn.className = "general_btn subscribe";
      btn.style.cssText = COMMON_BTN_STYLE;

      const iconDiv = document.createElement("div");
      iconDiv.className = "duplicateCollectionIcon";
      Object.assign(iconDiv.style, ICON_COMMON_STYLE);
      btn.appendChild(iconDiv);

      const spanText = document.createElement("span");
      spanText.textContent = "复制命令";
      btn.appendChild(spanText);

      addHoverEffect(btn);

      btn.onclick = () => {
        const gameId = getGameId();
        const modIds = getModIds();
        if (!gameId || !modIds.length) {
          showToastBelowButton(btn, "未获取到游戏ID或Mod ID");
          return;
        }
        copyToClipboard(generateDownloadText(gameId, modIds), btn, true);
      };

      const btns = itemControls.querySelectorAll(".general_btn");
      if (btns.length)
        btns[btns.length - 1].insertAdjacentElement("afterend", btn);
      else itemControls.appendChild(btn);

      return btn;
    }

    const saveBtn = [...container.querySelectorAll(".general_btn.subscribe")].find(
      (el) => el.textContent.trim() === "保存至收藏"
    );
    if (!saveBtn) return null;

    const btn = document.createElement("span");
    btn.className = "general_btn subscribe";
    btn.style.cssText = COMMON_BTN_STYLE;

    const iconDiv = document.createElement("div");
    iconDiv.className = "duplicateCollectionIcon";
    Object.assign(iconDiv.style, ICON_COMMON_STYLE);
    btn.appendChild(iconDiv);

    const spanText = document.createElement("span");
    spanText.textContent = "复制命令";
    btn.appendChild(spanText);

    addHoverEffect(btn);

    btn.onclick = () => {
      const gameId = getGameId();
      const modIds = getModIds();
      if (!gameId || !modIds.length) {
        showToastBelowButton(btn, "未获取到游戏ID或Mod ID");
        return;
      }
      copyToClipboard(generateDownloadText(gameId, modIds), btn, true);
    };

    saveBtn.insertAdjacentElement("afterend", btn);
    return btn;
  }
  // --- 合集内单个mod复制按钮 ---
  function createCopyButtonForSingleModsInCollection() {
    loadMaterialSymbolsFont();

    $(".collectionItemDetails").each((_, container) => {
      const $container = $(container);
      const href = $container.find("> a").attr("href");
      const modId = href?.match(/id=(\d+)/)?.[1];
      if (!modId) return;

      // 获取游戏ID（合集内mod）
      const appidHref = $container.find(".workshopItemAuthorName a").attr("href");
      const appId = appidHref?.match(/appid=(\d+)/)?.[1];
      if (!appId) return;

      const subBtn = $(`#SubscribeItemBtn${modId}`);
      if (!subBtn.length || subBtn.prev(".tm_copy_single_mod_btn").length) return;

      const copyBtn = document.createElement("a");
      copyBtn.className = "general_btn subscribe tm_copy_single_mod_btn";
      Object.assign(copyBtn.style, {
        position: "relative",
        height: "30px",
        width: "31px",
        padding: "0",
        backgroundRepeat: "no-repeat",
        display: "inline-block",
        lineHeight: "30px",
        cursor: "pointer",
        color: "#939393",
        userSelect: "none",
        marginBottom: "0",
        borderRadius: "3px",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        transition: "background-color 0.2s ease",
      });

      addHoverEffect(copyBtn);

      const iconSpan = document.createElement("span");
      iconSpan.className = "material-symbols-outlined";
      iconSpan.textContent = "file_export";
      Object.assign(iconSpan.style, {
        position: "absolute",
        top: "5px",
        left: "4px",
        fontVariationSettings: "'wght' 400, 'FILL' 0, 'GRAD' 0",
        fontSize: "22px",
        color: "#DADADA",
        pointerEvents: "none",
        userSelect: "none",
      });
      copyBtn.appendChild(iconSpan);

      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        copyToClipboard(`workshop_download_item ${appId} ${modId}`, copyBtn, true);
      });

      const parent = subBtn.parent();
      if (parent.css("position") === "static") parent.css("position", "relative");

      subBtn.before(copyBtn);
    });
  }

  // --- 浏览页每个mod添加复制按钮与选择框 ---
  function addButtonsToMods() {
    $(".workshopItem").each((_, item) => {
      const $item = $(item);

      if ($item.css("position") === "static") {
        $item.css("position", "relative");
      }

      const href = $item.find("a.item_link").attr("href");
      if (!href) return;
      const modIdMatch = href.match(/id=(\d+)/);
      if (!modIdMatch) return;
      const modId = modIdMatch[1];

      const gameId = getGameId();
      if (!gameId) return;

      if ($item.find(".tm_copy_btn").length === 0) {
        // 复制按钮 - 右下角
        const copyBtn = $("<button>")
          .addClass("tm_copy_btn subscribeIcon")
          .attr("title", "复制下载命令")
          .css({
            position: "absolute",
            bottom: "4px",
            right: "4px",
            height: "30px",
            width: "16px",
            cursor: "pointer",
            "background-color": "transparent",
            "background-image":
              "url('https://community.fastly.steamstatic.com/public/images/sharedfiles/ico_subscribe_tiled.png')",
            "background-position": "0 0",
            "background-repeat": "no-repeat",
            border: "none",
            outline: "none",
          })
          .on("click", () => {
            const cmd = generateDownloadText(gameId, [modId]);
            navigator.clipboard.writeText(cmd).then(() => {
              showToastBelowButton(copyBtn[0], "下载命令已复制");
            }).catch(() => {
              prompt("复制失败，请手动复制下面的命令：", cmd);
            });
          });

        // 选择框 - 复制按钮正上方，紧邻
        const selectCheckbox = $("<button>")
          .addClass("tm_select_checkbox")
          .attr({
            title: "选择该Mod",
            "data-selected": "false",
          })
          .css({
            position: "absolute",
            bottom: "36px", // 30 + 6
            right: "4px",
            height: "16px",
            width: "16px",
            cursor: "pointer",
            padding: 0,
            outline: "none",
            "background-color": "transparent",
            border: `2px solid #FFFFFF`,
            "border-radius": "3px",
          })
          .on("click", function () {
            const selected = $(this).attr("data-selected") === "true";
            if (selected) {
              $(this).attr("data-selected", "false");
              $(this).css("background-color", "transparent");
            } else {
              $(this).attr("data-selected", "true");
              $(this).css("background-color", SELECTED_COLOR);
            }
          });

        $item.append(copyBtn, selectCheckbox);
      }
    });
  }

  // --- 批量复制按钮添加到“按日期筛选”按钮右侧，间距5px ---
  function addBatchCopyButton() {
    const filterBtn = $("span.general_btn.createCollection");
    if (filterBtn.length === 0) return;
    if ($("#tm_batch_copy_btn").length > 0) return;

    const batchBtn = $("<button>")
      .attr("id", "tm_batch_copy_btn")
      .text("批量复制下载命令")
      .addClass("general_btn createCollection")
      .css({
        "margin-left": "5px",
        cursor: "pointer",
      })
      .on("mouseenter", function () {
        this.style.cursor = "pointer";
      })
      .on("click", () => {
        const gameId = getGameId();
        if (!gameId) {
          alert("未找到游戏ID，无法复制");
          return;
        }
        const selectedMods = [];
        $(".workshopItem .tm_select_checkbox[data-selected='true']").each((_, el) => {
          const $item = $(el).closest(".workshopItem");
          const href = $item.find("a.item_link").attr("href");
          const modIdMatch = href?.match(/id=(\d+)/);
          if (modIdMatch) selectedMods.push(modIdMatch[1]);
        });

        if (selectedMods.length === 0) {
          alert("未选择任何Mod");
          return;
        }

        const cmdText = selectedMods.map(id => `workshop_download_item ${gameId} ${id}`).join("\n");
        navigator.clipboard.writeText(cmdText).then(() => {
          alert(`已复制${selectedMods.length}个Mod的下载命令`);
        }).catch(() => {
          prompt("复制失败，请手动复制下面的命令：", cmdText);
        });
      });

    filterBtn.after(batchBtn);
  }

  // --- 入口函数 ---
  function main() {
    $(".tm_custom_toast").remove();
    $("#tm_batch_copy_btn").remove();

    const path = window.location.pathname;

    // 单个mod详情页 或 合集详情页
    if (
      path.startsWith("/workshop/filedetails") ||
      path.startsWith("/sharedfiles/filedetails")
    ) {
      createButtonForCollection();
      createCopyButtonForSingleModsInCollection();

      // 没合集按钮时，详情页加单个按钮
      if (
        !document.querySelector(".general_btn.subscribe") &&
        document.querySelector(".game_area_purchase_game #SubscribeItemBtn")
      ) {
        createButtonForSingle();
      }
    }

    // 浏览页加选择框和复制按钮及批量复制按钮
    if (path.startsWith("/workshop/browse")) {
      addButtonsToMods();
      addBatchCopyButton();
    }
  }

  $(document).ready(main);
})();