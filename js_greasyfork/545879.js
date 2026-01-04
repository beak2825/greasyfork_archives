// ==UserScript==
// @ts-nocheck
// @name         微软Rewards自动搜索脚本 - 通用版
// @version      3.1.0
// @description  微软Rewards自动搜索获取积分 - 通用版本：智能环境检测、手动启动控制、搜索词缓存、暂停模式记忆、优化通知提示
// @author       lutiancheng1
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      MIT
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    personal-rewards-script-universal
// @downloadURL https://update.greasyfork.org/scripts/545879/%E5%BE%AE%E8%BD%AFRewards%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%20-%20%E9%80%9A%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545879/%E5%BE%AE%E8%BD%AFRewards%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%20-%20%E9%80%9A%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

// 环境检测
const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));
const isStay = navigator.userAgent.includes('Stay') || window.location.href.includes('stay');
const isPCEnvironment = !isMobile && !isStay;

// 只在首次加载时打印环境信息
if (!window.rewardsScriptLoaded) {
  console.log('🚀 微软Rewards脚本初始化');
  console.log('环境检测:', {
    platform: isPCEnvironment ? 'PC版' : '移动版',
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  });
  window.rewardsScriptLoaded = true;
}

// 根据环境设置参数
const config = {
  maxRewards: isPCEnvironment ? 40 : 30,
  pauseTime: isPCEnvironment ? 300000 : 240000, // PC版5分钟，移动版4分钟
  searchDelay: isPCEnvironment ?
    () => Math.floor(Math.random() * 20000) + 10000 : // PC版10-30秒随机
    () => Math.floor(Math.random() * 15000) + 30000, // 移动版30-45秒随机
  enableStringObfuscation: isPCEnvironment, // 只有PC版启用字符串混淆
  scrollDuration: isPCEnvironment ? 4000 : 5000, // PC版4秒，移动版5秒（更慢更自然）
  platformName: isPCEnvironment ? 'PC版' : '移动版'
};

// 全局变量
var search_words = [];
var appkey = ""; // 用户可通过菜单设置自己的故梦API密钥
var enable_pause = false;
var isTaskStopped = false; // 添加停止标志
var isTaskManuallyStarted = false; // 添加手动启动标志

// 热搜API配置
var hotSearchAPI = {
  name: "故梦热门词API",
  url: "https://api.gmya.net/Api/",
  sources: ['BaiduHot', 'WeiBoHot', 'TouTiaoHot', 'DouYinHot'],
  parser: (data) => data.data && data.data.map(item => item.title)
};

// 默认搜索词
var default_search_words = [
  "人工智能发展趋势", "新能源汽车技术", "量子计算突破", "5G网络应用", "区块链技术创新",
  "元宇宙概念解析", "机器学习算法", "云计算服务", "物联网应用", "大数据分析",
  "网络安全防护", "移动支付发展", "电商平台创新", "在线教育模式", "远程办公趋势",
  "智能家居系统", "无人驾驶技术", "虚拟现实体验", "增强现实应用", "生物识别技术",
  "绿色能源发展", "环保科技创新", "可持续发展", "数字化转型", "智慧城市建设",
  "医疗科技进步", "基因编辑技术", "精准医疗", "健康管理系统", "运动科学研究",
  "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻",
  "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
  "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用",
  "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神"
];

// 统一的每日缓存系统（支持平台区分）
function getTodayKey() {
  const today = new Date();
  const dateKey = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  return `${dateKey}_${config.platformName}`;
}

function getTodayCount() {
  try {
    const todayKey = getTodayKey();
    const savedData = GM_getValue('dailyProgress', '{}');
    // 确保savedData是有效的JSON字符串
    if (!savedData || typeof savedData !== 'string') {
      console.log(`获取dailyProgress失败，使用默认值`);
      return 0;
    }

    let progressData;
    try {
      progressData = JSON.parse(savedData);
    } catch (e) {
      console.log(`解析dailyProgress失败: ${e.message}，使用默认值`);
      return 0;
    }

    // 确保progressData是对象且todayKey存在
    if (!progressData || typeof progressData !== 'object') {
      console.log(`dailyProgress不是有效对象，使用默认值`);
      return 0;
    }

    // 确保todayKey对应的值存在
    if (progressData[todayKey] === undefined || progressData[todayKey] === null) {
      return 0;
    }

    return progressData[todayKey] || 0;
  } catch (error) {
    console.log(`getTodayCount出错: ${error.message}，使用默认值`);
    return 0;
  }
}

function saveTodayCount(count) {
  try {
    const todayKey = getTodayKey();
    const savedData = GM_getValue('dailyProgress', '{}');

    // 确保savedData是有效的JSON字符串
    if (!savedData || typeof savedData !== 'string') {
      console.log(`获取dailyProgress失败，使用空对象初始化`);
      GM_setValue('dailyProgress', '{}');
      // 避免递归调用可能导致的栈溢出
      setTimeout(() => saveTodayCount(count), 100);
      return;
    }

    let progressData;
    try {
      progressData = JSON.parse(savedData);
    } catch (e) {
      console.log(`解析dailyProgress失败: ${e.message}，使用空对象初始化`);
      GM_setValue('dailyProgress', '{}');
      // 避免递归调用可能导致的栈溢出
      setTimeout(() => saveTodayCount(count), 100);
      return;
    }

    // 确保progressData是对象
    if (!progressData || typeof progressData !== 'object') {
      console.log(`dailyProgress不是有效对象，使用空对象初始化`);
      GM_setValue('dailyProgress', '{}');
      // 避免递归调用可能导致的栈溢出
      setTimeout(() => saveTodayCount(count), 100);
      return;
    }

    // 确保count是数字
    const numCount = typeof count === 'number' ? count : parseInt(count) || 0;
    progressData[todayKey] = numCount;

    // 清理7天前的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.getFullYear() + '-' + (sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0') + '-' + sevenDaysAgo.getDate().toString().padStart(2, '0');
    const cutoffKey = `${cutoffDate}_${config.platformName}`;

    Object.keys(progressData).forEach(key => {
      if (key < cutoffKey) {
        delete progressData[key];
      }
    });

    GM_setValue('dailyProgress', JSON.stringify(progressData));
    console.log(`${config.platformName}今日进度已保存:`, todayKey, '=', numCount);
  } catch (error) {
    console.log(`saveTodayCount出错: ${error.message}`);
    // 出错时尝试重置进度数据
    try {
      GM_setValue('dailyProgress', '{}');
      console.log('已重置进度数据');
    } catch (e) {
      console.log(`重置进度数据失败: ${e.message}`);
    }
  }
}

