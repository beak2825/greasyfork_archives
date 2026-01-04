// ==UserScript==
// @name         嘉立创EDA专业版增强脚本
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  对PC端嘉立创EDA专业版进行触摸适配，以及显示FPS等功能增强
// @author       github@xiaowine
// @match        https://pro.lceda.cn/editor*
// @require      https://cdn.jsdelivr.net/gh/hammerjs/hammer.js@ff687ea0daa3c806b9accd2ecb1a46165ea3c00a/hammer.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @license      GPL
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/529521/%E5%98%89%E7%AB%8B%E5%88%9BEDA%E4%B8%93%E4%B8%9A%E7%89%88%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529521/%E5%98%89%E7%AB%8B%E5%88%9BEDA%E4%B8%93%E4%B8%9A%E7%89%88%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 配置管理类
class ConfigManager {
  static DEFAULT_CONFIG = {
    enablePan: false,
    enablePinch: false,
    enablePress: false,
    showFPS: false,
    showCoupon: false,
    lastUpdateTime: '',  // 添加最后更新时间
    couponData: null     // 添加优惠券数据
  };

  constructor () {
    this.config = null;
    this.listeners = new Set();
    this.menuCommands = new Map(); // 存储菜单命令的引用
    this.menuItems = [
      { key: 'enablePan', text: '启用触摸拖动' },
      { key: 'enablePinch', text: '启用触摸缩放' },
      { key: 'enablePress', text: '启用触摸长按' },
      { key: 'showFPS', text: '显示FPS' },
      { key: 'showCoupon', text: '获取商城优惠' }
    ];
  }

  // 加载配置
  async load () {
    try {
      const savedConfig = await GM.getValue('touchConfig', null);
      this.config = savedConfig ? JSON.parse(savedConfig) : ConfigManager.DEFAULT_CONFIG;
    } catch (error) {
      console.error('加载配置失败:', error);
      this.config = ConfigManager.DEFAULT_CONFIG;
    }
    return this.config;
  }

  // 保存配置
  async save () {
    await GM.setValue('touchConfig', JSON.stringify(this.config));
    this.notifyListeners();
  }

  // 切换配置项
  async toggleSetting (key) {
    if (this._updating) return; // 防止重复触发
    this.config[key] = !this.config[key];
    await this.save();
    await this.updateMenu(key);
  }

  // 获取配置
  getConfig () {
    return this.config;
  }

  // 注册配置变更监听器
  addChangeListener (listener) {
    this.listeners.add(listener);
  }

  // 移除配置变更监听器
  removeChangeListener (listener) {
    this.listeners.delete(listener);
  }

  // 通知所有监听器
  notifyListeners () {
    this.listeners.forEach(listener => listener(this.config));
  }

  // 初始化菜单
  async initMenu () {
    // 确保先清理旧菜单
    await this.unregisterAllMenus();

    for (const { key, text } of this.menuItems) {
      const command = await GM.registerMenuCommand(
        `${this.config[key] ? '✅' : '❌'} ${text}`,
        () => this.toggleSetting(key)
      );
      this.menuCommands.set(key, command);
    }
  }

  // 更新菜单项显示
  async updateMenu (key) {
    // 防止重复更新
    if (this._updating) return;
    this._updating = true;

    try {
      const item = this.menuItems.find(item => item.key === key);
      if (item) {
        // 先注销所有旧的菜单命令
        await this.unregisterAllMenus();

        // 重新注册所有菜单命令
        await this.initMenu();
      }
    } finally {
      this._updating = false;
    }
  }

  // 注销所有菜单命令
  async unregisterAllMenus () {
    for (const command of this.menuCommands.values()) {
      if (command) {
        await GM.unregisterMenuCommand(command);
      }
    }
    this.menuCommands.clear();
  }
}

