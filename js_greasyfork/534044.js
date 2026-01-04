// ==UserScript==
// @name        FAB Free Asset Getter Latest
// @namespace   Violentmonkey Scripts
// @copyright   https://greasyfork.org/zh-CN/users/313682-没拖鞋 | 2024, subtixx (https://openuserjs.org/users/subtixx)
// @match       https://www.fab.com/channels/*
// @match       https://www.fab.com/sellers/*
// @match       https://www.fab.com/zh-cn/channels/*
// @match       https://www.fab.com/zh-cn/sellers/*
// @match       https://www.fab.com/limited-time-free
// @match       https://www.fab.com/search?*
// @match       https://www.fab.com/zh-cn/search?*
// @grant       none
// @license     AGPL-3.0-or-later
// @version     2.1.2
// @author      Noslipper <380886011@qq.com> | Dominic Hock <d.hock@it-hock.de>
// @description A script to get all free assets from the FAB marketplace (更新日期：2025-05-14)
// @downloadURL https://update.greasyfork.org/scripts/534044/FAB%20Free%20Asset%20Getter%20Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/534044/FAB%20Free%20Asset%20Getter%20Latest.meta.js
// ==/UserScript==

(function () {
    `use strict`;
    var added = false;
    var notificationQueueContainer = null;
    var assetProgressbar = null;
    var innerAssetsProgressbar = null;
    var assetStatus = null;
    // 更新选择器以适应网站变化 (2025年更新)
    const resultGridID = "main, [class*='SearchResults'], .oeSuy4_9, .vL3jJySf";

    // 检测页面语言
    function detectLanguage() {
      const url = window.location.href;
      if (url.includes("/zh-cn/")) {
        return "zh-cn";
      } else {
        return "en";
      }
    }

    // 获取当前语言
    const currentLanguage = detectLanguage();
    console.log("Detected language:", currentLanguage);

    // 多语言文本
    const translations = {
      "en": {
        "startGetting": "Starting to get free assets...",
        "checkingAssets": "Checking all assets regardless of ownership status",
        "tryingToAddAPI": "Trying to add via API: ",
        "addedSuccessfully": "Successfully added ",
        "addedToLibrary": " to your library",
        "apiFailed": "API failed, trying iframe method",
        "loadingAssetPage": "Loading asset page: ",
        "processing": "Processing: ",
        "buttonNotFound": "Add button not found, skipping: ",
        "processingError": "Error processing asset: ",
        "skipping": ", skipping",
        "iframeError": "Iframe method error: ",
        "progress": "Progress: ",
        "noResults": "Failed to find results! Try refreshing the page.",
        "noItems": "No items found? Check console!",
        "tooManyListings": "Too many listings, splitting into 24 chunks!",
        "needToCheck": "Need to check ",
        "listings": " listings",
        "scrollingMore": "Scrolling to load more items (attempt ",
        "processingNewItems": "Processing newly loaded items...",
        "noNewItems": "No new items loaded, attempts: ",
        "reachedBottom": "Reached the bottom of the page, no more items",
        "processedBatches": "Completed! Processed ",
        "batches": " batches of items",
        "error": "Error: ",
        "addFreeAssets": "Get Free Assets",
        "scriptLoaded": "FAB Free Asset Getter v2.1.1 loaded!",
        "checking": "Checking",
        "filteredAssets": "Found {0} assets to add out of {1} total assets",
        "allAssetsOwned": "All assets appear to be already in your library",
        "alreadyOwned": "{0} is already in your library - skipping"
      },
      "zh-cn": {
        "startGetting": "开始获取免费资产...",
        "checkingAssets": "检查所有资产，不考虑是否已在库中",
        "tryingToAddAPI": "尝试使用API添加: ",
        "addedSuccessfully": "成功添加 ",
        "addedToLibrary": " 到您的库中",
        "apiFailed": "API添加失败，尝试使用iframe方法",
        "loadingAssetPage": "正在加载资产页面: ",
        "processing": "正在处理: ",
        "buttonNotFound": "未找到添加按钮，跳过: ",
        "processingError": "处理资产时出错: ",
        "skipping": "，跳过",
        "iframeError": "iframe方法出错: ",
        "progress": "进度: ",
        "noResults": "未找到结果！请尝试刷新页面。",
        "noItems": "未找到项目？请查看控制台！",
        "tooManyListings": "项目过多，分批处理！",
        "needToCheck": "需要检查 ",
        "listings": " 个项目",
        "scrollingMore": "滚动加载更多项目（第 ",
        "processingNewItems": "正在处理新加载的项目...",
        "noNewItems": "没有新项目加载，尝试次数: ",
        "reachedBottom": "已到达页面底部，没有更多项目",
        "processedBatches": "完成！已处理 ",
        "batches": " 批项目",
        "error": "错误: ",
        "addFreeAssets": "添加免费资产",
        "scriptLoaded": "FAB免费资产获取器 v2.1.1 已加载！",
        "checking": "正在检查",
        "filteredAssets": "在 {1} 个资产中找到 {0} 个需要添加的资产",
        "allAssetsOwned": "所有资产似乎都已在您的库中",
        "alreadyOwned": "{0} 已在您的库中 - 跳过"
      },
      // 德语支持已移除
    };

    // 获取翻译文本
    function t(key) {
      if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
      } else if (translations["en"][key]) {
        return translations["en"][key]; // 默认使用英文
      } else {
        console.warn("Missing translation for key:", key);
        return key;
      }
    }

      // Function to show toast
      function showToast(message, type = 'success', duration = 3000) {
          const toast = document.createElement('div');
          toast.textContent = message;
          //toast.style.position = 'fixed';
          //toast.style.bottom = '20px';
          //toast.style.right = '20px';
          toast.style.margin = "5px 0 5px 0";
          toast.style.padding = '15px';
          toast.style.backgroundColor = type === 'success' ? '#28a745' : (type === 'warning' ? '#ffc107' : '#dc3545'); // Green for success, yellow for warning, red for error
          toast.style.color = type === 'warning' ? 'black' : 'white'; // Black text for warning (yellow background)
          toast.style.borderRadius = '5px';
          toast.style.zIndex = '10000';
          toast.style.fontFamily = 'Arial, sans-serif';
          toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s ease';

          // Append to body
          notificationQueueContainer.appendChild(toast);

          // Fade in
          setTimeout(() => {
              toast.style.opacity = '1';
          }, 100);

          // Auto-remove after specified duration
          setTimeout(() => {
              toast.style.opacity = '0';
              setTimeout(() => {
                if (toast.parentNode) {
                  toast.parentNode.removeChild(toast);
                }
              }, 500);
          }, duration);
      }

    function getCSRFToken() {
      // Get from fab_csrftoken cookie
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("fab_csrftoken=")) {
          return cookie.split("=")[1];
        }
      }
      return "";
    }

    async function getAcquiredIds(listings) {
      // 更新内部状态（不显示在UI上）
      assetStatus.innerText = t("needToCheck") + listings.length + t("listings");

      // 显示气泡通知
      showToast(t("needToCheck") + listings.length + t("listings"), "success");

      console.log("Getting acquired ids");
      // max listings is 24 so just cut
      if (listings.length > 24) {
        showToast(t("tooManyListings"), "error");
        console.error("Too many listings");
        return [];
      }
      // 记录原始列表长度
      console.log("Original listings count:", listings.length);

      // 过滤掉已拥有的资产
      let filteredListings = listings.filter(listing => {
        const isFiltered = !listing.isOwned;
        if (!isFiltered) {
          console.log("Filtering out owned asset:", listing.name, listing.id);
        }
        return isFiltered;
      });

      console.log("过滤后的资产数量:", filteredListings.length, "原始数量:", listings.length);

      // 如果过滤后没有资产，可能是因为检测不准确，提示用户
      if (filteredListings.length === 0 && listings.length > 0) {
        console.log("所有资产似乎都已在库中，但可能检测不准确");
        showToast(t("allAssetsOwned"));

        // 返回一个特殊标记，表示当前页面的所有资产都已在库中
        return { allOwned: true };
      } else {
        showToast(t("filteredAssets").replace("{0}", filteredListings.length).replace("{1}", listings.length));
      }

      // 检查是否有资产需要检查
      if (filteredListings.length === 0) {
        console.log("No listings to check after filtering");
        return [];
      }

      try {
        // Convert uid array to listing_ids=X&listing_ids=Y&listing_ids=Z
        let ids = filteredListings
          .map(listing => listing.id)
          .join("&listing_ids=");

        // 检查ids是否为空
        if (!ids || ids.trim() === "") {
          console.log("No valid listing IDs to check");
          return [];
        }

        console.log("Fetching listing states for IDs:", ids);

        //[{"uid":"5059af80-527f-4dda-8e75-7dde4dfcdf81","acquired":true,"rating":null}]
        let result = await fetch("https://www.fab.com/i/users/me/listings-states?listing_ids=" + ids, {
          "credentials": "include",
          "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-CsrfToken": getCSRFToken(),
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
          },
          "referrer": "https://www.fab.com/channels/unreal-engine?is_free=1&sort_by=-createdAt&is_ai_generated=0",
          "method": "GET",
          "mode": "cors"
        });

        if (!result.ok) {
          console.error("Failed to fetch listing states:", result.status, result.statusText);
          // 如果API调用失败，我们假设没有资产被获取
          return [];
        }

        let json = await result.json();
        let acquired = [];
        for (let i = 0; i < json.length; i++) {
          if (json[i].acquired) {
            acquired.push(json[i].uid);
          }
        }

        let alreadyAcquired = listings.filter(listing => listing.isOwned).length;
        console.log("Acquired " + acquired.length + " of " + listings.length + " listings (" + alreadyAcquired + " already acquired were skipped)");
        return acquired;
      } catch (error) {
        console.error("Error fetching acquired IDs:", error);
        // 如果出现错误，我们假设没有资产被获取
        return [];
      }
    }

    async function getIds() {
      // 尝试使用多个选择器找到结果网格
      let resultGrid = null;
      const selectors = resultGridID.split(", ");

      for (let i = 0; i < selectors.length; i++) {
        const elements = document.querySelectorAll(selectors[i]);
        if (elements && elements.length > 0) {
          // 找到第一个包含资产项的元素
          for (let j = 0; j < elements.length; j++) {
            if (elements[j].querySelectorAll(".fabkit-Stack-root, .d6kADL5Y, [class*='_fyPHkQI']").length > 0) {
              resultGrid = elements[j];
              break;
            }
          }
          if (resultGrid) break;
        }
      }

      if(!resultGrid) {
        console.error("Failed to find results grid with selectors:", selectors);
        showToast(t("noResults"), "error");
        return;
      }

      console.log("Found result grid:", resultGrid);

      // 尝试多种可能的选择器来适应网站的变化
      // 添加更多可能的选择器以适应网站结构变化
      const itemSelectors = [
        // 2024年7月新版Fab页面选择器
        "main > div > a[href*='/listings/']",
        "main a[href*='/listings/']",
        "main > a[href*='/listings/']",
        // 2024年更新的选择器
        "a[href*='/listings/']",
        "div > a[href*='/listings/']",
        // 旧版选择器
        ".fabkit-Stack-root.d6kADL5Y.Bf_zHIaU",
        ".fabkit-Stack-root.d6kADL5Y",
        ".d6kADL5Y._fyPHkQI",
        // 通用选择器
        "div[class*='Card']",
        "div[class*='card']",
        "div[class*='Item']",
        "div[class*='item']",
        "div[class*='Asset']",
        "div[class*='asset']",
        "div[class*='Product']",
        "div[class*='product']"
      ];

      // 记录所有尝试的选择器
      console.log("Trying to find items with selectors:", itemSelectors.join(", "));

      // 尝试每个选择器
      let foundItems = null;
      for (const selector of itemSelectors) {
        const items = resultGrid.querySelectorAll(selector);
        if (items && items.length > 0) {
          console.log(`Found ${items.length} items with selector: ${selector}`);
          foundItems = items;
          break;
        }
      }

      // 如果所有选择器都失败，尝试一个最后的备用方法：查找所有链接
      if (!foundItems || foundItems.length === 0) {
        console.log("All specific selectors failed, trying to find any links to listings");
        const allLinks = resultGrid.querySelectorAll("a");
        const listingLinks = Array.from(allLinks).filter(link =>
          link.href && link.href.includes("/listings/")
        );

        if (listingLinks.length > 0) {
          console.log(`Found ${listingLinks.length} listing links as fallback`);
          foundItems = listingLinks;
        }
      }

      if(!foundItems || foundItems.length === 0){
        showToast(t("noItems"), "error");
        console.error("Result grid found but no items inside:", resultGrid);
        console.log("HTML of result grid:", resultGrid.innerHTML);
        return;
      }
      console.log("Found " + foundItems.length + " items");

      let currentListings = [];

      // 显示初始进度
      showToast(t("progress") + "0/" + foundItems.length + " (0%)", "success");

      for (let i = 0; i < foundItems.length; i++) {
        // 每处理10个项目或处理到最后一个项目时更新进度
        if (i % 2 === 0 || i === foundItems.length - 1) {
          const percent = ((i + 1) / foundItems.length * 100).toFixed(1);
          showToast(t("progress") + (i + 1) + "/" + foundItems.length + " (" + percent + "%)", "success");
        }

        let root = foundItems[i];

        // 尝试多种可能的选择器来获取名称 (2024年7月更新)
        let nameContainer = root.querySelector("a > div.fabkit-Typography-ellipsisWrapper") ||
                           root.querySelector("div.fabkit-Typography-ellipsisWrapper") ||
                           root.querySelector("[class*='ellipsisWrapper']") ||
                           root.querySelector("[class*='title']") ||
                           root.querySelector("h3") ||
                           root.querySelector("h2") ||
                           // 2024年7月新版Fab页面选择器
                           (root.tagName === 'A' && root.querySelector("text")) ||
                           (root.tagName === 'A' && root.querySelector("div > div")) ||
                           (root.tagName === 'A' && root);

        // 特殊处理 _fyPHkQI 类的元素
        if (!nameContainer && root.classList.contains("_fyPHkQI")) {
          // 尝试从父元素获取名称
          const parentItem = root.closest(".fabkit-Stack-root") || root.parentElement;
          if (parentItem) {
            nameContainer = parentItem.querySelector("[class*='ellipsisWrapper']") ||
                           parentItem.querySelector("[class*='title']") ||
                           parentItem.querySelector("h3") ||
                           parentItem.querySelector("h2");
          }

          // 如果仍然找不到，尝试从相邻元素获取
          if (!nameContainer && root.previousElementSibling) {
            const prevItem = root.previousElementSibling;
            nameContainer = prevItem.querySelector("[class*='ellipsisWrapper']") ||
                           prevItem.querySelector("[class*='title']") ||
                           prevItem.querySelector("h3") ||
                           prevItem.querySelector("h2");
          }
        }

        // 如果仍然找不到名称容器，使用一个默认名称并继续
        let name = "Unknown Asset";
        if (nameContainer) {
          name = nameContainer.innerText || nameContainer.textContent || "Unknown Asset";
        } else {
          console.log("Cannot find name container in:", root, "- using default name");
          // 不中断处理，继续尝试获取其他信息
        }

        // 尝试多种可能的选择器来获取链接
        let linkElement = root.querySelector("a") || root.closest("a");

        // 特殊处理 _fyPHkQI 类的元素
        if (!linkElement && root.classList.contains("_fyPHkQI")) {
          // 尝试从父元素获取链接
          const parentItem = root.closest(".fabkit-Stack-root") || root.parentElement;
          if (parentItem) {
            linkElement = parentItem.querySelector("a");
          }

          // 如果仍然找不到，尝试从相邻元素获取
          if (!linkElement && root.previousElementSibling) {
            linkElement = root.previousElementSibling.querySelector("a");
          }
        }

        if (!linkElement) {
          console.log("Cannot find link in:", root, "- skipping item");
          continue;
        }

        let url = linkElement.href;

        // 查找资产是否显示"Saved in My Library"或"Free"
        // 这是判断资产是否在库中的最准确方法
        let isOwned = false;
        let ownedReason = "";

        // 获取资产卡片中的所有文本
        const cardText = root.innerText || root.textContent || "";

        // 检查是否包含"Saved in My Library"文本
        if (cardText.includes("Saved in My Library") ||
            cardText.includes("已保存在我的库中") ||
            cardText.includes("已保存") ||
            cardText.includes("我的库")) {
          isOwned = true;
          ownedReason = "Text 'Saved in My Library' found";
          console.log(`Asset marked as owned: ${name} - reason: ${ownedReason}`);
        }

        // 2024年7月更新：检查相邻元素是否包含"已保存在我的库中"文本
        if (!isOwned && root.parentElement) {
          const parentText = root.parentElement.innerText || root.parentElement.textContent || "";
          if (parentText.includes("Saved in My Library") ||
              parentText.includes("已保存在我的库中") ||
              parentText.includes("已保存") ||
              parentText.includes("我的库")) {
            isOwned = true;
            ownedReason = "Text 'Saved in My Library' found in parent element";
            console.log(`Asset marked as owned: ${name} - reason: ${ownedReason}`);
          }

          // 检查兄弟元素
          const siblings = Array.from(root.parentElement.children);
          for (const sibling of siblings) {
            if (sibling !== root) {
              const siblingText = sibling.innerText || sibling.textContent || "";
              if (siblingText.includes("Saved in My Library") ||
                  siblingText.includes("已保存在我的库中") ||
                  siblingText.includes("已保存") ||
                  siblingText.includes("我的库")) {
                isOwned = true;
                ownedReason = "Text 'Saved in My Library' found in sibling element";
                console.log(`Asset marked as owned: ${name} - reason: ${ownedReason}`);
                break;
              }
            }
          }
        }

        // 2024年7月更新：检查资产卡片中的标签元素
        if (!isOwned) {
          const tags = root.querySelectorAll("div[class*='tag'], span[class*='tag'], div[class*='Tag'], span[class*='Tag']");
          for (const tag of tags) {
            const tagText = tag.innerText || tag.textContent || "";
            if (tagText.includes("Saved in My Library") ||
                tagText.includes("已保存在我的库中") ||
                tagText.includes("已保存") ||
                tagText.includes("我的库")) {
              isOwned = true;
              ownedReason = "Text 'Saved in My Library' found in tag element";
              console.log(`Asset marked as owned: ${name} - reason: ${ownedReason}`);
              break;
            }
          }
        }

        // 检查是否包含"Free"文本但不在库中
        if ((cardText.includes("Free") ||
             cardText.includes("免费")) && !isOwned) {
          isOwned = false;
          console.log(`Asset marked as NOT owned: ${name} - has 'Free' text`);
        }

        // 记录资产的完整文本，用于调试
        console.log(`Asset card text for ${name}: "${cardText.substring(0, 100)}..."`);

        // 记录资产的所有权状态
        console.log(`Asset ${name} ownership status: ${isOwned ? "Owned" : "Not owned"}`);

        if (!url || url === undefined) {
          console.log("Failed to get valid URL for:", name, "- skipping item");
          continue;
        }

        // Extract id
        let id = url.split("/").pop();
        if(!id){
          console.log("Can't extract ID from URL:", url, "- skipping item");
          continue;
        }

        console.log(id, name, isOwned, url);

        currentListings.push({
          isOwned: isOwned,
          name: name,
          id: id
        });
      }

      let acquired = [];
      console.log("Need to check " + currentListings.length + " listings");
      assetStatus.innerText = t("needToCheck") + currentListings.length + t("listings");
      if (currentListings.length > 24) {
        showToast(t("tooManyListings"));
        console.log("Too many listings, splitting into 24 chunks");
        // Slice, request, join, until we are finished
        for (let i = 0; i < currentListings.length; i += 24) {
          let partial = await getAcquiredIds(currentListings.slice(i, i + 24));
          acquired = acquired.concat(partial);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      else {
        acquired = await getAcquiredIds(currentListings);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // [{id:"",offerId:""}]
      let offers = [];
      for (let i = 0; i < currentListings.length; i++) {
        // 更新状态文本（仅用于内部跟踪）
        assetStatus.innerText = t("checking") + " " + currentListings[i].name + " (" + currentListings[i].id + ")";

        // 每处理5个资产或处理到最后一个资产时更新气泡进度
        if (i % 5 === 0 || i === currentListings.length - 1) {
          const percent = ((i + 1) / currentListings.length * 100).toFixed(1);
          showToast(t("progress") + (i + 1) + "/" + currentListings.length + " (" + percent + "%)", "success");
        }

        let currentListing = currentListings[i];

        // 检查资产是否已在库中
        let isAlreadyOwned = false;

        // 检查UI标记
        if (currentListing.isOwned) {
          isAlreadyOwned = true;
          console.log(currentListing.name + " (" + currentListing.id + ") marked as owned in UI");
        }

        // 检查API返回的数据
        if (acquired.includes(currentListing.id)) {
          isAlreadyOwned = true;
          console.log(currentListing.name + " (" + currentListing.id + ") found in acquired list from API");
        }

        // 如果资产已经在库中，跳过处理
        if (isAlreadyOwned) {
          console.log(currentListing.name + " (" + currentListing.id + ") already in library - skipping");
          showToast(t("alreadyOwned").replace("{0}", currentListing.name));
          continue;
        }

        // 记录我们将尝试添加这个资产
        console.log("Will try to add " + currentListing.name + " (" + currentListing.id + ") to your library");

        // 记录我们将要处理的资产
        console.log("Processing asset that is NOT in library:", currentListing.name, currentListing.id);

        try {
          let result = await fetch("https://www.fab.com/i/listings/" + currentListing.id, {
            "credentials": "include",
            "headers": {
              "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
              "Accept": "application/json, text/plain, */*",
              "Accept-Language": "en",
              "X-Requested-With": "XMLHttpRequest",
              "X-CsrfToken": getCSRFToken(),
              "Sec-GPC": "1",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              "Priority": "u=0"
            },
            "referrer": "https://www.fab.com/listings/" + currentListing.id,
            "method": "GET",
            "mode": "cors"
          });

          // 检查API响应是否成功
          if (!result.ok) {
            console.error(`API请求失败: ${result.status} ${result.statusText} - 资产ID: ${currentListing.id}`);
            showToast(`无法获取资产信息: ${currentListing.name}`, "warning");
            continue; // 跳过这个资产，处理下一个
          }

          // licenses -> foreach -> get where price 0 -> buy
          let json = await result.json();

          // 检查JSON数据是否有效
          if (!json || !json.licenses || !Array.isArray(json.licenses)) {
            console.error(`无效的API响应数据 - 资产ID: ${currentListing.id}`, json);
            showToast(`无效的资产数据: ${currentListing.name}`, "warning");
            continue; // 跳过这个资产，处理下一个
          }

          let listingOffers = [];
          for (let j = 0; j < json.licenses.length; j++) {
            let license = json.licenses[j];

            // 检查license对象是否有效
            if (!license || !license.priceTier) {
              console.warn(`无效的许可证数据 - 资产ID: ${currentListing.id}, 许可证索引: ${j}`);
              continue; // 跳过这个许可证，检查下一个
            }

            if (license.priceTier.price != 0) {
              continue;
            }

            offers.push({
              name: currentListing.name,
              id: currentListing.id,
              offerId: license.offerId
            });
            listingOffers.push(license.offerId);
            console.log("Found free offer for " + currentListing.name + " (" + currentListing.id + ")");
          }
          if (listingOffers.length == 0) {
            console.log("No free offers found for " + currentListing.name + " (" + currentListing.id + ")");
          }
        } catch (error) {
          // 捕获并处理所有可能的错误
          console.error(`处理资产时出错: ${currentListing.name} (${currentListing.id}) - ${error.message}`);
          showToast(`处理资产时出错: ${currentListing.name}`, "error");
          // 继续处理下一个资产
          continue;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 不再需要弹出窗口警告

      // 创建一个隐藏的iframe来加载资产页面
      let assetFrame = document.getElementById('fab-asset-frame');
      if (!assetFrame) {
        assetFrame = document.createElement('iframe');
        assetFrame.id = 'fab-asset-frame';
        assetFrame.style.width = '1px';
        assetFrame.style.height = '1px';
        assetFrame.style.position = 'fixed';
        assetFrame.style.top = '-100px';
        assetFrame.style.left = '-100px';
        assetFrame.style.border = 'none';
        assetFrame.style.opacity = '0.1'; // 稍微可见，便于调试
        document.body.appendChild(assetFrame);
      }

      // 显示初始进度
      showToast(t("progress") + "0/" + offers.length + " (0%)", "success");

      for (let i = 0; i < offers.length; i++) {
        console.log("Trying to add " + offers[i].name + " (" + offers[i].id + ")");

        // 每处理3个资产或处理到最后一个资产时更新气泡进度
        if (i % 3 === 0 || i === offers.length - 1) {
          const percent = ((i + 1) / offers.length * 100).toFixed(1);
          showToast(t("progress") + (i + 1) + "/" + offers.length + " (" + percent + "%)", "success");
        }

        // 尝试两种方法添加资产：1. 使用API 2. 使用iframe
        let success = false;

        // 方法1：尝试使用API直接添加资产
        try {
          showToast(t("tryingToAddAPI") + offers[i].name);

          // 构建API请求
          const addUrl = "https://www.fab.com/i/listings/" + offers[i].id + "/add-to-library";
          const csrfToken = getCSRFToken();

          if (!csrfToken) {
            console.log("无法获取CSRF令牌，尝试使用iframe方法");
          } else {
            // 检查是否有offerId
            if (!offers[i].offerId) {
              console.log("缺少offerId，尝试获取许可证信息");

              try {
                // 先获取资产的许可证信息
                const licenseUrl = "https://www.fab.com/i/listings/" + offers[i].id;
                const licenseResult = await fetch(licenseUrl, {
                  "credentials": "include",
                  "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest"
                  },
                  "method": "GET"
                });

                if (licenseResult.ok) {
                  const licenseData = await licenseResult.json();
                  console.log("获取到许可证信息:", licenseData);

                  // 查找免费许可证
                  if (licenseData && licenseData.licenses && licenseData.licenses.length > 0) {
                    for (const license of licenseData.licenses) {
                      if (license.priceTier && license.priceTier.price === 0) {
                        offers[i].offerId = license.offerId;
                        console.log("找到免费许可证:", license.offerId);
                        break;
                      }
                    }

                    // 如果没有找到免费许可证，使用第一个许可证
                    if (!offers[i].offerId && licenseData.licenses.length > 0) {
                      offers[i].offerId = licenseData.licenses[0].offerId;
                      console.log("未找到免费许可证，使用第一个许可证:", offers[i].offerId);
                    }
                  }
                } else {
                  console.log("获取许可证信息失败:", await licenseResult.text());
                }
              } catch (e) {
                console.error("获取许可证信息出错:", e.message);
              }
            }

            // 如果仍然没有offerId，尝试使用iframe方法
            if (!offers[i].offerId) {
              console.log("无法获取offerId，尝试使用iframe方法");
              success = false; // 确保尝试iframe方法
              break; // 跳出当前的else块
            }

            // 准备请求数据
            const formData = new FormData();
            formData.append("offer_id", offers[i].offerId);

            console.log("发送API请求，offerId:", offers[i].offerId);

            // 发送API请求
            const result = await fetch(addUrl, {
              "credentials": "include",
              "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "X-Requested-With": "XMLHttpRequest",
                "X-CsrfToken": csrfToken
                // 不要设置Content-Type，让浏览器自动设置
              },
              "referrer": "https://www.fab.com/listings/" + offers[i].id,
              "method": "POST",
              "mode": "cors",
              "body": formData
            });

            // 检查响应
            if (result.ok) {
              showToast(t("addedSuccessfully") + offers[i].name + t("addedToLibrary"), "success");
              success = true;
              console.log("API添加成功: " + offers[i].name);
            } else {
              const responseText = await result.text();
              console.log("API添加失败: " + responseText);
              showToast(t("apiFailed"), "warning");
            }
          }
        } catch (e) {
          console.error("API添加出错: " + e.message);
          showToast(t("apiFailed"), "warning");
        }

        // 如果API方法失败，尝试使用iframe方法
        if (!success) {
          try {
            // 使用iframe加载资产页面
            showToast(t("loadingAssetPage") + offers[i].name);

            // 设置iframe源
            assetFrame.src = "https://www.fab.com/listings/" + offers[i].id;

            // 等待页面加载
            console.log("等待iframe加载: " + offers[i].name);
            await new Promise(resolve => {
              const frameLoadTimeout = setTimeout(() => {
                console.log("iframe加载超时");
                resolve();
              }, 10000);

              assetFrame.onload = () => {
                clearTimeout(frameLoadTimeout);
                console.log("iframe已加载");
                resolve();
              };
            });

            // 尝试在iframe中查找并点击"添加到我的库"按钮
            try {
              // 等待额外时间确保页面完全加载
              await new Promise(resolve => setTimeout(resolve, 3000));

              // 尝试访问iframe内容
              const frameDoc = assetFrame.contentDocument || assetFrame.contentWindow.document;

              // 如果无法访问iframe内容，跳过当前资产
              if (!frameDoc || !frameDoc.body) {
                console.log("无法访问iframe内容，跳过当前资产");
                showToast("无法处理资产: " + offers[i].name + "，跳过", "warning");

                // 继续处理下一个资产
                continue;
              }

              console.log("成功访问iframe内容");
              showToast(t("processing") + offers[i].name);

              // 在这里可以添加与之前相同的许可证选择和添加到库的逻辑
              // 但是操作对象从assetWindow变为frameDoc

              // 这里简化处理，直接尝试查找并点击"添加到我的库"按钮
              const addButtons = frameDoc.querySelectorAll("button");
              let addButton = null;

              for (const button of addButtons) {
                const text = button.textContent || button.innerText || "";
                if (text && (
                    text.includes("Add to My Library") ||
                    text.includes("添加到我的库") ||
                    text.includes("Add to Library") ||
                    text.includes("Add to cart") ||
                    text.includes("添加到购物车")
                  )) {
                  addButton = button;
                  break;
                }
              }

              if (addButton) {
                console.log("找到添加按钮，点击中...");
                addButton.click();
                showToast(t("addedSuccessfully") + offers[i].name + t("addedToLibrary"), "success");
                success = true;

                // 等待添加操作完成
                await new Promise(resolve => setTimeout(resolve, 2000));
              } else {
                console.log("在iframe中未找到添加按钮");
                showToast(t("buttonNotFound") + offers[i].name, "warning");
              }
            } catch (e) {
              console.error("处理iframe内容时出错: " + e.message);
              showToast(t("processingError") + offers[i].name + t("skipping"), "error");
            }
          } catch (e) {
            console.error("iframe方法出错: " + e.message);
            showToast(t("iframeError") + e.message, "error");
          }
        }

        console.log("Progress: " + (i + 1) + "/" + offers.length + " (" + ((i + 1) / offers.length * 100).toFixed(2) + "%)");

        // 等待一段时间再处理下一个资产
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 检查是否所有资产都已在库中
      let allAssetsOwned = true;
      for (const listing of currentListings) {
        if (!listing.isOwned) {
          allAssetsOwned = false;
          break;
        }
      }

      // 如果所有资产都已在库中，返回特殊标记
      if (allAssetsOwned && currentListings.length > 0) {
        console.log("当前页面所有资产都已在库中，返回特殊标记");
        return { allOwned: true, lastElement: foundItems[foundItems.length - 1] };
      }

      // 安全地返回最后一个项目，确保foundItems存在且有长度
      if (foundItems && foundItems.length > 0) {
        return foundItems[foundItems.length - 1];
      } else {
        console.warn("没有找到可用的项目，返回null");
        return null;
      }
    }

    async function getAll() {
      showToast(t("startGetting"), "success");
      console.log("开始获取免费资产...");

      let last;
      let totalProcessed = 0;
      let scrollAttempts = 0;
      const maxScrollAttempts = 10; // 增加到10次，给予更多尝试机会

      try {
        // 获取初始资产列表
        try {
          const result = await getIds();

          // 检查是否收到了"所有资产都已在库中"的特殊标记
          if (result && result.allOwned === true) {
            console.log("检测到初始页面所有资产都已在库中");
            showToast("当前页面所有资产都已在库中，将尝试滚动加载更多", "success");

            // 如果特殊标记中包含lastElement，使用它来滚动
            if (result.lastElement && typeof result.lastElement.scrollIntoView === 'function') {
              last = result.lastElement;

              // 立即执行一次快速滚动，不等待用户点击
              console.log("初始页面所有资产都已在库中，执行快速滚动");
              last.scrollIntoView({ behavior: 'auto', block: 'end' });
              // 短暂等待后继续执行
              await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
              // 如果没有可用的元素，提示用户并返回
              showToast("无法找到可滚动的元素", "error");
              return;
            }
          } else {
            // 正常情况，更新last
            last = result;
          }
        } catch (error) {
          console.error("获取初始资产列表时出错:", error);
          showToast("获取资产列表失败: " + error.message, "error");
          return; // 如果初始获取失败，直接返回
        }

        // 检查是否找到了资产
        if (!last) {
          showToast("没有找到可滚动的项目", "error");
          return;
        }

        // 将循环次数从64增加到1000，实际上接近无限循环
        // 只有在达到页面底部或出现错误时才会停止
        for (let i = 0; i < 1000; i++) {
          // 滚动到最后一个项目并等待加载
          if (last && typeof last.scrollIntoView === 'function') {
            showToast(t("scrollingMore") + (i+1) + ")...");
            console.log(`滚动加载更多项目 (第 ${i+1} 次)...`);

            try {
              // 平滑滚动到元素
              last.scrollIntoView({ behavior: 'smooth', block: 'end' });

              // 等待页面加载新内容 - 增加等待时间以确保加载完成
              await new Promise(resolve => setTimeout(resolve, 7000));

              // 获取新加载的项目
              showToast(t("processingNewItems"));
              const prevLast = last;

              try {
                const result = await getIds();

                // 检查是否收到了"所有资产都已在库中"的特殊标记
                if (result && result.allOwned === true) {
                  console.log("检测到当前页面所有资产都已在库中，快速跳过");
                  showToast("当前页面所有资产都已在库中，快速跳过", "success");

                  // 如果特殊标记中包含lastElement，使用它来滚动
                  if (result.lastElement && typeof result.lastElement.scrollIntoView === 'function') {
                    last = result.lastElement;

                    // 快速滚动 - 减少等待时间
                    last.scrollIntoView({ behavior: 'auto', block: 'end' });
                    await new Promise(resolve => setTimeout(resolve, 3000)); // 减少等待时间

                    // 立即继续循环，不增加尝试次数
                    continue;
                  } else {
                    // 如果没有lastElement，使用prevLast
                    last = prevLast;
                    continue;
                  }
                }

                // 正常情况，更新last
                last = result;
              } catch (error) {
                console.error(`获取新加载项目时出错 (第 ${i+1} 次):`, error);
                showToast("获取新项目失败: " + error.message, "warning");
                // 不中断整个过程，继续尝试
                scrollAttempts++;
                continue;
              }

              // 检查是否有新项目加载
              if (!last || last === prevLast) {
                scrollAttempts++;
                console.log(`没有新项目加载，尝试次数: ${scrollAttempts}/${maxScrollAttempts}`);

                if (scrollAttempts >= maxScrollAttempts) {
                  showToast(t("reachedBottom"), "success");
                  console.log("已到达页面底部，没有更多项目");
                  break;
                }
              } else {
                // 重置计数器，因为找到了新项目
                scrollAttempts = 0;
                totalProcessed++;
              }

              showToast(`已处理 ${totalProcessed} 批项目!`);
            } catch (scrollError) {
              console.error(`滚动处理时出错 (第 ${i+1} 次):`, scrollError);
              showToast("滚动处理失败: " + scrollError.message, "warning");
              // 增加失败计数，但继续尝试
              scrollAttempts++;

              if (scrollAttempts >= maxScrollAttempts) {
                showToast("达到最大尝试次数，停止处理", "warning");
                break;
              }
            }
          } else {
            showToast(t("noResults"), "error");
            console.error("无法滚动，元素不存在或不支持滚动");
            break;
          }
        }

        showToast(t("processedBatches") + totalProcessed + t("batches"), "success");
        console.log(`完成! 已处理 ${totalProcessed} 批项目`);
      } catch (error) {
        console.error("获取资产时出错:", error);
        showToast(t("error") + error.message, "error");
      }
    }

    function getSortContainer() {
      // 尝试多种可能的选择器 (2024年7月更新)
      return document.querySelector(`div.odQtzXCJ > ul._oqSjPnA`) ||
             document.querySelector(`ul._oqSjPnA`) ||
             document.querySelector(`[class*="FilterBar"]`) ||
             document.querySelector(`[class*="filter"]`) ||
             document.querySelector(`[class*="Filter"]`) ||
             document.querySelector(`[class*="sort"]`) ||
             document.querySelector(`[class*="Sort"]`) ||
             document.querySelector(`header`) ||
             document.querySelector(`main > div:first-child`);
    }

    function getTitleContainer() {
      // 尝试多种可能的选择器 (2024年7月更新)
      return document.querySelector(".ArhVH7Um") ||
             document.querySelector("main > div:first-child") ||
             document.querySelector("main > div") ||
             document.querySelector("main") ||
             document.body;
    }

    function addControls() {
      // 创建通知容器
      notificationQueueContainer = document.createElement("div");
      notificationQueueContainer.style.position = 'fixed';
      notificationQueueContainer.style.bottom = '20px';
      notificationQueueContainer.style.right = '20px';
      notificationQueueContainer.style.zIndex = '10000';
      document.body.appendChild(notificationQueueContainer);

      // 创建获取资产按钮
      var getAssetsButton = document.createElement("button");
      getAssetsButton.className = "fabkit-Button-root fabkit-Button--sm fabkit-Button--menu";
      getAssetsButton.type = "button";
      getAssetsButton.innerHTML = `<span class="fabkit-Button-label" style="font-size: 13px; line-height: 1;">${t("addFreeAssets")}</span>`;
      getAssetsButton.style.margin = "10px";
      getAssetsButton.style.padding = "8px 20px"; // 增加水平内边距，使按钮更宽
      getAssetsButton.style.minWidth = "120px"; // 设置最小宽度
      getAssetsButton.style.backgroundColor = "#45C761";
      getAssetsButton.style.color = "#1C1C20";
      getAssetsButton.style.border = "none";
      getAssetsButton.style.borderRadius = "4px";
      getAssetsButton.style.cursor = "pointer";
      getAssetsButton.style.fontWeight = "bold";
      getAssetsButton.style.whiteSpace = "nowrap"; // 防止文本换行
      getAssetsButton.style.display = "inline-flex"; // 使用inline-flex布局
      getAssetsButton.style.alignItems = "center"; // 垂直居中
      getAssetsButton.style.justifyContent = "center"; // 水平居中
      getAssetsButton.style.height = "32px"; // 固定高度
      getAssetsButton.addEventListener(`click`, function () {
        getAll();
      });

      // 创建进度条（仅用于内部状态跟踪，不显示在UI上）
      assetProgressbar = document.createElement("div");
      assetProgressbar.style.display = "none";

      innerAssetsProgressbar = document.createElement("div");
      innerAssetsProgressbar.style.width = "0";
      innerAssetsProgressbar.style.display = "none";

      // 创建状态显示（仅用于内部状态跟踪，不显示在UI上）
      assetStatus = document.createElement("div");
      assetStatus.style.display = "none";

      // 添加到页面
      var titleContainer = getTitleContainer();
      if(!titleContainer) {
        showToast(t("error") + "Failed to find title container", "error");
        titleContainer = document.body;
      }

      // 创建一个隐藏容器来放置我们的状态元素
      var uiContainer = document.createElement("div");
      uiContainer.style.display = "none";

      uiContainer.appendChild(assetStatus);
      uiContainer.appendChild(assetProgressbar);

      document.body.appendChild(uiContainer);

      // 添加按钮到排序容器或页面顶部
      var sortContainer = getSortContainer();
      if(!sortContainer) {
        showToast(t("error") + "Failed to find sort container", "error");
        // 如果找不到排序容器，添加到标题容器
        if(titleContainer && titleContainer !== document.body) {
          titleContainer.prepend(getAssetsButton);
        } else {
          // 如果找不到标题容器，添加到body
          document.body.prepend(getAssetsButton);
        }
      } else {
        sortContainer.appendChild(getAssetsButton);
      }

      // 浮动按钮已被移除

      showToast(t("scriptLoaded"), "success");
      added = true;
    }

    function onBodyChange() {
      if (!added) {
        addControls();
      }
    }

    var mo = new MutationObserver(onBodyChange);
    mo.observe(document.body, {
      childList: true,
      subtree: true
    });
  })();
