// ==UserScript==
// @name         KamePT Badge Trial Tool
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Try badges before purchase on KamePT
// @author       Your name
// @match        https://kamept.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526506/KamePT%20Badge%20Trial%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/526506/KamePT%20Badge%20Trial%20Tool.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 从本地存储加载试用的徽章配置
  const TRIAL_BADGES_KEY = "kame_trial_badges";
  let trialBadges = JSON.parse(localStorage.getItem(TRIAL_BADGES_KEY) || "[]");

  // 创建单个徽章元素
  function createBadgeElement(badgeConfig) {
    const badge = document.createElement("img");
    badge.src = badgeConfig.src;
    badge.title = badgeConfig.title;
    badge.className = "nexus-username-medal preview";
    badge.style.maxHeight = "11px";
    badge.style.maxWidth = "11px";
    badge.style.marginLeft = "2pt";
    return badge;
  }

  // 添加试用按钮到勋章商店页面
  function addTrialButtons() {
    if (!window.location.href.includes("medal.php")) return;

    // 获取表格
    const table = document.querySelector('table[border="1"]');
    if (!table) return;

    // 获取表头行
    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return;

    // 检查是否已经添加了试用列
    if (!headerRow.querySelector(".trial-header")) {
      // 添加"试用"列标题
      const trialHeader = document.createElement("td");
      trialHeader.className = "colhead trial-header";
      trialHeader.textContent = "试用";
      headerRow.appendChild(trialHeader);
    }

    // 为每个勋章行添加试用按钮
    const medalRows = table.querySelectorAll("tbody tr");
    medalRows.forEach((row) => {
      // 检查是否已经添加了试用按钮
      if (row.querySelector(".trial-button")) return;

      const imgElement = row.querySelector("td:first-child img");
      if (!imgElement) return;

      // 检查是否已购买
      const buyButton = row.querySelector(
        'input[type="button"][value="已经购买"]'
      );
      const isAlreadyBought = buyButton !== null;

      const badgeConfig = {
        src: imgElement.src,
        title: row.querySelector("h1")?.textContent || "勋章",
      };

      const trialCell = document.createElement("td");
      const trialButton = document.createElement("input");
      trialButton.type = "button";

      if (isAlreadyBought) {
        trialButton.value = "已拥有";
        trialButton.disabled = true;
        trialButton.style.opacity = "0.5";
      } else {
        trialButton.value = trialBadges.some((b) => b.src === badgeConfig.src)
          ? "取消试用"
          : "试用";
        trialButton.onclick = () => toggleTrialBadge(badgeConfig);
      }

      trialButton.className = "trial-button";
      trialButton.style.cursor = isAlreadyBought ? "not-allowed" : "pointer";
      trialButton.style.padding = "2px 8px";

      trialCell.appendChild(trialButton);
      row.appendChild(trialCell);
    });
  }

  // 切换徽章的试用状态
  function toggleTrialBadge(badgeConfig) {
    const index = trialBadges.findIndex((b) => b.src === badgeConfig.src);
    if (index === -1) {
      trialBadges.push(badgeConfig);
    } else {
      trialBadges.splice(index, 1);
    }

    // 保存到本地存储
    localStorage.setItem(TRIAL_BADGES_KEY, JSON.stringify(trialBadges));

    // 刷新页面以更新显示
    location.reload();
  }

  // 获取当前用户名
  function getCurrentUsername() {
    // 从页面顶部的info tab获取用户名
    const userLink = document.querySelector('#info_block a[class$="_Name"] b');
    return userLink ? userLink.textContent : "";
  }

  // 处理用户详情页面的勋章展示区域
  function processUserDetailsMedals() {
    const medalContainer = document.querySelector(
      'form > div[style*="display: flex"]'
    );
    if (!medalContainer) return;

    // 检查是否为其他用户的页面
    const pageUsername = document.querySelector(
      "h1 > span.nowrap > b"
    )?.textContent;
    const currentUsername = getCurrentUsername();

    if (!pageUsername || !currentUsername || pageUsername !== currentUsername) {
      console.log("当前为其他用户页面，跳过添加试用徽章");
      return;
    }

    // 添加保存按钮禁用逻辑
    const saveButton = document.getElementById("save-user-medal-btn");
    if (saveButton) {
      saveButton.disabled = trialBadges.length > 0;
      saveButton.title = trialBadges.length > 0 ? "试用期间禁止保存设置" : "";
      saveButton.style.opacity = trialBadges.length > 0 ? "0.5" : "1";
      saveButton.style.cursor =
        trialBadges.length > 0 ? "not-allowed" : "pointer";
    }

    // 为每个试用徽章创建展示卡片
    trialBadges.forEach((badgeConfig) => {
      // 检查是否已经存在该徽章
      const existingCard = Array.from(
        medalContainer.querySelectorAll("img.preview")
      ).find((img) => img.src === badgeConfig.src);

      if (!existingCard) {
        // 创建新的勋章卡片容器
        const cardDiv = document.createElement("div");
        cardDiv.style.display = "flex";
        cardDiv.style.flexDirection = "column";
        cardDiv.style.justifyContent = "space-between";
        cardDiv.style.marginRight = "10px";

        // 创建勋章图片容器
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = badgeConfig.src;
        img.title = badgeConfig.title;
        img.className = "preview";
        img.style.maxHeight = "120px";
        img.style.maxWidth = "120px";
        imgContainer.appendChild(img);

        // 创建勋章信息容器
        const infoContainer = document.createElement("div");
        infoContainer.style.display = "flex";
        infoContainer.style.flexDirection = "column";
        infoContainer.style.alignItems = "flex-start";

        const myBadgeBtn = document.querySelector('input[type="button"][value="我的勋章"]');
        if (myBadgeBtn) {
          myBadgeBtn.parentElement.parentElement.remove();
        }

        // 组装卡片
        cardDiv.appendChild(imgContainer);
        // cardDiv.appendChild(infoContainer);

        // 插入到第一个保存按钮前
        const saveButtonDiv = medalContainer.querySelector(
          "div:has(#save-user-medal-btn)"
        );
        if (saveButtonDiv) {
          medalContainer.insertBefore(cardDiv, saveButtonDiv);
        } else {
          medalContainer.appendChild(cardDiv);
        }
      }
    });
  }

  // 添加试用中的徽章到用户名旁
  function addTrialBadges() {
    // 获取当前用户名
    const currentUsername = getCurrentUsername();
    if (!currentUsername) return;

    // 处理用户详情页面的标题
    function processUserDetailsTitle() {
      const titleUsername = document.querySelector("h1 > span.nowrap > b");
      if (titleUsername && titleUsername.textContent === currentUsername) {
        const container = titleUsername.closest(".nowrap");
        if (!container) return;

        // 查找现有徽章
        const existingBadges = Array.from(
          container.querySelectorAll("img.nexus-username-medal-big")
        );
        let lastBadge =
          existingBadges[existingBadges.length - 1] || titleUsername;

        // 添加试用徽章
        trialBadges.forEach((badgeConfig) => {
          const existingTrialBadge = existingBadges.find(
            (img) => img.src === badgeConfig.src
          );

          if (!existingTrialBadge) {
            const newBadge = document.createElement("img");
            newBadge.src = badgeConfig.src;
            newBadge.title = badgeConfig.title;
            newBadge.className = "nexus-username-medal-big preview";
            newBadge.style.maxHeight = "16px";
            newBadge.style.maxWidth = "16px";
            newBadge.style.marginLeft = "4pt";
            lastBadge.parentNode.insertBefore(newBadge, lastBadge.nextSibling);
            lastBadge = newBadge;
          }
        });
      }
    }

    // 处理页面上已有的用户名元素
    function processExistingElements() {
      const currentUsername = getCurrentUsername();
      if (!currentUsername) return;

      const userSpans = document.querySelectorAll('span.nowrap');
      userSpans.forEach(span => {
        const userNameElement = span.querySelector('a[class$="_Name"] b');
        if (userNameElement && userNameElement.textContent === currentUsername) {
          // 查找span后面的所有兄弟节点
          let nextNode = span.nextSibling;
          let foundSpecialPattern = false;

          while (nextNode) {
            if (nextNode.nodeType === Node.TEXT_NODE) {
              if (nextNode.textContent === ')' + '\u00A0\u00A0') {
                // 找到 ")&nbsp;&nbsp;" 模式
                foundSpecialPattern = true;
                
                // 创建新的文本节点
                const closeBracket = document.createTextNode(')');
                const spaceNode = document.createTextNode('\u00A0\u00A0');
                
                // 替换原节点为 ")"
                nextNode.parentNode.replaceChild(closeBracket, nextNode);
                
                // 添加试用徽章和空格
                let lastInsertedNode = closeBracket;
                trialBadges.forEach(badgeConfig => {
                  const existingBadge = Array.from(span.querySelectorAll('img.nexus-username-medal'))
                    .find(img => img.src === badgeConfig.src);
                  
                  if (!existingBadge) {
                    const newBadge = createBadgeElement(badgeConfig);
                    lastInsertedNode.parentNode.insertBefore(newBadge, lastInsertedNode.nextSibling);
                    lastInsertedNode = newBadge;
                  }
                });
                
                // 在最后一个徽章后添加空格
                lastInsertedNode.parentNode.insertBefore(spaceNode, lastInsertedNode.nextSibling);
                break;
              } else if (nextNode.textContent === ')') {
                // 找到单独的 ")" 节点，继续查找 "&nbsp;&nbsp;"
                let spaceNode = nextNode.nextSibling;
                while (spaceNode) {
                  if (spaceNode.nodeType === Node.TEXT_NODE && spaceNode.textContent === '\u00A0\u00A0') {
                    foundSpecialPattern = true;
                    // 在 "&nbsp;&nbsp;" 前添加所有试用徽章
                    trialBadges.forEach(badgeConfig => {
                      const existingBadge = Array.from(span.querySelectorAll('img.nexus-username-medal'))
                        .find(img => img.src === badgeConfig.src);
                      
                      if (!existingBadge) {
                        const newBadge = createBadgeElement(badgeConfig);
                        spaceNode.parentNode.insertBefore(newBadge, spaceNode);
                      }
                    });
                    break;
                  }
                  spaceNode = spaceNode.nextSibling;
                }
                if (foundSpecialPattern) break;
              }
            }
            nextNode = nextNode.nextSibling;
          }

          // 如果没有找到特殊模式，使用原有逻辑
          if (!foundSpecialPattern) {
            const targetNode = Array.from(span.childNodes)
              .find(node => node.nodeType === Node.TEXT_NODE && node.textContent === '\u00A0\u00A0');

            trialBadges.forEach(badgeConfig => {
              const existingBadge = Array.from(span.querySelectorAll('img.nexus-username-medal'))
                .find(img => img.src === badgeConfig.src);
              
              if (!existingBadge) {
                const newBadge = createBadgeElement(badgeConfig);
                if (targetNode) {
                  targetNode.parentNode.insertBefore(newBadge, targetNode);
                } else {
                  span.appendChild(newBadge);
                }
              }
            });
          }
        }
      });
    }

    // 初始处理
    processUserDetailsTitle();
    processExistingElements();

    // 处理用户详情页面的勋章展示区域
    processUserDetailsMedals();

    // 监听动态加载的内容
    const observeTargets = [
      document.getElementById("peerlist"), // 做种用户列表
      document.querySelector(".text"), // 论坛内容区域
    ];

    observeTargets.forEach((target) => {
      if (target) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              processExistingElements();
            }
          });
        });

        observer.observe(target, {
          childList: true,
          subtree: true,
        });
      }
    });
  }

  // 添加清理预览图片的功能
  function fixPreviewCleanup() {
    // 查找预览图片元素
    const previewImg = document.getElementById("nexus-preview");
    if (!previewImg) return;

    // 监听所有徽章的鼠标移出事件
    document.addEventListener(
      "mouseover",
      (e) => {
        if (!e.target.matches("img.nexus-username-medal")) {
          // 如果鼠标不在任何徽章上，隐藏预览
          previewImg.style.display = "none";
        }
      },
      true
    );

    // 监听页面滚动，确保预览不会停留
    window.addEventListener(
      "scroll",
      () => {
        previewImg.style.display = "none";
      },
      { passive: true }
    );

    // 监听鼠标离开页面
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) {
        previewImg.style.display = "none";
      }
    });
  }

  // 初始化
  function init() {
    addTrialButtons();
    addTrialBadges();
    fixPreviewCleanup();
  }

  // 页面加载完成后运行
  window.addEventListener("load", init);
})();
