// ==UserScript==
// @name        NewBilibiliExp
// @namespace   NewBilibiliExp
// @match       *://www.bilibili.com/video/*
// @version     2.0.2
// @author      Dreace (原作者) & Updated by Mario
// @license     GPL-3.0
// @description B 站经验助手，自动投币视频、模拟移动端分享、经验获取统计、升级时间估计（2025年更新版）
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       unsafeWindow
// @connect     api.bilibili.com
// @connect     www.bilibili.com
// @connect     at.alicdn.com
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/539170/NewBilibiliExp.user.js
// @updateURL https://update.greasyfork.org/scripts/539170/NewBilibiliExp.meta.js
// ==/UserScript==

"use strict";

// 配置选项
const CONFIG = {
  AUTO_COIN: true,         // 是否自动投币
  AUTO_SHARE: true,        // 是否自动分享
  COIN_NUMBER: 1,          // 每个视频投币数量 (1 或 2)
  SHOW_STATS: true,        // 是否显示经验统计
  AUTO_VIP_EXP: true,      // 是否自动获取大会员观看经验
};

// API端点
const API = {
  NAV: "https://api.bilibili.com/x/web-interface/nav",
  REWARD: "https://api.bilibili.com/x/member/web/exp/reward",
  COIN_ADD: "https://api.bilibili.com/x/web-interface/coin/add",
  SHARE: "https://api.bilibili.com/x/web-interface/share/add",
  WBI_IMG: "https://api.bilibili.com/x/web-interface/nav",
  VIP_EXP: "https://api.bilibili.com/x/vip/experience/add",
};

// WBI签名相关
const WBI = {
  img_key: "",
  sub_key: "",
  
  // 初始化WBI密钥
  async init() {
    try {
      const res = await request({
        url: API.WBI_IMG,
        method: "GET"
      });
      
      if (res.code === 0 && res.data.wbi_img) {
        const { img_url, sub_url } = res.data.wbi_img;
        this.img_key = this.extractKey(img_url);
        this.sub_key = this.extractKey(sub_url);
        return true;
      }
      return false;
    } catch (err) {
      console.error("[BilibiliExp] WBI初始化失败", err);
      return false;
    }
  },
  
  // 从URL提取密钥
  extractKey(url) {
    return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  },
  
  // 混合密钥
  getMixinKey() {
    if (!this.img_key || !this.sub_key) return '';
    
    const mixed_key = this.img_key + this.sub_key;
    const MIXIN_KEY_ORDER = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13];
    let result = '';
    
    for (let i = 0; i < MIXIN_KEY_ORDER.length; i++) {
      if (MIXIN_KEY_ORDER[i] < mixed_key.length) {
        result += mixed_key[MIXIN_KEY_ORDER[i]];
      }
    }
    
    return result;
  },
  
  // 对参数进行WBI签名
  sign(params) {
    if (!this.img_key || !this.sub_key) {
      console.error("[BilibiliExp] WBI密钥未初始化");
      return params;
    }
    
    // 添加时间戳和随机数
    params.wts = Math.floor(Date.now() / 1000);
    
    // 对参数排序
    const query = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // 计算w_rid
    const wrid = md5(query + this.getMixinKey());
    
    // 返回带签名的参数
    return {
      ...params,
      w_rid: wrid
    };
  }
};

// 用户信息模块
const UserInfo = {
  // 获取用户信息
  async get() {
    try {
      const res = await request({
        url: API.NAV,
        method: "GET"
      });
      
      if (res.code === 0) {
        return {
          isLogin: res.data.isLogin,
          money: res.data.money,
          uname: res.data.uname,
          level_info: res.data.level_info,
          isVip: res.data.vipStatus === 1 || res.data.vip_status === 1, // 检查是否为大会员
          vipType: res.data.vipType || res.data.vip_type || 0 // 大会员类型
        };
      }
      return null;
    } catch (err) {
      console.error("[BilibiliExp] 获取用户信息失败", err);
      return null;
    }
  }
};

