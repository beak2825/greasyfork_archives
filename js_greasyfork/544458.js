// ==UserScript==
// @name         Gumtree Monitor - Title + Desc (Top 5, ID-Based Dedup) → HA
// @namespace    https://gumtree.com.au/
// @version      4.1
// @description  使用 Gumtree 商品 ID 去重，紧凑格式版本
// @match        https://www.gumtree.com.au/s-vermont-melbourne/l3001731r20?price-type=free
// @match        https://www.gumtree.com.au/s-vermont-melbourne/l3001731r50?price-type=free
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544458/Gumtree%20Monitor%20-%20Title%20%2B%20Desc%20%28Top%205%2C%20ID-Based%20Dedup%29%20%E2%86%92%20HA.user.js
// @updateURL https://update.greasyfork.org/scripts/544458/Gumtree%20Monitor%20-%20Title%20%2B%20Desc%20%28Top%205%2C%20ID-Based%20Dedup%29%20%E2%86%92%20HA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const REFRESH_INTERVAL_MIN = 5;
  // 支持多个 Home Assistant 实例
  const WEBHOOK_URLS = [
    'http://homeassistant.local:8123/api/webhook/gumtree_alert'
  ];

  function extractAdId(url) {
    const match = url.match(/\/(\d+)(\?.*)?$/);
    return match ? match[1] : null;
  }

  function waitForImagesAndProcess(retry = 0) {
    // 等待足够的图片加载
    const cloudinaryImages = document.querySelectorAll('img[src*="gumtreeau-res.cloudinary.com"]');
    const targetImageCount = 8; // 期望至少8个图片
    
    if (cloudinaryImages.length < targetImageCount && retry < 15) {
      console.log(`⏳ 等待图片加载... 当前: ${cloudinaryImages.length}/${targetImageCount} (尝试 ${retry + 1}/15)`);
      updateStatus(`等待图片加载... ${cloudinaryImages.length}/${targetImageCount}`);
      setTimeout(() => waitForImagesAndProcess(retry + 1), 2000);
      return;
    }
    
    console.log(`🖼️ 图片加载完成，找到 ${cloudinaryImages.length} 个 Cloudinary 图片`);
    waitForItemsAndProcess();
  }

  function findImageByPosition(linkElement) {
    const linkRect = linkElement.getBoundingClientRect();
    const adId = extractAdId(linkElement.href);
    
    // 获取所有商品图片，按位置排序
    const allImages = Array.from(document.querySelectorAll('img[src*="gumtreeau-res.cloudinary.com"]'))
      .filter(img => img.src.includes('t_$_s-l400') || img.src.includes('t_$_s-l180'))
      .map(img => ({
        element: img,
        src: img.src,
        id: img.src.split('/').pop().split('.')[0],
        rect: img.getBoundingClientRect()
      }));
    
    // 找到距离最近的图片（距离小于100px认为是匹配的）
    let bestMatch = null;
    let minDistance = Infinity;
    
    allImages.forEach(img => {
      const distance = Math.abs(img.rect.top - linkRect.top) + Math.abs(img.rect.left - linkRect.left);
      
      if (distance < 100 && distance < minDistance) {
        minDistance = distance;
        bestMatch = img;
      }
    });
    
    if (bestMatch) {
      console.log(`🎯 商品 ${adId} → 图片 ${bestMatch.id.substring(0, 8)}... (距离: ${minDistance.toFixed(0)}px)`);
      return bestMatch.src;
    }
    
    console.log(`❌ 商品 ${adId} 未找到匹配图片`);
    return '';
  }

  function extractLocation(element) {
    const locationSelectors = [
      '.user-ad-row-new-design__location',
      '.listing-location',
      '[data-testid="listing-location"]',
      '.location',
      '.suburb'
    ];
    
    const container = element.closest("article") || element.closest("div");
    if (!container) return 'Melbourne';
    
    for (const selector of locationSelectors) {
      const locationEl = container.querySelector(selector);
      if (locationEl) {
        const location = locationEl.innerText?.trim();
        if (location && location.length > 0) {
          // 简化位置信息，只保留主要部分
          return location.split(',')[0].trim();
        }
      }
    }
    return 'Melbourne';
  }

  function waitForItemsAndProcess(retry = 0) {
    const links = Array.from(document.querySelectorAll("a[href*='/s-ad/']"));
    console.log(`🔗 找到 ${links.length} 个商品链接`);
    
    const items = links.map((link, index) => {
      const title = link.innerText?.trim() || "";
      const href = link.href;
      const id = extractAdId(href);
      
      if (!title || !id) return null;
      
      // 改进描述提取
      const container = link.closest("article") || link.closest("div");
      const desc = container?.querySelector("p")?.innerText?.trim()
                || container?.querySelector(".description")?.innerText?.trim()
                || container?.querySelector("[class*='desc']")?.innerText?.trim()
                || "";
      
      // 使用位置匹配查找图片
      const image = findImageByPosition(link);
      const location = extractLocation(link);
      
      const imageId = image ? image.split('/').pop().split('.')[0].substring(0, 8) + '...' : '无';
      console.log(`📦 [${index}] ${title.substring(0, 25)}... → ${imageId}`);
      
      return { 
        id, 
        title, 
        desc, 
        url: href, 
        image, 
        location,
        index
      };
    }).filter(Boolean);

    if (items.length > 0) {
      console.log(`✅ 检测到 ${items.length} 个商品`);
      
      // 验证图片分配
      const itemsWithImages = items.filter(item => item.image);
      const imageIds = itemsWithImages.map(item => item.image.split('/').pop().split('.')[0]);
      const uniqueImageIds = [...new Set(imageIds)];
      
      console.log(`📊 图片统计: ${itemsWithImages.length}个有图片, ${uniqueImageIds.length}个唯一`);
      
      if (uniqueImageIds.length > 1) {
        console.log('🎉 成功！找到了多个不同的图片！');
      }
      
      processItems(items);
      updateStatus(`检测到 ${items.length} 个商品`);
    } else {
      if (retry < 30) {
        console.log("⏳ 等待商品加载中...");
        updateStatus(`等待商品加载... (${retry}/30)`);
        setTimeout(() => waitForItemsAndProcess(retry + 1), 1000);
      } else {
        console.warn("⚠️ 超时：未找到商品内容");
        updateStatus("⚠️ 未找到商品");
      }
    }
  }

  function processItems(itemList) {
    const sentIds = new Set(GM_getValue("sentItemIds", []));
    const unseenItems = itemList.filter(i => !sentIds.has(i.id));
    const limitedItems = unseenItems.slice(0, 5);

    if (limitedItems.length > 0) {
      let successCount = 0;
      
      console.log(`📤 准备推送 ${limitedItems.length} 个新商品`);
      
      // 发送每个商品的详细信息
      limitedItems.forEach((item, index) => {
        const itemData = {
          id: item.id,
          title: item.title,
          description: item.desc || item.title,
          url: item.url,
          location: item.location,
          image: item.image,
          timestamp: new Date().toISOString()
        };

        // 尝试发送到多个 webhook URL
        sendToWebhooks(itemData, (success) => {
          if (success) {
            successCount++;
            const imageId = item.image ? item.image.split('/').pop().split('.')[0].substring(0, 8) + '...' : '无';
            console.log(`✅ 已推送: ${item.title.substring(0, 25)}... (${imageId})`);
          } else {
            console.error(`❌ 推送失败: ${item.title.substring(0, 25)}...`);
          }
          
          // 如果是最后一个商品，更新状态
          if (index === limitedItems.length - 1) {
            updateStatus(`已推送 ${successCount}/${limitedItems.length} 个新商品`);
          }
        });
      });

      // ✅ 增量添加 ID
      limitedItems.forEach(i => sentIds.add(i.id));
      GM_setValue("sentItemIds", Array.from(sentIds));
      
    } else {
      console.log("📋 没有新商品");
      updateStatus("📋 没有新商品");
    }

    // 设置下次刷新
    setTimeout(() => {
      updateStatus("🔄 准备刷新页面...");
      location.reload();
    }, REFRESH_INTERVAL_MIN * 60 * 1000);
  }

  function sendToWebhooks(itemData, callback) {
    let attempts = 0;
    let success = false;

    function tryNextWebhook() {
      if (attempts >= WEBHOOK_URLS.length) {
        callback(success);
        return;
      }

      const url = WEBHOOK_URLS[attempts];
      attempts++;

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(itemData),
        timeout: 5000,
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            success = true;
            console.log(`✅ 成功发送到 ${url}:`, response.status);
            callback(success);
          } else {
            console.warn(`⚠️ ${url} 返回状态 ${response.status}，尝试下一个`);
            tryNextWebhook();
          }
        },
        onerror: function(error) {
          console.warn(`❌ ${url} 连接失败，尝试下一个:`, error);
          tryNextWebhook();
        },
        ontimeout: function() {
          console.warn(`⏰ ${url} 超时，尝试下一个`);
          tryNextWebhook();
        }
      });
    }

    tryNextWebhook();
  }

  function updateStatus(message) {
    const statusDiv = document.getElementById('gumtree-monitor-status');
    if (statusDiv) {
      const sentCount = GM_getValue("sentItemIds", []).length;
      statusDiv.innerHTML = `
        🏠 Gumtree → HA<br>
        <small>${message}</small><br>
        <small>已发送: ${sentCount}</small><br>
        <small>v4.1 紧凑版</small>
      `;
    }
  }

  // 创建状态显示
  function createStatusDisplay() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'gumtree-monitor-status';
    statusDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #3498db;
      color: white;
      padding: 8px 12px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 11px;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      max-width: 180px;
    `;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 2px;
      right: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    `;
    closeBtn.onclick = () => statusDiv.style.display = 'none';
    statusDiv.appendChild(closeBtn);
    
    document.body.appendChild(statusDiv);
    updateStatus("🔍 等待图片加载...");
  }

  // 初始化
  console.log('🚀 Gumtree Monitor v4.1 启动 (紧凑版)');
  createStatusDisplay();
  
  // 延迟执行，等待图片加载
  setTimeout(() => {
    waitForImagesAndProcess();
  }, 5000);
})();