// TouchEventHandler类修改
class TouchEventHandler {
  constructor (targetElement, configManager) {
    this.targetElement = targetElement;
    this.hammer = null;
    this.scaleThreshold = 0.1;
    this.scrollSensitivity = 0.1;
    this.lastScale = 1;
    this.configManager = configManager;

    // 监听配置变更
    this.configManager.addChangeListener(() => {
      this.destroy();
      this.init();
    });
  }

  init () {
    if (!this.targetElement) {
      console.log("未找到目标元素");
      return false;
    }

    console.log("目标元素已获取，初始化Hammer.js:", this.targetElement);

    // 修改Hammer初始化方式
    this.hammer = new Hammer.Manager(this.targetElement, {
      touchAction: 'none',
      inputClass: Hammer.TouchInput
    });

    // 添加识别器
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL }));
    this.hammer.add(new Hammer.Pinch());
    this.hammer.add(new Hammer.Press({ time: 500 }));

    this.addEventListeners();
    return true;
  }

  getSVGCenter () {
    const rect = this.targetElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
  addEventListeners () {
    console.log("添加Hammer.js事件监听");
    const config = this.configManager.getConfig();

    if (config.enablePan) {
      this.hammer.on('panstart', (ev) => {
        console.log('Pan start triggered:', ev);
        const mouseDownEvent = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 1,
          clientX: ev.center.x,
          clientY: ev.center.y
        });
        this.targetElement.dispatchEvent(mouseDownEvent);
      });

      this.hammer.on('panmove', (ev) => {
        console.log('Pan move:', { x: ev.center.x, y: ev.center.y });
        const mouseMoveEvent = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          button: 1,
          clientX: ev.center.x,
          clientY: ev.center.y,
        });
        this.targetElement.dispatchEvent(mouseMoveEvent);
      });
    }

    if (config.enablePinch) {
      this.hammer.on('pinch', (ev) => {
        console.log('Pinch:', { scale: ev.scale, lastScale: this.lastScale });
        const scaleDiff = ev.scale - this.lastScale;
        if (Math.abs(scaleDiff) > this.scaleThreshold) {
          const center = this.getSVGCenter();
          console.log('Pinch threshold reached:', { scaleDiff, center });
          const scrollEvent = new WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            deltaY: scaleDiff > 0 ? -10 : 10,
            clientX: center.x,
            clientY: center.y,
          });
          this.targetElement.dispatchEvent(scrollEvent);
          this.lastScale = ev.scale;
        }
      });
    }

    if (config.enablePress) {
      this.hammer.on('press', (ev) => {
        const rightClickEvent = new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          button: 2,
          clientX: ev.center.x,
          clientY: ev.center.y,
        });
        this.targetElement.parentNode.dispatchEvent(rightClickEvent);
      });
    }
  }

  destroy () {
    if (this.hammer) {
      console.log("正在移除Hammer.js事件监听");
      this.hammer.destroy();
      this.hammer = null;
    }
    console.log("Hammer.js事件监听已移除");
  }
}

// UI增强处理类
class UIEnhancer {
  constructor (configManager) {
    this.configManager = configManager;
    this.fpsCounter = {
      element: null,
      frameCount: 0,
      previousTimestamp: 0,
      animationFrameHandle: null,
      currentFps: 0,
      interval: 1000,
      originalText: '' // 保存原始用户名
    };

    this.configManager.addChangeListener(() => {
      if (!this.configManager.getConfig().showFPS) {
        console.log('UIEnhancer: Config changed, updating UI');
        this.startFPSCounter();
      } else {
        this.stopFPSCounter();
      }
    });
  }

  init () {
    this.findElements();
    if (!this.configManager.getConfig().showFPS) return;
    console.log('UIEnhancer: Starting initialization');
    this.startFPSCounter();
  }

  findElements () {
    console.log('UIEnhancer: Finding username element');
    // 查找用户名span元素
    const usernameSpan = document.querySelector('#loginUsername span');
    if (usernameSpan) {
      console.log('UIEnhancer: Username element found');
      this.fpsCounter.element = usernameSpan;
      this.fpsCounter.originalText = usernameSpan.textContent;
    } else {
      console.log('UIEnhancer: Username element not found');
    }
  }