// 每日奖励模块
const DailyReward = {
  // 获取每日奖励状态
  async getStatus() {
    try {
      const res = await request({
        url: API.REWARD,
        method: "GET"
      });
      
      if (res.code === 0) {
        // 如果数据不包含level_info，获取用户信息以补充
        if (!res.data.level_info) {
          console.log("[BilibiliExp] 奖励API返回数据不包含等级信息，尝试从用户信息获取");
          const userInfo = await UserInfo.get();
          if (userInfo && userInfo.level_info) {
            res.data.level_info = userInfo.level_info;
            // 添加大会员状态信息
            res.data.isVip = userInfo.isVip;
            res.data.vipType = userInfo.vipType;
          } else {
            // 尝试从页面元素获取
            res.data.level_info = this.getUserLevelInfo();
            // 页面中无法可靠获取大会员状态，设为false
            res.data.isVip = false;
          }
        }
        
        // 补充大会员观看经验获取状态
        res.data.vipExp = VIPExpModule.hasGotVipExp();
        
        return res.data;
      }
      return null;
    } catch (err) {
      console.error("[BilibiliExp] 获取每日奖励状态失败", err);
      return null;
    }
  },
  
  // 计算升级所需天数
  calculateDaysToUpgrade(rewardInfo) {
    // 增强防御性检查
    if (!rewardInfo || !rewardInfo.level_info) {
      console.warn("[BilibiliExp] 无法计算升级天数：缺少等级信息");
      return 0;
    }
    
    const { current_level, current_exp, next_exp } = rewardInfo.level_info;
    
    // 确保所有需要的字段都存在
    if (current_level === undefined || current_exp === undefined || next_exp === undefined) {
      console.warn("[BilibiliExp] 无法计算升级天数：等级信息不完整");
      return 0;
    }
    
    if (current_level >= 6) return 0;
    
    // 根据是否为大会员确定每日经验值
    const exp_per_day = rewardInfo.isVip ? 75 : 65;
    return Math.ceil((next_exp - current_exp) / exp_per_day);
  },
  
  // 从页面元素获取用户等级信息
  getUserLevelInfo() {
    // 尝试从页面元素获取等级信息
    try {
      // 尝试从顶部用户信息获取
      const levelElement = document.querySelector('.user-level') || 
                          document.querySelector('.level-info') ||
                          document.querySelector('[class*="level"]');
      
      if (levelElement) {
        const levelText = levelElement.textContent || '';
        const levelMatch = levelText.match(/Lv\.(\d+)/);
        if (levelMatch && levelMatch[1]) {
          const level = parseInt(levelMatch[1]);
          // 创建一个简单的等级信息对象
          return {
            current_level: level,
            current_exp: 0,
            next_exp: level >= 6 ? 0 : 1
          };
        }
      }
      
      // 备选：检查页面中是否有其他地方显示了等级
      const pageContent = document.body.textContent || '';
      const levelMatches = pageContent.match(/LV\.(\d+)/i) || pageContent.match(/等级[：:]?\s*(\d+)/);
      if (levelMatches && levelMatches[1]) {
        const level = parseInt(levelMatches[1]);
        return {
          current_level: level,
          current_exp: 0,
          next_exp: level >= 6 ? 0 : 1
        };
      }
    } catch (err) {
      console.error("[BilibiliExp] 从页面获取等级信息失败", err);
    }
    
    // 如果无法从页面获取，返回默认值
    console.log("[BilibiliExp] 无法从页面获取等级信息，使用默认值");
    return {
      current_level: 0,
      current_exp: 0,
      next_exp: 1
    };
  }
};

// 投币模块
const CoinModule = {
  // 给视频投币
  async add(aid, num = 1) {
    if (!aid) return { code: -1, message: "视频ID为空" };
    
    const csrf = getCookie("bili_jct");
    if (!csrf) return { code: -1, message: "未获取到CSRF令牌" };
    
    // 准备参数并添加WBI签名
    const params = WBI.sign({
      aid: aid,
      multiply: num,
      select_like: 1,
      csrf: csrf
    });
    
    try {
      const res = await request({
        url: API.COIN_ADD,
        method: "POST",
        data: params
      });
      
      return res;
    } catch (err) {
      console.error("[BilibiliExp] 投币失败", err);
      return { code: -1, message: "投币请求失败" };
    }
  }
};