// 保存暂停模式设置
function savePauseMode(enablePause) {
  const key = `pauseMode_${config.platformName}`;
  GM_setValue(key, enablePause);
  console.log(`${config.platformName}暂停模式已保存:`, enablePause);
}

// 获取暂停模式设置
function getPauseMode() {
  const key = `pauseMode_${config.platformName}`;
  return GM_getValue(key, false); // 默认不启用暂停
}

// 保存手动启动标志
function saveManualStartFlag(isStarted) {
  const key = `manualStart_${config.platformName}`;
  GM_setValue(key, isStarted);
  console.log(`${config.platformName}手动启动标志已保存:`, isStarted);
}

// 获取手动启动标志
function getManualStartFlag() {
  const key = `manualStart_${config.platformName}`;
  return GM_getValue(key, false);
}

// 清除手动启动标志
function clearManualStartFlag() {
  const key = `manualStart_${config.platformName}`;
  GM_setValue(key, false);
  console.log(`${config.platformName}手动启动标志已清除`);
}

// 保存搜索词缓存
function saveSearchWordsCache(words) {
  const today = new Date();
  const dateKey = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  const cacheKey = `searchWords_${config.platformName}_${dateKey}`;

  const cacheData = {
    words: words,
    timestamp: Date.now(),
    date: dateKey
  };

  GM_setValue(cacheKey, JSON.stringify(cacheData));
  console.log(`${config.platformName}搜索词缓存已保存:`, dateKey, words.length, '条');
}

// 获取搜索词缓存
function getSearchWordsCache() {
  const today = new Date();
  const dateKey = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  const cacheKey = `searchWords_${config.platformName}_${dateKey}`;

  const cacheData = GM_getValue(cacheKey, null);
  if (cacheData) {
    try {
      const parsed = JSON.parse(cacheData);
      if (parsed.date === dateKey && parsed.words && parsed.words.length > 0) {
        // 简化日志输出
        return parsed.words;
      }
    } catch (error) {
      console.log('搜索词缓存解析失败:', error);
    }
  }

  return null;
}

// 清理过期的搜索词缓存（优化版）
function cleanupSearchWordsCache() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 只检查过去7天的缓存键
  for (let i = 1; i <= 7; i++) {
    const testDate = new Date(sevenDaysAgo);
    testDate.setDate(testDate.getDate() - i); // 检查更早的日期

    const dateKey = testDate.getFullYear() + '-' + (testDate.getMonth() + 1).toString().padStart(2, '0') + '-' + testDate.getDate().toString().padStart(2, '0');
    const cacheKey = `searchWords_${config.platformName}_${dateKey}`;

    const cacheData = GM_getValue(cacheKey, null);
    if (cacheData) {
      GM_setValue(cacheKey, null); // 删除过期缓存
      console.log('清理过期搜索词缓存:', dateKey);
    }
  }
}

// AppKey管理功能
function loadAppKey() {
  const savedKey = GM_getValue('userAppKey', '');
  if (savedKey) {
    appkey = savedKey;
    console.log('已加载用户设置的AppKey');
  }
}

function saveAppKey(key) {
  GM_setValue('userAppKey', key);
  appkey = key;
  console.log('AppKey已保存');
}

function showAppKeyDialog() {
  const currentKey = GM_getValue('userAppKey', '');
  const newKey = prompt(`设置故梦API密钥（可选）：\n\n• 有密钥：获取更稳定的热搜词\n• 无密钥：使用免费额度\n• 申请地址：https://www.gmya.net/api\n\n当前密钥：${currentKey ? '已设置' : '未设置'}`, currentKey);

  if (newKey !== null) {
    if (newKey.trim() === '') {
      GM_setValue('userAppKey', '');
      appkey = '';
      showNotification('AppKey已清空，将使用免费额度', 'info');
    } else {
      saveAppKey(newKey.trim());
      showNotification('AppKey已保存，重新加载词库以生效', 'success');
      // 重新加载搜索词
      getHotSearchWords().then(words => {
        search_words = words;
        const isHotWords = !words.includes("人工智能发展趋势");
        const wordType = isHotWords ? '热门搜索词' : '默认搜索词';
        showNotification(`词库已更新：${wordType}`, 'success');
      });
    }
  }
}

