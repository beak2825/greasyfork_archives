// ==UserScript==
// @name         沖浪高手檢測機
// @namespace    https://github.com/SomiaWhiteRing/weibo-toilet-test/
// @license      MIT
// @version      0.2
// @description  检测微博用户的发言浓度
// @author       苍旻白轮
// @match        *://weibo.com/u/*
// @match        *://www.weibo.com/u/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520371/%E6%B2%96%E6%B5%AA%E9%AB%98%E6%89%8B%E6%AA%A2%E6%B8%AC%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/520371/%E6%B2%96%E6%B5%AA%E9%AB%98%E6%89%8B%E6%AA%A2%E6%B8%AC%E6%A9%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 测试模式开关
  const DEBUG_MODE = false;  // 设为 true 开启测试模式

  // 词库定义
  const STORAGE_KEY = 'weibo-toilet-words';
  const TITLE_STORAGE_KEY = 'weibo-toilet-title';

  const defaultWords = [
    "完完全全我", "女王", "这真的是我", "笑死我了", "女王一枚", "本宝", "互关", "啊啊啊啊啊这真的是我",
    "本宝宝", "我对老公", "我对室友", "态度", "心情", "熏情", "mood", "木的", "好想吃", "我帮他",
    "我真的会这样", "互关爱吃", "呃呃呃", "他/她怎么了", "就是那个谁", "那个谁真的死了", "我就长这样",
    "你长得好吗", "你不要这样说好吗", "我老了以后", "互关老了以后", "扣一下", "很好笑", "好那个", "我老公",
    "吃一下omg", "欧米茄", "天呐", "天哪", "这也太", "妈妈", "尊的是我", "长成这样我不知道我", "那里好痒",
    "本女子", "我那里有事", "湿了", "是谁", "私我", "谢谢老公", "谢谢宝宝", "嗯嘟", "我们来了",
    "我们走了", "隐隐约约听说", "我帮你", "还以为是**走了出来", "我跟你们有钱人拼了", "我要卖了",
    "穷", "焦虑", "受不了了", "fjgjdnvid", "求你们看", "这一次我一定要赢", "slau", "崩溃", "b溃了", "奔溃",
    "笑得好崩溃", "做不到这样别和我", "我老公必须这样", "我不行了", "好想鼠", "不想", "活了", "wob我不行了",
    "咋了集美", "秒了", "一秒睡了", "哭了", "喷了", "哭了", "够了", "服了", "我真的在哭", "泪流满面了",
    "我老公呢", "我的老公在哪里", "我和老公", "笑得我那里疼", "好想尖叫", "尖叫了", "wflbb", "我文化水平",
    "我做题", "我解决问题", "哎呦喂", "我求你了", "年度视频", "年度",
    "legend", "iconic", "对不起", "我下跪", "对不已", "寸不己", "已构成一种", "喂", "首页又在", "这是在干什么",
    "我真的要双了", "我真的要拉黑了", "再发一个试试呢", "好嫉妒", "好季度", "好羡慕", "好精彩", "强势围观",
    "我天呢", "没什么好说的", "封神", "好封神", "好震撼", "好美", "好米", "好难听", "概念感觉", "好丑",
    "好穷", "有点像那个谁", "这可以是我们", "闺蜜", "诡秘", "好闺蜜", "彪子", "怎么办",
    "谁能送我", "好想要", "那个了", "怎么火了", "已举办", "谁问了", "没人问", "小姐姐你", "姐妹你", "这是在干什么",
    "谁来管管", "别逼我", "我不知道这世界到底怎么了", "怎么你了", "什么意思呢", "我请问", "不认识", "nbcs", "我是",
    "换id了", "前世是", "互关帮我转转", "早就说过"
  ];

  let words; // 改为变量声明
  let activeWords; // 将 activeWords 改为变量声明

  // 修改获取或初始化词库函数
  function initializeWords() {
    let storedWords = localStorage.getItem(STORAGE_KEY);
    if (!storedWords) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWords));
      words = defaultWords;
    } else {
      words = JSON.parse(storedWords);
    }
    // 根据测试模式决定使用��词库
    activeWords = DEBUG_MODE ? words.slice(0, 10) : words;
  }

  // 在词库定义后立即执行初始化
  initializeWords();

  GM_addStyle(`
        .toilet-check-btn {
            display: inline-block;
            padding: 4px 8px;
            margin-left: 8px;
            border-radius: 4px;
            background: #ff8200;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
            vertical-align: middle;
            outline: none !important;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        .toilet-check-btn:focus {
            outline: none !important;
            box-shadow: none !important;
        }

        .toilet-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }

        .toilet-modal-content {
            position: relative;
            width: 600px;
            margin: 100px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
        }

        .toilet-dialog {
            border: none;
            border-radius: 12px;
            padding: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        }

        .toilet-dialog:focus {
            outline: none;
        }

        .toilet-dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }

        .toilet-header {
            position: sticky;
            top: 0;
            padding: 16px 80px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 1;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .toilet-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .toilet-close-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            transform: rotate(90deg);
        }

        .toilet-close-btn::before,
        .toilet-close-btn::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 2px;
            background: #666;
            border-radius: 1px;
        }

        .toilet-close-btn::before {
            transform: rotate(45deg);
        }

        .toilet-close-btn::after {
            transform: rotate(-45deg);
        }

        .toilet-content {
            flex: 1;
            overflow-y: auto;
            border: none;
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: rgba(78, 205, 196, 0.6) transparent;
        }

        .toilet-content::-webkit-scrollbar {
            width: 8px;
        }

        .toilet-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .toilet-content::-webkit-scrollbar-thumb {
            background-color: rgba(78, 205, 196, 0.6);
            border-radius: 4px;
        }

        .toilet-title {
            font-size: 32px;
            font-weight: 600;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
        }

        .toilet-progress-container {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 24px auto;
        }

        .toilet-progress-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(
                #4ECDC4 var(--progress-percent),
                #eee var(--progress-percent)
            );
            transition: all 0.3s ease;
        }

        .toilet-progress-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 160px;
            height: 160px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #333;
        }

        .toilet-result-container {
            padding: 20px;
            border-radius: 8px;
            background: rgba(245, 245, 245, 0.9);
        }

        .toilet-chart-container {
            margin-top: 24px;
            padding: 16px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .toilet-keywords-cloud {
            margin-top: 24px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }

        .toilet-keyword-item {
            padding: 6px 12px;
            border-radius: 16px;
            background: rgba(78, 205, 196, 0.1);
            color: #4ECDC4;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .toilet-keyword-item:hover {
            background: rgba(78, 205, 196, 0.2);
            transform: translateY(-2px);
        }

        .github-corner {
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 12px 0 8px 0;
            transform: scale(-0.7, 0.7);
            transform-origin: top left;
        }

        .github-corner svg {
            fill: #151513;
            color: #fff;
            position: absolute;
            top: 0;
            left: -80px;
            border: 0;
            outline: none !important;
        }

        .github-corner:focus-visible {
            outline: none !important;
        }

        .github-corner svg:focus-visible {
            outline: none !important;
        }

        .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
        }

        @keyframes octocat-wave {
            0%, 100% { transform: rotate(0) }
            20%, 60% { transform: rotate(25deg) }
            40%, 80% { transform: rotate(-10deg) }
        }
    `);

  // 自定义日志函数
  const log = (...args) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  };

  const error = (...args) => {
    if (DEBUG_MODE) {
      console.error(...args);
    }
  };

  // 初始化
  function init() {
    // 先找到头像元素
    const avatarMain = document.querySelector('.woo-avatar-main');
    if (avatarMain) {
      // 找到头像后面的元素中的目标容器
      const container = avatarMain.nextElementSibling?.querySelector('.woo-box-flex.woo-box-alignCenter');
      if (container) {
        addButton(container);
      }
    }
  }

  // 添加按钮
  function addButton(container) {
    // 检查按钮是否已存在
    if (!container.querySelector('.toilet-check-btn')) {
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '8px';

      // 检测按钮
      const checkButton = document.createElement('div');
      checkButton.className = 'toilet-check-btn';
      checkButton.textContent = '🚽';
      checkButton.onclick = startCheck;

      // 编辑按钮
      const editButton = document.createElement('div');
      editButton.className = 'toilet-check-btn toilet-edit-btn';
      editButton.textContent = '📝';
      editButton.style.backgroundColor = '#808080';
      editButton.onclick = openWordEditor;

      buttonContainer.appendChild(checkButton);
      buttonContainer.appendChild(editButton);
      container.appendChild(buttonContainer);
      console.log('按钮添加成功!');
    }
  }

  // 监视DOM变化
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      const avatarMain = document.querySelector('.woo-avatar-main');
      if (avatarMain) {
        const container = avatarMain.nextElementSibling?.querySelector('.woo-box-flex.woo-box-alignCenter');
        if (container) {
          addButton(container);
        }
      }
    });

    // 监视整个文档
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 动态加载 Chart.js
  function loadChartJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 等待 Chart.js 加载完成再初始化
  loadChartJs().then(() => {
    init();
    observeDOM();
  }).catch(err => {
    console.error('加载 Chart.js 失败:', err);
  });

  // 创建并显示对话框
  function createDialog() {
    // 保存html原始的overflow值
    const originalOverflow = document.documentElement.style.overflow;
    // 设置html为hidden以防止滚动
    document.documentElement.style.overflow = 'hidden';

    const dialog = document.createElement('dialog');
    dialog.className = 'toilet-dialog';
    dialog.style.width = '80%';
    dialog.style.height = '80%';
    dialog.style.maxWidth = '1280px';
    document.body.appendChild(dialog);

    // 创建固定的头部
    const header = document.createElement('div');
    header.className = 'toilet-header';
    dialog.appendChild(header);

    // 添加 GitHub 角标
    const githubCorner = document.createElement('a');
    githubCorner.href = 'https://github.com/SomiaWhiteRing/weibo-toilet-test';  // 替换为你的 GitHub 仓库地址
    githubCorner.className = 'github-corner';
    githubCorner.setAttribute('target', '_blank');
    githubCorner.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 250 250">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" class="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
    `;
    header.appendChild(githubCorner);

    const title = document.createElement('div');
    title.className = 'toilet-title';
    title.textContent = localStorage.getItem(TITLE_STORAGE_KEY) || '廁言廁語檢測機';
    header.appendChild(title);

    // 添加关闭按钮（默认隐藏）
    const closeBtn = document.createElement('div');
    closeBtn.className = 'toilet-close-btn';
    closeBtn.onclick = () => {
      dialog.close();
      // 恢复html的overflow
      document.documentElement.style.overflow = originalOverflow;
    };
    header.appendChild(closeBtn);

    // 创建可滚动的内容区域
    const content = document.createElement('div');
    content.className = 'toilet-content';
    dialog.appendChild(content);

    const progressContainer = document.createElement('div');
    progressContainer.className = 'toilet-progress-container';
    content.appendChild(progressContainer);

    const progressCircle = document.createElement('div');
    progressCircle.className = 'toilet-progress-circle';
    progressContainer.appendChild(progressCircle);

    const progressInner = document.createElement('div');
    progressInner.className = 'toilet-progress-inner';
    progressContainer.appendChild(progressInner);

    // 监听dialog关闭事件，清理内容
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = originalOverflow;
      // 清理内容
      content.innerHTML = '';
      dialog.remove(); // 完全移除dialog元素
    });

    dialog.showModal();
    return { dialog, progressCircle, progressInner, content, closeBtn };
  }

  // 修改 RequestPool 类
  class RequestPool {
    constructor(maxConcurrent, logFn, errorFn) {
      this.maxConcurrent = maxConcurrent;
      this.running = 0;
      this.queue = [];
      this.results = {};
      this.completedCount = 0;
      this.totalCount = 0;
      this.onProgress = null;
      this.log = logFn;
      this.error = errorFn;

      // 错误频率检测
      this.errorTimes = [];
      this.isWaiting = false;

      // 添加重试计数器
      this.retryCount = new Map();
    }

    // 检查错误频率
    checkErrorFrequency() {
      const now = Date.now();
      // 清理超过1秒的错误记录
      this.errorTimes = this.errorTimes.filter(time => now - time < 1000);
      // 添加新的错误时间
      this.errorTimes.push(now);

      // 如果1秒内错误次数超过10次
      if (this.errorTimes.length >= 10) {
        return true;
      }
      return false;
    }

    async add(task) {
      this.totalCount++;
      if (this.running >= this.maxConcurrent) {
        await new Promise(resolve => this.queue.push(resolve));
      }
      this.running++;
      try {
        const result = await task();
        this.results[result.keyword] = result.count;
      } catch (error) {
        // 获取当前任务的关键词
        const keyword = await task().catch(e => e.keyword);

        // 更新重试计数
        const currentRetries = this.retryCount.get(keyword) || 0;
        this.retryCount.set(keyword, currentRetries + 1);

        this.error(`任务失败，关键词 "${keyword}" 第 ${currentRetries + 1} 次重试:`, error);

        // 检查重试次数
        if (currentRetries < 10) {
          // 检查错误频率
          if (this.checkErrorFrequency() && !this.isWaiting) {
            this.isWaiting = true;
            this.error('检测到频繁错误，等待3秒后继续...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.errorTimes = []; // 清空错误记录
            this.isWaiting = false;
          }

          this.add(task);
          return;
        } else {
          this.error(`关键词 "${keyword}" 已达到最大重试次数，跳过`);
          this.results[keyword] = 0; // 将结果设为0
        }
      } finally {
        this.running--;
        this.completedCount++;
        if (this.onProgress) {
          this.onProgress(this.completedCount / this.totalCount * 100);
        }
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next();
        }
      }
    }

    async waitForAll() {
      while (this.running > 0 || this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.results;
    }
  }

  // 修改主检流程
  async function startCheck() {
    log('开始检测流程');
    const userId = location.href.match(/https:\/\/(?:www\.)?weibo\.com\/u\/(\d+)/)?.[1];
    if (!userId) {
      error('无法获取用户ID');
      alert('错误：无法从URL获取用户ID');
      return;
    }
    log(`获取到用户ID: ${userId}`);

    const { dialog, progressCircle, progressInner, content, closeBtn } = createDialog();

    // 创建请求池时传入日志函数
    const pool = new RequestPool(5, log, error);

    // 设置进度回调
    pool.onProgress = (percent) => {
      progressCircle.style.setProperty('--progress-percent', `${percent}%`);
      progressInner.textContent = `${Math.round(percent)}%`;
    };

    // 将所有任务添加到池中
    const tasks = activeWords.map(word => () => {
      // 添加随机延迟，避免请求过于集中
      const randomDelay = Math.random() * 200;
      return new Promise(resolve => setTimeout(resolve, randomDelay))
        .then(() => checkKeyword(userId, word));
    });

    // 启动所有任务
    await Promise.all(tasks.map(task => pool.add(task)));

    // 等待所有任务完成
    const wordCounts = await pool.waitForAll();

    // 绘制结果
    drawChart(dialog, wordCounts);
  }

  // 修改 checkKeyword 函数，添加关键词信息到错误对象
  async function checkKeyword(userId, keyword) {
    log(`开始检查关键词: ${keyword}`);
    try {
      const baseUrl = location.href.includes('www.weibo.com') ?
        'https://www.weibo.com' :
        'https://weibo.com';

      const response = await fetch(`${baseUrl}/ajax/statuses/searchProfile?uid=${userId}&q=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (!response.ok || !data.data) {
        const error = new Error('请求失败');
        error.keyword = keyword;
        throw error;
      }

      return {
        keyword,
        count: data.data.total || 0
      };
    } catch (error) {
      error.keyword = keyword;
      error(`检查关键词 "${keyword}" 失败:`, error);
      throw error;
    }
  }

  // 绘制结果图表
  function drawChart(dialog, wordCounts) {
    const header = dialog.querySelector('.toilet-header');
    const content = dialog.querySelector('.toilet-content');
    const closeBtn = dialog.querySelector('.toilet-close-btn');

    // 显示关闭按钮
    closeBtn.style.display = 'flex';

    // 保留header，清空content
    content.innerHTML = '';
    header.querySelector('.toilet-title').textContent = localStorage.getItem(TITLE_STORAGE_KEY) || '廁言廁語檢測機';

    const resultContainer = document.createElement('div');
    resultContainer.className = 'toilet-result-container';
    content.appendChild(resultContainer);

    const chartContainer = document.createElement('div');
    chartContainer.className = 'toilet-chart-container';
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    resultContainer.appendChild(chartContainer);

    // 序词频
    const sortedWords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a);

    // 绘制图表
    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: sortedWords.slice(0, 15).map(([word]) => word),
        datasets: [{
          label: '出现次数',
          data: sortedWords.slice(0, 15).map(([, count]) => count),
          backgroundColor: 'rgba(78, 205, 196, 0.6)',
          borderColor: 'rgba(78, 205, 196, 1)',
          borderWidth: 1,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '高频词汇统计',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // 创建关键词云
    const keywordsCloud = document.createElement('div');
    keywordsCloud.className = 'toilet-keywords-cloud';
    sortedWords.slice(15).forEach(([word, count]) => {
      if (count == 0) return;
      const keywordItem = document.createElement('div');
      keywordItem.className = 'toilet-keyword-item';
      keywordItem.textContent = `${word} (${count})`;
      keywordsCloud.appendChild(keywordItem);
    });
    resultContainer.appendChild(keywordsCloud);
  }

  // 添加词库编辑器相关样式
  GM_addStyle(`
    .toilet-edit-textarea {
        width: calc(100% - 40px);
        height: 400px;
        margin: 20px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: monospace;
        resize: vertical;
        box-sizing: border-box;
    }

    .toilet-title-input {
        width: 100%;
        padding: 8px;
        font-size: 24px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background: transparent;
        color: inherit;
        text-align: center;
        font-weight: 600;
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        box-sizing: border-box;
    }

    .toilet-title-input:focus {
        outline: none;
        border-color: rgba(78, 205, 196, 0.5);
    }

    .toilet-save-btn {
        display: block;
        margin: 0 auto;
        padding: 8px 24px;
        border: none;
        border-radius: 20px;
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .toilet-save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `);

  // 添加词库编辑器功能
  function openWordEditor() {
    const { dialog, content } = createDialog();

    // 隐藏进度条相关元素
    content.querySelector('.toilet-progress-container')?.remove();

    // 将标题改为可编辑的输入框
    const titleElement = dialog.querySelector('.toilet-title');
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'toilet-title-input';
    // 从 localStorage 读取标题，如果没有则使用默认标题
    titleInput.value = localStorage.getItem(TITLE_STORAGE_KEY) || '廁言廁語檢測機';
    titleInput.placeholder = '输入标题';
    titleElement.replaceWith(titleInput);

    // 创建文本区域
    const textarea = document.createElement('textarea');
    textarea.className = 'toilet-edit-textarea';
    textarea.value = JSON.parse(localStorage.getItem(STORAGE_KEY)).join('\n');
    content.appendChild(textarea);

    // 创建保存按钮
    const saveButton = document.createElement('button');
    saveButton.className = 'toilet-save-btn';
    saveButton.textContent = '保存更改';
    saveButton.onclick = () => {
      const newWords = textarea.value
        .split('\n')
        .map(word => word.trim())
        .filter(word => word);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWords));
      localStorage.setItem(TITLE_STORAGE_KEY, titleInput.value);

      // 重新初始化词库
      initializeWords();

      dialog.close();
    };
    content.appendChild(saveButton);

    // 修改关闭按钮的处理方式
    const closeBtn = dialog.querySelector('.toilet-close-btn');
    closeBtn.style.display = 'flex';
    closeBtn.onclick = () => {
      content.innerHTML = ''; // 清理内容
      dialog.close();
      dialog.remove(); // 完全移除dialog元素
    };
  }
})();