  updateFps () {
    const currentTimestamp = Date.now();
    this.fpsCounter.frameCount++;

    if (currentTimestamp > this.fpsCounter.interval + this.fpsCounter.previousTimestamp) {
      this.fpsCounter.currentFps = Math.round(
        (this.fpsCounter.frameCount * 1000) / (currentTimestamp - this.fpsCounter.previousTimestamp)
      );
      this.fpsCounter.frameCount = 0;
      this.fpsCounter.previousTimestamp = currentTimestamp;

      if (this.fpsCounter.element) {
        console.log('UIEnhancer: FPS updated to', this.fpsCounter.currentFps);
        this.fpsCounter.element.textContent = `FPS: ${this.fpsCounter.currentFps}`;
      }
    }

    this.fpsCounter.animationFrameHandle = requestAnimationFrame(() => this.updateFps());
  }

  startFPSCounter () {
    console.log('UIEnhancer: Starting FPS counter');
    if (!this.fpsCounter.animationFrameHandle && this.fpsCounter.element) {
      this.fpsCounter.frameCount = 0;
      this.fpsCounter.previousTimestamp = Date.now();
      this.updateFps();
    }
  }

  stopFPSCounter () {
    console.log('UIEnhancer: Stopping FPS counter');
    if (this.fpsCounter.animationFrameHandle) {
      cancelAnimationFrame(this.fpsCounter.animationFrameHandle);
      this.fpsCounter.animationFrameHandle = null;
      this.fpsCounter.currentFps = 0;
      if (this.fpsCounter.element) {
        this.fpsCounter.element.textContent = this.fpsCounter.originalText;
      }
    }
  }

  destroy () {
    if (!this.configManager.getConfig().showFPS) return;
    console.log('UIEnhancer: Destroying');
    this.stopFPSCounter();
  }
}

class DiscountHandler {
  constructor (configManager) {
    this.configManager = configManager;
    this.runTimeUrl = 'https://szlcsc-help.xiaowine.cc/run_time.txt';
    this.couponUrl = 'https://szlcsc-help.xiaowine.cc/simple_coupon_details.json';

    this.configManager.addChangeListener(() => {
      if (!this.configManager.getConfig().showCoupon) return
      console.log('DiscountHandler: Config changed');
      this.checkForUpdates();
      this.updateCouponDialog();
      this.listener();
    });
  }

  async init () {
    if (!this.configManager.getConfig().showCoupon) return
    console.log('DiscountHandler: Starting initialization');
    await this.checkForUpdates();

    // Watch for dialog creation 
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.id === 'chooseDeviceDialogContainer_dialog_box') {
            this.updateCouponDialog();
            this.listener();
            this.observer.disconnect();
            this.observer = null;
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    setInterval(() => {
      this.checkForUpdates();
    }, 60000);

  }
  addCouponData (shopItems) {
    try {
      Array.from(shopItems).forEach(item => {
        const observer = new MutationObserver((_mutations, obs) => {
          let category = null
          let brandHrefId = null
          const categoryElement = item.querySelector('.two-tit_6gtEt a:nth-child(2)');
          if (categoryElement) {
            category = categoryElement?.getAttribute('title');
          }

          const brandElement = item.querySelector('.l02_zb_ms1h6 .brand-name');
          if (brandElement) {
            const brandHref = brandElement?.getAttribute('href');
            brandHrefId = brandHref?.match(/\/brand\/(\d+)\.html/)?.[1] || null;
          }

          if (category || brandHrefId) {
            obs.disconnect();
          }
          if (category && brandHrefId) {
            const couponData = this.configManager.getConfig().couponData;
            if (couponData && couponData[brandHrefId]) {
              const couponContainer = item.querySelector('.l02_yb_3cN-b');
              if (couponContainer) {
                const couponListItem = document.createElement('li');
                const couponLink = document.createElement('a');
                couponLink.href = `https://list.szlcsc.com/brand/${brandHrefId}.html`;
                couponLink.target = '_blank';
                couponLink.innerHTML = couponData[brandHrefId]["coupon_name"];
                couponLink.style.color = 'red';
                couponLink.style.fontSize = '12px';
                couponListItem.appendChild(couponLink);
                couponContainer.appendChild(couponListItem);

                const discountListItem = document.createElement('li');
                discountListItem.innerHTML = `优惠券: ${couponData[brandHrefId]["min_order_amount"]}-${couponData[brandHrefId]["coupon_amount"]}`;
                discountListItem.style.color = 'red';
                discountListItem.style.fontSize = '12px';
                couponContainer.appendChild(discountListItem);

              }
            }
          }
        });

        // Start observing the item for DOM changes
        observer.observe(item, {
          childList: true,
          subtree: true
        });
      });
    } catch (error) {
      console.error('处理商品数据时出错:', error);
    }
  }