// 清除今日进度的函数
function clearTodayProgress() {
  const currentProgress = getTodayCount();

  // 即使进度为0，也可能需要重置其他状态和跳转首页
  const hasOtherStates = isTaskManuallyStarted || enable_pause || getManualStartFlag() || getPauseMode();

  if (currentProgress === 0 && !hasOtherStates) {
    // 进度为0且没有其他状态，直接跳转首页
    showNotification(`${config.platformName}今日进度已经是0，直接跳转到首页`, 'info');
    setTimeout(() => {
      location.href = "https://www.bing.com/";
    }, 1500);
    return;
  }

  const progressText = currentProgress === 0 ? '0（但可能有其他状态需要重置）' : `${currentProgress}`;
  const confirmMessage = `确定要重置${config.platformName}所有任务状态并跳转到首页吗？\n\n当前进度：${progressText} / ${config.maxRewards} 次\n\n将重置以下内容：\n• 今日搜索进度\n• 任务运行状态\n• 暂停模式设置\n• 手动启动标志\n\n保留：API密钥、搜索词缓存\n\n重置后将跳转到首页重新开始。`;

  if (confirm(confirmMessage)) {
    // 1. 清除今日进度缓存
    const todayKey = getTodayKey();
    const savedData = GM_getValue('dailyProgress', '{}');
    const progressData = JSON.parse(savedData);

    if (progressData[todayKey]) {
      delete progressData[todayKey];
      GM_setValue('dailyProgress', JSON.stringify(progressData));
    }

    // 2. 清除所有运行时状态变量
    isTaskStopped = true;           // 停止当前任务
    isTaskManuallyStarted = false;  // 清除手动启动标志
    enable_pause = false;           // 清除暂停模式

    // 3. 清除所有持久化的任务状态（保留用户设置如API密钥）
    clearManualStartFlag();         // 清除持久化的手动启动标志
    savePauseMode(false);          // 清除持久化的暂停模式设置

    // 注意：不清除以下用户设置
    // - userAppKey: 用户的API密钥设置
    // - searchWords_*: 搜索词缓存（用户可能想保留）

    console.log(`${config.platformName}所有任务状态已重置：`);
    console.log(`✅ 今日进度: ${currentProgress} -> 0`);
    console.log(`✅ 任务状态: 已停止`);
    console.log(`✅ 暂停模式: 已关闭`);
    console.log(`✅ 手动启动标志: 已清除`);
    console.log(`ℹ️  保留用户设置: API密钥、搜索词缓存`);

    const statusText = currentProgress === 0 ? '所有任务状态已重置' : '今日进度和所有状态已清除';
    showNotification(`${config.platformName}${statusText}\n即将跳转到首页重新开始`, 'success');

    // 4. 清除完毕后跳转到首页
    setTimeout(() => {
      location.href = "https://www.bing.com/";
    }, 2000); // 2秒后跳转，让用户看到通知
  }
}

// 初始化时加载用户的AppKey
loadAppKey();

// 字符串混淆函数（仅PC版使用）
function AutoStrTrans(st) {
  if (!config.enableStringObfuscation) return st;

  let yStr = st;
  let rStr = "";
  let zStr = "";
  let prePo = 0;
  for (let i = 0; i < yStr.length;) {
    let step = Math.floor(Math.random() * 5) + 1;
    if (i > 0) {
      zStr = zStr + yStr.substr(prePo, i - prePo) + rStr;
      prePo = i;
    }
    i = i + step;
  }
  if (prePo < yStr.length) {
    zStr = zStr + yStr.substr(prePo, yStr.length - prePo);
  }
  return zStr;
}

// 生成带次数后缀的搜索词（移动版功能）
function generateSearchWord(baseWord, searchCount) {
  if (config.enableStringObfuscation) {
    // PC版使用字符串混淆
    return AutoStrTrans(baseWord);
  } else {
    // 移动版使用次数后缀
    const suffixes = [
      " 第" + searchCount + "次",
      " " + searchCount + "号",
      " 搜索" + searchCount,
      " #" + searchCount,
      " (" + searchCount + ")",
      " 查询" + searchCount,
      " 了解" + searchCount,
      " 研究" + searchCount
    ];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return baseWord + randomSuffix;
  }
}

// 生成随机字符串
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 获取热门搜索词的函数
function getHotSearchWords() {
  return new Promise((resolve) => {
    console.log("开始获取热门搜索词...");

    const allWords = [];
    const sources = hotSearchAPI.sources;
    let completedRequests = 0;
    let successfulRequests = 0;

    // 根据平台动态计算每个数据源需要获取的词汇数量
    const wordsPerSource = isPCEnvironment ? 10 : 8;

    // 为每个数据源发送请求
    sources.forEach((source, index) => {
      let url = hotSearchAPI.url + source;
      if (appkey) {
        url += "?format=json&appkey=" + appkey;
      }

      console.log(`请求 ${source}:`, url);

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        onload: function (response) {
          completedRequests++;

          try {
            if (response.status === 200) {
              const data = JSON.parse(response.responseText);
              const words = hotSearchAPI.parser(data);

              if (words && words.length > 0) {
                // 过滤并根据平台取相应数量的词汇
                const filteredWords = words.filter(word =>
                  word && word.length >= 2 && word.length <= 20 &&
                  !word.includes('http') && !word.includes('www') &&
                  !word.includes('undefined') && word.trim() !== ''
                ).slice(0, wordsPerSource);

                if (filteredWords.length > 0) {
                  allWords.push(...filteredWords);
                  successfulRequests++;
                  console.log(`✅ ${source} 成功获取 ${filteredWords.length} 条词汇`);
                }
              }
            } else {
              console.log(`❌ ${source} HTTP错误:`, response.status);
            }
          } catch (error) {
            console.log(`❌ ${source} 解析失败:`, error.message);
          }

          checkCompletion();
        },
        onerror: function (error) {
          completedRequests++;
          console.log(`❌ ${source} 请求失败:`, error);
          checkCompletion();
        },
        ontimeout: function () {
          completedRequests++;
          console.log(`❌ ${source} 请求超时`);
          checkCompletion();
        }
      });
    });

    // 检查所有请求是否完成
    function checkCompletion() {
      if (completedRequests === sources.length) {
        if (allWords.length >= 10) {
          // 打乱顺序并取前30条
          const shuffledWords = allWords.sort(() => Math.random() - 0.5).slice(0, config.maxRewards);
          console.log(`✅ 成功组合热搜词: ${shuffledWords.length} 条，来自 ${successfulRequests} 个数据源`);
          resolve(shuffledWords);
        } else {
          console.log(`❌ 热搜词数量不足: ${allWords.length} 条，使用默认搜索词`);
          resolve(default_search_words.slice(0, config.maxRewards));
        }
      }
    }

    // 设置总体超时
    setTimeout(() => {
      if (completedRequests < sources.length) {
        console.log("⏰ 部分请求超时，使用已获取的词汇");
        if (allWords.length >= 10) {
          const shuffledWords = allWords.sort(() => Math.random() - 0.5).slice(0, config.maxRewards);
          resolve(shuffledWords);
        } else {
          resolve(default_search_words.slice(0, config.maxRewards));
        }
      }
    }, 5000);
  });
}