// 分享模块
const ShareModule = {
  // 分享视频
  async share(aid) {
    if (!aid) return { code: -1, message: "视频ID为空" };
    
    const csrf = getCookie("bili_jct");
    if (!csrf) return { code: -1, message: "未获取到CSRF令牌" };
    
    // 准备参数并添加WBI签名
    const params = WBI.sign({
      aid: aid,
      csrf: csrf
    });
    
    try {
      const res = await request({
        url: API.SHARE,
        method: "POST",
        data: params
      });
      
      return res;
    } catch (err) {
      console.error("[BilibiliExp] 分享失败", err);
      return { code: -1, message: "分享请求失败" };
    }
  }
};

// 大会员经验模块
const VIPExpModule = {
  // 本地存储键名
  STORAGE_KEY: 'bili_vip_exp_status',
  
  // 检查是否已获取大会员观看经验
  hasGotVipExp() {
    const status = this.getStoredStatus();
    if (!status) return false;
    
    // 检查日期是否为今天
    const today = new Date().toDateString();
    if (status.date !== today) {
      // 如果不是今天的记录，返回false
      return false;
    }
    
    return status.hasGotExp === true;
  },
  
  // 获取存储状态
  getStoredStatus() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("[BilibiliExp] 读取本地存储状态失败", err);
    }
    return null;
  },
  
  // 存储状态
  saveStatus(hasGotExp) {
    try {
      const status = {
        date: new Date().toDateString(),
        hasGotExp: hasGotExp
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
    } catch (err) {
      console.error("[BilibiliExp] 保存本地存储状态失败", err);
    }
  },
  
  // 获取大会员观看经验
  async getVipExp() {
    // 检查是否已经获取过
    if (this.hasGotVipExp()) {
      console.log("[BilibiliExp] 今日已获取过大会员观看经验");
      return { code: 0, message: "已经获取过", data: { is_grant: true } };
    }
    
    const csrf = getCookie("bili_jct");
    if (!csrf) {
      return { code: -1, message: "未获取到CSRF令牌" };
    }
    
    // 准备参数
    const params = {
      csrf: csrf
    };
    
    try {
      const res = await request({
        url: API.VIP_EXP,
        method: "POST",
        data: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      // //打印res字符串
      // console.log(res);

      //{code: 69198, message: '用户经验已经领取', ttl: 1, data: {is_grant:false, type: 0}}
      if (res.code === 69198) {
        this.saveStatus(true);
        console.log("[BilibiliExp] 用户已经领取过大会员经验");
      }

      // 如果获取成功，更新本地存储
      if (res.code === 0 && res.data && res.data.is_grant) {
        this.saveStatus(true);
        console.log("[BilibiliExp] 成功获取大会员观看经验");
      } else {
        console.log(`[BilibiliExp] 获取大会员观看经验失败: ${res.message || '未知错误'}`);
      }
      
      return res;
    } catch (err) {
      console.error("[BilibiliExp] 获取大会员观看经验失败", err);
      return { code: -1, message: "请求失败" };
    }
  }
};

// UI渲染模块
const UIRenderer = {
  // 插入经验统计界面
  async renderExpStats() {
    if (!CONFIG.SHOW_STATS) return;
    
    try {
      const rewardInfo = await DailyReward.getStatus();
      if (!rewardInfo) {
        console.error("[BilibiliExp] 无法获取奖励状态，取消统计显示");
        return false;
      }
      
      // 创建图标样式
      this.insertIconStyle();
      
      // 准备统计数据
      const statsData = this.prepareStatsData(rewardInfo);
      
      // 检查是否获取到了统计数据
      if (!statsData || statsData.length === 0) {
        console.error("[BilibiliExp] 统计数据为空，取消显示");
        return false;
      }
      
      // 尝试创建一个我们自己的容器，避免修改B站元素
      // 首先查找是否已经存在我们的容器
      let ourContainer = document.querySelector(".bili-exp-container");
      
      if (!ourContainer) {
        // 获取工具栏位置 - 尝试多个可能的选择器
        const toolbarSelectors = [
          ".video-toolbar-v1",            // 原始选择器
          ".video-toolbar-container",     // 2024年可能的新选择器
          ".bpx-player-video-toolbar",    // B站可能的播放器工具栏
          ".video-info-container",        // 视频信息容器
          ".video-info-operation",        // 操作按钮区域
          ".video-tool-bar",              // 可能的工具栏类名
          ".bili-video-toolbar",          // 另一个可能的工具栏类名
          ".operation-list",              // 操作列表
          "[data-type='toolbar']"         // 通过数据属性查找
        ];
        
        // 尝试查找工具栏
        let toolbar = null;
        for (const selector of toolbarSelectors) {
          toolbar = document.querySelector(selector);
          if (toolbar) {
            console.log(`[BilibiliExp] 找到工具栏元素: ${selector}`);
            
            // 使用辅助函数应用样式
            this.applyToolbarStyle(toolbar, selector);
            
            // 创建我们自己的容器，附加到工具栏
            ourContainer = document.createElement("div");
            ourContainer.className = "bili-exp-container";
            // 通过插入而不是appendChild，避免可能的DOM冲突
            try {
              toolbar.insertAdjacentElement('beforeend', ourContainer);
              console.log(`[BilibiliExp] 成功在${selector}中插入容器`);
            } catch (e) {
              console.error(`[BilibiliExp] 插入容器失败，尝试appendChild`, e);
              try {
                toolbar.appendChild(ourContainer);
              } catch (e2) {
                console.error(`[BilibiliExp] appendChild也失败`, e2);
                // 继续尝试其他容器
                ourContainer = null;
                continue;
              }
            }
            break;
          }
        }
        
        if (!ourContainer) {
          // 降级方案 - 尝试查找其他可能的容器
          const alternativeContainers = [
            ".video-container-v1",          // 视频容器
            ".bpx-player-container",        // 播放器容器
            "#bilibili-player",             // 播放器元素
            "#playerWrap",                  // 播放器包装
            ".player-wrap",                 // 播放器包装
            ".video-container"              // 通用视频容器
          ];
          
          for (const selector of alternativeContainers) {
            const container = document.querySelector(selector);
            if (container) {
              console.log(`[BilibiliExp] 找到替代容器: ${selector}`);
              // 创建我们自己的容器
              ourContainer = document.createElement("div");
              ourContainer.className = "bili-exp-container";
              ourContainer.style.cssText = "margin-top: 10px; padding: 8px; background: rgba(0,0,0,0.03); border-radius: 6px;";
              
              try {
                container.insertAdjacentElement('beforeend', ourContainer);
              } catch (e) {
                console.error(`[BilibiliExp] 插入容器失败，尝试appendChild`, e);
                try {
                  container.appendChild(ourContainer);
                } catch (e2) {
                  console.error(`[BilibiliExp] appendChild也失败`, e2);
                  // 继续尝试其他容器
                  ourContainer = null;
                  continue;
                }
              }
              break;
            }
          }
        }
      }
      
      if (!ourContainer) {
        // 最终降级方案 - 直接添加到页面底部
        console.log("[BilibiliExp] 未找到任何合适的容器，将添加到页面底部");
        ourContainer = document.createElement("div");
        ourContainer.className = "bili-exp-container bili-exp-toolbar-fallback";
        ourContainer.style.cssText = "position: fixed; bottom: 10px; right: 10px; padding: 8px; background: rgba(0,0,0,0.7); color: white; border-radius: 8px; z-index: 9999;";
        document.body.appendChild(ourContainer);
      }
      
      // 检查是否已经有统计容器
      let statsContainer = ourContainer.querySelector(".bili-exp-stats");
      if (!statsContainer) {
        // 如果没有，创建新的统计容器
        statsContainer = document.createElement("div");
        statsContainer.className = "bili-exp-stats";
        ourContainer.appendChild(statsContainer);
      }
      
      // 更新统计内容
      statsContainer.innerHTML = this.generateStatsHTML(statsData);
      return true;
    } catch (err) {
      console.error("[BilibiliExp] 渲染经验统计时出错", err);
      return false;
    }
  },
  
  // 插入图标样式
  insertIconStyle() {
    // 避免重复插入
    if (document.getElementById("bili-exp-style")) return;
    
    const style = document.createElement("style");
    style.id = "bili-exp-style";
    style.textContent = `
      .bili-exp-stats {
        margin-top: 10px;
        padding: 8px;
        background: rgba(0,0,0,0.03);
        border-radius: 6px;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 100%; /* 确保占用全宽 */
        box-sizing: border-box; /* 确保padding不增加宽度 */
      }
      .bilibili-exp-toolbar-fallback .bili-exp-stats {
        background: transparent;
        margin-top: 0;
      }
      .bili-exp-stats span {
        margin: 4px 4px; /* 减小水平间距 */
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 90px; /* 减小最小宽度，更容易适应小空间 */
        max-width: 120px; /* 限制最大宽度 */
        padding: 2px 4px; /* 保持内边距 */
        flex-grow: 0; /* 防止自动拉伸 */
      }
      /* 特定统计项样式 */
      .bili-exp-stat-item {
        transition: all 0.2s ease;
        border-radius: 4px;
      }
      .bili-exp-stat-item:hover {
        background: rgba(0,0,0,0.05);
      }
      .bilibili-exp-toolbar-fallback .bili-exp-stat-item:hover {
        background: rgba(255,255,255,0.1);
      }
      @media screen and (max-width: 768px) {
        .bili-exp-stats span {
          min-width: 70px; /* 在小屏幕上进一步减小 */
          margin: 2px 2px;
        }
      }
      .bili-exp-stats span small {
        color: #999;
      }
      .bilibili-exp-toolbar-fallback .bili-exp-stats span small {
        color: #ddd;
      }
      .bili-exp-stats .completed {
        color: #fb7299;
      }
      .bili-exp-stats .incomplete {
        color: #666;
      }
      .bilibili-exp-toolbar-fallback .bili-exp-stats .incomplete {
        color: #ccc;
      }
      .bili-exp-stats i {
        margin-right: 5px;
        font-size: 18px;
      }
      /* 使用我们的自定义类修改工具栏样式 */
      .bili-exp-enhanced-toolbar {
        display: flex !important;
        flex-wrap: wrap !important;
        row-gap: 8px !important;
        align-items: center !important;
      }
      /* 针对插入到toolbar的统计容器的特殊样式 */
      .bili-exp-enhanced-toolbar .bili-exp-stats {
        margin-top: 4px !important;
        width: 100% !important;
        order: 999 !important; /* 确保显示在底部 */
      }
      .bili-exp-stats .icon-login:before { content: "\\e62b"; }
      .bili-exp-stats .icon-share:before { content: "\\e614"; }
      .bili-exp-stats .icon-play:before { content: "\\e616"; }
      .bili-exp-stats .icon-coin:before { content: "\\e60a"; }
      .bili-exp-stats .icon-total:before { content: "\\e619"; }
      .bili-exp-stats .icon-day:before { content: "\\e61e"; }
      .bili-exp-stats .icon-vip:before { content: "\\e630"; }
    `;
    document.head.appendChild(style);
    
    // 加载图标字体
    if (!document.querySelector('link[href*="font_1537779_4srood2g1uk.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "//at.alicdn.com/t/font_1537779_4srood2g1uk.css";
      document.head.appendChild(link);
    }
  },
  
  // 安全地应用样式到工具栏
  applyToolbarStyle(toolbar, selector) {
    try {
      // 首先检查toolbar是否有效
      if (!toolbar || typeof toolbar !== 'object' || !toolbar.classList) {
        console.error(`[BilibiliExp] 工具栏元素无效: ${selector}`);
        return false;
      }
      
      // 添加我们自己的标识类，而不是直接修改style
      toolbar.classList.add("bili-exp-enhanced-toolbar");
      
      // 记录我们修改了该元素，便于调试
      console.log(`[BilibiliExp] 为${selector}添加bili-exp-enhanced-toolbar类`);
      
      return true;
    } catch (err) {
      console.error(`[BilibiliExp] 应用工具栏样式失败:`, err);
      return false;
    }
  },
  
  // 准备统计数据
  prepareStatsData(rewardInfo) {
    // 参数校验
    if (!rewardInfo) {
      console.error("[BilibiliExp] 无法准备统计数据：奖励信息为空");
      return [];
    }
    
    let total = 0;
    const data = [];
    
    // 登录经验（检查字段是否存在）
    const hasLogin = typeof rewardInfo.login === 'boolean' ? rewardInfo.login : false;
    total += hasLogin ? 5 : 0;
    data.push({
      ok: hasLogin,
      name: "每日登录",
      text: (hasLogin ? 5 : 0) + "/5",
      className: "icon-login"
    });
    
    // 分享经验（检查字段是否存在）
    const hasShare = typeof rewardInfo.share === 'boolean' ? rewardInfo.share : false;
    total += hasShare ? 5 : 0;
    data.push({
      ok: hasShare,
      name: "分享视频",
      text: (hasShare ? 5 : 0) + "/5",
      className: "icon-share"
    });
    
    // 观看经验（检查字段是否存在）
    const hasWatch = typeof rewardInfo.watch === 'boolean' ? rewardInfo.watch : false;
    total += hasWatch ? 5 : 0;
    data.push({
      ok: hasWatch,
      name: "观看视频",
      text: (hasWatch ? 5 : 0) + "/5",
      className: "icon-play"
    });
    
    // 投币经验（检查字段是否存在）
    const coins = typeof rewardInfo.coins === 'number' ? rewardInfo.coins : 0;
    total += coins;
    data.push({
      ok: coins >= 50,
      name: "视频投币",
      text: coins + "/50",
      className: "icon-coin"
    });
    
    // 大会员观看经验（仅对大会员显示）
    if (rewardInfo.isVip) {
      const hasVipExp = rewardInfo.vipExp === true;
      const vipExpValue = hasVipExp ? 10 : 0;
      total += vipExpValue;
      data.push({
        ok: hasVipExp,
        name: "大会员观看",
        text: vipExpValue + "/10",
        className: "icon-vip",
        tooltip: hasVipExp ? "已获取大会员观看经验" : "大会员观看视频可获得10经验"
      });
    }
    
    // 总计
    data.push({
      ok: total >= (rewardInfo.isVip ? 75 : 65),
      name: "总计",
      text: total + "/" + (rewardInfo.isVip ? "75" : "65"),
      className: "icon-total"
    });
    
    // 升级天数（添加防御性检查）
    const daysToUpgrade = DailyReward.calculateDaysToUpgrade(rewardInfo);
    
    // 确保level_info存在且有current_level字段
    if (rewardInfo.level_info && typeof rewardInfo.level_info.current_level === 'number') {
      if (rewardInfo.level_info.current_level >= 6) {
        data.push({
          ok: true,
          name: "一个成熟的六级大佬",
          text: "六级辣",
          className: "icon-day"
        });
      } else {
        // 安全访问 current_level
        const nextLevel = (rewardInfo.level_info.current_level || 0) + 1;
        data.push({
          ok: false,
          name: `到 ${nextLevel} 级预计`,
          text: daysToUpgrade + " 天",
          className: "icon-day"
        });
      }
    } else {
      // 如果没有等级信息，显示占位符
      data.push({
        ok: false,
        name: "等级信息",
        text: "未知",
        className: "icon-day"
      });
    }
    
    return data;
  },
  
  // 生成经验统计HTML
  generateStatsHTML(data) {
    if (!data || !data.length) return "";
    
    return data.map(item => {
      const className = item.ok ? "completed" : "incomplete";
      // 构建基本HTML，添加更好的样式类
      let html = `<span class="${className} bili-exp-stat-item" title="${item.tooltip || ''}" ${item.onClick ? `onclick="${item.onClick}"` : ""}>
        <i class="${item.className} iconfont"></i>${item.name}: ${item.text}`;
      
      html += '</span>';
      return html;
    }).join("");
  }
};

// 工具函数
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// AJAX请求封装
async function request(options) {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      xhrFields: { withCredentials: true },
      crossDomain: true
    };
    
    // 合并选项
    const opt = { ...defaultOptions, ...options };
    
    // 如果是POST，自动添加Content-Type
    if (opt.method === 'POST' && !opt.headers) {
      opt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }
    
    // 发送请求
    GM.xmlHttpRequest({
      method: opt.method,
      url: opt.url,
      data: typeof opt.data === 'string' ? opt.data : new URLSearchParams(opt.data).toString(),
      headers: opt.headers,
      onload: function(response) {
        try {
          const res = JSON.parse(response.responseText);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
}

// 等待函数
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取视频ID
function getVideoId() {
  try {
    // 新版B站页面中获取AID
    const videoData = unsafeWindow.__INITIAL_STATE__;
    if (videoData && videoData.aid) {
      return videoData.aid;
    }
    
    // 尝试从URL中获取
    const urlMatch = location.href.match(/\/video\/(\w+)/);
    if (urlMatch && unsafeWindow.bvid) {
      return unsafeWindow.aid || null;
    }
    
    return null;
  } catch (error) {
    console.error("[BilibiliExp] 获取视频ID失败", error);
    return null;
  }
}

// 主函数
async function main() {
  // 初始化WBI签名
  await WBI.init();
  
  // 获取视频ID
  const aid = getVideoId();
  if (!aid) {
    console.error("[BilibiliExp] 无法获取视频ID");
    return;
  }
  
  // 获取用户信息
  const userInfo = await UserInfo.get();
  if (!userInfo || !userInfo.isLogin) {
    console.error("[BilibiliExp] 用户未登录");
    return;
  }
  
  // 获取奖励状态
  const rewardStatus = await DailyReward.getStatus();
  if (!rewardStatus) {
    console.error("[BilibiliExp] 获取奖励状态失败");
    return;
  }
  
  // 自动分享
  if (CONFIG.AUTO_SHARE && !rewardStatus.share) {
    console.log("[BilibiliExp] 尝试分享视频");
    const shareResult = await ShareModule.share(aid);
    if (shareResult && shareResult.code === 0) {
      console.log("[BilibiliExp] 分享成功");
    }
  }
  
  // 自动投币
  if (CONFIG.AUTO_COIN && rewardStatus.coins < 50 && userInfo.money > 5) {
    const coinNum = Math.min(CONFIG.COIN_NUMBER, Math.floor((50 - rewardStatus.coins) / 10));
    if (coinNum > 0) {
      console.log(`[BilibiliExp] 尝试投${coinNum}个币`);
      const coinResult = await CoinModule.add(aid, coinNum);
      if (coinResult && coinResult.code === 0) {
        console.log(`[BilibiliExp] 投币成功`);
      }
    }
  }
  
  // 如果是大会员，尝试获取观看经验
  if (CONFIG.AUTO_VIP_EXP && userInfo.isVip) {
    console.log("[BilibiliExp] 检测到大会员账号，尝试获取观看经验");
    // 直接尝试获取经验，API会判断是否满足条件
    VIPExpModule.getVipExp().then(result => {
      if (result.code === 0) {
        console.log("[BilibiliExp] 大会员经验获取成功");
        // 刷新统计显示
        UIRenderer.renderExpStats();
      } else {
        console.log(`[BilibiliExp] 大会员经验获取结果: ${result.message || '未知'}`);
      }
    });
  }
  
  // 渲染经验统计 - 增加延迟和重试机制
  let attempts = 0;
  const maxAttempts = 10; // 增加最大尝试次数
  const attemptRender = async () => {
    await wait(3000); // 增加等待时间，确保页面加载完毕
    try {
      // 首先检查页面是否已经加载完成
      if (document.readyState !== "complete") {
        console.log(`[BilibiliExp] 页面尚未完全加载，等待后重试...`);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(attemptRender, 2000); // 2秒后重试
        }
        return;
      }
      
      // 检查关键元素是否存在
      const pageLoaded = !!document.querySelector(".video-toolbar-container") || 
                        !!document.querySelector(".bpx-player-video-toolbar") ||
                        !!document.querySelector(".video-info-container");
      
      if (!pageLoaded) {
        console.log(`[BilibiliExp] 关键页面元素尚未加载，等待后重试...`);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(attemptRender, 2000); // 2秒后重试
        }
        return;
      }
      
      const result = await UIRenderer.renderExpStats();
      if (result === false && attempts < maxAttempts) {
        console.log(`[BilibiliExp] 渲染尝试 ${attempts + 1}/${maxAttempts} 失败，将重试...`);
        attempts++;
        setTimeout(attemptRender, 3000); // 3秒后重试，增加等待时间
      }
    } catch (e) {
      console.error("[BilibiliExp] 渲染经验统计出错", e);
      if (attempts < maxAttempts) {
        console.log(`[BilibiliExp] 渲染尝试 ${attempts + 1}/${maxAttempts} 失败，将重试...`);
        attempts++;
        setTimeout(attemptRender, 3000); // 3秒后重试，增加等待时间
      }
    }
  };
  
  // 开始渲染尝试
  attemptRender();
}

// 页面加载完成后初始化
(function() {
  // 等待页面加载完成
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("[BilibiliExp] 页面已加载，延迟5秒执行初始化...");
    setTimeout(main, 5000); // 增加到5秒
  } else {
    console.log("[BilibiliExp] 等待页面加载...");
    window.addEventListener("load", () => {
      console.log("[BilibiliExp] 页面加载完成，延迟5秒执行初始化...");
      setTimeout(main, 5000); // 使用load事件，确保完全加载，并延迟5秒
    });
  }
})(); 