  listener () {
    const config = { childList: true, subtree: true };

    const shopListObserver = new MutationObserver(mutations => {

      const addedItems = mutations
        .filter(mutation => mutation.type === 'childList')
        .flatMap(mutation => Array.from(mutation.addedNodes))
        .filter(node => node.tagName === 'DIV' && !node.className)
        .flatMap(div => Array.from(div.children))
        .filter(Boolean);

      if (addedItems.length > 0) {
        console.log('检测到新商品列表项:', addedItems.length);
        this.addCouponData(addedItems);
      }
    });

    const shopList = document.getElementById('shop_list');
    if (shopList) {
      shopListObserver.observe(shopList, config);
      console.log('商品列表观察器已启动');
    } else {
      console.warn('未找到商品列表容器');
    }
  }

  async checkForUpdates () {
    try {
      const response = await fetch(this.runTimeUrl + '?' + Date.now());
      const currentTime = await response.text();
      const config = this.configManager.getConfig();

      console.log('Checking update time:', currentTime, 'vs', config.lastUpdateTime);

      if (currentTime !== config.lastUpdateTime) {
        console.log('New update available, fetching coupon data...');
        const couponResponse = await fetch(this.couponUrl + '?' + Date.now());
        const couponData = await couponResponse.json();

        // 更新配置
        config.lastUpdateTime = currentTime;
        config.couponData = couponData;
        await this.configManager.save();

        console.log('Coupon data updated:', couponData);
        this.updateCouponDialog(currentTime);
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  updateCouponDialog () {
    const time = this.configManager.getConfig().lastUpdateTime
    console.log('Updating coupon dialog with time:', time);
    const dialog = document.querySelector('.header_left_title_Hlg2C');
    if (dialog) {
      console.log('Found dialog element');
      // 检查是否已经添加了时间信息
      const lastUpdateTime = `|优惠信息更新时间: ${time}`
      if (!dialog.innerHTML.includes('|')) {
        dialog.innerHTML += lastUpdateTime;
        console.log('Added time div to dialog');
      } else {
        dialog.innerHTML = dialog.innerHTML.split('|')[0] + lastUpdateTime;
        console.log('Time div already exists');
      }
    } else {
      console.log('Dialog element not found');
    }
  }
}


// 主程序入口
(async function () {
  "use strict";

  if (window.isScriptLoaded) {
    return;
  }
  window.isScriptLoaded = true;

  // 初始化配置管理器
  const configManager = new ConfigManager();
  await configManager.load();
  await configManager.initMenu();

  // 初始化UI增强
  const uiEnhancer = new UIEnhancer(configManager);
  uiEnhancer.init();

  const discountHandler = new DiscountHandler(configManager);
  discountHandler.init();

  document.documentElement.style.touchAction = "none";
  window.addEventListener("popstate", parseTabParams);


  let touchHandler = null;
  let lastUrl = "";


  /**
   * 移除现有的事件监听器
   */
  function removeEventListeners () {
    if (touchHandler) {
      touchHandler.destroy();
      touchHandler = null;
      return true;
    }
    return false;
  }

  /**
   * 初始化触摸事件处理
   * @param {Element} element - 要监听触摸事件的目标元素
   */
  function initTouchHandler (element) {
    // 先移除现有的事件监听
    removeEventListeners();

    if (element) {
      console.log("正在初始化触摸处理器，目标元素:", element);
      touchHandler = new TouchEventHandler(element, configManager);
      const success = touchHandler.init();

      if (success) {
        // 添加触摸调试信息
        // element.addEventListener('touchstart', (e) => console.log('Native touchstart:', e), false);
        console.log("触摸事件处理已初始化");
        return true;
      }
    }

    return false;
  }

  /**
   * 解析 URL 中的 tab 参数并匹配 div 和 iframe
   */
  function parseTabParams () {
    if (configManager.getConfig().enablePan && configManager.getConfig().enablePinch && configManager.getConfig().enablePress) {
      const currentUrl = window.location.href;

      // 如果 URL 没变，则不执行解析
      if (currentUrl === lastUrl) {
        console.log("URL 未变化，跳过执行");
        return;
      }

      // 更新上次的 URL 记录
      lastUrl = currentUrl;
      console.log("检测到 URL 变化:", currentUrl);

      // 解析 tab 参数
      const hash = window.location.hash;
      const tabMatch = hash.match(/tab=([^&#]*)/);

      if (tabMatch) {
        const tabList = tabMatch[1].split("|");
        console.log("Tab 参数解析为列表:", tabList);

        // 过滤出以 "*" 开头的项，并去除 "*"
        const starredTabs = tabList
          .filter((tab) => tab.startsWith("*"))
          .map((tab) => tab.substring(1));

        if (starredTabs.length > 0) {
          console.log('以 "*" 开头的项:', starredTabs);

          // 调用单独的函数解析 div 和 iframe
          const rootElement = parseDivAndIframe(starredTabs);
          if (rootElement) {
            console.log("解析成功，初始化触摸事件处理");
            initTouchHandler(rootElement);
          } else {
            console.log("未找到符合条件的元素，无法初始化触摸事件");
          }
        }
      } else {
        console.log("未找到 tab 参数");
      }
    }
  }

  /**
   * 在 #tabbar_bodies 下查找 div 元素，并匹配 uuid
   * 如果找到符合条件的 div，则继续查找其内部的 iframe，获取 #root 或 #canvas
   * @param {Array} starredTabs - 以 "*" 开头的 tab 列表（去除了 "*"）
   * @returns {Element|boolean} 如果找到匹配的元素返回该元素，未找到返回 false
   */
  function parseDivAndIframe (starredTabs) {
    // 获取 #tabbar_bodies 下的所有 div
    const divs = document.querySelectorAll("#tabbar_bodies div");

    if (divs.length === 0) {
      console.log("未找到任何 div");
      return false;
    }

    // 遍历 div 并匹配 uuid
    for (let div of divs) {
      const uuid = div.getAttribute("uuid"); // 获取 uuid 属性
      if (uuid && starredTabs.includes(uuid)) {
        console.log("匹配的 div:", div);

        // 查找 div 内的 iframe
        const iframe = div.querySelector("iframe");
        if (iframe) {
          console.log("找到匹配的 iframe:", iframe);

          // 尝试访问 iframe 的内容
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;

            // 查找 #root 或 #canvas
            let rootElement = iframeDoc.querySelector("#root");
            if (!rootElement) {
              rootElement = iframeDoc.querySelector("#canvas");
            }

            if (rootElement) {
              console.log("找到目标元素:", rootElement);
              return rootElement;
            } else {
              console.log("未找到 #root 或 #canvas");
            }
          } catch (error) {
            console.error("无法访问 iframe 内容:", error);
          }
        } else {
          console.log("匹配的 div 内未找到 iframe");
        }
      }
    }

    return false; // 如果没有找到匹配的 div 和 iframe
  }
})();