// 初始化搜索词（热门词缓存一天，默认词每次尝试更新）
function initializeSearchWords() {
  // 先尝试从缓存获取
  const cachedWords = getSearchWordsCache();

  if (cachedWords) {
    const isHotWords = !cachedWords.includes("人工智能发展趋势");

    if (isHotWords) {
      // 如果缓存的是热门搜索词，直接使用
      search_words = cachedWords;
      const wordType = '热门搜索词（缓存）';
      // 简化日志输出

      // 完成初始化
      completeInitialization(wordType, cachedWords.length);
    } else {
      // 如果缓存的是默认搜索词，尝试重新获取热门搜索词
      console.log(`${config.platformName}检测到缓存为默认搜索词，尝试获取热门搜索词...`);
      attemptToGetHotWords(cachedWords);
    }
  } else {
    // 缓存不存在，从网络获取
    console.log(`${config.platformName}缓存不存在，从网络获取搜索词...`);
    attemptToGetHotWords(null);
  }
}

// 尝试获取热门搜索词
function attemptToGetHotWords(fallbackWords) {
  getHotSearchWords()
    .then(words => {
      search_words = words;
      const isHotWords = !words.includes("人工智能发展趋势");
      const wordType = isHotWords ? '热门搜索词' : '默认搜索词';
      // 简化日志输出

      // 保存到缓存
      saveSearchWordsCache(words);

      // 完成初始化
      completeInitialization(wordType, words.length);
    })
    .catch(error => {
      console.error("获取搜索词失败:", error);

      if (fallbackWords) {
        // 使用缓存的默认搜索词
        search_words = fallbackWords;
        console.log(`${config.platformName}网络获取失败，使用缓存的默认搜索词库，共 ${fallbackWords.length} 条`);
        completeInitialization('默认搜索词（缓存）', fallbackWords.length);
      } else {
        // 使用内置的默认搜索词
        search_words = default_search_words.slice(0, config.maxRewards);
        console.log(`${config.platformName}网络获取失败，使用内置默认搜索词库，共 ${search_words.length} 条`);

        // 保存默认搜索词到缓存
        saveSearchWordsCache(search_words);

        // 完成初始化
        completeInitialization('默认搜索词', search_words.length);
      }
    });
}

// 完成初始化的通用函数
function completeInitialization(wordType, wordCount) {
  // 清理过期缓存
  cleanupSearchWordsCache();

  // 词库加载完成后，检查当前页面状态
  setTimeout(() => {
    // 检查是否需要执行任务
    const isPauseResume = window.location.href.includes('br_msg=Please-Wait');
    const hasManualStartFlag = getManualStartFlag();
    const isSearchPage = window.location.href.includes('/search?') || window.location.href.includes('cn.bing.com/search');
    const todayCount = getTodayCount();
    const hasRunningTask = todayCount > 0 && !isTaskStopped;

    if (isPauseResume || hasManualStartFlag) {
      exec();
    } else if (isSearchPage && hasRunningTask) {
      exec();
    }
  }, 1000);

  // 只在首页打印一次初始化信息
  const currentCount = getTodayCount();
  const isHomePage = window.location.href === 'https://www.bing.com/' ||
    (window.location.href.includes('bing.com') && !window.location.href.includes('/search'));

  if (isHomePage && !window.rewardsInitPrinted) {
    console.log(`✅ ${config.platformName}脚本就绪 | 词库：${wordType}(${wordCount}条) | 进度：${currentCount}/${config.maxRewards}`);
    window.rewardsInitPrinted = true;
  }
}

// 启动初始化
initializeSearchWords();

// 根据环境创建不同的菜单
if (isPCEnvironment) {
  // PC版菜单
  let menu1 = GM_registerMenuCommand('🚀 PC版开始', function () {
    isTaskStopped = false; // 重置停止状态
    isTaskManuallyStarted = false; // 重置手动启动状态，由startPCSearchTask设置
    startPCSearchTask(true); // PC版默认启用暂停模式
  }, 'o');

  let menu2 = GM_registerMenuCommand('⏹️ 停止搜索', function () {
    isTaskStopped = true;
    isTaskManuallyStarted = false;
    clearManualStartFlag(); // 清除手动启动标志
    enable_pause = false;
    savePauseMode(false); // 清除暂停模式设置
    showNotification(`${config.platformName}搜索任务已停止`, 'warning');
    console.log(`${config.platformName}搜索任务已停止`);
  }, 'o');

  let menu3 = GM_registerMenuCommand('📊 今日进度', function () {
    const todayCount = getTodayCount();
    const remaining = Math.max(0, config.maxRewards - todayCount);
    const progress = Math.round((todayCount / config.maxRewards) * 100);
    const statusText = isTaskStopped ? '已停止' : '就绪';
    const wordType = search_words.includes("人工智能发展趋势") ? '默认搜索词' : '热门搜索词';

    showNotification(`${config.platformName}状态报告：\n\n今日进度：${todayCount} / ${config.maxRewards} 次 (${progress}%)\n剩余次数：${remaining} 次\n任务状态：${statusText}\n词库类型：${wordType} (${search_words.length}条)`, 'info');
  }, 'o');

  let menu4 = GM_registerMenuCommand('🔑 设置API密钥', function () {
    showAppKeyDialog();
  }, 'o');

  let menu5 = GM_registerMenuCommand('🔄 刷新词库', function () {
    showNotification('正在从多个数据源刷新搜索词库...', 'info');
    getHotSearchWords()
      .then(words => {
        search_words = words;
        const isHotWords = !words.includes("人工智能发展趋势");
        const wordType = isHotWords ? '热门搜索词' : '默认搜索词';

        // 更新缓存
        saveSearchWordsCache(words);

        showNotification(`搜索词库已更新：${wordType}\n共 ${words.length} 条词汇\n示例：${words.slice(0, 3).join('、')}\n\n缓存已更新`, 'success');
      })
      .catch(error => {
        search_words = default_search_words.slice(0, config.maxRewards);
        saveSearchWordsCache(search_words);
        showNotification('刷新搜索词库失败，使用默认词库\n缓存已更新', 'error');
      });
  }, 'o');

  let menu6 = GM_registerMenuCommand('🗑️ 清除今日进度', function () {
    clearTodayProgress();
  }, 'o');

} else {
  // 移动版菜单
  let menu1 = GM_registerMenuCommand('📱 快速开始（无暂停）', function () {
    isTaskStopped = false; // 重置停止状态
    isTaskManuallyStarted = false; // 重置手动启动状态，由startSearchTask设置
    startSearchTask(false);
  }, 'o');

  let menu1_safe = GM_registerMenuCommand('🛡️ 安全开始（带暂停）', function () {
    isTaskStopped = false; // 重置停止状态
    isTaskManuallyStarted = false; // 重置手动启动状态，由startSearchTask设置
    startSearchTask(true);
  }, 'o');

  let menu2 = GM_registerMenuCommand('⏹️ 停止任务', function () {
    isTaskStopped = true;
    isTaskManuallyStarted = false;
    clearManualStartFlag(); // 清除手动启动标志
    enable_pause = false;
    savePauseMode(false); // 清除暂停模式设置
    showNotification('搜索任务已停止', 'warning');
    console.log(`${config.platformName}搜索任务已停止`);
  }, 'o');

  let menu3 = GM_registerMenuCommand('📊 今日进度', function () {
    const todayCount = getTodayCount();
    const remainingCount = Math.max(0, config.maxRewards - todayCount);
    const progressPercent = Math.round((todayCount / config.maxRewards) * 100);
    const statusText = isTaskStopped ? '已停止' : '就绪';
    const wordType = search_words && search_words.includes("人工智能发展趋势") ? '默认搜索词' : '热门搜索词';
    const wordCount = search_words ? search_words.length : 0;

    showNotification(`${config.platformName}状态报告 v3.0.0：\n\n今日进度：${todayCount} / ${config.maxRewards} 次 (${progressPercent}%)\n剩余次数：${remainingCount} 次\n任务状态：${statusText}\n词库类型：${wordType} (${wordCount}条)`, 'info');
  }, 'o');

  let menu4 = GM_registerMenuCommand('🔑 设置API密钥', function () {
    showAppKeyDialog();
  }, 'o');

  let menu5 = GM_registerMenuCommand('🔄 刷新词库', function () {
    showNotification('正在从多个数据源刷新搜索词库...', 'info');
    getHotSearchWords()
      .then(words => {
        search_words = words;
        const isHotWords = !words.includes("人工智能发展趋势");
        const wordType = isHotWords ? '热门搜索词' : '默认搜索词';

        // 更新缓存
        saveSearchWordsCache(words);

        showNotification(`搜索词库已更新：${wordType}\n共 ${words.length} 条词汇\n示例：${words.slice(0, 3).join('、')}\n\n缓存已更新`, 'success');
      })
      .catch(error => {
        search_words = default_search_words.slice(0, config.maxRewards);
        saveSearchWordsCache(search_words);
        showNotification('刷新搜索词库失败，使用默认词库\n缓存已更新', 'error');
      });
  }, 'o');

  let menu6 = GM_registerMenuCommand('📝 查看所有搜索词', function () {
    if (search_words.length === 0) {
      showNotification('搜索词库为空，请先刷新词库', 'warning');
      return;
    }

    const isHotWords = !search_words.includes("人工智能发展趋势");
    const wordType = isHotWords ? '热门搜索词' : '默认搜索词';

    showSearchWordsModal(search_words, wordType);
  }, 'o');

  let menu7 = GM_registerMenuCommand('🗑️ 清除今日进度', function () {
    clearTodayProgress();
  }, 'o');


}

// PC版开始搜索任务函数
function startPCSearchTask(enablePause) {
  const currentCount = getTodayCount();
  const remaining = Math.max(0, config.maxRewards - currentCount);

  if (currentCount >= config.maxRewards) {
    showNotification(`${config.platformName}搜索任务已完成！已执行 ${currentCount} 次搜索。`, 'success');
    return;
  }

  // 重置停止标志并设置手动启动标志
  isTaskStopped = false;
  isTaskManuallyStarted = true;
  saveManualStartFlag(true); // 保存手动启动标志到本地存储
  enable_pause = enablePause;
  savePauseMode(enablePause); // 保存暂停模式设置
  const modeText = '安全模式（每5次暂停5分钟）';

  showNotification(`开始执行搜索任务 - ${modeText}\n已完成：${currentCount} / ${config.maxRewards} 次\n剩余：${remaining} 次`, 'info');
  console.log(`开始${config.platformName}搜索任务 - ${modeText}，已完成：${currentCount} 次，剩余：${remaining} 次`);

  // 直接在当前页面开始执行搜索任务，不需要跳转
  console.log("PC版任务启动，直接开始执行搜索逻辑");
  setTimeout(() => {
    exec(); // 直接执行搜索逻辑
  }, 1000);
}

// 统一的开始搜索任务函数（移动版）
function startSearchTask(enablePause) {
  const todayCount = getTodayCount();
  const remainingCount = config.maxRewards - todayCount;

  if (remainingCount <= 0) {
    showNotification('今日搜索任务已完成！已执行 ' + todayCount + ' 次搜索。', 'success');
    return;
  }

  // 重置停止标志并设置手动启动标志
  isTaskStopped = false;
  isTaskManuallyStarted = true;
  saveManualStartFlag(true); // 保存手动启动标志到本地存储
  enable_pause = enablePause;
  savePauseMode(enablePause); // 保存暂停模式设置
  const modeText = enablePause ? '安全模式（每5次暂停4分钟）' : '快速模式（无暂停）';

  showNotification('开始执行搜索任务 - ' + modeText + '\n今日已执行：' + todayCount + ' 次，剩余：' + remainingCount + ' 次', 'info');

  // 直接在当前页面开始执行搜索任务，不需要跳转
  console.log("移动版任务启动，直接开始执行搜索逻辑");
  setTimeout(() => {
    exec(); // 直接执行搜索逻辑
  }, 1000);
}



// 显示搜索词弹窗的函数（移动版功能）
function showSearchWordsModal(words, wordType) {
  const existingModal = document.getElementById('search-words-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'search-words-modal';
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
    `;

  const modal = document.createElement('div');
  modal.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        max-width: 80%;
        max-height: 80%;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

  const header = document.createElement('div');
  header.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
  header.innerHTML = `
        <span>📝 当前搜索词库 (${wordType} - 共${words.length}条)</span>
        <span id="modal-close-btn" style="cursor: pointer; font-size: 24px; opacity: 0.8; user-select: none;">×</span>
    `;

  // 为关闭按钮添加事件监听器
  const closeButton = header.querySelector('#modal-close-btn');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      overlay.remove();
    });
  }

  const content = document.createElement('div');
  content.style.cssText = `
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
        line-height: 1.6;
    `;

  const wordsList = document.createElement('div');
  wordsList.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 10px;
    `;

  words.forEach((word, index) => {
    const wordItem = document.createElement('div');
    wordItem.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            color: #495057;
            transition: all 0.2s ease;
            cursor: pointer;
        `;
    wordItem.innerHTML = `<strong>${index + 1}.</strong> ${word}`;

    wordItem.addEventListener('mouseover', () => {
      wordItem.style.background = '#e3f2fd';
      wordItem.style.borderColor = '#2196f3';
      wordItem.style.transform = 'translateY(-1px)';
    });
    wordItem.addEventListener('mouseout', () => {
      wordItem.style.background = '#f8f9fa';
      wordItem.style.borderColor = '#e9ecef';
      wordItem.style.transform = 'translateY(0)';
    });

    wordsList.appendChild(wordItem);
  });

  content.appendChild(wordsList);
  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);

  const style = document.createElement('style');
  style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: scale(0.9) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
    `;
  document.head.appendChild(style);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  document.body.appendChild(overlay);
}

// 创建页面内通知的函数
function showNotification(message, type = 'info') {
  const existingNotification = document.getElementById('rewards-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'rewards-notification';
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 350px;
        padding: 15px 20px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        white-space: pre-line;
    `;

  const colors = {
    'info': { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
    'success': { bg: '#e8f5e8', border: '#4caf50', text: '#2e7d32' },
    'warning': { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' },
    'error': { bg: '#ffebee', border: '#f44336', text: '#c62828' }
  };

  const color = colors[type] || colors.info;
  notification.style.backgroundColor = color.bg;
  notification.style.border = `2px solid ${color.border}`;
  notification.style.color = color.text;

  notification.textContent = message;

  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        opacity: 0.7;
    `;
  closeBtn.addEventListener('click', () => notification.remove());
  notification.appendChild(closeBtn);

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// 主执行函数（只在用户手动启动或暂停恢复时执行）
function exec() {
  console.log("=== exec() 函数开始执行 ===");
  console.log("当前页面URL:", window.location.href);
  console.log("平台:", config.platformName);

  // 检查是否已停止任务
  if (isTaskStopped) {
    console.log("任务已停止，不执行搜索");
    return;
  }

  // 检查页面状态
  const isSearchPage = window.location.href.includes('/search?') || window.location.href.includes('cn.bing.com/search');
  const isPauseResume = window.location.href.includes('br_msg=Please-Wait');
  const isBingPage = window.location.href.includes('bing.com');

  // 如果不是Bing相关页面，则不执行
  if (!isBingPage) {
    console.log("当前页面不是Bing页面，不执行搜索逻辑");
    return;
  }

  // 获取当前任务状态
  let todayCount = getTodayCount();
  const searchTaskStarted = sessionStorage.getItem('searchTaskStarted') === 'true';
  const hasRunningTask = (todayCount > 0 || searchTaskStarted) && !isTaskStopped;
  const hasManualStartFlag = getManualStartFlag(); // 检查持久化的手动启动标志

  console.log(`页面状态检查: 搜索页=${isSearchPage}, 暂停恢复=${isPauseResume}, 搜索任务已启动=${searchTaskStarted}, 有运行任务=${hasRunningTask}, 今日计数=${todayCount}, 任务已停止=${isTaskStopped}, 手动启动标志=${hasManualStartFlag}`);

  // 关键修复：只有在以下情况才执行搜索逻辑
  // 1. 暂停恢复页面（br_msg=Please-Wait）
  // 2. 用户手动启动了任务
  // 3. 有正在运行的任务（今日计数>0且未停止）

  if (isPauseResume) {
    console.log("检测到暂停恢复页面，继续执行搜索逻辑");
  } else if (isTaskManuallyStarted || hasManualStartFlag) {
    console.log("检测到用户手动启动的任务，开始执行搜索逻辑");
    // 清除手动启动标志，避免重复执行
    isTaskManuallyStarted = false;
    clearManualStartFlag();
    // 恢复暂停模式设置
    enable_pause = getPauseMode();
    console.log(`恢复暂停模式设置: ${enable_pause}`);

    // 如果当前在首页，直接执行第一次搜索，不要在这里更新计数器
    if (window.location.href.includes('bing.com') && !isSearchPage) {
      console.log("在首页启动任务，直接执行第一次搜索");
      executeFirstSearch();
      return;
    }
  } else if (hasRunningTask && isSearchPage) {
    console.log("检测到有正在运行的任务，在搜索页面继续执行搜索逻辑");
    // 恢复之前保存的暂停模式
    enable_pause = getPauseMode();
    console.log(`恢复暂停模式设置: ${enable_pause}`);

    // 在搜索结果页面，等待滚动完成后使用随机延迟执行下一次搜索
    console.log("在搜索结果页面，等待滚动完成后使用随机延迟执行下一次搜索");
    continueSearchFromResultPage();
    return; // 提前返回，避免立即执行
  } else if (isSearchPage && todayCount > 0) {
    // 额外检查：如果在搜索页面且有计数，说明任务正在进行
    console.log("在搜索页面检测到任务进行中，继续执行");
    enable_pause = getPauseMode();
    continueSearchFromResultPage();
    return;
  } else {
    console.log("脚本已就绪，等待用户手动启动任务");
    return;
  }

  const randomDelay = config.searchDelay();
  let randomString = generateRandomString(4);
  let randomCvid = generateRandomString(32);

  // 检查是否在暂停等待状态
  if (window.location.href.includes('br_msg=Please-Wait')) {
    todayCount = getTodayCount(); // 重新获取最新的计数
    const remaining = config.maxRewards - todayCount;

    // 从URL参数获取暂停时间，如果没有则使用默认值
    const urlParams = new URLSearchParams(window.location.search);
    const pauseTime = parseInt(urlParams.get('pause_time')) || config.pauseTime;
    const pauseMinutes = Math.round(pauseTime / 60000);

    console.log(`检测到暂停等待状态，当前进度：${todayCount}/${config.maxRewards}，剩余：${remaining}次，等待${pauseMinutes}分钟`);

    // 显示暂停等待状态
    let tt = document.getElementsByTagName("title")[0];
    if (tt) {
      tt.innerHTML = `[${config.platformName}: 暂停等待${pauseMinutes}分钟... ${todayCount}/${config.maxRewards}] Bing`;
    }

    // 显示等待通知和倒计时
    showNotification(`🛡️ ${config.platformName}安全暂停中...\n\n✅ 已完成一轮搜索（5次）\n📊 当前进度：${todayCount} / ${config.maxRewards} 次\n⏰ 暂停时间：${pauseMinutes} 分钟\n\n等待结束后将自动继续搜索`, 'warning');

    // 使用URL参数中的暂停时间
    setTimeout(function () {
      if (isTaskStopped) {
        console.log("任务已停止，取消继续搜索");
        return;
      }

      const currentCount = getTodayCount();

      // 检查是否已完成所有搜索
      if (currentCount >= config.maxRewards) {
        console.log(`${config.platformName}搜索任务已完成！`);
        showNotification(`${config.platformName}搜索任务已完成！已执行 ${currentCount} 次搜索。`, 'success');
        return;
      }

      // 暂停结束后，准备执行下一次搜索
      const nextCount = currentCount + 1;
      let baseWord = search_words[currentCount % search_words.length];
      let searchWord = generateSearchWord(baseWord, nextCount);

      console.log(`暂停等待结束，继续执行第 ${nextCount} 次搜索`);

      // 先更新计数器，然后执行搜索
      saveTodayCount(nextCount);
      executeSearch(currentCount, searchWord, randomString, randomCvid);
    }, pauseTime);
    return;
  }

  // 重新获取今日搜索次数（可能在暂停等待中已更新）
  todayCount = getTodayCount();

  // 检查是否已完成所有搜索
  if (todayCount >= config.maxRewards) {
    console.log(`${config.platformName}搜索任务已完成！已执行 ${todayCount} 次搜索。`);
    clearManualStartFlag(); // 清除手动启动标志
    showNotification(`${config.platformName}搜索任务已完成！已执行 ${todayCount} 次搜索。`, 'success');
    return;
  }

  // 再次检查是否已停止任务
  if (isTaskStopped) {
    console.log("任务已停止，终止执行");
    return;
  }

  console.log("今日已执行次数:", todayCount);
  console.log("剩余搜索次数:", config.maxRewards - todayCount);

  // 注意：搜索逻辑已经在上面的条件分支中处理，这里不需要重复执行

  // 执行首次搜索的函数（从首页启动时使用）
  function executeFirstSearch() {
    const todayCount = getTodayCount();

    // 检查是否已完成所有搜索
    if (todayCount >= config.maxRewards) {
      console.log(`${config.platformName}搜索任务已完成！已执行 ${todayCount} 次搜索。`);
      return;
    }

    // 不再提前更新计数器，只在搜索结果页面加载完成后更新
    // 设置一个标记，表示任务已启动但尚未完成第一次搜索
    sessionStorage.setItem('searchTaskStarted', 'true');
    console.log(`首次搜索：准备执行，当前计数 ${todayCount}`);

    // 添加页面标题更新逻辑（与continueSearchFromResultPage保持一致）
    let tt = document.getElementsByTagName("title")[0];
    const remainingCount = config.maxRewards - todayCount;
    if (tt) {
      tt.innerHTML = `[${config.platformName}: ${todayCount}/${config.maxRewards} | 剩余: ${remainingCount}] ` + tt.innerHTML;
    }

    // 立即执行第一次搜索，不等待，不显示通知
    if (isTaskStopped) {
      console.log("任务已停止，取消搜索");
      return;
    }

    let baseWord = search_words[todayCount % search_words.length];
    let searchWord = generateSearchWord(baseWord, todayCount);
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);

    console.log(`立即执行首次搜索: "${searchWord}"`);
    executeSearch(todayCount, searchWord, randomString, randomCvid);
  }

  // 执行搜索的函数
  function executeSearch(searchCount, searchWord, formString, cvid) {
    if (searchCount < config.maxRewards / 2) {
      location.href = "https://www.bing.com/search?q=" + encodeURI(searchWord) + "&form=" + formString + "&cvid=" + cvid;
    } else {
      location.href = "https://cn.bing.com/search?q=" + encodeURI(searchWord) + "&form=" + formString + "&cvid=" + cvid;
    }
  }

  // 从搜索结果页面继续执行搜索的函数
  function continueSearchFromResultPage() {
    let todayCount = getTodayCount();

    // 检查是否已完成所有搜索
    if (todayCount >= config.maxRewards) {
      console.log(`${config.platformName}搜索任务已完成！已执行 ${todayCount} 次搜索。`);
      clearManualStartFlag();
      return;
    }

    // 更新计数器（因为当前搜索页面已经加载完成，说明搜索已完成）
    const newCount = todayCount + 1;
    saveTodayCount(newCount);
    console.log(`搜索结果页面加载完成，更新计数器 ${todayCount} -> ${newCount}`);

    // 清除任务启动标记
    sessionStorage.removeItem('searchTaskStarted');

    // 更新页面标题显示当前进度
    let tt = document.getElementsByTagName("title")[0];
    const remainingCount = config.maxRewards - newCount;
    if (tt) {
      tt.innerHTML = `[${config.platformName}: ${newCount}/${config.maxRewards} | 剩余: ${remainingCount}] ` + tt.innerHTML;
    }

    // 检查是否需要暂停（从会话存储中获取标记）
    const needPauseAfterSearch = sessionStorage.getItem('needPauseAfterSearch') === 'true';
    const pauseTime = parseInt(sessionStorage.getItem('pauseTime') || config.pauseTime.toString());

    if (needPauseAfterSearch) {
      // 清除暂停标记，避免重复暂停
      sessionStorage.removeItem('needPauseAfterSearch');
      sessionStorage.removeItem('pauseTime');

      console.log(`${config.platformName}已完成第${newCount}次搜索，即将暂停${pauseTime / 60000}分钟...`);
      console.log('正在滚动到页面底部...');

      // 先滚动到底部
      smoothScrollToBottom(() => {
        console.log('页面滚动完成，5秒后跳转到暂停页面...');
        // 滚动完成后延迟5秒再跳转
        setTimeout(() => {
          console.log('开始跳转到暂停页面...');
          location.href = "https://www.bing.com/?br_msg=Please-Wait&pause_time=" + pauseTime;
        }, 5000);
      });
      return; // 重要：暂停时不继续执行下一次搜索
    }

    console.log(`从搜索结果页面准备执行下一次搜索，当前进度: ${newCount}/${config.maxRewards}`);

    // 准备下一次搜索的计数
    const nextCount = newCount + 1;

    // 立即开始随机延迟计时，同时开始滚动（并行进行）
    startDelayAndScroll(newCount, nextCount);
  }

  // 滚动完成后继续搜索的函数
  function startDelayAndScroll(todayCount, newCount) {
    // 立即检查任务状态
    if (isTaskStopped) {
      console.log("任务已停止，取消搜索");
      return;
    }

    // 再次检查是否已完成
    if (todayCount >= config.maxRewards) {
      console.log(`${config.platformName}搜索任务已完成！`);
      return;
    }

    // 准备搜索词
    let baseWord = search_words[todayCount % search_words.length];
    let searchWord = generateSearchWord(baseWord, newCount);
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);

    console.log(`准备执行第${newCount}次搜索: "${searchWord}"`);

    // 先执行滚动和延迟
    const searchDelay = config.searchDelay();
    console.log(`开始随机延迟计时：${searchDelay / 1000}秒后执行第${newCount}次搜索...`);

    // 同时开始滚动（不等待滚动完成）
    console.log(`同时开始页面滚动...`);
    smoothScrollToBottom(); // 滚动和延迟并行进行

    // 延迟时间到后，先检查是否需要暂停
    setTimeout(function () {
      if (isTaskStopped) {
        console.log("任务已停止，取消搜索");
        return;
      }

      // 检查是否需要暂停（在执行搜索之后检查）
      const shouldPause = enable_pause && newCount % 5 === 0 && newCount < config.maxRewards;

      // 先执行搜索，无论是否需要暂停
      console.log(`执行第${newCount}次搜索`);

      // 如果需要暂停，设置一个标记，在搜索结果页面加载后处理暂停
      if (shouldPause) {
        // 设置一个会话存储标记，表示这次搜索后需要暂停
        sessionStorage.setItem('needPauseAfterSearch', 'true');
        sessionStorage.setItem('pauseTime', config.pauseTime.toString());
        console.log(`标记第${newCount}次搜索完成后需要暂停${config.pauseTime / 60000}分钟`);
      }

      // 执行搜索（无论是否需要暂停都先执行搜索）
      executeSearch(todayCount, searchWord, randomString, randomCvid);
      // 注意：executeSearch会立即跳转页面，所以这里不能更新计数器
      // 计数器的更新需要在新页面加载后进行
    }, searchDelay);
  }

  // 实现平滑滚动到页面底部的函数（移动端优化版）
  function smoothScrollToBottom(callback) {
    // callback 是可选参数
    // 移动端需要更长的等待时间，因为搜索结果加载较慢
    const waitTime = isMobile ? 2000 : 1500;

    // 简化等待滚动日志

    setTimeout(() => {
      // 移动端需要更多检查次数和更长间隔
      let checkCount = 0;
      const maxChecks = isMobile ? 10 : 6;
      const checkInterval = isMobile ? 800 : 500;
      let lastHeight = 0;
      let stableCount = 0; // 连续稳定次数

      function checkAndScroll() {
        const currentHeight = document.body.scrollHeight;
        const hasSearchResults = document.querySelector('#b_results, .b_algo, .b_searchboxForm, [data-priority]');

        // 简化滚动检查日志

        // 检查页面高度是否稳定
        if (currentHeight === lastHeight) {
          stableCount++;
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }

        // 满足以下条件之一就开始滚动：
        // 1. 页面高度连续2次稳定且检测到搜索结果
        // 2. 达到最大检查次数
        // 3. 页面高度足够大（说明内容已加载）
        const shouldScroll = (stableCount >= 2 && hasSearchResults) ||
          checkCount >= maxChecks - 1 ||
          currentHeight > 2000;

        if (shouldScroll) {
          // 简化滚动开始日志
          performScroll();
        } else {
          checkCount++;
          setTimeout(checkAndScroll, checkInterval);
        }
      }

      function performScroll() {
        const startPosition = window.pageYOffset;
        const targetPosition = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const distance = targetPosition - startPosition;
        const duration = config.scrollDuration;
        let startTime = null;

        // 简化滚动详情日志

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          const easeInOutQuad = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentPosition = startPosition + (distance * easeInOutQuad);
          window.scrollTo(0, currentPosition);

          if (progress < 1) {
            requestAnimationFrame(animation);
          } else {
            // 简化滚动完成日志

            // 移动端额外滚动一点，确保触发更多内容加载
            if (isMobile && distance > 100) {
              setTimeout(() => {
                window.scrollTo(0, window.pageYOffset + 200);
                // 简化移动端滚动日志
                // 移动端额外滚动完成后调用回调
                if (callback) callback();
              }, 500);
            } else {
              // PC端或滚动距离小的情况，直接调用回调
              if (callback) callback();
            }
          }
        }

        if (distance > 30) { // 进一步降低最小滚动距离阈值
          requestAnimationFrame(animation);
        } else {
          // 简化跳过滚动日志
          // 跳过滚动时也要调用回调
          if (callback) callback();
        }
      }

      // 开始检查
      checkAndScroll();
    }, waitTime);
  }
}